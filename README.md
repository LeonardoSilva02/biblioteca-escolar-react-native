# 📚 Sistema de Biblioteca Escolar

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.81.5-blue?style=for-the-badge&logo=react" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-54.0.23-black?style=for-the-badge&logo=expo" alt="Expo">
  <img src="https://img.shields.io/badge/Status-Completo-success?style=for-the-badge" alt="Status">
</div>

<p align="center">
  Sistema completo de gerenciamento de biblioteca escolar com interface moderna e navegação intuitiva.
</p>

## 🚀 Funcionalidades

### 🔐 **Autenticação**
- Login com design gradiente moderno
- Interface inspirada em materiais modernos
- Validação de credenciais

### � **Navegação Híbrida**
- **Tab Navigation**: Navegação por abas na parte inferior
- **Drawer Navigation**: Menu lateral deslizante
- **Stack Navigation**: Transições entre telas principais

### 📖 **Gestão de Livros**
- ✅ Adicionar novos livros (Título, Autor, ISBN, Quantidade)
- ✅ Buscar por título, autor ou ISBN
- ✅ Filtrar por disponibilidade
- ✅ Editar informações existentes
- ✅ Controle de estoque
- ✅ Validação de ISBN único

### 👥 **Gestão de Alunos**
- ✅ Cadastrar alunos (Nome, Matrícula)
- ✅ Buscar por nome ou matrícula
- ✅ Editar dados do aluno
- ✅ Visualizar empréstimos ativos
- ✅ Validação de matrícula única

### 📋 **Sistema de Empréstimos**
- ✅ Novo empréstimo com seleção de aluno e livro
- ✅ Prazo configurável (padrão: 7 dias)
- ✅ Controle de devoluções
- ✅ Status visual: Ativo (verde) / Atrasado (vermelho)
- ✅ Filtros por status e busca
- ✅ Validações de disponibilidade

### 📊 **Relatórios Completos**
- ✅ Estatísticas gerais (totais e percentuais)
- ✅ Ranking de livros mais emprestados
- ✅ Lista de empréstimos atrasados
- ✅ Taxa de pontualidade
- ✅ Exportar e compartilhar relatórios

### 🎨 **Interface Moderna**
- Design responsivo e mobile-first
- Gradientes e sombras modernas
- Pull-to-refresh em todas as listas
- Estados de loading e feedback visual
- Tema consistente em todo o aplicativo

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|---------|-----------|
| **React Native** | 0.81.5 | Framework mobile multiplataforma |
| **Expo** | ~54.0.23 | Plataforma de desenvolvimento |
| **React Navigation** | ^6.1.9 | Navegação (Stack + Tabs + Drawer) |
| **AsyncStorage** | 1.23.1 | Armazenamento local persistente |
| **Expo Linear Gradient** | ^15.0.7 | Gradientes modernos |
| **React Native Picker** | 2.9.0 | Seleções dropdown |
| **React Native Gesture Handler** | ~2.20.2 | Gestos e animações |

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI: `npm install -g @expo/cli`
- App Expo Go no celular (opcional)

### Instalação
```bash
# Clone o repositório
git clone [URL_DO_SEU_REPOSITORIO]

# Entre na pasta do projeto
cd BibliotecaEscolar

# Instale as dependências
npm install --legacy-peer-deps

# Execute o projeto
npm start
```

### Acesso
- **🌐 Web**: http://localhost:8086
- **📱 Mobile**: Escaneie o QR Code com Expo Go
- **🔐 Login**: `ADMIN` / `123456`

## � Estrutura do Projeto

```
📦 BibliotecaEscolar/
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizáveis
│   │   ├── Button.js           # Botão personalizado
│   │   ├── Input.js            # Campo de entrada
│   │   ├── CardLivro.js        # Card de livro
│   │   └── CardAluno.js        # Card de aluno
│   ├── 📁 navigation/          # Configuração de navegação
│   │   ├── StackNavigator.js   # Navegação principal
│   │   ├── TabNavigator.js     # Abas inferiores
│   │   └── DrawerNavigator.js  # Menu lateral
│   ├── 📁 screens/             # Telas do aplicativo
│   │   ├── LoginScreen.js      # Tela de login
│   │   ├── DashboardScreen.js  # Dashboard principal
│   │   ├── LivrosScreen.js     # Gestão de livros
│   │   ├── AlunosScreen.js     # Gestão de alunos
│   │   ├── EmprestimosScreen.js # Gestão de empréstimos
│   │   └── RelatoriosScreen.js # Relatórios e estatísticas
│   ├── 📁 services/            # Lógica de negócio
│   │   └── storage.js          # Gerenciamento de dados
│   └── 📁 styles/              # Estilos das telas
│       ├── LoginStyles.js
│       ├── DashboardStyles.js
│       ├── LivrosStyles.js
│       ├── AlunosStyles.js
│       ├── EmprestimosStyles.js
│       └── RelatoriosStyles.js
├── � App.js                   # Componente principal
├── 📄 package.json             # Dependências
└── 📄 README.md                # Este arquivo
```

## 🎯 Funcionalidades Detalhadas

### 🔑 **Login Moderno**
- Design com gradiente azul/teal
- Card flutuante com transparência
- Animações suaves
- Validação em tempo real

### � **Dashboard Inteligente**
- Estatísticas em tempo real
- Ações rápidas
- Livros mais populares
- Interface limpa e informativa

### 🔍 **Busca Avançada**
- Busca em tempo real
- Filtros múltiplos
- Resultados instantâneos
- Destaque de termos

### � **Navegação Intuitiva**
- **Abas**: Acesso rápido às funcionalidades principais
- **Drawer**: Menu lateral com todas as opções
- **Hambúrguer**: Ícone "☰" para abrir o menu lateral
- **Logout**: Disponível em ambos os menus

## 📊 **Dados de Exemplo**

O sistema vem com dados de exemplo para demonstração:

### 📖 **Livros Pré-cadastrados**
- Dom Casmurro - Machado de Assis
- O Cortiço - Aluísio Azevedo  
- 1984 - George Orwell
- E mais...

### 👥 **Alunos Pré-cadastrados**
- Ana Silva (2024001)
- João Santos (2024002)
- Maria Oliveira (2024003)
- E mais...

## 🔧 **Configurações**

### **Prazo de Empréstimos**
- Padrão: 7 dias
- Configurável por empréstimo
- Cálculo automático de vencimento

### **Validações Implementadas**
- ✅ Campos obrigatórios
- ✅ ISBN único por livro
- ✅ Matrícula única por aluno
- ✅ Disponibilidade de livros
- ✅ Empréstimos duplicados

## 🐛 **Solução de Problemas**

### **Erro de Dependências**
```bash
npm install --legacy-peer-deps
```

### **Porta em Uso**
O sistema automaticamente usa uma porta alternativa (8086)

### **Cache do Metro**
```bash
npx expo start --clear
```

## 📈 **Próximas Funcionalidades**

- [ ] Sistema de multas por atraso
- [ ] Renovação de empréstimos
- [ ] Notificações push
- [ ] Reserva de livros
- [ ] Histórico completo por aluno
- [ ] Backup em nuvem
- [ ] Modo escuro

## 🤝 **Contribuição**

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 **Contato**

- **Desenvolvido por**: [Seu Nome]
- **Data**: Novembro 2025
- **Versão**: 1.0.0

---

<div align="center">
  <p>Feito com ❤️ e React Native</p>
  <p>Sistema completo e pronto para uso em bibliotecas escolares!</p>
</div>