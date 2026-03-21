import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { directoryImport } from 'directory-import';
import { Hono, type Handler } from 'hono';

import type { Namespace, Route } from '@/types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let modules: Record<string, { route: Route } | { routes: Route[] } | { namespace: Namespace }> = {};
const namespaces: Record<
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
    targetDirectoryPath: path.join(__dirname, './'),
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
    } else if ('routes' in content) {
        namespaces[namespace] = namespaces[namespace] || { name: namespace, routes: {} };
        const routeLocation = module.split(/[/\\]/).slice(2).join('/');
        content.routes.forEach((route: Route) => {
            const paths = Array.isArray(route.path) ? route.path : [route.path];
            paths.forEach((p) => {
                namespaces[namespace].routes[p] = {
                    ...route,
                    location: routeLocation
                };
            });
        });
    } else if ('route' in content) {
        namespaces[namespace] = namespaces[namespace] || { name: namespace, routes: {} };
        const paths = Array.isArray(content.route.path) ? content.route.path : [content.route.path];
        paths.forEach((p) => {
            namespaces[namespace].routes[p] = {
                ...content.route,
                location: module.split(/[/\\]/).slice(2).join('/')
            };
        });
    }
});

export { namespaces };

const app = new Hono();

Object.entries(namespaces).forEach(([namespace, namespaceContent]) => {
    const subApp = app.basePath(`/${namespace}`);
    Object.entries(namespaceContent.routes).forEach(([routePath, route]) => {
        const wrappedHandler: Handler = async (ctx) => {
            if (!ctx.get('data')) {
                if (typeof route.handler !== 'function') {
                    const mod = await import(`./routes/${namespace}/${route.location}`);
                    const imported = mod.default ?? mod;
                    route.handler = Array.isArray(imported) ? imported.find((r: Route) => r.name === route.name)?.handler : imported.handler;
                }
                ctx.set('data', await route.handler(ctx));
            }
        };
        if (route.method === 'POST') {
            subApp.post(routePath, wrappedHandler);
        } else {
            subApp.get(routePath, wrappedHandler);
        }
    });
});

export default app;
