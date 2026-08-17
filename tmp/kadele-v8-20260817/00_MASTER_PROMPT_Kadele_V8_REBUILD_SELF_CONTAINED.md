# Kadele × EvoMind V8｜PPT/SOP 返工 SELF-CONTAINED MASTER PROMPT

> 本文件为单文件自包含执行入口。以下规则高于 V7。

# 核心返工目标

本次不是继续润色 V7，而是针对 Classroom PPT、教师 SOP、AI 科学家智能体体系、V0→V3→Final 原型版本体系进行结构性返工。

正式生成 PPT 前，必须先发现并调用技能 **`EvomindPPT生成【自研】`**。不得使用 `python-pptx` 作为课堂 PPT 的主生成器或替代技能。若该技能不可用，停止 PPT 生产并返回 `BLOCKED_SKILL_MISSING`，不得静默降级。

课程前提：学生在四天课程开始前已经完整观看月球基地影片；正式课堂不再播放电影；电影只作为共同背景知识、问题来源和项目灵感。学生按兴趣选择研究项目，流程固定为：

**兴趣问题 → 选题 → 立项 → 组队与合作分工 → 选择合适 AI 科学家 → 研究与证据 → 多方案 → V0/V1/V2/V3 原型 → 测试验证 → 失败/根因 → 迭代 → Final → 答辩。**

积木贯穿四天，是思考、建模、验证和迭代工具。

---

# 一、V7 当前交付为什么不合格

检查当前 `Kadele_V7_ClassroomPPT_192页.pptx`：
- 总页数 192；
- 192/192 页均只有 5 个 shape；
- 192/192 页文字量均低于 100 字符；
- 全部 192 页总图片数为 0；
- 典型页只有：页码 / 类型标签 / 一个大标题 / 一个“👉 学生动作” / SOP 与材料编号小字。

这类页面是 Slide Manifest 的可视化占位符，不是老师面对学生正式上课用的课件。

当前 `ClassroomPPT/gen_classroom_ppt.py` 顶部明确写有“生成 V7 Classroom PPT（192页，python-pptx 程序化生成）”，说明没有落实用户明确指定的 **`EvomindPPT生成【自研】`** 技能。

此外，当前 PPT 只显示 `材料 PROJECT-01 / BUILD-01 / TEST-03` 等编号，学生看不到任务卡正文；V0/V1/V2/V3 虽出现在材料中，但没有解释为什么存在、每版区别、升级证据和 Gate；也没有形成“AI 科学家团队 + 项目→科学家路由 + 每次问 AI 前先选专家”的机制。

教师 SOP 也不能继续用统一模板批量生成诸如“现在请大家看屏幕”“投影 Pxxx；明确任务与时限；巡回观察”等泛化话术，必须写成每个真实教学环节的具体执行话术。

---

# 二、第一硬规则：所有正式 PPT 必须调用 `EvomindPPT生成【自研】`

必须用于：
- Day1 Classroom PPT
- Day2 Classroom PPT
- Day3 Classroom PPT
- Day4 Classroom PPT
- 四日合并 Classroom PPT
- 课程方案汇报 PPT

禁止：
- 用 `python-pptx` 批量循环标题/动作生成正式课堂页；
- 因为已经有 Slide Manifest 就直接程序化生成空壳 PPT；
- 静默降级到其他 PPT 技能。

`python-pptx` 仅可用于页数检查、合并拆分、QA 文本扫描、对象越界检查和文件后处理，不能作为主要视觉与课堂内容生成器。

必须输出 `PPT_SKILL_EXECUTION_RECEIPT.md`，记录：实际调用技能名称、是否发现成功、哪些 PPT 由该技能生成、生成时间、QA、是否发生降级。只要没有明确写出 `EvomindPPT生成【自研】 = SUCCESS`，PPT 阶段自动 FAIL。

---

# 三、第二硬规则：物料是物料，PPT 是 PPT，两者必须同时存在

打印任务卡存在，不构成 PPT 省略内容的理由。

每张关键卡必须有：
1. PRINT VERSION：A4/A5 打印版；
2. SCREEN VERSION：16:9 PPT 投屏版。

屏幕版至少必须显示：Mission/任务、Step/步骤、Time/时限、Deliverable/产出、Done When/完成标准、Don't/禁止事项（若有）。

以下内容都必须有 PPT 屏幕版：
- Mission Card
- Research Mission Card
- Project Charter
- Role Card
- AI Scientist Card
- AI Prompt Card
- Build Card
- Test Card
- Failure Card
- Root Cause Card
- Challenge Card
- Evidence Card
- Rubric Card
- Defense Question Card

禁止 PPT 只写“材料 BUILD-01”。

制作 `CARD_PPT_COVERAGE.csv`：`Card ID | Print exists | PPT screen page | SOP time | PASS/FAIL`。任何 SOP 使用的关键卡，如果 PPT screen page 为空，FAIL。

---

# 四、AI 科学家智能体体系

学生不应该对一个“万能 AI”提所有问题。每次需要 AI 时，必须先判断：
1. 我现在的问题属于哪个学科？
2. 哪位 AI 科学家最合适？
3. 我希望他帮我做解释 / 找漏洞 / 找证据 / 比较方案 / 设计测试中的哪一种？

**选择合适专家本身就是课程任务。**

## A01 月球地质与选址科学家｜Luna Geologist
擅长：月壤、环形山、永久阴影区、水冰、选址条件。适合 T01选址、T02水冰、T10月壤建筑。

## A02 太空环境与辐射科学家｜Space Environment Scientist
擅长：太阳风、宇宙射线、微陨石、极端环境风险。适合辐射防护、紧急避险、基地安全。

## A03 生命支持与居住系统科学家｜Habitat & Life Support Scientist
擅长：居住舱、气闸、洁污分区、人员生活与工作需求。适合居住舱、月壤污染、紧急撤离。

## A04 月球能源系统工程师｜Lunar Energy Engineer
擅长：太阳能、供能路径、能源分配、冗余与故障思维。适合能源系统、基地布局、系统工程。

## A05 水资源与 ISRU 科学家｜Water & ISRU Scientist
擅长：水冰获取、运输、处理、储存、资源利用链。适合水资源、水冰开采、基地长期运行。

## A06 机器人与月球车工程师｜Robotics & Rover Engineer
擅长：机器人工作、人机分工、月球车路线、无人作业。适合机器人、运输、危险区域作业。

## A07 材料与建造科学家｜Materials & Construction Scientist
擅长：月壤利用、屏蔽概念、结构、3D 打印建筑概念。适合月壤建筑、基地外部防护。

## A08 月球物流与运营工程师｜Logistics & Operations Engineer
擅长：人员流、货物流、仓储、维护、补给、冲突路线。适合运输、物流、基地运营。

## A09 系统工程与证据审查官｜Systems Engineer / Evidence Reviewer
擅长：接口、约束、Trade-off、冲突、证据是否足够、测试是否公平。所有组 Day2 后半段、Day3、Day4 都必须使用。

## PPT 必须出现
- “认识 AI 科学家团队”总览页；
- A01–A09 各 1 张完整科学家卡：身份、擅长、适合问什么、不适合问什么、示例 Prompt；
- “我的问题应该找谁？”判断流程图；
- 项目→首选科学家/备选科学家路由矩阵；
- 每次 AI 环节前都出现 `SELECT YOUR SCIENTIST` 页面；
- 每次 AI 环节后出现 `ACCEPT / MODIFY / REJECT + WHY` 页面。

学生问 AI 的标准步骤：
**问题分类 → 选科学家 → 写问题 → 先预测科学家可能说什么 → 发问 → 查证 → Accept/Modify/Reject → 更新设计。**

## 12+1 项目→AI 科学家路由
| 项目 | 首选科学家 | 第二科学家 |
|---|---|---|
| T01 基地选址 | A01 | A04 |
| T02 水冰资源 | A05 | A01 |
| T03 辐射防护 | A02 | A07 |
| T04 居住舱 | A03 | A08 |
| T05 月壤污染 | A03 | A01 |
| T06 紧急撤离 | A02 | A08 |
| T07 能源系统 | A04 | A01 |
| T08 月球车运输 | A06 | A08 |
| T09 机器人作业 | A06 | A02 |
| T10 月壤建筑 | A07 | A01 |
| T11 基地物流 | A08 | A03 |
| T12 系统集成 | A09 | 按子问题选 A01-A08 |
| T13 自由立项 | 先分类再选 | 第二专业专家 |

学生完成选题后，PPT 必须展示此路由表，并给每组时间确定“首选科学家 + 备选科学家”。

---

# 五、V0 → V1 → V2 → V3 → Final 必须在课堂中真正讲清楚

## V0｜直觉原型 / Pre-research Prototype
时间：Day1 立项后。目的：把研究前的直觉快速外化。
要求：不查 AI；10–15 分钟；一张照片 + 一句话假设；说明“我为什么觉得这样可能行”。升级到 V1 前必须获得至少 2 条可靠事实 + 1 个明确约束。

## V1｜证据驱动方案 A / Evidence-based Prototype A
时间：Day2 第一轮研究后。目的：把研究证据第一次转成设计。
要求：至少引用 2 条证据；标注 1 个关键功能；标注 1 个约束；写出“V0 哪一点被证据推翻/修改”。

## V2｜方案 B 或对比改进版 / Alternative or Comparative Prototype
时间：Day2 多方案比较后。目的：避免第一方案偏见。
要求：必须与 V1 至少改变 1 个关键变量；可以是不同方案 B，也可以是证据驱动的 V1 改进版；必须找一位合适 AI 科学家做风险审查；写明为什么 Accept / Modify / Reject AI 建议。升级到 V3 前必须完成公平测试设计。

## V3｜测试后迭代原型 / Tested Iteration
时间：Day3。目的：把测试失败和根因转成结构性修改。
要求：至少经历 1 次失败或暴露 1 个明确缺陷；有 Test Log；有 Root Cause；修改对应证据；能说“如果不改，会发生什么”。

## Final｜最终系统解决方案
时间：Day4。目的：把前三天验证有效的部分整合。
要求：设计冻结前完成接口检查；不从零重搭；继承 V0→V3 证据链；通过最终 Challenge；Evidence Board 显示版本变化。

## PPT 强制页面
- `版本护照：V0→V1→V2→V3→Final` 总览；
- V0 单页解释 + 示例；
- V1 单页解释 + V0 如何升级 V1；
- V2 单页解释 + V1/V2 对比；
- V3 单页解释 + Failure→Root Cause→Rebuild；
- Final 单页解释 + Design Freeze；
- 每次版本切换前的 Gate 页面；
- 每天结束显示版本进度条；
- Day4 答辩展示 `V0 vs Final` Before/After。

---

# 六、正式 Classroom PPT 内容规范

这不是课程介绍文件，也不是提醒老师下一步做什么的提词器。它是老师面对学生投屏的正式课堂界面。

学生仅看 PPT 就必须知道：现在发生什么、当前任务、规则、时限、产出、判断标准、需要选择哪位 AI 科学家、目前处于 V0/V1/V2/V3/Final 哪一版。

建议 Day1–Day4 每天约 50–65 页，合并版约 210–240 页。页数不是 KPI，信息完整度与课堂可执行性才是 KPI。

## Day1 必须包含
- 四日 Mission 与项目制地图；
- 12+1 项目市场，每个项目至少一张可读屏幕卡；
- A01-A09 科学家总览与逐一介绍；
- 项目→科学家路由；
- 团队角色与合作协议；
- Project Charter 全屏模板；
- Research Question 练习；
- V0→Final 版本护照；
- V0 完整任务卡、示例、倒计时、拍照封存、Gate。

## Day2 必须包含
- 什么是可靠证据；
- Research Question Tree 示例；
- 选哪位科学家的判断页；
- AI Scientist Prompt 卡；
- Accept/Modify/Reject 卡；
- Evidence Card；
- 方案 A/B 比较模板；
- V1/V2 定义和对比；
- Test Plan 屏幕模板与公平测试规则。

## Day3 必须包含
- 测试公平性；
- Challenge Card 屏幕版；
- Failure is Data；
- Root Cause 5 Why / 因果链；
- V3 升级规则；
- A09 系统工程师审查；
- Before/After 对比；
- 再测试。

## Day4 必须包含
- Design Freeze；
- Final 集成检查；
- 接口冲突检查表；
- Evidence Board 模板；
- V0→V1→V2→V3→Final 故事线；
- 答辩结构；
- 评委问题卡；
- Rubric 屏幕版；
- Peer Review；
- Final Reflection。

## 禁止空壳页
禁止：只有标题 + “👉 做某事”；只有卡片编号；把 Slide Manifest 直接转成 PPT；连续 10 页没有有效图示/卡片/模板/知识内容。

必须出现：月球基地场景图、信息图、流程图、卡片墙、科学家智能体头像/身份卡（统一原创 AI 专家视觉，不冒充真人）、版本进度条、对比图、测试矩阵、证据板、任务卡、选择界面、决策界面。

正式上课版不要把内部 SOP 编号/材料编号作为学生看到的主要视觉信息，只能在角落保留教师索引。

---

# 七、教师 SOP 必须是真正分钟级，不得模板化

正常教学单元每 5 分钟一个执行行，最长不超过 10 分钟。20–40 分钟 Build/Test 必须拆分成多个微段。

例如一个 20 分钟 Build：
- 00:00–02:00：PPT 显示任务卡，老师读任务、强调 Done When；
- 02:00–05:00：学生先画/讨论，禁止拿积木；
- 05:00–12:00：第一轮搭建，老师只观察不纠正；
- 12:00–16:00：同伴检查，按 2 个问题反馈；
- 16:00–19:00：修改；
- 19:00–20:00：拍照、版本编号、归档。

每一行必须有 18 个字段：Day、精确开始时间、精确结束时间、时长、对应 PPT 页、PPT 此刻显示什么、教师逐字话术、教师动作、学生动作、桌面物料、咔得乐动作、EvoMind 是否使用、若使用则选哪位 AI 科学家/如何选择、学生产出、现场验收、常见卡点与处理、高阶扩展、下一段衔接。

话术不得统一写“现在请大家看屏幕”。例如 V0 开始应该明确说：
> “这一版故意不准问 AI。我要保留你们还没研究之前的直觉。12 分钟后我们拍照封存，明天再看哪些地方被证据推翻。”

AI 科学家环节要细化为：
- PPT 显示 9 位科学家，学生分类自己的问题；
- 每组选择首选科学家；
- 按 Prompt 结构发问；
- 填写 Accept/Modify/Reject。

生成 `PPT_SOP_CROSSWALK.csv`：`Minute Range | SOP ID | PPT Page | Card ID | Scientist Agent | Prototype Version | Deliverable`。不得存在孤儿 PPT 页，也不得存在没有 PPT 支撑的关键 SOP 环节。

---

# 八、教师逐页讲解手册

每一张 Classroom PPT 都必须一一对应教师解释：
- 此页目的；
- 为什么此时出现；
- 老师第一句话；
- 关键解释；
- 不能直接告诉学生什么；
- 预计停留时间；
- 学生动作；
- 追问；
- 卡住怎么办；
- 何时翻页。

不得只写泛化说明。

---

# 九、先设计闸门，再批量生产

正式生成 PPT 前必须先提交并 QA：
1. `PPT_V8_SLIDE_ARCHITECTURE.md`
2. `AI_SCIENTIST_ROSTER_AND_ROUTING.md`
3. `PROTOTYPE_VERSION_SYSTEM_V0_FINAL.md`
4. `MINUTE_SOP_V8_MANIFEST.md`
5. `PPT_SOP_CARD_CROSSWALK.md`
6. `PPT_SKILL_EXECUTION_PLAN.md`

六项 PASS 后才调用 `EvomindPPT生成【自研】` 批量生产。

---

# 十、正式交付清单

- Day1 Classroom PPT.pptx
- Day2 Classroom PPT.pptx
- Day3 Classroom PPT.pptx
- Day4 Classroom PPT.pptx
- 四日 Classroom PPT 合并版.pptx
- 课程方案汇报 PPT.pptx
- 教师逐分钟 SOP 完整版.pdf/docx
- Day1-Day4 SOP
- 教师逐页讲解手册.pdf/docx
- 学生工程手册
- 打印卡包
- AI 科学家卡包
- EvoMind Prompt 库
- 版本护照 V0-Final
- Rubric + Defense
- 视频宣传片
- `PPT_SKILL_EXECUTION_RECEIPT.md`
- `PPT_SOP_CROSSWALK.csv`
- `CARD_PPT_COVERAGE.csv`
- QA Report
- Final ZIP
- `.delivery_receipt.json`

---

# 十一、V8 HARD QA

若出现以下任一情况，自动 FAIL：
- 未调用 `EvomindPPT生成【自研】`；
- 正式课堂 PPT 仍是空壳标题页；
- 关键卡片只在 PDF 物料里、不在 PPT 展示；
- A01-A09 没有在 PPT 中介绍；
- 没有项目→科学家路由；
- 每次 AI 环节前没有选科学家；
- 每次 AI 环节后没有 Accept/Modify/Reject；
- V0/V1/V2/V3/Final 没有明确教学定义和升级 Gate；
- SOP 仍由统一模板批量套话；
- 普通执行块大于 10 分钟且没有拆分；
- PPT 与 SOP 对不上；
- 用课程方案 PPT 代替 Classroom PPT。

最终标准：
> 一个第一次接触此课程的老师，仅凭 Classroom PPT + 分钟级 SOP + 逐页讲解手册 + 打印材料 + EvoMind，即可连续上完四天；学生能自己选择研究项目与 AI 科学家，并用 V0→Final 的证据链解释方案为什么发生变化。