# EvoMind Artifact Publish Skill V2.2｜递归视频分析管线修复提示词

> 任务：**原地升级现有 `evomind_artifact_publish_skill_v2`**，不要新建第三个并行 Skill。
>
> 当前已确认缺陷：当 V2 发布 ZIP/目录时，能够安全展开并上传 `.md/.png/.mov/.mp4` 等文件，但**如果压缩包内部包含视频，当前实现只把视频当作普通二进制镜像上传，并未继续触发视频分析管线**。这会导致 Box 中虽然出现 `.mov/.mp4`，但没有 `analysis/video_metadata.json`、抽帧、scene cuts、contact sheet、字幕/转写等 GPT 可分析伴生物。
>
> 本次升级目标：让 V2 对**任何层级发现的视频**都递归触发 VIDEO PIPELINE，使 ChatGPT 能通过 Box 对视频做逐镜头/局部逐帧分析。

---

## 0. 保持既有定位

`evomind_artifact_publish_skill_v2` 继续保持：

```text
V2 = Box-only
用途 = EvoMind → Box → ChatGPT
```

不要加入：

- GitHub/Gitee
- public/hybrid 模式
- tunnel
- 公网分片

这些仍属于 V1。

---

# 1. 必须修复的核心 Bug

当前错误行为：

```text
ZIP
→ 解压
→ 发现 video.mov / video.mp4
→ 上传到 readable/
→ chatgpt_readable=false
→ 结束
```

必须改为：

```text
ZIP / TAR / DIRECTORY
→ 递归扫描展开后的文件树
→ 发现 .mp4/.mov/.m4v/.webm
→ 自动注册为 nested_video artifact
→ 触发 VIDEO PIPELINE
→ 原视频保留
→ 生成 GPT 可分析伴生物
→ 上传 Box analysis/
→ 写入 manifest
```

**不能因为视频来自 ZIP 内部，就跳过 video-analysis。**

---

# 2. 统一递归 Artifact Dispatcher

建议新增/重构统一分发器，例如：

```text
artifact_dispatcher.py
```

伪逻辑：

```python
for discovered_file in recursive_scan(staging_root):
    kind = detect_artifact_kind(discovered_file)

    if kind == "video":
        run_video_pipeline(discovered_file)
    elif kind == "image":
        run_image_pipeline(discovered_file)
    elif kind == "document":
        run_document_pipeline(discovered_file)
    elif kind == "archive":
        safe_expand_then_dispatch(discovered_file)
    else:
        preserve_binary(discovered_file)
```

要求：

1. 顶层视频和 ZIP 内视频走**同一个** `run_video_pipeline()`。
2. 目录内视频、ZIP 内多层目录视频都必须触发。
3. 如果 archive 内又嵌套 archive，允许有限递归，默认：
   ```text
   max_archive_depth = 2
   ```
4. 防止循环/重复分析：按 `sha256 + relative_path` 去重。
5. 不把凭据/secret 目录送入任何分析管线。

---

# 3. VIDEO PIPELINE 输出规范

对于每个视频：

```text
.mp4
.mov
.m4v
.webm
```

必须生成独立分析目录。

推荐结构：

```text
analysis/videos/<video_slug>/
├── video_metadata.json
├── scene_index.csv
├── contact_sheet.jpg
├── frames_interval/
│   ├── frame_000001_000.0s.jpg
│   ├── frame_000002_000.5s.jpg
│   └── ...
├── scene_cuts/
│   ├── scene_001_000.0s.jpg
│   ├── scene_002_004.8s.jpg
│   └── ...
├── transcript.srt        # 可用时
├── transcript.txt        # 可用时
└── analysis_manifest.md
```

原视频本身保留在：

```text
original/
```

如果视频来源于 ZIP 展开目录，也可在 readable 中保留一个镜像/索引，但：

```text
chatgpt_readable=false
```

不能把“原视频已上传”误判为“ChatGPT 已能读取视频内容”。

---

# 4. ffprobe 元数据

使用 `ffprobe` 提取至少：

```json
{
  "duration_seconds": 0,
  "width": 0,
  "height": 0,
  "fps": 0,
  "codec": "",
  "pixel_format": "",
  "bit_rate": 0,
  "audio_codec": "",
  "has_audio": true,
  "file_size_bytes": 0,
  "sha256": ""
}
```

如果 ffprobe 不存在：

- 优先使用系统已有 ffmpeg/ffprobe；
- 若环境允许且安装成本小，可安装；
- 若不可安装，不得伪造结果，manifest 标记：
  ```text
  video_metadata_status=UNAVAILABLE
  ```

---

# 5. 默认抽帧策略

## 5.1 Interval Frames

默认：

```text
<= 5 min: 每 0.5 秒 1 帧
5–20 min: 每 1 秒 1 帧
> 20 min: 每 2 秒 1 帧
```

允许通过高级参数覆盖：

```text
--frame-interval 0.5
```

## 5.2 Scene Change Frames

同时必须做 scene change 抽帧。

可用 ffmpeg scene filter，例如基于：

```text
select='gt(scene,THRESHOLD)'
```

阈值做成配置，建议默认 `0.30~0.40`，通过测试选择稳定值。

输出必须带时间码。

## 5.3 不默认全帧上传

禁止：

```text
45s × 30fps = 1350 张全部上传
```

默认只上传 interval + scene cuts。

如后续 GPT 要求检查特定区间，再生成局部高密度帧：

```text
start=12.0s
end=15.0s
fps=10/15/30
```

此能力可预留为：

```text
extract_dense_segment.py
```

---

# 6. Contact Sheet

每个视频自动生成：

```text
contact_sheet.jpg
```

要求：

- 帧按时间顺序排列；
- 每格显示时间码；
- 默认 4–6 列；
- 不能把图片压得看不清 UI；
- 视频较长时可分页：
  ```text
  contact_sheet_001.jpg
  contact_sheet_002.jpg
  ```

目标是让 ChatGPT 快速判断：

- 节奏
- 镜头变化
- UI 清晰度
- 是否长时间静止
- 是否出现黑帧/空白

---

# 7. 字幕 / 旁白 / 转写

优先级：

### P0：已有文件

若同目录/同任务存在：

```text
.srt
.vtt
subtitle.srt
narration.txt
storyboard.json
script.md
```

自动关联到对应视频并上传。

### P1：已有可靠转写能力

如果 EvoMind 环境已经有 Whisper/faster-whisper/其他稳定转写工具，可自动生成：

```text
transcript.srt
transcript.txt
```

### P2：无转写能力

不要强装大型模型导致任务失败。

记录：

```text
transcript_available=false
reason="no reliable transcription backend"
```

视频分析管线其余部分仍必须 PASS。

---

# 8. Skill / Remotion 视频关联规则

如果视频属于 Skill 教学视频或 Remotion 输出，自动向上/同目录寻找：

```text
SKILL.md
README.md
storyboard.json
narration.txt
subtitle.srt
script.md
source_screenshots/
assets/
```

并生成：

```text
analysis/videos/<video_slug>/context_index.md
```

至少列：

- 视频名
- 对应 Skill 名
- SKILL.md Box file_id
- storyboard Box file_id
- narration/subtitle Box file_id
- source screenshot 索引
- 原视频 Box file_id
- contact sheet Box file_id
- frames/scene cuts 所在 Box folder_id

目标：ChatGPT 可以直接做：

```text
真实 Skill 定义
vs
视频实际讲述
vs
画面镜头
vs
字幕/旁白
```

四向对齐分析。

---

# 9. Manifest 必须准确

原视频条目：

```json
{
  "relative_path": ".../video.mov",
  "role": "source_video",
  "mime": "video/quicktime",
  "chatgpt_readable": false,
  "video_analysis_generated": true,
  "analysis_folder_id": "...",
  "box_file_id": "...",
  "sha256": "..."
}
```

分析伴生物：

```json
{
  "relative_path": "analysis/videos/video_x/contact_sheet.jpg",
  "role": "video_contact_sheet",
  "chatgpt_readable": true,
  "box_file_id": "..."
}
```

必须增加统计：

```json
{
  "video_analysis": {
    "videos_detected": 0,
    "videos_processed": 0,
    "videos_failed": 0,
    "interval_frames_total": 0,
    "scene_cut_frames_total": 0,
    "contact_sheets_total": 0
  }
}
```

只有：

```text
videos_detected == videos_processed
```

或失败项明确记录原因，才允许最终完成。

---

# 10. 已知真实回归样本

当前 Box 已存在真实样本：

```text
/EvoMind-Artifacts/20260816/EvoMind_技能教学视频批量制作_交付包_v1/
```

其中 ZIP 原包：

```text
EvoMind_技能教学视频批量制作_交付包_v1.zip
Box file_id=2410346867655
```

展开后发现：

```text
01_数字人_女讲解员_绿幕.mov
Box file_id=2410359577635
size≈5.95MB
```

现有 manifest 已明确：

```text
mime=video/quicktime
chatgpt_readable=false
```

但现有目录缺少：

```text
analysis/video_metadata.json
frames_interval/
scene_cuts/
contact_sheet.jpg
transcript.*
```

因此把这个真实样本作为 **Regression Test A**。

要求：

1. 不删除原 ZIP。
2. 不删除现有 Box 文件。
3. 对该 MOV 生成视频分析伴生包。
4. 上传到同 artifact 下合理的 `analysis/` 目录。
5. 更新/补写 manifest，不要破坏历史 file_id 引用。
6. 验证 ChatGPT 可以通过 Box 看到 contact sheet / 抽帧 / 元数据。

输出：

```text
REGRESSION_A_NESTED_MOV_DETECTED=PASS
REGRESSION_A_VIDEO_PIPELINE_TRIGGERED=PASS
REGRESSION_A_METADATA=PASS
REGRESSION_A_INTERVAL_FRAMES=PASS
REGRESSION_A_SCENE_CUTS=PASS
REGRESSION_A_CONTACT_SHEET=PASS
```

---

# 11. 再增加一个真正 Skill 成片回归测试

如果工作区存在真实已渲染完成的 Skill MP4，优先选择最近一支。

若没有，不要伪造。

找到后执行：

```text
真实 MP4
→ V2 publish
→ Box original
→ video analysis
→ ChatGPT-readable companion files
```

输出：

```text
REAL_SKILL_VIDEO_FOUND=PASS|NOT_FOUND
REAL_SKILL_VIDEO_PIPELINE=PASS|SKIPPED
```

如果找到真实成片，最终报告必须给出：

- 文件名
- 本地路径
- Box file_id
- duration
- fps
- 分辨率
- contact sheet Box file_id
- analysis folder id

---

# 12. 新会话自然语言行为

升级后用户在任何新会话说：

```text
AI产物
```

或：

```text
把刚才那个视频给 GPT 看
```

或：

```text
把这个 ZIP 给 GPT 分析
```

如果解析到其中含视频，则**自动生成视频分析包**，不要再问：

```text
是否开启 video-analysis？
```

默认答案永远是：

```text
video_analysis=auto/on
```

除非用户明确说“只存原视频，不要分析”。

---

# 13. 安全与资源控制

视频/归档递归处理必须限制资源：

```text
max_archive_depth = 2
max_videos_per_batch = 100
max_generated_frames_per_video = configurable
max_total_generated_frames = configurable
```

避免：

- ZIP bomb
- 大量视频导致磁盘耗尽
- 抽帧文件失控

如果超限：

- 原文件仍可保留；
- 该视频标记 `analysis_status=SKIPPED_LIMIT`；
- 报告必须明确列出。

不得处理/上传：

```text
.env
credentials*
secrets*
*_token*
*.pem
*.key
```

---

# 14. 最终验收

完成代码修改、安装/原地升级、真实回归测试后输出：

```text
EVOMIND_ARTIFACT_PUBLISH_V2_2=PASS|FAIL
BOX_ONLY=PASS|FAIL
RECURSIVE_DISPATCH=PASS|FAIL
NESTED_VIDEO_DETECTION=PASS|FAIL
NESTED_VIDEO_PIPELINE=PASS|FAIL
VIDEO_METADATA=PASS|FAIL
INTERVAL_FRAMES=PASS|FAIL
SCENE_CUTS=PASS|FAIL
CONTACT_SHEET=PASS|FAIL
TRANSCRIPT=PASS|SKIPPED
REAL_SKILL_VIDEO_PIPELINE=PASS|SKIPPED
CHATGPT_VIDEO_ANALYSIS_READY=PASS|FAIL
```

**验收条件：不能只修改 SKILL.md。必须实际修改执行代码，并用 Box 中现有 MOV 样本做端到端回归。**

最后输出：

1. 修改了哪些文件；
2. 新增了哪些脚本；
3. Regression Test A 的 Box folder/file IDs；
4. 是否发现真实 Skill 成片；
5. ChatGPT 下一步应该读取哪些 Box 文件做审片。
