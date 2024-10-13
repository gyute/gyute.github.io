import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostType = {
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

    return fs.readdirSync(contentsDir);
  } catch (err) {
    console.error(`Error reading directory: ${(err as Error).message}`);
    return [];
  }
}

export function getPostBySlug(slug: string): PostType | null {
  const filename = slug?.endsWith(".md") ? slug.replace(/\.md$/, "") : slug;
  const fullPath = path.join(contentsDir, `${filename}.md`);

  try {
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      title: data.title,
      description: data.description,
      date: data.date,
      slug: filename,
      content,
      assets: data.assets,
    };
  } catch (err) {
    console.error(`Error reading file: ${(err as Error).message}`);
    return null;
  }
}

export function getAllPosts(): PostType[] {
  const slugs = getPostSlugs();

  if (slugs.length === 0) {
    return [];
  }

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is PostType => post !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
