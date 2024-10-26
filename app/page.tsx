import Link from "next/link";

import { formatDate } from "@/lib/date";
import { Post, getAllPosts } from "@/lib/posts";

export default function Blog() {
  const posts: (Post | null)[] = getAllPosts();

  return (
    <div className="container">
      {posts?.map((post) => {
        if (post === null || !post.date || !post.slug || !post.title)
          return null;

        const { month, day, year } = formatDate(post.date);

        return (
          <div
            key={post.slug}
            className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 md:gap-0 [&_h3]:mb-0 [&_h3]:mt-5"
          >
            <div className="flex w-2/12 justify-start gap-3 text-base text-gray-500">
              <h3 className="w-full text-left sm:w-1/3 md:w-1/4">{month}</h3>
              <h3 className="w-full text-center sm:w-1/3 md:w-1/4">{day},</h3>
              <h3 className="w-full text-center sm:w-1/3 md:w-1/4">{year}</h3>
            </div>
            <h3 className="ml-7 flex-grow">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h3>
          </div>
        );
      })}
    </div>
  );
}
