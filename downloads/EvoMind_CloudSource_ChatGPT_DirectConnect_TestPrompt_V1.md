# EvoMind 免费文件源 × ChatGPT 直连 A/B/C 测试提示词 V1

> 目标：在**不购买付费套餐**的前提下，实测 Box、Dropbox、OneDrive/SharePoint 三条链路，选出最适合 EvoMind 自动上传、ChatGPT 直接连接并读取的文件源。
>
> 本任务不是做理论调研，而是做**真实端到端验证**。所有结论必须有截图、命令输出、HTTP/API 回执或 ChatGPT 检索结果作为证据。

---

## 0. 核心目标

最终回答 5 个问题：

1. EvoMind 所在 Linux 容器能否稳定访问该云服务？
2. 免费账号能否通过官方 API/SDK 自动上传文件？
3. 一次人工 OAuth 授权后，能否长期无人值守刷新 Token 并继续上传？
4. ChatGPT 当前账号能否直接连接该文件源，并搜索/读取 EvoMind 上传的文件？
5. 哪个平台最适合成为 EvoMind 的默认「Artifact Document Source」？

候选平台：

- **A：Box Individual 免费版**
- **B：Dropbox Basic 免费版**
- **C：OneDrive 免费版 / ChatGPT SharePoint App 路线**

不要使用付费试用来“假装免费可用”。如果某项能力必须付费，明确判定为 `FAIL_PAID_REQUIRED`。

---

# 1. 已知约束，仅用于测试设计

## Box
免费 Individual 当前公开额度：
- 10 GB 存储
- 单文件上传上限 250 MB

ChatGPT Box App 当前官方支持读取/索引的主要类型：
- `.pdf`
- `.docx`
- `.pptx`
- `.xlsx`

不作为内容索引：
- `.zip`
- `.png/.jpg`
- `.mp4`
- 其他非文档二进制文件

## Dropbox
Dropbox Basic 当前公开额度：
- 2 GB 免费存储

ChatGPT Dropbox App 当前支持：
- `.pdf`
- `.docx`
- `.pptx`
- `.xlsx`

不索引：
- `.zip`
- 图片
- 视频

## OneDrive / SharePoint
Microsoft 免费个人账户当前公开额度：
- 5 GB OneDrive

ChatGPT 当前有 SharePoint App，可用于 SharePoint/OneDrive 相关文件访问，但**个人免费 OneDrive 是否能以当前用户身份完整走通**必须本次实测，禁止先假设成功。

---

# 2. 测试总原则

必须遵守：

1. 不覆盖 EvoMind 现有生产配置。
2. 所有 Token / Client Secret / Refresh Token 只能写入环境变量或 `.env`，不得打印到日志。
3. 日志输出必须脱敏。
4. 测试目录统一：
   ```bash
   /workspace/evomind-cloud-source-test/
   ```
5. 所有测试结果写入：
   ```text
   /workspace/evomind-cloud-source-test/results/
   ```
6. 每个平台单独目录：
   ```text
   box/
   dropbox/
   onedrive/
   ```
7. 没有凭据时：
   - 先完成无需凭据的网络/API 可达性测试；
   - 生成“需要用户一次性完成的 OAuth 操作清单”；
   - 不伪造成功结果。
8. 不允许为了通过测试而升级付费计划。

---

# 3. 先生成统一测试语料

在：

```text
/workspace/evomind-cloud-source-test/test_corpus/
```

生成以下文件。

## 3.1 DOCX

文件名：

```text
EvoMind_CloudSource_Test.docx
```

内容必须包含唯一探针：

```text
EVOMIND-CLOUD-CANARY-20260816-DOCX-A7F3
```

正文：

```text
项目名称：EvoMind 免费文件源直连测试
负责人：EvoMind Agent
测试结论字段：等待 ChatGPT 读取验证

关键事实：
1. 测试项目代号：ORBIT-7319
2. 测试预算：人民币 128,600 元
3. 推荐城市：上海
4. 唯一验证码：EVOMIND-CLOUD-CANARY-20260816-DOCX-A7F3
```

## 3.2 PDF

文件名：

```text
EvoMind_CloudSource_Test.pdf
```

必须包含：

```text
EVOMIND-CLOUD-CANARY-20260816-PDF-K9M2
```

并写：

```text
测试负责人：余智秋
项目代号：NEBULA-4821
目标日期：2026-09-30
```

## 3.3 XLSX

文件名：

```text
EvoMind_CloudSource_Test.xlsx
```

Sheet：`验证数据`

| 字段 | 值 |
|---|---|
| Project | EvoMind Cloud Source Test |
| Revenue | 368500 |
| Cost | 127900 |
| City | Shanghai |
| Canary | EVOMIND-CLOUD-CANARY-20260816-XLSX-Q4Z8 |

## 3.4 PPTX

文件名：

```text
EvoMind_CloudSource_Test.pptx
```

至少 3 页：

1. 封面
2. 测试目标
3. 验证页

第 3 页必须包含：

```text
EVOMIND-CLOUD-CANARY-20260816-PPTX-R6N1
```

## 3.5 负面对照文件

同时生成：

```text
EvoMind_CloudSource_Binary_Test.zip
EvoMind_CloudSource_Image_Test.png
EvoMind_CloudSource_Video_Test.mp4
```

用途不是验证内容读取成功，而是验证：

> ChatGPT 对 ZIP / 图片 / 视频是否只能看到元数据、完全不可见，还是能够直接读取。

禁止把“能看到文件名”误判成“能读取文件内容”。

---

# 4. Phase A｜EvoMind Linux 网络可达性

对三个平台分别测试。

至少执行：

```bash
getent hosts box.com
getent hosts api.box.com

getent hosts dropbox.com
getent hosts api.dropboxapi.com
getent hosts content.dropboxapi.com

getent hosts onedrive.live.com
getent hosts graph.microsoft.com
```

然后：

```bash
curl -I --max-time 15 https://box.com
curl -I --max-time 15 https://api.box.com

curl -I --max-time 15 https://dropbox.com
curl -I --max-time 15 https://api.dropboxapi.com

curl -I --max-time 15 https://onedrive.live.com
curl -I --max-time 15 https://graph.microsoft.com
```

记录：

- DNS 是否成功
- TLS 是否成功
- HTTP 状态
- RTT
- 是否需要代理
- 是否发生地域限制
- 连续执行 5 次的成功率

输出：

```text
results/01_network_matrix.csv
```

字段：

```text
provider,dns_ok,tls_ok,http_status,avg_latency_ms,success_rate_5,notes
```

---

# 5. Phase B｜官方 API 自动上传能力

## 5.1 Box

优先使用 Box 官方 API。

测试：

1. 创建 `/EvoMind-Cloud-Test/`
2. 上传 4 个文档文件
3. 上传 ZIP 负面对照
4. 获取文件 ID
5. API 列目录
6. 下载 DOCX 回本地
7. SHA256 与上传前对比
8. 覆盖/更新 DOCX
9. 再次下载并校验
10. 验证 refresh token / 长期授权机制

必须记录：

```text
provider=box
upload_ok
list_ok
download_ok
sha256_ok
overwrite_ok
refresh_token_supported
manual_oauth_once_only
```

---

## 5.2 Dropbox

使用 Dropbox 官方 API。

同样执行：

- 建目录
- 上传
- 列目录
- 下载
- SHA256
- 覆盖
- refresh token
- 无人值守再次调用

目标目录：

```text
/EvoMind-Cloud-Test/
```

---

## 5.3 OneDrive

使用 Microsoft Graph API。

目标目录：

```text
/EvoMind-Cloud-Test/
```

测试：

- 创建目录
- 上传 DOCX/PDF/XLSX/PPTX
- API list
- download
- SHA256
- overwrite
- refresh token
- 个人 Microsoft 免费账号是否允许完整操作

如果应用注册、Azure/Entra tenant、Graph 权限成为重大障碍，详细记录步骤和实际限制。

不要因为“理论上 Graph 支持”就判定 PASS。

---

# 6. OAuth 无人值守测试

这是本次非常重要的一项。

允许：

> 用户第一次在浏览器中人工点击 OAuth 授权。

但完成后必须验证：

```text
授权一次
↓
保存 refresh token / 合法凭据
↓
结束当前脚本
↓
重新启动新进程
↓
不再人工点击
↓
自动刷新 token
↓
上传一个新文件成功
```

新文件：

```text
EvoMind_After_Reauth_Test.docx
```

内容：

```text
EVOMIND-AUTO-REFRESH-PASS-20260816
```

如果每次上传都需要用户扫码/点授权，则不适合作为 EvoMind 自动化 Artifact 后端。

---

# 7. Phase C｜ChatGPT 直连验证

这一阶段需要用户在 ChatGPT 中完成 OAuth。

EvoMind 必须输出极简操作说明，不超过 10 步。

## Box

用户在 ChatGPT：

```text
设置 → Apps → Box → Connect
```

连接后测试以下提示：

### Prompt 1

```text
在 Box 中找到 EvoMind_CloudSource_Test.docx。
告诉我项目代号、预算、城市和唯一验证码。
```

正确答案必须包含：

```text
ORBIT-7319
128600
上海
EVOMIND-CLOUD-CANARY-20260816-DOCX-A7F3
```

### Prompt 2

```text
读取 Box 中 EvoMind_CloudSource_Test.xlsx。
Revenue、Cost 和 Canary 分别是什么？
```

正确：

```text
368500
127900
EVOMIND-CLOUD-CANARY-20260816-XLSX-Q4Z8
```

### Prompt 3

```text
找到 EvoMind_CloudSource_Test.pdf，
告诉我项目代号和目标日期。
```

正确：

```text
NEBULA-4821
2026-09-30
```

### Prompt 4

```text
找到 EvoMind_CloudSource_Test.pptx，
告诉我第三页的唯一验证码。
```

正确：

```text
EVOMIND-CLOUD-CANARY-20260816-PPTX-R6N1
```

### Prompt 5｜负面对照

```text
找到 EvoMind_CloudSource_Binary_Test.zip，
直接读取 ZIP 内文件内容并告诉我里面有什么。
```

必须记录 ChatGPT 实际行为：

- 能读取
- 只能看到文件名/元数据
- 完全找不到

不能人工帮助它解压。

---

# 8. Dropbox ChatGPT 测试

连接：

```text
设置 → Apps → Dropbox → Connect
```

重复 Phase C 的 5 个 Prompt。

记录：

```text
time_to_first_result
docx_read
pdf_read
xlsx_read
pptx_read
zip_content_read
```

---

# 9. OneDrive / SharePoint ChatGPT 测试

连接：

```text
设置 → Apps → SharePoint → Connect
```

使用本次实际测试账号登录。

重点确认：

1. 免费个人 Microsoft 账号是否能完成 OAuth；
2. ChatGPT 是否能看到 OneDrive 中 `/EvoMind-Cloud-Test/`；
3. 是否必须 Microsoft 365 企业/学校 tenant；
4. 是否能读取四类文档；
5. 首次文件出现需要多久。

如果个人免费 OneDrive 无法正常接入：

```text
status = FAIL_ACCOUNT_TYPE
```

不要用付费企业账号替代免费账号后宣称成功。

---

# 10. Phase D｜新增文件传播延迟测试

这是判断能不能用于 EvoMind 自动交付的关键。

在三个平台分别上传：

```text
EvoMind_Sync_Latency_Test.docx
```

每个平台使用不同 Canary：

```text
BOX-LATENCY-20260816
DROPBOX-LATENCY-20260816
ONEDRIVE-LATENCY-20260816
```

上传时间记为 `T0`。

然后分别在：

- T+1 min
- T+5 min
- T+15 min
- T+30 min
- T+60 min
- T+120 min
- T+240 min

尝试让 ChatGPT 找到文件。

记录首次成功时间。

输出：

```text
results/02_chatgpt_sync_latency.csv
```

---

# 11. Phase E｜覆盖更新同步测试

修改原 DOCX：

原：

```text
ORBIT-7319
```

改为：

```text
ORBIT-UPDATED-8842
```

API 覆盖上传。

然后测试 ChatGPT 多久开始返回：

```text
ORBIT-UPDATED-8842
```

而不是缓存的旧值。

这一步用于判断：

> EvoMind 更新成果后，ChatGPT 是否会及时看到新版本。

---

# 12. Phase F｜免费额度与限制真实性核验

只能使用官方页面/API响应确认。

对每个平台记录：

```text
free_storage_gb
max_file_size_mb
api_available_free
api_rate_limit
requires_credit_card
requires_paid_trial
chatgpt_app_available
chatgpt_supported_extensions
chatgpt_not_indexed_extensions
```

不要引用第三方博客作为最终依据。

---

# 13. 评分模型

100 分。

## A. EvoMind 自动化上传｜30

- API 上传稳定：10
- 下载+SHA256：5
- 覆盖更新：5
- Refresh Token 无人值守：10

## B. ChatGPT 直接读取｜35

- DOCX：8
- PDF：8
- XLSX：8
- PPTX：8
- 文件/目录搜索：3

## C. 免费性｜15

- 真正永久免费：8
- 不要求信用卡：3
- 免费容量：4

容量评分：
- ≥10GB：4
- ≥5GB：3
- ≥2GB：2
- <2GB：1

## D. 国内/EvoMind 网络稳定性｜10

连续请求与上传成功率：
- 100%：10
- ≥95%：8
- ≥90%：5
- <90%：0

## E. 同步时效｜10

- ≤5min：10
- ≤15min：8
- ≤60min：5
- ≤4h：2
- >4h：0

---

# 14. 硬性淘汰条件

出现任意一项，不能作为默认后端：

```text
FAIL_PAID_REQUIRED
FAIL_API_UPLOAD
FAIL_REFRESH_TOKEN
FAIL_CHATGPT_CONNECT
FAIL_CHATGPT_DOC_READ
FAIL_NETWORK_UNSTABLE
```

ZIP/MP4 无法被 ChatGPT 直接读取**不属于淘汰条件**，因为官方连接器本身可能就不索引这些类型；必须单独记录。

---

# 15. 最终输出

必须生成：

```text
results/
├── 00_Executive_Summary.md
├── 01_network_matrix.csv
├── 02_chatgpt_sync_latency.csv
├── 03_provider_scorecard.csv
├── 04_box_test_report.md
├── 05_dropbox_test_report.md
├── 06_onedrive_test_report.md
├── 07_oauth_and_security_report.md
├── 08_recommended_architecture.md
└── evidence/
    ├── box/
    ├── dropbox/
    └── onedrive/
```

---

# 16. 最终报告必须明确给一个结论

只能从以下四种结论中选择：

```text
RECOMMEND_BOX
RECOMMEND_DROPBOX
RECOMMEND_ONEDRIVE
NO_FREE_PROVIDER_MEETS_REQUIREMENTS
```

并说明：

### 默认文档源

```text
EvoMind → ? → ChatGPT
```

### ZIP/视频策略

单独说明：

```text
ZIP / MP4 是否继续走 Gitee/COS/其他二进制发布后端
```

不要把“ChatGPT 能看到文件名”写成“ChatGPT 能读取文件内容”。

---

# 17. 如果 Box 胜出，追加做最小 PoC

如果 Box 总分最高并且无硬性 FAIL，则继续做：

```text
evomind_artifact_publish_box_poc/
├── upload_artifact.py
├── auth.py
├── README.md
├── .env.example
└── test_upload.sh
```

要求支持：

```bash
python upload_artifact.py \
  --file report.docx \
  --folder "/EvoMind/Reports"
```

输出：

```json
{
  "status": "PASS",
  "provider": "box",
  "file_name": "report.docx",
  "file_id": "...",
  "sha256": "...",
  "folder": "/EvoMind/Reports",
  "uploaded_at": "...",
  "share_url": "..."
}
```

注意：

- 不打印 access token
- 不打印 refresh token
- 不把 secret 写入 repo
- `.env` 必须 gitignore
- 日志自动脱敏

---

# 18. 如果 Dropbox 胜出

同样实现：

```text
evomind_artifact_publish_dropbox_poc/
```

CLI 和返回 JSON 结构保持一致，方便未来抽象为统一 Provider。

---

# 19. 如果 OneDrive 胜出

实现：

```text
evomind_artifact_publish_onedrive_poc/
```

通过 Microsoft Graph API 上传。

---

# 20. 最后做统一接口设计，不要立即替换生产 Skill

最终给出接口草案：

```python
publish(
    provider="box|dropbox|onedrive",
    local_path="...",
    remote_folder="...",
)
```

但本轮仅 PoC。

**未经最终报告确认，不修改当前 `evomind_artifact_publish_skill_v1` 的生产默认后端。**

---

# 验收标准

任务结束时必须能够回答：

> “如果今天让 EvoMind 免费自动上传一个 DOCX，之后我在 ChatGPT 里不手动上传文件，哪一个免费云盘最可靠地让我直接问到里面的内容？”

并提供：

- 实际测试结论
- 每个平台证据
- ChatGPT 测试截图
- OAuth 自动化结果
- 同步延迟
- 免费限制
- 推荐架构

不要只做文档调研，必须真实执行。
