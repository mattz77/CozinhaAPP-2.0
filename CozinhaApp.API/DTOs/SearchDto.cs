namespace CozinhaApp.API.DTOs;

public class SearchResultDto<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}

public class SearchSuggestionsDto
{
    public List<string> Pratos { get; set; } = new();
    public List<string> Categorias { get; set; } = new();
    public List<string> Tipos { get; set; } = new();
}

public class SearchFiltersDto
{
    public List<FilterOptionDto> Categorias { get; set; } = new();
    public List<FilterOptionDto> Tipos { get; set; } = new();
    public FaixaPrecoDto FaixaPreco { get; set; } = new();
    public TempoPreparoDto TempoPreparo { get; set; } = new();
}

public class FilterOptionDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class FaixaPrecoDto
{
    public decimal PrecoMinimo { get; set; }
    public decimal PrecoMaximo { get; set; }
    public decimal PrecoMedio { get; set; }
}

public class TempoPreparoDto
{
    public int TempoMinimo { get; set; }
    public int TempoMaximo { get; set; }
    public double TempoMedio { get; set; }
}




