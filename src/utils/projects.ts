import { getCollection, type CollectionEntry } from "astro:content";
import { type PostEntry } from "@/utils/posts";

export type ProjectEntry = CollectionEntry<"projects">;

const statusRank = {
  active: 0,
  maintain: 1,
  plan: 2,
  inactive: 3
} as const;

let projectCollectionPromise: Promise<ProjectEntry[]> | undefined;

const loadProjects = async (): Promise<ProjectEntry[]> => {
  projectCollectionPromise ??= getCollection("projects");
  return projectCollectionPromise;
};

export const getProjectTimestamp = (project: ProjectEntry) =>
  project.data.updatedDate?.getTime() ?? 0;

export const byProjectPriority = (left: ProjectEntry, right: ProjectEntry) => {
  if (left.data.featured !== right.data.featured) {
    return Number(right.data.featured) - Number(left.data.featured);
  }

  const statusDelta = statusRank[left.data.status] - statusRank[right.data.status];
  if (statusDelta !== 0) {
    return statusDelta;
  }

  return getProjectTimestamp(right) - getProjectTimestamp(left);
};

export const getAllProjects = async (): Promise<ProjectEntry[]> => {
  const projects = await loadProjects();
  return [...projects].sort(byProjectPriority);
};

export const getFeaturedProjects = async (limit = 3): Promise<ProjectEntry[]> => {
  const projects = await getAllProjects();
  return projects.filter((project) => project.data.featured).slice(0, limit);
};

export const getProjectBySlug = async (slug: string): Promise<ProjectEntry | undefined> => {
  const projects = await loadProjects();
  return projects.find((project) => project.slug === slug);
};

export const getProjectTitleBySlug = async (slug: string): Promise<string | undefined> => {
  const project = await getProjectBySlug(slug);
  return project?.data.title;
};

export const getPostsByProject = (posts: PostEntry[], projectSlug: string) =>
  posts.filter((post) => post.data.project === projectSlug);
