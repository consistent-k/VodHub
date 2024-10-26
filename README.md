<h1 align="center">VodHub</h1>

## 介绍
VodHub是一个视频采集聚合服务。

## 如何启动
```bash
# 安装依赖
pnpm install

# 启动服务
pnpm dev
```

## 如何使用接口
```bash
# 通过首页获取分类
curl --location --request GET 'http://localhost:8888/vodhub/tiantian/home'

# 按分类获取视频列表
curl --location --request POST 'http://localhost:8888/vodhub/tiantian/category' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "page":1,
    "filters": {}
}'

# 获取详情
curl --location --request POST 'http://localhost:8888/vodhub/tiantian/detail' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "54879"
}'

# 获取播放地址
curl --location --request POST 'http://localhost:8888/vodhub/tiantian/play' \
--header 'Content-Type: application/json' \
--data-raw '{
   "url": "https://vip.ffzy-video.com/20240926/3057_c1502ae5/index.m3u8",
   "parse_urls": [
      "http://43.248.187.19:88/jiexi/?url="
   ]
}'

# 关键词搜索
curl --location --request POST 'http://localhost:8888/vodhub/tiantian/search' \
--header 'Content-Type: application/json' \
--data-raw '{
   "page": 1,
   "keyword": "钢铁侠"
}'

```

## 后续计划
- [ ] 支持更多的视频源
- [ ] 开发前端展示页面
