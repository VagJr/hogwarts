param()

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backup = "C:\hogwarts\.hogwarts-mobile-scroll-v2-backup-20260918-183823"

if (!(Test-Path $backup)) {
    throw "Backup nao encontrado: $backup"
}

Copy-Item (Join-Path $backup "index.html") (Join-Path $root "index.html") -Force

$oldFix = Join-Path $backup "product\mobile-scroll-fix-v3.css"
$currentFix = Join-Path $root "product\mobile-scroll-fix-v3.css"

if (Test-Path $oldFix) {
    Copy-Item $oldFix $currentFix -Force
}
elseif (Test-Path $currentFix) {
    Remove-Item $currentFix -Force
}

Write-Host "Rollback do scroll mobile concluido." -ForegroundColor Yellow