import Link from "next/link";
import type { ReactNode } from "react";
import type { AudienceSlug } from "@/lib/types";

type QueryLinkProps = {
  href: string;
  audience?: AudienceSlug;
  className?: string;
  children: ReactNode;
};

export function QueryLink({ href, audience, className, children, ...props }: QueryLinkProps) {
  const resolvedHref = withAudience(href, audience);

  return (
    <Link href={resolvedHref} className={className} {...props}>
      {children}
    </Link>
  );
}

function withAudience(href: string, audience?: AudienceSlug) {
  if (!audience || audience === "all") {
    return normalizeStaticPath(href);
  }

  const [pathname, queryString = ""] = href.split("?");
  const params = new URLSearchParams(queryString);

  if (!params.has("audience")) {
    params.set("audience", audience);
  }

  const nextQuery = params.toString();
  const normalizedPath = normalizeStaticPath(pathname);
  return nextQuery ? `${normalizedPath}?${nextQuery}` : normalizedPath;
}

function normalizeStaticPath(href: string) {
  const [pathname, queryString = ""] = href.split("?");

  if (!pathname.startsWith("/") || pathname === "/" || pathname.endsWith("/")) {
    return href;
  }

  const lastSegment = pathname.split("/").at(-1) ?? "";
  if (lastSegment.includes(".")) {
    return href;
  }

  const normalizedPath = `${pathname}/`;
  return queryString ? `${normalizedPath}?${queryString}` : normalizedPath;
}
