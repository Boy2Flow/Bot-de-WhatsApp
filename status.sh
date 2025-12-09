#!/bin/bash

# 📊 Script para verificar el estado del bot

echo "📊 Estado del Bot de WhatsApp"
echo "=========================================="

if [ ! -f "bot.pid" ]; then
    echo "❌ El bot NO está ejecutándose"
    exit 0
fi

PID=$(cat bot.pid)

if ps -p $PID > /dev/null 2>&1; then
    echo "✅ El bot ESTÁ ejecutándose"
    echo "   PID: $PID"
    echo "   Memoria: $(ps -p $PID -o rss= | awk '{printf "%.2f MB", $1/1024}')"
    echo "   CPU: $(ps -p $PID -o %cpu= | awk '{print $1}')%"
    echo "   Tiempo activo: $(ps -p $PID -o etime= | awk '{print $1}')"
    echo ""
    echo "📁 Ver logs: tail -f logs/bot.log"
else
    echo "❌ El bot NO está ejecutándose (proceso muerto)"
    rm bot.pid
fi
