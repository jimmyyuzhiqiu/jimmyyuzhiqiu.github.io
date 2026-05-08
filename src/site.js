const projects = {
  "commerce-web": {
    category: "商业与运营",
    period: "2025 - 至今",
    title: "AI 商务内容与公开网站交付",
    subtitle: "juyi.asia / dialflow.cn",
    impact: "把跨境物流、B 端服务和 AI 应用能力转成可访问网页与商业展示材料。",
    description:
      "独立制作并上线 juyi.asia（跨境 3PL 供应链服务展示）与 dialflow.cn（AI 外呼 / 自动拨号场景展示），用 AI Coding、OpenClaw 等工具完成信息架构、页面生成、文案组织和上线迭代。",
    tags: ["AI Coding", "商业展示", "跨境 3PL", "B2B"],
    links: [
      ["juyi.asia", "https://juyi.asia"],
      ["dialflow.cn", "https://dialflow.cn"],
    ],
  },
  "crm-automation": {
    category: "商业与运营",
    period: "2025",
    title: "经营分析与活动复盘自动化",
    subtitle: "会员增长分析工具 / 白领券核销数据处理",
    impact: "将每月可复跑、可交接、可复盘的运营分析流程沉淀为自动化工具。",
    description:
      "围绕会员新增、累计、同比、环比等指标构建自动化报表，并读取原始券明细回写格式化模板，自动生成汇总表和指定券种明细。",
    tags: ["CRM", "Python", "Excel", "运营复盘"],
    links: [],
  },
  "ing-review": {
    category: "AI 应用",
    period: "2026",
    title: "审查支持自动化",
    subtitle: "Annual Account Review 结构化抽取",
    impact: "把截图、OCR、Excel 审查资料抽取为可复核的结构化台账。",
    description:
      "覆盖公司名称、联系人、地址、注册资本等字段，沉淀字段映射、SOP 和可复用自动化规则，用于提升高规范流程中的资料整理效率。",
    tags: ["OCR", "SOP", "国际银行", "数据结构化"],
    links: [],
  },
  "aigc-opening": {
    category: "AI 应用",
    period: "2024",
    title: "AIGC 内容工作流",
    subtitle: "启智序章：自动片头生成",
    impact: "累计生成 500+ 片头，单个制作时间由约 30 分钟缩短至约 5 分钟。",
    description:
      "整合 Stable Diffusion、ControlNet、SadTalker、GPT-SoVITS，搭建从文案、画面到配音输出的多模态内容工作流，获计算机设计大赛浙江省一等奖、国赛三等奖。",
    tags: ["Stable Diffusion", "ControlNet", "GPT-SoVITS", "内容生产"],
    links: [],
  },
  "virtual-scene": {
    category: "竞赛作品",
    period: "2024",
    title: "电竞幻影：虚拟战景生成器",
    subtitle: "国家级大创项目负责人 / 挑战杯省赛铜奖",
    impact: "面向虚拟拍摄成本高、周期长的问题，设计 AI 驱动的 3D 虚拟战景生成方案。",
    description:
      "支持场景自动建模导入 Unreal Engine、多镜头切换与沉浸式演示。项目入选国家级大学生创新训练计划，获浙江省挑战杯省赛铜奖。",
    tags: ["Unreal Engine", "虚拟拍摄", "国家级大创", "挑战杯"],
    links: [],
  },
  "lqb-visual": {
    category: "竞赛作品",
    period: "2025",
    title: "《童年即景》",
    subtitle: "蓝桥杯视觉艺术设计赛作品",
    impact: "获第 16 届蓝桥杯全国软件和信息技术专业人才大赛全国总决赛一等奖。",
    description:
      "围绕视觉叙事与数字内容表达完成作品设计与呈现，用更偏内容与视觉沟通的方式补充技术型项目之外的表达能力。",
    tags: ["全国一等奖", "视觉叙事", "数字内容"],
    links: [],
  },
  "green-animation": {
    category: "竞赛作品",
    period: "2023",
    title: "《青绿千里》数字动画",
    subtitle: "数字媒体竞赛作品",
    impact: "获全国大学生数字媒体科技作品及创意竞赛国赛三等奖、华东赛区一等奖。",
    description:
      "参与数字动画创意、视觉表达与内容制作，体现跨媒体内容表达、协作制作和竞赛级交付经验。",
    tags: ["数字动画", "国赛三等奖", "华东一等奖"],
    links: [],
  },
  "quantum-model": {
    category: "竞赛作品",
    period: "2023",
    title: "国际量子数值建模竞赛",
    subtitle: "Wuyue 杯量子数学建模竞赛",
    impact: "团队获亚太地区二等奖，模型误差率降低约 15%。",
    description:
      "使用 Python 与 MATLAB 优化粒子相互作用计算模型，围绕量子态演化仿真开展模型调试、参数优化和结果验证。",
    tags: ["Python", "MATLAB", "数值建模", "亚太二等奖"],
    links: [],
  },
};

const progress = document.querySelector(".scroll-progress");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${value})`;
}

function updateFeature(projectId) {
  const project = projects[projectId];
  if (!project) return;

  document.getElementById("feature-category").textContent = project.category;
  document.getElementById("feature-period").textContent = project.period;
  document.getElementById("feature-title").textContent = project.title;
  document.getElementById("feature-subtitle").textContent = project.subtitle;
  document.getElementById("feature-impact").textContent = project.impact;
  document.getElementById("feature-description").textContent = project.description;

  const tagRow = document.getElementById("feature-tags");
  tagRow.replaceChildren(...project.tags.map((tag) => {
    const span = document.createElement("span");
    span.textContent = tag;
    return span;
  }));

  const links = document.getElementById("feature-links");
  links.replaceChildren(...project.links.map(([label, href]) => {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.innerHTML = `
      <svg class="inline-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
      ${label}
    `;
    return anchor;
  }));
}

function selectProject(card) {
  projectCards.forEach((item) => item.classList.toggle("active", item === card));
  updateFeature(card.dataset.projectId);
}

function filterProjects(category) {
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.category === category));

  let firstVisible = null;
  projectCards.forEach((card) => {
    const visible = category === "全部" || card.dataset.category === category;
    card.hidden = !visible;
    if (visible && !firstVisible) firstVisible = card;
  });

  if (firstVisible) selectProject(firstVisible);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 },
);

revealItems.forEach((item) => observer.observe(item));
filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProjects(button.dataset.category));
});
projectCards.forEach((card) => {
  card.addEventListener("click", () => selectProject(card));
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});
document.querySelectorAll(".experience-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
