const BASE_URL = import.meta.env.BASE_URL ?? "/";
const basePath = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
const basePathNoTrailingSlash = basePath === "/" ? "/" : basePath.slice(0, -1);

const hasScheme = (value: string) => /^[a-z][a-z0-9+.-]*:/i.test(value);

export const withBasePath = (path: string): string => {
  if (!path) {
    return basePath;
  }

  if (hasScheme(path) || path.startsWith("//") || path.startsWith("#")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (basePath === "/") {
    return normalizedPath;
  }

  if (normalizedPath === "/") {
    return basePath;
  }

  if (
    normalizedPath === basePathNoTrailingSlash ||
    normalizedPath.startsWith(`${basePathNoTrailingSlash}/`)
  ) {
    return normalizedPath;
  }

  return `${basePathNoTrailingSlash}${normalizedPath}`;
};

export const stripBasePath = (pathname: string): string => {
  if (!pathname) {
    return "/";
  }

  if (basePath === "/") {
    return pathname;
  }

  if (pathname === basePathNoTrailingSlash) {
    return "/";
  }

  if (pathname.startsWith(`${basePathNoTrailingSlash}/`)) {
    const stripped = pathname.slice(basePathNoTrailingSlash.length);
    return stripped || "/";
  }

  return pathname;
};
