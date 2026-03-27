#!/bin/bash
# ==========================================
# SCRIPT SETUP: Configuración inicial en Linux
# ==========================================
# Uso: bash setup-linux.sh

set -e  # Salir si hay error

echo "🐧 ===================="
echo "   SETUP INICIAL LINUX"
echo "==================== 🐧"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# =====================
# 1. VERIFICAR DOCKER
# =====================
echo -e "\n${YELLOW}[1/4] Verificando Docker...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker no instalado${NC}"
    echo "Instalando Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose
    echo -e "${GREEN}✓ Docker instalado${NC}"
else
    echo -e "${GREEN}✓ Docker encontrado: $(docker --version)${NC}"
fi

# =====================
# 2. AGREGAR USER A DOCKER
# =====================
echo -e "\n${YELLOW}[2/4] Configurando permisos de Docker...${NC}"

if groups $USER | grep &>/dev/null docker; then
    echo -e "${GREEN}✓ Usuario ya en grupo docker${NC}"
else
    echo "Agregando usuario al grupo docker..."
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}⚠ Debes hacer logout y login para aplicar cambios${NC}"
    echo "   O ejecuta: newgrp docker"
fi

# =====================
# 3. ENCONTRAR PROYECTO
# =====================
echo -e "\n${YELLOW}[3/4] Buscando proyecto...${NC}"

# Buscar en posibles ubicaciones
if [ -f "./docker-compose.yml" ]; then
    PROJECT_DIR="."
elif [ -f "./CarRacesApiRest/docker-compose.yml" ]; then
    PROJECT_DIR="./CarRacesApiRest"
elif [ -f "~/CarRacesApiRest/docker-compose.yml" ]; then
    PROJECT_DIR="~/CarRacesApiRest"
elif [ -f "/opt/CarRacesApiRest/docker-compose.yml" ]; then
    PROJECT_DIR="/opt/CarRacesApiRest"
else
    echo -e "${RED}✗ No se encontró docker-compose.yml${NC}"
    echo "   Asegúrate de estar en la carpeta correcta o clonar el proyecto"
    exit 1
fi

PROJECT_DIR=$(cd "$PROJECT_DIR" && pwd)
echo -e "${GREEN}✓ Proyecto encontrado en: $PROJECT_DIR${NC}"

# =====================
# 4. CREAR .env
# =====================
echo -e "\n${YELLOW}[4/4] Configurando .env...${NC}"

cd "$PROJECT_DIR"

if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env ya existe, no se sobrescribe${NC}"
else
    if [ -f ".env.docker" ]; then
        cp .env.docker .env
        echo -e "${GREEN}✓ .env creado desde .env.docker${NC}"
    elif [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ .env creado desde .env.example${NC}"
    else
        echo -e "${YELLOW}⚠ No se encontró .env.docker ni .env.example${NC}"
        echo "   Crea manualmente .env con las variables necesarias"
    fi
fi

# =====================
# RESUMEN
# =====================
echo -e "\n${GREEN}"
echo "✓ Setup completado!"
echo "${NC}"
echo "Próximos pasos:"
echo "  1. cd $PROJECT_DIR"
echo "  2. Edita .env si es necesario"
echo "  3. docker-compose build"
echo "  4. docker-compose up -d"
echo "  5. docker-compose ps"
echo ""
echo "Para ver logs:"
echo "  docker-compose logs -f api"
echo ""
