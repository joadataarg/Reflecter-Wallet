#!/bin/bash
# View development logs with formatting

echo "📋 Logs de desarrollo (Ctrl+C para salir)"
echo "=========================================="

# Check if npm run dev is running
if ! pgrep -f "npm run dev" > /dev/null; then
  echo "⚠️  El servidor de desarrollo no está ejecutándose"
  echo "💡 Ejecuta 'npm run dev' primero"
  exit 1
fi

# Tail the terminal output with color highlighting
# This shows the most recent logs from the dev server
tail -f .next/*.log 2>/dev/null || echo "ℹ️  Ejecutando en modo watch..."
