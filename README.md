# UEnt26 Blog

基于 Astro 的纯前端个人博客模板，默认浅色编辑风格，支持亮/暗主题切换，内容优先布局。

## 功能

- Markdown 内容管理（`src/content/posts`）
- 亮色 / 夜间主题切换（记忆用户偏好）
- 编辑感视觉系统（内容优先布局）
- Shiki `github-dark` 代码高亮
- 文章详情、标签、分页、归档、关于页
- RSS (`/rss.xml`) 与 Sitemap (`/sitemap-index.xml`)
- Giscus 评论（可选）
- Cloudflare Web Analytics（可选）
- GitHub Pages 自动部署工作流

## 快速开始

```bash
npm install
npm run dev
```

## 环境变量

复制 `.env.example` 为 `.env` 并按需配置：

- `SITE_URL`: 站点完整地址，如 `https://yourname.github.io`
- `BASE_PATH`: 子路径部署时设置，如 `/repo-name`
- `PUBLIC_GISCUS_REPO`
- `PUBLIC_GISCUS_REPO_ID`
- `PUBLIC_GISCUS_CATEGORY`
- `PUBLIC_GISCUS_CATEGORY_ID`
- `PUBLIC_CF_ANALYTICS_TOKEN`

## 写文章

在 `src/content/posts` 下新增 Markdown 文件，Frontmatter 示例：

```yaml
---
title: "文章标题"
description: "摘要"
pubDate: 2026-03-03
updatedDate: 2026-03-04
tags: ["astro", "frontend"]
draft: false
pinned: 1
cover: "/images/cover.jpg"
toc: true
---
```

## 构建与预览

```bash
npm run build
npm run preview
```

## 部署到 GitHub Pages

1. 将代码推送到 `main` 分支。
2. 在仓库设置中开启 `GitHub Pages`，Source 选择 `GitHub Actions`。
3. 在仓库 `Settings > Secrets and variables > Actions > Variables` 中配置可选变量（Giscus/统计）。
4. 推送后工作流会自动构建并部署。
