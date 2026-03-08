export const postCategoryValues = ["tech", "game", "meta"] as const;
export type PostCategory = (typeof postCategoryValues)[number];

export const postCategoryLabels: Record<PostCategory, string> = {
  tech: "技术",
  game: "游戏",
  meta: "站点"
};

export const projectStatusValues = ["active", "maintain", "plan", "inactive"] as const;
export type ProjectStatus = (typeof projectStatusValues)[number];

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: "进行中",
  maintain: "维护中",
  plan: "规划中",
  inactive: "已停更"
};

export const projectStatusDescriptions: Record<ProjectStatus, string> = {
  active: "当前仍在持续推进，适合优先查看。",
  maintain: "功能已经可用，目前以维护和细节打磨为主。",
  plan: "已经进入构思或预研阶段，还没有对外版本。",
  inactive: "项目暂时停更，但仍保留阶段性记录。"
};

export const getPostCategoryLabel = (category: PostCategory) => postCategoryLabels[category];
export const getProjectStatusLabel = (status: ProjectStatus) => projectStatusLabels[status];
export const getProjectStatusDescription = (status: ProjectStatus) =>
  projectStatusDescriptions[status];
