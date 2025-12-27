import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { BackToTop } from "@/components/ui/BackToTop";
import { BookOpen, Droplets, Flame, Heart, Cross, Sparkles } from "lucide-react";
import pentecostImage from "@/assets/sunset-ocean.jpg";

const beliefs = [
  {
    icon: BookOpen,
    title: "Authority of the Holy Scriptures",
    description:
      "We believe that the Bible, consisting of the sixty-six books of the Old and New Testaments, is the inspired, infallible, and authoritative Word of God. The Scriptures are the complete revelation of God's will for the salvation of humanity and the supreme standard by which all human conduct, creeds, and opinions shall be tried.",
    color: "gold",
  },
  {
    icon: Cross,
    title: "Salvation through Jesus Christ",
    description:
      "We believe that salvation is received through repentance toward God and faith in the Lord Jesus Christ, who is the only begotten Son of God, fully God and fully man. Through His substitutionary death on the cross and bodily resurrection, He accomplished redemption for all who believe. Salvation is by grace alone through faith alone, not by works, and results in the regeneration of the believer by the Holy Spirit.",
    color: "navy",
  },
  {
    icon: Droplets,
    title: "Water Baptism by Immersion",
    description:
      "We believe that water baptism by immersion is a commandment of our Lord Jesus Christ, to be observed by all who have repented and believed in Him as Savior. This ordinance is a public declaration of the believer's identification with Christ in His death, burial, and resurrection, and serves as an outward sign of the inward work of regeneration accomplished by the Holy Spirit.",
    color: "gold",
  },
  {
    icon: Flame,
    title: "Baptism in the Holy Spirit",
    description:
      "We believe that the baptism in the Holy Spirit is a distinct experience subsequent to conversion, in which the Holy Spirit endues the believer with power for service and witness. The initial physical evidence of this baptism is speaking in other tongues as the Spirit gives utterance, as recorded in the book of Acts. This experience empowers believers for effective Christian life, ministry, and the manifestation of spiritual gifts.",
    color: "navy",
  },
  {
    icon: Heart,
    title: "Divine Healing & Christ's Return",
    description:
      "We believe in divine healing as provided for in the atonement of Christ, and that it is the privilege of all believers to claim healing through prayer and faith in the name of Jesus. We also believe in the blessed hope of the personal, premillennial, and imminent return of our Lord Jesus Christ, when the dead in Christ will be raised incorruptible and the living saints will be caught up together with them to meet the Lord in the air.",
    color: "gold",
  },
];

// Belief Card component for consistent styling
const BeliefCard = ({ belief }: { belief: typeof beliefs[0] }) => (
  <div className="rounded-xl p-6 bg-[#FAF8F3] shadow-md border border-black/[0.04] h-full">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
      belief.color === 'gold' ? 'bg-accent/12' : 'bg-primary/8'
    }`}>
      <belief.icon className={`w-6 h-6 ${belief.color === 'gold' ? 'text-accent' : 'text-primary'}`} />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2 leading-snug">
      {belief.title}
    </h3>
    <p className="text-muted-foreground text-sm leading-relaxed">
      {belief.description}
    </p>
  </div>
);

export default function Beliefs() {
  return (
    <Layout>
      <BackToTop />
      <HeroBanner
        title="Our Beliefs"
        subtitle="The foundational teachings that guide our faith community"
      />

      {/* Transition band - visual rest between hero and beliefs */}
      <section className="bg-background py-16 md:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-5">
              Foundations of Our Faith
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              As a congregation of the Indian Pentecostal Church, our beliefs are rooted in historic Christian teachings. The following principles form the foundation of our faith and practice.
            </p>
          </div>
        </div>
      </section>

      {/* Beliefs section with dove backdrop */}
      <section className="relative pt-56 sm:pt-72 md:pt-96 lg:pt-32 pb-16 md:pb-24 overflow-hidden">
        {/* Background image - dove visible at center */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{ 
            backgroundImage: `url(${pentecostImage})`,
            backgroundPosition: '10% 75%'
          }}
        />
        
        {/* Sacred Grid of Belief Cards - framing the dove */}
        <div className="section-container relative z-10">
          
          {/* Desktop: 3-column layout with dove in center */}
          <div className="hidden lg:block max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-5 items-start">
              {/* Left column - first 2 cards stacked */}
              <div className="space-y-5">
                <BeliefCard belief={beliefs[0]} />
                <BeliefCard belief={beliefs[1]} />
              </div>
              
              {/* Middle column - empty space for dove at top, card below */}
              <div className="flex flex-col">
                {/* Empty space at top for dove visibility */}
                <div className="h-64 flex-shrink-0"></div>
                {/* Center card positioned below dove's tail */}
                <BeliefCard belief={beliefs[4]} />
              </div>
              
              {/* Right column - next 2 cards stacked */}
              <div className="space-y-5">
                <BeliefCard belief={beliefs[2]} />
                <BeliefCard belief={beliefs[3]} />
              </div>
            </div>
          </div>

          {/* Tablet: 2 + 2 + 1 grid */}
          <div className="hidden md:block lg:hidden max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-5 mb-5">
              {beliefs.slice(0, 4).map((belief, index) => (
                <BeliefCard key={index} belief={belief} />
              ))}
            </div>
            <div className="flex justify-center">
              <div className="w-1/2">
                <BeliefCard belief={beliefs[4]} />
              </div>
            </div>
          </div>

          {/* Mobile: vertical stack */}
          <div className="md:hidden space-y-4 max-w-md mx-auto">
            {beliefs.map((belief, index) => (
              <BeliefCard key={index} belief={belief} />
            ))}
          </div>
        </div>
      </section>

      {/* Scripture reflection band */}
      <section className="section-reflective py-16 md:py-20 relative">
        <div className="absolute inset-0 pattern-stars" />
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-4 text-accent" />
            <blockquote className="text-xl md:text-2xl italic text-primary-foreground/90 mb-4 font-serif leading-relaxed">
              "Your word is a lamp for my feet, a light on my path."
            </blockquote>
            <p className="text-sm text-primary-foreground/50 tracking-[0.2em] uppercase">Psalm 119:105</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
