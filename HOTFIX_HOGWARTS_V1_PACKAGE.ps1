param()

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkYellow
Write-Host " HOGWARTS V1 - HOTFIX PACKAGE.JSON" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor DarkYellow
Write-Host ""

$root = Get-Location
$pkgPath = Join-Path $root "package.json"

if (!(Test-Path $pkgPath)) {
    throw "Execute este hotfix na raiz C:\hogwarts (onde esta o package.json)."
}

Write-Host "[1/4] Reparando package.json..." -ForegroundColor Cyan

$raw = [System.IO.File]::ReadAllText($pkgPath)

# Corrige exatamente o erro gerado pelo patch V1 original:
# caracteres literais \n depois do fechamento do JSON.
$raw = [regex]::Replace($raw, '\\n\s*$', '')

# Também remove BOM caso exista e regrava como UTF-8 sem BOM.
$raw = $raw.TrimEnd()

try {
    $obj = $raw | ConvertFrom-Json
}
catch {
    Write-Host "package.json ainda invalido. Tentando recuperar do backup mais recente..." -ForegroundColor Yellow

    $backup = Get-ChildItem -Directory -Filter ".hogwarts-v1-backup-*" |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (!$backup) {
        throw "Nao foi possivel localizar backup automatico."
    }

    $backupPkg = Join-Path $backup.FullName "package.json"
    if (!(Test-Path $backupPkg)) {
        throw "Backup encontrado, mas package.json nao esta nele."
    }

    $obj = Get-Content $backupPkg -Raw | ConvertFrom-Json
}

if (-not $obj.scripts) {
    $obj | Add-Member -NotePropertyName scripts -NotePropertyValue ([pscustomobject]@{})
}

$obj.scripts | Add-Member -NotePropertyName start -NotePropertyValue "node server.js" -Force
$obj.scripts | Add-Member -NotePropertyName check -NotePropertyValue "node scripts/check-v1.js" -Force
$obj.scripts | Add-Member -NotePropertyName test -NotePropertyValue "npm run check" -Force

$json = $obj | ConvertTo-Json -Depth 100

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($pkgPath, $json + [Environment]::NewLine, $utf8NoBom)

Write-Host "OK package.json reparado." -ForegroundColor Green

Write-Host "[2/4] Validando JSON..." -ForegroundColor Cyan
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package.json OK')"
if ($LASTEXITCODE -ne 0) { throw "package.json continua invalido." }

Write-Host "[3/4] Validando JavaScript..." -ForegroundColor Cyan

$files = @(
    "server.js",
    "HogwartsCore.js",
    "v1/server-runtime.js",
    "v1/content.js",
    "v1-client.js",
    "scripts/check-v1.js"
)

foreach ($f in $files) {
    if (!(Test-Path $f)) {
        throw "Arquivo esperado nao encontrado: $f"
    }

    node --check $f
    if ($LASTEXITCODE -ne 0) {
        throw "Erro de sintaxe em $f"
    }

    Write-Host "OK $f" -ForegroundColor DarkGreen
}

Write-Host "[4/4] Rodando smoke-check..." -ForegroundColor Cyan
npm run check
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "O package.json foi corrigido, mas o smoke-check encontrou outro ponto." -ForegroundColor Yellow
    Write-Host "Cole aqui a saida a partir do primeiro X/erro e eu corrijo sobre o estado atual." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " HOTFIX CONCLUIDO - HOGWARTS V1 VALIDADO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pode iniciar com:" -ForegroundColor White
Write-Host "npm start" -ForegroundColor Cyan
