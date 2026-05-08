const categoryKeys = ["all", "business", "ai", "competition"];

const content = {
  zh: {
    documentTitle: "余智秋｜国际商业运营与 AI 应用",
    description: "余智秋的国际商业运营、国际化增长与 AI 赋能商业分析简历网页。",
    brand: "余智秋",
    nav: ["经历", "项目", "证书", "奖项", "联系"],
    resumeButton: "中文简历",
    languageButton: "EN",
    heroName: "余智秋",
    heroTitle: "国际商业运营 / 国际化增长 / AI 赋能商业分析",
    heroIntro:
      "电子科学与技术本科，曾赴芬兰商学院公费交换；在 SMM、金虹桥商场、ING Bank 上海分行承担海外市场、CRM 运营分析与运营支持工作，具备英文商务沟通、客户线索整理、经营数据处理、流程文档支持和 AI 工具应用经验。",
    heroActions: ["查看项目", "联系我"],
    contact: [
      "意向城市：杭州、上海",
      "预计 2026 年 6 月毕业",
      "15857143292",
      "jimmyyuzhiqiu@icloud.com",
    ],
    visualLabels: ["Finland · Shanghai · Global Leads", "AI workflow / CRM analytics / business site"],
    signals: [
      ["40 ECTS", "芬兰商学院课程", "service design / leadership / HRM"],
      ["10 万+", "海外渠道触达", "SMM 多语言渠道营销"],
      ["3,102", "可追溯观众参会", "展会线索与商务对接支持"],
      ["500+", "AIGC 片头生成", "内容工作流效率提升约 83%"],
    ],
    sections: {
      education: ["教育背景", ""],
      experience: ["实习经历", ""],
      projects: ["项目作品集", ""],
      certificates: ["竞赛证书", ""],
      awards: ["竞赛奖项", ""],
    },
    education: [
      {
        school: "浙江传媒学院（媒体工程学院）",
        degree: "电子科学与技术（演艺工程与舞台技术）本科",
        period: "2022.09 - 2026.06",
        detail:
          "GPA 3.8，入选“三创班”，辅修创新与设计；相关课程包括人工智能、信号与系统、电视工程基础、虚拟演播室技术。",
      },
      {
        school: "Kajaani University of Applied Sciences",
        degree: "公费交换生（商学院）",
        period: "2024",
        detail:
          "完成 40 ECTS 商科课程，覆盖 service design、leadership、HRM、law、economics，GPA 3.75；参与 LUMI 超级计算机量子计算实验与国际活动组织。",
      },
    ],
    experiences: [
      {
        index: "01",
        company: "上海有色网信息科技股份有限公司（SMM）",
        role: "海外市场与会展实习生",
        period: "2025.01 - 2025.04",
        place: "上海",
        theme: "海外客户线索 / 会展增长 / 英文商务触达",
        points: [
          "整理潜在客户、线上报名客户和参会客户数据，完成去重、分类、字段补充和优先级梳理，支撑线索筛选、英文合作邮件触达和赞助推进。",
          "参与 20+ 合作媒体资源置换，引进并维护 30+ 海外合作 / 赞助伙伴，推动参会人数超额完成 KPI 24%。",
          "结合 Python 与 Salesforce 协作完成客户线索抓取、清洗和画像补充，新增 200+ 海外企业联系方式。",
        ],
      },
      {
        index: "02",
        company: "金虹桥商场",
        role: "CRM 运营分析实习生",
        period: "2025.10 - 2025.11",
        place: "上海",
        theme: "会员增长 / 活动核销 / 经营报表",
        points: [
          "使用 Python + pandas + xlsxwriter 自动生成 2020-2025 会员新增、年终累计、同比、环比报表。",
          "处理会员等级变化、月份口径和累计逻辑，支持 CRM 复盘、会员增长判断和业务汇报口径统一。",
          "用 Python + openpyxl 处理白领券领取与核销明细，支持月度活动复盘。",
        ],
      },
      {
        index: "03",
        company: "ING Bank N.V. Shanghai Branch",
        role: "运营支持实习生（支付 / 清算 / 数据自动化）",
        period: "2025.12 - 2026.03",
        place: "上海",
        theme: "国际银行流程 / 审查支持 / SOP 自动化",
        points: [
          "处理 transaction advice 归档、CNAPS / CFETS 票据打印监控、inward ticket 与 FX deal slip 匹配。",
          "参与 CNAPS Daily Recon、月度对账单核对和广播检查，适应国际银行高规范后台环境。",
          "围绕 Annual Account Review 编写 Python 抽取脚本，将 OCR / Excel 审查材料转为结构化台账。",
        ],
      },
    ],
    categoryLabels: {
      all: "全部",
      business: "商业与运营",
      ai: "AI 应用",
      competition: "竞赛作品",
    },
    footerTitle: "余智秋",
    footerSubtitle: "国际商业运营 / 国际化增长 / AI 赋能商业分析",
    footerResume: "下载中文简历",
    certificateAction: "查看原图",
    modalClose: "关闭证书预览",
  },
  en: {
    documentTitle: "Yu Zhiqiu | International Business Operations & AI Applications",
    description:
      "Yu Zhiqiu's resume portfolio for international business operations, global growth, and AI-enabled business analytics.",
    brand: "Yu Zhiqiu",
    nav: ["Experience", "Projects", "Certificates", "Awards", "Contact"],
    resumeButton: "English CV",
    languageButton: "中文",
    heroName: "Yu Zhiqiu",
    heroTitle: "International Business Operations / Global Growth / AI-enabled Business Analytics",
    heroIntro:
      "Electronic Science and Technology undergraduate with a government-funded business-school exchange in Finland. Experience spans overseas marketing at SMM, CRM operations analytics at King Parkview, and operations support at ING Bank Shanghai Branch, with strengths in English business communication, lead organization, operating data processing, process documentation, and AI tool application.",
    heroActions: ["View Projects", "Contact Me"],
    contact: [
      "Target locations: Hangzhou, Shanghai",
      "Expected graduation: Jun 2026",
      "15857143292",
      "jimmyyuzhiqiu@icloud.com",
    ],
    visualLabels: ["Finland · Shanghai · Global Leads", "AI workflow / CRM analytics / business site"],
    signals: [
      ["40 ECTS", "Business exchange in Finland", "service design / leadership / HRM"],
      ["100K+", "Overseas channel reach", "SMM multilingual marketing"],
      ["3,102", "Traceable event attendees", "Lead tracking and business matching"],
      ["500+", "AIGC opening clips", "Content workflow efficiency up about 83%"],
    ],
    sections: {
      education: ["Education", ""],
      experience: ["Experience", ""],
      projects: ["Project Portfolio", ""],
      certificates: ["Certificates", ""],
      awards: ["Awards", ""],
    },
    education: [
      {
        school: "Communication University of Zhejiang, School of Media Engineering",
        degree: "B.Eng. in Electronic Science and Technology",
        period: "2022.09 - 2026.06",
        detail:
          "GPA 3.8. Selected into the innovation class and minored in Innovation & Design. Relevant coursework includes AI, Signals and Systems, TV Engineering Fundamentals, and Virtual Studio Technology.",
      },
      {
        school: "Kajaani University of Applied Sciences",
        degree: "Exchange Student, School of Business",
        period: "2024",
        detail:
          "Completed 40 ECTS business courses covering service design, leadership, HRM, law, and economics, with GPA 3.75. Also joined LUMI supercomputer quantum-computing experiments and international activity organization.",
      },
    ],
    experiences: [
      {
        index: "01",
        company: "Shanghai Metals Market Information & Technology Co., Ltd. (SMM)",
        role: "Overseas Marketing & Event Intern",
        period: "2025.01 - 2025.04",
        place: "Shanghai",
        theme: "Overseas lead operations / event growth / English business outreach",
        points: [
          "Organized potential-customer, online-registration, and attendee data; handled deduplication, classification, field enrichment, and lead prioritization for English outreach and sponsorship support.",
          "Supported 20+ media partnership exchanges and maintained 30+ overseas partners or sponsors, helping event attendance exceed KPI by 24%.",
          "Used Python and Salesforce to assist lead scraping, cleaning, and profile enrichment, adding 200+ overseas company contacts.",
        ],
      },
      {
        index: "02",
        company: "King Parkview Mall",
        role: "CRM Operations Analytics Intern",
        period: "2025.10 - 2025.11",
        place: "Shanghai",
        theme: "Member growth / coupon redemption / operating reports",
        points: [
          "Automated 2020-2025 member-growth, year-end cumulative, YoY, and MoM reports using Python, pandas, and xlsxwriter.",
          "Handled membership-tier changes, monthly metrics, and cumulative logic to support CRM review and consistent business-reporting definitions.",
          "Processed white-collar coupon collection and redemption details with Python and openpyxl for monthly campaign review.",
        ],
      },
      {
        index: "03",
        company: "ING Bank N.V. Shanghai Branch",
        role: "Operations Support Intern, Payments / Clearing / Data Automation",
        period: "2025.12 - 2026.03",
        place: "Shanghai",
        theme: "International banking process / review support / SOP automation",
        points: [
          "Handled transaction-advice archiving, CNAPS / CFETS ticket monitoring, and matching inward tickets with FX deal slips.",
          "Supported CNAPS Daily Recon, monthly statement checks, and broadcast checks in a high-standard international banking environment.",
          "Built Python extraction scripts for Annual Account Review materials, converting OCR / Excel content into structured review tables.",
        ],
      },
    ],
    categoryLabels: {
      all: "All",
      business: "Business & Operations",
      ai: "AI Applications",
      competition: "Competition Projects",
    },
    footerTitle: "Yu Zhiqiu",
    footerSubtitle: "International Business Operations / Global Growth / AI-enabled Business Analytics",
    footerResume: "Download English CV",
    certificateAction: "View",
    modalClose: "Close certificate preview",
  },
};

const projects = {
  zh: {
    "commerce-web": {
      categoryKey: "business",
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
      categoryKey: "business",
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
      categoryKey: "ai",
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
      categoryKey: "ai",
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
      categoryKey: "competition",
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
      categoryKey: "competition",
      period: "2025",
      title: "《童年即景》",
      subtitle: "蓝桥杯视觉艺术设计赛作品",
      impact: "获第 16 届蓝桥杯全国软件和信息技术专业人才大赛全国总决赛一等奖。",
      description: "围绕视觉叙事与数字内容表达完成作品设计与呈现，用更偏内容与视觉沟通的方式补充技术型项目之外的表达能力。",
      tags: ["全国一等奖", "视觉叙事", "数字内容"],
      links: [],
    },
    "green-animation": {
      categoryKey: "competition",
      period: "2023",
      title: "《青绿千里》数字动画",
      subtitle: "数字媒体竞赛作品",
      impact: "获全国大学生数字媒体科技作品及创意竞赛国赛三等奖、华东赛区一等奖。",
      description: "参与数字动画创意、视觉表达与内容制作，体现跨媒体内容表达、协作制作和竞赛级交付经验。",
      tags: ["数字动画", "国赛三等奖", "华东一等奖"],
      links: [],
    },
    "quantum-model": {
      categoryKey: "competition",
      period: "2023",
      title: "国际量子数值建模竞赛",
      subtitle: "Wuyue 杯量子数学建模竞赛",
      impact: "团队获亚太地区二等奖，模型误差率降低约 15%。",
      description: "使用 Python 与 MATLAB 优化粒子相互作用计算模型，围绕量子态演化仿真开展模型调试、参数优化和结果验证。",
      tags: ["Python", "MATLAB", "数值建模", "亚太二等奖"],
      links: [],
    },
  },
  en: {
    "commerce-web": {
      categoryKey: "business",
      period: "2025 - Present",
      title: "AI Business Content & Public Website Delivery",
      subtitle: "juyi.asia / dialflow.cn",
      impact: "Translated cross-border logistics, B2B services, and AI applications into public websites and commercial presentation materials.",
      description:
        "Independently launched juyi.asia for cross-border 3PL supply-chain services and dialflow.cn for AI outbound-calling scenarios, using AI Coding and OpenClaw for information architecture, page generation, copywriting, and launch iteration.",
      tags: ["AI Coding", "Business presentation", "Cross-border 3PL", "B2B"],
      links: [
        ["juyi.asia", "https://juyi.asia"],
        ["dialflow.cn", "https://dialflow.cn"],
      ],
    },
    "crm-automation": {
      categoryKey: "business",
      period: "2025",
      title: "Operating Analytics & Campaign Review Automation",
      subtitle: "Member-growth reports / coupon redemption processing",
      impact: "Built a repeatable and handover-ready monthly operating analytics workflow.",
      description:
        "Automated member-growth, cumulative, YoY, and MoM reports, then read raw coupon details back into formatted templates to generate summary sheets and coupon-specific records.",
      tags: ["CRM", "Python", "Excel", "Operations review"],
      links: [],
    },
    "ing-review": {
      categoryKey: "ai",
      period: "2026",
      title: "Review Support Automation",
      subtitle: "Annual Account Review structured extraction",
      impact: "Converted screenshots, OCR, and Excel review materials into structured, auditable tables.",
      description:
        "Covered fields such as company name, contact person, address, and registered capital, while documenting field mapping, SOP logic, and reusable automation rules for high-standard banking processes.",
      tags: ["OCR", "SOP", "International banking", "Structured data"],
      links: [],
    },
    "aigc-opening": {
      categoryKey: "ai",
      period: "2024",
      title: "AIGC Content Workflow",
      subtitle: "Qizhi Xuzhang: automatic opening-video generation",
      impact: "Generated 500+ opening clips and reduced per-piece production time from about 30 minutes to about 5 minutes.",
      description:
        "Integrated Stable Diffusion, ControlNet, SadTalker, and GPT-SoVITS into a multimodal workflow from script and image to voice output. Won provincial first prize and national third prize in the Computer Design Competition.",
      tags: ["Stable Diffusion", "ControlNet", "GPT-SoVITS", "Content production"],
      links: [],
    },
    "virtual-scene": {
      categoryKey: "competition",
      period: "2024",
      title: "Esports Phantom: Virtual Battle Scene Generator",
      subtitle: "National innovation project lead / Challenge Cup provincial bronze",
      impact: "Designed an AI-driven 3D virtual battle-scene generation approach for costly, long-cycle virtual production.",
      description:
        "Supported automatic scene modeling, Unreal Engine import, multi-camera switching, and immersive demos. Selected as a national-level student innovation project and won provincial bronze in the Challenge Cup.",
      tags: ["Unreal Engine", "Virtual production", "National innovation project", "Challenge Cup"],
      links: [],
    },
    "lqb-visual": {
      categoryKey: "competition",
      period: "2025",
      title: "Childhood Snapshot",
      subtitle: "Lanqiao Cup visual-art design work",
      impact: "Won national finals first prize in the 16th Lanqiao Cup software and IT talent competition.",
      description:
        "Completed the visual narrative and digital-content presentation, adding a strong content-communication dimension beyond purely technical projects.",
      tags: ["National first prize", "Visual narrative", "Digital content"],
      links: [],
    },
    "green-animation": {
      categoryKey: "competition",
      period: "2023",
      title: "Green Miles Digital Animation",
      subtitle: "Digital media competition work",
      impact: "Won national third prize and East China first prize in the National College Student Digital Media Technology Works Competition.",
      description:
        "Contributed to creative direction, visual expression, and digital-animation production, demonstrating cross-media storytelling and team-based delivery.",
      tags: ["Digital animation", "National third prize", "East China first prize"],
      links: [],
    },
    "quantum-model": {
      categoryKey: "competition",
      period: "2023",
      title: "International Quantum Numerical Modeling Competition",
      subtitle: "Wuyue Cup quantum mathematical modeling competition",
      impact: "Won Asia-Pacific second prize and reduced model error by about 15%.",
      description:
        "Used Python and MATLAB to optimize particle-interaction models, tuning parameters and validating results around quantum-state evolution simulation.",
      tags: ["Python", "MATLAB", "Numerical modeling", "APAC second prize"],
      links: [],
    },
  },
};

const awards = {
  zh: [
    ["2025.07", "第 16 届蓝桥杯全国软件和信息技术专业人才大赛视觉艺术设计赛", "全国总决赛一等奖"],
    ["2025.01", "第 6 届全球人工智能算法精英大赛", "全国一等奖"],
    ["2024.06-07", "第 17 届中国大学生计算机设计大赛", "浙江省一等奖 / 全国三等奖"],
    ["2024", "浙江省第十四届挑战杯大学生课外学术科技作品竞赛", "省赛铜奖"],
    ["2023.11", "第 11 届全国大学生数字媒体科技作品及创意竞赛", "全国三等奖 / 华东一等奖"],
    ["2023", "Wuyue 杯量子数学建模竞赛", "亚太地区二等奖"],
    ["2023.01", "第 12 届未来设计师全国高校艺术设计大赛", "浙江赛区三等奖"],
  ],
  en: [
    ["2025.07", "16th Lanqiao Cup National Software and IT Talent Competition, Visual Art Design", "National Finals First Prize"],
    ["2025.01", "6th Global AI Algorithm Elite Competition", "National First Prize"],
    ["2024.06-07", "17th Chinese College Student Computer Design Competition", "Zhejiang First Prize / National Third Prize"],
    ["2024", "14th Zhejiang Challenge Cup Student Academic and Technology Works Competition", "Provincial Bronze"],
    ["2023.11", "11th National College Student Digital Media Technology Works and Creative Competition", "National Third Prize / East China First Prize"],
    ["2023", "Wuyue Cup Quantum Mathematical Modeling Competition", "Asia-Pacific Second Prize"],
    ["2023.01", "12th Future Designer National College Art and Design Competition", "Zhejiang Third Prize"],
  ],
};

const certificates = [
  {
    image: "./public/certificates/lanqiao-national-first.jpg",
    zh: ["2025.07", "蓝桥杯视觉艺术设计赛", "全国总决赛一等奖"],
    en: ["2025.07", "Lanqiao Cup Visual Art Design", "National Finals First Prize"],
  },
  {
    image: "./public/certificates/ai-algorithm-national-first.jpg",
    zh: ["2025.01", "全球人工智能算法精英大赛", "全国一等奖"],
    en: ["2025.01", "Global AI Algorithm Elite Competition", "National First Prize"],
  },
  {
    image: "./public/certificates/computer-design-provincial-first.jpg",
    zh: ["2024.06", "中国大学生计算机设计大赛", "浙江省一等奖"],
    en: ["2024.06", "Chinese College Student Computer Design Competition", "Zhejiang First Prize"],
  },
  {
    image: "./public/certificates/computer-design-national-third.jpg",
    zh: ["2024.07", "中国大学生计算机设计大赛", "全国三等奖"],
    en: ["2024.07", "Chinese College Student Computer Design Competition", "National Third Prize"],
  },
  {
    image: "./public/certificates/challenge-cup-bronze.jpg",
    zh: ["2024", "浙江省挑战杯", "省赛铜奖证明"],
    en: ["2024", "Zhejiang Challenge Cup", "Provincial Bronze Proof"],
  },
  {
    image: "./public/certificates/digital-media-national-third.jpg",
    zh: ["2023.11", "全国大学生数字媒体科技作品及创意竞赛", "全国三等奖"],
    en: ["2023.11", "National College Student Digital Media Technology Works Competition", "National Third Prize"],
  },
  {
    image: "./public/certificates/digital-media-east-first.jpg",
    zh: ["2023.11", "全国大学生数字媒体科技作品及创意竞赛", "华东赛区一等奖"],
    en: ["2023.11", "National College Student Digital Media Technology Works Competition", "East China First Prize"],
  },
  {
    image: "./public/certificates/quantum-modeling-apac-second.jpg",
    zh: ["2023", "Wuyue 杯量子数学建模竞赛", "亚太地区二等奖"],
    en: ["2023", "Wuyue Cup Quantum Mathematical Modeling Competition", "Asia-Pacific Second Prize"],
  },
  {
    image: "./public/certificates/future-designer-provincial-third.jpg",
    zh: ["2024", "未来设计师全国高校艺术设计大赛", "浙江赛区三等奖"],
    en: ["2024", "Future Designer National College Art and Design Competition", "Zhejiang Third Prize"],
  },
  {
    image: "./public/certificates/national-innovation-lead.jpg",
    zh: ["2024", "国家级大学生创新训练计划", "项目负责人证明"],
    en: ["2024", "National Student Innovation Training Program", "Project Lead Proof"],
  },
];

let currentLanguage = localStorage.getItem("resume-language") || "zh";
let selectedCategory = "all";
let selectedProjectId = "commerce-web";
let revealObserver;

const progress = document.querySelector(".scroll-progress");
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const langToggle = document.querySelector(".lang-toggle");
const certificateGrid = document.getElementById("certificate-grid");
const modal = document.getElementById("certificate-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalMeta = document.getElementById("modal-meta");

function text(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function inlineLabel(element, value) {
  if (!element) return;
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) node.remove();
  });
  element.append(document.createTextNode(` ${value}`));
}

function listText(selector, values) {
  document.querySelectorAll(selector).forEach((element, index) => {
    if (values[index] !== undefined) element.textContent = values[index];
  });
}

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${value})`;
}

function updateDocument(t) {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.title = t.documentTitle;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", t.description);
  langToggle.textContent = t.languageButton;
  langToggle.setAttribute("aria-label", currentLanguage === "zh" ? "Switch to English" : "切换到中文");
}

function updateHeader(t) {
  text(".brand span:last-child", t.brand);
  listText(".nav-links a", t.nav);

  const pdf = currentLanguage === "zh" ? "./public/resume-cn.pdf" : "./public/resume-en.pdf";
  document.querySelectorAll(".header-action, .site-footer .primary-button").forEach((link) => {
    link.href = pdf;
    inlineLabel(link, link.classList.contains("header-action") ? t.resumeButton : t.footerResume);
  });
}

function updateHero(t) {
  text(".hero-copy h1", t.heroName);
  text(".hero-title", t.heroTitle);
  text(".hero-intro", t.heroIntro);

  const heroButtons = document.querySelectorAll(".hero-actions a");
  inlineLabel(heroButtons[0], t.heroActions[0]);
  inlineLabel(heroButtons[1], t.heroActions[1]);
  document.querySelectorAll(".contact-grid span").forEach((element, index) => {
    inlineLabel(element, t.contact[index]);
  });
  listText(".visual-label", t.visualLabels);

  document.querySelectorAll(".signal-card").forEach((card, index) => {
    const [value, label, detail] = t.signals[index];
    card.querySelector("strong").textContent = value;
    card.querySelector("span").textContent = label;
    card.querySelector("small").textContent = detail;
  });
}

function updateSectionIntro(section, values) {
  const element = document.querySelector(section);
  if (!element) return;
  const heading = element.querySelector("h2");
  const paragraph = element.querySelector("p");
  const intro = values[1] || "";
  heading.textContent = values[0];
  if (paragraph) {
    paragraph.textContent = intro;
    paragraph.hidden = intro.length === 0;
  }
  element.classList.toggle("section-intro-title-only", intro.length === 0);
}

function updateEducation(t) {
  document.querySelectorAll(".education-item").forEach((item, index) => {
    const source = t.education[index];
    item.querySelector("h3").textContent = source.school;
    item.querySelector("div p").textContent = source.degree;
    item.querySelector("time").textContent = source.period;
    item.querySelector(".education-detail").textContent = source.detail;
  });
}

function updateExperience(t) {
  document.querySelectorAll(".experience-card").forEach((card, index) => {
    const source = t.experiences[index];
    card.querySelector(".experience-index").textContent = source.index;
    card.querySelector("h3").textContent = source.company;
    card.querySelector(".entry-head p").textContent = source.role;
    const meta = card.querySelectorAll(".entry-meta span");
    meta[0].textContent = source.period;
    meta[1].textContent = source.place;
    card.querySelector(".theme-line").textContent = source.theme;
    card.querySelectorAll("li").forEach((li, pointIndex) => {
      li.textContent = source.points[pointIndex];
    });
  });
}

function updateFilterButtons(t) {
  filterButtons.forEach((button, index) => {
    const key = categoryKeys[index];
    button.dataset.category = key;
    button.textContent = t.categoryLabels[key];
    button.classList.toggle("active", selectedCategory === key);
  });
}

function updateProjectCards() {
  const localizedProjects = projects[currentLanguage];
  projectCards.forEach((card) => {
    const project = localizedProjects[card.dataset.projectId];
    card.dataset.category = project.categoryKey;
    card.hidden = selectedCategory !== "all" && selectedCategory !== project.categoryKey;
    card.querySelector(".project-card-meta").textContent = content[currentLanguage].categoryLabels[project.categoryKey];
    card.querySelector("strong").textContent = project.title;
    card.querySelector("small").textContent = project.subtitle;
    card.classList.toggle("active", card.dataset.projectId === selectedProjectId);
  });
}

function updateFeature(projectId) {
  const project = projects[currentLanguage][projectId];
  if (!project) return;

  document.getElementById("feature-category").textContent = content[currentLanguage].categoryLabels[project.categoryKey];
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
  selectedProjectId = card.dataset.projectId;
  projectCards.forEach((item) => item.classList.toggle("active", item === card));
  updateFeature(selectedProjectId);
}

function filterProjects(category) {
  selectedCategory = category;
  updateFilterButtons(content[currentLanguage]);

  let firstVisible = null;
  projectCards.forEach((card) => {
    const visible = category === "all" || card.dataset.category === category;
    card.hidden = !visible;
    if (visible && !firstVisible) firstVisible = card;
  });

  if (firstVisible) selectProject(firstVisible);
}

function updateAwards() {
  document.querySelectorAll(".award-row").forEach((row, index) => {
    const source = awards[currentLanguage][index];
    row.querySelector("time").textContent = source[0];
    row.querySelector("span").textContent = source[1];
    row.querySelector("strong").textContent = source[2];
  });
}

function renderCertificates() {
  const t = content[currentLanguage];
  certificateGrid.replaceChildren(...certificates.map((certificate, index) => {
    const [date, title, result] = certificate[currentLanguage];
    const button = document.createElement("button");
    button.className = "certificate-card reveal visible";
    button.type = "button";
    button.dataset.index = String(index);
    button.innerHTML = `
      <div class="certificate-media" data-action="${t.certificateAction}">
        <img src="${certificate.image}" alt="${title} - ${result}" loading="lazy" />
      </div>
      <span class="certificate-info">
        <small>${date}</small>
        <strong>${title}</strong>
        <span>${result}</span>
      </span>
    `;
    return button;
  }));
}

function openCertificate(index) {
  const certificate = certificates[index];
  if (!certificate) return;
  const [date, title, result] = certificate[currentLanguage];
  modalImage.src = certificate.image;
  modalImage.alt = `${title} - ${result}`;
  modalTitle.textContent = title;
  modalMeta.textContent = `${date} · ${result}`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeCertificate() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
}

function setupRevealObserver() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );
  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
}

function applyLanguage(nextLanguage = currentLanguage) {
  currentLanguage = nextLanguage;
  localStorage.setItem("resume-language", currentLanguage);
  const t = content[currentLanguage];

  updateDocument(t);
  updateHeader(t);
  updateHero(t);
  updateSectionIntro(".section-compact .section-intro", t.sections.education);
  updateSectionIntro("#experience .section-intro", t.sections.experience);
  updateSectionIntro("#projects .section-intro", t.sections.projects);
  updateSectionIntro("#certificates .section-intro", t.sections.certificates);
  updateSectionIntro("#awards .section-intro", t.sections.awards);
  updateEducation(t);
  updateExperience(t);
  updateFilterButtons(t);
  updateProjectCards();
  updateFeature(selectedProjectId);
  updateAwards();
  renderCertificates();
  text(".site-footer h2", t.footerTitle);
  text(".site-footer p", t.footerSubtitle);
  inlineLabel(document.querySelector(".site-footer .secondary-button"), "jimmyyuzhiqiu@icloud.com");
  document.querySelector(".modal-close").setAttribute("aria-label", t.modalClose);
  document.querySelector(".modal-backdrop").setAttribute("aria-label", t.modalClose);
  setupRevealObserver();
  updateProgress();
}

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

certificateGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".certificate-card");
  if (card) openCertificate(Number(card.dataset.index));
});

document.querySelector(".modal-close").addEventListener("click", closeCertificate);
document.querySelector(".modal-backdrop").addEventListener("click", closeCertificate);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCertificate();
});

langToggle.addEventListener("click", () => {
  applyLanguage(currentLanguage === "zh" ? "en" : "zh");
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
applyLanguage(currentLanguage);
