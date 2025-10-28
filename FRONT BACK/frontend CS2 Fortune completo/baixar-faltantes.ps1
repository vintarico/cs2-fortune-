# Download das 3 imagens faltantes
$dest = "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\frontend CS2 Fortune completo\public\images\cases"

$cases = @{
    "recoil.png" = "Recoil_Case"
    "broken-fang.png" = "Operation_Broken_Fang_Case"
    "weapon.png" = "CSGO_Weapon_Case"
}

foreach ($item in $cases.GetEnumerator()) {
    $file = $item.Key
    $name = $item.Value
    $url = "https://www.csgodatabase.com/images/cases/webp/$name.webp"
    $out = Join-Path $dest $file
    
    Write-Host "Baixando $file..." -NoNewline
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $out -ErrorAction Stop
        Write-Host " OK" -ForegroundColor Green
    }
    catch {
        Write-Host " ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nConcluido!" -ForegroundColor Cyan
