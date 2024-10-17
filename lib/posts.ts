import fs from "fs";
import path from "path";

import matter from "gray-matter";

export type Post = {
  title: string;
  description?: string;
  date: string;
  slug: string;
  content: string;
  assets?: string[];
};

const contentsDir = path.join(process.cwd(), "contents/posts");

export function getPostSlugs(): string[] {
  try {
    if (!fs.existsSync(contentsDir)) {
      console.error(`Directory not found: ${contentsDir}`);
      return [];
    }

    const fileNames = fs.readdirSync(contentsDir);
    return fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => fileName.replace(/\.mdx$/, ""));
  } catch (err) {
    console.error(`Error reading directory: ${(err as Error).message}`);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(contentsDir, `${slug}.mdx`);

  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }
    const mdx = fs.readFileSync(filePath, "utf8");
    const { data: frontMatter, content } = matter(mdx);

    return {
      title: frontMatter.title,
      description: frontMatter.description,
      date: frontMatter.date,
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
    .filter((post) => post !== null && post.date)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());
}
