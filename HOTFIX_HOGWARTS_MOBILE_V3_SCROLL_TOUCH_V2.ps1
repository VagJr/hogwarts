param()

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkYellow
Write-Host " HOGWARTS MOBILE V3 - SCROLL TOUCH HOTFIX V2" -ForegroundColor Yellow
Write-Host " PowerShell puro - sem arquivo temporario Node" -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor DarkYellow
Write-Host ""

$root = (Get-Location).Path
$indexPath = Join-Path $root "index.html"
$productDir = Join-Path $root "product"
$v3Path = Join-Path $productDir "mobile-product-v3.css"
$fixPath = Join-Path $productDir "mobile-scroll-fix-v3.css"

if (!(Test-Path $indexPath)) {
    throw "index.html nao encontrado. Execute na raiz C:\hogwarts."
}

if (!(Test-Path $v3Path)) {
    throw "product\mobile-product-v3.css nao encontrado. Este hotfix deve ser aplicado sobre o Mobile V3."
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = Join-Path $root ".hogwarts-mobile-scroll-v2-backup-$stamp"
New-Item -ItemType Directory -Path $backup -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $backup "product") -Force | Out-Null

Copy-Item $indexPath (Join-Path $backup "index.html") -Force
if (Test-Path $fixPath) {
    Copy-Item $fixPath (Join-Path $backup "product\mobile-scroll-fix-v3.css") -Force
}

Write-Host "[1/3] Backup criado." -ForegroundColor Cyan
Write-Host "      $backup" -ForegroundColor DarkGray

$css = @'
/* ==========================================================================
   HOGWARTS MOBILE V3 - RESTAURACAO DE SCROLL VERTICAL
   Permite swipe vertical na pagina e preserva joysticks/gestos exclusivos.
   ========================================================================== */

@media (max-width: 900px) {

  html,
  body {
    height: auto !important;
    min-height: 100% !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    overscroll-behavior-y: auto !important;
    touch-action: pan-y !important;
    -webkit-overflow-scrolling: touch !important;
  }

  .container,
  #ui-main,
  .aba,
  .card {
    touch-action: pan-y !important;
  }

  /*
   * O canvas ocupa grande parte da tela no mobile.
   * Ele NAO deve bloquear o gesto vertical da pagina.
   */
  #mmo-world-canvas,
  #forest-map-container canvas {
    touch-action: pan-y !important;
  }

  /*
   * O container pode participar do scroll da pagina.
   */
  #mmo-world-container,
  #forest-map-container {
    touch-action: pan-y !important;
  }

  /*
   * Apenas os controles que realmente precisam capturar o dedo
   * continuam com touch-action:none.
   */
  #mmo-joystick-zone,
  #forest-joystick-zone,
  #q-joystick-zone,
  #map-joystick-zone {
    touch-action: none !important;
    overscroll-behavior: contain !important;
  }

  /*
   * Botoes continuam clicaveis e deixam o navegador transformar
   * um arrasto vertical em scroll.
   */
  button,
  a,
  [onclick] {
    touch-action: pan-y manipulation !important;
  }

  /*
   * Esta regra vem depois da regra generica de botoes/onclick
   * para garantir que joysticks nunca sejam convertidos em scroll.
   */
  #mmo-joystick-zone,
  #forest-joystick-zone,
  #q-joystick-zone,
  #map-joystick-zone {
    touch-action: none !important;
  }

  /*
   * Elementos decorativos nunca devem capturar o gesto.
   */
  .overlay-vignette,
  #ambient-particles-canvas,
  #arena-flash,
  #hud-bloqueios-centro {
    pointer-events: none !important;
  }
}
'@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($fixPath, $css, $utf8NoBom)

Write-Host "[2/3] CSS de scroll criado." -ForegroundColor Cyan

$html = [System.IO.File]::ReadAllText($indexPath)

# Remove referencias antigas do mesmo hotfix para permitir reaplicar sem duplicar.
$html = [regex]::Replace(
    $html,
    '\s*<link[^>]+href=["'']\/product\/mobile-scroll-fix-v3\.css["''][^>]*>\s*',
    [Environment]::NewLine,
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)

$link = '    <link rel="stylesheet" href="/product/mobile-scroll-fix-v3.css">'

if ($html -match '/product/mobile-product-v3\.css') {
    $pattern = '(<link[^>]+href=["'']\/product\/mobile-product-v3\.css["''][^>]*>)'
    $html = [regex]::Replace(
        $html,
        $pattern,
        '$1' + [Environment]::NewLine + $link,
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
}
else {
    $html = [regex]::Replace(
        $html,
        '</head>',
        $link + [Environment]::NewLine + '</head>',
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
}

[System.IO.File]::WriteAllText($indexPath, $html, $utf8NoBom)

Write-Host "[3/3] Validando instalacao..." -ForegroundColor Cyan

$checkHtml = [System.IO.File]::ReadAllText($indexPath)
$checkCss = [System.IO.File]::ReadAllText($fixPath)

if ($checkHtml -notmatch '/product/mobile-scroll-fix-v3\.css') {
    throw "O CSS de scroll nao foi vinculado ao index.html."
}

if ($checkCss -notmatch 'touch-action:\s*pan-y') {
    throw "A regra pan-y nao foi gravada."
}

if ($checkCss -notmatch '#mmo-joystick-zone') {
    throw "A protecao dos joysticks nao foi gravada."
}

$rollbackPath = Join-Path $root "ROLLBACK_HOGWARTS_MOBILE_SCROLL_V2.ps1"

$rollback = @"
param()

`$ErrorActionPreference = "Stop"
`$root = Split-Path -Parent `$MyInvocation.MyCommand.Path
`$backup = "$backup"

if (!(Test-Path `$backup)) {
    throw "Backup nao encontrado: `$backup"
}

Copy-Item (Join-Path `$backup "index.html") (Join-Path `$root "index.html") -Force

`$oldFix = Join-Path `$backup "product\mobile-scroll-fix-v3.css"
`$currentFix = Join-Path `$root "product\mobile-scroll-fix-v3.css"

if (Test-Path `$oldFix) {
    Copy-Item `$oldFix `$currentFix -Force
}
elseif (Test-Path `$currentFix) {
    Remove-Item `$currentFix -Force
}

Write-Host "Rollback do scroll mobile concluido." -ForegroundColor Yellow
"@

[System.IO.File]::WriteAllText($rollbackPath, $rollback, $utf8NoBom)

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host " SCROLL VERTICAL MOBILE RESTAURADO" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Este hotfix nao altera botoes, cliques ou logica do jogo." -ForegroundColor White
Write-Host "Feche a aba no celular e abra novamente para carregar o CSS novo." -ForegroundColor Gray
