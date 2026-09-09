param([string]$V1Zip = "$PSScriptRoot\云知师AI教师版_DSH_Remotion半成品制作包_V1.zip", [string]$OutputZip = "$PSScriptRoot\云知师AI教师版_DSH_Remotion半成品制作包_V2.zip")
$ErrorActionPreference='Stop'
if (!(Test-Path $V1Zip)) { Write-Error "找不到V1 ZIP：$V1Zip。请把V1 ZIP与本V2补丁放在同一目录，或用 -V1Zip 指定。"; exit 1 }
$work=Join-Path $env:TEMP ("yunzhishi_v2_"+[guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $work|Out-Null
Expand-Archive -Path $V1Zip -DestinationPath $work -Force
$root=(Get-ChildItem $work -Directory | Select-Object -First 1).FullName
New-Item -ItemType Directory -Force -Path (Join-Path $root '04_Remotion\参考构图')|Out-Null
Copy-Item "$PSScriptRoot\ART_DIRECTION_LOCK_V2.md" (Join-Path $root '04_Remotion\ART_DIRECTION_LOCK_V2.md') -Force
Copy-Item "$PSScriptRoot\design_tokens.json" (Join-Path $root '04_Remotion\design_tokens.json') -Force
Copy-Item "$PSScriptRoot\ART_DIRECTION_QA.json" (Join-Path $root '05_QA\ART_DIRECTION_QA.json') -Force
Copy-Item "$PSScriptRoot\参考构图\*" (Join-Path $root '04_Remotion\参考构图') -Force
Copy-Item "$PSScriptRoot\00_MASTER_PROMPT_V2.md" (Join-Path $root '00_MASTER_PROMPT_V2.md') -Force
Copy-Item "$PSScriptRoot\01_DSH_启动提示词_V2.txt" (Join-Path $root '01_DSH_启动提示词_V2.txt') -Force
if(Test-Path $OutputZip){Remove-Item $OutputZip -Force}
Compress-Archive -Path "$root\*" -DestinationPath $OutputZip -CompressionLevel Optimal
Write-Host "V2已生成：$OutputZip"
Remove-Item $work -Recurse -Force
