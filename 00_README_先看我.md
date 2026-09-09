# 云知师AI教师版 · Remotion 半成品制作包 V2｜视觉升级包

这是一份用于升级 `云知师AI教师版_DSH_Remotion半成品制作包_V1.zip` 的 **V2 视觉导演层**。

## V2 解决的问题

上一版最容易出现：

- 画面像 PPT / 企业模板宣传片；
- 圆角卡片太多，主视觉不明确；
- 数字人缩成左下角贴纸；
- 电脑和真实产品界面太小；
- PPT / 报告 / 图片成果塞在小电脑里，手机端几乎看不清；
- 每一幕都各自设计，缺乏统一 Design System；
- 转场只是 Fade，没有“任务 → 执行 → 成果 → 下一课”的连续产品逻辑。

V2 把这些全部变成 **Blocking QA**，不是建议。

## 使用方式

### 方式 A｜交给 DSH 自动升级（推荐）

把以下两个 ZIP 放在同一目录：

1. `云知师AI教师版_DSH_Remotion半成品制作包_V1.zip`
2. 本 V2 升级包 ZIP

然后把 `01_DSH_启动提示词.md` 原样交给 DSH。DSH 会读取 V1 的素材/剪辑脚本，再用 V2 的 Art Direction 覆盖旧视觉规则。

### 方式 B｜Windows 本地合并成完整 V2 ZIP

将本 V2 升级包解压，与 V1 ZIP 放在同一目录，运行：

`scripts/00_合并V1并生成完整V2.ps1`

脚本会生成：

`云知师AI教师版_DSH_Remotion半成品制作包_V2.zip`

## 最高优先级文件

1. `02_ART_DIRECTION_LOCK_V2.md`
2. `03_design_tokens.json`
3. `04_ART_DIRECTION_QA.json`
4. `05_reference_layouts/` 下 5 张 SVG 构图参考
5. `06_SCENE_ART_DIRECTION_V2.md`

如果 V1 与 V2 的视觉要求冲突，**一律以 V2 为准**。

## 关键硬指标

- 主讲数字人可见高度：70%–78%；Demo 场景 ≥65%。
- 电脑 Demo 实际可见宽度：68%–74%。
- PPT / 报告 / 图片 / 教学网页：85%–95% 大画幅优先。
- 同屏最多：1 个 Primary Focus + 1 个 Secondary Support。
- 同款圆角卡片 ≥3 张：FAIL。
- 核心文字 <26px：FAIL。
- 字幕 >2 行或 >18 个中文字：FAIL。
- Bounce / Spin / 3D Flip / Cube / 粒子爆炸：FAIL。
- Review URL 前必须渲染 S01/S02/S04/S05/S07/S10/S12 Still 并完成 QA。
