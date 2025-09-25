-- Script para criar dados de vendas por período para o gráfico
-- Este script cria dados agregados por dia para os últimos 30 dias

PRINT '=== CRIANDO DADOS DE VENDAS POR PERÍODO ==='

-- Criar tabela temporária para dados de vendas por dia
CREATE TABLE #VendasPorDia (
    Data DATE,
    TotalVendas DECIMAL(10,2),
    TotalPedidos INT
);

-- Inserir dados para os últimos 30 dias
DECLARE @DataAtual DATE = GETDATE();
DECLARE @Contador INT = 0;

WHILE @Contador < 30
BEGIN
    DECLARE @DataDia DATE = DATEADD(day, -@Contador, @DataAtual);
    DECLARE @VendasDia DECIMAL(10,2);
    DECLARE @PedidosDia INT;
    
    -- Calcular vendas do dia
    SELECT 
        @VendasDia = ISNULL(SUM(ValorTotal), 0),
        @PedidosDia = ISNULL(COUNT(*), 0)
    FROM Pedidos 
    WHERE UserId = '7207e60f-ea6e-4dad-abc1-143a2234115e'
    AND CAST(DataPedido AS DATE) = @DataDia;
    
    -- Inserir dados do dia (mesmo que seja 0)
    INSERT INTO #VendasPorDia (Data, TotalVendas, TotalPedidos)
    VALUES (@DataDia, ISNULL(@VendasDia, 0), ISNULL(@PedidosDia, 0));
    
    SET @Contador = @Contador + 1;
END;

-- Mostrar dados de vendas por dia
PRINT '=== VENDAS POR DIA (ÚLTIMOS 30 DIAS) ==='
SELECT 
    Data,
    TotalVendas,
    TotalPedidos
FROM #VendasPorDia
ORDER BY Data DESC;

-- Mostrar estatísticas gerais
PRINT '=== ESTATÍSTICAS GERAIS ==='

DECLARE @TotalVendas30Dias DECIMAL(10,2);
DECLARE @TotalPedidos30Dias INT;
DECLARE @MediaVendas DECIMAL(10,2);
DECLARE @DiasComVendas INT;

SELECT 
    @TotalVendas30Dias = SUM(TotalVendas),
    @TotalPedidos30Dias = SUM(TotalPedidos),
    @MediaVendas = AVG(TotalVendas),
    @DiasComVendas = COUNT(CASE WHEN TotalVendas > 0 THEN 1 END)
FROM #VendasPorDia;

PRINT 'Total de Vendas (30 dias): R$ ' + CAST(@TotalVendas30Dias AS NVARCHAR(20));
PRINT 'Total de Pedidos (30 dias): ' + CAST(@TotalPedidos30Dias AS NVARCHAR(10));
PRINT 'Média de Vendas por Dia: R$ ' + CAST(@MediaVendas AS NVARCHAR(20));
PRINT 'Dias com Vendas: ' + CAST(@DiasComVendas AS NVARCHAR(10));

-- Limpar tabela temporária
DROP TABLE #VendasPorDia;

PRINT '=== DADOS DE VENDAS POR PERÍODO CRIADOS COM SUCESSO! ==='
