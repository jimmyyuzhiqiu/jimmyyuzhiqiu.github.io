# ART DIRECTION LOCK V2｜云知师AI教师版

本文件优先级高于 V1 中所有模糊视觉描述。

## 总方向
成片必须像成熟 AI SaaS 产品发布片，而不是 PPT 宣传片。视觉关键词：**明亮、克制、留白、产品感、教育科技、连续叙事**。

参考视觉语言：Apple 产品发布、Linear、Arc、Notion、高端 AI SaaS 官网产品 Demo。保持教育产品的亲和与可信。

禁止：政府汇报片、模板化信息图、卡片海、廉价蓝紫科技风、满屏渐变、高饱和霓虹。

## 硬规则
1. 一屏一个 Primary Focus，最多一个 Secondary Support。
2. 数字人主讲可见高度 70%–78%；Demo 场景不低于 65%。
3. 电脑 Demo 可见宽度 68%–74%，真实 UI 必须嵌入屏幕。
4. PPT/报告/图片/互动网页等成果，优先 85%–95% 大画幅。
5. 同一屏不得出现 3 张以上同款圆角卡片竞争注意力。
6. 核心正文不得低于 26px。
7. Semantic Caption 最多 2 行，原则上 4–10 个中文字，最长 18 个。
8. 禁止 Bounce / Spin / 3D Flip / Cube / Page Turn / 粒子爆炸 / Emoji 飞入。
9. 转场优先 Shared Element：任务 → 执行 → 成果；文件 → 分析 → 下一课。
10. Review URL 前必须 Render Still，并通过 `ART_DIRECTION_QA.json`。

## 统一画面体系
### 背景
浅蓝 + 白 + 极淡薰衣草紫。左下淡紫光晕、右上柔和科技蓝光晕、中心高亮留白。禁止整屏深蓝或大面积渐变。

### 字体层级
- Hero 72–88px / 600–700
- Scene Title 48–58px
- Core Keyword / Number 56–72px
- Support Text 28–34px
- Semantic Caption 34–40px
- 核心信息绝不低于 26px
- 同一画面最多 3 个字号层级

### 圆角与阴影
- 大容器 radius 28–36px
- 小标签 radius 14–18px
- 1px 低对比边框
- 只允许柔和环境阴影
- 禁止黑色重阴影、发光描边

## 数字人
必须使用已抠像 `数字人_女讲解员_keyed.webm`。数字人是主讲人，不是左下角贴纸；不加白底卡片、不加边框、不加发光描边。

## 电脑 Demo
电脑是 Demo 主视觉。使用 trimmed 电脑素材。图层顺序：Background → Demo Video clipped by screen mask → Laptop Bezel → Presenter → Caption/UI。任意 UI 像素跑出屏幕直接 FAIL。

## 成果展示
PPT、报告、图片、互动网页、复杂分析结果如果放进电脑后不可读，必须改成 85%–95% 全屏/大画幅。电脑是操作容器，不是所有画面的强制外框。

## Motion Language
允许：Camera Push In / Pull Out、Mask Reveal、Blur Dissolve、Shared Element、Soft Scale 0.96→1.00、Line Draw、Content Expand、Viewport Pan。
每个 Scene 最多一种主要进入方式，动作连续、有惯性，不做模板式元素乱飞。

## Scene视觉打法
### S01 Hook
左侧大标题，右侧 2–3 个真实产物以 Floating Screens 克制叠化，不用卡片阵列。

### S02 产品定位
数字人左侧大尺寸主讲。右侧只出现主定位 + 三个短词：`懂教学 / 能执行 / 会沉淀`。

### S03–S04 课前
电脑大画幅展示任务输入与 AI 执行；成果出现后 Laptop Bezel 淡出，PPT Shared Element 展开到全屏。

### S05 课堂素材
中心一次只显示一个大成果：互动网页 → 教学图片 → 编辑后图片。不要三张小卡并排。

### S07–S08 分析
先完整结果页 1 秒，再 Camera Push 到关键区，其它区域降到约65%亮度。重点不是报告全页，而是观众看懂一个关键结果。

### S10 飞书/钉钉
不要做接口演示。中心用“教学成果”作为源节点，分别连向飞书、钉钉，再短暂出现真实连接画面。

### S12 品牌片尾
白色 + 极轻蓝紫呼吸光。只保留：`云知师AI`、`把重复劳动交给 AI，把时间真正留给课堂。`、`教师版 · AI教学助手`。

## Still QA
Review 前至少 Render：S01 / S02 / S04 / S05 / S07 / S10 / S12。
逐张检查：主视觉、元素数量、数字人尺寸、产品可读性、文字尺寸、卡片数量、转场一致性。任何一项不合格，不进入 Review。
