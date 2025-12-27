import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/church-logo.png";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Beliefs", href: "/beliefs" },
  {
    name: "Ministries",
    href: "/ministries",
    children: [
      { name: "Scripture School", href: "/ministries/scripture-school" },
      { name: "PYPA", href: "/ministries/pypa" },
      { name: "Prayer & Fellowship", href: "/prayer-fellowship" },
    ],
  },
  { name: "Media", href: "/media" },
  { name: "Events", href: "/events" },
  // ✅ Removed Gallery menu item
  { name: "Contact Us", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ministriesOpen, setMinistriesOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const isActive = (href: string) => location.pathname === href;
  const isMinistryActive = () =>
    location.pathname.startsWith("/ministries") || location.pathname === "/prayer-fellowship";

  return (
    <>
      {/* Top Info Strip */}
      <div className="bg-navy text-navy-foreground text-sm hidden md:block">
        <div className="section-container">
          <div className="py-2"></div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-card shadow-sm sticky top-0 z-50 border-b border-border">
        <nav className="section-container">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="IPC Gilgal Sharjah logo" 
                className={`object-contain transition-all duration-200 ${
                  isHomePage 
                    ? "h-20 md:h-24" 
                    : "h-14 md:h-20"
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navigation.map((item) =>
                item.children ? (
                  <div key={item.name} className="relative group">
                    <button
                      className={`rounded-full px-4 py-2 flex items-center gap-1.5 text-sm font-medium transition-all duration-200 ${
                        isMinistryActive() 
                          ? "bg-muted text-primary" 
                          : "bg-muted/30 text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-card border border-border rounded-md shadow-lg py-2 min-w-[180px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`block px-4 py-2 text-sm hover:bg-muted transition-colors ${
                              isActive(child.href) ? "text-primary font-medium" : "text-foreground/80"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive(item.href) 
                        ? "bg-muted text-primary" 
                        : "bg-muted/30 text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ),
              )}
              <a
                href="https://members.instantchurchdirectory.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 btn-primary text-sm px-4 py-2 rounded-full"
              >
                Member Login
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-border py-4">
              <div className="flex flex-col gap-2">
                {navigation.map((item) =>
                  item.children ? (
                    <div key={item.name}>
                      <button
                        onClick={() => setMinistriesOpen(!ministriesOpen)}
                        className={`w-full text-left rounded-full px-4 py-2.5 flex items-center justify-between text-sm font-medium transition-all duration-200 ${
                          isMinistryActive() 
                            ? "bg-muted text-primary" 
                            : "bg-muted/30 text-foreground/70 hover:bg-muted/60"
                        }`}
                      >
                        {item.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${ministriesOpen ? "rotate-180" : ""}`} />
                      </button>
                      {ministriesOpen && (
                        <div className="pl-6 flex flex-col gap-1 mt-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`py-2 px-4 text-sm rounded-full ${
                                isActive(child.href) 
                                  ? "bg-muted/50 text-primary font-medium" 
                                  : "text-foreground/70 hover:bg-muted/30"
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive(item.href) 
                          ? "bg-muted text-primary" 
                          : "bg-muted/30 text-foreground/70 hover:bg-muted/60"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ),
                )}
                <a
                  href="https://members.instantchurchdirectory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 btn-primary text-sm text-center rounded-full"
                >
                  Member Directory Login
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
