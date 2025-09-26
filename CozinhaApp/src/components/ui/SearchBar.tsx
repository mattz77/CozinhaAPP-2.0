import { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchSuggestions, useSearchFilters, useSearchPratos } from '@/hooks/useApi';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onResults?: (results: any) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ onResults, placeholder = "Buscar pratos...", className }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoriaId: undefined as number | undefined,
    precoMin: undefined as number | undefined,
    precoMax: undefined as number | undefined,
    tipo: undefined as string | undefined,
    sortBy: 'nome' as string,
    sortOrder: 'asc' as string,
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks para buscar dados
  const { data: suggestions = { Pratos: [], Categorias: [], Tipos: [] }, isLoading: suggestionsLoading } = useSearchSuggestions(
    query.length >= 2 ? query : undefined
  );
  
  const { data: filtersData, isLoading: filtersLoading } = useSearchFilters();
  
  const { data: searchResults, isLoading: searchLoading } = useSearchPratos({
    q: query || undefined,
    categoriaId: filters.categoriaId,
    precoMin: filters.precoMin,
    precoMax: filters.precoMax,
    tipo: filters.tipo,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    pageSize: 20,
  });

  // Fechar sugestões quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notificar resultados
  useEffect(() => {
    if (searchResults && onResults) {
      onResults(searchResults);
    }
  }, [searchResults, onResults]);

  const handleSearch = () => {
    setShowSuggestions(false);
    setShowFilters(false);
    // A busca já é executada automaticamente pelo hook useSearchPratos
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch();
  };

  const clearFilters = () => {
    setFilters({
      categoriaId: undefined,
      precoMin: undefined,
      precoMax: undefined,
      tipo: undefined,
      sortBy: 'nome',
      sortOrder: 'asc',
    });
  };

  const hasActiveFilters = filters.categoriaId || filters.precoMin || filters.precoMax || filters.tipo;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Barra de Busca Principal */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              } else if (e.key === 'Escape') {
                setShowSuggestions(false);
              }
            }}
            className="pl-10 pr-20 h-12 text-base"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setShowSuggestions(false);
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-8 px-2 ${hasActiveFilters ? 'bg-primary/10 text-primary' : ''}`}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              className="h-8 px-2"
            >
              <SortAsc className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sugestões */}
        <AnimatePresence>
          {showSuggestions && (query.length >= 2 || suggestions.Pratos.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            >
              {suggestionsLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Carregando sugestões...
                </div>
              ) : (
                <div className="p-2">
                  {suggestions.Pratos.length > 0 && (
                    <div className="mb-2">
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Pratos
                      </div>
                      {suggestions.Pratos.slice(0, 5).map((prato, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(prato)}
                          className="w-full text-left px-2 py-2 hover:bg-muted rounded-md text-sm"
                        >
                          {prato}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {suggestions.Categorias.length > 0 && (
                    <div className="mb-2">
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Categorias
                      </div>
                      {suggestions.Categorias.slice(0, 3).map((categoria, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(categoria)}
                          className="w-full text-left px-2 py-2 hover:bg-muted rounded-md text-sm"
                        >
                          {categoria}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {suggestions.Tipos.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Tipos
                      </div>
                      {suggestions.Tipos.slice(0, 3).map((tipo, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(tipo)}
                          className="w-full text-left px-2 py-2 hover:bg-muted rounded-md text-sm"
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-40"
            >
              <Card className="border border-border shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Filtros de Busca</h3>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Limpar Filtros
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Categoria */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Categoria</label>
                        <select
                          value={filters.categoriaId || ''}
                          onChange={(e) => setFilters({ ...filters, categoriaId: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full p-2 border border-border rounded-md"
                        >
                          <option value="">Todas as categorias</option>
                          {filtersData?.Categorias?.map((categoria: any) => (
                            <option key={categoria.Id} value={categoria.Id}>
                              {categoria.Nome} ({categoria.Count})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tipo */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Tipo</label>
                        <select
                          value={filters.tipo || ''}
                          onChange={(e) => setFilters({ ...filters, tipo: e.target.value || undefined })}
                          className="w-full p-2 border border-border rounded-md"
                        >
                          <option value="">Todos os tipos</option>
                          {filtersData?.Tipos?.map((tipo: any) => (
                            <option key={tipo.Nome} value={tipo.Nome}>
                              {tipo.Nome} ({tipo.Count})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Preço Mínimo */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Preço Mínimo</label>
                        <Input
                          type="number"
                          placeholder="R$ 0,00"
                          value={filters.precoMin || ''}
                          onChange={(e) => setFilters({ ...filters, precoMin: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full"
                        />
                      </div>

                      {/* Preço Máximo */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Preço Máximo</label>
                        <Input
                          type="number"
                          placeholder="R$ 100,00"
                          value={filters.precoMax || ''}
                          onChange={(e) => setFilters({ ...filters, precoMax: e.target.value ? Number(e.target.value) : undefined })}
                          className="w-full"
                        />
                      </div>

                      {/* Ordenação */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                        <select
                          value={`${filters.sortBy}-${filters.sortOrder}`}
                          onChange={(e) => {
                            const [sortBy, sortOrder] = e.target.value.split('-');
                            setFilters({ ...filters, sortBy, sortOrder });
                          }}
                          className="w-full p-2 border border-border rounded-md"
                        >
                          <option value="nome-asc">Nome (A-Z)</option>
                          <option value="nome-desc">Nome (Z-A)</option>
                          <option value="preco-asc">Preço (Menor)</option>
                          <option value="preco-desc">Preço (Maior)</option>
                          <option value="tempo-asc">Tempo (Menor)</option>
                          <option value="tempo-desc">Tempo (Maior)</option>
                        </select>
                      </div>
                    </div>

                    {/* Filtros Ativos */}
                    {hasActiveFilters && (
                      <div className="pt-4 border-t">
                        <div className="text-sm font-medium mb-2">Filtros Ativos:</div>
                        <div className="flex flex-wrap gap-2">
                          {filters.categoriaId && (
                            <Badge variant="secondary">
                              Categoria: {filtersData?.Categorias?.find((c: any) => c.Id === filters.categoriaId)?.Nome}
                              <button
                                onClick={() => setFilters({ ...filters, categoriaId: undefined })}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )}
                          {filters.precoMin && (
                            <Badge variant="secondary">
                              Preço min: R$ {filters.precoMin}
                              <button
                                onClick={() => setFilters({ ...filters, precoMin: undefined })}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )}
                          {filters.precoMax && (
                            <Badge variant="secondary">
                              Preço max: R$ {filters.precoMax}
                              <button
                                onClick={() => setFilters({ ...filters, precoMax: undefined })}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )}
                          {filters.tipo && (
                            <Badge variant="secondary">
                              Tipo: {filters.tipo}
                              <button
                                onClick={() => setFilters({ ...filters, tipo: undefined })}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status da Busca */}
      {searchLoading && (
        <div className="mt-2 text-sm text-muted-foreground">
          Buscando pratos...
        </div>
      )}
      
      {searchResults && (
        <div className="mt-2 text-sm text-muted-foreground">
          {searchResults.TotalCount > 0 
            ? `${searchResults.TotalCount} pratos encontrados`
            : 'Nenhum prato encontrado'
          }
        </div>
      )}
    </div>
  );
};









