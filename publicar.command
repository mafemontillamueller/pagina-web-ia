#!/bin/bash
cd "/Users/mafemontilla/Desktop/PAGINA WEB IA"
rm -f .git/index.lock .git/HEAD.lock
git push origin main
echo ""
echo "✅ ¡Publicado! Vercel desplegará en ~1 minuto."
echo "Presiona Enter para cerrar..."
read
