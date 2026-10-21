# PaperKito 的个人博客

基于 Astro 的静态个人博客，记录技术折腾、开发与日常思考。

线上地址：<https://paperkito.github.io>

## 技术栈

- [Astro](https://astro.build/) 7 — 静态站点生成
- Svelte 5 — 交互岛屿组件
- Tailwind CSS v4 — 样式
- [Pagefind](https://pagefind.app/) — 静态全文搜索
- Swup — 无刷新页面切换
- Biome — 代码格式化与检查

## 本地开发

环境要求：Node ≥ 22、pnpm ≥ 9。

```bash
pnpm install
pnpm dev            # 开发服务器，默认 http://localhost:4321/
pnpm build          # 全量构建（产物在 dist/）
pnpm preview        # 预览生产构建
pnpm check          # Astro 诊断
pnpm type-check     # TypeScript 检查
```

> 某些环境下 `astro dev` 只监听 IPv6，用 `127.0.0.1` 访问不了时加 `--host`：
> `pnpm dev --host`。

## 部署

GitHub Pages，推送后由 CI 构建部署；也可以把 `dist/` 丢到任何静态托管。

## 目录结构

```
src/
├── config/       # 站点配置（siteConfig / backgroundWallpaper / sidebarConfig ...）
├── components/   # 组件（layout / controls / widget / features / pages ...）
├── layouts/      # Layout.astro（全局壳）+ MainGridLayout.astro（主体布局）
├── pages/        # 路由
├── styles/       # 样式，入口 main.css
├── content/      # Markdown 文章（posts/）
└── utils/        # 工具函数（设置持久化 / 布局 / 搜索 ...）
docs/HANDOVER.md  # 项目交接文档（架构说明与维护指南）
```

## 常用修改入口

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题 / 简介 / 主题色 | `src/config/siteConfig.ts` |
| 横幅壁纸 / 横幅文案 / 背景视频 | `src/config/backgroundWallpaper.ts` |
| 前台可切换的设置项（主题色等） | `src/config/displaySettingsConfig.ts` |
| 侧边栏挂件 | `src/config/sidebarConfig.ts` |
| 导航菜单（右下角抽屉） | `src/config/navBarConfig.ts` |
| 写文章 | `src/content/posts/*.md`（`pnpm new-post` 脚手架） |
| 换横幅背景图 | 图片放进 `src/assets/images/DesktopWallpaper/`、`MobileWallpaper/`，再改 `backgroundWallpaper.ts` 的 `src` |

## 界面说明

- 顶部无导航栏；站点级操作集中在**右下角悬浮控制坞**：导航菜单（全屏抽屉）、搜索、主题色（调色盘）、亮/暗模式、背景视频开关
- 主题色、亮暗模式、文章列表布局等偏好存 localStorage，换设备不互通

## 致谢与授权

本站基于 [Firefly](https://github.com/CuteLeaf/Firefly) 主题（MIT License，Copyright (c) 2024 saicaca / 2025 CuteLeaf）定制开发，感谢原作者。主题源码中的出处标注（页脚 "Powered by Astro & Firefly" 等）按主题要求保留。

详细架构与维护交接信息见 [docs/HANDOVER.md](docs/HANDOVER.md)。
