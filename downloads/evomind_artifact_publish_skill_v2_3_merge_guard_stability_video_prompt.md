# EvoMind Artifact Publish Skill V2.3｜合并保护 + 稳定性修复 + 递归视频分析

> 任务：**原地升级现有 `evomind_artifact_publish_skill_v2`**。不要创建新的并行 Skill，不要回退已修复能力。
>
> 本次升级必须同时保留此前已经在真实运行中验证过的稳定性修复，并叠加 V2.1 的 Box-only / 新会话意图路由与 V2.2 的递归视频分析管线。

---

# 0. 最高优先级：禁止覆盖现有已验证修复

开始任何修改前，先读取并审计当前实际文件：

```text
SKILL.md
README*
publish_artifact_v2.py
box_client.py
artifact_resolver.py（若存在）
artifact_dispatcher.py（若存在）
video_* / analysis_* 相关脚本
references/
tests/
```

必须先生成当前实现快照与差异摘要，再修改。

**禁止**：
- 用旧版本整文件覆盖当前文件；
- 因另一会话的补丁导致已验证修复丢失；
- 仅根据历史提示词重写文件，而不读取当前实现；
- 将 V2 重新改回 hybrid/public。

修改策略必须是：

```text
READ CURRENT → IDENTIFY EXISTING FIXES → PATCH MINIMALLY → REGRESSION TEST
```

---

# 1. V2 定位继续写死：Box-only

```text
V2 = EvoMind → Box → ChatGPT
```

V2 不负责：
- Gitee
- GitHub public release
- tunnel
- public URL
- multipart public delivery
- hybrid mode

这些继续属于 V1。

自然语言中用户说：

```text
AI产物
把这个给 GPT
把刚生成的报告给 GPT
把这个视频给 GPT 看
把这个 ZIP 给 GPT 分析
```

应自动解析当前/最近产物并发布到 Box，不再询问 `box/hybrid/public`。

---

# 2. 必须保留的 3 个已验证稳定性修复

下面三项已经在真实运行中暴露并修复，属于生产级保护，**不得回退**。

## Fix A｜`--dry-run` 必须真实短路

已知历史缺陷：CLI 虽定义 `--dry-run`，但 `main()` 没读取，导致“预演”实际真实上传。

必须确保：

```text
--dry-run
```

只允许：
- 参数解析
- 文件发现
- 安全检查
- 类型识别
- 计划生成
- 本地可逆分析

禁止：
- 创建 Box 文件夹
- 上传文件
- 覆盖版本
- 修改 Box 元数据
- 产生任何外部写入

新增回归：

```text
DRY_RUN_NO_BOX_WRITE=PASS
```

测试必须比较 dry-run 前后 Box 目标目录对象数量/版本号不变。

---

## Fix B｜Box 大文件下载不能永久挂死

已知真实问题：某些网络环境下 TCP 连接进入 ESTABLISHED 后无业务数据，普通 urllib 流式读取的超时可能无法有效中断，导致进程长期卡死。

必须保留/实现：

- 分块读取；
- 底层 socket 强制 read timeout；
- 总体 deadline；
- 超时后可控失败，不无限等待；
- 临时文件安全清理；
- 日志不得打印 capability URL/token。

建议同时加入：

```text
connect_timeout
read_timeout
total_download_deadline
max_retries
```

且 retry 必须指数退避、有限次数。

新增回归：

```text
BOX_DOWNLOAD_STALL_TIMEOUT=PASS
NO_INFINITE_HANG=PASS
```

可通过 mock/stall server 测试，不要求故意破坏真实 Box 网络。

---

## Fix C｜SKIP_UNCHANGED 不重复下载大 canonical

已知真实问题：为了验证“未变化”，会再次下载整个 20MB/30MB+ canonical，网络不稳时既浪费时间又容易挂死。

必须保留发布回执缓存，例如：

```text
/workspace/.evomind_v2_box_publish_cache.json
```

或等价稳定路径。

缓存至少记录：

```json
{
  "source_path": "...",
  "sha256": "...",
  "size_bytes": 0,
  "box_file_id": "...",
  "box_folder_id": "...",
  "etag": "...",
  "file_version_id": "...",
  "published_at": "...",
  "verification_mode": "..."
}
```

缓存不得包含：
- access_token
- refresh_token
- client_secret
- capability URL

### 大文件完整性策略

对于超过阈值（当前真实实现曾使用 20MB，可做成配置）：

```text
canonical_large_file_threshold_mb = 20
```

默认不强制整包回下载。

允许验证：

```text
上传 HTTP 成功
+ Box size == 本地 size
+ 本地 SHA256 已计算
+ file_id/etag/file_version_id 可追踪
```

manifest 必须诚实写：

```text
verification_mode = size_only_large
box_download_sha256_ok = null
```

不能把它写成 SHA256 已经回验通过。

若用户/测试明确要求 full round-trip，则允许显式开启：

```text
--force-download-verify
```

新增回归：

```text
SKIP_UNCHANGED_CACHE=PASS
LARGE_FILE_NO_REDUNDANT_DOWNLOAD=PASS
VERIFICATION_LABEL_ACCURATE=PASS
```

---

# 3. 保留 Box 覆盖上传已发现规则

已有文件上传新版本：

```text
POST /files/{file_id}/content
```

必须保留原文件名。

**不要在覆盖新版本时传入不同的 `attributes.name`**，否则 Box 会把同一个 file_id 的原文件直接重命名。

版本变化验证使用：

```text
file_version.id
etag
```

不要依赖可能为 null 的 `version_number`。

新增回归：

```text
OVERWRITE_PRESERVES_FILENAME=PASS
OVERWRITE_PRESERVES_FILE_ID=PASS
OVERWRITE_VERSION_ADVANCES=PASS
```

---

# 4. 新会话 Artifact Resolver 必须保留

如果当前已存在 `artifact_resolver.py` 或等价逻辑，不要删除。

用户仅说：

```text
AI产物
```

必须理解为：

```text
PUBLISH_CURRENT_AI_ARTIFACTS_TO_BOX_FOR_GPT
```

解析顺序：

1. 明确路径
2. 当前会话刚生成成果
3. 当前会话最近对象
4. 新会话最近 artifact batch
5. 只有确实多个同等高置信度 batch 才允许一次性询问

禁止再次问：

```text
box / hybrid / public？
ZIP 是否展开？
视频是否分析？
```

默认：

```text
storage=Box
expand_archive=auto
video_analysis=auto
```

---

# 5. V2.3 核心新增：递归视频分析必须真正落地

当前真实样本已经证明：ZIP 能展开 `.mov/.mp4` 并上传，但只被标记：

```text
chatgpt_readable=false
```

然后结束。

这是不够的。

统一流程必须变成：

```text
archive / directory
→ safe expand
→ recursive artifact dispatch
→ 发现 mp4/mov/m4v/webm
→ run_video_pipeline()
→ 上传 analysis companion files
→ manifest 建立关联
```

顶层视频与 ZIP 内嵌视频必须走同一个视频分析函数。

---

# 6. VIDEO PIPELINE 最低输出

每支视频生成：

```text
analysis/videos/<video_slug>/
├── video_metadata.json
├── scene_index.csv
├── contact_sheet.jpg
├── frames_interval/
├── scene_cuts/
├── transcript.srt       # 有能力时
├── transcript.txt       # 有能力时
├── context_index.md
└── analysis_manifest.md
```

## ffprobe metadata

至少：

```text
duration
width
height
fps
video codec
pixel format
bitrate
audio codec
has_audio
file size
sha256
```

## interval frames

默认：

```text
<=5min      0.5s/帧
5-20min     1s/帧
>20min      2s/帧
```

## scene cuts

必须额外使用 scene-change 检测生成关键帧，并保留时间码。

## contact sheet

每支视频至少 1 张；长视频可分页。

要求画面足够大，不能为了塞太多帧导致 UI 字体完全不可辨识。

## transcript

优先关联已有：

```text
.srt
.vtt
narration.txt
script.md
storyboard.json
```

如果已有稳定 Whisper/faster-whisper，再自动转写。

没有可靠 backend 时不能让整个视频分析失败，只记录：

```text
transcript_available=false
```

---

# 7. Skill/Remotion 视频要做上下文关联

如果发现视频属于 Skill 教学视频，自动向同目录/上级目录寻找：

```text
SKILL.md
README.md
storyboard.json
narration.txt
subtitle.srt
script.md
source screenshots
assets
```

生成 `context_index.md`，把：

```text
真实 Skill 定义
视频文件
storyboard
字幕/旁白
source screenshots
contact sheet
scene cuts
```

关联起来，并写 Box file_id/folder_id。

目的：让 ChatGPT 可以直接比较：

```text
真实 Skill 功能 vs 视频讲述 vs 画面镜头 vs 字幕旁白
```

---

# 8. 真实回归样本 A：当前 Box 中已有 MOV

已知真实 artifact：

```text
/EvoMind-Artifacts/20260816/EvoMind_技能教学视频批量制作_交付包_v1/
```

ZIP canonical：

```text
EvoMind_技能教学视频批量制作_交付包_v1.zip
Box file_id=2410346867655
```

展开镜像中已存在：

```text
01_数字人_女讲解员_绿幕.mov
Box file_id=2410359577635
```

当前 manifest 已知状态：

```text
mime=video/quicktime
chatgpt_readable=false
```

但缺：

```text
analysis/video_metadata.json
frames_interval/
scene_cuts/
contact_sheet.jpg
transcript.*
```

必须将它作为回归测试。

要求：

- 不删除原 ZIP；
- 不删除现有 MOV；
- 不改变现有 file_id；
- 新增 analysis 目录和 companion files；
- 更新 manifest 时保留历史引用；
- 验证 ChatGPT 可通过 Box 查看 contact sheet/抽帧/元数据。

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

# 9. 真实回归样本 B：两个已发布大包不得回退

已知当前 V2 已成功发布：

## 全部技能_合并包

```text
canonical Box file_id=2410315663127
size≈34.6MB
readable=49 个技能包相关内容
```

## 技能教学视频交付包

```text
canonical Box file_id=2410346867655
size≈24.8MB
readable=22 个文件
```

当前大文件验证策略属于：

```text
上传成功 + size 一致
```

并诚实标记未做 canonical 全量回下载 SHA256。

升级后必须确保：

```text
EXISTING_LARGE_ARTIFACTS_STILL_RESOLVABLE=PASS
CACHE_STILL_VALID=PASS
NO_REDUNDANT_LARGE_DOWNLOAD=PASS
```

不得因为新增视频管线重新把两个大 ZIP 整包下载多次。

---

# 10. 并发会话 / 并发修改保护

当前已经发生过“另一个并发会话也在修改同一 Skill”的情况。

必须增加至少一种保护：

## 代码修改阶段

执行升级前记录：

```text
mtime
sha256
```

对关键代码文件生成 baseline。

写入前再次检查；若 baseline 已变化：

```text
CONCURRENT_MODIFICATION_DETECTED
```

此时重新读取最新文件、做 merge，不允许直接覆盖。

## 运行期发布锁

建议加入文件锁，例如：

```text
/workspace/.evomind_v2_publish.lock
```

用 `fcntl.flock` 或等价机制。

目的：避免两个发布进程同时：

- 更新同一 cache；
- 更新同一 manifest；
- 覆盖同一 Box file version；
- 创建重复目录。

必须保证异常退出释放锁。

新增回归：

```text
CONCURRENT_CODE_CHANGE_GUARD=PASS
PUBLISH_PROCESS_LOCK=PASS
CACHE_ATOMIC_WRITE=PASS
```

cache/manifest 写入使用 temp file + fsync + atomic rename，避免并发损坏 JSON。

---

# 11. 安全规则继续保留

禁止上传/写入 manifest：

```text
.env
credentials*
secrets*
*_token*
*.pem
*.key
```

不得日志打印：

```text
access token
refresh token
client secret
Box download capability URL
upload token
```

OAuth token 文件继续：

```text
chmod 600
refresh token rotation
原子写入
401 自动 refresh
```

---

# 12. 完成标准

不是“代码改了”就算完成。

必须：

1. 读取当前实现并确认三项稳定性修复仍存在；
2. 做最小增量修改；
3. 执行单元测试；
4. 执行真实 Box 回归样本 A；
5. 验证两个已发布大 artifact 没被破坏；
6. 验证 dry-run 无外部写入；
7. 验证并发锁/cache 原子写入；
8. 输出修改文件 diff 摘要。

最终输出：

```text
EVOMIND_ARTIFACT_PUBLISH_V2_3=PASS|FAIL
BOX_ONLY=PASS|FAIL
DRY_RUN_NO_BOX_WRITE=PASS|FAIL
BOX_DOWNLOAD_STALL_TIMEOUT=PASS|FAIL
NO_INFINITE_HANG=PASS|FAIL
SKIP_UNCHANGED_CACHE=PASS|FAIL
LARGE_FILE_NO_REDUNDANT_DOWNLOAD=PASS|FAIL
VERIFICATION_LABEL_ACCURATE=PASS|FAIL
OVERWRITE_PRESERVES_FILENAME=PASS|FAIL
OVERWRITE_PRESERVES_FILE_ID=PASS|FAIL
ARTIFACT_RESOLVER=PASS|FAIL
RECURSIVE_DISPATCH=PASS|FAIL
NESTED_VIDEO_DETECTION=PASS|FAIL
VIDEO_METADATA=PASS|FAIL
INTERVAL_FRAMES=PASS|FAIL
SCENE_CUTS=PASS|FAIL
CONTACT_SHEET=PASS|FAIL
CONCURRENT_CODE_CHANGE_GUARD=PASS|FAIL
PUBLISH_PROCESS_LOCK=PASS|FAIL
CACHE_ATOMIC_WRITE=PASS|FAIL
EXISTING_LARGE_ARTIFACTS_STILL_RESOLVABLE=PASS|FAIL
REGRESSION_A_VIDEO_PIPELINE_TRIGGERED=PASS|FAIL
FINAL=PASS|FAIL
```

如果任何既有稳定性修复被回退，`FINAL` 必须为 FAIL。
