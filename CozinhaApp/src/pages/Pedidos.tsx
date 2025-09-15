import React from 'react';
import { MeusPedidosComponent } from '@/components/pedidos/MeusPedidosComponent';

const Pedidos = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <MeusPedidosComponent />
      </div>
    </div>
  );
};

export default Pedidos;
