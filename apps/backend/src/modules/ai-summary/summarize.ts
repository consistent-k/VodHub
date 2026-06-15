import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';
import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';

import { config } from '@/config';
import logger from '@/utils/logger';

const summarizeApp = new Hono();

interface SummarizeBody {
    title: string;
    content: string;
    year?: string;
    area?: string;
    actor?: string;
    director?: string;
}

const SYSTEM_PROMPT = `你是一个专业的影视内容分析师。请根据用户提供的影视信息，生成一份简洁、有条理的内容总结。

要求：
1. 使用中文回答
2. 总结应包含：剧情概要、主要角色、看点推荐
3. 语言流畅自然，避免剧透关键转折
4. 使用 Markdown 格式，适当使用标题、加粗、列表等
5. 总结控制在 300-500 字以内`;

function buildUserPrompt(data: SummarizeBody): string {
    const parts = [`**片名**：${data.title}`];
    if (data.year) parts.push(`**年份**：${data.year}`);
    if (data.area) parts.push(`**地区**：${data.area}`);
    if (data.director) parts.push(`**导演**：${data.director}`);
    if (data.actor) parts.push(`**主演**：${data.actor}`);
    parts.push(`\n**剧情简介**：\n${data.content}`);
    parts.push('\n请根据以上信息生成内容总结。');
    return parts.join('\n');
}

summarizeApp.post('/', async (ctx) => {
    const { apiKey, baseURL, model } = config.ai;

    if (!apiKey) {
        return ctx.json({ code: -1, message: 'AI 服务未配置', data: null }, 500);
    }

    let body: SummarizeBody;
    try {
        body = await ctx.req.json<SummarizeBody>();
    } catch {
        return ctx.json({ code: -1, message: '请求参数错误', data: null }, 400);
    }

    if (!body.title || !body.content) {
        return ctx.json({ code: -1, message: '缺少必要参数', data: null }, 400);
    }

    logger.info(`AI 总结请求 - ${body.title}`);

    const provider = createOpenAICompatible({
        name: 'ai-summary',
        baseURL: baseURL || 'https://api.openai.com/v1',
        apiKey
    });

    ctx.header('Content-Type', 'text/event-stream');
    ctx.header('Cache-Control', 'no-cache');
    ctx.header('Connection', 'keep-alive');
    ctx.header('X-Accel-Buffering', 'no');

    return streamSSE(ctx, async (stream) => {
        try {
            const result = streamText({
                model: provider(model),
                system: SYSTEM_PROMPT,
                prompt: buildUserPrompt(body)
            });

            for await (const chunk of result.textStream) {
                await stream.writeSSE({ data: JSON.stringify(chunk), event: 'chunk' });
            }

            await stream.writeSSE({ data: '[DONE]', event: 'done' });
        } catch (error) {
            logger.error(`AI 总结错误 - ${body.title} - ${error}`);
            await stream.writeSSE({
                data: JSON.stringify({ error: 'AI 总结生成失败' }),
                event: 'error'
            });
        }
    });
});

export default summarizeApp;
