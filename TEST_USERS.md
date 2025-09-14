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
- **Telefone**: (11) 99999-0001
- **Endereço**: Rua das Flores, 123, São Paulo
- **CEP**: 01234-567
- **Avatar**: 👑

### **2. João Silva**
- **Email**: `joao@teste.com`
- **Senha**: `Joao123!@#`
- **Nome**: João Silva
- **Função**: User
- **Telefone**: (11) 99999-0002
- **Endereço**: Av. Paulista, 1000, São Paulo
- **CEP**: 01310-100
- **Avatar**: 👨‍💼

### **3. Maria Santos**
- **Email**: `maria@teste.com`
- **Senha**: `Maria123!@#`
- **Nome**: Maria Santos
- **Função**: User
- **Telefone**: (11) 99999-0003
- **Endereço**: Rua Augusta, 456, São Paulo
- **CEP**: 01305-000
- **Avatar**: 👩‍💼

### **4. Pedro Costa**
- **Email**: `pedro@teste.com`
- **Senha**: `Pedro123!@#`
- **Nome**: Pedro Costa
- **Função**: Manager
- **Telefone**: (11) 99999-0004
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

## 🗄️ ESTRUTURA DE DADOS

Os usuários são criados em **duas tabelas**:

### **1. AspNetUsers** (Autenticação)
- Contém dados de login e autenticação
- Campos: Id, Email, PasswordHash, NomeCompleto, etc.
- Usado pelo ASP.NET Core Identity

### **2. Clientes** (Dados do Cliente)
- Contém dados específicos do cliente
- Campos: Id, Nome, Email, Telefone, Endereco, Cidade, Cep, UserId
- Relacionado com AspNetUsers através do campo `UserId`

### **Relacionamento**
- `Clientes.UserId` → `AspNetUsers.Id`
- Um usuário pode ter apenas um cliente associado
- Login busca dados de ambas as tabelas

## 🔧 CONFIGURAÇÃO

Os usuários são criados automaticamente quando a aplicação inicia através do método `SeedTestUsersAsync` no `Program.cs`.

Para desabilitar em produção, adicione uma verificação de ambiente:

```csharp
if (app.Environment.IsDevelopment())
{
    await SeedTestUsersAsync(userManager, context);
}
```

---

**Última atualização**: Janeiro 2025
