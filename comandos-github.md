## 🚀 COMANDOS PARA CONECTAR AO GITHUB

# Depois de criar o repositório no GitHub, execute estes comandos:

# 1. Adicionar o remote (SUBSTITUA pela URL do seu repositório)
git remote add origin https://github.com/SEU_USUARIO/biblioteca-escolar-react-native.git

# 2. Verificar se foi adicionado corretamente
git remote -v

# 3. Fazer push para o GitHub pela primeira vez
git push -u origin master

# OU se preferir usar 'main' como branch principal:
git branch -M main
git push -u origin main

## 📝 EXEMPLO COMPLETO:
# Se seu usuário GitHub for "joaosilva" e repositório "biblioteca-escolar":
# git remote add origin https://github.com/joaosilva/biblioteca-escolar-react-native.git
# git push -u origin master

## ✅ DEPOIS DO PRIMEIRO PUSH:
# Para envios futuros, use apenas:
# git add .
# git commit -m "sua mensagem"
# git push