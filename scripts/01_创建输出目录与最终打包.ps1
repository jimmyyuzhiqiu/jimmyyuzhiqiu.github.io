$Root = 'C:\Users\13570\Desktop\视频合集'
$OutRoot = Join-Path $Root 'Agent制作包输出'
New-Item -ItemType Directory -Force -Path $OutRoot | Out-Null

$Systems = @(
  @{ Source='专利检测与风险分析'; Out='TTFA_专利监测与风险分析_Agent制作包' },
  @{ Source='深度行业研究系统'; Out='TTFA_深度行业研究_Agent制作包' },
  @{ Source='智能政策匹配'; Out='TTFA_智能政策匹配_Agent制作包' },
  @{ Source='科技产业匹配系统'; Out='TTFA_科技产业匹配_Agent制作包' },
  @{ Source='科研成果转化评估系统'; Out='TTFA_科研成果转化评估_Agent制作包' },
  @{ Source='论文与科研数据智能质审'; Out='TTFA_论文与科研数据智能质审_Agent制作包' }
)

foreach ($s in $Systems) {
  $pkg = Join-Path $OutRoot $s.Out
  foreach ($sub in @('00_公共素材','01_原始输入','02_Demo切分','03_报告精选素材','04_制作文档','05_原始完整资料')) {
    New-Item -ItemType Directory -Force -Path (Join-Path $pkg $sub) | Out-Null
  }
}

Write-Host '目录骨架已创建。DSH 完成素材复制、Demo切分和文档生成后，再运行下面的打包逻辑。'

foreach ($s in $Systems) {
  $pkg = Join-Path $OutRoot $s.Out
  $zip = "$pkg.zip"
  if (Test-Path $zip) { Remove-Item $zip -Force }
  if (Test-Path (Join-Path $pkg '00_MASTER_PROMPT.md')) {
    Compress-Archive -Path "$pkg\*" -DestinationPath $zip -CompressionLevel Optimal
    $hash = Get-FileHash $zip -Algorithm SHA256
    "$($hash.Hash)  $([System.IO.Path]::GetFileName($zip))" | Set-Content -Encoding UTF8 "$zip.sha256.txt"
    Write-Host "完成：$zip"
    Write-Host "SHA256：$($hash.Hash)"
  } else {
    Write-Warning "$($s.Out) 尚未完成，缺少 00_MASTER_PROMPT.md，跳过打包。"
  }
}
