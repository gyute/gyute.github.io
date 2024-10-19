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
            className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-3 md:gap-0 sm:mb-5 mb-7"
          >
            <div className="text-base text-gray-500 w-2/12 flex justify-start gap-3">
              <span className="w-full sm:w-1/3 md:w-1/4 text-left">
                {month}
              </span>
              <span className="w-full sm:w-1/3 md:w-1/4 text-center">
                {day},
              </span>
              <span className="w-full sm:w-1/3 md:w-1/4 text-center">
                {year}
              </span>
            </div>
            <h2 className="text-lg ml-7 flex-grow">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
          </div>
        );
      })}
    </div>
  );
}
