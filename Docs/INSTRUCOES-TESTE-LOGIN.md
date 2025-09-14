# 🔧 INSTRUÇÕES PARA TESTAR O LOGIN

## ✅ **Correções Aplicadas:**

1. **TestUserSelector**: Agora verifica se o usuário está autenticado e se esconde automaticamente
2. **Logs de Debug**: Adicionados logs detalhados para identificar problemas
3. **AuthContext**: Melhorado com logs para debug

## 🧪 **Como Testar:**

### **Passo 1: Verificar Backend**
1. Execute o backend: `INICIAR-API.cmd` (na pasta CozinhaApp.API)
2. Verifique se está rodando em `http://localhost:5057`

### **Passo 2: Verificar Frontend**
1. Execute o frontend: `INICIAR-FRONTEND.cmd` (na pasta CozinhaApp)
2. Verifique se está rodando em `http://localhost:3000`

### **Passo 3: Testar Login**
1. Abra o navegador em `http://localhost:3000`
2. Você deve ver o `TestUserSelector` (tela de seleção de usuários)
3. Clique em "Entrar como Administrador"
4. **Abra o Console do Navegador** (F12 → Console)

### **Passo 4: Verificar Logs**
No console, você deve ver:
```
🔄 Tentando fazer login com: admin@cozinhaapp.com
🔄 AuthContext: Iniciando login...
✅ AuthContext: Login bem-sucedido, dados recebidos: {token: "...", user: {...}}
💾 AuthContext: Dados salvos no sessionStorage
✅ Login realizado com sucesso!
```

### **Passo 5: Verificar Interface**
Após o login bem-sucedido:
1. O `TestUserSelector` deve desaparecer
2. A navegação deve mostrar:
   - **Nome do usuário**: "Admin" (em vez de "Entrar")
   - **Botão do carrinho**: Visível
   - **Botões**: "Perfil" e "Sair"

## 🐛 **Se Ainda Não Funcionar:**

### **Verificar no Console:**
- Há erros de rede?
- A API está respondendo?
- Os logs de debug aparecem?

### **Verificar Network Tab:**
1. F12 → Network
2. Tentar login novamente
3. Verificar se a requisição para `/api/auth/login` é bem-sucedida

### **Verificar SessionStorage:**
1. F12 → Application → Session Storage
2. Deve ter: `authToken`, `refreshToken`, `user`

## 📞 **Se Precisar de Ajuda:**
Envie os logs do console para análise!
