import type { MiddlewareHandler } from 'hono';

const middleware: MiddlewareHandler = async (ctx, next) => {
    await next();

    // 如果响应体已经被设置（例如通过 c.json()），则直接返回
    if (ctx.res.body) {
        return;
    }

    const data = ctx.get('data');
    ctx.header('Content-Type', 'application/json');
    return ctx.body(JSON.stringify(data));
};

export default middleware;
