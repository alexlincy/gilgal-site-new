import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { BackToTop } from "@/components/ui/BackToTop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Baby,
  BookMarked,
  Lightbulb,
  Crown,
  Sparkles,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import scriptureSchoolLogo from "@/assets/scripture-school-logo-final.png";
import { curriculumData } from "@/data/curriculumData";

// Curriculum visibility gate: Set to true to show full curriculum details, false to show access notice
// This is intentionally gated for public viewing - curriculum details are available upon request
const SHOW_CURRICULUM = false;

// Map URL hash to group index
const groupHashToIndex: Record<string, number> = {
  "sub-junior": 0,
  junior: 1,
  intermediate: 2,
  senior: 3,
  "super-senior": 4,
};

// Icon mapping for each group
const groupIcons: Record<string, React.ReactNode> = {
  "Sub-Junior": <Baby className="w-5 h-5" />,
  Junior: <BookMarked className="w-5 h-5" />,
  Intermediate: <Lightbulb className="w-5 h-5" />,
  Senior: <GraduationCap className="w-5 h-5" />,
  "Super-Senior": <Crown className="w-5 h-5" />,
};

// Color mapping for each group
const groupColors: Record<string, { bg: string; text: string; accent: string }> = {
  "Sub-Junior": {
    bg: "bg-amber-100",
    text: "text-amber-600",
    accent: "from-amber-500/20 to-amber-300/30",
  },
  Junior: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    accent: "from-sky-500/20 to-sky-300/30",
  },
  Intermediate: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    accent: "from-emerald-500/20 to-emerald-300/30",
  },
  Senior: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    accent: "from-violet-500/20 to-violet-300/30",
  },
  "Super-Senior": {
    bg: "bg-rose-100",
    text: "text-rose-600",
    accent: "from-rose-500/20 to-rose-300/30",
  },
};

export default function ScriptureSchoolCurriculum() {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Read URL hash on mount and auto-expand the corresponding group
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && groupHashToIndex[hash] !== undefined) {
      const groupIndex = groupHashToIndex[hash];
      setOpenGroups([`group-${groupIndex}`]);

      setTimeout(() => {
        const element = document.getElementById("curriculum-section");
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.hash]);

  const scrollToCurriculum = () => {
    const el = document.getElementById("curriculum-section");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      <BackToTop />
      <HeroBanner
        title="Scripture School"
        titleSecondLine="Curriculum Map"
        subtitle="A structured journey through biblical education from Beginners to Grade 12"
        logo={scriptureSchoolLogo}
        logoAlt="Scripture School Logo"
        showCurvedDivider={true}
      />

      {/* Improved Intro */}
      <section className="section-cream page-section">
        <div className="section-container">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 w-fit">
                <Link to="/ministries/scripture-school">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Scripture School
                </Link>
              </Button>

              <div className="flex flex-wrap gap-2">
                {SHOW_CURRICULUM && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-border/60 bg-background/40 hover:bg-background"
                    onClick={scrollToCurriculum}
                  >
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Jump to Curriculum
                  </Button>
                )}

                <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-primary-foreground">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>

            <div className={`grid ${SHOW_CURRICULUM ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
              {/* Main copy */}
              <div className={SHOW_CURRICULUM ? 'lg:col-span-2' : 'lg:col-span-1'}>
                <div className="card-warm bg-background/50 border border-border/40">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-gold-soft flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                        A clear pathway from Beginners to Grade 12
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Our curriculum is thoughtfully designed to nurture spiritual growth at every stage of a child’s
                        development. Students progress through age-appropriate lessons that build a strong foundation in
                        Scripture, faith, and Christian living.
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-border/50 bg-background">
                          5 Age Groups
                        </Badge>
                        <Badge variant="outline" className="border-border/50 bg-background">
                          Structured Lessons
                        </Badge>
                        <Badge variant="outline" className="border-border/50 bg-background">
                          Parent-friendly
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exam focus callout */}
                <div className="mt-6 card-warm bg-gradient-to-br from-card via-accent/5 to-card border border-accent/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <ClipboardCheck className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">Region Exam Focus</h3>
                        <Badge variant="outline" className="border-accent/50 text-accent bg-accent/5">
                          Region Exam Focus
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        Lessons marked with this badge are emphasized for regional examinations, helping students
                        prepare for assessments while deepening biblical knowledge.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick chips */}
              {SHOW_CURRICULUM && (
                <div className="lg:col-span-1">
                  <div className="card-warm bg-background/50 border border-border/40">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Quick jump</p>
                        <p className="text-sm text-muted-foreground">Open a group instantly</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Sub-Junior", hash: "#sub-junior" },
                        { label: "Junior", hash: "#junior" },
                        { label: "Intermediate", hash: "#intermediate" },
                        { label: "Senior", hash: "#senior" },
                        { label: "Super-Senior", hash: "#super-senior" },
                      ].map((g) => (
                        <Button
                          key={g.hash}
                          asChild
                          variant="outline"
                          className="rounded-full border-border/60 bg-background/40 hover:bg-background text-sm px-4"
                        >
                          <Link to={`/scripture-school/curriculum${g.hash}`}>{g.label}</Link>
                        </Button>
                      ))}
                    </div>

                    <div className="mt-5 text-sm text-muted-foreground">
                      Tip: click a group below to see sections and lessons.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Accordion or Access Notice */}
      <section id="curriculum-section" className="section-light page-section scroll-mt-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            {SHOW_CURRICULUM ? (
              <Accordion type="multiple" className="space-y-4" value={openGroups} onValueChange={setOpenGroups}>
                {curriculumData.map((group, groupIndex) => {
                  const colors = groupColors[group.group] || groupColors["Junior"];
                  const icon = groupIcons[group.group] || <BookOpen className="w-5 h-5" />;

                  return (
                    <AccordionItem
                      key={group.group}
                      value={`group-${groupIndex}`}
                      className="border border-border/50 rounded-xl bg-card/50 overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.accent} flex items-center justify-center ${colors.text} shrink-0`}
                          >
                            {icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{group.group}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">Age {group.ageRange}</p>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-6 pb-6">
                        <Accordion type="multiple" className="space-y-3 mt-2">
                          {group.sections.map((section, sectionIndex) => (
                            <AccordionItem
                              key={section.title}
                              value={`section-${groupIndex}-${sectionIndex}`}
                              className="border border-border/30 rounded-lg bg-background/50 overflow-hidden"
                            >
                              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/20 transition-colors text-base">
                                <span className="font-medium text-foreground">{section.title}</span>
                              </AccordionTrigger>

                              <AccordionContent className="px-4 pb-4">
                                <ul className="space-y-2.5 mt-2">
                                  {section.lessons.map((lesson) => (
                                    <li
                                      key={lesson.number}
                                      className="flex items-start gap-3 py-2 px-3 rounded-lg bg-muted/20"
                                    >
                                      <span className="text-sm font-medium text-accent min-w-[2rem]">
                                        {lesson.number}.
                                      </span>
                                      <span className="text-sm text-foreground flex-1">{lesson.title}</span>
                                      {lesson.regionExamFocus && (
                                        <Badge
                                          variant="outline"
                                          className="border-accent/50 text-accent bg-accent/5 text-xs shrink-0"
                                        >
                                          Region Exam Focus
                                        </Badge>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <div className="flex justify-center">
                <div className="card-warm max-w-2xl w-full text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-gold-soft flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Curriculum Access</h2>
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
                    Detailed lesson plans and curriculum materials are available upon request or for enrolled students. Please contact the church for more information.
                  </p>
                  <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-primary-foreground">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-cream page-section">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Enroll Your Child?</h2>
            <p className="text-muted-foreground mb-6">
              Join our Scripture School family and give your child the gift of biblical education in a nurturing
              environment.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-primary-foreground">
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
              >
                <Link to="/ministries/scripture-school">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
