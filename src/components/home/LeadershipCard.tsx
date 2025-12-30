import { User, Phone } from "lucide-react";

interface LeadershipCardProps {
  name: string;
  role: string;
  phone: string;
  image?: string;
  imagePosition?: string;
  imageScale?: number;
}

export function LeadershipCard({ name, role, phone, image, imagePosition = "center 20%", imageScale = 1 }: LeadershipCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border hover:shadow-md transition-all duration-300 group">
      {/* Avatar with gradient ring */}
      <div className="relative inline-block mb-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full scale-110 group-hover:scale-115 transition-transform duration-300" />
        <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-border/50">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: imagePosition,
                transform: `scale(${imageScale})`
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80 flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground/70" />
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
      <p className="text-primary font-medium text-sm mb-4">{role}</p>
      
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-lg hover:bg-primary/5"
      >
        <Phone className="w-4 h-4" />
        {phone}
      </a>
    </div>
  );
}
