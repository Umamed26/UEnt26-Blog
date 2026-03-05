import rss from "@astrojs/rss";
import { siteConfig } from "@/config/site";
import { getAllPublishedPosts } from "@/utils/posts";
import { withBasePath } from "@/utils/paths";

export async function GET(context: { site?: URL }) {
  const posts = await getAllPublishedPosts({ includeHidden: true });

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? siteConfig.siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBasePath(`/posts/${post.slug}/`)
    })),
    customData: `<language>zh-cn</language>`
  });
}
