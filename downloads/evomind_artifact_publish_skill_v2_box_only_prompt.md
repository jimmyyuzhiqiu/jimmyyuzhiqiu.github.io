# evomind_artifact_publish_skill_v2｜Box → ChatGPT 专用发布 Skill 升级提示词

> 目标：新建并实现一个专门服务于 **EvoMind → Box → ChatGPT** 的发布 Skill：`evomind_artifact_publish_skill_v2`。
>
> 本 Skill **不再承担 GitHub / Gitee / tunnel / 公网直链发布职责**。这些能力继续保留在现有 `evomind_artifact_publish_skill_v1` 中。
>
> V2 的唯一核心目标：**EvoMind 生成的各种产物，自动整理并上传到 Box，使 ChatGPT 能尽可能直接搜索、读取、预览和分析。**

---

# 0. 总原则

1. **不要删除、覆盖或破坏 V1。**
   - `evomind_artifact_publish_skill_v1` 保持原样，继续负责公网直链、大文件分片、Gitee/GitHub/tunnel 等旧能力。
   - 新建独立 Skill：`evomind_artifact_publish_skill_v2`。

2. **V2 = Box only。**
   - 不实现 GitHub。
   - 不实现 Gitee。
   - 不实现 Pinggy/tunnel。
   - 不实现公开下载链接作为核心逻辑。
   - 所有发布结果统一进入 Box。

3. **V2 = GPT-readable first。**
   - 不只是“把文件传到 Box”。
   - 必须根据文件类型，决定如何组织为 ChatGPT 可直接读取的形式。
   - 原始文件必须保留，同时生成必要的“GPT 可读镜像”。

4. **使用已经验证通过的正式 Box OAuth。**
   - 禁止使用 Developer Token 作为长期凭据。
   - 使用现有 `access_token + refresh_token`。
   - 401 自动刷新。
   - refresh token rotation 后必须原子覆盖保存最新 refresh token。
   - 新进程无需人工再次授权即可继续发布。

5. **安全优先。**
   - token / refresh token / Client Secret / `.env` 不得输出到 stdout、日志、报告、Box 文件。
   - 凭据文件保持 `chmod 600`。
   - 所有日志仅允许脱敏。

---

# 1. 先读取真实现状

开始实现前必须自动发现并读取：

- 当前 `evomind_artifact_publish_skill_v1` 的真实安装位置；
- V1 的 `SKILL.md` / README / scripts；
- 当前 Box OAuth 凭据文件真实位置；
- 当前 Box 上传/刷新 token 的已验证脚本；
- 已存在的 `/EvoMind-Cloud-Test/` 测试结果与报告。

不得凭空假设路径。

先输出：

```text
V1_DISCOVERY=PASS|FAIL
BOX_OAUTH_DISCOVERY=PASS|FAIL
```

---

# 2. Box 目录规范

默认根目录：

```text
/EvoMind-Artifacts/
```

每次发布建立独立 artifact 目录：

```text
/EvoMind-Artifacts/<YYYYMMDD>/<artifact_slug>/
├── original/
├── readable/
├── analysis/
└── manifest/
```

说明：

- `original/`：完整原始产物，事实源。
- `readable/`：ChatGPT 直接可搜索/读取的文件。
- `analysis/`：视频抽帧、转写、contact sheet 等分析辅助产物。
- `manifest/`：manifest、索引、发布报告。

---

# 3. 普通文档策略

以下文件默认直接同时进入 `original/` 和 `readable/`：

```text
.md .txt
.pdf
.doc .docx
.ppt .pptx
.xls .xlsx
.csv .tsv
.json
.html .htm .xml
.py .js .ts .sh
.png .jpg .jpeg .webp .gif
```

必须记录：

- Box file_id
- Box folder_id
- 文件名
- size
- sha256
- mime
- modified time
- `chatgpt_readable=true|false`

对于 DOCX/PDF/XLSX/PPTX，发布后必须至少完成：

1. Box 上传成功；
2. Box list 能看到；
3. 下载回本地；
4. SHA256 一致。

---

# 4. ZIP / TAR / 压缩包策略

这是 V2 的核心能力之一。

ChatGPT 当前通过 Box App 可以看到 ZIP 文件及元数据，但不能直接读取 ZIP 内部内容。因此当输入为：

```text
.zip
.tar
.tar.gz
.tgz
```

必须同时执行：

## A. 保留原包

上传到：

```text
original/<archive_name>
```

原包用于：

- 完整归档；
- 下载；
- 安装；
- 重新处理；
- SHA256 校验。

## B. 生成 GPT 可读展开镜像

在本地安全 staging 目录解压，然后把适合 ChatGPT 读取的文件上传至：

```text
readable/
```

必须保留相对目录结构。

例如：

```text
artifact.zip

→ Box

original/artifact.zip
readable/SKILL.md
readable/README.md
readable/references/xxx.md
readable/examples/demo.json
manifest/file_tree.md
```

## C. 安全解压

必须防止：

- Zip Slip / `../`
- 绝对路径
- symlink 越界
- 解压炸弹
- 文件数异常

默认阈值可配置：

```text
max_files = 10000
max_total_uncompressed_bytes = 2GB
max_single_file_bytes = 500MB
```

超限：

- 原包仍上传；
- 不展开；
- manifest 标记原因。

## D. Secret 阻断

以下文件默认不得进入 `readable/`：

```text
.env
*.pem
*.key
credentials*
secrets*
*_token*
*refresh_token*
*client_secret*
.ssh/
.aws/
```

同时对文本做基础 secret/token pattern 扫描。

---

# 5. Skill 包专项优化

如果归档内发现：

```text
SKILL.md
README.md
skill.json
manifest.json
references/
examples/
assets/
```

则识别为：

```text
artifact_kind=skill_package
```

GPT 可读镜像至少上传：

```text
SKILL.md
README.md
references/**/*.md
references/**/*.pdf
examples/**/*.md
examples/**/*.txt
examples/**/*.json
examples/**/*.pdf
examples/**/*.docx
examples/**/*.pptx
examples/**/*.xlsx
```

并自动生成：

```text
manifest/skill_index.md
```

内容至少包含：

- Skill 名称
- 版本
- 真实入口文件
- 文件树
- 关键说明文件
- 原始 ZIP Box file_id
- 展开文件 Box file_id
- SHA256
- 哪些文件适合 ChatGPT 直接读取
- 哪些文件仅保留为原始二进制

目标：

> ChatGPT 无需解 ZIP，也能完整理解这个 Skill 的定义、结构、参考资料和主要示例。

---

# 6. 视频专项：为 ChatGPT 生成“可视分析镜像”

当输入为：

```text
.mp4
.mov
.m4v
.webm
```

不要假设 ChatGPT 能直接通过 Box 播放并逐帧理解原视频。

必须执行：

## A. 原视频保留

上传：

```text
original/video.mp4
```

记录：

- Box file_id
- SHA256
- size
- duration
- width
- height
- fps
- codec
- bitrate

使用 `ffprobe` 生成：

```text
analysis/video_metadata.json
```

## B. 抽帧

默认策略：

```text
每 0.5 秒抽 1 帧
+
scene change 抽帧
```

生成：

```text
analysis/frames_interval/
analysis/scene_cuts/
```

对于 >5 分钟视频，可自动调低到每 1–2 秒一帧。

禁止默认全帧上传。

## C. Contact Sheet

自动生成：

```text
analysis/contact_sheet.jpg
```

用于 ChatGPT 快速整体审片。

## D. 字幕 / 文本

如果已有：

```text
.srt
.vtt
narration.txt
storyboard.json
```

必须一起上传。

如果环境已有可靠转写能力，可生成：

```text
analysis/transcript.srt
analysis/transcript.txt
```

若没有，不强行安装大型依赖；在 manifest 标记 `transcript_available=false`。

## E. Remotion / Skill 视频特别要求

如能找到对应：

```text
SKILL.md
storyboard.json
narration.txt
subtitle.srt
source screenshots
```

必须一起放入 artifact 目录。

目标是让 ChatGPT 可以做：

- Skill 真义 vs 视频内容对齐；
- 逐镜头节奏分析；
- UI 截图清晰度检查；
- 字幕/旁白/画面一致性；
- 错帧、黑帧、冻结帧定位；
- 指定时间码修改建议；
- Remotion Scene 级优化建议。

---

# 7. 图片策略

对图片：

```text
.png .jpg .jpeg .webp
```

原图直接上传到 `readable/`。

若一个 artifact 含大量截图，额外生成：

```text
manifest/image_index.md
analysis/contact_sheet.jpg
```

`image_index.md` 记录：

- 文件名
- 尺寸
- 相对路径
- 对应时间码/页面/场景（若可识别）
- Box file_id

---

# 8. Manifest

每次发布至少生成：

```text
manifest/manifest.json
manifest/manifest.md
manifest/publish_report.md
```

`manifest.json` 至少：

```json
{
  "schema_version": "2.0",
  "publisher": "evomind_artifact_publish_skill_v2",
  "storage": "box",
  "artifact_name": "...",
  "artifact_kind": "document|archive|skill_package|video|image_set|directory|binary",
  "created_at": "ISO8601",
  "original": {
    "box_file_id": "...",
    "sha256": "...",
    "size_bytes": 0
  },
  "readable": {
    "box_folder_id": "...",
    "files": []
  },
  "analysis": {
    "box_folder_id": "...",
    "files": []
  },
  "verification": {
    "upload_ok": true,
    "list_ok": true,
    "download_ok": true,
    "sha256_ok": true
  },
  "blocked_files": [],
  "warnings": []
}
```

每个可读文件至少记录：

```json
{
  "relative_path": "SKILL.md",
  "box_file_id": "...",
  "sha256": "...",
  "size_bytes": 0,
  "mime": "text/markdown",
  "chatgpt_readable": true,
  "role": "skill_definition"
}
```

---

# 9. Box OAuth 实现要求

必须复用已经验证成功的正式 OAuth 逻辑。

关键要求：

1. `GET /users/me` 验证当前账号。
2. `access_token` 正常调用。
3. 收到 401：
   - 使用 refresh token 刷新；
   - 保存新 access token；
   - 保存新 refresh token；
   - 旧 refresh token 立即废弃。
4. 写凭据必须原子化：
   - tmp 文件；
   - fsync；
   - rename；
   - chmod 600。
5. 任何日志不得输出完整 token。

Box API 已验证注意事项：

```text
普通 API:
https://api.box.com/2.0/...

新文件上传:
POST https://upload.box.com/api/2.0/files/content

已有文件上传新版本:
POST https://upload.box.com/api/2.0/files/{file_id}/content
```

不要使用 PUT 上传文件内容。

同名文件必须幂等：

- 先 list/search；
- 建立 `name -> file_id`；
- 已存在则上传新 version；
- 不创建重复副本。

---

# 10. CLI

实现统一入口，例如：

```bash
python3 publish_to_box_for_gpt.py /path/to/artifact
```

参数至少：

```text
--box-root EvoMind-Artifacts
--expand-archives
--no-expand-archives
--video-analysis
--no-video-analysis
--frame-interval 0.5
--overwrite
--dry-run
```

Skill 的自然语言调用示例：

```text
把这个文件发布到 Box 给 GPT 分析
```

```text
把这个 Skill 包发给 GPT
```

```text
把这支视频发给 GPT 审片
```

调用者不需要理解 Box API。

---

# 11. 自动路由规则

输入文件后自动判断：

```text
DOCX/PDF/PPTX/XLSX
→ 原文件直接 Box

ZIP/Skill ZIP
→ 原 ZIP + 安全解压 + GPT 可读镜像

MP4/MOV
→ 原视频 + metadata + 抽帧 + scene cuts + contact sheet + transcript(可用时)

图片目录
→ 原图 + image_index + contact sheet

其他 binary
→ 原文件保留 + metadata，chatgpt_readable=false
```

---

# 12. 测试矩阵

必须实际测试，不接受只写代码不运行。

## Test A｜DOCX

- 上传
- list
- 下载
- SHA256

## Test B｜PDF

同上。

## Test C｜XLSX

同上。

## Test D｜PPTX

同上。

## Test E｜ZIP

建立 ZIP：

```text
SKILL.md
README.md
references/test.md
secret_inside.txt
```

验证：

- ZIP 原包存在于 `original/`；
- 3 个普通文本进入 `readable/`；
- ChatGPT 不需要读取 ZIP 即可读取展开内容。

## Test F｜Secret

ZIP 中放：

```text
.env
credentials.json
```

验证不得上传到 readable。

## Test G｜视频

使用一支短 MP4：

- 原视频上传；
- metadata.json；
- interval frames；
- scene cuts；
- contact sheet；
- manifest 完整。

## Test H｜OAuth Refresh

模拟 access token 失效或直接执行 refresh：

- 新 access token 成功；
- refresh token rotation 成功；
- 新进程继续上传成功。

---

# 13. ChatGPT 侧验收目标

最终不是只证明“Box 上传成功”，而是证明：

```text
EvoMind
  ↓
V2 Skill
  ↓
Box
  ↓
ChatGPT Box App
  ↓
直接搜索 / 读取 / 预览 / 分析
```

验收内容：

1. DOCX 可读；
2. PDF 可读；
3. XLSX 可读；
4. PPTX 可读；
5. ZIP 展开后的 SKILL.md 可读；
6. 原 ZIP 仍完整保留；
7. 视频分析包中的抽帧图片和文本可供 GPT 审片；
8. 所有路径和 file_id 可通过 manifest 定位。

---

# 14. Skill 自身交付

最终生成完整 Skill：

```text
evomind_artifact_publish_skill_v2/
├── SKILL.md
├── README.md
├── scripts/
├── references/
├── tests/
└── examples/
```

并完成安装/注册，使 EvoMind 后续可直接调用。

必须输出真实 Skill 路径。

---

# 15. 最终验收输出

结束时必须明确输出：

```text
V1_UNCHANGED=PASS|FAIL
BOX_OAUTH=PASS|FAIL
BOX_REFRESH_ROTATION=PASS|FAIL
DOCX_PUBLISH=PASS|FAIL
PDF_PUBLISH=PASS|FAIL
XLSX_PUBLISH=PASS|FAIL
PPTX_PUBLISH=PASS|FAIL
ZIP_ORIGINAL_PRESERVED=PASS|FAIL
ZIP_GPT_READABLE_MIRROR=PASS|FAIL
SECRET_BLOCKING=PASS|FAIL
VIDEO_ANALYSIS_PACKAGE=PASS|FAIL
MANIFEST=PASS|FAIL
SKILL_INSTALLED=PASS|FAIL
EVOMIND_ARTIFACT_PUBLISH_V2=PASS|FAIL
```

只有所有关键项 PASS，才允许：

```text
EVOMIND_ARTIFACT_PUBLISH_V2=PASS
```

---

# 16. 最终定位

请严格保持职责边界：

```text
V1
= 公网文件交付 / Gitee / GitHub / tunnel / 分片 / curl/wget

V2
= Box → ChatGPT 专用智能发布
```

V2 不要重新实现 V1 的公网发布能力。

V2 的设计原则只有一句：

> **让 EvoMind 生成的任何产物，以最适合 ChatGPT 读取和分析的方式进入 Box。**

现在开始执行：先 Discovery，再实现、测试、安装、验收。不要只输出设计方案。