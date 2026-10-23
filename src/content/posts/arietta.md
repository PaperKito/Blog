---
title: "Arietta：为库洛游戏补上缺失的那一块"
published: 2026-10-22
updated: 2026-10-22
pinned: true
description: "Arietta 是面向 Kuro Games 旗下 PC 作品的第三方启动器，支持鸣潮与战双帕弥什，内置游戏时长统计、截图管理、账号切换与 KuroBBS 社区，MIT 协议开源。"
tags: [Arietta, 开源项目, 鸣潮, 战双帕弥什, CSharp]
category: 项目
author: PaperKito
lang: zh-CN
licenseName: "MIT"
licenseUrl: "https://github.com/PaperKito/Arietta/blob/main/LICENSE"
sourceLink: "https://github.com/PaperKito/Arietta"
comment: true
---

Arietta 是一个第三方游戏启动器，服务于 Kuro Games 旗下的 PC 作品——目前覆盖《鸣潮》与《战双帕弥什》。

它想做的事只有一件：**把官方启动器缺的那部分补上。**

## 名字

Arietta 来自意大利语 *arietta*，是 *aria*（咏叹调）的指小词，意思是"一首小咏叹调"；这个词同时也有"一阵微风"的意思。

轻，不喧宾夺主——启动器本来就该是这样。

> [!NOTE]
> Arietta 是非商业的社区项目，与 Kuro Games 及 bilibili 没有隶属关系，游戏及其素材版权归各自所有者。

## 特性

启动器该有的基础能力之外，我按自己的实际需求加了一些东西：

- **游戏时长统计** —— 记录你到底在提瓦特……咳，在索拉里斯呆了多久
- **截图管理** —— 游戏截图集中收纳，不用再去文件夹里翻
- **账号切换** —— 多账号来回横跳，一次配置
- **KuroBBS 社区** —— 社区入口直接内嵌

还有些别的，留给你自己探索。

## 安装

发布包是便携版 zip：解压，双击 `Arietta.exe` 就完事。所有数据默认存放在 exe 同级目录下的 `Arietta\` 文件夹里——**整个文件夹搬走，就算迁移完成。**

> [!TIP]
> 换电脑、重装系统时，把这个文件夹拷过去即可，不需要重新配置。

### 系统要求

| 项目 | 要求 |
| --- | --- |
| 操作系统 | Windows 10 1809（build 17763）及以上，x64 |
| 运行时 | [.NET 10](https://dotnet.microsoft.com/download/dotnet/10.0) —— 便携版不是自包含构建，选 **Desktop Runtime** 最稳妥 |
| WebView2 | [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2) |
| 图像扩展 | [WebP Image Extensions](https://apps.microsoft.com/detail/9pg2dk419drg) |
| 可选 | 在 Windows 设置里开启**透明效果**与**动画效果**，观感最好 |

从 [GitHub Releases](https://github.com/PaperKito/Arietta/releases) 下载对应平台的压缩包，解压运行 `Arietta.exe`，跟着提示走就行。

## 数据与隐私

这一条我挺在意的，所以写清楚：

- 数据默认**只留在你自己的机器上**；只有你主动配置了 WebDAV，才会发生云端同步
- 本项目**不运行任何自有服务器** —— KuroBBS 的登录态与抽卡链接，只在你本机和官方端点之间流通

换句话说，没有遥测，没有中间人，没有"我们收集您的使用数据以改善体验"。

## 开发

本地构建需要最新版 Visual Studio，并勾选以下工作负载：

- .NET 桌面开发
- 使用 C++ 的桌面开发
- 通用 Windows 平台开发

代码在 [GitHub](https://github.com/PaperKito/Arietta)，issue 和 PR 都开着。

## 致谢

- 部分 UI 结构与属性命名参考了 [Starward](https://github.com/Scighost/Starward)（MIT），很棒的项目
- 其余 NuGet 依赖列在 `src/Arietta.csproj`

## 许可

[MIT](https://github.com/PaperKito/Arietta/blob/main/LICENSE)。

用得顺手的话，可以[赞助一下开发](https://paperkitoblog-dpbyupmog00q.edgeone.dev/sponsor/)。
