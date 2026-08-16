# EvoMind Artifact Publish Skill V2｜升级实施提示词

> 目标：在**保留现有 `evomind_artifact_publish_skill_v1` 能力与兼容性**的前提下，新增一套面向 **EvoMind ↔ Box ↔ ChatGPT / Codex** 的双轨/三轨制产物发布能力。
>
> 本提示词不是让你写方案文档，而是要求你：**读取当前已安装 V1 Skill → 设计并实现 V2 → 自测 → 生成可复用 Skill → 输出验收报告**。

---

## 0. 总原则

1. **不要删除、覆盖或破坏 V1。**
   - V1 保持可用。
   - 新建独立 Skill：`evomind_artifact_publish_skill_v2`。
   - 如需复用 V1 代码，可复制/抽象公共模块，但 V1 原始行为不得被破坏。

2. **先读取真实 V1，再实现 V2。**
   - 自动定位 `evomind_artifact_publish_skill_v1` 的真实安装路径、`SKILL.md`、README、脚本、配置与调用约定。
   - 不允许凭空假设路径或接口。
   - 先输出 `V1_DISCOVERY=PASS/FAIL`。

3. **V2 的核心目标不是“上传一个文件”，而是“一次发布形成完整交付面”。**
   - 原始产物可下载。
   - ChatGPT 能直接读取可读内容。
   - EvoMind/Codex 可通过公共直链拉取。
   - 所有文件有 manifest、校验、版本、来源和验证记录。

4. **安全优先。**
   - 任何 token / secret / refresh token / client secret / `.env` / 凭据文件不得上传、打印、写入报告或 public repo。
   - 日志只允许脱敏前后缀。
   - 凭据文件权限必须保持 `600`。

---

# 1. V2 总体架构：三轨发布

一次 `publish` 至少支持以下三条轨道，可按参数选择；默认推荐 `hybrid`。

## Track A｜Canonical 原始产物轨

用途：保存完整原文件，作为下载、归档、回传、重新处理的事实源。

默认存储：**Box**。

要求：

- 使用现有正式 Box OAuth 凭据；不得回退到 Developer Token 作为长期凭据。
- 优先读取现有凭据文件，例如：
  - `/workspace/evomind-cloud-source-test/credentials/box_oauth.json`
  - 若实际路径不同，自动发现并记录；不要硬编码假路径。
- 支持：
  - access token 正常调用；
  - 401 时自动用 refresh token 刷新；
  - refresh token rotation 后**原子覆盖保存新 refresh token**；
  - 新进程无需人工再次登录即可继续发布。
- 上传后执行：
  - list/metadata 验证；
  - 下载原始文件回本地；
  - SHA256 对比；
  - 若不一致则发布失败。

### Box API 注意事项

- 普通 API：`https://api.box.com/2.0/...`
- 新文件上传：`https://upload.box.com/api/2.0/files/content`
- 新版本/覆盖上传：`POST https://upload.box.com/api/2.0/files/{file_id}/content`
- 不要错误使用 PUT 覆盖文件内容。
- 同名文件必须采用**幂等策略**：先 list/search 建立 `name -> file_id` 映射，存在则上传新版本，不创建重复副本。

---

## Track B｜GPT-Readable Mirror 可读镜像轨

用途：解决 Box 中 ZIP/视频等原始二进制文件**ChatGPT 能看到但不能直接读取内容**的问题。

原则：

> 原包继续保留；同时为 ChatGPT 生成一个“可读镜像目录”。

### 目录建议

对任一产物 `artifact.ext`，生成：

```text
/EvoMind-Artifacts/<YYYYMMDD>/<artifact_slug>/
├── original/
│   └── artifact.ext
├── readable/
│   ├── manifest.md
│   ├── manifest.json
│   ├── ...可直接读取的展开文件...
│   └── ...分析辅助文件...
└── reports/
    └── publish_report.md
```

### ChatGPT 直接可读优先级

对以下格式，默认上传原文件本身到 `readable/`，并标记 `chatgpt_readable=true`：

```text
.md .txt .pdf .doc .docx .ppt .pptx .xls .xlsx
.csv .tsv .json .html .htm .xml
.py .js .ts .sh
.png .jpg .jpeg .webp .gif
```

说明：

- 文档类用于 `get_file_content` / 文档检索。
- 图片用于预览/视觉分析。
- 不要因为文件“理论上可读”就跳过原始文件保留。

---

# 2. ZIP / TAR / 压缩包发布策略

这是 V2 的重点能力。

当输入为 `.zip` / `.tar` / `.tar.gz` / `.tgz` 等归档文件时：

## 必须同时完成

1. **上传原始归档**到 `original/`。
2. 在本地安全 staging 目录中解压。
3. 生成展开文件树。
4. 将适合 ChatGPT 直接读取的文件上传到 `readable/`，保留相对目录结构。
5. 生成 `manifest.md` + `manifest.json`。
6. 对原始归档和展开文件分别记录 SHA256 / size / path / mime / role。

## 安全解压要求

必须防止：

- Zip Slip / `../` 路径穿越；
- 绝对路径写出 staging 目录；
- symlink 指向 staging 外部；
- 解压炸弹；
- 超大文件数导致资源耗尽。

默认安全阈值建议（允许做成配置）：

```text
max_files = 10000
max_total_uncompressed_bytes = 2GB
max_single_file_bytes = 500MB
```

超限不得强行解压，应：

- 原包照常上传；
- manifest 标记 `expanded=false`；
- 报告中记录原因。

## 敏感文件阻断

展开后以下内容**不得上传到 readable/public**：

```text
.env
*.pem
*.key
credentials*
secrets*
*_token*
*refresh_token*
*client_secret*
.aws/
.ssh/
```

并做基础内容扫描，若检测到明显 secret/token，默认阻断该文件并记入 `blocked_files`。

---

# 3. Skill ZIP 的专门优化

如果识别到归档中包含：

```text
SKILL.md
README.md
skill.json
manifest.json
references/
examples/
assets/
```

则将其标记为 `artifact_kind=skill_package`。

可读镜像至少上传：

```text
SKILL.md
README.md
references/**/*.md
references/**/*.pdf
examples/**/*.(md|txt|json|pdf|docx|pptx|xlsx)
```

同时生成一个 `skill_index.md`，包含：

- Skill 名称；
- 版本；
- 入口文件；
- 文件树；
- 关键说明文件链接/Box file_id；
- 原始 ZIP file_id；
- SHA256；
- 如何让 ChatGPT 读取；
- 如何让 EvoMind/Codex 下载原包。

目标是让 ChatGPT **不需要解 ZIP，也能理解 Skill 的真实结构和能力**。

---

# 4. 视频文件发布策略（MP4/MOV/WebM）

ChatGPT 的 Box 文档读取链路不能把 MP4 当作普通文档逐帧读取。因此 V2 对视频必须提供“原视频 + 视频分析伴生包”。

当输入为：

```text
.mp4 .mov .m4v .webm
```

## 原始视频

- 原视频上传到 `original/`。
- 记录：
  - file_id
  - size
  - SHA256
  - duration
  - width/height
  - fps
  - codec
  - bitrate（如可获取）

使用 `ffprobe` 生成：

```text
readable/video_metadata.json
```

## 自动生成视频分析包

默认生成：

```text
readable/video_analysis/
├── video_metadata.json
├── scene_index.csv
├── contact_sheet.jpg
├── frames_interval/
│   ├── frame_0001_000.0s.jpg
│   ├── frame_0002_000.5s.jpg
│   └── ...
├── scene_cuts/
│   ├── scene_001.jpg
│   └── ...
├── transcript.srt          # 若已有字幕/转写能力
├── transcript.txt          # 若可生成
└── analysis_manifest.md
```

### 默认抽帧策略

- 默认每 `0.5s` 抽一帧；
- 同时做 scene change 抽帧；
- 对超过 5 分钟的视频，可自动调整为 1–2 秒一帧，避免过多文件；
- 保留 `--frame-interval` 参数允许覆盖。

### 不做无意义的“全帧上传”

例如 45 秒 × 30fps = 1350 帧，默认不应全部上传。

正确策略：

1. 0.5s/1s interval 抽帧；
2. scene-cut 抽帧；
3. contact sheet；
4. 若后续发现问题区间，再按时间段高密度抽帧。

### Remotion / Skill 视频额外要求

如果同时存在对应的：

```text
SKILL.md
storyboard.json
narration.txt
subtitle.srt
```

必须一起放入 `readable/`，便于 ChatGPT 做：

- 功能与 Skill 真义对齐；
- 镜头节奏分析；
- UI 截图清晰度分析；
- 旁白与画面一致性分析；
- 具体时间码修改建议。

---

# 5. Public Direct Download 公网直链轨

V2 必须继承 V1 的公开交付能力。

目标：当产物要交给 **EvoMind / 小龙虾 / Codex / 外部 Agent** 时，输出的不是本地路径，而是可通过：

```bash
curl -L
wget
```

直接下载的公网 URL。

## 小文件

直接发布单文件并远程验证：

- HTTP 200；
- Content-Length（如可用）；
- 下载 SHA256 与本地一致。

## 大文件

如果现有 V1 已实现 Gitee/GitHub/tunnel + 分片机制，必须继承并复用。

如单文件受到托管平台限制，则：

- canonical ZIP；
- 自动分片；
- `manifest.json`；
- `reassemble.sh`；
- 每个 part 的 public URL；
- final SHA256；
- 远端逐 part 下载校验；
- 重组后 SHA256；
- `unzip -t` / 对应归档完整性检测。

当前已知 V1 曾采用 `10,000,000 bytes` 分片阈值时，若真实 V1 中仍采用该阈值，优先保持兼容，除非你通过测试确认应配置化。

---

# 6. 统一 Manifest

每次发布必须生成：

```text
manifest.json
manifest.md
publish_result.json
publish_report.md
```

## manifest.json 至少包含

```json
{
  "schema_version": "2.0",
  "artifact_name": "...",
  "artifact_kind": "document|archive|skill_package|video|binary|directory",
  "created_at": "ISO8601",
  "publisher": "evomind_artifact_publish_skill_v2",
  "source_path": "...",
  "original": {
    "sha256": "...",
    "size_bytes": 0,
    "mime": "...",
    "box_file_id": "...",
    "public_url": "..."
  },
  "readable_mirror": {
    "enabled": true,
    "box_folder_id": "...",
    "files": []
  },
  "public_delivery": {
    "enabled": true,
    "mode": "single|multipart|none",
    "manifest_url": "...",
    "reassemble_url": "..."
  },
  "verification": {
    "box_download_sha256_ok": true,
    "public_remote_sha256_ok": true,
    "archive_integrity_ok": true
  },
  "blocked_files": [],
  "warnings": []
}
```

### readable_mirror.files 每项至少

```json
{
  "relative_path": "SKILL.md",
  "role": "skill_definition",
  "size_bytes": 123,
  "sha256": "...",
  "mime": "text/markdown",
  "chatgpt_readable": true,
  "box_file_id": "...",
  "extracted_from": "artifact.zip"
}
```

---

# 7. CLI / 调用接口

实现统一入口，例如：

```bash
python3 publish_artifact_v2.py /path/to/artifact \
  --mode hybrid \
  --box-parent "EvoMind-Artifacts" \
  --expand-archives \
  --gpt-readable-mirror \
  --public-link
```

建议模式：

```text
--mode box
--mode public
--mode hybrid
```

可选：

```text
--expand-archives / --no-expand-archives
--gpt-readable-mirror / --no-gpt-readable-mirror
--video-analysis / --no-video-analysis
--frame-interval 0.5
--public-link / --no-public-link
--force-new-version
--dry-run
```

要求：

- 参数、行为写入 `SKILL.md`；
- 输出格式可被 Agent 稳定解析；
- 失败时非 0 exit code；
- 不把 token 输出到 stdout/stderr。

---

# 8. 幂等、版本与覆盖规则

默认策略：

- 相同逻辑路径 + 相同文件名：上传新 version，不创建重复文件。
- 如果 SHA256 与远端一致：允许 `SKIP_UNCHANGED`。
- 如果内容变化：创建 Box new version。
- manifest 每次更新。
- 保留 `version_number` / `etag`（可获取时）。

必须测试：

1. 首次上传；
2. 同文件原样重跑；
3. 同名内容变化；
4. 401 刷新后上传；
5. 新进程重启后上传。

---

# 9. 安全与日志规范

必须实现统一 redact：

```text
access_token
refresh_token
client_secret
Developer Token
Authorization: Bearer ...
OAuth code
```

报告中不得出现完整敏感值。

任何公开上传前先做：

- 文件名检查；
- secret path denylist；
- 文本 secret 模式扫描；
- Git repo 元数据与 `.env` 排除。

默认不上传：

```text
.git/
.env*
credentials/
secrets/
node_modules/
__pycache__/
.DS_Store
```

除非这些内容明确是用户产物且确认安全。

---

# 10. V2 自测矩阵

在不污染生产目录的独立测试路径中完成。

建议 Box 测试目录：

```text
/EvoMind-Artifact-Publish-V2-Test/
```

至少生成并测试：

## A. 普通文档

```text
test.md
test.pdf
test.docx
test.xlsx
test.pptx
```

验收：Box 上传、下载 SHA256、ChatGPT-readable 标记。

## B. ZIP

创建：

```text
test_skill.zip
├── SKILL.md
├── README.md
├── references/ref.md
├── assets/sample.png
└── secret_inside.txt
```

要求：

- 原 ZIP 上传；
- 展开镜像上传；
- `SKILL.md` / README 可独立从 Box 读取；
- 原 ZIP 仍保留；
- manifest 正确关联 `extracted_from`。

## C. 敏感文件阻断

ZIP 内加入测试 `.env`：

```text
BOX_CLIENT_SECRET=SHOULD_NOT_UPLOAD
```

验证：

- `.env` 不上传 readable/public；
- manifest 中出现 `blocked_files`；
- 日志不打印秘密值。

## D. 视频

创建或选一段 10–30 秒测试 MP4。

验证：

- 原视频上传；
- ffprobe metadata；
- interval frames；
- scene cuts；
- contact sheet；
- analysis manifest。

## E. 幂等与 OAuth 刷新

- 同文件重跑无重复；
- 内容变化生成新 version；
- 401 后自动 refresh；
- 新 refresh token 原子保存；
- 新进程继续成功。

## F. 公网直链

- 小文件直接 URL；
- 大文件（可用 synthetic payload）验证 multipart；
- 远程下载；
- 重组；
- SHA256；
- 归档完整性。

---

# 11. 最终 Skill 结构

最终至少形成：

```text
evomind_artifact_publish_skill_v2/
├── SKILL.md
├── README.md
├── scripts/
│   ├── publish_artifact_v2.py
│   ├── box_client.py
│   ├── archive_mirror.py
│   ├── video_analysis.py
│   ├── public_publish.py
│   ├── manifest.py
│   └── security.py
├── tests/
├── examples/
└── references/
```

具体结构可以按 EvoMind Skill 规范调整，但必须清晰分层。

---

# 12. 回归要求

V2 完成后必须回归：

- V1 仍能正常调用；
- V1 的已有公网发布路径没有被破坏；
- V2 不依赖手工粘贴 Developer Token；
- V2 使用正式 OAuth refresh token 机制；
- 不降低原有大文件分片能力；
- 不泄露凭据。

输出：

```text
V1_REGRESSION=PASS/FAIL
```

---

# 13. 最终交付物

完成后输出并保存：

```text
01_v1_discovery.md
02_v2_architecture.md
03_test_matrix.md
04_test_results.md
05_security_audit.md
06_regression_report.md
07_publish_examples.md
```

同时给出：

- V2 Skill 实际安装路径；
- `SKILL.md` 路径；
- 入口脚本路径；
- Box 测试目录与 folder_id；
- 测试文件 file_id；
- 公网测试 URL（不得包含秘密）；
- SHA256 验证结果；
- 未解决问题。

---

# 14. 最终判定

只有以下全部满足才能输出 PASS：

```text
V1_DISCOVERY=PASS
BOX_CANONICAL_UPLOAD=PASS
BOX_OAUTH_REFRESH=PASS
GPT_READABLE_MIRROR=PASS
ARCHIVE_EXPAND_MIRROR=PASS
VIDEO_ANALYSIS_PACK=PASS
PUBLIC_DIRECT_DOWNLOAD=PASS
IDEMPOTENCY=PASS
SECRET_REDACTION=PASS
V1_REGRESSION=PASS
```

全部通过后输出：

```text
EVOMIND_ARTIFACT_PUBLISH_V2=PASS
```

如任一项失败：

```text
EVOMIND_ARTIFACT_PUBLISH_V2=FAIL
```

并列出：

- failed stage；
- root cause；
- evidence；
- repair action；
- 是否影响 V1。

---

# 15. 本次最重要的产品原则

请严格遵守以下设计：

```text
一个产物 != 一个文件链接

一个完整发布 =
原始事实源（Original）
+ GPT 可读镜像（Readable Mirror）
+ 公网直链交付（Public Delivery）
+ Manifest
+ SHA256
+ 远端验证
+ 安全脱敏
```

对于 ZIP：

```text
ZIP 原包用于下载/安装
展开镜像用于 ChatGPT 理解
```

对于视频：

```text
MP4 原视频用于播放/归档
抽帧 + scene cuts + contact sheet + transcript 用于 ChatGPT 审片
```

这就是 V2 与 V1 的核心差异。
