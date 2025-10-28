# Download correto das imagens
$dest = "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\frontend CS2 Fortune completo\public\images\cases"

$cases = @(
    @{local="fracture.png"; web="Fracture_Case"}
    @{local="kilowatt.png"; web="Kilowatt_Case"}
    @{local="recoil.png"; web="Recoil_Case"}
    @{local="revolution.png"; web="Revolution_Case"}
    @{local="danger-zone.png"; web="Danger_Zone_Case"}
    @{local="dreams-nightmares.png"; web="Dreams_and_Nightmares_Case"}
    @{local="phoenix.png"; web="Operation_Phoenix_Weapon_Case"}
    @{local="broken-fang.png"; web="Operation_Broken_Fang_Case"}
    @{local="breakout.png"; web="Operation_Breakout_Weapon_Case"}
    @{local="riptide.png"; web="Operation_Riptide_Case"}
    @{local="huntsman.png"; web="Huntsman_Weapon_Case"}
    @{local="spectrum.png"; web="Spectrum_Case"}
    @{local="hydra.png"; web="Operation_Hydra_Case"}
    @{local="bravo.png"; web="Operation_Bravo_Case"}
)

$success = 0

foreach ($case in $cases) {
    $url = "https://www.csgodatabase.com/images/cases/webp/$($case.web).webp"
    $tempFile = Join-Path $dest "temp.webp"
    $finalFile = Join-Path $dest $case.local
    
    Write-Host "Baixando $($case.local)..." -NoNewline
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $tempFile -ErrorAction Stop
        
        # Renomear para PNG (browsers aceitam WebP com extensao .png)
        Move-Item -Path $tempFile -Destination $finalFile -Force
        
        $size = (Get-Item $finalFile).Length
        Write-Host " OK ($size bytes)" -ForegroundColor Green
        $success++
    }
    catch {
        Write-Host " ERRO" -ForegroundColor Red
        if (Test-Path $tempFile) {
            Remove-Item $tempFile
        }
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host "`nBaixadas: $success de $($cases.Count)" -ForegroundColor Cyan
