# 云知师AI教师版 V1 -> V2 自动合并脚本
# 用法：
# 1. 将 V1 ZIP 与本 V2 升级包解压目录放在同一父目录；
# 2. PowerShell 运行本脚本；
# 3. 输出完整 V2 ZIP。

$ErrorActionPreference = 'Stop'

$PatchRoot = Split-Path -Parent $PSScriptRoot
$Parent = Split-Path -Parent $PatchRoot

Write-Host "V2 Patch Root: $PatchRoot"
Write-Host "Search V1 under: $Parent"

$v1 = Get-ChildItem -Path $Parent -Recurse -File -Filter '云知师AI教师版_DSH_Remotion半成品制作包_V1.zip' | Select-Object -First 1
if (-not $v1) {
    throw '未找到 云知师AI教师版_DSH_Remotion半成品制作包_V1.zip。请把 V1 ZIP 与 V2 升级包放到同一父目录。'
}

$temp = Join-Path $Parent '_yunzhishi_teacher_v2_build'
if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
New-Item -ItemType Directory -Path $temp | Out-Null

Write-Host "Extracting V1: $($v1.FullName)"
Expand-Archive -Path $v1.FullName -DestinationPath $temp -Force

$v1Root = Get-ChildItem $temp -Directory | Where-Object { $_.Name -like '*V1*' } | Select-Object -First 1
if (-not $v1Root) {
    $v1Root = Get-ChildItem $temp -Directory | Select-Object -First 1
}
if (-not $v1Root) { throw 'V1 ZIP 解压后未找到根目录。' }

$v2Name = '云知师AI教师版_DSH_Remotion半成品制作包_V2'
$v2Root = Join-Path $temp $v2Name
Rename-Item -Path $v1Root.FullName -NewName $v2Name

# V2 visual directories
$remotion = Join-Path $v2Root '04_Remotion'
$qa = Join-Path $v2Root '05_QA'
$refs = Join-Path $remotion '参考构图'
$design = Join-Path $remotion '设计系统'
New-Item -ItemType Directory -Force -Path $remotion,$qa,$refs,$design | Out-Null

Copy-Item (Join-Path $PatchRoot '02_ART_DIRECTION_LOCK_V2.md') (Join-Path $remotion 'ART_DIRECTION_LOCK_V2.md') -Force
Copy-Item (Join-Path $PatchRoot '03_design_tokens.json') (Join-Path $design 'design_tokens.json') -Force
Copy-Item (Join-Path $PatchRoot '04_ART_DIRECTION_QA.json') (Join-Path $qa 'ART_DIRECTION_QA.json') -Force
Copy-Item (Join-Path $PatchRoot '06_SCENE_ART_DIRECTION_V2.md') (Join-Path $remotion 'SCENE_ART_DIRECTION_V2.md') -Force
Copy-Item (Join-Path $PatchRoot '05_reference_layouts\*.svg') $refs -Force

# Prepend V2 priority to the existing master prompt.
$master = Join-Path $v2Root '00_MASTER_PROMPT.md'
if (Test-Path $master) {
    $old = Get-Content $master -Raw -Encoding UTF8
    $prefix = @'
# V2 ART DIRECTION OVERRIDE

本包已升级为 V2。视觉执行的最高优先级顺序：

1. `04_Remotion/ART_DIRECTION_LOCK_V2.md`
2. `04_Remotion/设计系统/design_tokens.json`
3. `05_QA/ART_DIRECTION_QA.json`
4. `04_Remotion/参考构图/` 下 5 张 SVG
5. `04_Remotion/SCENE_ART_DIRECTION_V2.md`
6. 本文件原有 V1 内容

如果 V1 与 V2 视觉规则冲突，一律以 V2 为准。
Review URL 前必须 Render Still：S01/S02/S04/S05/S07/S10/S12，并完成 ART_DIRECTION_QA。
“内容都放进去了但不好看”按 FAIL 处理。

---

'@
    Set-Content -Path $master -Value ($prefix + $old) -Encoding UTF8
}

# Prepend V2 priority to launch prompt if present.
$launch = Join-Path $v2Root '01_DSH_启动短提示词.txt'
if (Test-Path $launch) {
    $oldLaunch = Get-Content $launch -Raw -Encoding UTF8
    $newLaunch = @'
【V2视觉升级】在执行任何 Remotion 制作前，先读取：
- 04_Remotion/ART_DIRECTION_LOCK_V2.md
- 04_Remotion/设计系统/design_tokens.json
- 05_QA/ART_DIRECTION_QA.json
- 04_Remotion/参考构图/ 全部 SVG
- 04_Remotion/SCENE_ART_DIRECTION_V2.md

先按参考构图锁定布局，再替换真实内容。禁止自由发挥成卡片海 / PPT 模板风。

'@ + $oldLaunch
    Set-Content -Path $launch -Value $newLaunch -Encoding UTF8
}

# Add V2 README.
$readmeV2 = @'
# V2 视觉升级说明

本 V2 在 V1 的素材、剪辑时间码、旁白和产品故事基础上，增加强制 Art Direction。

重点：
- 一屏一个主视觉；
- 数字人 70%–78%；Demo ≥65%；
- 电脑 Demo 68%–74% 宽；
- 成果页 85%–95% 大画幅；
- 禁止卡片海 / PPT模板风；
- Review 前必须做 Still QA。
'@
Set-Content -Path (Join-Path $v2Root 'README_V2_视觉升级.md') -Value $readmeV2 -Encoding UTF8

# Build SHA256 manifest before zipping.
$hashFile = Join-Path $v2Root 'SHA256SUMS_V2.txt'
$hashLines = @()
Get-ChildItem $v2Root -Recurse -File | Where-Object { $_.FullName -ne $hashFile } | Sort-Object FullName | ForEach-Object {
    $h = (Get-FileHash $_.FullName -Algorithm SHA256).Hash.ToLower()
    $rel = $_.FullName.Substring($v2Root.Length + 1).Replace('\\','/')
    $hashLines += "$h  $rel"
}
Set-Content -Path $hashFile -Value $hashLines -Encoding UTF8

$outZip = Join-Path $Parent '云知师AI教师版_DSH_Remotion半成品制作包_V2.zip'
if (Test-Path $outZip) { Remove-Item $outZip -Force }
Compress-Archive -Path $v2Root -DestinationPath $outZip -CompressionLevel Optimal

$zipHash = (Get-FileHash $outZip -Algorithm SHA256).Hash.ToLower()
Write-Host ''
Write-Host 'V2 build complete:' -ForegroundColor Green
Write-Host $outZip
Write-Host "SHA256: $zipHash"
Write-Host ''
Write-Host '把生成的 V2 ZIP + 原始素材 ZIP 一起交给 DSH 即可。'
