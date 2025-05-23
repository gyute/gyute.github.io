---
title: "Tailscaleを使って無料で簡単にVPN活"
createdAt: 2024-11-24
description: "Tailscaleを使って無料で簡単なVPN活. 鍵管理からの解放"
---

<img src="/thirdparty-vpn/tailscale.png" alt="p2p mesh network" class="rounded-lg my-5">
<p class="image-comment">https://tailscale.com/blog/how-tailscale-works</p>

Tailscaleは、WireGuardをベースにしたVPNサービスだ。特徴として分散型のP2Pメッシュネットワークを採択しているため、より安全で高速な通信が可能になると言える。

類似ソルーションとして、CloudflareのCloudflare Tunnelというサービスがある。費用面では両者とも個人サーバー運用の用途には無料プランで十分使える設定となっていた。が、CloudflareはP2Pではないことから、今回はTailscaleを使うことにした。

## 活用

状況によっては、ルーターを直接触れなかったりでネット設定を自由に変更できない環境下のサーバー(デバイス)を運用しなければならない場合<a id="aid1" href="#ref1" class="jump-guide">[1]</a>もあると思う。その時、TailscaleやCloudflare TunnelといったVPNサービスを使うことで、ポートフォワーディング(Port Forwarding)やDDNSの設定なしでも、外部からWake-on-LAN<a id="aid2" href="#ref2" class="jump-guide">[2]</a>で開発PCを起こしたり、localhostへのアクセスが簡単に実現可能になる。

## インストール

https://login.tailscale.com にアクセスして会員登録(SSO)を行う。

<img src="/thirdparty-vpn/signin.png" alt="tailscale signin" class="rounded-lg my-5">

会員登録を完了し、ログインすると、以下のようなonboarding pageが表示される。

<img src="/thirdparty-vpn/1.png" alt="tailscale onboarding paage1" class="rounded-lg my-5">

`Next{:gg}`をクリックすると、さっそくデバイス追加が始まる。

<img src="/thirdparty-vpn/2.png" alt="tailscale onboarding paage2" class="rounded-lg my-5">

もちろんここはスキップして、メインページでも同じことができるが、わかりやすかったのでここで初期登録を済ませてみよう。

### macOS

macOSの場合は、Mac App Storeからのインストールがメインで案内されるが、App Storeはアップデート管理がしにくいので、Homebrewでインストールし、UPする<a id="aid3" href="#ref3" class="jump-guide">[3]</a>。

```sh
brew install tailscale
tailscale up --ssh
```

ここでもし、

```log
failed to connect to local Tailscale service; is Tailscale running?
```

と表示される場合は、

```sh
sudo brew services start tailscale
```

をしてから、もう一度`tailscale up --ssh{:gg}`を実行する。

UPできたら、

```log
To authenticate, visit:

    https://login.tailscale.com/a/123456789abcde
```

と表示されるので、リンクをクリックして認証する。すると、認証完了とともに、

```log
Success.
```

と表示され、1台目のUPが完了する。

2台目のデバイスは、iPadなので、[App Store](https://tailscale.com/download/ios)からインストールする。

<img src="/thirdparty-vpn/3.png" alt="tailscale onboarding paage3" class="rounded-lg my-5">
<p class="image-comment">Minecraftはワクワクする</p>

2台目の登録でonboarding pageが終了するので、メインの設定ページで肝心な[Ubuntu(24.10)にもTailscaleを入れる](https://tailscale.com/download/linux)。

```sh
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --ssh
```

以上でこんな感じ。

<img src="/thirdparty-vpn/4.png" alt="tailscale machines" class="rounded-lg my-5">

## その他

\* [MagicDNS](https://tailscale.com/kb/1081/magicdns)という機能がデフォルトでONになっているため、IPだけでなく、machine名(ipad, mac16など)でアクセスすることもできる。

\* machine名にポイントを当てると`SSH{:gg}`オプションが表示され、それを押すことで、[ブラウザーのSSHコンソールが使える](https://tailscale.com/kb/1216/tailscale-ssh-console)。

<img src="/thirdparty-vpn/5.png" alt="tailscale ssh console1" class="rounded-lg my-5">

<img src="/thirdparty-vpn/6.png" alt="tailscale ssh console" class="rounded-lg my-5">

\* iPadからも問題ない。

<img src="/thirdparty-vpn/7.png" alt="tailscale ssh console" class="rounded-lg my-5">

---

1: シェアハウスとか研究室とか。<a id="ref1" href="#aid1" class="jump-guide">return ↩</a>

2: 低電力サーバーを24時間稼働できれば最高だが、家で遊んでいるRaspberry Piを積極的に活用しよう。事前にmagic packetを送るスクリプトやバイナリーを用意しておくことで、必要な時にRaspberry Piに接続し、メインの開発環境をWOLで起こすことができる。[go-wol](https://github.com/sabhiram/go-wol)や[wakeonlanスクリプト](https://github.com/jpoliv/wakeonlan)などがおすすめ。<a id="ref2" href="#aid2" class="jump-guide">return ↩</a>

3: `tailscale up{:gg}`でデフォルトでは`--ssh=false{:gg}`となっているが、`--ssh{:gg}`をつけることで、Tailscaleが認証を持ってくれる。<a id="ref3" href="#aid3" class="jump-guide">return ↩</a>
