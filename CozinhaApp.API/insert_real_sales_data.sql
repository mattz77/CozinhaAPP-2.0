-- Script para inserir dados reais de vendas e pedidos
-- Execute este script para popular o banco com dados de teste

PRINT '=== INICIANDO INSERÇÃO DE DADOS REAIS DE VENDAS ==='

-- Limpar dados existentes (opcional - descomente se necessário)
-- DELETE FROM ItensPedido;
-- DELETE FROM Pedidos;
-- DELETE FROM Carrinhos;

-- 1. Primeiro, inserir clientes se não existirem
PRINT 'Verificando e inserindo clientes...'

-- Inserir cliente padrão se não existir
IF NOT EXISTS (SELECT 1 FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e')
BEGIN
    INSERT INTO Clientes (Nome, Email, Telefone, Endereco, Cidade, Cep, DataCriacao, UserId)
    VALUES 
    ('Cliente Administrador', 'admin@cozinhaapp.com', '(11) 99999-0000', 'Rua das Flores, 123 - Centro', 'São Paulo', '01234-567', GETDATE(), '7207e60f-ea6e-4dad-abc1-143a2234115e'),
    ('João Silva', 'joao@email.com', '(11) 99999-1111', 'Av. Paulista, 456 - Bela Vista', 'São Paulo', '01310-100', GETDATE(), '7207e60f-ea6e-4dad-abc1-143a2234115e'),
    ('Maria Santos', 'maria@email.com', '(11) 99999-2222', 'Rua Augusta, 789 - Consolação', 'São Paulo', '01305-000', GETDATE(), '7207e60f-ea6e-4dad-abc1-143a2234115e'),
    ('Pedro Oliveira', 'pedro@email.com', '(11) 99999-3333', 'Rua Oscar Freire, 321 - Jardins', 'São Paulo', '01423-000', GETDATE(), '7207e60f-ea6e-4dad-abc1-143a2234115e'),
    ('Ana Costa', 'ana@email.com', '(11) 99999-4444', 'Rua da Consolação, 654 - Centro', 'São Paulo', '01302-000', GETDATE(), '7207e60f-ea6e-4dad-abc1-143a2234115e');
END

-- Obter IDs dos clientes
DECLARE @ClienteId1 INT, @ClienteId2 INT, @ClienteId3 INT, @ClienteId4 INT, @ClienteId5 INT;
SELECT @ClienteId1 = Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e' AND Nome = 'Cliente Administrador';
SELECT @ClienteId2 = Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e' AND Nome = 'João Silva';
SELECT @ClienteId3 = Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e' AND Nome = 'Maria Santos';
SELECT @ClienteId4 = Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e' AND Nome = 'Pedro Oliveira';
SELECT @ClienteId5 = Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e' AND Nome = 'Ana Costa';

-- 2. Inserir Pedidos com datas variadas (últimos 90 dias)
PRINT 'Inserindo pedidos com datas variadas...'

INSERT INTO Pedidos (NumeroPedido, DataPedido, ValorTotal, Status, Observacoes, EnderecoEntrega, FormaPagamento, ClienteId)
VALUES 
-- Pedidos de hoje
('PED-001', GETDATE(), 45.90, 'Entregue', 'Sem cebola', 'Rua das Flores, 123 - Centro', 'PIX', @ClienteId1),
('PED-002', GETDATE(), 67.50, 'Entregue', 'Bem temperado', 'Av. Paulista, 456 - Bela Vista', 'Cartão', @ClienteId2),
('PED-003', GETDATE(), 89.20, 'Preparando', 'Entrega urgente', 'Rua Augusta, 789 - Consolação', 'Dinheiro', @ClienteId3),

-- Pedidos de ontem
('PED-004', DATEADD(day, -1, GETDATE()), 34.80, 'Entregue', 'Pouco sal', 'Rua Oscar Freire, 321 - Jardins', 'PIX', @ClienteId4),
('PED-005', DATEADD(day, -1, GETDATE()), 56.70, 'Entregue', 'Bem apimentado', 'Rua da Consolação, 654 - Centro', 'Cartão', @ClienteId5),
('PED-006', DATEADD(day, -1, GETDATE()), 78.90, 'Entregue', 'Sem pimenta', 'Av. Faria Lima, 987 - Itaim Bibi', 'PIX', @ClienteId1),

-- Pedidos da semana passada
('PED-007', DATEADD(day, -7, GETDATE()), 42.30, 'Entregue', 'Bem temperado', 'Rua Haddock Lobo, 147 - Cerqueira César', 'Cartão', @ClienteId2),
('PED-008', DATEADD(day, -6, GETDATE()), 65.40, 'Entregue', 'Pouco sal', 'Rua Bela Cintra, 258 - Jardins', 'PIX', @ClienteId3),
('PED-009', DATEADD(day, -5, GETDATE()), 91.20, 'Entregue', 'Bem apimentado', 'Rua Estados Unidos, 369 - Jardim América', 'Cartão', @ClienteId4),
('PED-010', DATEADD(day, -4, GETDATE()), 38.70, 'Entregue', 'Sem cebola', 'Rua Pamplona, 741 - Jardins', 'PIX', @ClienteId5),
('PED-011', DATEADD(day, -3, GETDATE()), 73.50, 'Entregue', 'Bem temperado', 'Rua Augusta, 852 - Consolação', 'Cartão', @ClienteId1),
('PED-012', DATEADD(day, -2, GETDATE()), 49.80, 'Entregue', 'Pouco sal', 'Rua da Consolação, 963 - Centro', 'PIX', @ClienteId2),

-- Pedidos do mês passado
('PED-013', DATEADD(day, -15, GETDATE()), 58.90, 'Entregue', 'Bem apimentado', 'Rua Oscar Freire, 159 - Jardins', 'Cartão', @ClienteId3),
('PED-014', DATEADD(day, -20, GETDATE()), 67.30, 'Entregue', 'Bem temperado', 'Av. Paulista, 357 - Bela Vista', 'PIX', @ClienteId4),
('PED-015', DATEADD(day, -25, GETDATE()), 82.10, 'Entregue', 'Sem pimenta', 'Rua Haddock Lobo, 468 - Cerqueira César', 'Cartão', @ClienteId5),
('PED-016', DATEADD(day, -30, GETDATE()), 45.60, 'Entregue', 'Pouco sal', 'Rua Bela Cintra, 579 - Jardins', 'PIX', @ClienteId1),
('PED-017', DATEADD(day, -35, GETDATE()), 76.40, 'Entregue', 'Bem apimentado', 'Rua Estados Unidos, 680 - Jardim América', 'Cartão', @ClienteId2),
('PED-018', DATEADD(day, -40, GETDATE()), 53.20, 'Entregue', 'Bem temperado', 'Rua Pamplona, 791 - Jardins', 'PIX', @ClienteId3),
('PED-019', DATEADD(day, -45, GETDATE()), 69.80, 'Entregue', 'Sem cebola', 'Rua Augusta, 802 - Consolação', 'Cartão', @ClienteId4),
('PED-020', DATEADD(day, -50, GETDATE()), 87.50, 'Entregue', 'Bem apimentado', 'Rua da Consolação, 913 - Centro', 'PIX', @ClienteId5),
('PED-021', DATEADD(day, -55, GETDATE()), 41.90, 'Entregue', 'Pouco sal', 'Av. Faria Lima, 024 - Itaim Bibi', 'Cartão', @ClienteId1),
('PED-022', DATEADD(day, -60, GETDATE()), 95.30, 'Entregue', 'Bem temperado', 'Rua Haddock Lobo, 135 - Cerqueira César', 'PIX', @ClienteId2),
('PED-023', DATEADD(day, -65, GETDATE()), 62.70, 'Entregue', 'Sem pimenta', 'Rua Bela Cintra, 246 - Jardins', 'Cartão', @ClienteId3),
('PED-024', DATEADD(day, -70, GETDATE()), 74.60, 'Entregue', 'Bem apimentado', 'Rua Estados Unidos, 357 - Jardim América', 'PIX', @ClienteId4),
('PED-025', DATEADD(day, -75, GETDATE()), 48.40, 'Entregue', 'Bem temperado', 'Rua Pamplona, 468 - Jardins', 'Cartão', @ClienteId5),
('PED-026', DATEADD(day, -80, GETDATE()), 83.20, 'Entregue', 'Pouco sal', 'Rua Augusta, 579 - Consolação', 'PIX', @ClienteId1),
('PED-027', DATEADD(day, -85, GETDATE()), 56.90, 'Entregue', 'Sem cebola', 'Rua da Consolação, 680 - Centro', 'Cartão', @ClienteId2);

PRINT 'Pedidos inseridos com sucesso!'

-- 3. Inserir ItensPedido para cada pedido
PRINT 'Inserindo itens dos pedidos...'

-- Obter IDs dos pedidos inseridos
DECLARE @PedidoIds TABLE (Id INT, DataPedido DATETIME2);
INSERT INTO @PedidoIds 
SELECT Id, DataPedido FROM Pedidos 
WHERE ClienteId IN (SELECT Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e')
ORDER BY DataPedido DESC;

-- Obter IDs dos pratos existentes
DECLARE @PratoIds TABLE (Id INT, Nome NVARCHAR(100), Preco DECIMAL(10,2));
INSERT INTO @PratoIds 
SELECT Id, Nome, Preco FROM Pratos;

-- Inserir itens para cada pedido
DECLARE @PedidoId INT;
DECLARE @PratoId INT;
DECLARE @Quantidade INT;
DECLARE @PrecoUnitario DECIMAL(10,2);

DECLARE pedido_cursor CURSOR FOR 
SELECT Id FROM @PedidoIds;

OPEN pedido_cursor;
FETCH NEXT FROM pedido_cursor INTO @PedidoId;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Inserir 1-4 itens por pedido
    SET @Quantidade = CAST(RAND() * 3 + 1 AS INT); -- 1-4 itens
    
    -- Item 1 (sempre presente)
    SELECT TOP 1 @PratoId = Id, @PrecoUnitario = Preco FROM @PratoIds ORDER BY NEWID();
    
    INSERT INTO ItensPedido (PedidoId, PratoId, Quantidade, PrecoUnitario)
    VALUES (@PedidoId, @PratoId, @Quantidade, @PrecoUnitario);
    
    -- Item 2 (70% chance)
    IF RAND() < 0.7
    BEGIN
        SELECT TOP 1 @PratoId = Id, @PrecoUnitario = Preco FROM @PratoIds ORDER BY NEWID();
        SET @Quantidade = CAST(RAND() * 2 + 1 AS INT); -- 1-3 itens
        
        INSERT INTO ItensPedido (PedidoId, PratoId, Quantidade, PrecoUnitario)
        VALUES (@PedidoId, @PratoId, @Quantidade, @PrecoUnitario);
    END
    
    -- Item 3 (40% chance)
    IF RAND() < 0.4
    BEGIN
        SELECT TOP 1 @PratoId = Id, @PrecoUnitario = Preco FROM @PratoIds ORDER BY NEWID();
        SET @Quantidade = CAST(RAND() * 2 + 1 AS INT); -- 1-3 itens
        
        INSERT INTO ItensPedido (PedidoId, PratoId, Quantidade, PrecoUnitario)
        VALUES (@PedidoId, @PratoId, @Quantidade, @PrecoUnitario);
    END
    
    -- Item 4 (20% chance)
    IF RAND() < 0.2
    BEGIN
        SELECT TOP 1 @PratoId = Id, @PrecoUnitario = Preco FROM @PratoIds ORDER BY NEWID();
        SET @Quantidade = CAST(RAND() * 2 + 1 AS INT); -- 1-3 itens
        
        INSERT INTO ItensPedido (PedidoId, PratoId, Quantidade, PrecoUnitario)
        VALUES (@PedidoId, @PratoId, @Quantidade, @PrecoUnitario);
    END
    
    FETCH NEXT FROM pedido_cursor INTO @PedidoId;
END

CLOSE pedido_cursor;
DEALLOCATE pedido_cursor;

PRINT 'Itens dos pedidos inseridos com sucesso!'

-- 4. Atualizar valores totais dos pedidos baseado nos itens
PRINT 'Atualizando valores totais dos pedidos...'

UPDATE p 
SET ValorTotal = (
    SELECT SUM(ip.Quantidade * ip.PrecoUnitario) 
    FROM ItensPedido ip 
    WHERE ip.PedidoId = p.Id
)
FROM Pedidos p
WHERE p.ClienteId IN (SELECT Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e');

PRINT 'Valores totais atualizados!'

-- 5. Mostrar estatísticas finais
PRINT '=== ESTATÍSTICAS FINAIS ==='

DECLARE @TotalPedidos INT;
DECLARE @TotalItens INT;
DECLARE @ValorTotalVendas DECIMAL(10,2);
DECLARE @TicketMedio DECIMAL(10,2);

SELECT @TotalPedidos = COUNT(*) FROM Pedidos p
WHERE p.ClienteId IN (SELECT Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e');

SELECT @TotalItens = COUNT(*) FROM ItensPedido ip 
INNER JOIN Pedidos p ON ip.PedidoId = p.Id 
WHERE p.ClienteId IN (SELECT Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e');

SELECT @ValorTotalVendas = SUM(ValorTotal) FROM Pedidos p
WHERE p.ClienteId IN (SELECT Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e');

SET @TicketMedio = @ValorTotalVendas / @TotalPedidos;

PRINT 'Total de Pedidos: ' + CAST(@TotalPedidos AS NVARCHAR(10));
PRINT 'Total de Itens: ' + CAST(@TotalItens AS NVARCHAR(10));
PRINT 'Valor Total de Vendas: R$ ' + CAST(@ValorTotalVendas AS NVARCHAR(20));
PRINT 'Ticket Médio: R$ ' + CAST(@TicketMedio AS NVARCHAR(20));

-- 6. Mostrar top 5 pratos mais vendidos
PRINT '=== TOP 5 PRATOS MAIS VENDIDOS ==='

SELECT TOP 5 
    pr.Nome,
    pr.Preco,
    SUM(ip.Quantidade) as TotalVendido,
    SUM(ip.Quantidade * ip.PrecoUnitario) as ValorTotalVendido
FROM ItensPedido ip
INNER JOIN Pedidos p ON ip.PedidoId = p.Id
INNER JOIN Pratos pr ON ip.PratoId = pr.Id
WHERE p.ClienteId IN (SELECT Id FROM Clientes WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e')
GROUP BY pr.Id, pr.Nome, pr.Preco
ORDER BY TotalVendido DESC;

PRINT '=== DADOS INSERIDOS COM SUCESSO! ==='
PRINT 'Agora você pode acessar a página de Relatórios para ver os dados!'
