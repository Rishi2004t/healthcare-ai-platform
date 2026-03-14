import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DoctorCardProps {
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  image: string;
  available: boolean;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  specialty,
  rating,
  experience,
  image,
  available,
}) => {
  return (
    <div className="group p-5 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-1">
      <div className="relative mb-4">
        <div className="aspect-square rounded-xl overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {available && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            Available
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <p className="text-primary font-medium text-sm">{specialty}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold text-foreground">{rating}</span>
          </div>
          <span className="text-muted-foreground">{experience}</span>
        </div>
        
        <Button className="w-full gap-2" size="sm">
          <Calendar className="h-4 w-4" />
          Consult Now
        </Button>
      </div>
    </div>
  );
};

export default DoctorCard;
