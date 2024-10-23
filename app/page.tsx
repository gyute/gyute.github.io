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
            className="mb-7 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:items-center sm:gap-3 md:gap-0"
          >
            <div className="flex w-2/12 justify-start gap-3 text-base text-gray-500">
              <span className="w-full text-left sm:w-1/3 md:w-1/4">
                {month}
              </span>
              <span className="w-full text-center sm:w-1/3 md:w-1/4">
                {day},
              </span>
              <span className="w-full text-center sm:w-1/3 md:w-1/4">
                {year}
              </span>
            </div>
            <h2 className="ml-7 flex-grow text-lg">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
          </div>
        );
      })}
    </div>
  );
}
