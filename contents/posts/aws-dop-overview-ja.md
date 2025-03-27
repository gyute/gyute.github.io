---
title: "[WIP] AWS DevOpsサービス簡略概要"
createdAt: 2025-03-27
description: "Overview of AWS DevOps"
---

<a class="image-link-container" href="https://www.credly.com/badges/c42c7923-d2d8-422e-aedd-9ddb1da1fa10/public_url">
  <img src="/dop/aws-certified-devops-engineer-professional.png" alt="AWS DOP" class="rounded-lg size-96 my-5">
</a>
<p class="image-comment">Of the DOP, By the DOP, For the DOP</p>

AWSのDevOpsサービスを理解するために、[DOP試験で扱われる6つのドメイン](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-devops-pro/AWS-Certified-DevOps-Engineer-Professional_Exam-Guide.pdf)をざっくりまとめてみたいと思う。

未入力状態のサービスも今後追加していきたい。

- 1\. SDLC自動化<a id="index1" href="#content1" class="jump-guide">[go]</a>

- 2\. IaC<a id="index2" href="#content2" class="jump-guide">[go]</a>

- 3\. Cloud solution<a id="index3" href="#content3" class="jump-guide">[go]</a>

- 4\. Monitoring & Logging<a id="index4" href="#content4" class="jump-guide">[go]</a>

- 5\. Incident & Event<a id="index5" href="#content5" class="jump-guide">[go]</a>

- 6\. Security & Compliance<a id="index6" href="#content6" class="jump-guide">[go]</a>

<br />

## 1\. SDLC<a id="aid1" href="#ref1" class="jump-guide">[1]</a>自動化<a id="content1" href="#index1" class="jump-guide">return ↩</a>

### <div id="codebuild" class="jump-center">CodeBuild</div>

<details>
  <summary>
    アーキテクチャ
  </summary>
  <a class="image-link-container" href="https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/concepts.html">
    <img src="/dop/codebuild-arch.png" alt="AWS CodeBuild" class="rounded-lg my-5">
  </a>
</details>

\* [buildspec.yml](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-syntax)を用いる

- ↪︎ ソースディレクトリのルートに配置
- ↪︎ [`version{:sh}`, `run-as{:sh}`, `env{:sh}`, `proxy{:sh}`, `batch{:sh}`, `phases{:sh}`, `reports{:sh}`, `artifacts{:sh}`, `cache{:sh}` シーケンスが存在](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-syntax)
  | シーケンス | Note |
  | :-------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
  | [env/parameter-store](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.parameter-store)|- CodeBuildサービスロールに[`ssm:GetParameters{:gg}`を追加](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/setting-up-service-role.html)し<a href="#ssm">SSM</a> Parameter Storeに保存されているカスタム環境変数を取得|
  | [env/secrets-manager](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.secrets-manager) |- <a href="#secretsmanager">Secrets Manager</a>に保存されているカスタム環境変数を取得
  | [phases/install](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.phases.install) |- インストール時に実行するコマンドなどを記述 |
  | [phases/pre_build](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.phases.pre_build) |- ビルドの前に実行するコマンドをなど記述 |
  | [phases/build](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.phases.build) |- ビルド中に実行するコマンドをなど記述 |
  | [phases/post_build](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.phases.post_build) |- ビルドの後に実行するコマンドをなど記述<br />- Amazon SNSを介してのビルド結果通知など |
  | [phases/\*/commands](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.phases.install.commands) | - `install{:gg}`はオプションだが、他のシーケンスでは必須
  | [phases/\*/finally](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.phases.finally) |- オプションブロック<br />- `finally{:gg}`ブロックは`commands{:gg}`ブロックの実行後に実行される<br />- `commands{:gg}`ブロックが失敗しても実行される<br />- `commands{:gg}`, `finally{:gg}`両ブロックが成功したらフェーズが成功
  | [artifacts/files](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.artifacts.files) |- アーティファクトの出力先をなど記述<br />- S3バケットへ渡すなど |
  | [cache/paths](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#build-spec.cache.paths) |- キャッシュの場所を記述 |
- ↪︎ `buildspec.yml{:gg}`の代わりにCodeBuildまたは<a href="#codepipeline">CodePipeline</a>のコンソールを使い`build{:sh}`, `artifacts{:sh}`を使える

\* ビルドの情報はCodeBuild(要約)や<a href="#cloudwatch">CloudWatch</a> Logs(詳細)に転送される

\* <a href="#codepipeline">CodePipeline</a>を使ってのビルドの場合はCodePipelineで制限されたビルド情報を確認できる

\* ビルドのソースはGitHub, <a href="#s3">S3</a>などから取得できる

\* 連携: <a href="#codedeploy">CodeDeploy</a>, <a href="#s3">S3</a>, <a href="#cloudwatch">CloudWatch</a>, <a href="#iam">IAM</a>, <a href="#secretsmanager">Secrets Manager</a>, <a href="#ssm">SSM</a>, etc.

<br />

### <div id="codedeploy" class="jump-center">CodeDeploy</div>

\* [appspec.yml](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/reference-appspec-file.html)を用いる

- ↪︎ `BeforeInstall{:sh}`, `AfterInstall{:sh}`, `ApplicationStart{:sh}`, `ApplicationStop{:sh}` hooksが存在

\* <a href="#ec2">EC2</a>/On-premises(オンプレミス), <a href="#ecs">ECS</a>, <a href="#lambda">Lambda</a>にデプロイ可能

- ↪︎ EC2/On-premises

  - ↪︎ EC2/On-premisesにデプロイする場合は[CodeDeploy Agent](https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent.html)が必要

  - ↪︎ [デプロイ設定(In-place, Blue/green)](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html#deployment-configuration-server)
    |項目|Note|
    |:--|:--|
    |CodeDeployDefault.<br />AllAtOnce|- In-place: 同時に全部デプロイ<br />&nbsp;↪︎ ex) 9つのインスタンスデプロイ時1つでも成功すればデプロイ成功, すべて失敗すればデプロイ失敗<br />- Blue/green:<br />&nbsp;↪︎ Deployment to replacement environment: in-placeと同じ<br />&nbsp;↪︎ Traffic rerouting: トラフィックが少なくとも一つのインスタンスにrerouting成功したら成功, 全てが失敗したら失敗|
    |CodeDeployDefault.<br />HalfAtATime|- In-place: 同時に最大で50%のインスタンスをデプロイ(切り捨て)<br />&nbsp;↪︎ ex) 9つのインスタンスデプロイ時1回で最大4つ(切り捨て)のインスタンスをデプロイ. 5つ以上のインスタンスデプロイに成功すれば成功 or 失敗<br /><details><summary>Note</summary>Multiple ASG環境でのデプロイ時CodeDeployはインスタンスが所属しているASGに関係なく同じく50%のデプロイをする<br />&nbsp;↪︎ ex)それぞれ10個のインスタンスを持つ2つのASGのASG1, ASG2がある時, CodeDeployはASG1の10個を1回目でデプロイする可能性があり, このデプロイの成功で50%に達したため<span class="underline decoration-wavy font-bold">成功と見なされる可能性がある</span></details>- Blue/green:<br />&nbsp;↪︎ Deployment to replacement environment: in-placeと同じ<br />&nbsp;↪︎ Traffic rerouting: インスタンスの最大50%のトラフィックをroutingし, 最低で50%のreroutingに成功すれば成功 or 失敗|
    |CodeDeployDefault.<br />OneAtATime|- In-place: 一度に1つのインスタンスをデプロイするが例外あり<br />&nbsp;↪︎ ex) 9つのインスタンスデプロイ時に一度に1つのインスタンスをデプロイするが, 最後の1つのインスタンスデプロイは失敗しても成功となる. 最後のインスタンスを除いては1つでも失敗したら失敗となる<br />&nbsp;&nbsp;↪︎ 1度に1つのインスタンスのみオフラインになるため<br />&nbsp;↪︎ ex) 1つのインスタンスの場合は1つのインスタンスデプロイ成功時, 成功<br />- Blue/green:<br />&nbsp;↪︎ Deployment to replacement environment: in-placeと同じ<br />&nbsp;↪︎ Traffic rerouting: 新しい環境のインスタンス1つにトラフィックを1回ずつreroutingし, 全てのトラフィックがreroutingされると成功, 例外に最後のインスタンスは失敗しても成功となる(In-place同様)|

- ↪︎ <a href="#ecs">ECS</a>

  - ↪︎ [デプロイ設定(Blue/green)](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html#deployment-configuration-ecs)
    | 項目 | Note |
    | :------------------------------------------------ | :----------------------------------------------- |
    | CodeDeployDefault.<br />ECSLinear<br />10PercentEvery1Minutes | 1分に10%ずつシフト|
    | CodeDeployDefault.<br />ECSLinear<br />10PercentEvery3Minutes | 3分に10%ずつシフト|
    | CodeDeployDefault.<br />ECSCanary<br />10Percent5Minutes | はじめに10%をシフトし, 5分後に残りの90%をシフ|
    | CodeDeployDefault.<br />ECSCanary<br />10Percent15Minutes | はじめに10%をシフトし, 15分後に残りの90%をシフト|
    | CodeDeployDefault.<br />ECSAllAtOnce | トラファックを一気に新しいECS containerにシフト<br />(ALB, NLB)<details><summary>Note</summary>Network Load Balancer使用時は`CodeDeployDefault.ECSAllAtOnce{:gg}`のみ使用可能</span></details>|

- ↪︎ Lambda

  - ↪︎ [デプロイ設定(Blue/green)](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html#deployment-configuration-lambda)
    | 項目 | Note |
    | :------------------------------------------------ | :----------------------------------------------- |
    |CodeDeployDefault.<br />LambdaLinear<br />10PercentEvery1Minute|1分に10%ずつシフト|
    |CodeDeployDefault.<br />LambdaLinear<br />10PercentEvery2Minutes|2分に10%ずつシフト|
    |CodeDeployDefault.<br />LambdaLinear<br />10PercentEvery3Minutes|3分に10%ずつシフト|
    |CodeDeployDefault.<br />LambdaLinear<br />10PercentEvery10Minutes|10分に10%ずつシフト|
    |CodeDeployDefault.<br />LambdaCanary<br />10Percent5Minutes|はじめに10%をシフトし, 5分後に残りの90%をシフト|
    |CodeDeployDefault.<br />LambdaCanary<br />10Percent10Minutes|はじめに10%をシフトし, 10分後に残りの90%をシフト|
    |CodeDeployDefault.<br />LambdaCanary<br />10Percent15Minutes|はじめに10%をシフトし, 15分後に残りの90%をシフト|
    |CodeDeployDefault.<br />LambdaCanary<br />10Percent30Minutes|はじめに10%をシフトし, 30分後に残りの90%をシフト|
    |CodeDeployDefault.<br />LambdaAllAtOnce|トラファックを一気に新しいLambda functionsにシフト|

\* <a href="#cloudwatch">CloudWatch</a>(Alarms, Logs, Events(→ EventBridge)), <a href="#CloudTrail">CloudTrail</a>(Log Monitoring), <a href="#sns">SNS</a>でモニタリング可能

- ↪︎ [CloudWatch](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-cloudwatch.html)

- ↪︎ [CloudTrail](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-cloudtrail.html)

- ↪︎ [SNS](https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-sns-event-notifications.html)

\* 簡略まとめ

- |              | In-place |   Blue/green   |     Canary     |
  | :----------- | :------: | :------------: | :------------: |
  | Downtime     |    大    |    中 ~ 少     | 無(設定による) |
  | Rollback     |    難    |       速       |       速       |
  | Deploy Spped |    速    | 速(設定による) |       遅       |

<br />

### <div id="codecommit" class="jump-center">CodeCommit</div>

\* 公式的な新規使用は[2024.07.25に停止](https://aws.amazon.com/jp/blogs/devops/how-to-migrate-your-aws-codecommit-repository-to-another-git-provider/)されてあるが,まだ既存顧客は使用可能(2025.03.27基準)

\* [CodeCommitと言うサービス名から,Git基盤のAWS Fully Managedサービスであるコト,コードのSourceとして使われる機能であることは熟知する必要あり](https://docs.aws.amazon.com/codecommit/latest/userguide/getting-started-cc.html)

<br />

### <div id="ec2" class="jump-center">Elastic Compute Cloud(EC2)</div>

\* [User data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html)

- ↪︎ CLIもしくは他のAWS serviceから使う場合は`Base64 encoding{:gg}`が必要<a id="aid2" href="#ref2" class="jump-guide">[2]</a>
- ↪︎ `terraform{:sh}`の`provisioner{:sh}`と似ている

<br />

### <div id="ecs" class="jump-center">Elastic Container Service(ECS)</div>

\* ECS task definitionのイメージはECR, Docker hubの他にもプライベートレポジトリから取得可能

<br />

### <div id="ec2imagebuilder" class="jump-center">EC2 Image Builder</div>

### <div id="s3" class="jump-center"> Simple Storage Service(S3)</div>

### <div id="s3glacier" class="jump-center">S3 Glacier</div>

### <div id="ecr" class="jump-center">Elastic Container Registry(ECR)</div>

### <div id="eks" class="jump-center">Elastic Kubernetes Service(EKS)</div>

### <div id="lambda" class="jump-center">Lambda</div>

### <div id="efs" class="jump-center">Elastic File System(EFS)</div>

### <div id="ebs" class="jump-center">Elastic Block Store(EBS)</div>

### <div id="iam" class="jump-center">Identity and Access Management(IAM)</div>

### <div id="codeartifact" class="jump-center">CodeArtifact</div>

### <div id="codepipeline" class="jump-center">CodePipeline</div>

### <div id="codeguru" class="jump-center">CodeGuru</div>

### <div id="cli" class="jump-center">Command Line Interface(CLI)</div>

### <div id="codestar" class="jump-center">CodeStar</div>

### <div id="sdk" class="jump-center">Software Development Kit(SDK)</div>

<br />

## 2\. IaC<a id="content2" href="#index2" class="jump-guide">return ↩</a>

### <div id="cfn" class="jump-center">CloudFormation(CFN)</div>

<details>
  <summary>
    ダイアグラム
  </summary>
  <a class="image-link-container" href="https://aws.amazon.com/jp/cloudformation/">
    <img src="/dop/cloudformation-diagram.png" alt="AWS CloudFormation" class="rounded-lg my-5">
  </a>
</details>

\* [テンプレート(Templates)](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-overview.html#cfn-concepts-templates)

- ↪︎ CloudFormationがAWS resourcesを生成するために参照するblueprint
- ↪︎ `YAML{:sh}` or `JSON{:sh}`形式で、`.yaml{:gg}`, `.json{:gg}`, `.template{:gg}`, `.txt{:gg}`拡張子で使用可能
- ↪︎ [CloudFormation consoleでも作成可能](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stack.html#create-stack)
- ↪︎ [Parameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html)
  - ↪︎ [Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-supplied-parameter-types.html)が存在
- ↪︎ その他の[section](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html)についてはリンク参照
  - ↪︎ [Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html)([Intrinsic function](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html))や[擬似パラメータ(Pseudo parameters)](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html)使用可能

\* [スタック(Stacks)](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-overview.html#cfn-concepts-stacks)

- ↪︎ CloudFormation templateによって生成されたAWS resources<a id="aid3" href="#ref3" class="jump-guide">[3]</a>(EC2, S3, RDSなどの)の集合
- ↪︎ 環境を手動ではなく, コード(Infrastructure as Code, IaC)で管理することで自動化および再利用が容易になる
- ↪︎ [スタック変更失敗時のためのオプションは, Retry, Update, Roll back](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stack-failure-options.html#stack-failure-options-overview)がある
- ↪︎ [Stack Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_StackInstance.html)
  - ↪︎ StackSetのStackを参照(reference)する概念
    - ↪︎ Stack InstanceがあるからといってStackが必ず存在するわけではない

\* [変更セット(Change sets)](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-overview.html#cfn-concepts-change-sets)

<details>
  <summary>
    ダイアグラム
  </summary>
  <a class="image-link-container" href="https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-overview.html#cfn-concepts-change-sets">
    <img src="/dop/cloudformation-change-set-diagram.png" alt="AWS CloudFormation Change Set" class="rounded-lg my-5">
  </a>
</details>

- ↪︎ 既に存在するCloudFormation templateを更新する際に変更内容を確認(差分確認など)できる
- ↪︎ 確認後, [`execute-change-set{:sh}`コマンド](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets-execute.html)で実行可能
- ↪︎ `terraform plan{:sh}`と似ている

\* Reference

- | Content                                                                                                                                               |
  | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
  | [AWS::IAM::Role](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html)                                           |
  | [AWS::IAM::Policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-policy.html)                                       |
  | [AWS::CloudFormation::CustomResource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-customresource.html) |
  | [CreationPolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html)                          |
  | [UpdatePolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html)                              |
  | [DeletionPolicy attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html)                          |
  | [Transform](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-reference.html)
  | [CloudFormation helper scripts](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-helper-scripts-reference.html)
  | [Stack policies](https://docs.aws.amazon.com/prescriptive-guidance/latest/least-privilege-cloudformation/cloudformation-stack-policies.html) |

\* 連携: <a href="#servicecatalog">Service Catalog</a>, <a href="#s3">S3</a>, <a href="#cloudwatch">CloudWatch</a>, <a href="#iam">IAM</a>, <a href="#secretsmanager">Secrets Manager</a>, <a href="#ssm">SSM</a>, etc.

<br />

### <div id="ssm" class="jump-center">Systems Manager(SSM)</div>

\* SSM Agent

- ↪︎ インスタンスとSSMが通信できるようにするAgent
- ↪︎ 多くのAmazon Linux, Ubuntu, Windows AMIには[プレインストールされている](https://docs.aws.amazon.com/systems-manager/latest/userguide/ami-preinstalled-agent.html)

\* Documents

- ↪︎ `JSON{:sh}`, `YAML{:sh}`形式のテンプレートで,SSMを使って行える作業を文書化(標準化)できる
- ↪︎ [AppConfig, Automation runbook(Automation, State Manager, Maintenance Windows), CloudFormation templateなど](https://docs.aws.amazon.com/systems-manager/latest/userguide/documents.html#what-are-document-types)を使用可能
  - ↪︎ [Automationのaction](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-actions.html)で[`Run command{:sh}`を使える](https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-action-runcommand.html)
- ↪︎ [AWSが公式でメンテナンスするDocumentが豊富](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-ssm-documents.html)
  - ↪︎ `AWS-ConfigureWindowsUpdate{:gg}`, `AWS-RunPatchBaseline{:gg}`, `AWS-StartInteractiveCommand{:gg}`など
- ↪︎ 出題ポイントとは違うと思うが, [CDK](https://github.com/aws/aws-cdk)を使って[定義 & デプロイも可能](https://github.com/cdklabs/cdk-ssm-documents)

\* Session Manager

- ↪︎ インスタンスとSSH無しでもConsole, CLI接続ができる
  - ↪︎ Bastion無し
  - ↪︎ [ポートを開ける必要がないのでセキュリティに役立つなど](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html#session-manager-benefits)
- ↪︎ [Patch Managerと違ってCloudWatch Logs(+S3)でlogging可能](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-logging.html)

\* Run Command

- ↪︎ 複数のインスタンスにSSH無しでも[同時にコマンドを実行可能](https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html)

\* <span id="ssm-parameter-store" class="jump-center">Parameter Store</span>

- ↪︎ アプリケーションの[構成データ,シークレット情報などを階層構造で保存](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)できる
- ↪︎ KMSサポート
- ↪︎ バージョン管理可能
- ↪︎ [Parameter Policies](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-policies.html)を使うためには[Advanced tier](https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html)が必要
  - ↪︎ `Expiration{:gg}`, `ExpirationNotification{:gg}`, `NoChangeNotification{:gg}`
- ↪︎ <a href="#secretsmanager">Secrets Manager</a>と使い分ける
- | 条件                                   | オススメサービス                                                                                                     |
  | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
  | シークレットの自動ローテーション       | [Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_turn-on-for-other.html) |
  | コストを抑えたい                       | Parameter Storea(Standard)                                                                                           |
  | 単純な設定値だけどセキュリティが必要   | Parameter Store SecureString                                                                                         |
  | CI/CD pipelineで敏感な構成を注入したい | 両方とも可能                                                                                                         |

\* Patch Manager

- ↪︎ [インスタンス,OSのパッチを自動化](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html)できる
- ↪︎ コンプライアンスレポーティング(Compliance reporting)
  - ↪︎ Maintenance Windowsの`Scan{:gg}` or `Install{:gg}`タスクによりターゲットで指定されたノードのPatch baselineを確認
  - ↪︎ `csv{:sh}`形式のパッチコンプライアンスレポートをS3 bucketに出力可能
  - ↪︎ レポートは1回のみでも,定期的にでも出力可能
  - ↪︎ [レポートはQuickSightなどで分析可能](https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager-compliance-reports.html)
- ↪︎ ex) 全てのインスタンスはリリースから3日が経ったパッチだけをインストールしたい
  - ↪︎ Patch baselineで[`ApproveAfterDays{:gg}`](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_PatchRule.html)=3設定

\* State Manager

- ↪︎ [インスタンスの構成状態を維持,持続的な管理](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-state.html)が可能

\* Inventory

- ↪︎ [インスタンスの情報を自動的に取得](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html)できる
  - ↪︎ 管理ノードのMetadataのみ収集
- ↪︎ Athena, EventBridgeと連携可能

\* AppConfig

- ↪︎ [アプリケーション構成(設定など)を安全に生成,管理,デプロイすることが可能](https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html)

<br />

### <div id="sam" class="jump-center">Serverless Application Model(SAM)</div>

\* [template.yml](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification.html)を用いる

- ↪︎ テンプレートで簡単にAWS resource(Lambda, API Gateway, etc.)を定義できる

\* CloudFormation基盤なのでStack関連機能を使える

\* [`sam local{:sh}`](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html)を使ってローカル環境で開発できる

- <details>
    <summary>
      Demo
    </summary>
    <a class="image-link-container" href="https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam-overview.html">
      <img src="/dop/sam-what-is-sam-local.gif" alt="AWS SAM local" class="rounded-lg my-5">
    </a>
  </details>

\* [`sam sync{:sh}`](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-sync.html)をCloudFormation Stackを全部redeployせず変更があったresourceだけアップデートできる(`sam deploy{:sh}`との違い)

- <details>
    <summary>
      Demo
    </summary>
    <a class="image-link-container" href="https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam-overview.html">
      <img src="/dop/sam-what-is-sam-sync.gif" alt="AWS SAM sync" class="rounded-lg my-5">
    </a>
  </details>

<br />

### <div id="cdk" class="jump-center">Cloud Development Kit(CDK)</div>

<details>
    <summary>
      Concept
    </summary>
    <a class="image-link-container" href="https://docs.aws.amazon.com/cdk/v2/guide/home.html">
      <img src="/dop/cdk-app-stacks-concepts.png" alt="AWS CDK concepts" class="rounded-lg my-5">
    </a>
</details>

↪︎ App / Stack(s) / [Construct](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html)構造

\* [Programming language(TypeScript, JavaScript, Python, Java, C#, Go)で作成したコード](https://docs.aws.amazon.com/cdk/v2/guide/home.html#home-example)がCloudFormaitonテンプレートに変換

- ↪︎ [`cdk synth{:sh}`でCloudFormationテンプレートを生成して,`cdk deploy{:sh}`でdeploy可能](https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html#hello_world_synth)
  - ↪︎ YAMLを使わない

<br />

### <div id="secretsmanager" class="jump-center">Secrets Manager</div>

\* <a href="#ssm-parameter-store">SSM Parameter Store</a>と使い分ける

<br />

### <div id="servicecatalog" class="jump-center">Service Catalog</div>

<details>
  <summary>
    User Workflow
  </summary>
  <a class="image-link-container" href="https://docs.aws.amazon.com/servicecatalog/latest/adminguide/what-is_concepts.html#admin-overview-view-provision">
    <img src="/dop/service-catalog-end-user-workflow.png" alt="AWS Service Catalog" class="rounded-lg my-5">
  </a>
</details>

\* 組織内で承認されたリソースを標準化してデプロイ可能

- ↪︎ 意図しない変更によるセキュリティ問題,開発者(ユーザー)のAWSへの負荷を軽減でき,コスト管理が用意になる

\* [Products](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/what-is_concepts.html#what-is_concepts-product)

- ↪︎ デプロイされるAWS Resource
- ↪︎ CloudFormation Templateのこと

\* [Provisioned Products](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/what-is_concepts.html#what-is_concepts-provprod)

- ↪︎ Service Catalogを使ってデプロイされたProducts
- ↪︎ CloudFormation Stackのこと

\* [Portfolios](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/what-is_concepts.html#what-is_concepts-portfolio)

- ↪︎ Productsの集合(collection)
- ↪︎ 他のAWSアカウントにも提供可能

\* [Permissions](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/what-is_concepts.html#what-is_concepts-permissions)

- ↪︎ IAMを使ってユーザーのPortfolioへのアクセスを制御可能

\* [Constraints](https://docs.aws.amazon.com/servicecatalog/latest/adminguide/what-is_concepts.html#what-is_concepts-constraints)

- | Constraint               | Note                                    |
  | :----------------------- | :-------------------------------------- |
  | Launch constraints       | IAM権限など                             |
  | Notification constraints | AWS SNS topicを使ってStack eventsの管理 |
  | Template constraints     | CFN templateへのカスタマイズを提供      |

<br />

### <div id="stepfunctions" class="jump-center">Step Functions</div>

\* 分散アプリケーションの各段階をビジュアル化(visualize),プロセスの自動化,マイクロサービスのオーケストレーションするワークフロー([Workflows](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html#welcome-workflows)/[State machines](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-statemachines.html))を提供

- <details>
      <summary>
        Visualization example
      </summary>
      <a class="image-link-container" href="https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html">
        <img src="/dop/step-functions-example.png" alt="AWS Step Functions example" class="rounded-lg my-5">
      </a>
  </details>

\* [Use cases](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html#welcome-workflows)

- <details>
    <summary>
      ユースケース図
    </summary>
    <a class="image-link-container" href="https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html#application">
      <img src="/dop/step-functions-use-case-examples.png" alt="AWS Step Functions use cases" class="rounded-lg my-5">
    </a>
  </details>

\* [Workflows types比較](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html#welcome-workflows)

- |          | Standard                     | Express                     |
  | -------- | :--------------------------- | :-------------------------- |
  | 実行時間 | 最大1年                      | 最大5分                     |
  | 実行速度 | 1秒に2,000回                 | 1秒に100,000回              |
  | 実行保証 | 1回(Exactly-once)            | 最低1回(At-least-once)      |
  | 実行履歴 | Step Functionsで確認可能     | CloudWatch Logsから確認可能 |
  | コスト   | 状態遷移数(state transition) | 実行時間 + 回数             |
  - ↪︎ 長期ワークフロー → Standard
  - ↪︎ 高速処理/大容量イベント → Express

<br />

### <div id="eb" class="jump-center">Elastic Beanstalk(EB)</div>

\* [Application](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts-application)

- ↪︎ Elastic Beanstalkのcomponentsを論理的に集めた(a logical collection)もの
- ↪︎ Environments, Versions, and Environment configurationsを含む
- ↪︎ Elastic BeanstalkでApplicationは概念的にフォルダーのようなもの

\* [Application version](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts-version)

- ↪︎ 特定バージョンのラベルがついてデプロイ可能なアプリケーションのコード
- ↪︎ 実際はコード入っているS3 objectを指す

\* [Environment](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts-environment)

- ↪︎ Application versionを実行するAWS resourceの集合
- ↪︎ Environmentを生成するとElastic Beanstalkは指定されたバージョンのアプリケーションが実行できるAWS resourceを自動でprovisioning

\* [Environment tier](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts-tier)

- | Tier                                                                                                          | Note                                                           |
  | :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------- |
  | [Web Server Environment Tier](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts-webserver.html) | HTTPリクエストを処理する環境                                   |
  | [Worker Environment Tier](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts-worker.html)        | Amazon SQS queueからタスクを持ってきて処理するバックエンド環境 |

\* [Environment configuration](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts-environmentconfig)

- ↪︎ 環境及びリソースを構成するパラメータと設定の集合
- ↪︎ Environment Configurationを変更するとElastic Beanstalkが自動で反映

\* [Saved configuration](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts-configuration)

- ↪︎ ユニークな環境構成のためのテンプレート
- ↪︎ API及びAWS CLIでは保存された構成を`configuration templates{:gg}`と呼ぶ

\* [Platform](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html#concepts-platform)

- ↪︎ PlatformはOS, programming language runtime, web server, application server, そしてElastic Beanstalk componentsを合わせた概念

\* [デプロイ設定](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html#environments-cfg-rollingdeployments-console)

- | Policy                              | Note                                                                                                                                                                    |
  | :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | All at once                         | - 新しいバージョンを全てのインスタンスに同時にデプロイ<br />- デプロイ中に環境の全てのインスタンスがサービスから除外される(downtime)                                    |
  | Rolling                             | - 新しいバージョンがBatch(グループのような概念)に別れてデプロイ<br />- 各Batchごとにサービスから除外されるためデプロイ中にはBatchのインスタンス分処理量が減ることになる |
  | Rolling<br /> with additional batch | - 新しいバージョンがBatch(グループのような概念)に別れてデプロイされるが, デプロイ前にまず追加の新しいBatchを始めてデプロイ中にも処理量が維持される                      |
  | Immutable                           | - [Immutable update](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environmentmgmt-updates-immutable.html)により新しいインスタンスをデプロイ後切り替える       |
  | Traffic splitting                   | - 新しいバージョンを新しい環境にデプロイ後, トラフィックを指定に比率で分配                                                                                              |

\* [デプロイ比較](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html)

- |                 Method                 |                      デプロイ失敗による影響                       |                       デプロイ所要時間                       | Zero downtime | DNS変更 |                 Rollback方法                 |       デプロイ先        |
  | :------------------------------------: | :---------------------------------------------------------------: | :----------------------------------------------------------: | :-----------: | :-----: | :------------------------------------------: | :---------------------: |
  |              All at once               |                           Downtime発生                            |                              ⏳                              |      ❌       |   🟢    |                 手動redeploy                 |    既存インスタンス     |
  |                Rolling                 | - 1つのBatch分サービスから除外<br />- 失敗前のBatchはデプロイ成功 |   ⏳⏳<a id="aid4" href="#ref4" class="jump-guide">[4]</a>   |      🟢       |   🟢    |                 手動redeploy                 |    既存インスタンス     |
  | Rolling<br /> with an additional batch |  - 最初のBatch失敗時に最小化<br />- そうでなければRollingと類似   |  ⏳⏳⏳<a id="aid4" href="#ref4" class="jump-guide">[4]</a>  |      🟢       |   🟢    |                 手動redeploy                 | 既存 + 新規インスタンス |
  |               Immutable                |                              最小限                               |                           ⏳⏳⏳⏳                           |      🟢       |   🟢    |             新規インスタンス終了             |    新規インスタンス     |
  |           Traffic splitting            |   新規インスタンスに向かう<br />指定の比率のトラフィックに影響    | ⏳⏳⏳⏳<a id="aid5" href="#ref5" class="jump-guide">[5]</a> |      🟢       |   🟢    | トラフィックRerouting + 新規インスタンス終了 |    新規インスタンス     |
  |               Blue/green               |                              最小限                               |                           ⏳⏳⏳⏳                           |      🟢       |   ❌    |                   URL変更                    |    新規インスタンス     |

\* 簡略まとめ

- ↪︎ Blue/greenは他の方式と違って2つの環境を運用することになるためDNSの変更(CNAME Swap)が発生し,別途Route 53を設定しない限りBlue(old)からGreen(new)へ一気に切り替わる
- ↪︎ Traffic splittingはALB(EC2, ECS, EB), API Gateway Canary(Serverless)を使ってトラフィックを分配し,段階的に移行できる
  - ↪︎ ex) Stage 1(90%/10%) → Stage 2(50%/50%) → Stage 3(0%/100%)

<br />

### Config

### Organizations

### SCP

### Control Tower

<br />

## 3\. Cloud solution<a id="content3" href="#index3" class="jump-guide">return ↩</a>

### <div id="apigateway" class="jump-center">API Gateway</div>

\* [REST](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html)/[HTTP](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)/[WebSocket](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html) APIを生成,デプロイ,管理できる

\* Fully ManagedサービスであるためIAMやCognitoなどのAWS認証サービスとも統合可能(Authorization/Authentication)

\* CI/CD統合やバージョン管理可能

<br />

### DynamoDB

### Relational Database Service(RDS)

### Aurora

### Redshift

### Route 53

### CloudFront

### Fargate

### Load Balancers(ALB, NLB, CLB)

### Elastic Disaster Recovery(DRS)

### Athena

<br />

## 4\. Monitoring & Logging<a id="content4" href="#index4" class="jump-guide">return ↩</a>

### <div id="cloudwatch" class="jump-center">CloudWatch</div>

### CloudTrail

### KMS

### Kinesis Data Firehose

### Kinesis Data Streams

### OpenSearch Service

### Inspector

### QuickSight

### X-Ray

### Simple Notification Service(SNS)

### Auto Scaling groups(ASG)

<br />

## 5\. Incident & Event<a id="content5" href="#index5" class="jump-guide">return ↩</a>

### EventBridge

### Health

### Simple Queue Service(SQS)

### Auto Scaling

<br />

## 6\. Security & Compliance<a id="content6" href="#index6" class="jump-guide">return ↩</a>

### Cognito

### VPC

### Multi-Factor Authentication(MFA)

### Security Token Service(STS)

### Access control list(ACL)

### Network Firewall

### Web Application Firewall(WAF)

### Shield

### Security Hub

### Detective

### Directory Service

### Macie

### Certificate Manager(ACM)

### GuardDuty

### Trusted Advisor

---

1: Systems development life cycle, [SDLC(ソフトウェア開発ライフサイクル)とは何ですか?](https://aws.amazon.com/jp/what-is/sdlc/)<a id="ref1" href="#aid1" class="jump-guide">return ↩</a>

2: [ref.1: Base64 encoding](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html#user-data-base64-encoding), [ref.2: Base64 encoded UserData property](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-general.html#scenario-userdata-base64)<a id="ref2" href="#aid2" class="jump-guide">return ↩</a>

3: [AWS resource and property types reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html)<a id="ref3" href="#aid3" class="jump-guide">return ↩</a>

- ```sh
  service-provider::service-name::data-type-name
  ```

4: Batchサイズによる<a id="ref4" href="#aid4" class="jump-guide">return ↩</a>

5: evaluation timeオプションによる<a id="ref5" href="#aid5" class="jump-guide">return ↩</a>
