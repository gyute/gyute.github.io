---
title: "Next.js14とGitHub Pagesでブログを作ってみる: スケルトン"
createdAt: 2024-11-09
description: "Markdownでブログポスト."
---

目指すは簡単にカスタマイズできるブログのスケルトンを作ること。それではレイアウトの構想から。

## レイアウト

```sh
.
├── app
│   └── posts
│       └── [slug]
│           └── page.tsx
├── components
├── contents
│   └── posts
├── lib
└── public
```

`app/{:sh}`

- `posts/[slug]/page.tsx{:sh}`

  - \* ブログの記事ページ
  - \* 動的ルーティング<a id="aid1-1" href="#ref1" class="jump-guide">[1-1]</a>を使うことでMDファイルでURLを指定できる
  - \* resume(CV)やprojects, aboutページなどの追加にも対応できる
  - \* 今このページも同じ構成になっている
    - ↪︎ https://gyute.com/posts/nextjs-14-blog-2-ja ≈ app/posts/[slug]
    - <img src="/nextjs-blog/route-segments-to-path-segments.png" alt="route segments" class="rounded-lg my-5">
    - <p class="image-comment">https://nextjs.org/docs/14/app/building-your-application/routing#route-segments</p>

`components/{:sh}`

- \* ヘッダー、フッター、サイドバーなどのコンポーネントを集めるディレクトリ
- \* Next.jsは[file-system based router](https://nextjs.org/docs/14/app/building-your-application/routing)というコンセプトを持っているため、このディクトリはURLのパスとは関係ない

`contents/{:sh}`

- `posts/{:sh}`

  - \* ブログのコンテンツになるMDファイルを格納するディレクトリ
  - \* 開発が終わってからは、このディレクトリだけ行き来すれば良い

`lib/{:sh}`

- \* ユーティリティやカスタムフックなどを集めるディレクトリ
- \* dateやMDファイルの読み込みなどの処理をここに集める

`public/{:sh}`

- \* 同じくNext.jsのコンセプトにより、assetsは`public/{:gg}`に置かないといけない[お約束](https://nextjs.org/docs/14/app/building-your-application/optimizing/static-assets)
- \* MDファイルで使われる画像などが入る
  - ↪︎ ex) `public/ポスト別/MDに入るイメージ.png{:gg}`

<br />

```sh
mkdir -p app/posts/\[slug\] components contents/posts lib public
```

ディレクトリを一個一個掘るのも大変なので一気に作る。

```sh
.
├── app
├── components
├── contents
├── lib
└── public
```

## 実装追加: 基本レイアウト[[commit]](https://github.com/gyute/blog-example/commit/220cb17aae7aaade7eb55ec488a49b0ab975f781)

- \* 緑色の部分が追加された部分(diff)
- \* 補足が必要だと思われる部分はコードの下に記載

`app/layout.tsx{:sh}`

```tsx showLineNumbers {3-8, 17-21, 25-28}#inserted {16}#deleted
import "./globals.css";

import { Metadata } from "next";

import { BLOG_TITLE } from "@/components/constants";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <body className="bg-slate-300">
        <Header />
        <main className="min-h-[63vh] sm:min-h-[67vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: BLOG_TITLE,
};
```

`app/globals.css{:sh}`

```css showLineNumbers {4-15}#inserted
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scrollbar-gutter-stable mx-auto max-w-screen-lg scroll-smooth font-mono;
  }
}

@layer utilities {
  .scrollbar-gutter-stable {
    scrollbar-gutter: stable;
  }
}
```

- \* L13: スクロールバーの有無でレイアウトの崩れ(ガタツキ)がないように`scrollbar-gutter{:gg}`を常に設定する

`components/constants.ts{:sh}`

```ts showLineNumbers {1-5}#inserted
export const BLOG_TITLE = "@ブログタイトル";
export const AUTHOR = "ユーザー名";

export const HOME_ROUTE = "/";
export const ABOUT_ROUTE = "/";
```

`components/header.tsx{:sh}`

```tsx showLineNumbers {1-32}#inserted
"use client";

import Link from "next/link";
import React from "react";

import { ABOUT_ROUTE, BLOG_TITLE, HOME_ROUTE } from "./constants";

export const Header: React.FC = () => {
  return (
    <header className="pb-14 pt-4">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="my-0">
            <Link href={"/"}>{BLOG_TITLE}</Link>
          </h1>
        </div>
        <div className="flex space-x-5">
          <nav>
            <ul className="flex space-x-5">
              <li>
                <Link href={HOME_ROUTE}>Home</Link>
              </li>
              <li>
                <Link href={ABOUT_ROUTE}>About</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};
```

- \* L1: ヘッダーはinteractive要素が多いため`"use client"{:gg}`を追加
  - \* SSGでビルドをするため`"use client"{:gg}`を追加しなくても、`"next/link"{:gg}`は使える
    - ↪︎ `<a>タグ{:gg}`に変換されるため
- \* L21, L24: `Home{:gg}`と`About{:gg}`はダミー

`components/footer.tsx{:sh}`

```tsx showLineNumbers {1-13}#inserted
import React from "react";

import { AUTHOR } from "./constants";

export const Footer: React.FC = () => {
  return (
    <footer className="pb-4 pt-20">
      <div className="container mx-auto flex justify-between text-center">
        <h3>Copyright &copy; 2024 {AUTHOR}</h3>
      </div>
    </footer>
  );
};
```

## 実装追加: Markdown ポスティング[[commit]](https://github.com/gyute/blog-example/commit/b916a05ee490aec500303f2165ad7d3e664c51aa)

まずは[パッケージをインストール](https://github.com/gyute/blog-example/commit/e7ea4e782200cc4ed26c233b34c8786364c50005)。

```sh
npm install gray-matter unified shiki remark-parse remark-rehype rehype-stringify
```

`app/page.tsx{:sh}`

```tsx showLineNumbers {1-2}#deleted {3-32}#inserted
export default function Home() {
  return <></>;
import Link from "next/link";

import { formatDate } from "@/lib/date";
import { Post, getAllPosts } from "@/lib/posts";

export default function Blog() {
  const posts: (Post | null)[] = getAllPosts();

  return (
    <div className="container mx-auto">
      {posts?.map((post) => {
        if (post === null || !post.date || !post.slug || !post.title)
          return null;

        const date = formatDate(post.date);

        return (
          <div
            key={post.slug}
            className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 md:gap-0"
          >
            <div className="text-base text-gray-500">{date}</div>
            <h3 className="ml-7">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h3>
          </div>
        );
      })}
    </div>
  );
}
```

`app/posts/[slug]/page.tsx{:sh}`

```tsx showLineNumbers {1-48}#inserted
import { notFound } from "next/navigation";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { formatDate } from "@/lib/date";
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
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(post.content)
  ).toString();

  return (
    <>
      <div className="container mx-auto">
        <h1 className="my-5 text-2xl font-bold">{post.title}</h1>
        <p className="mb-12 text-lg text-gray-500">{formatDate(post.date)}</p>
        <div
          className="my-3 text-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
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
```

- \* L11: リンターの働きで行替えになっているが、`params: { slug }{:gg}`がこのファイルの`[slug]{:gg}`<a id="aid1-2" href="#ref1" class="jump-guide">[1-2]</a>に対応している(取ってきている)
- \* L13: TypeScriptの型定義で`slug{:gg}`が`string{:gg}`であることを示している
- \* L20-26: `remark{:gg}`と`rehype{:gg}`を使って`Markdown{:gg}`を`HTML{:gg}`に変換
  - \* L22: `remark-parse{:gg}`: MDをAST(Abstract Syntax Tree)に変換
    - ↪︎ parser
  - \* L23: `remark-rehype{:gg}`: ASTをHTML ASTに変換
  - \* L24: `rehype-stringify{:gg}`: HTML ASTをHTMLに直列化(シリアライズ, serialization)
    - ↪︎ compiler
  - \* `allowDangerousHtml{:gg}`はMDファイルにHTMLタグを埋め込むことを可能にする
    - ↪︎ MDファイルが掲示板の投稿、リモートアクセスなどの信頼できないソースから取得される場合、`XSS(Cross-Site Scripting){:gg}`脆弱性のリスクがあるため、デフォルトでは`false{:gg}`になっているが、今回は自分で作成したローカルのMDファイルでビルドするため使用
    - ↪︎ MDファイルの中のHTMLタグを読み込むために、`rehype-raw{:gg}`を使うこともできるが、`rehype-stringify{:gg}`のオプションで十分なので余分なパッケージは入れたくなかった
  - \* L26: `unified(){:gg}`は`VFileオブジェクト{:gg}`返すので、`toString(){:gg}`でHTML文字列に変換
  - \* L35: 上で処理したHTMLを[JSX(TSX)](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>)に変換せずにそのままレンダリング
- L42-48: `generateStaticParams(){:gg}`: SSGビルド時、動的ルーティングをスタティックに生成するための関数
  - \* L45: 仕様上、`slug{:gg}`がない場合は、`return [];{:gg}`を返すよう公式に書いてあるが、そうするとビルドができない問題があり、臨時的にこのような書き方を取っている
    - ↪︎ `not-found{:gg}`ページは存在しない
    - ↪︎ あくまでも`slug{:gg}`がない時だけの話で、`slug(MDファイル){:gg}`がある場合は関係ない

`contents/posts/.gitkeep{:sh}`

```tsx
Whitespace-only changes.
```

- \* このファイルは`空ファイル{:gg}`で、内容は意味を持たない。空の`contents/posts/{:gg}`ディレクトリをGitに追跡させるために追加してある<a id="aid2" href="#ref2" class="jump-guide">[2]</a>
  - ↪︎ Gitは空のディレクトリを追跡しないためPushできないが、この仕様によって`lib/posts.ts{:gg}`の`getPostSlugs(){:gg}`がディレクトリを探せず、ビルドが失敗する
    - ↪︎ この件も、`return [{ slug: "not-found" }];{:gg}`と似た話で、`slug(MDファイル){:gg}`がある場合は関係ない(消しても良い)

`contents/posts/lipsum.md{:sh}`

```md showLineNumbers {1-7}#inserted
---
title: "lorem ipsum"
date: 2024-11-07
description: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
---

&nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <a href="https://en.wikipedia.org/wiki/Lorem_ipsum" class="text-green-700">(Source)</a>
```

- \* L1-5: このブロックがMDファイルのメタデータ([Front Matter](https://jekyllrb.com/docs/front-matter/))になる
- \* L7: MDファイルの中でHTMLタグを使っている
  - ↪︎ 続くTailwindCSSの設定で、MDファイルの中でもTailwindCSSのクラスを使えるようにする
    - ↪︎ JSX(TSX)ファイルの中でTailwindCSSを使う時との違いは、`className{:gg}`ではなく、`class{:gg}`にすること

`lib/date.ts{:sh}`

```ts showLineNumbers {1-11}#inserted
export function formatDate(dateString: string) {
  const locales = "en-US";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const date = new Date(dateString);

  return date.toLocaleDateString(locales, options);
}
```

`lib/posts.ts{:sh}`

```ts showLineNumbers {1-67}#inserted
import fs from "fs";
import path from "path";

import matter from "gray-matter";

export type Post = {
  title: string;
  description?: string;
  date: string;
  slug: string;
  content: string;
};

const contentsDirPath = path.join(process.cwd(), "contents/posts");

export function getPostSlugs(): string[] {
  try {
    if (!fs.existsSync(contentsDirPath)) {
      console.error(`Directory not found: ${contentsDirPath}`);
      return [];
    }

    const fileNames = fs.readdirSync(contentsDirPath);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => fileName.replace(/\.md$/, ""));
  } catch (err) {
    console.error(`Error reading directory: ${(err as Error).message}`);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | null {
  const mdPath = path.join(contentsDirPath, `${slug}.md`);

  try {
    if (!fs.existsSync(mdPath)) {
      console.error(`File not found: ${mdPath}`);
      return null;
    }

    const md = fs.readFileSync(mdPath, "utf8");
    const { data: frontMatter, content } = matter(md);
    return {
      title: frontMatter.title,
      description: frontMatter.description,
      date: frontMatter.date,
      slug,
      content,
    };
  } catch (err) {
    console.error(`Error reading file: ${(err as Error).message}`);
    return null;
  }
}

export function getAllPosts(): (Post | null)[] {
  const slugs = getPostSlugs();
  if (slugs.length === 0) {
    return [];
  }

  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) => post !== null && post.date)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());
}
```

`tailwind.config.ts{:sh}`

```ts showLineNumbers {4}#deleted {5-9}#inserted
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./contents/**/*.md",
  ],
  theme: {},
  plugins: [],
};
export default config;
```

- \* L8: MDファイルの中でもTailwindCSSのクラスを使えるようにする

## 終わりに

これで[スケルトンが完成](https://gyute.com/blog-example)した。

ついでに、TailwindCSS本家の[tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)を使うことで、簡単にブログのスタイルをプロのように整えることができるのでシンプルな導入方法も残しておく[[commit]](https://github.com/gyute/blog-example/commit/cf215c32e764275ee81e85801588faaabb3ee355)。

```sh
npm install @tailwindcss/typography
```

カスタマイズはできるが、このプラグインのデフォルトのmax-widthやフォントの色、大きさなどが個人的に合わず、逆に修正箇所が多くなり追えなくなったので、私は[使っていない](https://github.com/gyute/blog-example/commit/ea07f00b9d11144b9567cc4a608c4e2c8d4b5345)。

機会があれば、このブログで使っているTailwindCSSの設定やダークモードに関しても書いていきたい。

その時にはまた[blog-exampleリポジトリ](https://github.com/gyute/blog-example)を更新していくので、`blog-exampleリポジトリ{:gg}`を`<user>.github.io{:gg}`のリポジトリ名にしてフォークしてもらったら、最新の情報を取得できるようになる。

---

1: SSG環境でももちろん動的ルーティング([Dynamic Routes](https://nextjs.org/docs/14/app/building-your-application/routing/dynamic-routes))を使える。`[括弧の中]{:gg}`が必ず`slug{:gg}`である必要はなく、別に`[banana]{:gg}`でも良いが命名は慎重にしていきたい。<a id="ref1" href="#aid1-1" class="jump-guide">return 1-1↩</a> | <a id="ref1" href="#aid1-2" class="jump-guide">return 1-2↩</a>

2: `.gitkeep{:gg}`は[de facto standard](https://en.wikipedia.org/wiki/De_facto_standard)のようなもので、今回は無理やりディレクトリをPushしたかったので入れてあるがMDファイルを追加したら削除しても良い(残しておいても良い)。[[stack overflow記事]](https://stackoverflow.com/a/7229996) <a id="ref2" href="#aid2" class="jump-guide">return↩</a>
