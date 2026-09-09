# 云知师AI教师版 · V2视觉升级补丁包

本目录用于升级 `云知师AI教师版_DSH_Remotion半成品制作包_V1.zip`。

V2重点解决：
- 成片像PPT/模板宣传片；
- 卡片过多；
- 数字人过小；
- 电脑和产品界面过小；
- PPT/报告/图片成果不可读；
- 转场与动效缺少统一语言；
- 画面没有明确主视觉。

## 使用方式
优先方案：把本补丁目录覆盖进 V1 解压目录，然后按 `00_MASTER_PROMPT_V2.md` 执行。

Windows 可直接运行：
`apply_v2_upgrade.ps1`

脚本会将 V2 视觉文件复制到 V1 目录，并生成 `云知师AI教师版_DSH_Remotion半成品制作包_V2.zip`。

## V2硬标准
- 一屏一个主视觉；最多一个辅助视觉。
- 数字人主讲可见高度 70%–78%；Demo 场景 >=65%。
- Demo电脑可见宽度 68%–74%。
- PPT/报告/图片/教学网页优先 85%–95% 大画幅。
- 同屏不得出现 3 张以上同款圆角卡片。
- 核心文字 >=26px。
- Semantic Caption <=2行，最长18个中文字。
- 禁止 Bounce / Spin / 3D Flip / Cube / 粒子爆炸 / Emoji飞入。
- Review 前必须 Render Still 并通过 ART_DIRECTION_QA。
