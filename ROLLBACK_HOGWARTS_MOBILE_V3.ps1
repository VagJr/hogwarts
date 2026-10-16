param()
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backup = "C:\hogwarts\.hogwarts-mobile-v3-backup-20260918-181910"
if (!(Test-Path $backup)) { throw "Backup nao encontrado: $backup" }

Copy-Item (Join-Path $backup "index.html") (Join-Path $root "index.html") -Force

foreach ($file in @(
    "product\mobile-product-v2.css",
    "product\mobile-product-v2.js",
    "product\mobile-product-v3.css",
    "product\mobile-product-v3.js"
)) {
    $src = Join-Path $backup $file
    $dst = Join-Path $root $file
    if (Test-Path $src) {
        Copy-Item $src $dst -Force
    } elseif (Test-Path $dst) {
        Remove-Item $dst -Force
    }
}

Write-Host "Rollback Mobile V3 concluido." -ForegroundColor Yellow