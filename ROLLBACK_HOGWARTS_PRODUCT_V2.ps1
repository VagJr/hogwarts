param()
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backup = "C:\hogwarts\.hogwarts-product-v2-backup-20260918-180024"
if (!(Test-Path $backup)) { throw "Backup nao encontrado: $backup" }

foreach ($file in @("server.js","HogwartsCore.js","HogwartsMMOEngine.js","GamificacaoHogwarts.js","index.html","package.json","site.html")) {
    $src = Join-Path $backup $file
    if (Test-Path $src) {
        Copy-Item $src (Join-Path $root $file) -Force
    }
}

foreach ($generated in @("product","scripts\preflight-v2.js","PRODUCT_V2.md")) {
    $target = Join-Path $root $generated
    if (Test-Path $target) { Remove-Item $target -Recurse -Force }
}

Write-Host "Rollback Product V2 concluido." -ForegroundColor Yellow