@echo off
echo ========================================
echo    LIMPIEZA COMPLETA DEL BOT
echo ========================================
echo.

echo [1/4] Deteniendo todos los procesos de Node.js...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo ✅ Procesos de Node.js detenidos
) else (
    echo ℹ️  No habia procesos de Node.js corriendo
)
timeout /t 2 /nobreak >nul

echo.
echo [2/4] Eliminando sesion corrupta...
if exist "auth_info" (
    if not exist "auth_backups" mkdir "auth_backups"
    move "auth_info" "auth_backups\auth_backup_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul 2>&1
    echo ✅ Sesion movida a backup
) else (
    echo ℹ️  No habia sesion previa
)

echo.
echo [3/4] Limpiando archivos temporales...
if exist "whatsapp_qr.png" del /F /Q "whatsapp_qr.png" >nul 2>&1
if exist "restart_pending.json" del /F /Q "restart_pending.json" >nul 2>&1
if exist "baileys_store.json" del /F /Q "baileys_store.json" >nul 2>&1
echo ✅ Archivos temporales eliminados

echo.
echo [4/4] Verificando que no haya procesos corriendo...
tasklist | find /I "node.exe" >nul
if %errorlevel% == 0 (
    echo ⚠️  ADVERTENCIA: Aun hay procesos de Node.js corriendo
    echo    Cierralos manualmente antes de continuar
    pause
) else (
    echo ✅ No hay procesos de Node.js corriendo
)

echo.
echo ========================================
echo    LIMPIEZA COMPLETADA
echo ========================================
echo.
echo 📱 ANTES DE CONTINUAR:
echo    1. Abre WhatsApp en tu telefono
echo    2. Ve a: Configuracion ^> Dispositivos vinculados
echo    3. CIERRA TODAS las sesiones activas
echo    4. Cierra WhatsApp Web si lo tienes abierto
echo.
echo 🚀 Cuando hayas hecho esto, ejecuta:
echo    node index.js
echo.
pause
