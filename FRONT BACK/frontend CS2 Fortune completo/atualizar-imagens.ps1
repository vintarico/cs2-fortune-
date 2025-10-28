# Script para atualizar URLs das imagens no cases-original.js

$file = "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\frontend CS2 Fortune completo\data\cases-original.js"
$content = Get-Content $file -Raw

# Mapeamento de IDs para nomes de arquivo
$updates = @{
    "revolution" = "revolution"
    "danger-zone" = "danger-zone"
    "dreams-nightmares" = "dreams-nightmares"
    "phoenix" = "phoenix"
    "broken-fang" = "broken-fang"
    "breakout" = "breakout"
    "riptide" = "riptide"
    "huntsman" = "huntsman"
    "spectrum" = "spectrum"
    "hydra" = "hydra"
    "bravo" = "bravo"
}

# Para cada caso, substituir a URL do Steam pela local
foreach ($id in $updates.Keys) {
    $filename = $updates[$id]
    
    # Padrão: encontrar linhas com id e image do Steam
    $pattern = "(id: '$id',[\s\S]*?image: )'https://community\.cloudflare\.steamstatic\.com[^']*'"
    $replacement = "`$1'/images/cases/$filename.webp'"
    
    $content = $content -replace $pattern, $replacement
    
    Write-Host "Atualizado: $id -> /images/cases/$filename.webp" -ForegroundColor Green
}

# Salvar arquivo
$content | Set-Content $file -NoNewline

Write-Host "`nConcluido! Todas as imagens foram atualizadas." -ForegroundColor Cyan
