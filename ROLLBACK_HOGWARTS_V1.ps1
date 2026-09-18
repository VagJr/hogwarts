param()
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backup = Join-Path $root ".hogwarts-v1-backup-2026-09-18T20-46-27-279Z"
if (!(Test-Path $backup)) { throw "Backup nÃ£o encontrado: $backup" }
Copy-Item (Join-Path $backup "server.js") (Join-Path $root "server.js") -Force
Copy-Item (Join-Path $backup "HogwartsCore.js") (Join-Path $root "HogwartsCore.js") -Force
Copy-Item (Join-Path $backup "index.html") (Join-Path $root "index.html") -Force
Copy-Item (Join-Path $backup "package.json") (Join-Path $root "package.json") -Force
Write-Host "Rollback dos arquivos principais concluÃ­do." -ForegroundColor Yellow
