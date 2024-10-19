import { evaluate } from "@mdx-js/mdx";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import Comments from "@/components/comments";
import { postDate } from "@/lib/date";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

interface PostProps {
  params: {
    slug: string;
  };
}

export default async function Post({ params }: PostProps) {
  const { slug } = params;
  const post = getPostBySlug(slug);
  if (!post?.content) {
    return notFound();
  }

  const { default: Content } = await evaluate(post.content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrettyCode],
  });

  return (
    <>
      <div className="container">
        <h1 className="text-4xl dark-text light-text mb-5">{post.title}</h1>
        <p className="text-gray-500 text-lg mb-12">{postDate(post.date)}</p>
        <div
          className="
            text-lg dark-text light-text my-3
            [&_p]:my-3
            [&_h1]:text-4xl [&_h1]:my-7
            [&_h2]:text-3xl [&_h2]:my-6
            [&_h3]:text-2xl [&_h3]:my-5
            [&_h4]:text-xl [&_h4]:my-4
            [&_img]:mx-auto
            [&_pre]:rounded-lg
            [&_ul]:pl-5 [&_li]:my-1
            [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-green-700 [&_a]:dark:decoration-[#9cff9c]
          "
        >
          <Content />
        </div>
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
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      url: `https://gyute.com/${slug}`,
      siteName: "@gyute",
    },
  };
}
