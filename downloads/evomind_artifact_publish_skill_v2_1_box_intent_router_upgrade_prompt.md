# EvoMind Artifact Publish Skill V2.1｜Box-only + 新会话意图路由升级提示词

> 任务：**原地升级现有 `evomind_artifact_publish_skill_v2`**，不要新建另一个名称的 Skill。
>
> 当前已知问题：新会话中用户调用 `evomind_artifact_publish_skill_v2` 后，Skill 仍会询问 `hybrid / box / public`、让用户逐个选择文件、询问 ZIP 是否展开、视频是否生成分析包。这不符合当前产品定位。
>
> V2.1 必须把 V2 固化为：**EvoMind → Box → ChatGPT 专用 AI 产物交付 Skill**。

---

# 0. 本次升级的唯一目标

用户以后只需要说类似：

```text
请使用 evomind_artifact_publish_skill_v2 协助我完成当前任务
```

或更短：

```text
AI产物
```

或：

```text
把这个给 GPT
```

或：

```text
把这支视频给 GPT 审一下
```

Skill 就应该自动理解：

> 找到与当前任务/当前会话最相关的一批 AI 产物 → 自动判断文件类型 → 按 GPT 可读性整理 → 上传 Box → 验证 → 返回 Box 结果。

**不要再让用户解释发布模式、ZIP 是否展开、视频是否分析。**

---

# 1. V2.1 定位必须写死：Box-only

请修改现有 `evomind_artifact_publish_skill_v2` 的 `SKILL.md`、README、CLI 帮助、默认配置和相关提示词，使以下规则成为最高优先级：

```text
V2 = Box-only
```

V2 不负责：

- GitHub 发布
- Gitee 发布
- tunnel / Pinggy
- public URL
- curl / wget 公网交付
- 大文件公网分卷
- hybrid 模式
- public 模式

这些继续属于 V1。

V2 中删除或废弃以下用户交互：

```text
请选择 hybrid / box / public
是否出公网链接？
ZIP 是否展开？
视频是否生成分析包？
```

V2 的默认答案永远是：

```text
storage = Box
expand_archive = auto
video_analysis = auto
chatgpt_readable_mirror = auto
```

用户只有在**明确说“不要展开 / 不要抽帧 / 只存原文件”**时，才覆盖默认行为。

---

# 2. 关键语义：`AI产物` 是意图，不是文件名

这是本次最重要的修复。

当用户单独说：

```text
AI产物
```

必须解释为一个**快捷命令 / intent alias**：

```text
PUBLISH_CURRENT_AI_ARTIFACTS_TO_BOX_FOR_GPT
```

它的含义是：

> 自动发现当前任务、当前会话或最近连续工作流所产生的 AI 产物，把属于同一任务的一批结果整理后发布到 Box，供 ChatGPT 搜索、读取、预览和分析。

**禁止把“AI产物”当作一个未知文件名，然后反问用户“你要发布哪个文件？”**

除非工作区中真的存在一个用户明确指向的文件/目录路径叫 `AI产物`。

---

# 3. 新会话也必须能工作：Artifact Resolver

新建统一组件，例如：

```text
artifact_resolver.py
```

职责：在没有明确路径时，自动判断“用户现在要交给 GPT 的产物是什么”。

## 3.1 解析优先级

必须按以下顺序解析：

### P0｜用户明确给出的路径

如果用户消息中有真实文件路径/目录路径，直接使用。

### P1｜当前会话刚生成的产物

优先读取当前任务执行记录、tool outputs、workspace result index、当前 working directory 中本次任务刚创建/修改的交付文件。

### P2｜当前会话引用的任务对象

例如：

```text
把这个视频给 GPT 看
把刚才那个 ZIP 发过去
把刚生成的报告发给 GPT
这个 Skill 包给 GPT 分析
```

必须绑定到最近一个对应对象，不重新让用户给路径。

### P3｜新会话：最近一批 AI 产物

如果是新会话，且用户只说：

```text
AI产物
```

则自动扫描最近工作区产物。

推荐扫描范围：

- 当前 cwd
- `/workspace/`
- 已知 EvoMind artifacts/output/result 目录
- 最近任务的 result index / manifest
- Skill 自己已记录的 last_publish / last_artifact index

但必须排除：

```text
.git/
node_modules/
venv/
.venv/
__pycache__/
.cache/
/tmp/
临时下载目录
依赖包
浏览器缓存
凭据目录
```

默认时间窗：

```text
优先最近 30 分钟
若无，则扩展到最近 2 小时
若仍无，再查看最近 24 小时，但只能作为候选，不能直接误发
```

## 3.2 将文件聚合为“任务批次”，不要逐文件问

按以下特征把产物聚类为 artifact batch：

- 同一父目录
- 相近修改时间
- 相同任务前缀/项目名
- 相同 manifest / report
- 同一 Remotion / Skill / research / report 输出目录

例如：

```text
report.md
report.pdf
report.pptx
assets/
final.zip
```

应识别为**一批产物**，而不是让用户选五次。

## 3.3 自动决策规则

- 若只找到 1 个高置信度 batch → **直接发布，不询问**。
- 若找到多个，但其中 1 个与当前用户措辞明显最匹配 → **直接发布最匹配 batch**。
- 若有 2–3 个同等高置信度且彼此明显属于不同任务 → 才允许一次性问用户“你指哪一批？”，展示批次，不展示几十个文件。
- 若完全找不到可信产物 → 明确说没有定位到当前 AI 产物，并只列最近 3 个候选批次。

禁止默认把旧会话所有历史文件一起上传。

---

# 4. 用户不能再被要求理解文件类型处理细节

V2.1 必须自动路由。

## 文档

```text
.md .txt .pdf .docx .pptx .xlsx .csv .json .html
```

行为：

- 上传原文件
- 直接作为 GPT-readable 文件
- 上传后 list + download + SHA256 验证

## ZIP / Skill 包

自动：

```text
原 ZIP 保留
+
安全解压
+
GPT 可读文件展开上传
+
manifest
```

不要问：

```text
是否展开？
是否识别 Skill？
```

Skill 包识别自动完成。

## 视频

自动：

```text
原 MP4/MOV 保留
+
ffprobe metadata
+
scene cuts
+
interval frames
+
contact sheet
+
已有字幕/旁白/故事板一并上传
+
可用时生成 transcript
```

不要问：

```text
是否 video-analysis？
```

默认就是要给 GPT 分析，因此必须自动生成。

## 图片

原图直接上传；大量截图自动生成 image index/contact sheet。

## 其他 binary

保留原文件 + metadata，标记：

```text
chatgpt_readable=false
```

必要时生成可读伴生物，但不要伪装为 GPT 已直接读取原始 binary。

---

# 5. “AI产物”默认交付结构

Box 默认根目录继续使用当前 V2 已配置的根目录；不要因为本次升级随意迁移历史文件。

建议每个 batch 结构：

```text
/<BOX_ROOT>/<YYYY-MM-DD>/<task_slug>/
├── original/
├── readable/
├── analysis/
└── manifest/
```

如果一个 batch 内本来有多个最终成果，例如 PDF/PPTX/ZIP/视频，应放在同一 task_slug 下。

---

# 6. 新会话必须有“最近产物索引”

V2.1 必须维护本地持久化索引，例如：

```text
~/.evomind/artifact_publish_v2/recent_artifacts.jsonl
```

或在 Skill 自己目录/工作目录中选择稳定可写位置。

每次成功发布记录：

```json
{
  "published_at": "ISO8601",
  "task_slug": "...",
  "source_paths": ["..."],
  "artifact_kind": "...",
  "box_folder_id": "...",
  "box_file_ids": ["..."],
  "manifest_path": "...",
  "session_hint": "..."
}
```

用途：

- 新会话中理解“刚才那批 AI 产物”
- 避免重复上传
- 支持 SKIP_UNCHANGED
- 支持同名覆盖新版本

但不得把 token/secret 写进索引。

---

# 7. V2.1 必须使用已经验证的 Box 行为

保留现有已通过的正式 OAuth：

- access token
- refresh token
- 401 自动刷新
- refresh token rotation
- 原子持久化
- chmod 600
- 不打印 secret/token

覆盖上传继续遵守已发现的真实规则：

```text
POST https://upload.box.com/api/2.0/files/{file_id}/content
```

**已有文件上传新版本时，不要传不同的 `attributes.name`。**

原因：Box 会把原文件直接重命名。

版本验证使用：

```text
file_version.id
etag
```

不要依赖可能为 null 的 `version_number`。

---

# 8. 用户体验规则：能做就做，不要把内部参数抛给用户

以下行为视为 V2.1 UX FAIL：

```text
“请选择 box / hybrid / public”
“请给我完整路径”——明明当前任务能解析
“ZIP 是否展开？”
“视频是否生成分析包？”
“是否识别为 Skill 包？”
“从下面 10 个文件里选一个”——明明是一批任务产物
```

正确行为示例：

### 示例 A

用户：

```text
AI产物
```

正确：

```text
已定位到最近一批 AI 产物：<任务名>，共 5 个交付文件。
正在按 Box→GPT 规则发布：文档直接上传、ZIP 自动展开可读镜像、视频自动生成分析包。
```

然后直接执行。

### 示例 B

用户：

```text
把刚才那个视频给 GPT 分析
```

正确：找到最近视频 → 原视频 + 分析包上传 Box → 返回结果。

### 示例 C

用户：

```text
把这个 Skill 发给 GPT
```

正确：自动解析最近 Skill package → ZIP + SKILL.md/README/references 展开上传。

### 示例 D｜确实歧义

最近 20 分钟存在两个完全不同任务：

```text
A. 客户尽调报告（PDF/PPTX）
B. 40 Skills 视频包（MP4/ZIP）
```

用户只说：

```text
AI产物
```

这时允许问一次：

```text
最近有两批独立产物：A / B。你要哪一批？
```

不要继续问 mode、展开、分析参数。

---

# 9. 兼容自然语言触发词

在 `SKILL.md` 中明确列出以下触发意图：

```text
AI产物
把这个给 GPT
给 GPT 分析
上传到 Box 给 GPT
把当前成果给 GPT
把刚生成的报告给 GPT
把这批文件发给 GPT
把这个 ZIP 给 GPT
把这个 Skill 给 GPT
把这个视频给 GPT 审片
同步到 GPT
发布到 Box
```

英文也支持：

```text
publish for GPT
send this to GPT
upload artifacts to Box
share current outputs with GPT
```

---

# 10. CLI 也要简化

统一入口建议：

```bash
python3 publish_to_box_for_gpt.py [optional_path]
```

如果不提供 path：

```text
自动调用 artifact_resolver
```

允许保留高级参数给内部/调试使用：

```text
--frame-interval
--no-expand
--no-video-analysis
--dry-run
```

但这些不应成为正常用户交互步骤。

删除正常 CLI 帮助中的：

```text
--mode hybrid
--mode public
```

如果为了向后兼容暂时不能删除，则：

- `--mode box` 固定为唯一有效默认
- hybrid/public 标为 deprecated
- 自然语言 Skill 绝不主动提示这些选项

---

# 11. 必须补的自动化回归测试

至少新增以下测试：

## Test 1｜新会话 + “AI产物”

模拟没有前文对话，但最近 10 分钟有一个独立 artifact batch。

期望：

```text
自动定位 batch
不询问模式
不逐文件询问
直接进入 Box 发布
```

## Test 2｜新会话 + 多 batch 歧义

最近 10 分钟有两个独立任务。

期望：只问一次“选 A 还是 B”。

## Test 3｜ZIP

期望：自动原包 + 展开 mirror，不询问。

## Test 4｜视频

期望：自动 video analysis，不询问。

## Test 5｜Skill ZIP

期望：自动识别 SKILL.md/README/references。

## Test 6｜同名未变化

期望：

```text
SKIP_UNCHANGED
```

## Test 7｜同名有变化

期望：同 file_id 上传新版本，不重命名文件。

## Test 8｜凭据安全

日志、报告、索引中无完整 access/refresh token / client_secret。

---

# 12. 升级后必须做的真实验收

不要只改文档。

完成后实际运行以下会话模拟：

```text
用户：请使用 evomind_artifact_publish_skill_v2 协助我完成当前任务。
用户：AI产物
```

验收要求：

1. 不出现 `hybrid / public`。
2. 不问 ZIP 是否展开。
3. 不问视频是否分析。
4. 不要求用户逐个选文件。
5. 自动输出解析到的 artifact batch。
6. 若只有一个高置信度 batch，直接开始 Box 发布。
7. 成功后返回 Box folder/file IDs + manifest + verification。

最终输出：

```text
V2_BOX_ONLY=PASS|FAIL
AI_ARTIFACT_INTENT=PASS|FAIL
NEW_SESSION_RESOLVER=PASS|FAIL
AUTO_ARCHIVE_EXPAND=PASS|FAIL
AUTO_VIDEO_ANALYSIS=PASS|FAIL
BOX_OAUTH=PASS|FAIL
IDEMPOTENT_UPDATE=PASS|FAIL
SECRET_SCAN=PASS|FAIL
EVOMIND_ARTIFACT_PUBLISH_V2_1=PASS|FAIL
```

只要其中任何一项 FAIL，不得宣称升级完成。

---

# 13. 交付要求

请原地更新：

```text
evomind_artifact_publish_skill_v2
```

至少包含/更新：

```text
SKILL.md
README.md
scripts/artifact_resolver.py
scripts/publish_to_box_for_gpt.py
scripts/box_client.py
scripts/archive_handler.py
scripts/video_analysis.py
scripts/manifest_builder.py
tests/
```

同时生成：

```text
references/v2_1_upgrade_report.md
references/intent_router_test_report.md
references/new_session_regression.md
```

不要创建 `evomind_artifact_publish_skill_v3`。

本次就是把现有 V2 修到真正可用。
