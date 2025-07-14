# Script PowerShell pour générer des favicons
# Vous devrez installer ImageMagick ou utiliser un service en ligne

Write-Host "=== Génération des Favicons ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Votre favicon SVG a été créé dans favicon.svg" -ForegroundColor Green
Write-Host ""
Write-Host "Pour générer tous les formats nécessaires, utilisez:" -ForegroundColor Yellow
Write-Host "1. https://realfavicongenerator.net/ (recommandé)" -ForegroundColor White
Write-Host "2. https://favicon.io/favicon-converter/" -ForegroundColor White
Write-Host ""
Write-Host "Ou utilisez ImageMagick si installé:" -ForegroundColor Yellow
Write-Host "magick favicon.svg -resize 16x16 favicon-16x16.png" -ForegroundColor White
Write-Host "magick favicon.svg -resize 32x32 favicon-32x32.png" -ForegroundColor White
Write-Host "magick favicon.svg -resize 180x180 apple-touch-icon.png" -ForegroundColor White
Write-Host "magick favicon.svg -resize 192x192 android-chrome-192x192.png" -ForegroundColor White
Write-Host "magick favicon.svg -resize 512x512 android-chrome-512x512.png" -ForegroundColor White
Write-Host ""
Write-Host "Fichiers à générer:" -ForegroundColor Cyan
$files = @(
    "favicon.ico (16x16, 32x32, 48x48)",
    "favicon-16x16.png",
    "favicon-32x32.png", 
    "apple-touch-icon.png (180x180)",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png"
)
$files | ForEach-Object { Write-Host "  ✓ $_" -ForegroundColor Green }
Write-Host ""
Write-Host "Le fichier site.webmanifest a été mis à jour automatiquement." -ForegroundColor Green
