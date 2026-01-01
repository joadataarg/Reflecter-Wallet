#!/bin/bash
# Kill all Node.js processes on common development ports

echo "🔍 Buscando procesos Node.js en puertos 3000-3010..."

# Kill processes on ports 3000-3010
for port in {3000..3010}; do
  pid=$(lsof -ti:$port 2>/dev/null)
  if [ ! -z "$pid" ]; then
    echo "❌ Matando proceso en puerto $port (PID: $pid)"
    kill -9 $pid 2>/dev/null
  fi
done

# Kill any remaining Next.js processes
pkill -f "next-server" 2>/dev/null && echo "❌ Procesos Next.js terminados"
pkill -f "npm run dev" 2>/dev/null

echo "✅ Todos los puertos liberados"
