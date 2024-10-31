<div align="center">
   <h1>VodHub</h1>
   一个电影、电视剧、动漫等视频接口聚合服务。
</div>


## ✨ 功能点

- 📦 开箱即用的接口服务。
- ⚙️  内置多个视频源，支持分类、搜索、详情、播放等功能。
- 🛡 使用 TypeScript 开发，保持输出接口的一致性。
- 📚 提供可直接部署的Docker镜像。

## 🖥 开发环境
环境配置文档： [Docs](https://consistent-k.github.io/docs#/environment/nodejs)

- Node.js 22+
- PNPM 9+

## ⌨️ 本地启动

```bash
$ git clone git@github.com:consistent-k/VodHub.git
$ cd VodHub
$ pnpm install
$ pnpm dev
```

## 🔧 如何使用接口
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

## 💾 使用Docker部署
> 请确保已经安装了Docker环境并且配置了DockerHub的镜像加速器。

```bash
$ docker pull consistentlee/vod_hub:latest
$ docker run -d -p 8888:8888 consistentlee/vod_hub:latest
```

## 🤝 参与共建 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[贡献指南](./CONTRIBUTING.md)
