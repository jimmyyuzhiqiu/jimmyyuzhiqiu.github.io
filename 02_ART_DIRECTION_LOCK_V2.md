# ART DIRECTION LOCK V2｜云知师AI教师版

> 本文件优先级高于 V1 中所有“高级感 / 科技感 / 蓝紫风”等模糊视觉描述。

## 1. 目标

成片必须像成熟 AI SaaS 产品发布片，而不是：

- PPT 宣传片；
- 企业模板视频；
- 政府汇报风；
- 卡片拼贴信息图；
- 廉价霓虹科技风。

视觉关键词：**明亮、克制、留白、现代、产品感、教育科技、连续叙事**。

参考气质：Apple 产品发布、Linear、Arc、Notion 等现代 SaaS，但保留教育产品的可信与亲和。

## 2. 背景

主背景：白色 / 极浅蓝灰。

允许：
- 右上柔和蓝色光晕；
- 左下极淡薰衣草紫光晕；
- V1 蓝紫背景可放大、裁切、Blur、降透明度使用。

禁止：
- 大面积深蓝；
- 黑底主风格；
- 高饱和霓虹；
- 彩虹渐变；
- 满屏粒子。

背景必须像空气，不抢主体。

## 3. 一屏一个重点

每个 Scene 必须只有：

- 1 个 Primary Focus；
- 最多 1 个 Secondary Support。

数字人讲话时，数字人是 Primary。
Demo 时，产品 UI 是 Primary。
成果时，PPT / 报告 / 图片 / 教学网页是 Primary。

禁止数字人 + 小电脑 + 3 张卡片 + 大标题 + 长字幕同时抢注意力。

## 4. 数字人

默认素材：V1 `数字人_女讲解员_keyed.webm`。

主讲 Scene：人物实际可见高度 70%–78%。
Demo Scene：人物实际可见高度不得低于 65%。

固定左侧，接近底部安全区。

禁止：
- 角落小贴纸；
- 再套白卡；
- 发光描边；
- 人物漂浮在中央。

验收以 Rendered Still 中真实人物 bbox 为准，不以 CSS 容器尺寸自证。

## 5. 电脑 Demo

使用 V1：
- `透明电脑_trimmed.png`
- `透明电脑_screen_mask.png`
- `laptop_screen_calibration.json`

电脑实际可见主体宽度：68%–74%。

固定图层：
1. Background
2. Demo Video
3. Screen Mask / Clip
4. Laptop Bezel
5. Presenter
6. Caption / UI

Demo 任意像素不得溢出电脑显示屏。

电脑只用于：工作台、任务输入、AI执行、Skill选择等“操作感”场景。

## 6. 成果页面必须大

以下内容如果缩进电脑后不可读，直接全屏或 85%–95% 大画幅：

- PPT；
- 教案 / 文档；
- 报告；
- 图片生成结果；
- 互动教学网页；
- 数据智审结果；
- 高信息密度表格。

原则：**证据可读性 > 外框统一性**。

## 7. 禁止卡片海

同屏同款圆角卡片最多 2 张。

如果需要表达 6 个能力，不做 6 张功能卡。

改用：
- 一个真实工作台主画面；
- 关键词沿路径依次出现；
- 或 4 个阶段词：备课 → 课堂 → 分析 → 教研。

## 8. 字体

优先：PingFang SC / Microsoft YaHei / Noto Sans CJK SC。

HERO：72–88px。
Scene Title：48–58px。
核心词 / 数字：56–72px。
辅助正文：28–34px。
Semantic Caption：34–40px。
核心文字不得低于 26px。

同屏字体层级最多 3 级。

## 9. 字幕

旁白不是字幕。

字幕只显示当前 Scene 的核心语义：
- 4–10 个中文字为主；
- 最长 18 个中文字；
- 最多 2 行；
- 不使用厚黑描边。

示例：
- `输入课题与学情`
- `AI开始连续执行`
- `课堂素材，即时生成`
- `复杂材料，快速理清`
- `成果进入日常协作`

## 10. Motion Language

允许：
- Camera Push In / Pull Out；
- Mask Reveal；
- Blur Dissolve；
- Shared Element Transition；
- Soft Scale 0.96→1.00；
- Line Draw；
- Content Expand；
- Viewport Pan；
- Number Count-up。

禁止：
- Bounce；
- Spin；
- 3D Flip；
- Cube；
- 百叶窗；
- 翻书；
- 粒子爆炸；
- Emoji 飞入。

每个 Scene 只用 1 种主要进入方式。

## 11. 连续转场

优先用 Shared Element：

- 电脑里的 PPT 结果 → Expand → 下一幕全屏 PPT；
- 电脑里的教学图片 → Expand → 全屏图片；
- 数据分析结果 → Highlight → “下一课改进”文字节点；
- 教学成果文件 → 连线 → 飞书 / 钉钉。

不要 Scene A 全 Fade 掉，再重新出现 Scene B。

## 12. 隐藏视觉主线

整片围绕一条细蓝紫路径：

`课前 → 课中 → 课后 → 下一课`

它可以以细线、光点或局部路径形式轻微出现。

最后形成闭环，服务核心产品逻辑：

> 让每一堂课，都能在上一堂课的基础上继续进化。

## 13. Review 前必须 Still QA

至少 Render：S01 / S02 / S04 / S05 / S07 / S10 / S12。

每张 Still 都要检查：
- 0.5 秒内是否知道主视觉在哪里；
- 是否出现卡片海；
- 数字人是否过小；
- 产品成果是否可读；
- 字幕是否过长；
- 是否像 PPT / 模板宣传片。

任何一项 FAIL：先改，不得返回 Review URL。
