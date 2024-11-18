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
[![Docker Image Version](https://img.shields.io/docker/v/consistentlee/vod_hub?color=%23086DCD&label=docker%20image)](https://hub.docker.com/r/consistentlee/vod_hub)

> 请确保已经安装了Docker环境并且配置了DockerHub的镜像加速器。

```bash
$ docker run -d -p 8888:8888 consistentlee/vod_hub:latest
```

## 🤝 参与共建 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[贡献指南](./CONTRIBUTING.md)


## 🚨 免责声明

1. 本项目(VodHub)是一个开源的视频聚合接口服务，仅供个人合法地学习和研究使用，严禁将其用于任何商业、违法或不当用途，否则由此产生的一切后果由用户自行承担。
2. 本项目仅转换已有视频网站接口为标准统一输出。本项目不直接提供视频源，也不针对任何特定内容提供源，用户应自行判断视频源的合法性并承担相应责任，开发者对用户获取的的任何内容不承担任何责任。
3. 用户在使用本项目时，必须完全遵守所在地区的法律法规，严禁将本项目服务用于任何非法用途，如传播违禁信息、侵犯他人知识版权、破坏网络安全等，否则由此产生的一切后果由用户自行承担。
4. 用户使用本项目所产生的任何风险或损失(包括但不限于:系统故障、隐私泄露等)，开发者概不负责。用户应明确认知上述风险并自行防范。
5. 未尽事宜，均依照用户所在地区相关法律法规的规定执行。如本声明与当地法律法规存在冲突，应以法律法规为准。
6. 用户使用本项目即视为已阅读并同意本声明全部内容。开发者保留随时修订本声明的权利。本声明的最终解释权归本项目开发者所有。