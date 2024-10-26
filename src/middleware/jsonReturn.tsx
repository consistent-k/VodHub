import type { MiddlewareHandler } from 'hono';

const middleware: MiddlewareHandler = async (ctx, next) => {
    await next();
    const data: any = ctx.get('data');
    ctx.header('Content-Type', 'application/json');
    return ctx.body(JSON.stringify(data));
};

export default middleware;
