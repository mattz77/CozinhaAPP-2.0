# 👥 USUÁRIOS DE TESTE - COZINHAAPP

## 🚀 Modo Desenvolvimento

Estes usuários são criados automaticamente no banco de dados para acelerar o desenvolvimento. **REMOVER EM PRODUÇÃO!**

---

## 👑 USUÁRIOS DISPONÍVEIS

### **1. Administrador**
- **Email**: `admin@cozinhaapp.com`
- **Senha**: `Admin123!@#`
- **Nome**: Administrador
- **Função**: Admin
- **Endereço**: Rua das Flores, 123, São Paulo
- **CEP**: 01234-567
- **Avatar**: 👑

### **2. João Silva**
- **Email**: `joao@teste.com`
- **Senha**: `Joao123!@#`
- **Nome**: João Silva
- **Função**: User
- **Endereço**: Av. Paulista, 1000, São Paulo
- **CEP**: 01310-100
- **Avatar**: 👨‍💼

### **3. Maria Santos**
- **Email**: `maria@teste.com`
- **Senha**: `Maria123!@#`
- **Nome**: Maria Santos
- **Função**: User
- **Endereço**: Rua Augusta, 456, São Paulo
- **CEP**: 01305-000
- **Avatar**: 👩‍💼

### **4. Pedro Costa**
- **Email**: `pedro@teste.com`
- **Senha**: `Pedro123!@#`
- **Nome**: Pedro Costa
- **Função**: Manager
- **Endereço**: Rua Oscar Freire, 789, São Paulo
- **CEP**: 01426-001
- **Avatar**: 👨‍🍳

---

## 🎯 COMO USAR

1. **Acesse a aplicação** sem estar logado
2. **Selecione um usuário** no seletor de teste
3. **Clique em "Entrar"** para fazer login automático
4. **Desenvolva** com dados pré-configurados

---

## ⚠️ IMPORTANTE

- **Apenas para desenvolvimento**
- **Remover componente TestUserSelector em produção**
- **Usuários são criados automaticamente no seed**
- **Senhas são fixas para facilitar testes**

---

## 🔧 CONFIGURAÇÃO

Os usuários são criados automaticamente quando a aplicação inicia através do método `SeedTestUsersAsync` no `Program.cs`.

Para desabilitar em produção, adicione uma verificação de ambiente:

```csharp
if (app.Environment.IsDevelopment())
{
    await SeedTestUsersAsync(userManager);
}
```

---

**Última atualização**: Janeiro 2025
