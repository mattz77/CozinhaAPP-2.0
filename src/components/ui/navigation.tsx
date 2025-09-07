import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "INÍCIO", href: "#inicio" },
    { label: "CARDÁPIO", href: "#cardapio" },
    { label: "AGENDAMENTOS", href: "#agendamentos" },
    { label: "CONTATO", href: "#contato" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-heading text-3xl font-bold text-primary">
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

          {/* Social Links */}
          <div className="hidden lg:flex items-center space-x-4">
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
  );
};

export default Navigation;