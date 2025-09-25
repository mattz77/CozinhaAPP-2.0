# Documentação dos Endpoints da API CozinhaApp

## Novos Endpoints Adicionados

### 📊 Dashboard Controller (`/api/dashboard`)

#### `GET /api/dashboard/stats`
- **Descrição**: Obtém estatísticas gerais do sistema
- **Autenticação**: Requerida
- **Resposta**: `DashboardStatsDto`
- **Uso**: Dashboard administrativo, métricas gerais

#### `GET /api/dashboard/sales-chart?days=30`
- **Descrição**: Dados para gráficos de vendas por período
- **Autenticação**: Requerida
- **Parâmetros**: `days` (padrão: 30)
- **Resposta**: `SalesChartDto`
- **Uso**: Gráficos de vendas, análise temporal

#### `GET /api/dashboard/top-pratos?limit=10`
- **Descrição**: Pratos mais vendidos
- **Autenticação**: Requerida
- **Parâmetros**: `limit` (padrão: 10)
- **Resposta**: Lista de `TopPratoDto`
- **Uso**: Ranking de pratos, análise de popularidade

#### `GET /api/dashboard/categorias-stats`
- **Descrição**: Estatísticas de categorias
- **Autenticação**: Requerida
- **Resposta**: Lista de `CategoriaStatsDto`
- **Uso**: Análise por categoria, performance de categorias

#### `GET /api/dashboard/performance?startDate&endDate`
- **Descrição**: Relatório de performance por período
- **Autenticação**: Requerida
- **Parâmetros**: `startDate`, `endDate` (opcionais)
- **Resposta**: `PerformanceReportDto`
- **Uso**: Relatórios de performance, análise de período

### 🔍 Search Controller (`/api/search`)

#### `GET /api/search/pratos`
- **Descrição**: Busca avançada de pratos com filtros
- **Autenticação**: Não requerida
- **Parâmetros**: 
  - `q` - termo de busca
  - `categoriaId` - filtrar por categoria
  - `precoMin` / `precoMax` - faixa de preço
  - `tempoPreparoMax` - tempo máximo de preparo
  - `tipo` - tipo do prato
  - `page` / `pageSize` - paginação
  - `sortBy` / `sortOrder` - ordenação
- **Resposta**: `SearchResultDto<PratoResponseDto>`
- **Uso**: Busca avançada, filtros, paginação

#### `GET /api/search/categorias?q=termo`
- **Descrição**: Busca categorias por termo
- **Autenticação**: Não requerida
- **Parâmetros**: `q` - termo de busca
- **Resposta**: Lista de `CategoriaResponseDto`
- **Uso**: Busca de categorias, autocomplete

#### `GET /api/search/suggestions?q=termo&limit=10`
- **Descrição**: Sugestões de busca
- **Autenticação**: Não requerida
- **Parâmetros**: `q`, `limit`
- **Resposta**: `SearchSuggestionsDto`
- **Uso**: Autocomplete, sugestões inteligentes

#### `GET /api/search/filters`
- **Descrição**: Filtros disponíveis para busca
- **Autenticação**: Não requerida
- **Resposta**: `SearchFiltersDto`
- **Uso**: Construção de interface de filtros

### 📈 Reports Controller (`/api/reports`)

#### `GET /api/reports/sales?startDate&endDate&groupBy=day`
- **Descrição**: Relatório de vendas por período
- **Autenticação**: Requerida
- **Parâmetros**: `startDate`, `endDate`, `groupBy` (day/week/month)
- **Resposta**: `SalesReportDto`
- **Uso**: Relatórios financeiros, análise de vendas

#### `GET /api/reports/top-dishes?startDate&endDate&limit=20`
- **Descrição**: Relatório de pratos mais vendidos
- **Autenticação**: Requerida
- **Parâmetros**: `startDate`, `endDate`, `limit`
- **Resposta**: `TopDishesReportDto`
- **Uso**: Análise de popularidade, relatórios de vendas

#### `GET /api/reports/financial?startDate&endDate`
- **Descrição**: Relatório de performance financeira
- **Autenticação**: Requerida
- **Parâmetros**: `startDate`, `endDate`
- **Resposta**: `FinancialReportDto`
- **Uso**: Análise financeira, métricas de receita

### ⚙️ Config Controller (`/api/config`)

#### `GET /api/config/system-info`
- **Descrição**: Informações do sistema
- **Autenticação**: Não requerida
- **Resposta**: `SystemInfoDto`
- **Uso**: Informações técnicas, debug

#### `GET /api/config/app-settings`
- **Descrição**: Configurações da aplicação
- **Autenticação**: Não requerida
- **Resposta**: `AppSettingsDto`
- **Uso**: Configurações do frontend, dados do restaurante

#### `GET /api/config/health`
- **Descrição**: Verificação de saúde do sistema
- **Autenticação**: Não requerida
- **Resposta**: `HealthCheckDto`
- **Uso**: Monitoramento, health checks

#### `GET /api/config/endpoints`
- **Descrição**: Lista de endpoints disponíveis
- **Autenticação**: Não requerida
- **Resposta**: `EndpointsInfoDto`
- **Uso**: Documentação automática, discovery de API

### 🍽️ Pratos Controller - Novos Endpoints

#### `GET /api/pratos/search`
- **Descrição**: Busca de pratos com filtros
- **Autenticação**: Não requerida
- **Parâmetros**: `q`, `categoriaId`, `precoMin`, `precoMax`, `tipo`, `limit`
- **Resposta**: Lista de `PratoResponseDto`
- **Uso**: Busca rápida de pratos

#### `GET /api/pratos/recent?limit=10`
- **Descrição**: Pratos mais recentes
- **Autenticação**: Não requerida
- **Parâmetros**: `limit`
- **Resposta**: Lista de `PratoResponseDto`
- **Uso**: Novidades, pratos recentes

#### `GET /api/pratos/featured?limit=6`
- **Descrição**: Pratos em destaque (mais vendidos)
- **Autenticação**: Não requerida
- **Parâmetros**: `limit`
- **Resposta**: Lista de `PratoResponseDto`
- **Uso**: Destaques, pratos populares

#### `GET /api/pratos/types`
- **Descrição**: Tipos de pratos disponíveis
- **Autenticação**: Não requerida
- **Resposta**: Lista de strings
- **Uso**: Filtros, categorização

### 🏷️ Categorias Controller - Novos Endpoints

#### `GET /api/categorias/{id}/pratos`
- **Descrição**: Pratos por categoria
- **Autenticação**: Não requerida
- **Resposta**: Lista de `PratoResponseDto`
- **Uso**: Listagem por categoria

#### `GET /api/categorias/stats`
- **Descrição**: Estatísticas de categorias
- **Autenticação**: Requerida
- **Resposta**: `CategoriaStatsDto`
- **Uso**: Análise de categorias

#### `POST /api/categorias`
- **Descrição**: Criar nova categoria
- **Autenticação**: Requerida
- **Body**: `CreateCategoriaDto`
- **Resposta**: `CategoriaResponseDto`
- **Uso**: Gerenciamento de categorias

#### `PUT /api/categorias/{id}`
- **Descrição**: Atualizar categoria
- **Autenticação**: Requerida
- **Body**: `UpdateCategoriaDto`
- **Uso**: Edição de categorias

## 🚀 Benefícios para o Frontend

### 1. **Busca e Filtros Avançados**
- Busca inteligente com sugestões
- Filtros por preço, categoria, tipo
- Paginação automática
- Ordenação flexível

### 2. **Dashboard e Analytics**
- Estatísticas em tempo real
- Gráficos de vendas
- Métricas de performance
- Relatórios detalhados

### 3. **Dados Estruturados**
- DTOs consistentes
- Informações completas
- Relacionamentos incluídos
- Metadados úteis

### 4. **Performance Otimizada**
- Queries eficientes
- Paginação nativa
- Filtros no banco
- Cache-friendly

### 5. **Configuração Flexível**
- Informações do sistema
- Configurações da aplicação
- Health checks
- Documentação automática

## 📝 Exemplos de Uso

### Busca de Pratos
```javascript
// Buscar pratos por termo
GET /api/search/pratos?q=pizza&categoriaId=1&precoMin=20&precoMax=50

// Buscar pratos com paginação
GET /api/search/pratos?page=2&pageSize=10&sortBy=preco&sortOrder=asc
```

### Dashboard
```javascript
// Estatísticas gerais
GET /api/dashboard/stats

// Gráfico de vendas dos últimos 7 dias
GET /api/dashboard/sales-chart?days=7

// Top 5 pratos mais vendidos
GET /api/dashboard/top-pratos?limit=5
```

### Relatórios
```javascript
// Relatório de vendas do mês
GET /api/reports/sales?startDate=2024-01-01&endDate=2024-01-31&groupBy=day

// Relatório financeiro da semana
GET /api/reports/financial?startDate=2024-01-22&endDate=2024-01-28
```

### Configurações
```javascript
// Informações do sistema
GET /api/config/system-info

// Configurações da aplicação
GET /api/config/app-settings

// Verificar saúde da API
GET /api/config/health
```

## 🔧 Implementação no Frontend

### 1. **Service Layer**
```typescript
// services/dashboardService.ts
export const dashboardService = {
  async getStats(): Promise<DashboardStatsDto> {
    const response = await fetch('/api/dashboard/stats');
    return response.json();
  },
  
  async getSalesChart(days: number): Promise<SalesChartDto> {
    const response = await fetch(`/api/dashboard/sales-chart?days=${days}`);
    return response.json();
  }
};
```

### 2. **Hooks Personalizados**
```typescript
// hooks/useDashboard.ts
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 5 * 60 * 1000 // 5 minutos
  });
};
```

### 3. **Componentes de Busca**
```typescript
// components/SearchBar.tsx
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { data: suggestions } = useQuery({
    queryKey: ['search', 'suggestions', query],
    queryFn: () => searchService.getSuggestions(query),
    enabled: query.length >= 2
  });
  
  // Implementação do componente...
};
```

Estes novos endpoints fornecem uma base sólida para criar uma aplicação frontend rica e funcional, com recursos avançados de busca, dashboard, relatórios e configurações.







