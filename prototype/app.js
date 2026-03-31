const ROUTES = ["launch", "workspace", "branches", "sync", "history", "conflicts"];
const APPEARANCES = ["light", "dark"];

const repositories = [
  {
    id: "grape",
    name: "Grape",
    path: "/Users/willxue/FruitsAI/Grape",
    branch: "main",
    ahead: 2,
    behind: 1,
    lastOpened: "刚刚",
    status: "同步待处理",
  },
  {
    id: "vineyard-docs",
    name: "Vineyard Docs",
    path: "/Users/willxue/Workspace/VineyardDocs",
    branch: "release/preview",
    ahead: 0,
    behind: 0,
    lastOpened: "今天 10:42",
    status: "已同步",
  },
  {
    id: "berry-lab",
    name: "Berry Lab",
    path: "/Users/willxue/Experiments/BerryLab",
    branch: "feature/editorial-shell",
    ahead: 4,
    behind: 0,
    lastOpened: "昨天",
    status: "待推送",
  },
];

const files = [
  {
    id: "app-shell",
    name: "AppShell.swift",
    kind: "M",
    scope: "Window chrome",
    staged: true,
    description: "整合标题栏、分段切换和 toolbar glass 层级。",
    hunks: [
      {
        id: "app-shell-1",
        title: "标题栏布局调整",
        subtitle: "把 traffic lights、repo crumb 和 segmented control 收进同一玻璃层",
        summary: "用户一进入工作台就能看到更统一的 toolbar hierarchy。",
      },
      {
        id: "app-shell-2",
        title: "hover 高光过渡",
        subtitle: "给 route pills 添加轻微升起和内高光",
        summary: "保持 Apple 风格的克制动效，不做夸张位移。",
      },
    ],
  },
  {
    id: "source-list",
    name: "SourceListView.swift",
    kind: "M",
    scope: "Sidebar",
    staged: true,
    description: "侧栏 source list 重新分组，加入 sync 和 conflict 语义。",
    hunks: [
      {
        id: "source-list-1",
        title: "分组标题统一",
        subtitle: "让 sidebar 的 workspace / flows / review 三组层级更清楚",
        summary: "左栏更像 macOS 原生 source list，而不是网页菜单。",
      },
    ],
  },
  {
    id: "commit-panel",
    name: "CommitPanel.swift",
    kind: "A",
    scope: "Composer",
    staged: false,
    description: "新增 commit composer 的摘要提示与风险说明。",
    hunks: [
      {
        id: "commit-panel-1",
        title: "提交草稿提示",
        subtitle: "在输入区下方展示 staged / unstaged 的差异数量",
        summary: "减少用户提交前的认知负担。",
      },
      {
        id: "commit-panel-2",
        title: "危险操作说明",
        subtitle: "当存在冲突或未处理 change 时显式提示",
        summary: "帮助用户在提交前重新确认状态。",
      },
    ],
  },
  {
    id: "history-pane",
    name: "HistoryPane.swift",
    kind: "M",
    scope: "Inspector",
    staged: false,
    description: "右侧历史区加入 commit graph lane 标记与最近同步信息。",
    hunks: [
      {
        id: "history-pane-1",
        title: "timeline lane 更新",
        subtitle: "增强最近提交的分支关系表达",
        summary: "在不增加密度的前提下提升历史可读性。",
      },
    ],
  },
  {
    id: "sync-service",
    name: "SyncService.swift",
    kind: "M",
    scope: "Sync",
    staged: false,
    description: "同步流程增加 ahead / behind 状态映射和错误分类。",
    hunks: [
      {
        id: "sync-service-1",
        title: "错误反馈重写",
        subtitle: "区分认证失败、非快进失败和网络失败",
        summary: "保证失败时用户能看到下一步建议。",
      },
    ],
  },
  {
    id: "conflict-assistant",
    name: "ConflictAssistant.swift",
    kind: "A",
    scope: "Conflicts",
    staged: false,
    description: "新增冲突进入后的文件列表与进度概览。",
    hunks: [
      {
        id: "conflict-assistant-1",
        title: "冲突文件列表",
        subtitle: "按照 ours / theirs / unresolved 分类展示",
        summary: "用户能更快判断当前冲突压力。",
      },
      {
        id: "conflict-assistant-2",
        title: "完成度提示",
        subtitle: "在顶部加入 resolution progress ring",
        summary: "把复杂冲突拆成更可感知的进度。",
      },
    ],
  },
];

const branches = {
  local: [
    { id: "main", name: "main", state: "current", summary: "默认工作线", ahead: 2, behind: 1 },
    { id: "liquid-glass", name: "feature/liquid-glass-workspace", state: "active", summary: "当前原型视觉探索", ahead: 4, behind: 0 },
    { id: "history-refine", name: "feature/history-refine", state: "idle", summary: "右侧历史和关系图增强", ahead: 0, behind: 0 },
    { id: "conflict-assist", name: "feature/conflict-assistant", state: "warning", summary: "冲突处理路径打磨", ahead: 1, behind: 3 },
  ],
  remote: [
    { id: "origin-main", name: "origin/main", state: "tracked", summary: "远端主线", ahead: 0, behind: 0 },
    { id: "origin-liquid", name: "origin/feature/liquid-glass-workspace", state: "tracked", summary: "远端视觉分支", ahead: 0, behind: 2 },
  ],
};

const timeline = [
  {
    id: "c1",
    summary: "feat: build liquid glass workspace prototype",
    author: "Will Xue",
    time: "3 分钟前",
    lane: "A",
    head: true,
    detail: "更新工作台骨架、主题切换与 branch sheet。",
  },
  {
    id: "c2",
    summary: "docs: add product requirement document",
    author: "Will Xue",
    time: "18 分钟前",
    lane: "A",
    head: false,
    detail: "补齐 JTBD、成功指标与路线图。",
  },
  {
    id: "c3",
    summary: "docs: define tech architecture baseline",
    author: "Will Xue",
    time: "1 小时前",
    lane: "B",
    head: false,
    detail: "明确 Git CLI、SQLite + GRDB 与分层设计。",
  },
  {
    id: "c4",
    summary: "docs: define grape product spec",
    author: "Will Xue",
    time: "昨天",
    lane: "A",
    head: false,
    detail: "定义顶栏 + 常驻三栏的工作台结构。",
  },
];

const conflictFiles = [
  {
    id: "conflict-1",
    name: "SourceListView.swift",
    detail: "ours 与 theirs 的 section order 冲突",
    status: "处理中",
  },
  {
    id: "conflict-2",
    name: "AppShell.swift",
    detail: "toolbar segmented control 的布局差异",
    status: "未解决",
  },
  {
    id: "conflict-3",
    name: "HistoryPane.swift",
    detail: "timeline lane 的颜色和密度变更",
    status: "已解决",
  },
];

const state = {
  route: sanitizeRoute(window.location.hash.replace("#", "")) || "launch",
  appearance:
    sanitizeAppearance(localStorage.getItem("grape-prototype-appearance")) || "light",
  selectedRepo: "grape",
  selectedFile: "app-shell",
  selectedHunk: "app-shell-1",
  activeSheet: "new-branch",
  syncState: "pending",
  conflictProgress: 2,
};

const app = document.querySelector("#app");

function sanitizeRoute(candidate) {
  return ROUTES.includes(candidate) ? candidate : null;
}

function sanitizeAppearance(candidate) {
  return APPEARANCES.includes(candidate) ? candidate : null;
}

function icon(name) {
  const paths = {
    spark:
      '<path d="M11.5 2.5 13 6l3.5 1.5L13 9l-1.5 3.5L10 9 6.5 7.5 10 6Z" fill="currentColor"/><path d="m4 11 1.1 2.4L7.5 14.5l-2.4 1.1L4 18l-1.1-2.4L.5 14.5l2.4-1.1Z" fill="currentColor" opacity=".72"/>',
    folder:
      '<path d="M2 5.5A1.5 1.5 0 0 1 3.5 4H7l1.6 1.7h3.9A1.5 1.5 0 0 1 14 7.2v4.3A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>',
    branch:
      '<path d="M5 3.5a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 5 3.5Zm0 5.7v1.8c0 1.2 1 2.2 2.2 2.2h.8" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><path d="M11 9.3a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm0-5.8a1.75 1.75 0 1 1 0 3.5A1.75 1.75 0 0 1 11 3.5ZM5 7v.9c0 1.1.9 2 2 2H9" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>',
    sync:
      '<path d="M11.5 5.3V2.8L14.2 5.5 11.5 8.2V5.7c-2.7 0-4.1 1-5.3 3" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 10.7v2.5L1.8 10.5 4.5 7.8v2.5c2.7 0 4.1-1 5.3-3" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>',
    clock:
      '<circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.35"/><path d="M8 5v3.2l2 1.2" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>',
    bolt:
      '<path d="M9.2 1.8 3.9 8h3l-.7 6.2L11.9 8h-3.1Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>',
    warning:
      '<path d="M8 2.5 14 13H2Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="M8 5.6v3.2" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><circle cx="8" cy="10.9" r=".8" fill="currentColor"/>',
    commit:
      '<circle cx="8" cy="8" r="2.3" fill="none" stroke="currentColor" stroke-width="1.35"/><path d="M2.2 8h3.5m4.6 0h3.5" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>',
    plus:
      '<path d="M8 3.2v9.6M3.2 8h9.6" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/>',
    moon:
      '<path d="M10.9 2.7a5.3 5.3 0 1 0 2.4 9.7A5.7 5.7 0 0 1 10.9 2.7Z" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/>',
    sun:
      '<circle cx="8" cy="8" r="2.8" fill="none" stroke="currentColor" stroke-width="1.35"/><path d="M8 1.8v1.7m0 9v1.7M1.8 8h1.7m9 0h1.7M3.6 3.6l1.1 1.1m6.6 6.6 1.1 1.1m0-8.8-1.1 1.1M4.7 11.3l-1.1 1.1" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
    arrow:
      '<path d="m6 3.5 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>',
  };

  return `
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      ${paths[name] || ""}
    </svg>
  `;
}

function getSelectedRepo() {
  return repositories.find((repo) => repo.id === state.selectedRepo) || repositories[0];
}

function getSelectedFile() {
  return files.find((file) => file.id === state.selectedFile) || files[0];
}

function getSelectedHunk() {
  const file = getSelectedFile();
  return file.hunks.find((hunk) => hunk.id === state.selectedHunk) || file.hunks[0];
}

function setRoute(route) {
  if (!sanitizeRoute(route)) return;
  state.route = route;
  if (window.location.hash !== `#${route}`) {
    window.location.hash = route;
  } else {
    render();
  }
}

function setAppearance(appearance) {
  const next = sanitizeAppearance(appearance);
  if (!next) return;
  state.appearance = next;
  localStorage.setItem("grape-prototype-appearance", next);
  render();
}

function routeLabel(route) {
  const labels = {
    launch: "Launch",
    workspace: "Workspace",
    branches: "Branches",
    sync: "Sync",
    history: "History",
    conflicts: "Conflicts",
  };

  return labels[route];
}

function routeIcon(route) {
  const icons = {
    launch: icon("folder"),
    workspace: icon("spark"),
    branches: icon("branch"),
    sync: icon("sync"),
    history: icon("clock"),
    conflicts: icon("warning"),
  };

  return icons[route];
}

function renderToolbar() {
  const repo = getSelectedRepo();
  const isLaunchRoute = state.route === "launch";
  const subtitle = `${repo.branch} · ${repo.path}`;
  const identityMarkup = isLaunchRoute
    ? ""
    : `
        <div class="repo-meta">
          <div class="repo-title">${repo.name}</div>
          <div class="repo-subtitle">${subtitle}</div>
        </div>
      `;

  return `
    <header class="window-toolbar glass-thin">
      <div class="traffic-lights" aria-hidden="true">
        <span class="red"></span>
        <span class="amber"></span>
        <span class="green"></span>
      </div>
      <div class="toolbar-center">
        <div class="brand-chip glass-thin">
          <span class="brand-mark"></span>
          <div class="brand-copy">
            <span class="eyebrow">macOS prototype</span>
            <span class="brand-name">Grape</span>
          </div>
        </div>
        ${identityMarkup}
      </div>
      <div class="toolbar-actions">
        <nav class="toolbar-nav" aria-label="Primary views">
          ${ROUTES.map(
            (route) => `
              <button
                class="route-pill ${state.route === route ? "is-active" : ""}"
                data-action="navigate"
                data-route="${route}"
                type="button"
              >
                ${routeIcon(route)}
                <span>${routeLabel(route)}</span>
              </button>
            `,
          ).join("")}
        </nav>
        <div class="segmented" role="group" aria-label="Appearance mode">
          ${APPEARANCES.map(
            (appearance) => `
              <button
                type="button"
                class="${state.appearance === appearance ? "is-active" : ""}"
                data-action="set-theme"
                data-theme="${appearance}"
              >
                ${appearance === "light" ? icon("sun") : icon("moon")}
                <span>${appearance === "light" ? "Light" : "Dark"}</span>
              </button>
            `,
          ).join("")}
        </div>
      </div>
    </header>
  `;
}

function render() {
  document.body.dataset.appearance = state.appearance;
  app.innerHTML = `
    <section class="app-window fade-enter">
      ${renderToolbar()}
      <div class="window-body">
        ${renderScene()}
      </div>
    </section>
  `;
}

function renderScene() {
  switch (state.route) {
    case "launch":
      return renderLaunch();
    case "branches":
      return renderWorkspaceWithOverlay(renderBranchOverlay());
    case "sync":
      return renderWorkspaceWithOverlay(renderSyncOverlay());
    case "history":
      return renderHistory();
    case "conflicts":
      return renderWorkspaceWithOverlay(renderConflictOverlay());
    case "workspace":
    default:
      return renderWorkspace();
  }
}

function renderLaunch() {
  return `
    <section class="scene launch-scene">
      <article class="hero-panel glass-thick">
        <div class="hero-copy">
          <div class="hero-label">
            ${icon("spark")}
            <span>Liquid Glass Desktop Prototype</span>
          </div>
          <h1 class="hero-title">
            <span class="hero-line">一个安静、顺手、可信任的</span>
            <span>macOS Git 工作台</span>
          </h1>
          <p class="hero-description">
            Grape 不追求做成巨大的 Git 平台，而是把打开仓库、查看改动、部分提交、切换分支、同步远端与冲突处理串成一条真正连续的日常路径。
          </p>
          <div class="hero-actions">
            <button class="button-pill is-primary" type="button" data-action="open-selected-repo">
              ${icon("folder")}
              <span>打开最近仓库</span>
            </button>
            <button class="button-pill is-secondary" type="button" data-action="navigate" data-route="workspace">
              ${icon("arrow")}
              <span>直接进入工作台</span>
            </button>
            <span class="split-label">
              ${icon("bolt")}
              <span>遵循 Apple 控件级液体玻璃层级</span>
            </span>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <strong>90%+</strong>
              <span>核心主路径内部完成率目标</span>
            </div>
            <div class="hero-stat">
              <strong>10s</strong>
              <span>常见仓库进入可操作界面的目标时长</span>
            </div>
            <div class="hero-stat">
              <strong>100%</strong>
              <span>危险操作确认覆盖率目标</span>
            </div>
          </div>
        </div>
      </article>
      <aside class="launch-side">
        <section class="launch-side-card glass-regular">
          <h2 class="section-title">最近仓库</h2>
          <div class="repo-list">
            ${repositories
              .map(
                (repo) => `
                  <button
                    type="button"
                    class="repo-list-item ${state.selectedRepo === repo.id ? "is-active" : ""}"
                    data-action="pick-repo"
                    data-repo="${repo.id}"
                  >
                    <div class="stack-copy">
                      <strong>${repo.name}</strong>
                      <span>${repo.path}</span>
                      <span>${repo.branch} · ${repo.lastOpened}</span>
                    </div>
                    <span class="status-chip ${repo.ahead > 0 || repo.behind > 0 ? "is-warning" : "is-success"}">
                      ${repo.ahead > 0 || repo.behind > 0 ? icon("sync") : icon("spark")}
                      <span>${repo.status}</span>
                    </span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>
        <section class="launch-side-card glass-regular">
          <h2 class="section-title">启动动作</h2>
          <h3 class="card-title">仓库入口只做两件事</h3>
          <p class="card-description">
            打开本地仓库，或克隆远端仓库。其余上下文恢复由最近仓库和会话状态承担，保持首屏克制。
          </p>
          <div class="hero-actions" style="margin-top: 18px;">
            <button class="button-pill is-secondary" type="button" data-action="open-selected-repo">
              ${icon("folder")}
              <span>打开本地仓库</span>
            </button>
            <button class="button-pill is-secondary" type="button" data-action="clone-repo">
              ${icon("plus")}
              <span>克隆远端仓库</span>
            </button>
          </div>
        </section>
        <section class="launch-side-card glass-regular">
          <h2 class="section-title">路径预览</h2>
          <div class="meta-list">
            <li><span class="list-bullet">${icon("folder")}</span><span>Launch → 恢复最近仓库</span></li>
            <li><span class="list-bullet">${icon("commit")}</span><span>Workspace → 查看改动与整理提交</span></li>
            <li><span class="list-bullet">${icon("branch")}</span><span>Branches / Sync → 安全切换与同步</span></li>
            <li><span class="list-bullet">${icon("warning")}</span><span>Conflicts → 进入冲突处理与完成收尾</span></li>
          </div>
        </section>
      </aside>
    </section>
  `;
}

function renderWorkspaceWithOverlay(overlay) {
  return `
    <section class="scene">
      ${renderWorkspace()}
      <div class="overlay-scene">
        ${overlay}
      </div>
    </section>
  `;
}

function renderWorkspace() {
  const repo = getSelectedRepo();
  const file = getSelectedFile();
  const hunk = getSelectedHunk();

  return `
    <section class="scene window-content-grid">
      <aside class="sidebar glass-regular">
        <div class="panel-group">
          <section class="sidebar-section">
            <div class="section-heading">
              <h3>Repository</h3>
              <button class="section-link" type="button" data-action="navigate" data-route="launch">Switch</button>
            </div>
            <div class="surface-card">
              <div class="stack-copy">
                <strong>${repo.name}</strong>
                <span>${repo.path}</span>
                <div class="badge-cluster">
                  <span class="mini-badge is-accent">${repo.branch}</span>
                  <span class="mini-badge">ahead ${repo.ahead}</span>
                  <span class="mini-badge">behind ${repo.behind}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="sidebar-section">
            <div class="section-heading">
              <h3>Workspace</h3>
            </div>
            <div class="source-list">
              ${renderSourceItem("workspace", "今日工作台", "6 files")}
              ${renderSourceItem("branches", "分支与切换", "4 local")}
              ${renderSourceItem("sync", "同步状态", "ahead 2")}
              ${renderSourceItem("history", "最近历史", "4 commits")}
              ${renderSourceItem("conflicts", "冲突处理", "2 unresolved")}
            </div>
          </section>

          <section class="sidebar-section">
            <div class="section-heading">
              <h3>Quick Actions</h3>
            </div>
            <div class="panel-group">
              <button class="button-pill is-secondary" type="button" data-action="navigate" data-route="branches">
                ${icon("branch")}
                <span>新建或切换分支</span>
              </button>
              <button class="button-pill is-secondary" type="button" data-action="navigate" data-route="sync">
                ${icon("sync")}
                <span>查看拉取 / 推送</span>
              </button>
              <button class="button-pill is-secondary" type="button" data-action="navigate" data-route="conflicts">
                ${icon("warning")}
                <span>进入冲突流程</span>
              </button>
            </div>
          </section>
        </div>
      </aside>

      <main class="center-pane glass-regular">
        <header class="workspace-header">
          <div class="workspace-headline">
            <h1>今日工作台</h1>
            <p>
              默认回到上次工作现场，把当前改动、提交、分支与同步状态保持在同一个认知层级里。
            </p>
          </div>
          <div class="stack-inline">
            <span class="status-chip is-warning">${icon("sync")}<span>${repo.ahead} ahead · ${repo.behind} behind</span></span>
            <button class="button-pill is-primary" type="button">
              ${icon("commit")}
              <span>Commit 3 changes</span>
            </button>
          </div>
        </header>

        <section class="workspace-statusbar">
          <article class="surface-card">
            <h3>工作区快照</h3>
            <p>6 个文件有改动，3 个 hunk 已加入本次提交范围。</p>
          </article>
          <article class="surface-card">
            <h3>保护状态</h3>
            <p>切分支前存在未提交改动，危险操作将先提示后果。</p>
          </article>
          <article class="surface-card">
            <h3>同步提示</h3>
            <p>本地领先 2 个提交，拉取前还落后远端 1 个提交。</p>
          </article>
        </section>

        <section class="changes-layout">
          <div class="pane-section">
            <div class="pane-shell">
              <div class="section-topline">
                <h2>当前改动</h2>
                <span>按文件与代码块选择提交内容</span>
              </div>
              <div class="list-stack">
                ${files
                  .map(
                    (entry) => `
                      <button
                        type="button"
                        class="file-row ${state.selectedFile === entry.id ? "is-active" : ""}"
                        data-action="pick-file"
                        data-file="${entry.id}"
                      >
                        <div class="stack-copy">
                          <strong>${entry.name}</strong>
                          <span>${entry.scope}</span>
                          <span>${entry.description}</span>
                        </div>
                        <div class="badge-cluster">
                          <span class="mini-badge ${entry.staged ? "is-success" : ""}">${entry.kind}</span>
                          <span class="mini-badge">${entry.hunks.length} hunks</span>
                        </div>
                      </button>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          </div>

          <div class="pane-section">
            <div class="pane-shell">
              <div class="section-topline">
                <h2>${file.name}</h2>
                <span>${file.hunks.length} 个结构化变更</span>
              </div>
              <div class="list-stack">
                ${file.hunks
                  .map(
                    (entry) => `
                      <button
                        type="button"
                        class="hunk-row ${state.selectedHunk === entry.id ? "is-active" : ""}"
                        data-action="pick-hunk"
                        data-hunk="${entry.id}"
                      >
                        <div class="stack-copy">
                          <strong>${entry.title}</strong>
                          <span>${entry.subtitle}</span>
                          <p>${entry.summary}</p>
                        </div>
                      </button>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </section>

        <section class="commit-card">
          <div class="section-topline">
            <h2>Commit Composer</h2>
            <span>当前已选 3 个 hunk · 可安全提交</span>
          </div>
          <textarea class="composer-input" aria-label="Commit message">feat: refine the workspace liquid glass hierarchy

- unify toolbar and sidebar material
- tighten file selection feedback
- prepare sync and conflict overlays</textarea>
          <div class="stack-inline">
            <span class="status-chip">${icon("spark")}<span>Selected hunk: ${hunk.title}</span></span>
            <span class="status-chip is-warning">${icon("warning")}<span>切分支前请先提交或保留当前改动</span></span>
          </div>
        </section>
      </main>

      <aside class="inspector-pane glass-regular">
        <section class="detail-card">
          <div class="section-topline">
            <h2>最近历史</h2>
            <button class="section-link" type="button" data-action="show-history">Expand</button>
          </div>
          <div class="timeline-stack">
            ${timeline
              .map(
                (entry) => `
                  <button type="button" class="timeline-entry ${entry.head ? "is-active" : ""}" data-action="show-history">
                    <div class="timeline-lane">
                      <span class="timeline-dot"></span>
                    </div>
                    <div class="stack-copy">
                      <strong>${entry.summary}</strong>
                      <span>${entry.author} · ${entry.time}</span>
                    </div>
                    <span class="mini-badge">${entry.lane}</span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="detail-card">
          <div class="section-topline">
            <h2>差异预览</h2>
            <span>${file.name}</span>
          </div>
          <div class="preview-shell">
            <div class="preview-code">+ toolbarMaterial = .glass(.regular)
+ sidebarSelection = .sourceList
- toolbarBackground = .solid

if repository.syncState.isBehind {
    showSyncBanner(.needsPull)
}</div>
            <p class="helper-copy">
              这里展示当前选中 hunk 的预览内容。视觉上保持可读性优先，不把正文区域做成整片玻璃。
            </p>
          </div>
        </section>

        <section class="detail-card">
          <div class="section-topline">
            <h2>下一个动作</h2>
          </div>
          <div class="meta-list">
            <li><span class="list-bullet">${icon("commit")}</span><span>提交当前已选内容，然后再切换分支。</span></li>
            <li><span class="list-bullet">${icon("sync")}</span><span>拉取远端 1 个提交，再推送本地 2 个提交。</span></li>
            <li><span class="list-bullet">${icon("warning")}</span><span>若出现冲突，直接进入应用内处理流程。</span></li>
          </div>
        </section>
      </aside>
    </section>
  `;
}

function renderHistory() {
  return `
    <section class="scene history-scene">
      <article class="history-hero glass-thick">
        <div class="workspace-header">
          <div class="workspace-headline">
            <h1>最近历史与关系图</h1>
            <p>
              把 commit timeline、branch lanes 和右侧详情拆得更开，让用户在不离开当前工作流的前提下理解最近发生了什么。
            </p>
          </div>
          <div class="stack-inline">
            <span class="status-chip">${icon("branch")}<span>main · feature/liquid-glass-workspace</span></span>
            <button class="button-pill is-secondary" type="button" data-action="navigate" data-route="workspace">
              ${icon("arrow")}
              <span>回到工作台</span>
            </button>
          </div>
        </div>
      </article>

      <section class="history-grid columns">
        <article class="history-column">
          <div class="section-topline">
            <h2>Commit Graph</h2>
            <span>简化 lane，强调当前上下文</span>
          </div>
          <div class="graph-canvas">
            ${timeline
              .map(
                (entry, index) => `
                  <div class="graph-row">
                    <div class="graph-lanes">
                      <span class="lane-dot ${index > 1 ? "is-muted" : ""}"></span>
                      <span class="lane-dot is-muted"></span>
                    </div>
                    <div class="graph-copy">
                      <strong>${entry.summary}</strong>
                      <span>${entry.detail}</span>
                    </div>
                    <span class="meta-chip">${entry.time}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
        </article>
        <aside class="status-board-column">
          <div class="detail-card">
            <div class="section-topline">
              <h2>Commit Detail</h2>
              <span>HEAD</span>
            </div>
            <p>feat: build liquid glass workspace prototype</p>
            <div class="meta-list">
              <li><span class="list-bullet">${icon("spark")}</span><span>统一标题栏与 toolbar 层级。</span></li>
              <li><span class="list-bullet">${icon("sync")}</span><span>加入 ahead / behind 可视状态。</span></li>
              <li><span class="list-bullet">${icon("warning")}</span><span>为冲突和危险操作预留 overlay 入口。</span></li>
            </div>
          </div>
          <div class="detail-card">
            <div class="section-topline">
              <h2>Timeline Notes</h2>
            </div>
            <p>
              历史页在视觉上允许比主工作台更沉浸，但仍然保持主要内容区的高对比实底，不把 graph 本身做成重度玻璃。
            </p>
          </div>
        </aside>
      </section>
    </section>
  `;
}

function renderBranchOverlay() {
  return `
    <section class="sheet glass-thick fade-enter">
      <div class="section-topline">
        <h2>分支与切换</h2>
        <button class="button-pill is-quiet" type="button" data-action="navigate" data-route="workspace">
          ${icon("arrow")}
          <span>关闭</span>
        </button>
      </div>
      <p>
        这里以 sheet 的形式承接分支操作，让用户在不离开当前工作台上下文的情况下，完成创建、切换、重命名和删除分支。
      </p>

      <div class="branch-columns" style="margin-top: 18px;">
        <section class="branch-column">
          <div class="section-topline">
            <h3>Local Branches</h3>
            <span>${branches.local.length} branches</span>
          </div>
          <div class="branch-list">
            ${branches.local
              .map(
                (branch) => `
                  <button type="button" class="branch-row ${branch.state === "active" ? "is-active" : ""}">
                    <div class="stack-copy">
                      <strong>${branch.name}</strong>
                      <span>${branch.summary}</span>
                    </div>
                    <div class="badge-cluster">
                      <span class="mini-badge ${branch.state === "current" ? "is-accent" : branch.state === "warning" ? "is-danger" : ""}">
                        ${branch.state}
                      </span>
                    </div>
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>

        <section class="branch-column">
          <div class="section-topline">
            <h3>Create or Switch</h3>
            <span>带风险提示</span>
          </div>
          <div class="surface-card">
            <h3>新建分支</h3>
            <p>feature/sync-feedback-glass</p>
            <div class="stack-inline" style="margin-top: 12px;">
              <span class="mini-badge is-accent">from main</span>
              <span class="mini-badge">track origin/main</span>
            </div>
          </div>
          <div class="surface-card">
            <h3>切换提醒</h3>
            <p>
              当前工作区仍有未提交改动。若这些改动会影响目标分支，应用需要先说明风险，而不是直接切换。
            </p>
            <div class="stack-inline" style="margin-top: 12px;">
              <span class="status-chip is-warning">${icon("warning")}<span>Switch blocked until review</span></span>
            </div>
          </div>
          <div class="surface-card">
            <h3>Remote Tracking</h3>
            <p>origin/main · ahead 2 · behind 1</p>
          </div>
        </section>
      </div>

      <div class="sheet-footer">
        <span class="footer-note">Sheet 使用较厚玻璃，正文内容保持更稳的实底层。</span>
        <div class="stack-inline">
          <button class="button-pill is-secondary" type="button" data-action="navigate" data-route="workspace">
            <span>稍后处理</span>
          </button>
          <button class="button-pill is-primary" type="button" data-action="navigate" data-route="workspace">
            ${icon("branch")}
            <span>创建并切换</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderSyncOverlay() {
  return `
    <section class="overlay-panel glass-thick fade-enter">
      <div class="section-topline">
        <h2>同步状态</h2>
        <button class="button-pill is-quiet" type="button" data-action="navigate" data-route="workspace">
          ${icon("arrow")}
          <span>关闭</span>
        </button>
      </div>
      <p>
        同步视图把 ahead / behind、最后一次操作结果和可执行下一步集中到一个轻量覆盖层里，避免用户为了一次 pull / push 跳出当前工作流。
      </p>
      <div class="sync-metrics" style="margin-top: 18px;">
        <div class="metric-card">
          <strong>2</strong>
          <span>本地领先远端</span>
        </div>
        <div class="metric-card">
          <strong>1</strong>
          <span>本地落后远端</span>
        </div>
        <div class="metric-card">
          <strong>1m</strong>
          <span>上次 fetch 时间</span>
        </div>
      </div>
      <div class="sheet-grid columns" style="margin-top: 18px;">
        <section class="status-board-column">
          <div class="surface-card">
            <h3>推荐下一步</h3>
            <p>先拉取远端 1 个提交，再推送本地 2 个提交，避免直接 push 造成非快进失败。</p>
          </div>
          <div class="surface-card">
            <h3>最近结果</h3>
            <p>Fetch succeeded · Push blocked by behind state · 认证链路正常。</p>
          </div>
        </section>
        <section class="status-board-column">
          <div class="surface-card">
            <h3>失败反馈示意</h3>
            <div class="meta-list">
              <li><span class="list-bullet">${icon("warning")}</span><span>发生了什么：远端包含你本地没有的提交。</span></li>
              <li><span class="list-bullet">${icon("spark")}</span><span>为什么：当前分支 behind 1，直接 push 会被拒绝。</span></li>
              <li><span class="list-bullet">${icon("sync")}</span><span>下一步：先执行 pull --ff-only，再重新 push。</span></li>
            </div>
          </div>
        </section>
      </div>
      <div class="overlay-footer">
        <span class="footer-note">同步层更适合用 overlay，而不是单独离开工作台。</span>
        <div class="stack-inline">
          <button class="button-pill is-secondary" type="button">
            ${icon("sync")}
            <span>Fetch</span>
          </button>
          <button class="button-pill is-secondary" type="button">
            ${icon("arrow")}
            <span>Pull</span>
          </button>
          <button class="button-pill is-primary" type="button">
            ${icon("bolt")}
            <span>Push</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderConflictOverlay() {
  return `
    <section class="overlay-panel glass-thick fade-enter">
      <div class="section-topline">
        <h2>冲突处理</h2>
        <button class="button-pill is-quiet" type="button" data-action="navigate" data-route="workspace">
          ${icon("arrow")}
          <span>关闭</span>
        </button>
      </div>
      <p>
        冲突出现后不让用户只看到抽象报错，而是直接进入应用内的文件列表、进度和下一步指引。这里仍然沿用工作台上下文，但提高视觉聚焦度。
      </p>

      <div class="conflict-progress" style="margin-top: 18px;">
        <div class="progress-ring" data-label="${state.conflictProgress}/3"></div>
        <div class="progress-copy">
          <h3>当前已解决 ${state.conflictProgress} 个文件</h3>
          <p>
            剩余冲突集中在 toolbar 排布和 source list 顺序。完成所有 unresolved file 后，应用会给出继续提交或继续同步的下一步。
          </p>
        </div>
      </div>

      <div class="conflict-layout" style="margin-top: 18px;">
        <section class="conflict-column">
          <div class="section-topline">
            <h3>Conflicted Files</h3>
            <span>${conflictFiles.length} files</span>
          </div>
          <div class="conflict-stack">
            ${conflictFiles
              .map(
                (file) => `
                  <button type="button" class="conflict-row ${file.status === "未解决" ? "is-active" : ""}">
                    <div class="stack-copy">
                      <strong>${file.name}</strong>
                      <span>${file.detail}</span>
                    </div>
                    <span class="mini-badge ${file.status === "已解决" ? "is-success" : file.status === "未解决" ? "is-danger" : ""}">
                      ${file.status}
                    </span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </section>
        <section class="conflict-column">
          <div class="surface-card">
            <h3>下一步指引</h3>
            <div class="meta-list">
              <li><span class="list-bullet">${icon("warning")}</span><span>先处理 <span class="mono">AppShell.swift</span> 的 segmented control 布局。</span></li>
              <li><span class="list-bullet">${icon("spark")}</span><span>确认 source list 的 section order 与工作台信息架构一致。</span></li>
              <li><span class="list-bullet">${icon("commit")}</span><span>全部 resolved 后再继续 commit 或 sync。</span></li>
            </div>
          </div>
          <div class="surface-card">
            <h3>冲突原则</h3>
            <p>
              提示必须说人话：发生了什么、影响哪些文件、当前进度是多少、用户下一步应做什么。
            </p>
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderSourceItem(route, label, count) {
  return `
    <button
      type="button"
      class="source-item ${state.route === route ? "is-active" : ""}"
      data-action="navigate"
      data-route="${route}"
    >
      ${routeIcon(route)}
      <span>${label}</span>
      <span class="count">${count}</span>
    </button>
  `;
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const { action } = target.dataset;

  if (action === "navigate") {
    setRoute(target.dataset.route || "workspace");
    return;
  }

  if (action === "set-theme") {
    setAppearance(target.dataset.theme);
    return;
  }

  if (action === "pick-repo") {
    state.selectedRepo = target.dataset.repo || state.selectedRepo;
    render();
    return;
  }

  if (action === "open-selected-repo" || action === "clone-repo") {
    setRoute("workspace");
    return;
  }

  if (action === "pick-file") {
    const nextFile = files.find((file) => file.id === target.dataset.file);
    if (!nextFile) return;
    state.selectedFile = nextFile.id;
    state.selectedHunk = nextFile.hunks[0].id;
    render();
    return;
  }

  if (action === "pick-hunk") {
    state.selectedHunk = target.dataset.hunk || state.selectedHunk;
    render();
    return;
  }

  if (action === "show-history") {
    setRoute("history");
  }
}

window.addEventListener("hashchange", () => {
  const nextRoute = sanitizeRoute(window.location.hash.replace("#", ""));
  if (!nextRoute) return;
  state.route = nextRoute;
  render();
});

app.addEventListener("click", handleClick);

if (!window.location.hash || !sanitizeRoute(window.location.hash.replace("#", ""))) {
  window.location.hash = state.route;
} else {
  state.route = sanitizeRoute(window.location.hash.replace("#", ""));
}

render();
