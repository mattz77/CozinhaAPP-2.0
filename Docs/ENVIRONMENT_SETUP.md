# 🔧 CONFIGURAÇÃO DE AMBIENTE - COZINHAAPP

## 📋 VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS

### **Desenvolvimento (.env.development)**
```bash
# JWT Configuration
JWT_SECRET_KEY_DEV=CozinhaApp2025DevSuperSecretKeyForJWTTokenGeneration123456789Min32Chars
JWT_ISSUER_DEV=CozinhaApp.API.Dev
JWT_AUDIENCE_DEV=CozinhaApp.Frontend.Dev
JWT_EXPIRY_HOURS=1
JWT_REFRESH_EXPIRY_DAYS=7

# Security Settings
SECURITY_REQUIRE_HTTPS=false
SECURITY_MAX_FAILED_ATTEMPTS=5
SECURITY_LOCKOUT_MINUTES=15

# Database
CONNECTION_STRING_DEV=Server=(localdb)\\MSSQLLocalDB;Database=CozinhaAppDB_Dev;Trusted_Connection=true;TrustServerCertificate=true;MultipleActiveResultSets=true;

# Admin User (opcional - será gerada automaticamente)
ADMIN_PASSWORD_DEV=Admin123!@#

# CORS Origins
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://localhost:3000
```

### **Produção (.env.production)**
```bash
# JWT Configuration - GERAR CHAVES SEGURAS!
JWT_SECRET_KEY=GERAR_CHAVE_SUPER_SECRETA_MIN_32_CARACTERES_AQUI
JWT_ISSUER=CozinhaApp.API
JWT_AUDIENCE=CozinhaApp.Frontend
JWT_EXPIRY_HOURS=1
JWT_REFRESH_EXPIRY_DAYS=7

# Security Settings
SECURITY_REQUIRE_HTTPS=true
SECURITY_MAX_FAILED_ATTEMPTS=5
SECURITY_LOCKOUT_MINUTES=15

# Database - CONFIGURAR CONEXÃO SEGURA
CONNECTION_STRING_PROD=Server=your-server;Database=CozinhaAppDB;User Id=your-user;Password=your-password;TrustServerCertificate=true;Encrypt=true;

# Admin User - ALTERAR SENHA IMEDIATAMENTE
ADMIN_PASSWORD=GERAR_SENHA_SUPER_SEGURA_AQUI

# CORS Origins - CONFIGURAR DOMÍNIOS ESPECÍFICOS
CORS_ALLOWED_ORIGINS=https://cozinhaapp.com,https://www.cozinhaapp.com

# Logging
LOG_LEVEL=Warning
LOG_RETENTION_DAYS=30
```

---

## 🚀 COMANDOS DE CONFIGURAÇÃO

### **1. Configurar Variáveis de Ambiente**

#### **Windows (PowerShell)**
```powershell
# Desenvolvimento
$env:JWT_SECRET_KEY_DEV="CozinhaApp2025DevSuperSecretKeyForJWTTokenGeneration123456789Min32Chars"
$env:ADMIN_PASSWORD_DEV="Admin123!@#"

# Produção
$env:JWT_SECRET_KEY="GERAR_CHAVE_SUPER_SECRETA_MIN_32_CARACTERES_AQUI"
$env:ADMIN_PASSWORD="GERAR_SENHA_SUPER_SEGURA_AQUI"
```

#### **Linux/macOS (Bash)**
```bash
# Desenvolvimento
export JWT_SECRET_KEY_DEV="CozinhaApp2025DevSuperSecretKeyForJWTTokenGeneration123456789Min32Chars"
export ADMIN_PASSWORD_DEV="Admin123!@#"

# Produção
export JWT_SECRET_KEY="GERAR_CHAVE_SUPER_SECRETA_MIN_32_CARACTERES_AQUI"
export ADMIN_PASSWORD="GERAR_SENHA_SUPER_SEGURA_AQUI"
```

### **2. Gerar Chaves JWT Seguras**

#### **Usando OpenSSL**
```bash
# Gerar chave de 256 bits (32 bytes)
openssl rand -base64 32

# Gerar chave de 512 bits (64 bytes) - mais segura
openssl rand -base64 64
```

#### **Usando PowerShell**
```powershell
# Gerar chave aleatória
[System.Web.Security.Membership]::GeneratePassword(32, 8)
```

#### **Usando Node.js**
```javascript
// Gerar chave segura
const crypto = require('crypto');
const key = crypto.randomBytes(32).toString('base64');
console.log(key);
```

---

## 🔐 CHECKLIST DE SEGURANÇA

### **Antes do Deploy**

- [ ] **Chaves JWT**: Geradas com pelo menos 32 caracteres
- [ ] **Senha Admin**: Alterada da padrão
- [ ] **HTTPS**: Configurado e funcionando
- [ ] **CORS**: Configurado apenas para domínios necessários
- [ ] **Database**: Conexão segura com SSL
- [ ] **Logs**: Configurados para não expor dados sensíveis
- [ ] **Rate Limiting**: Testado e funcionando
- [ ] **Backup**: Configurado e testado

### **Após o Deploy**

- [ ] **Teste de Login**: Verificar autenticação
- [ ] **Teste de Rate Limiting**: Verificar bloqueio
- [ ] **Teste de CORS**: Verificar bloqueio de origens não autorizadas
- [ ] **Teste de HTTPS**: Verificar redirecionamento
- [ ] **Monitoramento**: Verificar logs de segurança
- [ ] **Backup**: Verificar execução automática

---

## 🛠️ FERRAMENTAS DE MONITORAMENTO

### **Logs de Segurança**
```bash
# Verificar logs de autenticação
grep "login" /var/log/cozinhaapp/security.log

# Verificar rate limiting
grep "rate limit" /var/log/cozinhaapp/security.log

# Verificar tentativas de acesso não autorizado
grep "unauthorized" /var/log/cozinhaapp/security.log
```

### **Monitoramento de Performance**
```bash
# Verificar uso de memória
docker stats cozinhaapp-api

# Verificar conexões de banco
netstat -an | grep :1433
```

---

## 🚨 PROCEDIMENTOS DE EMERGÊNCIA

### **Em Caso de Comprometimento**

1. **Imediato**
   ```bash
   # Parar aplicação
   docker stop cozinhaapp-api
   
   # Rotacionar chaves JWT
   export JWT_SECRET_KEY="NOVA_CHAVE_EMERGENCIA"
   
   # Reiniciar com nova chave
   docker start cozinhaapp-api
   ```

2. **Investigar**
   ```bash
   # Verificar logs suspeitos
   tail -f /var/log/cozinhaapp/security.log
   
   # Verificar acessos recentes
   grep "$(date +%Y-%m-%d)" /var/log/cozinhaapp/audit.log
   ```

3. **Notificar**
   - Equipe de segurança
   - Usuários afetados
   - Autoridades (se necessário)

---

## 📊 MÉTRICAS DE SEGURANÇA

### **KPIs Importantes**
- Taxa de sucesso de login: > 95%
- Tentativas de força bruta: < 1%
- Tempo de resposta de autenticação: < 200ms
- Uptime do sistema: > 99.9%

### **Alertas Configurados**
- Mais de 10 tentativas de login falhadas por IP
- Rate limiting ativado mais de 5 vezes por hora
- Erro de autenticação JWT
- Tentativa de acesso a endpoint administrativo

---

## 📞 CONTATOS DE SUPORTE

### **Equipe de Segurança**
- **Email**: security@cozinhaapp.com
- **Telefone**: +55 (11) 99999-9999
- **Horário**: 24/7 para emergências

### **Suporte Técnico**
- **Email**: support@cozinhaapp.com
- **Telefone**: +55 (11) 99999-9998
- **Horário**: Segunda a sexta, 8h às 18h

---

**⚠️ IMPORTANTE**: Nunca commite arquivos .env ou chaves de produção no repositório Git!
