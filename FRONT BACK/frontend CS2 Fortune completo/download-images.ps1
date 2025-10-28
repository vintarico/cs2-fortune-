# ════════════════════════════════════════════════════════════════
# 🎁 SCRIPT DE DOWNLOAD AUTOMÁTICO DAS IMAGENS DAS CAIXAS CS2
# ════════════════════════════════════════════════════════════════

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🎁 CS2 Fortune - Download Automático de Imagens das Caixas" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Pasta de destino
$destinationPath = "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\frontend CS2 Fortune completo\public\images\cases"

# Criar pasta se não existir
if (!(Test-Path $destinationPath)) {
    New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
    Write-Host "✅ Pasta criada: $destinationPath" -ForegroundColor Green
}

# Mapeamento: nome do arquivo local → nome no csgodatabase
$caseMapping = @{
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

Write-Host "📥 Iniciando download de $($caseMapping.Count) imagens..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($item in $caseMapping.GetEnumerator()) {
    $fileName = $item.Key
    $caseName = $item.Value
    $url = "https://www.csgodatabase.com/images/cases/webp/$caseName.webp"
    $destination = Join-Path $destinationPath $fileName
    
    Write-Host "⬇️  Baixando: $fileName..." -NoNewline
    
    try {
        # Download da imagem WebP
        $webpPath = Join-Path $destinationPath "$caseName.webp"
        Invoke-WebRequest -Uri $url -OutFile $webpPath -ErrorAction Stop
        
        # Converter WebP para PNG usando ImageMagick (se disponível) ou apenas renomear
        # Por enquanto, vamos salvar como PNG e deixar o navegador lidar com WebP
        Move-Item -Path $webpPath -Destination $destination.Replace('.png', '.webp') -Force
        Rename-Item -Path $destination.Replace('.png', '.webp') -NewName $fileName -Force
        
        Write-Host " ✅ OK" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host " ❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 RESUMO:" -ForegroundColor Yellow
Write-Host "   ✅ Sucesso: $successCount" -ForegroundColor Green
Write-Host "   ❌ Erros: $errorCount" -ForegroundColor Red
Write-Host "   📁 Pasta: $destinationPath" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎨 Agora atualize o Chrome (F5) para ver as imagens!" -ForegroundColor Yellow
Write-Host ""

# Manter janela aberta
Read-Host -Prompt "Pressione Enter para fechar"
