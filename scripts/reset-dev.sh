#!/bin/bash
# Reset development environment

echo "🔄 Reiniciando entorno de desarrollo..."

# Kill all dev servers
bash "$(dirname "$0")/kill-ports.sh"

# Clean Next.js cache
echo "🧹 Limpiando cache de Next.js..."
rm -rf .next
rm -rf .turbo

# Clean node_modules cache (opcional)
if [ "$1" = "--full" ]; then
  echo "🧹 Limpiando node_modules cache..."
  rm -rf node_modules/.cache
fi

# Reinstall dependencies if requested
if [ "$1" = "--reinstall" ]; then
  echo "📦 Reinstalando dependencias..."
  rm -rf node_modules package-lock.json
  npm install
fi

echo "✅ Entorno limpio - ejecuta 'npm run dev' para iniciar"
