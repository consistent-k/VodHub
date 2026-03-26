<div align="center">
   <h1>VodNext</h1>
   一个视频源聚合播放器
</div>

## ✨ 功能点

- 📦 支持VodHub标准视频源。
- ⚙️ 提供视频分类、搜索、详情、播放等页面。
- 🐳 支持PC、手机端页面自适应。
- 🌛 支持一键切换至暗黑模式。
- ⚙ 支持自定义网站名称。


#### 首页

![alt text](/docs/images/home.png)

#### 搜索
![alt text](/docs/images/search.png)

#### 播放页
![alt text](/docs/images/play.png)

#### 暗黑模式
![alt text](/docs/images/dark.png)

#### 手机适配
![alt text](/docs/images/mobile.png)


## 🖥 开发环境
环境配置文档： [Docs](https://consistent-k.github.io/docs/environment/nodejs.html)

- Node.js 22+
- PNPM 9+

## ⌨️ 本地启动

```bash
$ git clone git@github.com:consistent-k/VodNext.git
$ cd VodNext
$ pnpm install
$ pnpm dev
```
> 启动成功后访问 http://127.0.0.1:3000/setting 进行配置

## 🔧 配置VodHub接口地址
[一分钟了解VodHub](https://github.com/consistent-k/VodHub)

#### 方式一
本地启动VodHub服务，配置为`/` 即可

#### 方式二
部署后的VodHub地址，配置为 `http://abc.com` 即可


## TODO
- [ ] 支持桌面端
- [ ] 支持安卓端、Tv端
- [ ] 支持更多配置功能
- [ ] AI探索

## 🚨 免责声明

1. 本项目是一个开源的视频播放器，仅供个人合法地学习和研究使用，严禁将其用于任何商业、违法或不当用途，否则由此产生的一切后果由用户自行承担。
2. 本项目不内置任何视频源，也不针对任何特定内容提供源，用户应自行判断视频源的合法性并承担相应责任，开发者对用户获取的的任何内容不承担任何责任。
3. 用户在使用本项目时，必须完全遵守所在地区的法律法规，严禁将本项目服务用于任何非法用途，如传播违禁信息、侵犯他人知识版权、破坏网络安全等，否则由此产生的一切后果由用户自行承担。
4. 用户使用本项目所产生的任何风险或损失(包括但不限于:系统故障、隐私泄露等)，开发者概不负责。用户应明确认知上述风险并自行防范。
5. 未尽事宜，均依照用户所在地区相关法律法规的规定执行。如本声明与当地法律法规存在冲突，应以法律法规为准。
6. 用户使用本项目即视为已阅读并同意本声明全部内容。开发者保留随时修订本声明的权利。本声明的最终解释权归本项目开发者所有。