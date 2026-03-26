/**
 * 省略指定的请求头
 *
 * @param headers - 原始请求头对象，键是请求头名称，值是请求头值。
 * @param keys - 要清除的请求头名称，可以是单个名称或名称数组，不区分大小写。
 * @returns 返回一个新的请求头对象，已移除指定的请求头。
 */
export const omitHeaders = (headers: Record<string, string>, keys: string | string[]) => {
    const newHeaders = {};
    for (const [key, value] of Object.entries(headers ?? {})) {
        if (!keys.includes(key.toLowerCase())) {
            newHeaders[key] = value;
        }
    }
    return newHeaders;
};
