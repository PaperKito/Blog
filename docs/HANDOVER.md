# PaperKito.github.io 项目交接文档

> 最后更新：2026-10-21（22:18 暂停归档）
> 适用对象：接手维护这个博客站点的开发者（或未来的自己）

> ⏸️ **任务暂停归档**：本阶段改造（去顶栏 / 右下角悬浮坞 / 主题色切换 / 换壁纸 / 萤火虫特效 / 音乐收纳 / 邮箱）已完成代码实现与 dev 预览验证，但**尚未跑过完整 `pnpm build`、尚未 git 提交**。恢复步骤见文末「§9 暂停归档与恢复」。

---

## 1. 项目概览

| 项 | 内容 |
| --- | --- |
| 站点 | PaperKito 个人博客（Firefly 主题深度定制分支） |
| 线上地址 | https://paperkito.github.io |
| 主题上游 | CuteLeaf/Firefly，官方演示 https://firefly.cuteleaf.cn/ ，文档 https://docs-firefly.cuteleaf.cn/ |
| 上游参考仓库 | `D:\Work\Github\Firefly-master`（本机本地，与本项目并排维护，用于对照上游实现） |
| 技术栈 | Astro 7 + Svelte 5 islands + Tailwind CSS v4 + Pagefind 搜索 + Swup 无刷新切页 + Biome |
| 部署 | GitHub Pages（`paperkito.github.io`），构建产物 `dist/` |

站点定位是「个人博客 + 折腾记录」，当前实际启用：首页文章流、文章详情、归档、系列、标签、分类、友链、留言板、关于、打赏、项目展示、相册、书签导航。番组计划 / VNDB / MAL / Bilibili / 动态页在 `siteConfig.pages` 中关闭。

---

## 2. 本地运行

环境要求：Node ≥ 22、pnpm ≥ 9（`preinstall` 会强制校验包管理器）。

```bash
pnpm install
pnpm dev          # 开发服务器，默认 http://localhost:4321/
pnpm build        # 全量构建（图标/LQIP → astro build → 字体子集 → pagefind）
pnpm preview      # 预览生产构建
pnpm check        # astro 诊断
pnpm type-check   # tsc --noEmit
pnpm lint         # biome 检查 + 安全修复
```

### 已知环境坑（重要）

1. **只能用 `127.0.0.1` 访问时**：某些环境下 `astro dev` 只绑定了 IPv6（`[::1]:4321`），`127.0.0.1` 连不上。用 `astro dev --host`（或 `pnpm dev --host`）让它同时监听 IPv4。
2. **沙箱/代理环境没有 pnpm**：直接用仓库本地二进制，例如
   `./node_modules/.bin/astro dev --port 4321 --host`、`./node_modules/.bin/tsc --noEmit`。
3. **Vite 缓存导致 dev 启动失败**：若日志出现 `safe-delete ... node_modules/.vite/deps` 被拦截，手动删掉 `node_modules/.vite/deps` 与 `deps_temp_*` 再重启即可。
4. **删文件/大量改动后 HMR 损坏 Svelte SSR 模块状态**：症状为 `TypeError: Cannot read properties of null (reading 'function')`，堆栈在 `Module.push_element`（Search.svelte 等 SSR 组件），页面被 Astro 错误覆盖层挡住但 HTTP 仍返回 200，误导性很强。非代码问题，清 `node_modules/.vite/deps` 后重启 dev 即愈（2026-10-22 单页化改造时复现一次）。
5. **dev 模式下搜索是假数据**：Pagefind 只在生产构建产物中工作，dev 环境 `Search.svelte` 走内置 mock 结果，属预期行为。
6. 启动时出现 `Proxy environment variables detected` / `punycode DeprecationWarning` 均为无害警告。

---

## 3. 目录结构速览

```
src/
├── config/          # 全部站点配置（改站点先看这里）
├── components/
│   ├── layout/      # 页面骨架：WallpaperSection / SideBar / Footer / NavMenuPanel ...
│   ├── controls/    # 交互控件：SiteDock / DisplaySettingsIntegrated / Search / FloatingControls ...
│   ├── widget/      # 侧边栏挂件：Profile / Announcement / Music / Tags / SidebarTOC ...
│   ├── common/      # 通用组件：FloatingButton / DropdownItem / Icon ...
│   ├── features/    # 特效：MusicPlayer / SakuraEffect / WavesEffect / FontSetup ...
│   └── pages/       # 页面级组件：bangumi / bilibili / gallery / dynamic / AdvancedSearch ...
├── layouts/         # Layout.astro（全局壳）+ MainGridLayout.astro（主体网格布局）
├── pages/           # 路由（全部页面都用 MainGridLayout）
├── styles/          # 样式，入口 main.css；navbar.css / layout-base.css / layout-styles.css 是布局核心
├── utils/           # 工具：setting-utils（本地持久化）/ layout-init / floating-panel-utils ...
├── content/         # Markdown 文章（posts/）、动态、项目
└── constants/       # 生成物：icons.ts、icons-data.json、lqips.json（构建时重新生成）
```

关键链路：`pages/*.astro` → `MainGridLayout.astro` → `Layout.astro`（HTML 壳、主题/壁纸初始化内联脚本）。
`Layout.astro` 里 `initLayout()` 统一初始化 Swup、浮动面板、滚动、图标淡入等。

---

## 4. 核心架构说明

### 4.1 布局模式（壁纸）

由 `backgroundWallpaper.mode` 决定，运行时写到 `<html data-wallpaper-mode>`，**所有布局规则围绕这个属性选择器展开**（`layout-base.css` / `layout-styles.css`）：

| 模式 | 表现 |
| --- | --- |
| `banner`（当前默认） | 顶部 65vh 横幅，内容卡片上压 3.5rem |
| `fullscreen` | 全屏壁纸，内容推到首屏下（classic / hero 两种布局） |
| `overlay` | 壁纸 + 透明卡片 |
| `none` | 纯色背景 |

内容区垂直位置统一由 CSS 变量 `--content-top` 决定，各模式/首页/断点在 `layout-base.css` 中解析。

### 4.2 设置持久化（setting-utils.ts）

所有用户偏好存 localStorage，键名即"接口"，改动前先搜一遍：

| 键 | 含义 |
| --- | --- |
| `theme` | light / dark / system |
| `hue` | 主题色相 0–360 |
| `postListLayout` | list / grid |
| `cardBorderEnabled` / `cardFollowThemeEnabled` | 卡片样式 |
| `wallpaperMode` / `fullscreenLayout` | 壁纸（需 displaySettingsConfig 开对应开关才生效） |
| `overlayOpacity` / `overlayBlur` / `overlayCardOpacity` | 透明模式参数 |
| `wavesEnabled` / `gradientEnabled` / `bannerTitleEnabled` / `bannerCarouselEnabled` / `sakuraEnabled` | 各类特效开关 |

### 4.3 浮动面板机制

`data-floating-panel` + `data-floating-panel-trigger="按钮id"` 声明面板归属；`floating-panel-utils.ts` 负责同步 `inert` / `aria-expanded` / Esc 关闭 / 滚动锁；开合由各组件自己的点击处理切换 `float-panel-closed` 类；点击外部关闭在 `layout-init.ts` 用 `setClickOutsideToClose` 注册。
新增面板时只要沿用这套约定即可，不用重复造轮子。

### 4.4 图标两套体系

- Astro 组件里用 `astro-icon` 的 `<Icon name="material-symbols:xxx" />`（构建时按需打包）。
- Svelte 组件里用 `@/components/common/Icon.svelte`，它只认 **`src/constants/icons-data.json` 这个离线图标子集**——新增 Svelte 侧图标时若子集里没有，会渲染成占位圆圈，需要先重新生成该文件。

---

## 5. 配置入口（src/config/）

| 文件 | 管什么 |
| --- | --- |
| `siteConfig.ts` | 站点标题、主题色默认 hue、页面宽度、导航栏（现仅标题供抽屉用）、文章列表布局、文章页行为 |
| `backgroundWallpaper.ts` | 壁纸模式、壁纸/视频源、横幅文字 |
| `displaySettingsConfig.ts` | 前台显示设置面板各项开关（总开关 `enable`，可用环境变量 `PUBLIC_DISPLAY_SETTINGS` 覆盖） |
| `sidebarConfig.ts` | 左右侧边栏挂件清单与显隐规则 |
| `navBarConfig.ts` | 导航链接结构（顶栏已删，现驱动右下角菜单抽屉） |
| `profileConfig.ts` / `announcementConfig.ts` / `musicConfig.ts` / `commentConfig.ts` | 个人资料 / 公告 / 音乐 / 评论 |
| `pioConfig.ts` / `sponsorConfig.ts` / `friendsConfig.ts` / `booknavConfig.ts` 等 | 看板娘、打赏、友链、书签 |

---

## 6. 本次改动记录（2026-10-21）

**目标：删除顶栏；补齐 Firefly 同款主题色切换。**

### 6.1 删除顶部导航栏

- 删除组件：`components/layout/Navbar.astro`、`components/layout/HeaderTopRow.astro`、`components/controls/LightDarkSwitch.svelte`。
- `MainGridLayout.astro` 不再渲染 `HeaderTopRow`；`Layout.astro` body 类只保留 `is-home`（移除 `sticky-navbar` / `dynamic-navbar`），并移除顶部渐变高光。
- 布局补偿同步从「导航栏占位 5.5rem」改为「1rem」，涉及：
  - `styles/layout-base.css`：`--content-top` 默认值、banner 移动端非首页、overlay/none/fullscreen 非首页；
  - `styles/layout-styles.css`：none/overlay 的 `top` / `min-height`，fullscreen classic 移动端非首页；
  - `styles/markdown.css`：正文锚点 `scroll-margin-top` 默认 1rem；
  - `styles/pages/booknav.css`、`styles/pages/dynamic.css`：锚点偏移 1rem。
- `styles/immersive-reading.css`：沉浸阅读隐藏列表移除死选择器，改为隐藏 `.site-dock`。
- 原导航栏承载的功能（导航、搜索、亮暗、调色盘、音乐、背景视频开关）全部迁移或保底，见下节。

### 6.2 新增右下角悬浮控制坞 SiteDock

新组件 `src/components/controls/SiteDock.astro`，挂在 `FloatingControls` 容器（fixed 右下角）最上方，复用 `FloatingButton` 样式：

| 按钮 | 行为 |
| --- | --- |
| 导航菜单 | 打开全屏抽屉 `NavMenuPanel`（原仅移动端有触发器，现在全端可用） |
| 搜索 | 按需加载 Pagefind 后弹出坞内搜索面板 |
| 调色盘 | 打开显示设置面板：主题色相滑杆、文章列表布局、卡片样式 |
| 太阳/月亮 | 亮色 / 暗色 / 跟随系统 三选面板，图标随实际模式实时切换 |
| 播放/暂停 | 背景视频开关（`backgroundWallpaper.playerEnable` 开启时显示，移动端隐藏） |

实现要点：
- 坞内弹出面板统一由 SiteDock 的 scoped 样式锚定到按钮上方（覆盖 `.float-panel` 默认 `top-21`）；用 `:not(.float-panel-closed)` 限定 pointer-events，避免未分层样式压过关闭态。
- `Search.svelte` 改造：删掉导航栏形态的桌面搜索框，输入框并入弹出面板，单关键词状态；`data-floating-panel-trigger="search-switch"`。
- `DisplaySettingsIntegrated.svelte` 面板 `right-4` → `right-0` 适配坞内锚定。
- Pagefind 按需加载脚本（`window.__loadPagefind`）从 Navbar 迁移到 `Layout.astro`（`data-swup-ignore-script`，切页不重跑）。

### 6.3 开启主题色切换

- `displaySettingsConfig.ts`：`enable: true`，外观 + 壁纸 + 特效三组开关全开（对齐上游 Firefly 完整体验：主题色、列表布局、卡片样式、壁纸模式、全屏布局、透明/模糊/卡片透明度滑块、横幅设置、樱花）。
- 代价：壁纸模式可切换会让构建期打包各模式内容，约 +33 KB/页；如后续要瘦身，优先关 `wallpaperModeSwitchable`（其余外观项很轻）。
- 入口即 6.2 的调色盘按钮；色相持久化键 `hue`，`--hue` CSS 变量驱动全站主题色。

### 6.4 其他清理

- 删除组件后同步更新 `src/components/README.md` 组件清单（顺手清掉 3 个文档里有、实际不存在的幽灵条目）。
- `global.d.ts` 中 pagefind 注释指向从 `Navbar.astro` 改为 `Layout.astro`。

### 6.5 壁纸更换与去 Firefly 化命名（2026-10-21 晚）

- **换横幅背景**：删除 `DesktopWallpaper/d1-d6.avif`、`MobileWallpaper/m1-m6.avif`，改用 Wallpaper Engine 创意工坊 item `3517697436` 提取的主图（8K jpg → sharp 压缩：桌面 2560w/264KB、移动 1280w/94KB），配置改为单图 `banner.webp`；`src/constants/lqips.json` 已用 `pnpm lqips` 重新生成。
- **资源重命名**：`public/favicon/firefly-*.png` → `paperkito-*.png`；`assets/images/logo/firefly-light|dark.png` → `logo-light|dark.png`（siteConfig 同步改）。
- **站点命名**：`package.json` name → `paperkito-blog`；siteConfig 关键词去掉 Firefly/Fuwari、navbar.title → PaperKito；RSS/Atom generator → PaperKito；SiteInfo 挂件默认值去 Firefly 化；横幅文案改为中文（title "PaperKito" + 4 条中文副标题打字机轮播）。
- **README 重写**：根目录 README.md / README.en.md 从"主题宣传"改为"个人博客自述"，保留致谢与授权。
- **相册重命名**：`public/gallery/firefly-2026` → `photos-2026`（galleryConfig id/name/description 同步中文化），**旧相册 URL 已失效**。
- **刻意保留的出处标注**（主题作者要求 + 授权合规，非遗漏）：
  - `Footer.astro` 的 "Powered by Astro & Firefly"（组件注释明确要求勿删）
  - `navBarConfig` / `booknavConfig` / `friendsConfig` 中指向 upstream 的文档与友链条目
  - 代码注释与内部标识符（`__fireflyMusic`、`firefly-mdx.ts`、`public/pio/models/spine/firefly/` 等不可见内容）
- 若后续想去掉页脚出处标注，只改 `src/components/layout/Footer.astro` 一处即可。

### 6.6 兼容性注意

- `siteConfig.navbar.*` 配置大部分已闲置，仅 `navbar.title` 仍被菜单抽屉用作标题；后续如重构可直接瘦身该配置块。
- `config/index.ts` 仍导出 `navbarMode`（`scroll-utils` 在用），无导航栏时逻辑自动空转，不要误删。
- `navbar.css` 中大量 `#navbar` 规则已成为死代码，但其中 `.dropdown-content/.float-panel` 的毛玻璃规则仍被抽屉和设置面板使用，**暂勿整文件删除**。

---

## 7. 已知问题 / 待办

1. `pnpm check`（astro check）有 1 个**既有**报错，与本次改动无关：`src/components/features/FontSetup.astro:66` `cssVariable={cssVar as any}` 类型不兼容。要清零需单独修 FontSetup 的字体变量类型，暂未动以避免无关 churn。
2. **尚未跑过完整 `pnpm build`**：本次仅做了 dev 预览 + `tsc` + `astro check`。合并前建议在本地跑一次全量构建，重点看：图标子集是否需要重新生成、构建体积变化、pagefind 输出。
3. `biome check` 有 2 个**既有**格式偏差（`src/config/siteConfig.ts` 的 description 缩进、另一文件 import 换行），非本次引入；要统一跑 `pnpm format` 时注意会带上无关 churn。
4. 视觉走查清单（建议在 127.0.0.1:4321 过一遍）：首页横幅与内容卡片重叠、文章页目录/悬浮控件避让、移动端汉堡抽屉、调色盘弹层不超出视口、暗色模式全站对比度。

---

## 8. 给接手者的快速上手路径

1. `pnpm install && pnpm dev --host`，开 http://127.0.0.1:4321/。
2. 首页右下角逐个点：导航抽屉 → 搜索 → 调色盘（拖色相）→ 亮暗切换。
3. 想改内容：`src/content/posts/*.md`（`pnpm new-post` 脚手架）；想改外观：`src/config/siteConfig.ts` 与 `backgroundWallpaper.ts`。
4. 对照上游行为：开 `D:\Work\Github\Firefly-master` 或线上 demo https://firefly.cuteleaf.cn/。
5. 提交前：`pnpm check`、`pnpm type-check`，UI 改动附截图。

---

## 9. 暂停归档与恢复（2026-10-21 22:18）

本阶段改造在推进到「代码完成 + dev 预览验证」后暂停。以下为归档快照与恢复指引。

### 9.1 本阶段已完成（代码 + dev 预览验证）

- **删除顶栏**：`Navbar.astro` / `HeaderTopRow.astro` / `LightDarkSwitch.svelte` 已删，相关布局补偿已做（见 §6.1）。
- **右下角悬浮控制坞 SiteDock**：导航抽屉 / 搜索 / 调色盘 / 亮暗 / 背景视频 / 音乐收纳 全部收进坞（见 §6.2）。
- **主题色切换开启**：`displaySettingsConfig.enable = true`，外观 / 壁纸 / 特效三组开关全开（见 §6.3）。
- **壁纸更换 + 去 Firefly 化**：改用 Wallpaper Engine item `3517697436` 提取主图，站点命名统一为 PaperKito（见 §6.5）。
- **壁纸显示模式可切换**：banner / fullscreen / overlay / none 四模式由 `data-wallpaper-mode` 驱动，已在显示设置面板开放。
- **横幅英文介绍**：中间介绍文案改回英文。
- **音乐更换 + 收纳**：`musicConfig` 改为本地 `缘纺祈系.mp3`，播放入口收进 SiteDock 的收纳面板（首次交互后初始化，设计如此，非 bug）。
- **萤火虫特效**：新增 `src/components/features/FireflyEffect.astro`（主线程 canvas 粒子，支持 `prefers-reduced-motion`），`effectsConfig.fireflyConfig` 提供开关 / 数量 / 速度 / 颜色；显示设置「特效」Tab 内新增萤火虫开关。
- **邮箱**：`profileConfig.links` 新增 `gik671@outlook.com`（mailto，主题反爬编码渲染）。

### 9.2 已验证（dev 预览 + 无头浏览器截图）

- `tsc --noEmit` 通过（仅既有 `FontSetup.astro` 类型报错，与本次无关）。
- 本地 dev（4321，`--host`）HTTP 200。
- CDP 截图确认生效：暗色模式、调色盘弹层、overlay 模式、导航抽屉、萤火虫渲染、音乐坞收纳面板（截图留在 `.screenshots/`，已加 gitignore，不进仓库）。
- 萤火虫实际渲染的依赖优化坑已定位：Vite deps 过期需清 `node_modules/.vite/deps` 后重启 dev（见 §2-3）。

### 9.3 待办 / 恢复时必须补完

1. **跑一次完整 `pnpm build`**（重点：图标子集是否需重生成、`pnpm lqips` 是否已跑、构建体积、pagefind 输出）。本阶段只做了 dev 预览。
2. `biome check` 既有格式偏差（`siteConfig.ts` description 缩进等）可顺手清，但会带无关 churn。
3. 视觉走查清单（§7-4）在真实浏览器过一遍。
4. **强烈建议 git 提交**：当前 `src/`、`public/`、`package.json` 等 26 个核心条目仍为未跟踪（`??`），仅本地工作区，有误删 / 丢失风险。提交前先确认 `.gitignore` 已含 `.screenshots/`、`node_modules/`、`dist/`、`.astro/`。

### 9.4 暂停时的环境状态

- 后台 dev server 已停止（端口 4321 监听已释放，约 3.4 GB 内存已归还）。
- `.screenshots/` 内临时验证脚本（`cdp-verify.mjs` / `diag.mjs` / `debug2.mjs` / `verify2.mjs` / `scripts-dump.mjs`）已删除；验证截图保留；Edge 浏览器缓存目录（`edge-profile*`）因本环境回收站机制删除失败，已加 gitignore 故不污染仓库，可后续手动清理或在恢复时重建（重建会自动覆盖）。
- `.gitignore` 已补充 `.screenshots/`。
