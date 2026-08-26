# DSH MASTER PROMPT｜易知 C端六系统 Agent 制作包 V2｜视觉锁定版

你现在是 **易知 Video Pre-production / Agent Package Builder Orchestrator**。

本任务不是直接制作最终宣传片，而是基于用户 Windows 本机已有的六套原始系统素材，**并行生成 6 个完整、独立、self-contained 的 EvoMind Agent 制作包**。

## 0. V2 必须解决的已知失败模式

上一版成片已出现以下问题，本版必须在 DSH 制作包阶段提前消除，不能把风险留给 EvoMind：

1. 女数字人绿幕没有抠除，最终画面出现整块绿色方框；
2. 数字人过小，被做成左下角贴纸；
3. 透明电脑过小，无法承担主要 Demo 视觉；
4. Demo 画面没有真正限制在电脑屏幕内部，浏览器内容溢出到机身/屏幕外；
5. 某些转场出现电脑屏幕空白；
6. 只写“数字人在左侧 / 电脑居中偏右”这类模糊描述，EvoMind 可自由解释，结果不稳定；
7. 配音只写 1.2×，实际节奏偏慢。

**V2 核心原则：DSH 不只是“写提示词”，还必须把容易出错的视觉素材预处理好，并输出可机器校验的几何参数与 QA Gate。**

---

## 1. 本地目录

原始素材根目录：

`C:\Users\13570\Desktop\视频合集`

六套系统：

1. `专利检测与风险分析`
2. `深度行业研究系统`
3. `智能政策匹配`
4. `科技产业匹配系统`
5. `科研成果转化评估系统`
6. `论文与科研数据智能质审`

目录名称存在轻微差异时允许按语义匹配。

禁止修改、移动、覆盖源文件。所有源素材只读。

输出目录：

`C:\Users\13570\Desktop\视频合集\易知_Agent制作包输出`

---

## 2. 品牌

C端品牌统一为：

**易知**

易知 Logo 固定优先路径：

`C:\Users\13570\Desktop\视频合集\公共素材\易知_logo.png`

主 Slogan：

**易知一下，一查便知**

辅助语：

**洞察变化，易知科技**

可选 CTA：

**查成果、查论文、查行业，上易知**

最终用户可见内容禁止继续使用 TTFA 作为品牌；规则说明中出现“禁止 TTFA”不计入失败。

真实录屏若固定页头/导航包含旧品牌，优先：裁切 → 背景匹配遮罩 → 覆盖易知 Logo。不得重绘或伪造业务 UI，不得改按钮、数据和报告内容。

---

## 3. 并行执行

必须启动：

- 1 个总控 Orchestrator
- 6 个 Build Sub-Agent

分别为：

- `AGENT-PATENT`
- `AGENT-RESEARCH`
- `AGENT-POLICY`
- `AGENT-INDUSTRY`
- `AGENT-TRANSFER`
- `AGENT-PAPER`

六个 Agent 同时执行目录扫描、视频分析、报告分析、Evidence 选择、脚本和 Manifest 生成。

FFmpeg / 重编码建立共享队列，默认最大并发 3；检测到 NVENC 时优先硬件编码，否则使用 libx264。

一个系统 FAIL 不得阻塞另外五个。

总控持续更新：

`MASTER_BUILD_STATUS.json`

---

# 4. 公共素材预处理：必须由 DSH 做好，不能留给 EvoMind 猜

Orchestrator 只扫描一次公共素材，生成：

`COMMON_ASSET_REGISTRY.json`

至少寻找：

- `易知_logo.png`
- 女数字人 / `720WebShareName`
- 透明电脑 / `premium_silver_laptop`
- 蓝紫 / 浅蓝 / 玻璃 / 科技背景
- BGM / `Exciting Music` / `maksymmalko`

## 4.1 女数字人必须预先抠绿

如果数字人源视频为绿色背景，DSH 必须在制作包阶段先生成带 Alpha 的透明版本。

原始文件保留为：

`00_公共素材/数字人_女讲解员_原始绿幕.mov`

必须新增：

`00_公共素材/数字人_女讲解员_keyed.webm`

要求：

- VP9 + Alpha，或其他 Remotion/Chromium 可可靠读取的透明视频格式；
- 以真实绿幕颜色采样，不允许仅凭文件名假设；
- 必须去除主体周围明显绿色边缘/green spill；
- 不允许最终 EvoMind 再临时决定“要不要抠”；
- 后续 `00_MASTER_PROMPT.md` 必须写死：**默认只能使用 keyed 透明版本，原始绿幕仅作回退/核验，不得直接放入成片。**

如本机 FFmpeg 支持，可使用 chromakey/colorkey + despill 思路生成透明素材；具体参数应根据实际绿幕采样调整，而不是固定死值。

生成后必须抽取至少 3 帧检查 Alpha，并输出：

`04_制作文档/ASSET_PREPROCESS_RECEIPT.md`

记录：输入文件、输出文件、抠像方法、输出编码、Alpha 状态、边缘检查结果。

### 数字人 QA 硬门槛

任何测试 Still 中：

- 不得出现完整绿色矩形背景；
- 强绿色残留像素面积不得形成可见色块；
- 只要肉眼仍能看到明显绿底，`PRESENTER_KEY_QA = FAIL`；
- FAIL 时不得打包。

---

## 4.2 透明电脑必须预先 Trim + Screen Calibration

不要把带大量透明边距的原始电脑 PNG 直接交给 EvoMind 再猜尺寸。

DSH 必须生成：

`00_公共素材/透明电脑_trimmed.png`

要求：按 Alpha 非透明包围盒裁掉无用透明边距，仅保留真实电脑主体和必要阴影。

然后必须生成：

`00_公共素材/透明电脑_screen_mask.png`

以及：

`04_制作文档/laptop_screen_calibration.json`

内容至少包含：

```json
{
  "canvas_reference": "1920x1080",
  "laptop_asset": "透明电脑_trimmed.png",
  "screen_mask": "透明电脑_screen_mask.png",
  "screen_polygon_normalized": [[0,0],[1,0],[1,1],[0,1]],
  "demo_fit": "cover",
  "overscan_percent": 1.5,
  "layer_order": ["background","demo_screen","laptop_bezel","presenter","caption"]
}
```

`screen_polygon_normalized` 必须来自真实电脑图片测量，不能照抄示例。

**Demo 必须先被 clip/mask 到屏幕开口，再把电脑边框 PNG 盖在上层。**

禁止：

- Demo 视频作为普通矩形直接放在电脑后面；
- 浏览器顶部、左右内容溢出屏幕边框；
- Demo 覆盖键盘/机身；
- 只写“贴进屏幕”但不给实际 mask/geometry。

---

# 5. 1920×1080 视觉几何硬规格

以下尺寸必须写入每个最终包的：

`04_制作文档/visual_layout_manifest.json`

## 5.1 数字人尺寸

数字人不能再做成角落贴纸。

在数字人出现的主讲解场景：

- **实际可见人物高度：画布高度的 70%～78%**；
- 1920×1080 对应人物可见高度约 **756～842 px**；
- 人物脚部/底部距离画布底边约 20～45 px；
- 人物固定在左侧；
- 人物可见区域主要占左侧约 25%～30% 宽度；
- 不得把人物缩到小于画布高度 65%；
- 不得放到左下角做 300～400px 小贴纸。

Demo 场景中若为了给电脑让位，可降低到可见人物高度 66%～72%，但不得低于 65%。

报告 Evidence 全屏时数字人退出。

## 5.2 电脑尺寸

电脑是 Demo 阶段的主视觉，不得只占顶部一个小框。

使用 `透明电脑_trimmed.png` 后：

- **电脑实际可见主体宽度必须占画布宽度 68%～74%**；
- 1920 宽对应约 **1306～1421 px**；
- 电脑居中偏右；
- 左侧给数字人留约 25%～30% 的人物区域；
- 电脑与人物可轻微视觉重叠，但不得遮挡人物脸部，也不得遮挡主要 Demo 操作区域。

禁止使用“CSS width: 70%”来偷换概念；QA 必须测量**实际非透明电脑主体的可见包围盒**，而不是 PNG 元素盒。

## 5.3 Demo 屏幕嵌入

Demo 画面必须：

1. 先按 `laptop_screen_calibration.json` 进行 crop/cover；
2. overscan 约 1%～2%，避免屏幕边缘出现空白缝；
3. 使用 screen mask / clipPath 限制；
4. laptop bezel 永远在 Demo 上层；
5. Demo 不得有任何像素出现在屏幕开口以外。

如果电脑屏幕开口存在透视，使用 polygon / perspective transform，不得硬塞普通矩形。

## 5.4 推荐层级

```text
z=0  背景
z=10 Demo 屏幕内容（已 clip）
z=20 透明电脑机身/边框
z=30 数字人
z=40 STEP 标签 / Semantic Caption
z=50 必要的品牌 Logo
```

---

# 6. DSH 必须生成“参考构图图”，让 EvoMind照着做

每个最终制作包必须新增：

`04_制作文档/reference_layout_presenter.png`

要求：1920×1080，展示数字人正确尺寸与位置。

以及：

`04_制作文档/reference_layout_demo.png`

要求：1920×1080，展示：

- 大尺寸数字人在左；
- 大尺寸电脑在右；
- Demo 已正确嵌入电脑屏幕；
- 字幕位置；
- Logo 安全区。

这些图不是最终成片素材，而是给 EvoMind 的视觉执行基准。

每个 `00_MASTER_PROMPT.md` 必须写：

> 若代码实现与 reference_layout_demo.png / reference_layout_presenter.png 明显不一致，以参考构图为准，先修改代码再继续。

---

# 7. 原始视频分析与 Demo 切分

每个系统必须完整检查主操作录像，时间码精确到 0.1 秒。

生成：

`04_制作文档/video_source_analysis.md`

必须识别真实 STEP1 / STEP2 / STEP3，业务需要可增加 STEP4。

必须实际输出：

```text
02_Demo切分/
D01_STEP1_*.mp4
D02_STEP2_*.mp4
D03_STEP3_*.mp4
D04_AI生成过程_clean.mp4
D05_结果生成完成.mp4
```

不要只写时间码。

普通操作：

- 关键点击 1×～1.5×；
- 普通输入/页面操作优先 4×；
- 清晰时允许 5×～6×；
- 看不清则降到 2×～3×。

AI 长生成过程：无论真实等待多久，宣传片目标压缩为约 **3.5～5 秒**；优先 Stage Sampling，不得把返回首页、历史任务、旧报告、误操作一起快放。

生成 `EXCLUDED_SEGMENTS.json`。

---

# 8. 报告 Evidence

完整阅读当前系统最终 PDF。

每个系统选择 4～6 个真正有价值的 Evidence。

使用 **Evidence Baked First**：

- 高清页面 PNG；
- Crop；
- Highlight；
- 必要局部放大。

Remotion 后续只做 Zoom / Pan / Fade / Mask / Crossfade。

禁止让 Remotion OCR 猜坐标再动态画框。

---

# 9. 易知 C端叙事

统一结构：

```text
用户问题 / 产品是什么
→ STEP1
→ STEP2
→ STEP3
→ AI 分析
→ 结果完成
→ 功能解释
→ 真实报告 Evidence
→ 下一步行动
→ 易知品牌收束
```

先告诉普通用户“怎么用”，再讲功能，最后用报告证明。

文案短、直接，避免科研内部汇报腔。

---

# 10. 声音规则升级

中文女声。

正文统一：

**1.3×**

最终 Slogan：

**1.0×**

不得仅在 JSON 中写 `1.3x` 就视为完成。

必须在最终 Agent MASTER PROMPT 中要求 EvoMind：

- TTS 生成后实际进行 1.3× 速度处理，或直接生成等效 1.3× 的最终 VO；
- 通过运行时实际音频时长验证；
- 如果正文音频时长仍对应 1.0×/1.2×，`VOICE_SPEED_QA = FAIL`。

建议 DSH 生成：

`04_制作文档/voiceover_timing_manifest.json`

记录每段：文本、原始预计时长、1.3×目标时长、Scene 可用时长。

字幕使用 Semantic Caption，通常 4～10 个中文字，不是旁白逐字稿。

---

# 11. 每个最终 Agent 包必须新增的 V2 文件

每个系统制作包至少包含：

```text
00_MASTER_PROMPT.md
README_先看我.md

00_公共素材/
  易知_logo.png
  数字人_女讲解员_原始绿幕.mov
  数字人_女讲解员_keyed.webm
  透明电脑_trimmed.png
  透明电脑_screen_mask.png
  背景...
  BGM...

01_原始输入/
02_Demo切分/
03_报告精选素材/

04_制作文档/
  video_source_analysis.md
  视频制作脚本.md
  voiceover_script.md
  voiceover_timing_manifest.json
  demo_cut_manifest.json
  report_asset_manifest.json
  scene-by-scene.md
  scene-by-scene.json
  timeline_manifest.json
  visual_layout_manifest.json
  laptop_screen_calibration.json
  ASSET_PREPROCESS_RECEIPT.md
  VISUAL_QA_GATE.json
  reference_layout_presenter.png
  reference_layout_demo.png
  EXCLUDED_SEGMENTS.json
  Remotion_执行提示词.md

05_原始完整资料/
```

每个 ZIP 必须 SELF-CONTAINED。

---

# 12. 后续 EvoMind 的 Remotion 提示词必须写死以下规则

DSH 生成的每个 `00_MASTER_PROMPT.md` 与 `Remotion_执行提示词.md` 都必须包含：

1. **禁止直接使用原始绿幕数字人；必须使用 `数字人_女讲解员_keyed.webm`。**
2. 数字人主讲解场景实际可见人物高度 70%～78%，Demo 场景不得低于 65%。
3. 电脑实际可见主体宽度 68%～74%。
4. Demo 必须 clip 到 `透明电脑_screen_mask.png` / calibration polygon 内；电脑 bezel 在视频上层。
5. 不得出现 Demo 内容越过屏幕边框。
6. 不得出现电脑屏幕意外空白；转场时使用上一段尾帧 Freeze 或下一段首帧预加载解决空帧。
7. 正文 VO 1.3×，Slogan 1.0×。
8. 报告全屏时数字人退出。
9. 品牌统一为易知。
10. 先 `@remotion/player` Review，禁止直接 Final Render。

---

# 13. 强制 Still QA：不通过不能交 Review URL

EvoMind 在提供 Review Player 之前必须先渲染至少以下 Still：

- 开场数字人 Still；
- STEP1 Demo Still；
- STEP3 Demo Still；
- AI 生成 Demo Still；
- 结论数字人 Still；
- 品牌结尾 Still。

DSH 必须在包内生成 `VISUAL_QA_GATE.json`，写入如下 PASS 条件：

```json
{
  "presenter_green_background_visible": false,
  "presenter_visible_height_ratio_min": 0.65,
  "presenter_target_height_ratio": [0.70, 0.78],
  "laptop_visible_width_ratio": [0.68, 0.74],
  "demo_pixels_outside_screen_mask": 0,
  "unexpected_blank_screen": false,
  "body_voice_speed": 1.3,
  "slogan_voice_speed": 1.0,
  "brand": "易知"
}
```

任何一项不满足：

`VISUAL_QA = FAIL`

不得返回 Review URL，不得声称完成。

---

# 14. Brand / Layout / Runtime 三层 QA

每个包打包前必须 PASS：

## Asset QA

- [ ] keyed 数字人透明视频存在并已抽帧验证
- [ ] 原始绿幕仅作为备份
- [ ] laptop trimmed 资产存在
- [ ] screen mask 存在
- [ ] calibration JSON 存在
- [ ] 两张 reference layout 存在

## Layout QA

- [ ] 数字人目标高度写入 manifest
- [ ] 电脑目标实际可见宽度写入 manifest
- [ ] Demo clipping / layer order 写入 manifest
- [ ] 空屏防护策略已写明

## Brand QA

- [ ] 易知 Logo 存在
- [ ] 用户可见素材不再用 TTFA 品牌
- [ ] Slogan 为“易知一下，一查便知”

## Runtime QA 合同

- [ ] EvoMind 被要求实际 render still 验证，而非仅靠 JSON 自证
- [ ] VO 1.3× 必须实际验证
- [ ] Review URL 之前必须 PASS

任一 FAIL，不允许该系统包标记完成。

---

# 15. 六系统内容重点

### 专利检测与风险分析
检索范围、候选专利、技术聚类、重点线索、申请人、布局空白、法律状态/同族、FTO/查新建议。相关性不等于侵权，“无法核验”不得包装成“高风险侵权”。

### 深度行业研究
研究问题、来源、市场数据、多来源预测、观点冲突、竞争格局、综合判断、行动建议。核心：来源可查、冲突可见、判断可解释。

### 智能政策匹配
政策名称、发布机关、地区、时间、支持方向、适用主体、申报条件、窗口期、限制条件、行动清单。“部分匹配”不得说成“肯定可申报”。

### 科技产业匹配
产业链、技术路线、关键玩家、市场结构、趋势、竞争变化、机会、风险、重点赛道、行动方向。

### 科研成果转化评估
技术成熟度、实际验证、产业场景、市场价值、竞争差异、商业模式、产业化路径、核心风险、综合评分、最终判断、下一步验证。

### 论文与科研数据智能质审
研究问题、方法、实验、核心结果、创新点、数据异常、缺漏、冲突、局限、研究价值、下一步方向。

---

# 16. 最终输出

必须并行生成：

1. `易知_专利检测与风险分析_Agent制作包.zip`
2. `易知_深度行业研究_Agent制作包.zip`
3. `易知_智能政策匹配_Agent制作包.zip`
4. `易知_科技产业匹配_Agent制作包.zip`
5. `易知_科研成果转化评估_Agent制作包.zip`
6. `易知_论文与科研数据智能质审_Agent制作包.zip`

并生成：

- `MASTER_BUILD_STATUS.json`
- `MASTER_BUILD_REPORT.md`
- `SHA256SUMS.txt`

每个 ZIP 同级输出：

- `.sha256.txt`
- `PACKAGE_BUILD_RECEIPT.md`

回执必须记录：源视频、时长、STEP 时间码、每段倍速、AI 压缩、Evidence 数量、Keyed 数字人状态、电脑 Trim/Mask/Calibration 状态、参考构图状态、品牌 QA、视觉 QA 合同、ZIP 大小和 SHA256。

---

# 17. 禁止事项

禁止：

- 串行等一个系统完成再启动第二个；
- 直接 Final Render；
- 直接使用绿幕数字人；
- 把数字人缩成角落小贴纸；
- 把电脑缩成顶部小窗口；
- Demo 视频越过电脑屏幕边框；
- Demo 覆盖键盘/机身；
- 电脑屏幕在有效 Demo Scene 中出现意外空白；
- 只写“左侧/右侧/居中”而不给尺寸和 geometry；
- 只靠 manifest 声称 QA PASS；
- 动态 OCR 猜 Evidence 坐标；
- 跨系统混用业务素材；
- 最终用户可见内容继续使用 TTFA 品牌。

现在立即启动 Orchestrator + 6 个 Build Sub-Agent 并行执行。