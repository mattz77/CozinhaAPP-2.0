import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Users } from "lucide-react";

const InfoSection = () => {
  return (
    <section id="contato" className="py-20 bg-elegant">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-4">
            Informações
          </h2>
          <p className="font-elegant text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre-nos no coração de Osasco
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Location */}
          <Card className="bg-card border-border hover-lift">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                Localização
              </h3>
               <p className="font-elegant text-muted-foreground mb-4">
                 R. Lázaro Suave, 233<br />
                 Bussocaba<br />
                 CEP: 06040-470<br />
                 Osasco - SP - Brasil
               </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => window.open('https://www.google.com/maps/place/R.+L%C3%A1zaro+Suave,+233+-+Bussocaba,+Osasco+-+SP,+06040-470/@-23.5670697,-46.7828337,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce55571398a1df:0x451be45dff4c8815!8m2!3d-23.5669404!4d-46.7831942!16s%2Fg%2F11s13bs2q_?entry=ttu&g_ep=EgoyMDI1MDkxMC4wIKXMDSoASAFQAw%3D%3D', '_blank')}
              >
                VER NO MAPA
              </Button>
            </CardContent>
          </Card>

          {/* Hours */}
          <Card className="bg-card border-border hover-lift">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                Horário de Funcionamento
              </h3>
              <div className="space-y-3 font-elegant text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">Almoço</p>
                  <p>Segunda a Sexta: 12h às 15h</p>
                  <p>Sábado: 13h às 16h</p>
                  <p>Domingo: 12h às 16h30</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Jantar</p>
                  <p>Segunda a Quinta: 19h às 23h</p>
                  <p>Sexta e Sábados: 19h às 00h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-card border-border hover-lift md:col-span-2 lg:col-span-1">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                Contato & Reservas
              </h3>
               <div className="space-y-3 font-elegant text-muted-foreground mb-6">
                 <p>(11) 9999-9999</p>
                 <p>contato@cozinhaapp.com</p>
                 <div className="flex items-center justify-center text-sm">
                   <Users className="w-4 h-4 mr-2" />
                   <span>Delivery em toda São Paulo</span>
                 </div>
                 <p className="text-sm">Entrega em até 45 minutos</p>
               </div>
               <Button
                 className="bg-primary text-primary-foreground hover:bg-primary/90 glow-red"
               >
                 FAZER PEDIDO
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;