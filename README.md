# UEnt26 Blog

一个基于 Astro 的前端静态博客模板，默认内容优先的编辑风格，支持亮色/夜间模式切换。

## 主要功能

- Markdown 内容管理（`src/content/posts`）
- 亮色 / 夜间主题切换（支持本地记忆 + 跟随系统主题）
- 首页精选卡片 + 分页列表
- 全站搜索（标题 / 摘要 / 标签 / 正文）
- 文章页相关文章推荐（基于标签相关度）
- 个人页面：Now / Projects / Contact / Guestbook
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

在 `src/content/posts` 下新增 Markdown 文件。  
当前 schema（`src/content/config.ts`）要求如下：

- 必填：`title`、`description`、`pubDate`
- 可选：`updatedDate`、`tags`、`draft`、`pinned`、`cover`、`toc`
- 约束：
  - `pinned` 必须是正整数（例如 `1`、`2`）
  - `draft` 默认 `false`
  - `toc` 默认 `true`

推荐 Frontmatter 示例：

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
