import { Ship } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-primary-foreground font-heading font-bold text-lg">
            <Ship className="w-6 h-6 text-secondary" />
            Transportes Insulares Baritto
          </div>
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Transportes Insulares Baritto. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
