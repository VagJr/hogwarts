param()

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkYellow
Write-Host " HOGWARTS MOBILE V3 - SCROLL TOUCH HOTFIX" -ForegroundColor Yellow
Write-Host " Apenas rolagem vertical da pagina" -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor DarkYellow
Write-Host ""

foreach ($file in @("index.html","product\mobile-product-v3.css")) {
    if (!(Test-Path $file)) {
        throw "Faltou $file. Execute sobre a versao Mobile V3 atual."
    }
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = ".hogwarts-mobile-scroll-backup-$stamp"
New-Item -ItemType Directory -Path $backup -Force | Out-Null
Copy-Item "index.html" (Join-Path $backup "index.html") -Force

if (Test-Path "product\mobile-scroll-fix-v3.css") {
    New-Item -ItemType Directory -Path (Join-Path $backup "product") -Force | Out-Null
    Copy-Item "product\mobile-scroll-fix-v3.css" (Join-Path $backup "product\mobile-scroll-fix-v3.css") -Force
}

$patcherPath = ".mobile-scroll-hotfix.js"
[IO.File]::WriteAllBytes(
    $patcherPath,
    [Convert]::FromBase64String("J3VzZSBzdHJpY3QnOwpjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7CmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7Cgpjb25zdCBST09UID0gcHJvY2Vzcy5jd2QoKTsKY29uc3QgaW5kZXhQYXRoID0gcGF0aC5qb2luKFJPT1QsICdpbmRleC5odG1sJyk7CmNvbnN0IHYzUGF0aCA9IHBhdGguam9pbihST09ULCAncHJvZHVjdCcsICdtb2JpbGUtcHJvZHVjdC12My5jc3MnKTsKCmlmICghZnMuZXhpc3RzU3luYyhpbmRleFBhdGgpKSB0aHJvdyBuZXcgRXJyb3IoJ2luZGV4Lmh0bWwgYXVzZW50ZS4nKTsKaWYgKCFmcy5leGlzdHNTeW5jKHYzUGF0aCkpIHRocm93IG5ldyBFcnJvcignbW9iaWxlLXByb2R1Y3QtdjMuY3NzIGF1c2VudGUuIEFwbGlxdWUgc29icmUgbyBNb2JpbGUgVjMuJyk7Cgpjb25zdCBjc3MgPSBCdWZmZXIuZnJvbSgnQ2k4cUlFaHZaM2RoY25SeklFMXZZbWxzWlNCV015RGlnSlFnZG1WeWRHbGpZV3dnY0dGblpTQnpZM0p2Ykd3Z2NtVnpkRzl5WVhScGIyNGdLaThLUUcxbFpHbGhJQ2h0WVhndGQybGtkR2c2SURrd01IQjRLU0I3Q2lBZ2FIUnRiQ3dLSUNCaWIyUjVJSHNLSUNBZ0lHaGxhV2RvZERvZ1lYVjBieUFoYVcxd2IzSjBZVzUwT3dvZ0lDQWdiV2x1TFdobGFXZG9kRG9nTVRBd0pTQWhhVzF3YjNKMFlXNTBPd29nSUNBZ2IzWmxjbVpzYjNjdGVUb2dZWFYwYnlBaGFXMXdiM0owWVc1ME93b2dJQ0FnYjNabGNtWnNiM2N0ZURvZ2FHbGtaR1Z1SUNGcGJYQnZjblJoYm5RN0NpQWdJQ0J2ZG1WeWMyTnliMnhzTFdKbGFHRjJhVzl5TFhrNklHRjFkRzhnSVdsdGNHOXlkR0Z1ZERzS0lDQWdJSFJ2ZFdOb0xXRmpkR2x2YmpvZ2NHRnVMWGtnSVdsdGNHOXlkR0Z1ZERzS0lDQWdJQzEzWldKcmFYUXRiM1psY21ac2IzY3RjMk55YjJ4c2FXNW5PaUIwYjNWamFEc0tJQ0I5Q2dvZ0lDNWpiMjUwWVdsdVpYSXNDaUFnSTNWcExXMWhhVzRzQ2lBZ0xtRmlZU3dLSUNBdVkyRnlaQ3dLSUNBamJXMXZMWGR2Y214a0xXTnZiblJoYVc1bGNpd0tJQ0FqWm05eVpYTjBMVzFoY0MxamIyNTBZV2x1WlhJZ2V3b2dJQ0FnZEc5MVkyZ3RZV04wYVc5dU9pQndZVzR0ZVNBaGFXMXdiM0owWVc1ME93b2dJSDBLQ2lBZ0x5b0tJQ0FnS2lCVWFHVWdjSEpsZG1sdmRYTWdUVzlpYVd4bElGWXpJSE5sZENCMGFHVWdaVzUwYVhKbElFMU5UeUJqWVc1MllYTWdkRzhnZEc5MVkyZ3RZV04wYVc5dU9tNXZibVV1Q2lBZ0lDb2dVMmx1WTJVZ2JXOTJaVzFsYm5RZ2FYTWdZMjl1ZEhKdmJHeGxaQ0JpZVNCMGFHVWdhbTk1YzNScFkyc3NJSFJvWlNCallXNTJZWE1nYVhSelpXeG1JSE5vYjNWc1pBb2dJQ0FxSUdGc2JHOTNJSFpsY25ScFkyRnNJSEJoWjJVZ2MzZHBjR1Z6TGdvZ0lDQXFMd29nSUNOdGJXOHRkMjl5YkdRdFkyRnVkbUZ6TEFvZ0lDTm1iM0psYzNRdGJXRndMV052Ym5SaGFXNWxjaUJqWVc1MllYTWdld29nSUNBZ2RHOTFZMmd0WVdOMGFXOXVPaUJ3WVc0dGVTQWhhVzF3YjNKMFlXNTBPd29nSUgwS0NpQWdMeW9LSUNBZ0tpQkxaV1Z3SUc5dWJIa2djbVZoYkNCblpYTjBkWEpsSUdOdmJuUnliMnh6SUdWNFkyeDFjMmwyWlN3Z2MyOGdkR2hsZVNCamIyNTBhVzUxWlNCMGJ5QjNiM0pyTGdvZ0lDQXFMd29nSUNOdGJXOHRhbTk1YzNScFkyc3RlbTl1WlN3S0lDQWpabTl5WlhOMExXcHZlWE4wYVdOckxYcHZibVVzQ2lBZ0kzRXRhbTk1YzNScFkyc3RlbTl1WlN3S0lDQWpiV0Z3TFdwdmVYTjBhV05yTFhwdmJtVXNDaUFnTG5Od1pXeHNMV05oY21SYmMzUjViR1VxUFNKMGIzVmphQzFoWTNScGIyNDZJRzV2Ym1VaVhTQjdDaUFnSUNCMGIzVmphQzFoWTNScGIyNDZJRzV2Ym1VZ0lXbHRjRzl5ZEdGdWREc0tJQ0I5Q2dvZ0lDOHFDaUFnSUNvZ1FuVjBkRzl1Y3lCeVpXMWhhVzRnWTJ4cFkydGhZbXhsSUhkb2FXeGxJR0ZzYzI4Z1lXeHNiM2RwYm1jZ1lTQjJaWEowYVdOaGJDQm5aWE4wZFhKbElIUnZJSFIxY200S0lDQWdLaUJwYm5SdklIQmhaMlVnYzJOeWIyeHNhVzVuSUhkb1pXNGdkR2hsSUdacGJtZGxjaUJ0YjNabGN5NEtJQ0FnS2k4S0lDQmlkWFIwYjI0c0NpQWdZU3dLSUNCYmIyNWpiR2xqYTEwZ2V3b2dJQ0FnZEc5MVkyZ3RZV04wYVc5dU9pQndZVzR0ZVNCdFlXNXBjSFZzWVhScGIyNGdJV2x0Y0c5eWRHRnVkRHNLSUNCOUNnb2dJQzhxSUVwdmVYTjBhV05ySUcxMWMzUWdiM1psY25KcFpHVWdkR2hsSUdkbGJtVnlhV01nYjI1amJHbGpheTlpZFhSMGIyNGdjblZzWlNCaFltOTJaUzRnS2k4S0lDQWpiVzF2TFdwdmVYTjBhV05yTFhwdmJtVXNDaUFnSTJadmNtVnpkQzFxYjNsemRHbGpheTE2YjI1bExBb2dJQ054TFdwdmVYTjBhV05yTFhwdmJtVXNDaUFnSTIxaGNDMXFiM2x6ZEdsamF5MTZiMjVsSUhzS0lDQWdJSFJ2ZFdOb0xXRmpkR2x2YmpvZ2JtOXVaU0FoYVcxd2IzSjBZVzUwT3dvZ0lIMEtmUW89JywgJ2Jhc2U2NCcpOwpjb25zdCBkZXN0ID0gcGF0aC5qb2luKFJPT1QsICdwcm9kdWN0JywgJ21vYmlsZS1zY3JvbGwtZml4LXYzLmNzcycpOwpmcy53cml0ZUZpbGVTeW5jKGRlc3QsIGNzcyk7CgpsZXQgaHRtbCA9IGZzLnJlYWRGaWxlU3luYyhpbmRleFBhdGgsICd1dGY4Jyk7Cmh0bWwgPSBodG1sLnJlcGxhY2UoL1xzKjxsaW5rW14+XStocmVmPVsiJ11cL3Byb2R1Y3RcL21vYmlsZS1zY3JvbGwtZml4LXYzXC5jc3NbIiddW14+XSo+XHMqL2lnLCAnXG4nKTsKCmlmIChodG1sLmluY2x1ZGVzKCcvcHJvZHVjdC9tb2JpbGUtcHJvZHVjdC12My5jc3MnKSkgewogIGh0bWwgPSBodG1sLnJlcGxhY2UoCiAgICAvKDxsaW5rW14+XStocmVmPVsiJ11cL3Byb2R1Y3RcL21vYmlsZS1wcm9kdWN0LXYzXC5jc3NbIiddW14+XSo+KS9pLAogICAgYCQxXG4gICAgPGxpbmsgcmVsPSJzdHlsZXNoZWV0IiBocmVmPSIvcHJvZHVjdC9tb2JpbGUtc2Nyb2xsLWZpeC12My5jc3MiPmAKICApOwp9IGVsc2UgewogIGh0bWwgPSBodG1sLnJlcGxhY2UoLzxcL2hlYWQ+L2ksIGAgICAgPGxpbmsgcmVsPSJzdHlsZXNoZWV0IiBocmVmPSIvcHJvZHVjdC9tb2JpbGUtc2Nyb2xsLWZpeC12My5jc3MiPlxuPC9oZWFkPmApOwp9Cgpmcy53cml0ZUZpbGVTeW5jKGluZGV4UGF0aCwgaHRtbCwgJ3V0ZjgnKTsKY29uc29sZS5sb2coJ1ZlcnRpY2FsIG1vYmlsZSBzY3JvbGwgcmVzdG9yZWQuJyk7Cg==")
)

try {
    Write-Host "[1/3] Aplicando correcao de rolagem..." -ForegroundColor Cyan
    node $patcherPath
    if ($LASTEXITCODE -ne 0) { throw "Falha ao aplicar hotfix." }

    Write-Host "[2/3] Validando CSS vinculado..." -ForegroundColor Cyan
    $html = Get-Content "index.html" -Raw
    if ($html -notmatch "mobile-scroll-fix-v3.css") {
        throw "O CSS de scroll nao foi ligado ao index.html."
    }

    Write-Host "[3/3] Validando regras de gesto..." -ForegroundColor Cyan
    $css = Get-Content "product\mobile-scroll-fix-v3.css" -Raw
    if ($css -notmatch "touch-action:\s*pan-y") {
        throw "Regra pan-y ausente."
    }
    if ($css -notmatch "mmo-joystick-zone") {
        throw "Protecao do joystick ausente."
    }

    Write-Host ""
    Write-Host "SCROLL MOBILE RESTAURADO." -ForegroundColor Green
    Write-Host "Botoes e joystick foram preservados." -ForegroundColor Green
    Write-Host ""
    Write-Host "No celular, feche e reabra a aba para forcar o CSS novo." -ForegroundColor White
}
finally {
    if (Test-Path $patcherPath) {
        Remove-Item $patcherPath -Force -ErrorAction SilentlyContinue
    }
}
