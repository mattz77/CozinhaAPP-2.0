import { useCategorias, usePratos } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, DollarSign } from 'lucide-react';
import { PratoCard } from '@/components/ui/PratoCard';
import { CardapioCarousel } from '@/components/ui/CardapioCarousel';
import { LoadingSpinner, LoadingCard } from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';
import { mockCategorias, mockPratos } from '@/data/mockData';
import { useState, useMemo } from 'react';

const CardapioSection = () => {
  const { data: categoriasApi, isLoading: categoriasLoading, error: categoriasError } = useCategorias();
  const { data: pratosApi, isLoading: pratosLoading, error: pratosError } = usePratos();
  
  // Estado para filtro de categoria
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);

  // Usar dados mockados como fallback se houver erro na API
  const categorias = categoriasError ? mockCategorias : categoriasApi;
  const pratos = pratosError ? mockPratos : pratosApi;

  // Filtrar pratos por categoria usando useMemo para evitar re-renderizações
  const pratosFiltrados = useMemo(() => {
    if (!pratos || !Array.isArray(pratos)) return [];
    if (categoriaSelecionada === null) return pratos.slice(0, 3); // Limitar a 3 pratos para "Todas"
    return pratos.filter(prato => prato.categoriaId === categoriaSelecionada).slice(0, 3); // Limitar a 3 pratos por categoria
  }, [pratos, categoriaSelecionada]);

  // Debug: mostrar erros no console
  if (categoriasError) {
    console.error('Erro ao carregar categorias, usando dados mockados:', categoriasError);
  }
  if (pratosError) {
    console.error('Erro ao carregar pratos, usando dados mockados:', pratosError);
  }

  if (categoriasLoading || pratosLoading) {
    return (
      <section className="py-20 bg-elegant">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
              Nosso Cardápio
            </h2>
            <p className="font-elegant text-xl text-muted-foreground max-w-3xl mx-auto">
              Pratos cuidadosamente preparados com ingredientes frescos e selecionados. 
              Do café da manhã ao jantar, temos opções para todos os gostos.
            </p>
          </div>
          <LoadingCard count={6} />
        </div>
      </section>
    );
  }

  // Mostrar aviso se estiver usando dados mockados
  const usingMockData = categoriasError || pratosError;

  return (
    <section id="cardapio" className="py-20 bg-elegant">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
            Nosso Cardápio
          </h2>
          <p className="font-elegant text-xl text-muted-foreground max-w-3xl mx-auto">
            Pratos cuidadosamente preparados com ingredientes frescos e selecionados. 
            Do café da manhã ao jantar, temos opções para todos os gostos.
          </p>
          {usingMockData && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
              <p className="text-yellow-700 text-sm">
                ⚠️ Exibindo dados de exemplo. Conectando com o servidor...
              </p>
            </div>
          )}
        </div>

        {/* Carrossel de Pratos */}
        <CardapioCarousel
          pratos={pratosFiltrados || []}
          categorias={Array.isArray(categorias) ? categorias : []}
          categoriaSelecionada={categoriaSelecionada}
          onCategoriaChange={setCategoriaSelecionada}
        />
      </div>
    </section>
  );
};

export default CardapioSection;
