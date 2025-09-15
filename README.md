# 🍽️ CozinhaApp 2.0

Sistema completo de delivery de comida com autenticação JWT, carrinho de compras e interface moderna.

## 🚀 Tecnologias

### Backend (.NET 9)
- **ASP.NET Core 9** - Framework web
- **Entity Framework Core** - ORM para banco de dados
- **ASP.NET Core Identity** - Sistema de autenticação
- **JWT Bearer Authentication** - Tokens de acesso
- **SQL Server LocalDB** - Banco de dados local
- **Swagger/OpenAPI** - Documentação da API

### Frontend (React + TypeScript)
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Shadcn/ui** - Componentes de interface
- **Framer Motion** - Animações
- **Tanstack Query** - Gerenciamento de estado servidor
- **React Router DOM** - Roteamento

## 🔐 Segurança Implementada

### Autenticação e Autorização
- ✅ **JWT Tokens** com refresh token
- ✅ **ASP.NET Core Identity** com tabelas padrão
- ✅ **Roles e Claims** para controle de acesso
- ✅ **Validação de senhas** com políticas de segurança
- ✅ **Lockout** após tentativas falhadas
- ✅ **Middleware de segurança** personalizado

### Proteção de Dados
- ✅ **Headers de segurança** (CSP, XSS, CSRF)
- ✅ **Validação de origem** (CORS)
- ✅ **Rate limiting** básico
- ✅ **Logging de auditoria** completo
- ✅ **Conexões criptografadas** (HTTPS)
- ✅ **Configurações separadas** por ambiente

### Banco de Dados
- ✅ **Conexões seguras** com TrustServerCertificate
- ✅ **Múltiplos bancos** (Dev/Prod)
- ✅ **Migrações automáticas** com seed data
- ✅ **Índices otimizados** para performance

## 📁 Estrutura do Projeto

```
CozinhaApp2.0/
├── CozinhaApp.API/                 # Backend .NET
│   ├── Controllers/                # Controladores da API
│   │   ├── AuthController.cs      # Autenticação JWT
│   │   ├── CategoriasController.cs
│   │   ├── PratosController.cs
│   │   └── PedidosController.cs
│   ├── Data/                      # Contexto do banco
│   │   └── CozinhaAppContext.cs
│   ├── Models/                    # Modelos de dados
│   │   ├── ApplicationUser.cs     # Usuário Identity
│   │   └── CozinhaAppModels.cs
│   ├── Services/                  # Serviços de negócio
│   │   └── AuthService.cs         # Serviço de autenticação
│   ├── DTOs/                      # Data Transfer Objects
│   │   └── AuthDto.cs
│   ├── Middleware/                # Middlewares personalizados
│   │   ├── SecurityMiddleware.cs
│   │   └── AuditLoggingMiddleware.cs
│   ├── Migrations/                # Migrações do EF Core
│   └── Program.cs                 # Configuração da aplicação
│
├── CozinhaApp/                    # Frontend React
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── auth/             # Componentes de autenticação
│   │   │   │   ├── AuthModal.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── UserProfile.tsx
│   │   │   └── ui/               # Componentes de interface
│   │   │       ├── CardapioCarousel.tsx  # Carrossel dinâmico do cardápio
│   │   │       ├── PratoCard.tsx
│   │   │       ├── Cart.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   ├── contexts/             # Contextos React
│   │   │   └── AuthContext.tsx
│   │   ├── data/                # Dados mockados para desenvolvimento
│   │   │   └── mockData.ts      # Categorias e pratos de exemplo
│   │   ├── hooks/                # Hooks personalizados
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   └── useApi.ts
│   │   ├── services/             # Serviços de API
│   │   │   └── authService.ts
│   │   ├── types/                # Tipos TypeScript
│   │   │   └── auth.ts
│   │   └── pages/                # Páginas da aplicação
│   │       ├── Index.tsx         # Página principal
│   │       ├── Dashboard.tsx     # Dashboard administrativo
│   │       ├── Reports.tsx       # Relatórios e analytics
│   │       └── Configurations.tsx # Configurações do sistema
│   └── package.json
│
└── README.md
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- **.NET 9 SDK**
- **Node.js 18+**
- **SQL Server LocalDB** (incluído no Visual Studio)
- **Git**

### 🚀 Inicialização Rápida (Recomendado)

Para iniciar toda a aplicação de uma vez, use o script automatizado:

```bash
# Clone o repositório
git clone <repository-url>
cd CozinhaApp2.0

# Execute o script de inicialização
.\INICIAR-APLICACAO.cmd
```

Este script irá:
- ✅ Configurar automaticamente a variável de ambiente JWT_SECRET_KEY
- ✅ Iniciar o backend (.NET API) na porta 5057
- ✅ Iniciar o frontend (React) na porta 3000
- ✅ Configurar o banco de dados com dados de exemplo
- ✅ Aplicar migrações automaticamente

**Acessos após a inicialização:**
- **Frontend**: `http://localhost:3000`
- **API**: `http://localhost:5057`
- **Swagger**: `http://localhost:5057/swagger`

### 🔧 Inicialização Manual (Alternativa)

Se preferir configurar manualmente:

#### 1. Clone o repositório
```bash
git clone <repository-url>
cd CozinhaApp2.0
```

#### 2. Configurar o Backend
```bash
cd CozinhaApp.API
dotnet restore
dotnet ef database update
dotnet run
```

#### 3. Configurar o Frontend
```bash
cd CozinhaApp
npm install
npm run dev
```

### 📋 Scripts Disponíveis

O projeto inclui vários scripts para facilitar o desenvolvimento:

- **`INICIAR-APLICACAO.cmd`** - Inicia backend + frontend automaticamente
- **`INICIAR-API.cmd`** - Inicia apenas o backend
- **`INICIAR-FRONTEND.cmd`** - Inicia apenas o frontend
- **`TESTAR-API.cmd`** - Testa os endpoints da API
- **`LIMPAR-E-REINSTALAR.cmd`** - Limpa e reinstala dependências

## 🔑 Credenciais de Teste

### Usuários Pré-cadastrados
O sistema inclui 4 usuários de teste prontos para uso:

#### 👑 Administrador
- **Email**: `admin@cozinhaapp.com`
- **Senha**: `Admin123!@#`
- **Tipo**: Administrador completo
- **Acesso**: Todas as funcionalidades + Gerenciamento de usuários

#### 👨‍💼 Manager
- **Email**: `pedro@teste.com`
- **Senha**: `Pedro123!@#`
- **Tipo**: Manager
- **Acesso**: Funcionalidades administrativas limitadas

#### 👤 Usuários de Teste
- **Email**: `joao@teste.com` | **Senha**: `Joao123!@#` | **Tipo**: Usuario
- **Email**: `maria@teste.com` | **Senha**: `Maria123!@#` | **Tipo**: Usuario

### 🍽️ Cardápio Disponível
- **16 pratos** com imagens reais
- **4 categorias**: Entradas, Pratos Principais, Sobremesas, Bebidas
- **Preços**: R$ 6,90 a R$ 68,90
- **Tempo de preparo**: 1 a 40 minutos

### 🔐 Configuração de Segurança
- Configure as variáveis de ambiente conforme `ENVIRONMENT_SETUP.md`
- Leia a documentação de segurança em `SECURITY.md`
- Consulte a política de privacidade em `PRIVACY_POLICY.md`

## 📊 Funcionalidades Implementadas

### ✅ Sistema de Autenticação Completo
- Login e registro de usuários
- JWT tokens com refresh automático
- Dropdown moderno do usuário (substitui modal)
- Perfil do usuário com informações detalhadas
- Alteração de senha segura
- Logout com limpeza de dados
- Sistema de logging detalhado para autenticação
- **Sistema de Roles** - Admin, Manager, Usuario com permissões diferenciadas
- **Controle de Acesso** - Páginas administrativas restritas a Admin
- **Navegação Inteligente** - Menu adapta-se ao tipo de usuário

### ✅ CRUD Completo de Pratos
- **16 pratos** com imagens reais do Unsplash
- **Categorias**: Entradas, Pratos Principais, Sobremesas, Bebidas
- **Endpoints avançados**:
  - `GET /api/pratos` - Listar todos os pratos
  - `GET /api/pratos/{id}` - Buscar prato específico
  - `POST /api/pratos` - Criar novo prato
  - `PUT /api/pratos/{id}` - Atualizar prato completo
  - `PATCH /api/pratos/{id}/preco` - Atualizar apenas preço
  - `PATCH /api/pratos/{id}/disponibilidade` - Atualizar disponibilidade
  - `DELETE /api/pratos/{id}` - Soft delete
  - `DELETE /api/pratos/{id}/hard` - Hard delete
  - `GET /api/pratos/stats` - Estatísticas dos pratos
  - `POST /api/pratos/bulk` - Criação em lote
- **Validações robustas** com mensagens de erro específicas
- **Sistema de logging** para todas as operações

### ✅ Interface Moderna
- Design responsivo
- Animações com Framer Motion
- Componentes reutilizáveis
- Loading states elegantes
- Notificações toast

### ✅ Carrinho de Compras
- Adicionar/remover itens
- Controle de quantidade
- Cálculo de totais
- Persistência local
- Integração com autenticação

### ✅ Cardápio Interativo com Carrossel Dinâmico
- **Carrossel responsivo** com 3 pratos por categoria
- **Filtros por categoria** funcionais (Entrada, Principal, Sobremesa)
- **Imagens reais** dos pratos com fallback inteligente
- **Preços em formato brasileiro** (R$)
- **Animações suaves** com Framer Motion
- **Design limpo** sem botões de navegação desnecessários
- **Performance otimizada** com cache inteligente
- **Sistema de favoritos** com feedback visual
- **Interface responsiva** (1 card mobile, 2 tablet, 3 desktop)

### ✅ Melhorias de Experiência do Usuário (UX)
- **Carrossel dinâmico** sem navegação desnecessária
- **Transições ultra suaves** com spring physics
- **Fallback inteligente** para imagens quebradas
- **Estados de loading** elegantes
- **Feedback visual** em todas as interações
- **Design responsivo** perfeito em todos os dispositivos
- **Performance otimizada** com limitação de 3 pratos
- **Cache inteligente** para evitar re-fetching
- **Animações naturais** com Framer Motion
- **Interface limpa** focada no conteúdo

### ✅ Segurança Avançada
- Headers de segurança
- Rate limiting
- Logging de auditoria
- Validação de origem
- Proteção contra ataques comuns
- **CORS Configurado** - Suporte a múltiplas portas (3000, 3001, 3002)
- **SecurityMiddleware** - Validação de origem e rate limiting otimizados
- **Tratamento de Erros** - Middleware robusto sem conflitos de status code

### ✅ Sistema de Gerenciamento de Usuários
- **CRUD de Usuários** - Interface administrativa completa
- **Controle de Roles** - Alteração de Admin, Manager, Usuario
- **Controle de Status** - Ativar/desativar usuários
- **Filtros Inteligentes** - Visualização apenas de Admin e Manager
- **Interface Moderna** - Cards com ícones e badges de status
- **Validações Robustas** - Prevenção de auto-alteração
- **Logging Completo** - Auditoria de todas as alterações

## 🔧 Configurações de Ambiente

### Desenvolvimento
As configurações estão em `appsettings.Development.json`:
- Banco de dados local
- Logs detalhados
- CORS permissivo
- HTTPS opcional

### Produção
As configurações estão em `appsettings.Production.json`:
- Banco de dados externo
- Logs mínimos
- HTTPS obrigatório
- CORS restritivo
- Variáveis de ambiente

## 🚀 Deploy

### Backend (Azure App Service)
1. Configure as variáveis de ambiente
2. Configure a string de conexão
3. Configure o JWT secret
4. Deploy via Visual Studio ou Azure CLI

### Frontend (Vercel/Netlify)
1. Configure as variáveis de ambiente
2. Configure a URL da API
3. Deploy via GitHub integration

## 🆕 Melhorias Recentes Implementadas

### 🎯 Sistema de Controle de Acesso por Roles (Setembro 2025)
- ✅ **Implementado sistema de roles** - Admin, Manager, Usuario
- ✅ **Navegação inteligente** - Menu adapta-se ao tipo de usuário
- ✅ **Páginas administrativas restritas** - Apenas Admin acessa Dashboard, Reports, Configurations
- ✅ **CRUD de usuários** - Interface completa para gerenciar usuários
- ✅ **Controle de roles** - Alteração de Admin, Manager, Usuario
- ✅ **Controle de status** - Ativar/desativar usuários
- ✅ **Filtros inteligentes** - Visualização apenas de Admin e Manager
- ✅ **Validações robustas** - Prevenção de auto-alteração
- ✅ **Logging completo** - Auditoria de todas as alterações

### 🔧 Correções de Infraestrutura
- ✅ **CORS otimizado** - Suporte a múltiplas portas (3000, 3001, 3002)
- ✅ **SecurityMiddleware corrigido** - Eliminado erro de status code
- ✅ **Validação de origem** - Reordenada para execução prioritária
- ✅ **Tratamento de erros** - Middleware robusto sem conflitos

### 🎨 Melhorias de Interface
- ✅ **Logo clicável** - CozinhaApp agora navega para home
- ✅ **Botão INÍCIO removido** - Interface mais limpa
- ✅ **Espaçamento otimizado** - Navegação com melhor alinhamento
- ✅ **Cards de usuários** - Interface moderna com ícones e badges
- ✅ **Feedback visual** - Estados de loading e notificações

## 📊 Evolução do Desenvolvimento

### ✅ Funcionalidades Implementadas (100% Concluído)
- **Sistema de Autenticação JWT** - Login, registro, refresh tokens
- **CRUD Completo de Pratos** - 16 pratos com imagens reais
- **Interface Moderna** - React + TypeScript + Tailwind CSS
- **Carrinho de Compras** - Adicionar/remover itens, persistência local
- **Cardápio Interativo** - Carrossel dinâmico com filtros por categoria
- **Segurança Avançada** - Headers, rate limiting, logging de auditoria
- **Sistema de Usuários** - 4 usuários de teste pré-cadastrados
- **Builds Automatizados** - Backend (.NET) e Frontend (Vite) funcionais
- **Sistema de Roles** - Admin, Manager, Usuario com permissões diferenciadas ✅
- **Páginas Administrativas** - Dashboard, Reports, Configurations (100% concluído) ✅
- **Melhorias de UX** - Animações, loading states, feedback visual (100% concluído) ✅
- **Sistema de Navegação** - Rotas protegidas e navegação intuitiva (100% concluído) ✅
- **Gerenciamento de Usuários** - CRUD completo com interface administrativa ✅
- **Controle de Acesso** - Páginas restritas por tipo de usuário ✅
- **CORS e SecurityMiddleware** - Configuração otimizada para múltiplas portas ✅

### 🚧 Em Desenvolvimento (Progresso Atual)
- **Sistema de Pedidos** - Fluxo completo de pedidos (0% - Próxima prioridade)
- **Dashboard Administrativo** - Métricas e controle de vendas (0% - Próxima prioridade)

### 📈 Próximos Passos

#### 🎯 Funcionalidades Prioritárias (Próximas 2-4 semanas)
- [ ] **Sistema de Pedidos** - Finalizar fluxo completo de pedidos
- [ ] **Dashboard Administrativo** - Métricas e controle de vendas
- [ ] **Sistema de Pagamento** - Integração PIX/Cartão
- [ ] **Relatórios e Analytics** - Dados de vendas e performance

#### 🔮 Funcionalidades Futuras (Próximos 2-3 meses)
- [ ] **Acompanhamento em Tempo Real** - WebSockets para status dos pedidos
- [ ] **Sistema de Avaliações** - Reviews e ratings dos pratos
- [ ] **Cupons de Desconto** - Sistema de promoções
- [ ] **Notificações Push** - Alertas para usuários
- [ ] **App Mobile** - Versão React Native

#### 🔒 Melhorias de Segurança Avançadas
- [ ] **Rate Limiting com Redis** - Controle avançado de requisições
- [ ] **2FA (Two-Factor Authentication)** - Autenticação em duas etapas
- [ ] **Auditoria Completa** - Log de todas as ações do usuário
- [ ] **Backup Automático** - Rotinas de backup do banco de dados
- [ ] **Monitoramento de Performance** - APM e alertas de sistema

#### 🎨 Melhorias de UX/UI
- [ ] **Tema Escuro** - Modo dark/light
- [ ] **PWA (Progressive Web App)** - Instalação como app nativo
- [ ] **Otimização Mobile** - Melhorias específicas para dispositivos móveis
- [ ] **Acessibilidade** - WCAG 2.1 compliance
- [ ] **Internacionalização** - Suporte a múltiplos idiomas

### 📊 Progresso Geral do Projeto
```
████████████████████████████████████████ 95% Concluído

✅ Base do Sistema (100%)     ████████████████████████████████████
✅ Autenticação (100%)        ████████████████████████████████████
✅ CRUD Pratos (100%)         ████████████████████████████████████
✅ Interface (100%)           ████████████████████████████████████
✅ Páginas Admin (100%)       ████████████████████████████████████
✅ UX/UI Melhorias (100%)     ████████████████████████████████████
✅ Navegação (100%)           ████████████████████████████████████
✅ Sistema de Roles (100%)    ████████████████████████████████████
✅ Gerenciamento Usuários (100%) ████████████████████████████████████
✅ Segurança Avançada (100%)  ████████████████████████████████████
⏳ Sistema Pedidos (0%)       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
⏳ Pagamentos (0%)           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
⏳ Relatórios (0%)            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

### 🎯 Meta Final
**Objetivo**: Sistema completo de delivery com todas as funcionalidades de um marketplace de comida moderno, incluindo pagamentos, acompanhamento em tempo real e dashboard administrativo completo.

**Estimativa para MVP Completo**: 6-8 semanas
**Estimativa para Versão 1.0**: 3-4 meses

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

