#!/usr/bin/env python3
"""
Script para configurar a URL do backend no frontend após o deploy
"""

import os
import re
import sys

def update_backend_config(backend_url):
    """Atualiza a URL do backend no arquivo de configuração"""
    config_path = os.path.join(os.path.dirname(__file__), 'frontend', 'backend-config.js')
    
    if not os.path.exists(config_path):
        print(f"❌ Arquivo não encontrado: {config_path}")
        return False
    
    with open(config_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Substituir a URL de produção
    new_content = re.sub(
        r"PRODUCTION: '[^']*'",
        f"PRODUCTION: '{backend_url}'",
        content
    )
    
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ URL do backend atualizada para: {backend_url}")
    return True

def main():
    print("🚀 Configuração do Backend do Sentinela PIX\n")
    
    if len(sys.argv) > 1:
        backend_url = sys.argv[1]
    else:
        print("Digite a URL do backend hospedado (Railway/Render/Fly.io):")
        print("Exemplo: https://sentinela-pix-backend.railway.app")
        backend_url = input("URL: ").strip()
    
    if not backend_url:
        print("❌ URL não fornecida!")
        return
    
    # Validar URL
    if not backend_url.startswith(('http://', 'https://')):
        print("❌ URL deve começar com http:// ou https://")
        return
    
    # Remover barra final se existir
    backend_url = backend_url.rstrip('/')
    
    # Atualizar configuração
    if update_backend_config(backend_url):
        print("\n✅ Configuração concluída!")
        print("\n📝 Próximos passos:")
        print("1. Revise o arquivo frontend/backend-config.js")
        print("2. Execute: firebase deploy --only hosting")
        print("3. Teste o site em: https://a3-quinta-1a763.web.app")
    else:
        print("\n❌ Erro ao atualizar configuração!")

if __name__ == "__main__":
    main()
