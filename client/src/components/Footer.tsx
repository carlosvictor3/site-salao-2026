import { Link } from "wouter";
import { Sparkles, Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import logo from "../../public/logo.png"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="Logo Studio Kalê"
                className="h-6 w-6 object-contain"
              />
              <span className="text-lg font-display font-bold gradient-text">
                Studio Kalê
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transformando beleza em arte há mais de 10 anos.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-muted-foreground hover:text-primary transition-colors">
                  Promoções
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>(21) 98199-3352</span>
              </li>
              <li className="flex items-center gap-2">

              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Rio de Janeiro, RJ</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/kalemapband"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© Studio Kalê. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
