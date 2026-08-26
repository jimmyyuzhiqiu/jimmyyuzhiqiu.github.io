# DSH 启动短提示词｜易知 V2 视觉锁定版

请读取并严格执行以下「易知 C端六系统 Agent 制作包 V2｜视觉锁定版」MASTER PROMPT，并将其作为本次任务最高优先级要求。

主地址：
`https://cdn.jsdelivr.net/gh/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io@b51107753171ba50f57293655eec361f9fe171d6/10_DSH_MASTER_PROMPT_易知六系统_V2_视觉锁定版.md`

备用地址：
`https://raw.githubusercontent.com/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io/b51107753171ba50f57293655eec361f9fe171d6/10_DSH_MASTER_PROMPT_易知六系统_V2_视觉锁定版.md`

本机素材根目录：
`C:\Users\13570\Desktop\视频合集`

输出目录：
`C:\Users\13570\Desktop\视频合集\易知_Agent制作包输出`

关键要求：
- 1 个 Orchestrator + 6 个 Build Sub-Agent 并行；
- DSH 阶段必须预先把女数字人抠绿生成透明 keyed 视频；
- DSH 阶段必须把电脑素材 Trim，并生成 screen mask + calibration；
- 数字人主讲解场景实际可见高度 70%～78%，Demo 场景不得低于 65%；
- 电脑实际可见主体宽度 68%～74%；
- Demo 必须严格 clip 在电脑屏幕内部，电脑 bezel 在 Demo 上层，禁止任何溢出；
- 正文中文女声 1.3×，Slogan 1.0×；
- 每个制作包必须包含 reference layout、visual_layout_manifest、VISUAL_QA_GATE；
- 后续 EvoMind 在返回 Review URL 前必须 Render Still 并通过视觉 QA；
- 禁止直接 Final Render。

不要沿用旧版模糊的“数字人左侧 / 电脑居中偏右”规则。所有布局尺寸、mask、layer order 与 QA 以 V2 MASTER PROMPT 为准。