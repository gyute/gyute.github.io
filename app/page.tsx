import { formatDate } from "@/lib/date";
import { getAllPosts, Post } from "@/lib/posts";
import Link from "next/link";

export default function Blog() {
  const posts: Post[] = getAllPosts();

  return (
    <div className="container">
      {posts.map((post) => {
        const { month, day, year } = formatDate(post.date);

        return (
          <div
            key={post.slug}
            className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-3 md:gap-0"
          >
            <div className="text-base text-gray-500 w-2/12 flex justify-start gap-3">
              <span className="w-full sm:w-1/3 md:w-1/4 text-center">
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
              <Link href={`/${post.slug}`}>{post.title}</Link>
            </h2>
          </div>
        );
      })}
    </div>
  );
}
