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

> 以下示例中的 `{{vod_site}}` 为视频源的名称，如 `tiantian`、`360kan` 等。


```bash
# 获取目前支持视频源名称列表
curl --location --request GET 'http://localhost:8888/vodhub/api/namespace'
```


```bash
# 通过首页获取分类
curl --location --request GET 'http://localhost:8888/vodhub/{{vod_site}}/home'
```

```bash
# 按分类获取视频列表
curl --location --request POST 'http://localhost:8888/vodhub/{{vod_site}}/category' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 1,
    "page":1,
    "filters": {}
}'
```

```bash
# 获取详情 {{vod_id}} 由分类、搜索等接口返回的数据中获取
curl --location --request POST 'http://localhost:8888/vodhub/{{vod_site}}/detail' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": "{{vod_id}}",
}'
```

```bash
# 获取播放地址 url 和 parse_urls 由详情接口返回的数据中获取
curl --location --request POST 'http://localhost:8888/vodhub/{{vod_site}}/play' \
--header 'Content-Type: application/json' \
--data-raw '{
   "url": "",
   "parse_urls": []
}'
```


```bash
# 关键词搜索
curl --location --request POST 'http://localhost:8888/vodhub/{{vod_site}}/search' \
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
