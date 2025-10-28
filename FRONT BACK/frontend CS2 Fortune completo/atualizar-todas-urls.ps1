# Script para atualizar TODAS as URLs do Steam para ícones locais
$file = "C:\Users\Vinta\Desktop\site cs fortune\FRONT BACK\frontend CS2 Fortune completo\data\cases-new.js"
$content = Get-Content $file -Raw

# Substituir TODAS as URLs do Steam que ainda existem
# Padrão: qualquer URL do Steam
$content = $content -replace "image: 'https://community\.cloudflare\.steamstatic\.com[^']*'", "image: '/images/cases/placeholder.svg'"

# Salvar
$content | Set-Content $file -NoNewline

Write-Host "Atualizado! Todas as URLs do Steam foram substituídas." -ForegroundColor Green
Write-Host "Nota: Caixas sem SVG específico usarão placeholder temporário." -ForegroundColor Yellow
