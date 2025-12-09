#!/bin/bash

# 🤖 Script de inicio del Bot de WhatsApp
# Este script verifica las dependencias e inicia el bot

echo "🤖 =========================================="
echo "   Bot de WhatsApp - Iniciando..."
echo "=========================================="
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "   Instálalo con: sudo apt install nodejs npm"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Advertencia: Se recomienda Node.js 18 o superior"
    echo "   Versión actual: $(node -v)"
fi

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error al instalar dependencias"
        exit 1
    fi
    echo "✅ Dependencias instaladas correctamente"
    echo ""
fi

# Limpiar la terminal
clear

echo "🚀 =========================================="
echo "   Iniciando Bot de WhatsApp..."
echo "=========================================="
echo ""
echo "📱 Instrucciones:"
echo "   1. Escanea el código QR con WhatsApp"
echo "   2. Ve a: Configuración > Dispositivos vinculados"
echo "   3. Toca 'Vincular un dispositivo'"
echo "   4. Escanea el código QR"
echo ""
echo "⌨️  Presiona Ctrl+C para detener el bot"
echo ""
echo "=========================================="
echo ""

# Iniciar el bot
npm start
