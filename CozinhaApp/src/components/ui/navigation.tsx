import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Facebook, Instagram, User, LogOut, ChefHat, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCartSync } from "@/hooks/useCartSync";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserDropdown } from "@/components/auth/UserDropdown";
import { Cart } from "@/components/ui/Cart";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const { isOpen: isCartOpen, toggleCart, totalItems, items, updateQuantity, removeItem, syncKey } = useCartSync();
  
  const [key, setKey] = useState(0); // Força re-render quando necessário
  const location = useLocation();

  // Força re-render quando o estado de autenticação mudar
  useEffect(() => {
    console.log('🔄 Navigation: Estado de autenticação mudou:', { isAuthenticated, user: user?.nomeCompleto });
    setKey(prev => prev + 1);
  }, [isAuthenticated, user]);

  // Header inteligente com scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Header fica mais opaco quando scroll > 100px
      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Header se esconde quando scroll para baixo > 200px
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Escuta eventos para controlar modal de login e atualizações do carrinho
  useEffect(() => {
    const handleOpenAuthModal = () => {
      console.log('🔐 Navigation: Abrindo modal de login via evento');
      setShowAuthModal(true);
    };

    const handleLoginSuccess = () => {
      console.log('✅ Navigation: Login bem-sucedido, fechando modal');
      setShowAuthModal(false);
    };

    const handleCartUpdated = () => {
      console.log('🛒 Navigation: Carrinho atualizado, forçando re-render');
      setKey(prev => prev + 1);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    window.addEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('cartUpdated', handleCartUpdated);
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
      window.removeEventListener('loginSuccess', handleLoginSuccess);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  // Log para debug
  console.log('🔍 Navigation: Estado:', {
    isAuthenticated,
    user: user?.nomeCompleto,
    hasUser: !!user,
    userRole: user?.role,
    isAdmin: user?.role?.toLowerCase() === "admin"
  });

  const navItems = [
    { label: "CARDÁPIO", href: "#cardapio", isRoute: false },
    { label: "AGENDAMENTOS", href: "#agendamentos", isRoute: false },
    { label: "CONTATO", href: "#contato", isRoute: false },
  ];

  // Itens de navegação para usuários autenticados
  const userNavItems = [
    { label: "MEUS PEDIDOS", href: "/meus-pedidos", isRoute: true },
  ];

  // Itens de navegação para usuários autenticados (admin)
  const adminNavItems = [
    { label: "DASHBOARD", href: "/dashboard", isRoute: true },
    { label: "PEDIDOS", href: "/pedidos-admin", isRoute: true },
    { label: "RELATÓRIOS", href: "/reports", isRoute: true },
    { label: "CONFIGURAÇÕES", href: "/configurations", isRoute: true },
  ];


  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300",
          isScrolled 
            ? "bg-background/95 border-border shadow-lg" 
            : "bg-background/80 border-border/50",
          isHidden && "transform -translate-y-full"
        )}
        style={{
          background: isScrolled 
            ? 'rgba(0, 0, 0, 0.95)' 
            : 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${isScrolled ? 'rgba(245, 196, 66, 0.1)' : 'rgba(245, 196, 66, 0.05)'}`,
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 -ml-2">
              <Link to="/" className="font-heading text-3xl font-bold text-primary flex items-center hover:text-primary/80 transition-colors duration-300">
                <ChefHat className="h-8 w-8 mr-2" />
                CozinhaApp
              </Link>
            </div>


            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      "text-sm font-elegant transition-colors duration-300",
                      location.pathname === item.href 
                        ? "text-primary font-semibold" 
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-sm font-elegant text-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                )
              ))}
              
              {/* User Navigation - aparece para todos os usuários autenticados */}
              {isAuthenticated && (
                <>
                  <div className="w-px h-6 bg-border mx-3"></div>
                  {userNavItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={cn(
                        "text-sm font-elegant transition-colors duration-300",
                        location.pathname === item.href 
                          ? "text-primary font-semibold" 
                          : "text-foreground hover:text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

              {/* Admin Navigation - só aparece se estiver autenticado E for Admin */}
              {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
                <>
                  <div className="w-px h-6 bg-border mx-3"></div>
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={cn(
                        "text-sm font-elegant transition-colors duration-300",
                        location.pathname === item.href 
                          ? "text-primary font-semibold" 
                          : "text-foreground hover:text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Carrinho - só aparece se estiver logado */}
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCart}
                  className="text-sm relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Carrinho
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              )}

              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Button>
              )}

              {/* Social Links */}
              <div className="flex items-center space-x-3 ml-3 pl-3 border-l border-border">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground hover:text-primary"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "lg:hidden transition-all duration-300 ease-in-out",
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )}
          >
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block text-sm font-elegant transition-colors duration-300",
                      location.pathname === item.href 
                        ? "text-primary font-semibold" 
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-elegant text-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                )
              ))}
              
              {/* User Navigation Mobile - aparece para todos os usuários autenticados */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Minha Conta
                    </div>
                    {userNavItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block text-sm font-elegant transition-colors duration-300 pl-2",
                          location.pathname === item.href 
                            ? "text-primary font-semibold" 
                            : "text-foreground hover:text-primary"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Admin Navigation Mobile - só aparece se for Admin */}
              {isAuthenticated && user?.role?.toLowerCase() === "admin" && (
                <>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Administração
                    </div>
                    {adminNavItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block text-sm font-elegant transition-colors duration-300 pl-2",
                          location.pathname === item.href 
                            ? "text-primary font-semibold" 
                            : "text-foreground hover:text-primary"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-border space-y-3">
                {/* Carrinho Mobile - só aparece se estiver logado */}
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleCart();
                      setIsOpen(false);
                    }}
                    className="w-full text-sm relative"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Carrinho
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                )}

                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        {user?.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.nomeCompleto}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {user?.nomeCompleto}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className="flex-1 text-sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Perfil
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex-1 text-sm text-muted-foreground hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsOpen(false);
                    }}
                    className="w-full text-sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                )}
              </div>

              {/* Mobile Social Links */}
              <div className="flex items-center space-x-4 pt-4">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}


      {/* Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => toggleCart()}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      {/* Carrinho Fixo no Canto Inferior Direito */}
      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            onClick={() => toggleCart()}
            className="relative w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl border-2 border-white/20 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, #F5C442, #E6B800)',
              boxShadow: '0 8px 32px rgba(245, 196, 66, 0.4)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={totalItems > 0 ? { 
              boxShadow: "0 8px 32px rgba(245, 196, 66, 0.6)",
              scale: 1.02
            } : {}}
          >
            <ShoppingCart className="h-6 w-6 mx-auto" />
            
            {/* Badge de quantidade */}
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={totalItems}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg border-2 border-white"
              >
                {totalItems}
              </motion.span>
            )}
            
            {/* Efeito de pulso quando há itens */}
            {totalItems > 0 && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/50"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 0, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.button>
        </motion.div>
      )}

    </>
  );
};

export default Navigation;