import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Facebook, Instagram, User, LogOut, ChefHat, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserDropdown } from "@/components/auth/UserDropdown";
import { Cart } from "@/components/ui/Cart";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isOpen: isCartOpen, toggleCart, totalItems, items, updateQuantity, removeItem } = useCart();
  const [key, setKey] = useState(0); // Força re-render quando necessário

  // Força re-render quando o estado de autenticação mudar
  useEffect(() => {
    console.log('🔄 Navigation: Estado de autenticação mudou:', { isAuthenticated, user: user?.nomeCompleto });
    setKey(prev => prev + 1);
  }, [isAuthenticated, user]);

  // Escuta eventos para controlar modal de login
  useEffect(() => {
    const handleOpenAuthModal = () => {
      console.log('🔐 Navigation: Abrindo modal de login via evento');
      setShowAuthModal(true);
    };

    const handleLoginSuccess = () => {
      console.log('✅ Navigation: Login bem-sucedido, fechando modal');
      setShowAuthModal(false);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    window.addEventListener('loginSuccess', handleLoginSuccess);
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
  }, []);

  // Log para debug
  console.log('🔍 Navigation: Estado:', {
    isAuthenticated,
    user: user?.nomeCompleto,
    hasUser: !!user
  });

  const navItems = [
    { label: "INÍCIO", href: "#inicio" },
    { label: "CARDÁPIO", href: "#cardapio" },
    { label: "AGENDAMENTOS", href: "#agendamentos" },
    { label: "CONTATO", href: "#contato" },
  ];


  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="font-heading text-3xl font-bold text-primary flex items-center">
                <ChefHat className="h-8 w-8 mr-2" />
                CozinhaApp
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-elegant text-foreground hover:text-primary transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
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
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-border">
                <a
                  href="https://www.facebook.com/louprestaurante"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/louprestaurante/"
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
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-elegant text-foreground hover:text-primary transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
              
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
                          setShowProfile(true);
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
                          handleLogout();
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
                  href="https://www.facebook.com/louprestaurante"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="https://www.instagram.com/louprestaurante/"
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
    </>
  );
};

export default Navigation;