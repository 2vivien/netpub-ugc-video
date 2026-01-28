#!/bin/bash
# Script de build pour Vercel
echo "Lancement du build Netpub..."

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
fi

# Lancer le build
echo "Build de l'application..."
./node_modules/.bin/vite build --mode production

echo "Build terminé !"
ls -la dist/