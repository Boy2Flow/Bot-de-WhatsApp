# Script para copiar el bot a una carpeta limpia sin datos privados
# Elimina tokens, datos de sesion, y resetea todos los archivos JSON

Write-Host "Copiando bot a 'Copia bot'..." -ForegroundColor Cyan
Write-Host ""

# Definir rutas
$sourceDir = "c:\Users\Omen\Desktop\Proyectos\Proyecto_Bots_WS"
$destDir = "c:\Users\Omen\Desktop\Proyectos\Proyecto_Bots_WS\Copia bot"

# Eliminar carpeta destino si existe
if (Test-Path $destDir) {
    Write-Host "Eliminando carpeta existente..." -ForegroundColor Yellow
    Remove-Item -Path $destDir -Recurse -Force
}

# Crear carpeta destino
Write-Host "Creando carpeta destino..." -ForegroundColor Green
New-Item -Path $destDir -ItemType Directory -Force | Out-Null

# Lista de archivos y carpetas a EXCLUIR de la copia
$excludeItems = @(
    "node_modules",
    "auth_info",
    "auth_backup*",
    "auth_backups",
    "package-lock.json",
    ".env",
    ".env.local",
    "restart_pending.json",
    "Copia bot",
    "copiar_bot_limpio.ps1",
    ".git",
    ".vscode",
    ".idea",
    "*.log",
    "whatsapp_qr.png",
    "COMMAND_LOGS.txt",
    "bot_logo_discord*.png",
    "whatsapp_icon_small*.png",
    "discord_preview_example*.png"
)

# Lista de archivos JSON que deben ser reseteados (vaciados)
$jsonFilesToReset = @(
    "economy.json",
    "customLists.json",
    "maricones.json",
    "mutedUsers.json",
    "pajeros.json",
    "traumadas.json",
    "solteras.json",
    "warns.json",
    "messages.json",
    "marriages.json",
    "divorces.json",
    "rpg_data.json",
    "groupConfig.json"
)

Write-Host "Copiando archivos..." -ForegroundColor Green

# Copiar todos los archivos excepto los excluidos
Get-ChildItem -Path $sourceDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($sourceDir.Length + 1)
    
    # Verificar si el item debe ser excluido
    $shouldExclude = $false
    foreach ($exclude in $excludeItems) {
        if ($relativePath -like "*$exclude*") {
            $shouldExclude = $true
            break
        }
    }
    
    if (-not $shouldExclude) {
        $destPath = Join-Path $destDir $relativePath
        
        if ($_.PSIsContainer) {
            # Crear directorio
            if (-not (Test-Path $destPath)) {
                New-Item -Path $destPath -ItemType Directory -Force | Out-Null
            }
        }
        else {
            # Copiar archivo
            Copy-Item -Path $_.FullName -Destination $destPath -Force
            Write-Host "  Copiado: $relativePath" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "Reseteando archivos JSON..." -ForegroundColor Yellow

# Resetear archivos JSON a estado inicial vacio
foreach ($jsonFile in $jsonFilesToReset) {
    $jsonPath = Join-Path $destDir $jsonFile
    if (Test-Path $jsonPath) {
        # Crear estructura JSON vacia segun el tipo de archivo
        $emptyContent = switch ($jsonFile) {
            "economy.json" { '{}' }
            "customLists.json" { '{}' }
            "maricones.json" { '[]' }
            "mutedUsers.json" { '{}' }
            "pajeros.json" { '[]' }
            "traumadas.json" { '[]' }
            "solteras.json" { '[]' }
            "warns.json" { '{}' }
            "messages.json" { '{}' }
            "marriages.json" { '{}' }
            "divorces.json" { '{}' }
            "rpg_data.json" { '{}' }
            "groupConfig.json" { '{}' }
            default { '{}' }
        }
        
        Set-Content -Path $jsonPath -Value $emptyContent -Encoding UTF8
        Write-Host "  Reseteado: $jsonFile" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Limpiando configuración de Discord..." -ForegroundColor Yellow

# Resetear Discord Application ID
$discordPresencePath = Join-Path $destDir "utils\discordPresence.js"
if (Test-Path $discordPresencePath) {
    $content = Get-Content -Path $discordPresencePath -Raw -Encoding UTF8
    $content = $content -replace "const CLIENT_ID = '[^']*';", "const CLIENT_ID = '1234567890123456789'; // ⚠️ CAMBIAR POR TU CLIENT ID"
    Set-Content -Path $discordPresencePath -Value $content -Encoding UTF8 -NoNewline
    Write-Host "  Discord Application ID reseteado" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ COPIA COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Ubicación: $destDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1️⃣  Navega a la carpeta 'Copia bot'" -ForegroundColor White
Write-Host "      cd 'Copia bot'" -ForegroundColor Gray
Write-Host ""
Write-Host "  2️⃣  Instala las dependencias" -ForegroundColor White
Write-Host "      npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "  3️⃣  (Opcional) Configura Discord Rich Presence" -ForegroundColor White
Write-Host "      - Crea una aplicación en Discord Developer Portal" -ForegroundColor Gray
Write-Host "      - Ejecuta: node setup_discord.js" -ForegroundColor Gray
Write-Host "      - Sube las imágenes generadas" -ForegroundColor Gray
Write-Host ""
Write-Host "  4️⃣  Inicia el bot" -ForegroundColor White
Write-Host "      node index.js" -ForegroundColor Gray
Write-Host ""
Write-Host "  5️⃣  Escanea el código QR con WhatsApp" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 DOCUMENTACIÓN INCLUIDA:" -ForegroundColor Yellow
Write-Host "  • README.md - Guía general del bot" -ForegroundColor Gray
Write-Host "  • DISCORD_README.md - Guía de Discord Rich Presence" -ForegroundColor Gray
Write-Host "  • GUIA_DISCORD_VISUAL.md - Tutorial paso a paso" -ForegroundColor Gray
Write-Host "  • SISTEMA_MUTEO.md - Sistema de muteo" -ForegroundColor Gray
Write-Host "  • GUIA_ECONOMIA.md - Sistema de economía" -ForegroundColor Gray
Write-Host "  • GUIA_RPG.md - Sistema RPG" -ForegroundColor Gray
Write-Host ""
Write-Host "¡Disfruta tu bot limpio y listo para usar! 🎉" -ForegroundColor Green
Write-Host ""
