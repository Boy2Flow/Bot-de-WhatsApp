#!/bin/bash

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔄 Iniciando sincronización con Git...${NC}"

# Verificar si hay repositorio remoto configurado
REMOTE=$(git remote -v)
if [ -z "$REMOTE" ]; then
    echo "❌ No hay repositorio remoto configurado."
    echo "Usa: git remote add origin <URL_DE_TU_REPO>"
    exit 1
fi

# Añadir todos los cambios
echo "📦 Añadiendo archivos..."
git add .

# Hacer commit automático con fecha
FECHA=$(date '+%Y-%m-%d %H:%M:%S')
echo "📝 Creando commit: Auto-update $FECHA"
git commit -m "Auto-update: $FECHA"

# Subir cambios
echo "🚀 Subiendo a GitHub..."
# Intentar push, si falla (por conflictos), intentar pull y luego push
if git push origin master; then
    echo -e "${GREEN}✅ ¡Subida exitosa! El bot está respaldado.${NC}"
else
    echo -e "${YELLOW}⚠️ Falló el push directo. Intentando integrar cambios remotos...${NC}"
    git pull origin master --rebase
    if git push origin master; then
        echo -e "${GREEN}✅ ¡Sincronización completada tras rebase!${NC}"
    else
        echo "❌ Error al subir. Verifica conflictos manualmente."
        exit 1
    fi
fi
