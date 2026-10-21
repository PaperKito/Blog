---
title: "项目名占位"
published: 2026-10-21
draft: false
order: 1
status: planning
description: "在这里写项目的一句话介绍，会显示在卡片里。删除本文件前请先把上面那个示例换成你的真实项目。"
image: ""
tags:
  - "占位"
  - "模板"
link:
  - label: "仓库"
    icon: "fa7-brands:github"
    value: "https://github.com/PaperKito"
  - label: "演示"
    icon: "material-symbols:open-in-new"
    value: "https://paperkito.github.io"
---

这是项目条目模板，覆盖了全部 frontmatter 字段：

- `title`：项目名（必填）
- `published`：发布日期（必填）
- `status`：planning / developing / published / archived，显示为封面右上角徽标
- `description`：一句话介绍
- `image`：封面图路径，留空则显示占位图标。可放 `src/content/projects/同目录/cover.png` 后写相对路径，或写 public 下的绝对路径
- `tags`：标签数组（首页卡片不展示，仅供搜索/备用）
- `link`：底部外链按钮，`label` 必填，`icon` 可留空（自动取首字母）
