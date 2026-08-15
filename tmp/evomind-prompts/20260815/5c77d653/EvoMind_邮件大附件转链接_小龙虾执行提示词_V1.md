# EvoMind 邮件大附件自动转下载链接｜小龙虾执行提示词 V1

请基于当前已经制作/安装的 **EvoMind 产物链接发布 Skill**，增加“邮件附件过大时自动转为下载链接”的能力。

## 目标

最终用户只需要说：

> 把刚生成的 PPT、PDF、ZIP 或素材包发邮件给我；附件太大就自动转下载链接。

系统必须自动判断：

```text
小附件 → 正常作为邮件附件发送
大附件 → 调用 EvoMind 产物链接发布 Skill → 生成经过验证的公网下载链接 → 在邮件正文插入下载区块 → 发送邮件
```

不要把它改造成全能邮件 Skill；邮件模块只负责“是否转链接”的判断和邮件正文注入，公网发布必须复用现有产物发布 Skill。

---

## 1. 配置

支持以下配置，不要写死 Gmail / iCloud / QQ / 163 等邮箱的官方限制：

```text
MAIL_ATTACHMENT_THRESHOLD_MB=18
MAIL_LARGE_ATTACHMENT_FALLBACK=true
MAIL_LARGE_ATTACHMENT_PACKAGE=true
PUBLIC_ARTIFACT_RETENTION_DAYS=7
```

其中 `MAIL_ATTACHMENT_THRESHOLD_MB` 是工作流阈值，不是任何邮箱服务商的官方附件上限。

---

## 2. 发送前主动判断

满足以下任一条件时，直接切换到下载链接模式：

```text
单个附件 >= MAIL_ATTACHMENT_THRESHOLD_MB
或
多附件预计整体邮件体积 >= MAIL_ATTACHMENT_THRESHOLD_MB
```

处理流程：

```text
附件/成果目录
→ 必要时统一打 ZIP
→ ZIP 完整性检查
→ 调用 evomind_artifact_publish_skill_v1
→ SHA256
→ Git Blob SHA
→ Binary Blob 上传
→ 固定 Commit
→ 远端 Blob 校验
→ jsDelivr 主链接
→ GitHub Raw 备用链接
→ 邮件正文插入下载区块
→ 不再附加大文件
→ 发送邮件
```

多附件默认打成一个：

```text
<邮件主题>_附件包_YYYYMMDD.zip
```

只有用户明确要求分别发链接时，才分别发布。

---

## 3. SMTP 因附件过大失败后的 fallback

即使附件低于本地阈值，也可能因为 MIME/Base64 膨胀或 SMTP 网关限制而失败。

如果第一次附件发送返回明确的体积错误，例如：

```text
message too large
attachment too large
maximum message size exceeded
size limit exceeded
552
5.3.4
```

则自动执行一次：

```text
附件直发失败
→ 识别 size error
→ 调用产物链接发布 Skill
→ 验证公网产物
→ 去掉大附件
→ 邮件正文插入下载区块
→ 第二次发送
```

以下错误不得误判为附件过大：SMTP 认证失败、密码/App Password 错误、收件人不存在、DNS/网络错误、TLS/SSL 错误、发信频率限制、垃圾邮件拦截。

---

## 4. 邮件正文下载区块

纯文本示例：

```text
附件说明：
本邮件成果文件体积较大，已改为下载链接发送。

文件：项目成果交付包.zip
大小：37.6 MB
SHA256：<SHA256>

主下载：
<JSDELIVR_URL>

备用下载：
<GITHUB_RAW_URL>

如主地址访问失败，请使用备用地址；下载后可使用 SHA256 校验完整性。
```

HTML 邮件则做成简洁下载卡片，显示：文件名、大小、“下载文件”按钮、备用地址、SHA256，以及“附件过大，已转换为下载链接”的说明。不要把 Git Blob/API 调试信息塞进普通邮件正文。

---

## 5. 发布校验是硬门槛

邮件模块不得自己复制一套 GitHub 上传实现，必须优先调用现有：

```text
evomind_artifact_publish_skill_v1
```

只有发布回执满足：

```text
status = PASS
remote_verified = true
```

才允许发送含下载链接的邮件。

发布失败时：保留邮件草稿、停止发送、返回失败阶段。不得发送未经远端完整性验证的链接。

---

## 6. 安全边界

附件过大 ≠ 可以自动公开。

公开 GitHub/jsDelivr 前必须沿用产物发布 Skill 的安全检查。禁止自动公开发布：

```text
.env
*.pem
*.key
credentials.json
AppSecret
API Key
Access Token
Cookie
Private Key
密码
```

以及客户隐私、儿童个人信息、未公开合同、财务敏感资料、公司内部机密、用户明确标记为不可公开的文件。

遇到“附件过大 + 内容不适合公开”时必须停止，并提示改用私有对象存储、企业网盘或其他受控方式。

当前 GitHub/jsDelivr URL 不是自动过期签名 URL，因此只称“临时交付链接/临时发布链接”，不得声称 24 小时后自动失效。

---

## 7. 邮件交付回执

新增：

```text
.mail_delivery_receipt.json
```

至少包含：

```json
{
  "status": "PASS",
  "delivery_mode": "download_link",
  "reason": "attachment_threshold_exceeded",
  "mail_subject": "...",
  "recipient_count": 1,
  "original_attachment_count": 3,
  "published_artifact": "xxx.zip",
  "size_bytes": 39426432,
  "sha256": "...",
  "primary_url": "...",
  "fallback_url": "...",
  "publish_remote_verified": true,
  "smtp_send_result": "success",
  "sent_at": "..."
}
```

`delivery_mode`：`attachment` / `download_link`。

`reason`：`normal_attachment` / `attachment_threshold_exceeded` / `smtp_message_size_rejected`。

---

## 8. 必须完成的测试

### Test 1｜小附件正常发送
1 MB PDF，阈值 18 MB。

预期：`delivery_mode=attachment`，不调用公网发布，PASS。

### Test 2｜发送前发现大附件
25 MB ZIP，阈值 18 MB。

预期：调用发布 Skill；生成并验证 jsDelivr + Raw；邮件不再附 ZIP；正文加入下载区块；PASS。

### Test 3｜多附件累计过大
10 MB PPTX + 9 MB PDF。

预期：自动统一打 ZIP；发布一个交付包；正文一个下载入口；PASS。

### Test 4｜SMTP 返回 size error
附件低于本地阈值，但模拟 SMTP 返回 `message too large`。

预期：第一次失败 → 自动 Publish → 第二次无大附件、带链接发送 → PASS。

### Test 5｜非大小类 SMTP 错误
模拟 `authentication failed`。

预期：不得调用发布 fallback；按认证失败处理；PASS。

### Test 6｜敏感大附件
包含 `.env`、`API_KEY=`、`PRIVATE_KEY`。

预期：拒绝公开发布，不发送公开下载链接，PASS。

### Test 7｜远端校验失败
模拟 `remote blob != local blob`。

预期：不得发送未验证链接，FAIL（安全阻断正确）。

---

## 9. 最终验收必须返回

完成后向我返回：

1. 修改/新增 Skill 路径；
2. 修改文件清单；
3. `MAIL_ATTACHMENT_THRESHOLD_MB` 等配置方式；
4. 大附件判断逻辑；
5. SMTP size-error fallback 逻辑；
6. Test 1–7 结果；
7. 一次小附件正常发送结果；
8. 一次大附件自动转链接结果；
9. 大附件测试真实 jsDelivr URL；
10. GitHub Raw 备用 URL；
11. SHA256；
12. 远端完整性验证结果；
13. `.publish_receipt.json` 示例；
14. `.mail_delivery_receipt.json` 示例；
15. 最终 PASS / FAIL。

任何关键测试失败，都不得声称该能力已经完成。

## 最终执行顺序

```text
安全检查
→ 发布
→ 远端完整性验证
→ 邮件发送
```

这个顺序不能反过来。
