import { useState } from "react";
import { Link } from "react-router-dom";
import { Ship, Menu, X, PackageSearch, Calculator, PackagePlus, User } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "/#" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Reseñas", href: "/#resenas" },
  { label: "Contacto", href: "/#contacto" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2 text-primary-foreground font-heading font-bold text-lg">
          <Ship className="w-6 h-6 text-secondary" />
          Baritto
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/calculadora"
            className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-secondary transition-colors text-sm font-medium"
          >
            <Calculator className="w-4 h-4" />
            Presupuesto
          </Link>
          <Link
            to="/recogidas"
            className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-secondary transition-colors text-sm font-medium"
          >
            <PackagePlus className="w-4 h-4" />
            Recogidas
          </Link>
          <Link
            to="/seguimiento"
            className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-secondary transition-colors text-sm font-medium"
          >
            <PackageSearch className="w-4 h-4" />
            Seguimiento
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 text-primary-foreground/70 hover:text-secondary transition-colors text-sm font-medium"
          >
            <User className="w-4 h-4" />
            Acceso
          </Link>
          <a
            href="tel:+34922619077"
            className="rounded-lg bg-secondary text-secondary-foreground px-5 py-2 text-sm font-semibold hover:brightness-110 transition-all"
          >
            Llamar
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-primary-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-primary-foreground/80 hover:text-secondary transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/calculadora"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-colors font-medium"
          >
            <Calculator className="w-4 h-4" />
            Presupuesto
          </Link>
          <Link
            to="/recogidas"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-colors font-medium"
          >
            <PackagePlus className="w-4 h-4" />
            Recogidas
          </Link>
          <Link
            to="/seguimiento"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-colors font-medium"
          >
            <PackageSearch className="w-4 h-4" />
            Seguimiento
          </Link>
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-colors font-medium"
          >
            <User className="w-4 h-4" />
            Acceso
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
