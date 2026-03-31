# Grape TECH

## 文档定位

`TECH.md` 是 `SPEC.md` 的技术落地文档。

它不重复产品愿景，而是回答下面这些实现层问题：

- Grape 第一版采用什么技术栈
- 哪些依赖可以进入项目，哪些当前明确不选
- 应用按什么分层组织
- 数据如何建模、持久化和演进
- Git 底层通过什么方式调用，如何把命令行结果转成 GUI 可用状态
- 哪些设计是当前已锁定决策，哪些只是为未来扩展预留接口

这份文档服务两个目标：

- 为第一版实现提供稳定、可执行的技术基线
- 为后续能力扩展保留一致的数据和架构边界

文档中的“长期扩展位”不是当前承诺的功能清单，只表示今天的设计不会把未来路线堵死。

## 已锁定基线

- 平台：仅 macOS
- 最低系统版本：macOS 15+
- UI 主栈：SwiftUI + AppKit bridge
- Git 引擎：system git CLI
- 本地数据层：SQLite + GRDB
- 仓库模型：第一版只服务单活跃仓库，但所有持久化记录保留 `RepositoryID`

## 技术原则

- 原生优先：界面、窗口、输入反馈和系统集成都以 macOS 原生能力为第一选择。
- 系统 Git 优先：优先复用用户机器上的 Git、credential helper 与 Keychain，不在第一版重造 Git 运行时。
- 第三方依赖最小化：只引入明确降低复杂度、且不会改变产品定位的库。
- 单仓库体验优先：先把单仓库日常工作流做扎实，再为未来扩展保留键空间和抽象。
- 危险操作必须可解释可回退：所有可能丢改动、改引用、切分支失败的行为都要先收集上下文，再做解释和确认。
- 结构化状态优先于字符串拼接：Git 输出要尽快解析为类型化状态，UI 不直接消费原始命令行文本。

## 技术选型

### UI 与应用主栈

- `SwiftUI` 负责应用骨架、导航、主界面状态绑定和大部分交互界面。
- `AppKit` 通过 bridge 补足复杂桌面能力，重点覆盖：
  - 多栏窗口编排
  - 高密度列表和 outline/tree 视图
  - 更细粒度的文本与 diff 展示
  - 复杂快捷键、焦点与菜单命令
  - 原生窗口、sheet、panel 与 document-style 交互
- 状态管理采用 `Observation`，避免在应用刚起步时引入额外响应式框架。
- 异步任务、后台刷新、命令串行化采用 `Swift Concurrency`。
- 日志与可观测性采用 `OSLog`，按仓库、Git 操作、数据层和 UI 交互分子系统记录。

### 当前明确不选的主路线

- 不采用 `Electron` / `Tauri` 作为桌面外壳，避免偏离“macOS 原生”定位。
- 不采用 `libgit2` 作为第一版主 Git 引擎，避免和用户本机 Git 行为产生额外差异。
- 不采用 `Core Data` / `SwiftData` 作为主持久化路线，避免在 schema 可读性、迁移透明度和调试体验上引入额外不确定性。

### 长期扩展位

- 如果未来需要离线索引、全文检索或历史快照缓存，仍然优先在 SQLite 上扩表，而不是新增第二套持久化系统。
- 如果未来需要更细的 Git 能力抽象，扩展点应放在 `GitClient` 和命令解析层，不反向污染 UI。

## 依赖库清单

### Apple 原生框架

- `SwiftUI`
  - 主界面、状态驱动渲染、命令菜单和常规交互层。
- `AppKit`
  - 复杂桌面控件、窗口行为、原生菜单与精细输入控制。
- `Foundation`
  - 文件路径、进程调用、编码、日期、JSON、正则与通用基础设施。
- `Observation`
  - 应用状态与模型观察。
- `OSLog`
  - 结构化日志、调试与问题定位。
- `Swift Concurrency`
  - `async/await`、`Task`、actor 隔离、后台刷新和操作串行化。

### 第三方依赖

- `GRDB`
  - 作为 SQLite 访问层。
  - 负责 schema 建立、迁移、查询映射与事务控制。
  - 选用原因是轻量、透明、可控，且更适合把仓库状态和本地工作会话做成清晰的关系结构。

### 依赖准入原则

- 只有在明显减少实现复杂度、且不改变产品边界时才允许新增第三方依赖。
- UI 主题、状态管理、日志、网络层不预先引入额外框架。
- 与 Git 行为直接相关的核心逻辑默认自实现解析，不把命令输出解释权交给黑盒库。

## 架构分层

Grape 固定采用四层结构：Presentation、Application、Domain、Infrastructure。

### Presentation

职责：

- 渲染顶栏、三栏主界面、仓库入口页、冲突处理页和危险操作确认界面
- 接收用户动作并转成 application use case
- 展示类型化状态，不直接拼接 Git 原始输出

典型内容：

- SwiftUI views
- AppKit bridge views / controllers
- view models 或 screen state adapters

不负责：

- 直接运行 Git 命令
- 直接访问 SQLite
- 直接解析 patch 或 refs

### Application

职责：

- 编排用户动作对应的工作流
- 管理任务生命周期、串行化策略和刷新策略
- 组合 domain 规则与 infrastructure 能力

典型内容：

- 打开仓库
- 刷新工作区
- 创建提交
- 切换分支
- 拉取、推送、获取历史
- 进入与退出冲突处理

关键接口：

- `GitClient`
- `RepositoryStore`
- `SessionStore`
- `GitOperationQueue`

### Domain

职责：

- 定义仓库状态、改动、提交草稿、同步状态、冲突状态等核心类型
- 定义提交可用性、危险操作确认、分支切换前检查等规则
- 以纯模型和规则表达业务，不依赖 UI 或具体存储实现

典型内容：

- `WorkingTreeSnapshot`
- `CommitDraft`
- `SyncState`
- `ConflictSession`
- patch 选择结果与校验规则

### Infrastructure

职责：

- 封装 Git 进程执行
- 解析 Git 输出
- 持久化与迁移
- 文件系统监听
- 后台任务队列与缓存

典型内容：

- `GitCommandRunner`
- Git stdout/stderr parsers
- GRDB stores
- repository file watchers
- operation queue executors

### 能力归属

- Git 调用：Infrastructure
- 数据持久化：Infrastructure
- 文件系统监听：Infrastructure
- 后台任务队列：Infrastructure 提供执行能力，Application 决定调度策略
- 用户工作流编排：Application
- 状态规则与校验：Domain
- 界面呈现与交互：Presentation

## 核心接口

这些名字在后续实现中作为规范名固定下来。

### `GitCommandRunner`

职责：

- 以统一方式运行 Git 子进程
- 注入 `cwd`、环境变量、编码和超时策略
- 区分 stdout、stderr、exit code
- 返回结构化执行结果而不是裸字符串

### `GitOperationQueue`

职责：

- 保证同一仓库内的修改型 Git 操作串行执行
- 允许只读查询在安全范围内并发或去重
- 为 UI 暴露任务状态、取消状态和排队信息

### `GitClient`

职责：

- 对上层提供面向业务的 Git 能力接口
- 隐藏具体命令拼装与解析细节
- 统一把 Git 错误映射为应用错误类型

### `RepositoryStore`

职责：

- 管理仓库记录、最近仓库、引用缓存和必要索引
- 提供仓库存在性、可达性和最近打开状态查询

### `SessionStore`

职责：

- 管理工作区会话、提交草稿、界面恢复上下文和操作日志
- 为应用重启恢复提供最小必要状态

## 数据结构定义

### 通用约束

- 所有持久化记录必须携带 `RepositoryID`。
- `RepositoryID` 是内部稳定主键，不直接等同于文件路径。
- 文件路径可变化，仓库记录需要支持路径更新与失效标记。
- 凭证、token、私钥不进入 SQLite。

### 持久化模型

#### `RepositoryRecord`

用途：

- 持久化一个被 Grape 管理过的仓库。

核心字段：

- `repositoryID`
- `displayName`
- `canonicalPath`
- `gitDirectoryPath`
- `defaultBranchName`
- `lastOpenedAt`
- `availabilityStatus`
- `lastKnownHeadOID`

#### `RecentRepositoryEntry`

用途：

- 维护最近仓库列表与恢复顺序。

核心字段：

- `repositoryID`
- `openedAt`
- `pinState`
- `lastWindowLayoutVersion`

#### `WorkspaceSession`

用途：

- 保存当前工作区会话，支持应用重启恢复。

核心字段：

- `repositoryID`
- `sessionID`
- `selectedFilePath`
- `selectedHunkID`
- `draftCommitMessage`
- `activeSidebarContext`
- `lastRefreshedAt`

#### `OperationRecord`

用途：

- 记录关键 Git 操作及其结果，用于问题排查和用户反馈回放。

核心字段：

- `repositoryID`
- `operationID`
- `operationKind`
- `startedAt`
- `finishedAt`
- `resultStatus`
- `failureCategory`
- `summaryMessage`

#### 引用快照缓存

用途：

- 缓存分支、tag、远端追踪关系和最近图谱计算结果，减少重复解析。

建议拆分：

- `RefSnapshot`
- `RemoteTrackingSnapshot`
- `CommitGraphCacheEntry`

核心字段：

- `repositoryID`
- `snapshotVersion`
- `capturedAt`
- `payloadHash`

### 运行时模型

#### `WorkingTreeSnapshot`

用途：

- 表示某一时刻工作区、暂存区与 HEAD 的综合状态。

核心字段：

- `repositoryID`
- `headOID`
- `branchRef`
- `fileChanges`
- `stagedFileCount`
- `unstagedFileCount`
- `hasConflicts`
- `isClean`

#### `FileChange`

用途：

- 表示单个文件在工作区中的改动状态。

核心字段：

- `path`
- `oldPath`
- `changeKind`
- `indexStatus`
- `workTreeStatus`
- `isBinary`
- `hunks`

#### `HunkSelection`

用途：

- 表示用户在文件内部做出的结构化选择。

核心字段：

- `filePath`
- `hunkID`
- `selectionState`
- `selectedLineRanges`
- `patchFragment`

#### `CommitDraft`

用途：

- 表示当前提交输入区的状态。

核心字段：

- `repositoryID`
- `title`
- `body`
- `amendMode`
- `selectedChangeCount`
- `validationState`

#### `BranchRef`

用途：

- 表示本地分支、远端分支或 tag 的统一引用模型。

核心字段：

- `fullName`
- `shortName`
- `targetOID`
- `upstreamName`
- `aheadCount`
- `behindCount`
- `isCurrent`
- `isRemote`

#### `SyncState`

用途：

- 表示本地与远端同步关系。

核心字段：

- `repositoryID`
- `currentBranch`
- `fetchStatus`
- `aheadCount`
- `behindCount`
- `lastFetchAt`
- `lastPushAt`

#### `CommitGraphNode`

用途：

- 为提交关系图与最近历史提供统一节点结构。

核心字段：

- `oid`
- `parents`
- `authorName`
- `summary`
- `committedAt`
- `laneIndex`
- `decorations`

#### `ConflictSession`

用途：

- 表示一次冲突处理会话。

核心字段：

- `repositoryID`
- `sessionID`
- `triggerOperation`
- `conflictedFiles`
- `resolvedFiles`
- `baseCommitOID`
- `oursCommitOID`
- `theirsCommitOID`

#### 后台任务状态

建议统一为 `BackgroundTaskState`。

核心字段：

- `taskID`
- `repositoryID`
- `taskKind`
- `progressMessage`
- `startedAt`
- `isCancellable`
- `status`

## Git 底层调用逻辑

### 总体策略

- 所有 Git 行为统一走 `GitCommandRunner`。
- 每次调用都必须显式设置仓库 `cwd`，不依赖全局当前目录。
- 所有命令都要区分只读型与修改型。
- 同一仓库内的修改型操作必须通过 `GitOperationQueue` 串行化。
- stdout、stderr、exit code 必须完整采集并记录到结构化结果。
- 原始错误信息保留给日志，用户界面展示基于错误分类后的说明。

### 命令分类

只读型操作：

- 读取状态
- 读取 refs
- 读取 log / graph
- 检查冲突
- 检查远端跟踪关系

修改型操作：

- stage / unstage
- commit
- checkout / switch
- branch create / rename / delete
- pull
- push
- clone
- discard / restore
- merge conflict resolution 完成后的收尾操作

### 执行约束

- 命令执行前先确认仓库路径存在且可访问。
- 对可能改写工作区的操作，执行前先生成 preflight 检查结果。
- 同仓库禁止并发修改型命令，避免 index.lock、HEAD 变化与 UI 状态撕裂。
- 只读查询如果依赖修改后最新状态，应在对应修改任务完成后重新读取，不做乐观拼接。
- 长耗时操作要支持进度态与取消态，但取消只代表 UI 级别取消等待，不保证子进程一定安全中止。

### 输出处理

- `stdout` 用于结构化解析，进入 parser。
- `stderr` 原样保留用于日志与调试。
- `exit code` 决定成功、可恢复失败、不可恢复失败三大类分支。
- parser 输出的是 domain 类型或基础 DTO，不能直接把原始终端文本透传给 UI。

### 错误分类

Git 错误至少分成这些类别：

- 认证失败
- 网络失败
- 非快进失败
- 工作区脏导致操作被拒绝
- 引用不存在
- 仓库损坏或状态异常
- 冲突产生
- 用户取消
- 未知 Git 错误

所有错误最终都要转成“发生了什么 / 为什么 / 下一步怎么办”三段式用户提示。

### 认证策略

- 第一版不自建账号系统，不托管凭证。
- 认证完全委托给系统 Git、credential helper 和 Keychain。
- 应用层只负责识别认证失败并提示用户去系统链路解决。
- SQLite、日志和会话恢复中不保存密钥、密码或 token 明文。

## Git 命令基线

下面这些命令是第一版的事实来源，后续实现默认围绕它们建立解析器。

### 工作区状态

使用：

```bash
git status --porcelain=v2 -z --branch
```

原因：

- 输出稳定、适合机器解析
- 同时覆盖分支状态、index 状态和 worktree 状态
- `-z` 便于安全处理带空格和特殊字符的路径

### 分支与引用

优先使用：

```bash
git for-each-ref
```

配合格式化参数拉取：

- 本地分支
- 远端分支
- tag
- upstream
- ahead / behind 所需的引用上下文

原因：

- 输出可控，比分散解析多个 `branch` 变体更稳定

### 历史与关系图

优先使用：

```bash
git log
git rev-list
```

必要时附加格式化参数构造：

- 最近历史列表
- 提交详情
- 关系图节点
- parents 与 decorations

### 冲突状态

使用：

```bash
git ls-files -u
```

原因：

- 可直接读取 unmerged entries
- 适合建立冲突文件列表与三方元数据

### 同步

使用：

```bash
git fetch
git pull --ff-only
git push
```

策略：

- 第一版默认把 `pull` 收敛到 `--ff-only`，避免隐式 merge 改写历史
- 若无法 fast-forward，则回到明确提示与后续处理路径
- 推送前后都要重新读取 `SyncState`

### 提交与暂存

使用：

- `git add`
- `git restore --staged`
- `git commit`

具体调用由 `GitClient` 根据文件级或 hunk 级选择生成。

### 丢弃与恢复

优先使用：

- `git restore`
- 必要时补丁方式回滚局部改动

不直接暴露危险命令字符串给 UI。

## 部分提交与部分丢弃策略

第一版采用“补丁构造 + patch apply”路线，不依赖交互式 `git add -p` 自动化。

### 原因

- GUI 需要可重复、可预览、可回显的结构化 hunk 选择。
- `git add -p` 是为交互式终端设计的，不适合作为图形界面的稳定底层协议。
- 补丁构造路线更适合把“用户选择了哪些 hunk / 哪些行”保存为明确数据结构。
- 同一套 patch 构造能力可以复用到部分提交、部分丢弃和局部恢复。

### 实现思路

- 先读取完整 diff，解析成 `FileChange` 和 hunk 树。
- 用户选择后生成最小 patch。
- 对“部分提交”场景，将 patch 应用到 index。
- 对“部分丢弃”场景，将 patch 逆向应用到 worktree。
- 应用失败时，回退到明确错误提示，并要求刷新工作区状态。

### 约束

- 二进制文件不支持 hunk 级选择，只支持文件级操作。
- 发生冲突的文件不允许继续做细粒度 patch 选择，必须先进入冲突处理流。
- patch 结果必须在应用后重新读取工作区状态，不做本地假设更新。

## v1 关键场景的技术落地

### 恢复最近仓库

- 从 `RecentRepositoryEntry` 读取最近记录。
- 用 `RepositoryRecord` 校验路径可达性。
- 如果路径失效，标记 `availabilityStatus` 并回到仓库入口页。

### 打开或克隆仓库

- 打开本地仓库时先做仓库合法性检查，再写入 `RepositoryRecord` 和最近仓库记录。
- 克隆远端时通过 `GitOperationQueue` 执行修改型任务，完成后立即刷新 refs、工作区和会话。

### 刷新工作区

- 以 `git status --porcelain=v2 -z --branch` 为主事实源。
- 必要时补充 diff、refs 与 graph 查询，组装为 `WorkingTreeSnapshot`、`SyncState` 和右侧栏数据。

### 部分提交并完成 commit

- 从 hunk 选择生成 patch。
- 应用到 index 后重新读取工作区状态。
- 用 `CommitDraft` 校验提交说明与已选内容。
- 调用 `git commit`，成功后刷新历史、同步状态和提交区。

### 带未处理改动时切换分支

- 切换前先做 preflight 检查，判断是否会覆盖当前改动。
- 如果存在风险，则生成结构化警告信息并阻止直接切换。
- 用户确认返回后，界面保持在当前工作区上下文，不丢失草稿状态。

### 拉取与推送

- `fetch` 与 `pull --ff-only` 分开建模。
- 拉取后无论成功失败都刷新 `SyncState` 与最近操作记录。
- 推送失败时优先区分认证失败、非快进失败和网络失败。

### 冲突进入与退出

- 任何产生冲突的操作都立即生成 `ConflictSession`。
- 冲突文件列表来自 `git ls-files -u`。
- 解决完成后重新检查 unmerged entries，为空才允许退出冲突流程。

### 危险操作确认

- 丢弃、恢复、删除分支、可能覆盖改动的切换都必须先给出结构化后果说明。
- 所有确认文案都基于真实状态计算，不写抽象警告模板。

## 长期扩展位

这些内容不是第一版范围，但当前设计为它们留边界：

- 多仓库管理：靠 `RepositoryID`、独立会话和按仓库队列扩展，而不是重写数据模型。
- 高级历史索引：在 SQLite 中增加缓存表或索引表，而不是新增搜索引擎。
- 更丰富的同步策略：在 `GitClient` 中新增 rebase、protected branch 或 publish branch 能力。
- 更复杂的冲突辅助：在 `ConflictSession` 上增加更细粒度的文件级和块级决策状态。
- 第三方平台能力：未来如需接 GitHub、PR 或协作能力，应新增单独 integration 层，不污染现有 Git 核心层。

## 实施边界

- `TECH.md` 锁定的是架构方向、接口命名和数据模型边界，不写死具体三方库版本号。
- 真正开始建工程时，再补充模块目录、数据库迁移脚本和 parser 细节。
- 如果未来事实与这份文档冲突，应优先更新 `TECH.md`，而不是让代码长期脱离文档。

## 文档验收清单

读完这份文档，工程实现者应当能够明确回答：

- 第一版为什么选择 `SwiftUI + AppKit`，而不是跨平台壳
- 第一版为什么用 system Git CLI，而不是 `libgit2`
- 本地数据为什么统一落在 SQLite + GRDB
- 四层架构如何划分，Git、数据层、后台任务分别落在哪
- 持久化模型与运行时模型各有哪些核心类型
- 工作区、历史、同步、冲突分别以哪些 Git 命令为事实来源
- 为什么部分提交与部分丢弃走 patch 路线，而不是 `git add -p`

如果上述任一问题仍需要靠猜，这份技术文档就还不够完整。
