import fs from "fs";
import path from "path";

import matter from "gray-matter";

export type Post = {
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  slug: string;
  content: string;
};

const contentsDirPath = path.join(process.cwd(), "contents/posts");

export function getPostSlugs(): string[] {
  try {
    if (!fs.existsSync(contentsDirPath)) {
      console.error(`Directory not found: ${contentsDirPath}`);
      return [];
    }

    const fileNames = fs.readdirSync(contentsDirPath);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => fileName.replace(/\.md$/, ""));
  } catch (err) {
    console.error(`Error reading directory: ${(err as Error).message}`);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | null {
  const mdPath = path.join(contentsDirPath, `${slug}.md`);

  try {
    if (!fs.existsSync(mdPath)) {
      console.error(`File not found: ${mdPath}`);
      return null;
    }

    const md = fs.readFileSync(mdPath, "utf8");
    const { data: frontMatter, content } = matter(md);
    return {
      title: frontMatter.title,
      description: frontMatter.description,
      createdAt: frontMatter.createdAt,
      updatedAt: frontMatter.updatedAt,
      slug,
      content,
    };
  } catch (err) {
    console.error(`Error reading file: ${(err as Error).message}`);
    return null;
  }
}

export function getAllPosts(): (Post | null)[] {
  const slugs = getPostSlugs();
  if (slugs.length === 0) {
    return [];
  }

  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => post !== null && post.createdAt)
    .sort(
      (a, b) =>
        new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime(),
    );
}
