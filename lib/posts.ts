import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  title: string;
  date: string;
  description: string;
  content: string;
  slug: string;
};

const contentDir = path.join(process.cwd(), "contents/posts");

export function getPostSlugs(): string[] {
  try {
    if (!fs.existsSync(contentDir)) {
      console.error(`Directory not found: ${contentDir}`);
      return [];
    }

    return fs.readdirSync(contentDir);
  } catch (err) {
    console.error(`Error reading directory: ${(err as Error).message}`);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(contentDir, `${realSlug}.md`);

  try {
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      title: data.title,
      date: data.date,
      description: data.description,
      content,
      slug: realSlug,
    };
  } catch (err) {
    console.error(`Error reading file: ${(err as Error).message}`);
    return null;
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();

  if (slugs.length === 0) {
    return [];
  }

  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
