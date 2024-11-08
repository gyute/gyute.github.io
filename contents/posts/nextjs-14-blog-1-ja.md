---
title: "Next.js14とGitHub Pagesでブログを作ってみる: 基本設定"
date: 2024-10-30
description: "Next.js14でブログを作ってみる. GitHub Pages, Next.js14, TypeScript, TailwindCSS."
---

2024年の後半はNext.js12から14にマイグレーションするプロジェクトで、App RouterとPages Routerの並行だったり、12と14のレンダリング方式の相違だったりでReactの基礎とNext.jsの理解にかなり役立つ経験ができた。せっかくの機会なので頭を14に切り替えたく14を使ってMarkdownブログを作ってみた。

今回GitHub Pagesに静的サイト<a id="aid1" href="#ref1" class="jump">[1]</a>でデプロイすることでサーバコンポーネント(Server Components, SC)とクライアントコンポーネント(Client Components, CC)の分離の練習にもなった。今後は検索機能なども追加していくつもりだ。それでは早速GitHubの設定から始める。

## tools

\* Next.js 14

\* TypeScript

\* TailwindCSS

\* GitHub Pages

<br />

## GitHub 設定

GitHub Pages用のリポジトリはルールとして

```js
<user>.github.io
```

または

```js
<organization>.github.io
```

でリポジトリの名前をつける必要がある。

<img src="/nextjs-blog/new-repository.png" alt="new repository" class="rounded-lg my-5">
<p class="image-comment">変なリポジトリ名にしてあるのは、私は既にGitHub Pagesを作ったからで、<br />このポストのコードはプロジェクトサイト<a id="aid2" href="#ref2" class="jump">[2]</a>としてデプロイする。<br />⇒ 正しくは、gyute.github.ioと入力</p>

リポジトリ名をルール通り作ること<a id="aid2" href="#ref2" class="jump">[2]</a>で、GitHubが自動でリポジトリ名をURLにしてホスティングしてくれる。

リポジトリの作成が完了したら、作成されたリポジトリに移動し、`Settings > Pages{:gg}`を選択する。

```gg
https://github.com/<user>/<user>.github.io/settings/pages
```

<img src="/nextjs-blog/settings-pages.png" alt="pages settings" class="rounded-lg my-5">

そして`Build and deployment{:gg}`の`Source{:gg}`を`GitHub Actions{:gg}`に変更し、`Next.js{:gg}`の`Configure{:gg}`をクリックする。

<img src="/nextjs-blog/gh-actions-select.png" alt="github actions configuration" class="rounded-lg my-5">

すると、

```gg
<user>.github.io/.github/workflows/nextjs.yml
```

が作成されるので右上の`Commit changes...{:gg}`をクリック、コミットメッセージを入力して[コミットする](https://github.com/gyute/blog-example/commit/29d02f5a9e1b961f186ace40f66631a8525ec5fa)。

これでGitHubでの設定は完了。この時点では`https://<user>.github.io{:gg}`にアクセスしても404が表示されるだけ。

## Next.js プロジェクト作成

ターミナルで作業予定のディレクトリに移動し、

```sh
npx create-next-app@14
```

を入力、初期設定を行う。

```sh
Need to install the following packages:
create-next-app@14.2.16
Ok to proceed? (y) y
✔ What is your project named? … <user>.github.io
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … No
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to customize the default import alias (@/*)? … No
```

今後のことも考えてプロジェクト名は`<user>.github.io{:gg}`と入力。その後は、`Yes > Yes > Yes > No > Yes > No{:gg}`に選択したが、デフォルトのままなのでエンターを押し続けるだけ。`TypeScript{:gg}`、`ESLint{:gg}`、`Tailwind CSS{:gg}`、`App Router{:gg}`は全部使うし、`src/{:gg}`と`customize import alias{:gg}`は使わない。

`create-next-app{:gg}`のパッケージインストールが終わったら、作られたディレクトリに<span class="underline decoration-wavy font-bold">移動</span>し、git設定を行う。まず`create-next-app{:gg}`が勝手にコミットを追加するので`.git{:gg}`の削除から。

```sh
rm -rf ./.git
git init
git config --global init.defaultBranch main
git remote add origin git@github.com:<user>/<user>.github.io
git pull origin main --rebase
```

そして、不要なファイルとコードを削除する。

```sh
rm -rf app/favicon.ico app/fonts
```

`app/globals.css{:sh}`

```ts showLineNumbers
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`app/layout.tsx{:sh}`

```tsx showLineNumbers
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx{:sh}`

```tsx showLineNumbers
export default function Home() {
  return <></>;
}
```

これで一通りクリーンな状態になれたと思う[[commit]](https://github.com/gyute/blog-example/commit/3128893a785c8ba15f0180721555df07b2dc4d10)。そしてここからはGitHubのビルドが成功するのでページの確認ができるようになる。

## dev pkg インストール

必要最低限だと思われるパッケージをインストールする。

```sh
npm install -D prettier prettier-plugin-tailwindcss autoprefixer eslint-plugin-import
```

簡単なconfigファイルも追加。

`.eslintrc.json{:sh}`

```json showLineNumbers
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "plugins": ["import"],
  "rules": {
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"]
        ],
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        },
        "newlines-between": "always"
      }
    ]
  }
}
```

`.prettierrc{:sh}`

```json showLineNumbers
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`icons{:gg}`、`Markdown{:gg}`などのパッケージも気に入れておくと楽だと思うが、どこに使われるのかを意識せずにパッケージを入れるのはよくないと思うので、必要な時に入れることにする。

現在のディレクトリ構成は以下のようになる。

```sh
.
├── README.md
├── app
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── next-env.d.ts
├── next.config.mjs
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

次のポストで実際にMarkdownを使う簡単なブログを作ってみよう。

---

1: [Static Rendering](https://nextjs.org/docs/14/app/building-your-application/rendering/server-components#static-rendering-default)と[Static Site Generation(SSG)](https://nextjs.org/docs/14/pages/building-your-application/rendering/static-site-generation) <a id="ref1" href="#aid1" class="jump">return ↩</a>

2: 違う名前でリポジトリ名をすることもできるが、その場合は、

```gg
https://<user>.github.io/<repository-name>
```

のように`<user>.github.io{:gg}`は固定で、`<repository-name>{:gg}`がパスとして追加される。これを[プロジェクトサイト(Project site)](https://pages.github.com/)と言う。<a id="ref2" href="#aid2" class="jump">return ↩</a>
