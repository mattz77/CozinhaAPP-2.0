// Dados mockados para garantir que o cardápio funcione
export const mockCategorias = [
  {
    id: 1,
    nome: "Entrada",
    descricao: "Pratos para começar a refeição",
    ativa: true,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 2,
    nome: "Prato Principal",
    descricao: "Pratos principais",
    ativa: true,
    dataCriacao: new Date().toISOString()
  },
  {
    id: 3,
    nome: "Sobremesa",
    descricao: "Doces e sobremesas",
    ativa: true,
    dataCriacao: new Date().toISOString()
  }
];

export const mockPratos = [
  {
    id: 1,
    nome: "Bruschetta Italiana",
    descricao: "Pão italiano grelhado com tomate, manjericão e azeite",
    preco: 18.90,
    imagemUrl: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=400&h=300&fit=crop&crop=center",
    disponivel: true,
    tempoPreparo: 15,
    tipo: "Entrada",
    dataCriacao: new Date().toISOString(),
    categoriaId: 1,
    categoria: mockCategorias[0]
  },
  {
    id: 2,
    nome: "Risotto de Cogumelos",
    descricao: "Arroz cremoso com cogumelos porcini e parmesão",
    preco: 45.90,
    imagemUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&crop=center",
    disponivel: true,
    tempoPreparo: 30,
    tipo: "Prato Principal",
    dataCriacao: new Date().toISOString(),
    categoriaId: 2,
    categoria: mockCategorias[1]
  },
  {
    id: 3,
    nome: "Tiramisu",
    descricao: "Sobremesa italiana com café, mascarpone e cacau",
    preco: 22.90,
    imagemUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center",
    disponivel: true,
    tempoPreparo: 20,
    tipo: "Sobremesa",
    dataCriacao: new Date().toISOString(),
    categoriaId: 3,
    categoria: mockCategorias[2]
  },
  {
    id: 4,
    nome: "Salada Caprese",
    descricao: "Tomate, mozzarella e manjericão fresco",
    preco: 24.50,
    imagemUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center",
    disponivel: true,
    tempoPreparo: 10,
    tipo: "Entrada",
    dataCriacao: new Date().toISOString(),
    categoriaId: 1,
    categoria: mockCategorias[0]
  },
  {
    id: 5,
    nome: "Lasanha Bolonhesa",
    descricao: "Massa artesanal com molho de carne e queijo",
    preco: 52.90,
    imagemUrl: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&crop=center",
    disponivel: true,
    tempoPreparo: 45,
    tipo: "Prato Principal",
    dataCriacao: new Date().toISOString(),
    categoriaId: 2,
    categoria: mockCategorias[1]
  },
  {
    id: 6,
    nome: "Panna Cotta",
    descricao: "Sobremesa italiana com calda de frutas vermelhas",
    preco: 19.90,
    imagemUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center",
    disponivel: true,
    tempoPreparo: 25,
    tipo: "Sobremesa",
    dataCriacao: new Date().toISOString(),
    categoriaId: 3,
    categoria: mockCategorias[2]
  }
];