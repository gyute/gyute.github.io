import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { postDate } from "@/lib/date";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { Metadata } from "next";
import Comments from "@/components/comments";

interface PostProps {
  params: {
    slug: string;
  };
}

export default async function Post({ params }: PostProps) {
  const { slug } = params;
  const post = getPostBySlug(slug);
  const theme = "github-dark-dimmed";

  if (!post) {
    return notFound();
  }

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrettyCode, {
      theme: theme,
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(post.content);

  const contentHTML = processedContent.toString();

  return (
    <>
      <div className="container">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-500 mb-8">{postDate(post.date)}</p>
        <div
          className="text-gray-300 md-todo md-table"
          dangerouslySetInnerHTML={{ __html: contentHTML }}
        />
      </div>
      <Comments />
    </>
  );
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();

  return slugs.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post)
    return {
      title: "@gyute",
    };

  return {
    title: `${post.title} | gyute`,
    description: post.description,
    openGraph: {
      type: "article",
      url: `https://gyute.com/${slug}`,
      siteName: "@gyute",
    },
  };
}
