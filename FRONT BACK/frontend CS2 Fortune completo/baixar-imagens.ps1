# Script de Download de Imagens CS2 Cases
Write-Host "Iniciando download das imagens..." -ForegroundColor Green

$dest = "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\frontend CS2 Fortune completo\public\images\cases"

if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

$cases = @{
    "fracture.png" = "Fracture_Case"
    "kilowatt.png" = "Kilowatt_Case"
    "revolution.png" = "Revolution_Case"
    "danger-zone.png" = "Danger_Zone_Case"
    "dreams-nightmares.png" = "Dreams_and_Nightmares_Case"
    "phoenix.png" = "Operation_Phoenix_Weapon_Case"
    "breakout.png" = "Operation_Breakout_Weapon_Case"
    "riptide.png" = "Operation_Riptide_Case"
    "huntsman.png" = "Huntsman_Weapon_Case"
    "spectrum.png" = "Spectrum_Case"
    "hydra.png" = "Operation_Hydra_Case"
    "weapon.png" = "CSGO_Weapon_Case"
    "bravo.png" = "Operation_Bravo_Case"
}

$success = 0
$total = $cases.Count

foreach ($item in $cases.GetEnumerator()) {
    $file = $item.Key
    $name = $item.Value
    $url = "https://www.csgodatabase.com/images/cases/webp/$name.webp"
    $out = Join-Path $dest $file.Replace('.png', '.webp')
    
    Write-Host "Baixando $file..." -NoNewline
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $out -ErrorAction Stop
        Write-Host " OK" -ForegroundColor Green
        $success++
    }
    catch {
        Write-Host " ERRO" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 300
}

Write-Host "`nCompleto! $success de $total imagens baixadas." -ForegroundColor Cyan
Write-Host "Pasta: $dest" -ForegroundColor Yellow
