import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { directoryImport } from 'directory-import';
import { Hono, type Handler } from 'hono';

import type { Namespace, Route } from '@/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let modules: Record<string, { route: Route } | { namespace: Namespace }> = {};
let namespaces: Record<
    string,
    Namespace & {
        routes: Record<
            string,
            Route & {
                location: string;
            }
        >;
    }
> = {};

modules = directoryImport({
    targetDirectoryPath: path.join(__dirname, './routes'),
    importPattern: /\.ts$/
}) as typeof modules;

Object.entries(modules)?.forEach(([module, content]) => {
    const namespace = module.split(/[/\\]/)[1];
    if ('namespace' in content) {
        namespaces[namespace] = {
            ...namespaces[namespace],
            ...content.namespace,
            routes: {
                ...namespaces[namespace]?.routes
            }
        };
    } else if ('route' in content) {
        namespaces[namespace] = namespaces[namespace] || { name: namespace, routes: {} };
        const paths = Array.isArray(content.route.path) ? content.route.path : [content.route.path];
        paths.forEach((path) => {
            namespaces[namespace].routes[path] = {
                ...content.route,
                location: module.split(/[/\\]/).slice(2).join('/')
            };
        });
    }
});

export { namespaces };

const app = new Hono();

Object.entries(namespaces).forEach(([namespace, namespaceContent]) => {
    const subApp = app.basePath(`/vodhub/${namespace}`);
    Object.entries(namespaceContent.routes).forEach(([path, route]) => {
        const wrappedHandler: Handler = async (ctx) => {
            if (!ctx.get('data')) {
                if (typeof route.handler !== 'function') {
                    const { route: importedRoute } = await import(
                        `./routes/${namespace}/${route.location}`
                    );
                    route.handler = importedRoute.handler;
                }
                ctx.set('data', await route.handler(ctx));
            }
        };
        if (route.method === 'POST') {
            subApp.post(path, wrappedHandler);
        } else {
            subApp.get(path, wrappedHandler);
        }
    });
});

export default app;
