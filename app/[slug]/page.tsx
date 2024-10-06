import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { postDate } from "@/lib/date";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypePrettyCode from "rehype-pretty-code";

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
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(post.content);

  const contentHTML = processedContent.toString();

  return (
    // TODO: prose
    <div className="container">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-8">{postDate(post.date)}</p>
      <div
        className="text-gray-300"
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      />
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();

  return slugs.map((filename) => ({
    slug: filename.replace(".md", ""),
  }));
}
