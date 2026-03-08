import { getCollection, type CollectionEntry } from "astro:content";
import { siteConfig } from "@/config/site";
import { getPostCategoryLabel, type PostCategory } from "@/config/taxonomy";

export type PostEntry = CollectionEntry<"posts">;

export type YearArchive = {
  year: string;
  posts: PostEntry[];
};

export type FeaturedSplit = {
  featured: PostEntry[];
  feed: PostEntry[];
};

export type RelatedPost = {
  post: PostEntry;
  sharedTags: string[];
  score: number;
};

const normalizeDate = (date: Date) => new Date(date).getTime();

export const normalizeTag = (tag: string) => tag.trim().toLowerCase();
export const tagToParam = (tag: string) => normalizeTag(tag);
export const tagToUrlSegment = (tag: string) => encodeURIComponent(normalizeTag(tag));
export const normalizeUnlockCode = (code?: string) => (code ?? "").trim().toLowerCase();
export const getPostTags = (post: PostEntry): string[] =>
  (post.data.tags ?? []).map(normalizeTag).filter(Boolean);

export const getPostCategory = (post: PostEntry): PostCategory => post.data.category;
export const getPostCategoryLabelText = (post: PostEntry) => getPostCategoryLabel(post.data.category);
export const getPostSeries = (post: PostEntry) => post.data.series?.trim() || undefined;
export const getPostProjectSlug = (post: PostEntry) => post.data.project?.trim() || undefined;

export const isPostPublished = (post: PostEntry): boolean => {
  if (post.data.draft && !import.meta.env.DEV) {
    return false;
  }

  if (!siteConfig.showFuturePosts) {
    const now = Date.now();
    if (normalizeDate(post.data.pubDate) > now) {
      return false;
    }
  }

  return true;
};

export const byRecent = (a: PostEntry, b: PostEntry) =>
  normalizeDate(b.data.pubDate) - normalizeDate(a.data.pubDate);

const byPinnedThenRecent = (a: PostEntry, b: PostEntry) => {
  const left = a.data.pinned ?? Number.POSITIVE_INFINITY;
  const right = b.data.pinned ?? Number.POSITIVE_INFINITY;
  if (left !== right) {
    return left - right;
  }
  return byRecent(a, b);
};

export type GetAllPostsOptions = {
  includeHidden?: boolean;
};

export const getAllPublishedPosts = async (
  options: GetAllPostsOptions = {}
): Promise<PostEntry[]> => {
  const { includeHidden = false } = options;
  const posts = await getCollection("posts");
  return posts
    .filter(isPostPublished)
    .filter((post) => (includeHidden ? true : !post.data.hidden))
    .sort(byRecent);
};

export const splitFeaturedAndFeedPosts = (
  posts: PostEntry[],
  featuredCount: number
): FeaturedSplit => {
  if (featuredCount <= 0 || posts.length === 0) {
    return { featured: [], feed: posts };
  }

  const capped = Math.min(featuredCount, posts.length);
  const pinned = posts.filter((post) => typeof post.data.pinned === "number").sort(byPinnedThenRecent);
  const featured: PostEntry[] = [];
  const picked = new Set<string>();

  for (const post of pinned) {
    if (featured.length >= capped) {
      break;
    }
    featured.push(post);
    picked.add(post.slug);
  }

  if (featured.length < capped) {
    for (const post of posts) {
      if (featured.length >= capped) {
        break;
      }
      if (picked.has(post.slug)) {
        continue;
      }
      featured.push(post);
      picked.add(post.slug);
    }
  }

  const feed = posts.filter((post) => !picked.has(post.slug));
  return { featured, feed };
};

export const getRelatedPosts = (
  posts: PostEntry[],
  target: PostEntry,
  limit = 4
): RelatedPost[] => {
  if (limit <= 0 || posts.length <= 1) {
    return [];
  }

  const targetTags = new Set(getPostTags(target));
  const targetSlug = target.slug;
  const targetSeries = getPostSeries(target);
  const targetProject = getPostProjectSlug(target);
  const targetCategory = getPostCategory(target);

  const related = posts
    .filter((post) => post.slug !== targetSlug)
    .map((post) => {
      const tags = getPostTags(post);
      const sharedTags = tags.filter((tag) => targetTags.has(tag));
      const overlap = sharedTags.length;
      const unionSize = new Set([...targetTags, ...tags]).size || 1;
      const similarity = overlap / unionSize;
      const recencyBoost = normalizeDate(post.data.pubDate) / 1_000_000_000_000;
      const sameSeriesBoost = targetSeries && getPostSeries(post) === targetSeries ? 28 : 0;
      const sameProjectBoost = targetProject && getPostProjectSlug(post) === targetProject ? 22 : 0;
      const sameCategoryBoost = getPostCategory(post) === targetCategory ? 8 : 0;
      const score =
        overlap * 100 + similarity * 10 + sameSeriesBoost + sameProjectBoost + sameCategoryBoost + recencyBoost;

      return { post, sharedTags, score };
    })
    .sort((left, right) => right.score - left.score || byRecent(left.post, right.post));

  const withSharedTags = related.filter((item) => item.sharedTags.length > 0);
  const withoutSharedTags = related.filter((item) => item.sharedTags.length === 0);

  return [...withSharedTags, ...withoutSharedTags].slice(0, limit);
};

export const getPostBySlug = async (slug: string): Promise<PostEntry | undefined> => {
  const posts = await getAllPublishedPosts();
  return posts.find((post) => post.slug === slug);
};

export const getTagsWithCount = (posts: PostEntry[]) => {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of getPostTags(post)) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }

  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-Hans-CN"));
};

export const getCategoriesWithCount = (posts: PostEntry[]) => {
  const map = new Map<PostCategory, number>();
  for (const post of posts) {
    const category = getPostCategory(post);
    map.set(category, (map.get(category) ?? 0) + 1);
  }

  return [...map.entries()].map(([category, count]) => ({
    category,
    label: getPostCategoryLabel(category),
    count
  }));
};

export const getPostsByTag = (posts: PostEntry[], tag: string) => {
  const normalized = normalizeTag(tag);
  return posts.filter((post) => getPostTags(post).includes(normalized));
};

export const getPostsByCategory = (posts: PostEntry[], category: PostCategory) =>
  posts.filter((post) => getPostCategory(post) === category);

export const getPostsByProject = (posts: PostEntry[], projectSlug: string) =>
  posts.filter((post) => getPostProjectSlug(post) === projectSlug);

export const groupPostsByYear = (posts: PostEntry[]): YearArchive[] => {
  const map = new Map<string, PostEntry[]>();
  for (const post of posts) {
    const year = post.data.pubDate.getFullYear().toString();
    const bucket = map.get(year) ?? [];
    bucket.push(post);
    map.set(year, bucket);
  }

  return [...map.entries()]
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({
      year,
      posts: items.sort(byRecent)
    }));
};
