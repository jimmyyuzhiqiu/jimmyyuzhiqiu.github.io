请读取并严格执行以下「易知｜单视频逐帧 + 音频理解 + Remotion 重制 V1」MASTER PROMPT，并将其作为当前任务最高优先级要求：

主地址：
`https://cdn.jsdelivr.net/gh/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io@4ada7493692f7dc00ffe9c9595a039e6c35b5d75/11_DSH_MASTER_PROMPT_单视频逐帧音频重制_V1.md`

备用地址：
`https://raw.githubusercontent.com/jimmyyuzhiqiu/jimmyyuzhiqiu.github.io/4ada7493692f7dc00ffe9c9595a039e6c35b5d75/11_DSH_MASTER_PROMPT_单视频逐帧音频重制_V1.md`

同时使用用户提供的「易知_DSH六系统_V2_半成品素材包.zip」作为公共视觉素材库，但不要执行该旧素材包根目录中的六系统任务；本次只执行上面的单视频重制 MASTER PROMPT。

本次必须先完成：

1. 完整视频 frame-level scan；
2. 疑似剪辑边界 0.1 秒精度复核；
3. 完整原音频 ASR 转写与内容理解；
4. 输出 `CUT_DECISION_TABLE.md` 和 `source_cut_manifest.json`，明确每一段“几秒到几秒 / 为什么保留 / 几倍速 / 对应哪一幕”；
5. 最终 Composition 完全删除原人物讲解音频；
6. 重新生成中文女声旁白，正文 1.3×，Slogan 1.0×；
7. 使用易知 Logo、keyed 数字人、trimmed 电脑、screen mask、两套背景和 BGM；
8. 数字人主讲解 visible height 70%–78%，Demo >=65%；
9. 软件 Demo 时电脑 visible width 68%–74%，且画面严格嵌入屏幕；
10. 原视频 talking-head 口播镜头默认删除，仅保留不可替代的产品/现场视觉；
11. 原始完整视频只作为本地 source，不复制进最终交付包；
12. 先做 @remotion/player Review，用户未说“最终渲染”前不要 Final Render。

先完成分析与切分清单，再进入 Remotion 制作。不得凭感觉写时间码。