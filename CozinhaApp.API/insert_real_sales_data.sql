-- Script para inserir dados reais de vendas e pedidos
-- Execute este script para popular o banco com dados de teste

PRINT '=== INICIANDO INSERÇÃO DE DADOS REAIS DE VENDAS ==='

-- Limpar dados existentes (opcional - descomente se necessário)
-- DELETE FROM ItensPedido;
-- DELETE FROM Pedidos;
-- DELETE FROM Carrinhos;

-- 1. Inserir Pedidos com datas variadas (últimos 90 dias)
PRINT 'Inserindo pedidos com datas variadas...'

INSERT INTO Pedidos (Id, UserId, Status, DataPedido, ValorTotal, Observacoes, EnderecoEntrega, TelefoneContato, FormaPagamento, DataAtualizacao)
VALUES 
-- Pedidos de hoje
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', GETDATE(), 45.90, 'Sem cebola', 'Rua das Flores, 123 - Centro', '(11) 99999-1111', 'PIX', GETDATE()),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', GETDATE(), 67.50, 'Bem temperado', 'Av. Paulista, 456 - Bela Vista', '(11) 99999-2222', 'Cartão', GETDATE()),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Preparando', GETDATE(), 89.20, 'Entrega urgente', 'Rua Augusta, 789 - Consolação', '(11) 99999-3333', 'Dinheiro', GETDATE()),

-- Pedidos de ontem
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -1, GETDATE()), 34.80, 'Pouco sal', 'Rua Oscar Freire, 321 - Jardins', '(11) 99999-4444', 'PIX', DATEADD(day, -1, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -1, GETDATE()), 56.70, 'Bem apimentado', 'Rua da Consolação, 654 - Centro', '(11) 99999-5555', 'Cartão', DATEADD(day, -1, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -1, GETDATE()), 78.90, 'Sem pimenta', 'Av. Faria Lima, 987 - Itaim Bibi', '(11) 99999-6666', 'PIX', DATEADD(day, -1, GETDATE())),

-- Pedidos da semana passada
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -7, GETDATE()), 42.30, 'Bem temperado', 'Rua Haddock Lobo, 147 - Cerqueira César', '(11) 99999-7777', 'Cartão', DATEADD(day, -7, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -6, GETDATE()), 65.40, 'Pouco sal', 'Rua Bela Cintra, 258 - Jardins', '(11) 99999-8888', 'PIX', DATEADD(day, -6, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -5, GETDATE()), 91.20, 'Bem apimentado', 'Rua Estados Unidos, 369 - Jardim América', '(11) 99999-9999', 'Cartão', DATEADD(day, -5, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -4, GETDATE()), 38.70, 'Sem cebola', 'Rua Pamplona, 741 - Jardins', '(11) 99999-0000', 'PIX', DATEADD(day, -4, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -3, GETDATE()), 73.50, 'Bem temperado', 'Rua Augusta, 852 - Consolação', '(11) 99999-1111', 'Cartão', DATEADD(day, -3, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -2, GETDATE()), 49.80, 'Pouco sal', 'Rua da Consolação, 963 - Centro', '(11) 99999-2222', 'PIX', DATEADD(day, -2, GETDATE())),

-- Pedidos do mês passado
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -15, GETDATE()), 58.90, 'Bem apimentado', 'Rua Oscar Freire, 159 - Jardins', '(11) 99999-3333', 'Cartão', DATEADD(day, -15, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -20, GETDATE()), 67.30, 'Bem temperado', 'Av. Paulista, 357 - Bela Vista', '(11) 99999-4444', 'PIX', DATEADD(day, -20, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -25, GETDATE()), 82.10, 'Sem pimenta', 'Rua Haddock Lobo, 468 - Cerqueira César', '(11) 99999-5555', 'Cartão', DATEADD(day, -25, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -30, GETDATE()), 45.60, 'Pouco sal', 'Rua Bela Cintra, 579 - Jardins', '(11) 99999-6666', 'PIX', DATEADD(day, -30, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -35, GETDATE()), 76.40, 'Bem apimentado', 'Rua Estados Unidos, 680 - Jardim América', '(11) 99999-7777', 'Cartão', DATEADD(day, -35, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -40, GETDATE()), 53.20, 'Bem temperado', 'Rua Pamplona, 791 - Jardins', '(11) 99999-8888', 'PIX', DATEADD(day, -40, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -45, GETDATE()), 69.80, 'Sem cebola', 'Rua Augusta, 802 - Consolação', '(11) 99999-9999', 'Cartão', DATEADD(day, -45, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -50, GETDATE()), 87.50, 'Bem apimentado', 'Rua da Consolação, 913 - Centro', '(11) 99999-0000', 'PIX', DATEADD(day, -50, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -55, GETDATE()), 41.90, 'Pouco sal', 'Av. Faria Lima, 024 - Itaim Bibi', '(11) 99999-1111', 'Cartão', DATEADD(day, -55, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -60, GETDATE()), 95.30, 'Bem temperado', 'Rua Haddock Lobo, 135 - Cerqueira César', '(11) 99999-2222', 'PIX', DATEADD(day, -60, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -65, GETDATE()), 62.70, 'Sem pimenta', 'Rua Bela Cintra, 246 - Jardins', '(11) 99999-3333', 'Cartão', DATEADD(day, -65, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -70, GETDATE()), 74.60, 'Bem apimentado', 'Rua Estados Unidos, 357 - Jardim América', '(11) 99999-4444', 'PIX', DATEADD(day, -70, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -75, GETDATE()), 48.40, 'Bem temperado', 'Rua Pamplona, 468 - Jardins', '(11) 99999-5555', 'Cartão', DATEADD(day, -75, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -80, GETDATE()), 83.20, 'Pouco sal', 'Rua Augusta, 579 - Consolação', '(11) 99999-6666', 'PIX', DATEADD(day, -80, GETDATE())),
(NEWID(), '7207e60f-ea6e-4dad-abc1-143a2234115e', 'Entregue', DATEADD(day, -85, GETDATE()), 56.90, 'Sem cebola', 'Rua da Consolação, 680 - Centro', '(11) 99999-7777', 'Cartão', DATEADD(day, -85, GETDATE()));

PRINT 'Pedidos inseridos com sucesso!'

-- 2. Inserir ItensPedido para cada pedido
PRINT 'Inserindo itens dos pedidos...'

-- Obter IDs dos pedidos inseridos
DECLARE @PedidoIds TABLE (Id UNIQUEIDENTIFIER, DataPedido DATETIME2);
INSERT INTO @PedidoIds 
SELECT Id, DataPedido FROM Pedidos 
WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e'
ORDER BY DataPedido DESC;

-- Obter IDs dos pratos existentes
DECLARE @PratoIds TABLE (Id INT, Nome NVARCHAR(100), Preco DECIMAL(10,2));
INSERT INTO @PratoIds 
SELECT Id, Nome, Preco FROM Pratos;

-- Inserir itens para cada pedido
DECLARE @PedidoId UNIQUEIDENTIFIER;
DECLARE @PratoId INT;
DECLARE @Quantidade INT;
DECLARE @PrecoUnitario DECIMAL(10,2);
DECLARE @TotalItem DECIMAL(10,2);

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
    SET @TotalItem = @PrecoUnitario * @Quantidade;
    
    INSERT INTO ItensPedido (Id, PedidoId, PratoId, Quantidade, PrecoUnitario, Subtotal)
    VALUES (NEWID(), @PedidoId, @PratoId, @Quantidade, @PrecoUnitario, @TotalItem);
    
    -- Item 2 (70% chance)
    IF RAND() < 0.7
    BEGIN
        SELECT TOP 1 @PratoId = Id, @PrecoUnitario = Preco FROM @PratoIds ORDER BY NEWID();
        SET @Quantidade = CAST(RAND() * 2 + 1 AS INT); -- 1-3 itens
        SET @TotalItem = @PrecoUnitario * @Quantidade;
        
        INSERT INTO ItensPedido (Id, PedidoId, PratoId, Quantidade, PrecoUnitario, Subtotal)
        VALUES (NEWID(), @PedidoId, @PratoId, @Quantidade, @PrecoUnitario, @TotalItem);
    END
    
    -- Item 3 (40% chance)
    IF RAND() < 0.4
    BEGIN
        SELECT TOP 1 @PratoId = Id, @PrecoUnitario = Preco FROM @PratoIds ORDER BY NEWID();
        SET @Quantidade = CAST(RAND() * 2 + 1 AS INT); -- 1-3 itens
        SET @TotalItem = @PrecoUnitario * @Quantidade;
        
        INSERT INTO ItensPedido (Id, PedidoId, PratoId, Quantidade, PrecoUnitario, Subtotal)
        VALUES (NEWID(), @PedidoId, @PratoId, @Quantidade, @PrecoUnitario, @TotalItem);
    END
    
    -- Item 4 (20% chance)
    IF RAND() < 0.2
    BEGIN
        SELECT TOP 1 @PratoId = Id, @PrecoUnitario = Preco FROM @PratoIds ORDER BY NEWID();
        SET @Quantidade = CAST(RAND() * 2 + 1 AS INT); -- 1-3 itens
        SET @TotalItem = @PrecoUnitario * @Quantidade;
        
        INSERT INTO ItensPedido (Id, PedidoId, PratoId, Quantidade, PrecoUnitario, Subtotal)
        VALUES (NEWID(), @PedidoId, @PratoId, @Quantidade, @PrecoUnitario, @TotalItem);
    END
    
    FETCH NEXT FROM pedido_cursor INTO @PedidoId;
END

CLOSE pedido_cursor;
DEALLOCATE pedido_cursor;

PRINT 'Itens dos pedidos inseridos com sucesso!'

-- 3. Atualizar valores totais dos pedidos baseado nos itens
PRINT 'Atualizando valores totais dos pedidos...'

UPDATE p 
SET ValorTotal = (
    SELECT SUM(ip.Subtotal) 
    FROM ItensPedido ip 
    WHERE ip.PedidoId = p.Id
)
FROM Pedidos p
WHERE p.UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e';

PRINT 'Valores totais atualizados!'

-- 4. Mostrar estatísticas finais
PRINT '=== ESTATÍSTICAS FINAIS ==='

DECLARE @TotalPedidos INT;
DECLARE @TotalItens INT;
DECLARE @ValorTotalVendas DECIMAL(10,2);
DECLARE @TicketMedio DECIMAL(10,2);

SELECT @TotalPedidos = COUNT(*) FROM Pedidos WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e';
SELECT @TotalItens = COUNT(*) FROM ItensPedido ip 
INNER JOIN Pedidos p ON ip.PedidoId = p.Id 
WHERE p.UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e';
SELECT @ValorTotalVendas = SUM(ValorTotal) FROM Pedidos WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e';
SET @TicketMedio = @ValorTotalVendas / @TotalPedidos;

PRINT 'Total de Pedidos: ' + CAST(@TotalPedidos AS NVARCHAR(10));
PRINT 'Total de Itens: ' + CAST(@TotalItens AS NVARCHAR(10));
PRINT 'Valor Total de Vendas: R$ ' + CAST(@ValorTotalVendas AS NVARCHAR(20));
PRINT 'Ticket Médio: R$ ' + CAST(@TicketMedio AS NVARCHAR(20));

-- 5. Mostrar top 5 pratos mais vendidos
PRINT '=== TOP 5 PRATOS MAIS VENDIDOS ==='

SELECT TOP 5 
    pr.Nome,
    pr.Preco,
    SUM(ip.Quantidade) as TotalVendido,
    SUM(ip.Subtotal) as ValorTotalVendido
FROM ItensPedido ip
INNER JOIN Pedidos p ON ip.PedidoId = p.Id
INNER JOIN Pratos pr ON ip.PratoId = pr.Id
WHERE p.UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e'
GROUP BY pr.Id, pr.Nome, pr.Preco
ORDER BY TotalVendido DESC;

PRINT '=== DADOS INSERIDOS COM SUCESSO! ==='
PRINT 'Agora você pode acessar a página de Relatórios para ver os dados!'
