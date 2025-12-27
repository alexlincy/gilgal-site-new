
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Globe, HandHeart, BookOpenText, Bus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { PastorMessage } from "@/components/home/PastorMessage";
const ministries = [
  {
    id: "scripture-school",
    label: "Scripture School",
    icon: BookOpen,
    color: "accent",
    description: "Biblical education for children and young adults through engaging, age-appropriate teaching.",
    link: "/ministries/scripture-school"
  },
  {
    id: "pypa",
    label: "PYPA",
    icon: Globe,
    color: "primary",
    description: "Equipping youth to grow in faith, leadership, and service through fellowship.",
    link: "/ministries/pypa"
  },
  {
    id: "prayer-fellowship",
    label: "Prayer & Fellowship",
    icon: HandHeart,
    color: "accent",
    description: "Regular gatherings for prayer, Bible study, and Pentecostal community.",
    link: "/prayer-fellowship"
  }
];

import worshipCommunity from "@/assets/worship-community.jpg";

export default function Home() {
  return (
    <Layout>
      <HeroBanner
        title="IPC Gilgal"
        titleSecondLine="Church"
        subtitle="A welcoming Malayalee Pentecostal community"
        subtitleSecondLine="united in faith and fellowship."
        location="Sharjah & Ras Al Khaimah, UAE"
        primaryCta={{ text: "Discover Our Church", link: "/about" }}
        secondaryCta={{ text: "Get in Touch", link: "/contact" }}
      />

      {/* Discover Life at IPC Gilgal - Asymmetric Feature Grid */}
      <section className="section-cream py-12 md:py-16 relative overflow-hidden">
        {/* Ambient background accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-dove/8 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="label-badge mb-2">Welcome Home</span>
            <h2 className="text-foreground text-2xl md:text-3xl lg:text-4xl font-bold">
              Discover Life at IPC Gilgal
            </h2>
          </div>

          {/* Growing Together in Faith - Full Width Card */}
          <div className="relative rounded-2xl overflow-hidden min-h-[520px] lg:min-h-[600px] group">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${worshipCommunity})` }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/75 to-primary/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8 md:p-10 lg:p-12">
              {/* Header Content */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-5" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                  Growing Together in Faith
                </h3>
                <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed mb-5 md:mb-6" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  Join our vibrant community through worship, learning, and fellowship as we journey in Christ together.
                </p>
                {/* How We Serve Pill */}
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/90 text-primary text-base font-bold shadow-lg">
                  <HandHeart className="w-5 h-5" />
                  How We Serve
                </span>
              </div>

              {/* Ministry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
                {ministries.map((ministry) => (
                  <Link
                    key={ministry.id}
                    to={ministry.link}
                    onClick={() => window.scrollTo(0, 0)}
                    className="group/card relative bg-white/12 hover:bg-white/20 backdrop-blur-md border border-white/15 hover:border-white/30 rounded-xl p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-accent/90 flex items-center justify-center shadow-md">
                        <ministry.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="text-white font-semibold text-base md:text-lg">{ministry.label}</h4>
                    </div>
                    <p className="text-white/75 text-sm md:text-base leading-relaxed line-clamp-2">{ministry.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-accent text-sm md:text-base font-semibold mt-3 group-hover/card:gap-2 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>

              {/* Info Tags */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center justify-center gap-2.5 px-4 py-3 md:px-5 md:py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/10">
                  <Globe className="w-5 h-5 text-accent" />
                  <span className="text-white font-medium text-sm md:text-base">Services in Malayalam</span>
                </div>
                <div className="flex items-center justify-center gap-2.5 px-4 py-3 md:px-5 md:py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/10">
                  <Bus className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  <span className="text-white font-medium text-sm md:text-base">Transportation available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pastor's Message Section */}
      <PastorMessage />

      {/* Verse Banner */}
      <section className="bg-primary py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-5" />
        <div className="section-container relative text-center">
          <BookOpenText className="w-8 h-8 text-accent/80 mx-auto mb-4" />
          <blockquote className="text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 font-serif italic max-w-3xl mx-auto leading-relaxed">
            "For where two or three gather in my name, there am I with them."
          </blockquote>
          <cite className="block mt-4 text-primary-foreground/70 text-sm md:text-base font-medium not-italic">
            Matthew 18:20
          </cite>
        </div>
      </section>
    </Layout>
  );
}
