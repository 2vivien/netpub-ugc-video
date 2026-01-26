#!/bin/bash
set -e

# Script de build Docker avec debugging amélioré
# Usage: ./build-docker.sh [--no-cache] [--debug]

echo "🐳 Build Docker - Netpub UGC Video"
echo "=================================="

# Options
NO_CACHE=""
DEBUG=""
BUILD_ARGS=""

# Parser les arguments
for arg in "$@"; do
    case $arg in
        --no-cache)
            NO_CACHE="--no-cache"
            echo "⚠️  Mode no-cache activé"
            ;;
        --debug)
            DEBUG="--progress=plain"
            echo "🔍 Mode debug activé"
            ;;
    esac
done

# Vérifier que les fichiers nécessaires existent
echo ""
echo "📋 Vérification des fichiers requis..."

check_file() {
    if [ ! -f "$1" ]; then
        echo "❌ Fichier manquant: $1"
        exit 1
    fi
    echo "✓ $1"
}

check_dir() {
    if [ ! -d "$1" ]; then
        echo "❌ Dossier manquant: $1"
        exit 1
    fi
    echo "✓ $1/"
}

# Vérifications
check_file "package.json"
check_file "backend/package.json"
check_file "backend/tsconfig.json"
check_file "backend/prisma/schema.prisma"
check_file "vite.config.ts"
check_file "tsconfig.json"
check_file "index.html"
check_dir "src"
check_dir "backend/lib"
check_dir "backend/types"

echo ""
echo "✅ Tous les fichiers sont présents"
echo ""

# Afficher les versions
echo "📦 Versions des outils:"
echo "  Node: $(node --version)"
echo "  NPM: $(npm --version)"
echo "  Docker: $(docker --version)"
echo ""

# Build de l'image
echo "🔨 Démarrage du build..."
echo "  Image: eflexcloud/netpub-ugc-video:v1.2.0"
echo ""

# Commande de build
BUILD_CMD="docker build \
    $NO_CACHE \
    $DEBUG \
    -t eflexcloud/netpub-ugc-video:v1.2.0 \
    -t eflexcloud/netpub-ugc-video:latest \
    --build-arg VITE_API_URL=https://api-netpub.eurinhash.com \
    --build-arg VITE_APP_TITLE='Netpub UGC Video' \
    -f Dockerfile \
    ."

echo "Commande: $BUILD_CMD"
echo ""

# Exécuter le build
if eval $BUILD_CMD; then
    echo ""
    echo "✅ Build réussi!"
    echo ""
    echo "📊 Informations sur l'image:"
    docker images eflexcloud/netpub-ugc-video:v1.2.0
    echo ""
    echo "🚀 Pour démarrer l'application:"
    echo "  docker-compose up -d"
    echo ""
    echo "🔍 Pour inspecter l'image:"
    echo "  docker run --rm -it eflexcloud/netpub-ugc-video:v1.2.0 sh"
else
    echo ""
    echo "❌ Le build a échoué!"
    echo ""
    echo "💡 Conseils de debug:"
    echo "  1. Relancer avec --debug pour plus de détails:"
    echo "     ./build-docker.sh --debug"
    echo ""
    echo "  2. Vérifier les logs d'une étape spécifique:"
    echo "     docker build --target backend-build -t debug-backend ."
    echo "     docker run --rm -it debug-backend sh"
    echo ""
    echo "  3. Nettoyer le cache Docker:"
    echo "     docker builder prune -a"
    echo ""
    exit 1
fi