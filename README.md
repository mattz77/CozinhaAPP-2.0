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
│   │       └── Index.tsx
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

### 1. Clone o repositório
```bash
git clone <repository-url>
cd CozinhaApp2.0
```

### 2. Configurar o Backend
```bash
cd CozinhaApp.API
dotnet restore
dotnet ef database update
dotnet run
```

O backend estará disponível em:
- **API**: `https://localhost:5057`
- **Swagger**: `https://localhost:5057/swagger`

### 3. Configurar o Frontend
```bash
cd CozinhaApp
npm install
npm run dev
```

O frontend estará disponível em:
- **Aplicação**: `http://localhost:3000`

## 🔑 Credenciais Padrão

### Usuário Administrador
- **Email**: `admin@cozinhaapp.com`
- **Senha**: Será gerada automaticamente na primeira execução
- **⚠️ IMPORTANTE**: Altere a senha imediatamente após o primeiro login!

### Usuário de Teste
Crie uma conta através do formulário de registro na aplicação.

### 🔐 Configuração de Segurança
- Configure as variáveis de ambiente conforme `ENVIRONMENT_SETUP.md`
- Leia a documentação de segurança em `SECURITY.md`
- Consulte a política de privacidade em `PRIVACY_POLICY.md`

## 📊 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Login e registro de usuários
- JWT tokens com refresh
- Perfil do usuário
- Alteração de senha
- Logout seguro

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

## 📈 Próximos Passos

### Funcionalidades Planejadas
- [ ] Sistema de pagamento (PIX/Cartão)
- [ ] Acompanhamento de pedidos em tempo real
- [ ] Sistema de avaliações
- [ ] Cupons de desconto
- [ ] Notificações push
- [ ] Dashboard administrativo
- [ ] Relatórios e analytics

### Melhorias de Segurança
- [ ] Rate limiting avançado com Redis
- [ ] 2FA (Two-Factor Authentication)
- [ ] Auditoria de ações do usuário
- [ ] Backup automático do banco
- [ ] Monitoramento de performance

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- **Email**: suporte@cozinhaapp.com
- **Discord**: [Servidor da Comunidade](https://discord.gg/cozinhaapp)

---

**Desenvolvido com ❤️ para revolucionar o delivery de comida!**