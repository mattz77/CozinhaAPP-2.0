# 🔒 DOCUMENTAÇÃO DE SEGURANÇA - COZINHAAPP

## 📋 VISÃO GERAL

Este documento descreve as medidas de segurança implementadas no CozinhaApp, incluindo conformidade com a LGPD (Lei Geral de Proteção de Dados) brasileira.

---

## 🛡️ MEDIDAS DE SEGURANÇA IMPLEMENTADAS

### **1. AUTENTICAÇÃO E AUTORIZAÇÃO**

#### **JWT (JSON Web Tokens)**
- ✅ Tokens com expiração de 1 hora (configurável)
- ✅ Refresh tokens seguros com 7 dias de validade
- ✅ Chaves JWT armazenadas em variáveis de ambiente
- ✅ Validação rigorosa de assinatura e expiração
- ✅ RequireHttpsMetadata configurável por ambiente

#### **Política de Senhas**
- ✅ Mínimo 8 caracteres
- ✅ Obrigatório: maiúscula, minúscula, dígito, caractere especial
- ✅ Mínimo 2 caracteres únicos
- ✅ Bloqueio após 5 tentativas falhadas
- ✅ Bloqueio por 15 minutos

#### **Rate Limiting**
- ✅ Máximo 100 requisições por minuto por IP
- ✅ Implementação thread-safe
- ✅ Logs de tentativas de rate limiting

### **2. PROTEÇÃO DE DADOS**

#### **Criptografia**
- ✅ Senhas hasheadas com ASP.NET Core Identity
- ✅ Refresh tokens gerados com RandomNumberGenerator
- ✅ Conexões HTTPS obrigatórias em produção

#### **Sanitização de Logs**
- ✅ IPs mascarados (xxx.xxx.xxx.xxx)
- ✅ Parâmetros sensíveis removidos dos logs
- ✅ IDs de usuário substituídos por {id}
- ✅ User-Agent truncado em 200 caracteres

#### **Headers de Segurança**
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Content-Security-Policy configurado
- ✅ Permissions-Policy restritiva

### **3. FRONTEND SEGURO**

#### **Armazenamento de Tokens**
- ✅ Tokens armazenados em sessionStorage (não localStorage)
- ✅ Limpeza automática ao fechar o navegador
- ✅ Renovação automática de tokens

#### **Validação de Entrada**
- ✅ Validação no frontend e backend
- ✅ Sanitização de dados de entrada
- ✅ Proteção contra XSS

#### **CORS Configurado**
- ✅ Origens específicas permitidas
- ✅ Headers restritivos
- ✅ Métodos HTTP limitados

---

## 📜 CONFORMIDADE LGPD

### **Dados Pessoais Coletados**
- Nome completo
- Email
- Endereço (opcional)
- Cidade (opcional)
- CEP (opcional)
- Data de nascimento (opcional)
- Telefone (para pedidos)

### **Base Legal (Art. 7º LGPD)**
- **Consentimento**: Usuário concorda ao criar conta
- **Execução de contrato**: Necessário para processar pedidos
- **Interesse legítimo**: Melhoria do serviço

### **Direitos do Titular (Art. 18º LGPD)**
- ✅ Confirmação da existência de tratamento
- ✅ Acesso aos dados
- ✅ Correção de dados incompletos/inexatos
- ✅ Anonimização, bloqueio ou eliminação
- ✅ Portabilidade dos dados
- ✅ Eliminação dos dados tratados com consentimento
- ✅ Informação sobre compartilhamento
- ✅ Informação sobre possibilidade de não consentir

### **Medidas de Proteção**
- ✅ Criptografia de dados sensíveis
- ✅ Controle de acesso baseado em roles
- ✅ Logs de auditoria sanitizados
- ✅ Retenção de dados por período necessário
- ✅ Backup seguro e criptografado

---

## 🔧 CONFIGURAÇÃO DE PRODUÇÃO

### **Variáveis de Ambiente Obrigatórias**

```bash
# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here-min-32-chars
JWT_SECRET_KEY_DEV=your-dev-jwt-key-here-min-32-chars

# Admin Password (opcional - será gerada automaticamente se não definida)
ADMIN_PASSWORD=your-secure-admin-password

# Database Connection (produção)
ConnectionStrings__DefaultConnection=your-production-connection-string

# Security Settings
Security__RequireHttps=true
Security__AllowedOrigins=https://yourdomain.com,https://www.yourdomain.com
```

### **Checklist de Deploy**

- [ ] Configurar variáveis de ambiente
- [ ] Ativar HTTPS obrigatório
- [ ] Configurar CORS para domínios específicos
- [ ] Configurar backup automático do banco
- [ ] Ativar logs de auditoria
- [ ] Configurar monitoramento de segurança
- [ ] Testar rate limiting
- [ ] Validar certificados SSL

---

## 🚨 PROCEDIMENTOS DE INCIDENTE

### **Em Caso de Violação de Dados**

1. **Imediato (0-24h)**
   - Isolar sistemas comprometidos
   - Preservar evidências
   - Notificar equipe de segurança

2. **Curto Prazo (1-7 dias)**
   - Investigar escopo da violação
   - Corrigir vulnerabilidades
   - Notificar autoridades (ANPD)

3. **Médio Prazo (1-4 semanas)**
   - Notificar titulares afetados
   - Implementar medidas corretivas
   - Revisar políticas de segurança

### **Contatos de Emergência**
- **Equipe de Segurança**: security@cozinhaapp.com
- **ANPD**: https://www.gov.br/anpd/
- **Suporte Técnico**: support@cozinhaapp.com

---

## 📊 MONITORAMENTO E AUDITORIA

### **Logs de Segurança**
- Tentativas de login falhadas
- Rate limiting excedido
- Acessos administrativos
- Alterações de dados sensíveis
- Erros de autenticação

### **Métricas de Segurança**
- Taxa de sucesso de login
- Tentativas de força bruta
- Uso de APIs por IP
- Tempo de resposta de autenticação

### **Relatórios Regulares**
- Relatório mensal de segurança
- Auditoria trimestral de acesso
- Revisão anual de políticas
- Teste de penetração anual

---

## 🔄 ATUALIZAÇÕES DE SEGURANÇA

### **Processo de Atualização**
1. Avaliar vulnerabilidades
2. Priorizar correções
3. Testar em ambiente de desenvolvimento
4. Deploy em produção
5. Monitorar impacto
6. Documentar mudanças

### **Dependências Monitoradas**
- ASP.NET Core
- React
- Entity Framework Core
- JWT Libraries
- CORS Middleware

---

## 📞 SUPORTE E CONTATO

Para questões de segurança:
- **Email**: security@cozinhaapp.com
- **Telefone**: +55 (11) 99999-9999
- **Horário**: 24/7 para emergências

---

**Última atualização**: Janeiro 2025  
**Versão**: 1.0  
**Responsável**: Equipe de Segurança CozinhaApp
