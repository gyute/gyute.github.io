import { getPostBySlug, Post } from "@/lib/posts";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default function PostPage({ params }: Props) {
  const post: Post | undefined = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="prose max-w-none">
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <article dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
