# 🍴 CozinhaApp Gastronomia

Uma aplicação moderna de delivery de comida gourmet desenvolvida com React e TypeScript.

## 📋 Sobre o Projeto

O CozinhaApp é uma plataforma web responsiva que oferece uma experiência gastronômica completa, permitindo que os usuários explorem cardápios, façam pedidos e desfrutem de comida gourmet no conforto de suas casas.

### ✨ Funcionalidades

- 🏠 **Página inicial** com hero section atrativa
- 📱 **Design responsivo** para todos os dispositivos
- 🍽️ **Seção de cardápio** com pratos cuidadosamente selecionados
- 📅 **Sistema de agendamentos** para pedidos
- 📞 **Informações de contato** e redes sociais
- 🎨 **Interface moderna** com animações suaves

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface modernos
- **Lucide React** - Ícones SVG otimizados
- **PostCSS** - Processador CSS

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/mattz77/CozinhaAPP-2.0.git
   cd CozinhaAPP-2.0
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   - Abra seu navegador em: `http://localhost:3000`

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento na porta 3000
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter ESLint

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── ui/           # Componentes de interface reutilizáveis
├── pages/            # Páginas da aplicação
├── assets/           # Imagens e recursos estáticos
├── hooks/            # Custom hooks do React
├── lib/              # Utilitários e configurações
└── main.tsx          # Ponto de entrada da aplicação
```

## 🎨 Design System

O projeto utiliza um design system consistente com:
- **Cores primárias**: Gradientes vermelho/laranja
- **Tipografia**: Playfair Display (títulos) e Inter (texto)
- **Componentes**: Baseados no shadcn/ui
- **Animações**: Transições suaves e efeitos hover

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🔧 Configuração

### Porta do Servidor
O servidor de desenvolvimento está configurado para rodar na porta **3000** por padrão.

### Variáveis de Ambiente
Crie um arquivo `.env.local` se necessário:
```env
VITE_API_URL=your_api_url_here
```

## 📦 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push na branch main

### Netlify
1. Conecte o repositório ao Netlify
2. Configure o build command: `npm run build`
3. Configure o publish directory: `dist`

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

**Mateus Oliveira** - [@mattz77](https://github.com/mattz77)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!