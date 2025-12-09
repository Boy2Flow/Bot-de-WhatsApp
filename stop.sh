#!/bin/bash

# 🛑 Script para detener el bot

echo "🛑 Deteniendo Bot de WhatsApp..."

if [ ! -f "bot.pid" ]; then
    echo "❌ No se encontró ningún bot ejecutándose"
    exit 1
fi

PID=$(cat bot.pid)

if ps -p $PID > /dev/null 2>&1; then
    kill $PID
    echo "✅ Bot detenido (PID: $PID)"
    rm bot.pid
else
    echo "⚠️  El proceso ya no existe"
    rm bot.pid
fi
