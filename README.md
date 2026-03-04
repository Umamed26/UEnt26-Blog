# UEnt26 Blog

一个基于 Astro 的前端静态博客模板，默认内容优先的编辑风格，支持亮色/夜间模式切换。

## 主要功能

- Markdown 内容管理（`src/content/posts`）
- 亮色 / 夜间主题切换（支持本地记忆 + 跟随系统主题）
- 首页精选卡片 + 分页列表
- 标签页、归档页、关于页、404 页
- 归档高级筛选：
  - 按年 / 月 / 日分组
  - 年份、月份、日期筛选
  - 日期区间（起止日）
  - 多标签筛选（AND / OR）
  - 关键词、排序、仅看更新
- Shiki 代码高亮
- RSS（`/rss.xml`）与 Sitemap（`/sitemap-index.xml`）
- Giscus 评论（可选）
- Cloudflare Web Analytics（可选）
- GitHub Pages 自动部署工作流

## 快速开始

```bash
npm install
npm run dev
```

## 常用命令

```bash
# 本地开发
npm run dev

# 生产构建
npm run build

# 构建产物预览
npm run preview
```

## 环境变量

复制 `.env.example` 为 `.env`，按需填写：

- `SITE_URL`：站点完整地址，例如 `https://yourname.github.io`
- `BASE_PATH`：子路径部署时使用，例如 `/repo-name`
- `PUBLIC_GISCUS_REPO`
- `PUBLIC_GISCUS_REPO_ID`
- `PUBLIC_GISCUS_CATEGORY`
- `PUBLIC_GISCUS_CATEGORY_ID`
- `PUBLIC_CF_ANALYTICS_TOKEN`

## 内容写作

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

## 部署到 GitHub Pages

1. 推送代码到 `main` 分支。
2. 在仓库 `Settings > Pages` 中将 Source 设为 `GitHub Actions`。
3. 在 `Settings > Secrets and variables > Actions` 中配置可选变量（评论/统计）。
4. 后续推送会触发工作流自动构建并部署。
