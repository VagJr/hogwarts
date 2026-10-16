param()
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backup = "C:\hogwarts\.hogwarts-mobile-v2-backup-20260918-180854"

if (!(Test-Path $backup)) { throw "Backup nao encontrado: $backup" }

Copy-Item (Join-Path $backup "index.html") (Join-Path $root "index.html") -Force
Copy-Item (Join-Path $backup "product\product-v2.css") (Join-Path $root "product\product-v2.css") -Force

$oldCss = Join-Path $backup "product\mobile-product-v2.css"
$oldJs  = Join-Path $backup "product\mobile-product-v2.js"

if (Test-Path $oldCss) {
    Copy-Item $oldCss (Join-Path $root "product\mobile-product-v2.css") -Force
} elseif (Test-Path (Join-Path $root "product\mobile-product-v2.css")) {
    Remove-Item (Join-Path $root "product\mobile-product-v2.css") -Force
}

if (Test-Path $oldJs) {
    Copy-Item $oldJs (Join-Path $root "product\mobile-product-v2.js") -Force
} elseif (Test-Path (Join-Path $root "product\mobile-product-v2.js")) {
    Remove-Item (Join-Path $root "product\mobile-product-v2.js") -Force
}

Write-Host "Rollback mobile concluido." -ForegroundColor Yellow