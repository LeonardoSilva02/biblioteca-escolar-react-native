# SISTEMA DE BIBLIOTECA ESCOLAR - REACT NATIVE

## 📚 Descrição
Sistema completo de gerenciamento de biblioteca escolar desenvolvido em React Native/Expo, baseado no sistema Python original. Todas as funcionalidades foram adaptadas e implementadas com interface moderna e responsiva.

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado
- Expo CLI ou Expo Go no celular

### Instalação e Execução
```bash
cd BibliotecaEscolar
npm install
npm start
```

Depois escaneie o QR code com o Expo Go (Android) ou abra no navegador web.

## 🔐 Acesso ao Sistema
- **Usuário:** ADMIN
- **Senha:** 123456

## 📱 Funcionalidades Implementadas

### 1. **TELA DE LOGIN**
- Autenticação simples
- Interface responsiva
- Validação de campos

### 2. **DASHBOARD**
- Estatísticas em tempo real
- Resumo de livros disponíveis
- Empréstimos ativos e atrasados
- Livros mais emprestados
- Ações rápidas para navegação

### 3. **GERENCIAMENTO DE LIVROS**
- ✅ Cadastrar novos livros
- ✅ Editar informações dos livros
- ✅ Excluir livros
- ✅ Busca por título, autor ou ISBN
- ✅ Filtros por disponibilidade
- ✅ Controle de quantidade em estoque
- ✅ Status visual (disponível/indisponível)

### 4. **GERENCIAMENTO DE ALUNOS**
- ✅ Cadastrar novos alunos
- ✅ Editar dados dos alunos
- ✅ Excluir alunos
- ✅ Busca por nome ou matrícula
- ✅ Visualização de empréstimos ativos por aluno
- ✅ Exclusão em cascata (remove empréstimos relacionados)

### 5. **SISTEMA DE EMPRÉSTIMOS**
- ✅ Realizar novos empréstimos
- ✅ Devolver livros
- ✅ Controle de prazo (padrão: 7 dias, configurável)
- ✅ Status de empréstimos (ativo/atrasado)
- ✅ Busca por aluno, livro ou ISBN
- ✅ Filtros por status
- ✅ Validações de disponibilidade
- ✅ Prevenção de empréstimo duplicado

### 6. **RELATÓRIOS AVANÇADOS**
- ✅ Estatísticas gerais da biblioteca
- ✅ Livros mais emprestados (ranking)
- ✅ Lista de empréstimos atrasados
- ✅ Taxa de pontualidade
- ✅ Exportação de relatórios (compartilhamento)
- ✅ Atualização em tempo real

## 🎨 Características da Interface

### **Design System**
- Cores consistentes (azul primário #007bff)
- Componentes reutilizáveis
- Tipografia padronizada (maiúsculas)
- Ícones intuitivos
- Animações suaves

### **Componentes Criados**
- **Input**: Campo de entrada padronizado
- **Button**: Botão com variantes (primary, success, danger, etc.)
- **CardLivro**: Card especializado para exibir livros
- **CardAluno**: Card especializado para exibir alunos

### **Estilos Organizados**
- `LoginStyles.js` - Estilos da tela de login
- `DashboardStyles.js` - Estilos do dashboard
- `LivrosStyles.js` - Estilos da tela de livros
- `AlunosStyles.js` - Estilos da tela de alunos
- `EmprestimosStyles.js` - Estilos da tela de empréstimos
- `RelatoriosStyles.js` - Estilos da tela de relatórios

## 💾 Persistência de Dados

### **AsyncStorage**
- Todos os dados são salvos localmente no dispositivo
- Três coleções principais:
  - `livros` - Dados dos livros
  - `alunos` - Dados dos alunos  
  - `emprestimos` - Dados dos empréstimos

### **Funcionalidades de Dados**
- Auto-salvamento após cada operação
- Validações de integridade
- Conversão automática para maiúsculas
- IDs únicos por timestamp
- Relacionamentos entre tabelas

## 🔄 Principais Melhorias do Sistema Original

### **Interface Moderna**
- Navegação por abas
- Pull-to-refresh em todas as listas
- Modais para formulários
- Estados de loading
- Mensagens de feedback

### **Experiência do Usuário**
- Busca em tempo real
- Filtros dinâmicos
- Confirmações de ações destrutivas
- Estados vazios informativos
- Indicadores visuais de status

### **Funcionalidades Extras**
- Contagem de empréstimos por aluno
- Previsão de devolução
- Compartilhamento de relatórios
- Atualização automática de estatísticas
- Validação de formulários

## 📋 Regras de Negócio Implementadas

### **Livros**
- ISBN único por livro
- Controle de estoque por quantidade
- Não permite empréstimo se quantidade = 0
- Atualização automática do estoque

### **Alunos**
- Matrícula única por aluno
- Histórico de empréstimos
- Exclusão remove empréstimos relacionados

### **Empréstimos**
- Prazo padrão de 7 dias (configurável)
- Um aluno não pode ter o mesmo livro duas vezes
- Devolução aumenta estoque automaticamente
- Cálculo automático de atraso

### **Relatórios**
- Dados sempre atualizados
- Cálculos em tempo real
- Exportação em formato texto

## 🛠️ Estrutura Técnica

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Button.js
│   ├── Input.js
│   ├── CardLivro.js
│   └── CardAluno.js
├── screens/             # Telas da aplicação
│   ├── LoginScreen.js
│   ├── DashboardScreen.js
│   ├── LivrosScreen.js
│   ├── AlunosScreen.js
│   ├── EmprestimosScreen.js
│   └── RelatoriosScreen.js
├── navigation/          # Navegação
│   ├── StackNavigator.js
│   └── TabNavigator.js
├── services/           # Lógica de negócio
│   └── storage.js
└── styles/            # Estilos organizados
    ├── LoginStyles.js
    ├── DashboardStyles.js
    ├── LivrosStyles.js
    ├── AlunosStyles.js
    ├── EmprestimosStyles.js
    └── RelatoriosStyles.js
```

## 🔧 Dependências Utilizadas

```json
{
  "@react-native-async-storage/async-storage": "2.0.0",
  "@react-native-picker/picker": "2.11.1", 
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "expo": "~54.0.23",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

## 🎯 Próximas Melhorias Sugeridas

1. **Autenticação Real** - Sistema de usuários múltiplos
2. **Backup na Nuvem** - Sincronização com Firebase
3. **Notificações Push** - Lembrete de devolução
4. **Códigos de Barra** - Scanner para ISBN
5. **Fotos dos Livros** - Upload de capas
6. **Reservas** - Sistema de reserva de livros
7. **Multas** - Cálculo de multas por atraso
8. **Gráficos** - Visualização de dados avançada

## 📞 Suporte

O sistema está totalmente funcional e pronto para uso. Todas as funcionalidades do sistema Python original foram implementadas e melhoradas com interface moderna React Native.

Para dúvidas ou melhorias, consulte a documentação do código ou os comentários inline.

---

**Desenvolvido com React Native/Expo** 🚀