import { transformerCopyButton } from "@rehype-pretty/transformers";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { Comments } from "@/components/comments";
import { BLOG_TITLE, BLOG_URL } from "@/components/constants";
import { postDate } from "@/lib/date";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

export default async function Post({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(slug);
  if (!post?.content) {
    return notFound();
  }

  const html = (
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .use(rehypePrettyCode, {
        theme: "material-theme-palenight",
        transformers: [
          transformerCopyButton({
            visibility: "always",
            feedbackDuration: 1000,
          }),
        ],
      })
      .process(post.content)
  )
    .toString()
    // TODO: Convert to Rehype extension
    .replace(/<table>/g, '<div class="overflow-x-auto"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(
      /clipboard="(.*?)"/,
      (_, target) =>
        `onclick="navigator.clipboard.writeText('${target}').then(() => alert('Copied to clipboard'))"`,
    );

  return (
    <>
      <div className="dark-text light-text container mx-auto">
        <h1 className="my-5">{post.title}</h1>
        <p className="mb-12 text-lg text-gray-500">
          {postDate(post.createdAt)}
          {post.updatedAt && (
            <>
              <br />
              {postDate(post.updatedAt)}
            </>
          )}
        </p>
        <div
          className="markdown-link markdown-table my-3 text-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <Comments />
    </>
  );
}

export function generateStaticParams() {
  const params = getPostSlugs().map((slug) => ({ slug }));
  if (params.length === 0) {
    return [{ slug: "not-found" }];
  }
  return params;
}

export function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(slug);
  const url = `${BLOG_URL}/posts/${slug}`;

  if (!post)
    return {
      title: BLOG_TITLE,
    };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      type: "article",
      url: url,
      siteName: BLOG_TITLE,
    },
    alternates: {
      canonical: url,
    },
  };
}
