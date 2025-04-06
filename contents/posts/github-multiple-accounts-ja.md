---
title: "GitHubの複数のアカウントをローカルで使う: SSH + HTTPS"
createdAt: 2025-04-07
description: "ローカル環境でGitHubの複数のアカウントを使う方法: SSH + HTTPS"
---

<a class="image-link-container" href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-your-personal-account/managing-multiple-accounts">
  <img src="/github-multi-accounts/github-octocat.png" alt="GitHub Managing multiple accounts" class="rounded-lg size-96 my-5">
</a>

## <div id="https" class="clip-util" data-clipboard="#https">HTTPS</div>

1\. 現在の環境で使われているcredential managerを確認する。何も表示されない場合は、<a href="#n3">3.に進む。</a>

```sh
git config --get credential.helper
```

<br />

2\. 使用中のcredential managerをリセットする。

2-1. `osxkeychain{:gg}`と表示される場合、`macOS keychain{:gg}`を使っているので下記のコマンドで設定をリセットする。1行ずつ入力してエンターを押し、最後の`protocol=https{:gg}`を入力した後2回エンター。

```sh
git credential-osxkeychain erase
host=github.com
protocol=https
```

2-2 `manager(もしくはmanager-core){:gg}`と表示された場合、`Git Credential Manager{:gg}`を使っているので、次のコマンドで設定をリセットする。

```sh
echo "protocol=https\nhost=github.com" | git credential-manager erase
```

<br />

<div id="n3" class="jump-center">3. GitHubでアクセスする各リポジトリへのcredentialをキャッシュするためには下記のコマンドを入力。</div>

```sh
git config --global credential.https://github.com.useHttpPath true
```

この変更は、下記で確認できる。

```sh
git config --global -e
```

<br />

4\. [個人アクセストークン(PAT)を設定](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)する。

4-1. もしemail認証がまだなら、[email認証を確認](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/verifying-your-email-address#verifying-your-email-address)する。

<details>
  <summary>
    email認証?
  </summary>
  <a class="image-link-container" href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/verifying-your-email-address#verifying-your-email-address">
    <img src="/github-multi-accounts/github-email-verify.webp" alt="GitHub Verifying your email address" class="rounded-lg my-5">
  </a>
</details>

<img src="/github-multi-accounts/github-generate-new-token.png" alt="GitHub Generate new token" class="rounded-lg my-5">

4-2. [Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/personal-access-tokens)に入り、`Generate new token{:gg}`を押す。

<img src="/github-multi-accounts/github-new-fine-grained-pac.png" alt="GitHub Generate new token" class="rounded-lg my-5">

4-3. `Token name{:gg}`を入力し、必要な場合は`Description{:gg}`を入力する。

4-4. `Resource owner{:gg}`から使用するアカウントを選択する。[Organizationsの設定によっては自分のアカウントが表示されなかったり](https://docs.github.com/en/organizations/managing-programmatic-access-to-your-organization/setting-a-personal-access-token-policy-for-your-organization)、リクエストが必要なケースもある。Organizationsを選ぶことも可能。

4-5. `Expiration{:gg}`からトークンの有効期限を設定する。

4-5. `Repository access{:gg}`からトークンでアクセスする予定のレポジトリを選択する。Organizationsの設定によっては`Only select repositories{:gg}`が表示されない場合もある。

4-6. `Permissions{:gg}`からトークンに付与する権限を選択する。最低限の権限(PoLP)に注意する。[REST APIエンドポイントによる権限の詳細はこのリンク](https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28)を確認。

<details>
  <summary>
    Private repositoryがcloneできない場合
  </summary>
  <span>
    All repositories、Only select repositoriesを選択した場合表示されるRepository permissionsオプションのpermission付与が必要

      ↪︎ Repository permissions > Contents > Access: Read and write

  </span>
</details>

4-7. `Generate token{:gg}`でトークンを生成する。

4-8. <span class="underline decoration-wavy">生成されたトークンをコピーする</span>。

<br />

5\. git cloneや、既存に存在するリポジトリにアクセスする時、`Username{:gg}`と`Password{:gg}`を要求されるが、その時`Password{:gg}`にトークンを入力する。Gitはremote URLをベースにトークンをキャッシュするので1回のみの入力になる。

<br />

## <div id="ssh" class="clip-util" data-clipboard="#ssh">SSH</div>

1\. SSH key生成。

```sh
cd ~/.ssh
```

`~/.ssh{:gg}`でkeyファイルを管理するので移動する。

処理が速く、容量も小さい上に、セキュリティも強い`ED25519{:gg}`を使おう。でも環境のため`RSA(4096 bit){:gg}`も記載して置く。

1-1. `ED25519{:gg}`の場合

```sh
ssh-keygen -t ed25519 -C "example@mail.com" -f "output_keyfile_name"
```

\* `-t ed25519{:gg}`: algorithmタイプの指定

\* `-C "example@mail.com"{:gg}`: pubに入るコメントの入力。一般的にemailを入れる

\* `-f "output_keyfile_name"{:gg}`: 生成されるkeyファイル名

1-2. `RSA (4096 bit){:gg}`の場合

```sh
ssh-keygen -t rsa -b 4096 -C "example@mail.com" -f "output_keyfile_name"
```

\* `-b 4096{:gg}`: 使うbitを指定。RSAのデフォルトは、`3072{:gg}`

<br />

2\. `Passphrase{:gg}`を登録する。

```sh
Generating public/private ed25519 key pair.
Enter passphrase (empty for no passphrase):
```

上記の`ssh-keygen{:gg}`コマンドを打つと、`Passphrase{:gg}`の入力を要求される。何も入力せず、エンターを押すと、`Passphrase{:gg}`は登録されない。これはGitHubに登録する時に必要なパスワードではなく、`Private key{:gg}`を保護するために使うもので、`SSH private key{:gg}`が流出された場合でもこの`Passphrase{:gg}`が分からないと使えないのでなるべく登録しよう。

<br />

3\. 生成されたSSH keyの確認。

`Passphrase{:gg}`を設定してエンターを押すと、`output_keyfile_name{:gg}`(private key)と`output_keyfile_name.pub{:gg}`(public key)が生成される。個人用と会社用を作るとしたらそれぞれの`email(-C, commentオプション){:gg}`と`ファイル名(-f){:gg}`で作る。

<br />

<div id="n4" class="jump-center">4. ssh-agentに手動登録。</div>

毎回`Passphrase{:gg}`を入力するのは辛いので、`ssh-agent{:gg}`を使う。

```sh
eval "$(ssh-agent -s)"
```

`eval{:gg}`を使って`ssh-agent{:gg}`をバックグラウンドで実行させる。

```sh
ssh-add ~/.ssh/ed25519_personal
ssh-add ~/.ssh/ed25519_organization
```

`ssh-keygen{:gg}`時に`ファイル名(-f){:gg}`として指定して生成された`Private key{:gg}`を`ssh-add{:gg}`で`ssh-agent{:gg}`に登録する。

```sh
ssh-add --apple-use-keychain ~/.ssh/ed25519_personal
ssh-add --apple-use-keychain ~/.ssh/ed25519_organization
```

macOSの場合は、`--apple-use-keychain{:gg}`を使うことでシェルが新しくなっても`Passphrase{:gg}`を入力しなくて済む。

```sh
ssh-add -l
```

登録されたkeyは、`リストオプション(-l){:gg}`で確認できる。

<br />

5\. configの編集。

`~/.ssh/config{:gg}`を編集する。もしファイルが存在しない場合はファイルを新しく作る必要があるが、必ず存在しないかを先に確認しよう。

```sh
Host gh-p
    HostName github.com
    # macOSの場合
    UseKeychain yes
    AddKeysToAgent yes
    IdentityFile ~/.ssh/ed25519_personal

Host gh-org
    HostName github.com
    # macOSの場合
    UseKeychain yes
    AddKeysToAgent yes
    IdentityFile ~/.ssh/ed25519_organization
```

\* `Host{:gg}`: aliasなので自分ルールで大丈夫

\* `HostName github.com{:gg}`: SSHのtarget(向き)なので、変えてはいけない

\* `UseKeychain yes{:gg}`: <a href="#n4">4.で入れた</a>`ssh-add --apple-use-keychain{:gg}`を使うため

\* `AddKeysToAgent yes{:gg}`: `ssh-add{:gg}`を毎回しなくても済む

\* `IdentityFile{:gg}`: `Private key{:gg}`の場所

<br />

6\. GitHubに登録。

6-1. [Settings > SSH and GPG keys](https://github.com/settings/keys)に入り、`New SSH key{:gg}`を押す。

<img src="/github-multi-accounts/github-new-ssh-key.png" alt="GitHub add new ssh key" class="rounded-lg my-5">

6-2. `Title{:gg}`はkeyのラベルのようなものなので分かりやすい名前を付ける。

6-3. `Key type{:gg}`は今回は`Authentication{:gg}`目的なので、`Authentication Key{:gg}`を選択する。`Signing key{:gg}`は[コミット署名時](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)に使う。

6-4. `Key{:gg}`には、`ssh-keygen{:gg}`で生成された`Public key{:gg}`を貼る。今回のケースだと、`~/.ssh/ed25519_personal.pub{:gg}`

ターミナル環境では、下記コマンドでコピーできるが、もちろん好きなエディターでコピーしても良い。

```sh
pbcopy < ~/.ssh/ed25519_personal.pub
```

<br />

7\. 接続もろもろ

7.1 下記コマンドで接続テストをしてみる。

```sh
ssh -T git@gh-p
ssh -T git@gh-org
```

<br />

```log
Hi user_name! You've successfully authenticated, but GitHub does not provide shell access.
```

と表示されればOK。`user_name{:gg}`は、アカウント別に名前が違う場合はそれぞれ違う。

7.2 GitHubリポジトリのClone時の基本パスが下記のようなら、

```sh
git@github.com:account/repository.git
```

<p class="text-center text-2xl">⇩</p>

```sh
git@gh-p:account/repository.git
```

のように`git@{:gg}`の右の部分(`Host alias{:gg}`)を`~/.ssh/confg{:gg}`で設定した`Host{:gg}`(`Host alias{:gg}`)に置き変える必要がある。接続テストで打ったのと一緒。

7.3 `.git/config{:gg}`の修正を忘れないようにしよう。

```sh
git config --global user.name
git config --global user.email

git config --local user.name
git config --local user.email
```

で一回は確認し、違う情報でリポジトリに変更を加えないように注意しよう。

localが優先されるので、

```sh
git config user.name
git config user.email
```

から確認されるのは、`--local{:gg}`と同じで、リポジトリの`.git/config{:gg}`で確認できる。

`--global{:gg}`は、

```sh
git config --global -e
```

で確認できる。
