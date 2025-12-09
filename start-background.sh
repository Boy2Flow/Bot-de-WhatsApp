#!/bin/bash

# 🤖 Script para iniciar el bot en segundo plano
# El bot seguirá ejecutándose incluso si cierras la terminal

echo "🤖 Iniciando Bot de WhatsApp en segundo plano..."

# Verificar si ya hay un proceso ejecutándose
if [ -f "bot.pid" ]; then
    PID=$(cat bot.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "⚠️  El bot ya está ejecutándose (PID: $PID)"
        echo "   Para detenerlo, ejecuta: ./stop.sh"
        exit 1
    else
        rm bot.pid
    fi
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Iniciar el bot en segundo plano
nohup npm start > logs/bot.log 2>&1 &
BOT_PID=$!

# Guardar el PID
echo $BOT_PID > bot.pid

echo "✅ Bot iniciado en segundo plano (PID: $BOT_PID)"
echo "📁 Los logs se guardan en: logs/bot.log"
echo ""
echo "Comandos útiles:"
echo "  ./stop.sh          - Detener el bot"
echo "  ./status.sh        - Ver estado del bot"
echo "  tail -f logs/bot.log - Ver logs en tiempo real"
