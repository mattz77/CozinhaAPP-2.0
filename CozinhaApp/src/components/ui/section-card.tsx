import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  description: string;
  image: string;
  href?: string;
  className?: string;
  reverse?: boolean;
}

const SectionCard = ({ 
  title, 
  description, 
  image, 
  href, 
  className,
  reverse = false 
}: SectionCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden bg-card border-border hover-lift group",
      className
    )}>
      <CardContent className={cn(
        "p-0 grid md:grid-cols-2 gap-0 min-h-[400px]",
        reverse && "md:grid-cols-2"
      )}>
        {/* Image */}
        <div className={cn(
          "relative overflow-hidden",
          reverse && "md:order-2"
        )}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 luxury-gradient" />
        </div>

        {/* Content */}
        <div className={cn(
          "p-8 lg:p-12 flex flex-col justify-center",
          reverse && "md:order-1"
        )}>
          <h3 className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-6">
            {title}
          </h3>
          <p className="font-elegant text-lg text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>
          {href && (
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-fit font-elegant"
            >
              SAIBA MAIS
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionCard;