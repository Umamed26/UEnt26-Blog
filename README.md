# UEnt26 Blog

一个基于 Astro 的静态个人站，兼顾技术写作、项目展示与站点实验，支持亮色 / 夜间模式切换。

## 主要功能

- Markdown 内容管理：文章（`src/content/posts`）+ 项目（`src/content/projects`）+ Now（`src/content/now`）
- 亮色 / 夜间主题切换（支持本地记忆 + 跟随系统主题）
- 首页三层结构：内容定位、动态流、实验入口
- 全站搜索（文章 + 项目，支持标题 / 摘要 / 标签 / 正文）
- 文章页相关文章推荐（综合标签、分类、系列与项目关联）
- 项目索引页 + 项目详情页
- 个人页面：Now / Projects / Contact / Guestbook
- 标签页、归档页、关于页、404 页
- 归档高级筛选：
  - 按年 / 月 / 日分组
  - 年份、月份、日期筛选
  - 日期区间（起止日）
  - 分类筛选
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

### 文章

在 `src/content/posts` 下新增 Markdown 文件。  
当前 schema（`src/content/config.ts`）要求如下：

- 必填：`title`、`description`、`pubDate`
- 可选：`updatedDate`、`tags`、`category`、`series`、`project`、`draft`、`pinned`、`cover`、`toc`、`hidden`、`unlockCode`、`revealCode`
- 约束：
  - `category` 默认为 `meta`，可选值：`tech` / `game` / `meta`
  - `series` 用于标识系列文章（可选）
  - `project` 用于关联项目 slug（可选）
  - `pinned` 必须是正整数（例如 `1`、`2`）
  - `draft` 默认 `false`
  - `toc` 默认 `true`
  - `hidden` 默认 `false`
  - `hidden: true` 时必须提供 `unlockCode`
  - `revealCode` 用于在文章末尾展示解锁码（可选）

推荐 Frontmatter 示例：

```yaml
---
title: "文章标题"
description: "摘要"
pubDate: 2026-03-03
updatedDate: 2026-03-04
tags: ["astro", "frontend"]
category: "tech"
series: "astro-notes"
project: "uent26-blog"
draft: false
pinned: 1
cover: "/images/cover.jpg"
toc: true
hidden: false
unlockCode: "ALPHA-42"
revealCode: "ALPHA-42"
---
```

### Now

在 `src/content/now` 下维护当前状态页面，默认使用 `src/content/now/current.md`。

- 必填：`title`、`description`、`updatedDate`
- 可选：`focusItems`、`currentItems`、`nextItems`、`quickLinks`
- 说明：
  - `focusItems` 为 `{ title, detail }` 数组
  - `currentItems` / `nextItems` 为字符串数组
  - `quickLinks` 为 `{ label, href }` 数组

### 项目

在 `src/content/projects` 下新增 Markdown 文件。当前项目 schema 要求如下：

- 必填：`title`、`summary`、`status`
- 可选：`stack`、`highlights`、`links`、`updatedDate`、`featured`
- 约束：
  - `status` 可选值：`active` / `maintain` / `plan` / `inactive`
  - `links` 为 `{ label, href }` 数组
  - `featured` 默认为 `false`

推荐 Frontmatter 示例：

```yaml
---
title: "UEnt26 Blog"
summary: "本站本体：文章、项目和实验的统一容器。"
status: "active"
stack: ["Astro", "TypeScript", "Markdown"]
highlights: ["双入口首页", "项目详情页", "文章关联项目"]
links:
  - label: "查看首页"
    href: "/"
updatedDate: 2026-03-07
featured: true
---
```

## 双仓部署（源码仓 + 发布仓）

当前仓库是源码仓，发布仓建议使用：`Umamed26/umamed26.github.io`（用户站，根路径访问）。

### 一次性准备

1. 创建发布仓：`umamed26.github.io`（公开仓库）。
2. 在源码仓 `Settings > Secrets and variables > Actions > Secrets` 新建：
   - `PUBLISH_REPO_TOKEN`
3. `PUBLISH_REPO_TOKEN` 需要能推送到发布仓：
   - 推荐 Fine-grained PAT：只授权发布仓，`Contents: Read and write`
4. 在源码仓 `Settings > Secrets and variables > Actions > Variables` 配置可选公开变量：
   - `PUBLIC_GISCUS_REPO`
   - `PUBLIC_GISCUS_REPO_ID`
   - `PUBLIC_GISCUS_CATEGORY`
   - `PUBLIC_GISCUS_CATEGORY_ID`
   - `PUBLIC_CF_ANALYTICS_TOKEN`

### 自动发布流程

1. 推送源码到本仓库 `main` 分支。
2. GitHub Actions 执行 `.github/workflows/deploy.yml`：
   - 构建参数固定为 `SITE_URL=https://umamed26.github.io`、`BASE_PATH=/`
   - 将 `dist` 自动推送到 `Umamed26/umamed26.github.io` 的 `main` 分支
3. 部署完成后访问：
   - `https://umamed26.github.io/`

### 注意

- 发布仓不需要手动改文件，全部由源码仓工作流覆盖更新。
- 若你的 GitHub 用户名不是 `umamed26`，请把工作流里的仓库地址改成你自己的。
