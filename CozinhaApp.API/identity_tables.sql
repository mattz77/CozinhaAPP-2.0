IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Categorias] (
    [Id] int NOT NULL IDENTITY,
    [Nome] nvarchar(100) NOT NULL,
    [Descricao] nvarchar(500) NULL,
    [Ativa] bit NOT NULL,
    [DataCriacao] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Categorias] PRIMARY KEY ([Id])
);

CREATE TABLE [Clientes] (
    [Id] int NOT NULL IDENTITY,
    [Nome] nvarchar(100) NOT NULL,
    [Email] nvarchar(200) NOT NULL,
    [Telefone] nvarchar(20) NOT NULL,
    [Endereco] nvarchar(200) NULL,
    [Cidade] nvarchar(100) NULL,
    [Cep] nvarchar(10) NULL,
    [DataCriacao] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Clientes] PRIMARY KEY ([Id])
);

CREATE TABLE [Pratos] (
    [Id] int NOT NULL IDENTITY,
    [Nome] nvarchar(200) NOT NULL,
    [Descricao] nvarchar(1000) NULL,
    [Preco] decimal(10,2) NOT NULL,
    [ImagemUrl] nvarchar(500) NULL,
    [Disponivel] bit NOT NULL,
    [TempoPreparo] int NOT NULL,
    [Tipo] nvarchar(50) NULL,
    [DataCriacao] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [CategoriaId] int NOT NULL,
    CONSTRAINT [PK_Pratos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Pratos_Categorias_CategoriaId] FOREIGN KEY ([CategoriaId]) REFERENCES [Categorias] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Pedidos] (
    [Id] int NOT NULL IDENTITY,
    [NumeroPedido] nvarchar(50) NOT NULL,
    [DataPedido] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [DataEntrega] datetime2 NULL,
    [ValorTotal] decimal(10,2) NOT NULL,
    [Status] nvarchar(20) NOT NULL DEFAULT N'Pendente',
    [Observacoes] nvarchar(500) NULL,
    [EnderecoEntrega] nvarchar(200) NULL,
    [FormaPagamento] nvarchar(20) NULL,
    [ClienteId] int NOT NULL,
    CONSTRAINT [PK_Pedidos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Pedidos_Clientes_ClienteId] FOREIGN KEY ([ClienteId]) REFERENCES [Clientes] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [ItensPedido] (
    [Id] int NOT NULL IDENTITY,
    [Quantidade] int NOT NULL,
    [PrecoUnitario] decimal(10,2) NOT NULL,
    [Observacoes] nvarchar(200) NULL,
    [PedidoId] int NOT NULL,
    [PratoId] int NOT NULL,
    CONSTRAINT [PK_ItensPedido] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ItensPedido_Pedidos_PedidoId] FOREIGN KEY ([PedidoId]) REFERENCES [Pedidos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ItensPedido_Pratos_PratoId] FOREIGN KEY ([PratoId]) REFERENCES [Pratos] ([Id]) ON DELETE NO ACTION
);

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Ativa', N'DataCriacao', N'Descricao', N'Nome') AND [object_id] = OBJECT_ID(N'[Categorias]'))
    SET IDENTITY_INSERT [Categorias] ON;
INSERT INTO [Categorias] ([Id], [Ativa], [DataCriacao], [Descricao], [Nome])
VALUES (1, CAST(1 AS bit), '2025-09-08T00:41:10.7530670Z', N'Aperitivos e entradas', N'Entradas'),
(2, CAST(1 AS bit), '2025-09-08T00:41:10.7531331Z', N'Pratos principais e refeições completas', N'Pratos Principais'),
(3, CAST(1 AS bit), '2025-09-08T00:41:10.7531334Z', N'Doces e sobremesas', N'Sobremesas'),
(4, CAST(1 AS bit), '2025-09-08T00:41:10.7531335Z', N'Bebidas e drinks', N'Bebidas');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Ativa', N'DataCriacao', N'Descricao', N'Nome') AND [object_id] = OBJECT_ID(N'[Categorias]'))
    SET IDENTITY_INSERT [Categorias] OFF;

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CategoriaId', N'DataCriacao', N'Descricao', N'Disponivel', N'ImagemUrl', N'Nome', N'Preco', N'TempoPreparo', N'Tipo') AND [object_id] = OBJECT_ID(N'[Pratos]'))
    SET IDENTITY_INSERT [Pratos] ON;
INSERT INTO [Pratos] ([Id], [CategoriaId], [DataCriacao], [Descricao], [Disponivel], [ImagemUrl], [Nome], [Preco], [TempoPreparo], [Tipo])
VALUES (1, 1, '2025-09-08T00:41:10.7535870Z', N'Pão italiano grelhado com tomate, manjericão e azeite', CAST(1 AS bit), NULL, N'Bruschetta Italiana', 18.9, 15, N'Entrada'),
(2, 2, '2025-09-08T00:41:10.7537280Z', N'Arroz cremoso com cogumelos porcini e parmesão', CAST(1 AS bit), NULL, N'Risotto de Cogumelos', 45.9, 30, N'Prato Principal'),
(3, 3, '2025-09-08T00:41:10.7537284Z', N'Sobremesa italiana com café, mascarpone e cacau', CAST(1 AS bit), NULL, N'Tiramisu', 22.9, 20, N'Sobremesa');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'CategoriaId', N'DataCriacao', N'Descricao', N'Disponivel', N'ImagemUrl', N'Nome', N'Preco', N'TempoPreparo', N'Tipo') AND [object_id] = OBJECT_ID(N'[Pratos]'))
    SET IDENTITY_INSERT [Pratos] OFF;

CREATE UNIQUE INDEX [IX_Categorias_Nome] ON [Categorias] ([Nome]);

CREATE UNIQUE INDEX [IX_Clientes_Email] ON [Clientes] ([Email]);

CREATE INDEX [IX_Clientes_Telefone] ON [Clientes] ([Telefone]);

CREATE INDEX [IX_ItensPedido_PedidoId] ON [ItensPedido] ([PedidoId]);

CREATE INDEX [IX_ItensPedido_PratoId] ON [ItensPedido] ([PratoId]);

CREATE INDEX [IX_Pedidos_ClienteId] ON [Pedidos] ([ClienteId]);

CREATE INDEX [IX_Pedidos_DataPedido] ON [Pedidos] ([DataPedido]);

CREATE UNIQUE INDEX [IX_Pedidos_NumeroPedido] ON [Pedidos] ([NumeroPedido]);

CREATE INDEX [IX_Pedidos_Status] ON [Pedidos] ([Status]);

CREATE INDEX [IX_Pratos_CategoriaId] ON [Pratos] ([CategoriaId]);

CREATE INDEX [IX_Pratos_Disponivel] ON [Pratos] ([Disponivel]);

CREATE INDEX [IX_Pratos_Nome] ON [Pratos] ([Nome]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250908004111_InitialCreate', N'9.0.8');

UPDATE [Categorias] SET [DataCriacao] = '2024-01-01T00:00:00.0000000'
WHERE [Id] = 1;
SELECT @@ROWCOUNT;


UPDATE [Categorias] SET [DataCriacao] = '2024-01-01T00:00:00.0000000'
WHERE [Id] = 2;
SELECT @@ROWCOUNT;


UPDATE [Categorias] SET [DataCriacao] = '2024-01-01T00:00:00.0000000'
WHERE [Id] = 3;
SELECT @@ROWCOUNT;


UPDATE [Categorias] SET [DataCriacao] = '2024-01-01T00:00:00.0000000'
WHERE [Id] = 4;
SELECT @@ROWCOUNT;


UPDATE [Pratos] SET [DataCriacao] = '2024-01-01T00:00:00.0000000'
WHERE [Id] = 1;
SELECT @@ROWCOUNT;


UPDATE [Pratos] SET [DataCriacao] = '2024-01-01T00:00:00.0000000'
WHERE [Id] = 2;
SELECT @@ROWCOUNT;


UPDATE [Pratos] SET [DataCriacao] = '2024-01-01T00:00:00.0000000'
WHERE [Id] = 3;
SELECT @@ROWCOUNT;


INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250908004338_InitialCreateV2', N'9.0.8');

ALTER TABLE [Pedidos] ADD [ApplicationUserId] nvarchar(450) NULL;

ALTER TABLE [Clientes] ADD [UserId] nvarchar(450) NULL;

CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [NomeCompleto] nvarchar(100) NOT NULL,
    [Endereco] nvarchar(200) NULL,
    [Cidade] nvarchar(100) NULL,
    [Cep] nvarchar(10) NULL,
    [DataNascimento] datetime2 NOT NULL,
    [DataCriacao] datetime2 NOT NULL,
    [UltimoLogin] datetime2 NULL,
    [Ativo] bit NOT NULL,
    [AvatarUrl] nvarchar(500) NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Carrinhos] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [DataCriacao] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    [DataAtualizacao] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_Carrinhos] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Carrinhos_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ItensCarrinho] (
    [Id] int NOT NULL IDENTITY,
    [CarrinhoId] int NOT NULL,
    [PratoId] int NOT NULL,
    [Quantidade] int NOT NULL,
    [PrecoUnitario] decimal(10,2) NOT NULL,
    [Observacoes] nvarchar(200) NULL,
    [DataAdicao] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_ItensCarrinho] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ItensCarrinho_Carrinhos_CarrinhoId] FOREIGN KEY ([CarrinhoId]) REFERENCES [Carrinhos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ItensCarrinho_Pratos_PratoId] FOREIGN KEY ([PratoId]) REFERENCES [Pratos] ([Id]) ON DELETE NO ACTION
);

CREATE INDEX [IX_Pedidos_ApplicationUserId] ON [Pedidos] ([ApplicationUserId]);

CREATE INDEX [IX_Clientes_UserId] ON [Clientes] ([UserId]);

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

CREATE INDEX [IX_Carrinhos_DataCriacao] ON [Carrinhos] ([DataCriacao]);

CREATE UNIQUE INDEX [IX_Carrinhos_UserId] ON [Carrinhos] ([UserId]);

CREATE INDEX [IX_ItensCarrinho_CarrinhoId] ON [ItensCarrinho] ([CarrinhoId]);

CREATE UNIQUE INDEX [IX_ItensCarrinho_CarrinhoId_PratoId] ON [ItensCarrinho] ([CarrinhoId], [PratoId]);

CREATE INDEX [IX_ItensCarrinho_DataAdicao] ON [ItensCarrinho] ([DataAdicao]);

CREATE INDEX [IX_ItensCarrinho_PratoId] ON [ItensCarrinho] ([PratoId]);

ALTER TABLE [Clientes] ADD CONSTRAINT [FK_Clientes_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL;

ALTER TABLE [Pedidos] ADD CONSTRAINT [FK_Pedidos_AspNetUsers_ApplicationUserId] FOREIGN KEY ([ApplicationUserId]) REFERENCES [AspNetUsers] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250914202453_AddCarrinhoTables', N'9.0.8');

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250914203102_AddIdentityTables', N'9.0.8');

COMMIT;
GO

