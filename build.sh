#!/bin/bash
set -euo pipefail

echo "Lancement du build Netpub..."

# Installer les dépendances: privilégier pnpm quand dispo
if command -v pnpm >/dev/null 2>&1; then
  if [ ! -d "node_modules/.pnpm" ]; then
    echo "Installation des dépendances via pnpm..."
    pnpm install
  fi
else
  if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances via npm..."
    npm install
  fi
fi

# Lancer le build
./node_modules/.bin/vite build --mode production

echo "Build terminé !"
ls -la dist
