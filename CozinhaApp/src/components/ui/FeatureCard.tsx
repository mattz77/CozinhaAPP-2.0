import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  className?: string;
}

const FeatureCard = ({ 
  title, 
  description, 
  image, 
  className 
}: FeatureCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden bg-card border-border hover:shadow-lg group transition-all duration-300",
      className
    )}>
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-heading text-xl font-bold text-primary mb-3">
            {title}
          </h3>
          <p className="font-elegant text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
