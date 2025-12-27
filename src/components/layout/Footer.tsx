import { Link } from "react-router-dom";
import { Mail, Phone, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/church-logo.png";

export function Footer() {
  return (
    <footer className="footer-warm relative overflow-hidden">
      {/* Subtle glow effect at top */}
      <div className="footer-glow" />
      
      {/* Decorative top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />

      <div className="section-container py-14 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-5">
              <img 
                src={logo} 
                alt="IPC Gilgal Sharjah logo" 
                className="h-14 md:h-14 w-auto object-contain drop-shadow-sm"
              />
              <div>
                <h4 className="font-semibold text-navy-foreground text-lg">IPC Gilgal</h4>
                <p className="text-xs text-navy-foreground/60">Sharjah & RAK</p>
              </div>
            </div>
            <p className="text-navy-foreground/70 text-sm leading-relaxed">
              A welcoming Pentecostal community serving believers in the United Arab Emirates with faith, hope, and love.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/80 mb-5">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-navy-foreground/70 hover:text-navy-foreground text-sm transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/beliefs" className="text-navy-foreground/70 hover:text-navy-foreground text-sm transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
                  Our Beliefs
                </Link>
              </li>
              <li>
                <Link to="/ministries/scripture-school" className="text-navy-foreground/70 hover:text-navy-foreground text-sm transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
                  Scripture School
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-navy-foreground/70 hover:text-navy-foreground text-sm transition-colors inline-flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/80 mb-5">Reach Out</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:ipcgilgalshj@gmail.com" className="flex items-start gap-3 text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-navy-foreground/10 flex items-center justify-center group-hover:bg-navy-foreground/15 transition-colors flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="pt-1.5">ipcgilgalshj@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+971501892016" className="flex items-start gap-3 text-sm text-navy-foreground/70 hover:text-navy-foreground transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-navy-foreground/10 flex items-center justify-center group-hover:bg-navy-foreground/15 transition-colors flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="pt-1.5">+971 50 189 2016</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Connect */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-foreground/80 mb-5">Connect</h3>
            <p className="text-navy-foreground/60 text-sm mb-4">
              Stay connected with our church family online.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/ipcgilgalshj.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy-foreground/10 hover:bg-primary/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@ipcgilgalshj"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-navy-foreground/10 hover:bg-primary/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright with softer styling */}
        <div className="border-t border-navy-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-navy-foreground/50">
              © {new Date().getFullYear()} IPC Gilgal Church. All rights reserved.
            </p>
            <p className="text-xs text-navy-foreground/40 italic">
              Serving with faith in Sharjah & Ras Al Khaimah
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
