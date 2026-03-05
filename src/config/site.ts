export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  title: string;
  description: string;
  siteUrl: string;
  author: string;
  accentColor: string;
  socialLinks: SocialLink[];
  postsPerPage: number;
  featuredCount: number;
  showFuturePosts: boolean;
};

export const siteConfig: SiteConfig = {
  title: "UEnt26 Blog",
  description: "纯前端个人博客。专注游戏和科技。",
  siteUrl: import.meta.env.SITE_URL ?? "https://example.com",
  author: "UEnt26",
  accentColor: "#c45237",
  socialLinks: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "RSS", href: "/rss.xml" }
  ],
  postsPerPage: 6,
  featuredCount: 3,
  showFuturePosts: false
};
