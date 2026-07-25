"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Star,
  ChevronDown,
  Heart,
  Users,
  MessageCircle,
  Sparkles,
  Waves,
  Compass,
  Smile,
  Trophy,
  HandHeart,
  ShieldCheck,
  Eye,
  GraduationCap,
  UserCheck,
  Ticket,
} from "lucide-react";
import LandingImage from "./LandingImage";
import { landingImages } from "@/lib/landing-images";

export const PHONE = "+32 472 23 24 55";
export const PHONE_TEL = "+32472232455";
export const EMAIL = "lesenfantsdelaubeasbl@gmail.com";

// Page d'inscription en ligne (catalogue des cours et stages)
const INSCRIPTION_URL = "/cours";

const OCEAN = "#1A95BF";

function useRipple() {
  return (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const circle = document.createElement("span");
    const d = Math.max(rect.width, rect.height);
    circle.style.cssText = `position:absolute;border-radius:9999px;background:rgba(255,255,255,.55);pointer-events:none;width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px;transform:scale(0);opacity:1;animation:ripple .6s ease-out forwards;`;
    el.appendChild(circle);
    setTimeout(() => circle.remove(), 650);
  };
}

function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "white";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  const ripple = useRipple();
  const base =
    "btn-ripple inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5";
  const styles = {
    primary: "bg-sun text-white hover:brightness-110",
    secondary: "bg-ocean text-white hover:brightness-110",
    white: "bg-white text-ocean hover:bg-ocean-soft",
  }[variant];
  const cls = `${base} ${styles} ${className}`;
  const handle = (e: React.MouseEvent<HTMLElement>) => {
    ripple(e);
    onClick?.(e);
  };

  if (href?.startsWith("/")) {
    return (
      <Link href={href} onClick={handle} className={cls}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} onClick={handle} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={handle} className={cls}>
      {children}
    </button>
  );
}

function WaveDivider({
  color = OCEAN,
  flip = false,
}: {
  color?: string;
  flip?: boolean;
}) {
  return (
    <div
      className="relative w-full overflow-hidden leading-[0]"
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <svg
        className="animate-wave block h-16 md:h-24"
        style={{ width: "200%" }}
        viewBox="0 0 2880 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 C1680,110 1920,10 2160,60 C2400,110 2640,10 2880,60 L2880,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

type Bubble = { size: number; left: number; dur: number; delay: number };

function Bubbles() {
  // Générées après le montage : des valeurs aléatoires au rendu serveur
  // provoqueraient une erreur d'hydratation.
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  useEffect(() => {
    setBubbles(
      Array.from({ length: 14 }, () => ({
        size: 10 + Math.random() * 30,
        left: Math.random() * 100,
        dur: 8 + Math.random() * 10,
        delay: -Math.random() * 12,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="animate-bubble absolute bottom-0 rounded-full bg-white/40 ring-1 ring-white/60"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {children}
    </section>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .7s ease-out ${delay}ms, transform .7s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const NAV_LINKS: [string, string][] = [
  ["Accueil", "#accueil"],
  ["Notre approche", "#approche"],
  ["Tarifs", "#tarifs"],
  ["Avis", "#avis"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"],
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
        <a href="#accueil" className="flex items-center gap-2">
          <LandingImage
            src={landingImages.logo}
            alt="Logo Les enfants de l'aube - école de natation Namur"
            className="h-10 md:h-12 w-auto"
            priority
          />
          <span className="font-display font-bold text-ocean text-lg md:text-xl leading-tight hidden sm:block">
            Les enfants
            <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            {"de l'aube"}
          </span>
        </a>
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(([l, h]) => (
            <a
              key={h}
              href={h}
              className="text-sm font-semibold text-foreground/80 hover:text-sun transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={`tel:${PHONE_TEL}`}
            className="hidden md:inline-flex items-center gap-2 text-ocean font-bold hover:text-sun transition-colors"
          >
            <Phone className="h-4 w-4" /> {PHONE}
          </a>
          <CTAButton href={`tel:${PHONE_TEL}`} className="!px-4 !py-2.5 !text-sm">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Appelez-nous</span>
            <span className="sm:hidden">Appeler</span>
          </CTAButton>
          <button
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map(([l, h]) => (
              <a
                key={h}
                href={h}
                onClick={() => setOpen(false)}
                className="py-2 font-semibold text-foreground/80"
              >
                {l}
              </a>
            ))}
            <a
              href={`tel:${PHONE_TEL}`}
              className="py-2 font-bold text-ocean flex items-center gap-2"
            >
              <Phone className="h-4 w-4" /> {PHONE}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <Section id="accueil" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ocean-soft via-white to-sun-soft" />
      <Bubbles />
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-10 md:pt-16 pb-8 md:pb-16 grid lg:grid-cols-2 gap-10 items-center relative">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-sm font-bold text-ocean shadow-sm">
            <Sparkles className="h-4 w-4 text-sun" /> Namur • Dès 4 ans
          </span>
          <h1 className="mt-5 font-display font-bold text-4xl md:text-6xl leading-[1.05] text-ocean">
            Votre enfant apprend à nager,
            <br />
            <span className="text-sun">{"en confiance et en s'amusant."}</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-foreground/70 max-w-xl">
            École de natation à Namur, dès 4 ans. Une approche ludique et
            sécurisante, portée par des maîtres-nageurs diplômés en petits
            groupes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton href={`tel:${PHONE_TEL}`}>
              <Phone className="h-5 w-5" /> Appelez-nous
            </CTAButton>
            <CTAButton href="#tarifs" variant="secondary">
              Voir les tarifs
            </CTAButton>
          </div>
          <p className="mt-5 text-sm text-foreground/60 font-medium">
            {"✓ Plus de 20 ans d'expérience"} &nbsp;•&nbsp; ✓ Maîtres-nageurs
            diplômés &nbsp;•&nbsp; ✓ Groupes réduits
          </p>
        </div>
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-md mx-auto ring-8 ring-white">
            <LandingImage
              src={landingImages.heroPool}
              alt="Enfants souriants avec leur moniteur de natation à Namur"
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <LandingImage
            src={landingImages.mascotte}
            alt="Mascotte pieuvre Les enfants de l'aube"
            className="animate-float absolute -bottom-6 -left-6 md:-left-14 w-32 md:w-48 drop-shadow-2xl"
            priority
          />
          <div className="absolute -top-4 -right-2 md:-right-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2">
            <div className="flex text-sun">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-bold text-ocean">Parents ravis</span>
          </div>
        </div>
      </div>
      <WaveDivider color="white" />
      <div className="h-4 bg-white -mt-1" />
    </Section>
  );
}

function Approche() {
  const items = [
    {
      icon: Heart,
      title: "Ambiance familiale",
      text: "Un cadre chaleureux et rassurant, où votre enfant se sent à l'aise dès le premier cours.",
    },
    {
      icon: Users,
      title: "Groupes réduits",
      text: "Un suivi vraiment personnalisé : chaque enfant progresse à son rythme, jamais noyé dans la masse.",
    },
    {
      icon: MessageCircle,
      title: "Feedback après chaque cours",
      text: "Vous savez exactement ce que votre enfant a appris et sur quoi il travaille.",
    },
    {
      icon: Sparkles,
      title: "Pédagogie ludique",
      text: "Le plaisir avant tout. Un enfant qui s'amuse dans l'eau apprend plus vite et plus durablement.",
    },
  ];
  return (
    <Section id="approche" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-ocean-soft text-ocean text-xs font-bold uppercase tracking-wider px-3 py-1">
            <Heart className="h-3.5 w-3.5" /> Notre approche
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-5xl text-ocean">
            Pourquoi les parents nous{" "}
            <span className="text-sun">confient leurs enfants</span>
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Une approche humaine, pensée pour que votre enfant progresse en
            confiance.
          </p>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 100} className="h-full">
              <article className="group h-full bg-ocean-soft rounded-[2rem] p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white border border-transparent hover:border-ocean/15">
                <div className="h-14 w-14 rounded-2xl bg-white group-hover:bg-sun-soft flex items-center justify-center shadow-sm transition-colors">
                  <it.icon className="h-7 w-7 text-sun" />
                </div>
                <h3 className="mt-5 font-display font-bold text-xl text-ocean">
                  {it.title}
                </h3>
                <p className="mt-1.5 text-foreground/70">{it.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Benefices() {
  const items = [
    {
      icon: Waves,
      title: "Aisance aquatique",
      text: "Être à l'aise dans l'eau, quelle que soit la profondeur.",
    },
    {
      icon: Compass,
      title: "Autonomie",
      text: "Se déplacer seul, sans peur, avec les bons réflexes.",
    },
    {
      icon: Smile,
      title: "Confiance en soi",
      text: "Oser, essayer, réussir — et le vivre fièrement.",
    },
    {
      icon: Trophy,
      title: "Bases solides",
      text: "Brasse, dos, crawl : les fondamentaux pour la vie.",
    },
    {
      icon: HandHeart,
      title: "Persévérance",
      text: "Apprendre à progresser étape par étape, avec plaisir.",
    },
  ];
  return (
    <Section className="relative py-20 md:py-28 bg-ocean-deep text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px, 90px 90px",
        }}
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <Reveal>
            <span className="inline-block rounded-full bg-white/15 backdrop-blur text-white text-xs font-bold uppercase tracking-wider px-3 py-1">
              Bénéfices
            </span>
            <h2 className="mt-4 font-display font-bold text-3xl md:text-5xl max-w-2xl">
              Bien plus que <span className="text-sun-soft">nager</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg text-white/90 md:text-right md:max-w-sm">
              Ce que votre enfant emporte avec lui, bien au-delà de la piscine.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-white/10 rounded-3xl overflow-hidden">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80} className="h-full">
              <div className="group h-full bg-ocean-deep p-6 md:p-7 transition-colors duration-300 hover:bg-ocean">
                <span className="font-display text-sm text-sun-soft font-bold">
                  0{i + 1}
                </span>
                <div className="mt-4 h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-sun group-hover:scale-110 transition-all">
                  <it.icon className="h-6 w-6 text-sun-soft group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display font-bold text-xl">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-white/90 leading-relaxed">
                  {it.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Securite() {
  const items = [
    { icon: GraduationCap, t: "Maîtres-nageurs diplômés" },
    { icon: Eye, t: "Surveillance constante" },
    { icon: UserCheck, t: "Formation interne continue" },
    { icon: ShieldCheck, t: "Encadrement pro à chaque instant" },
  ];
  return (
    <Section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] ring-8 ring-ocean-soft">
            <LandingImage
              src={landingImages.coach}
              alt="Moniteur diplômé encadrant un enfant en cours de natation à Namur"
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <span className="inline-block rounded-full bg-ocean-soft text-ocean text-sm font-bold px-4 py-1.5">
            Cadre professionnel
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-5xl text-ocean">
            Un cadre <span className="text-sun">sécurisé</span> et professionnel
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            La sécurité de votre enfant est notre priorité absolue, à chaque
            instant.
          </p>
          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {items.map(({ icon: Icon, t }) => (
              <li
                key={t}
                className="flex items-start gap-3 bg-ocean-soft rounded-2xl p-4"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white flex items-center justify-center">
                  <Icon className="h-5 w-5 text-ocean" />
                </div>
                <span className="font-semibold text-foreground/90">{t}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

function Progression() {
  const steps = [
    {
      n: "01",
      t: "Accoutumance 1",
      d: "Familiarisation avec l'eau : immersion, respiration, premiers appuis.",
    },
    {
      n: "02",
      t: "Accoutumance 2",
      d: "Flottaison, repères dans l'eau et premiers éléments techniques.",
    },
    {
      n: "03",
      t: "Initiation",
      d: "Bases de la brasse, du dos crawlé et du crawl. Coordination et autonomie.",
    },
    {
      n: "04",
      t: "Perfectionnement",
      d: "Technique affinée : glisse, amplitude, efficacité.",
    },
  ];
  return (
    <Section className="py-20 md:py-28 bg-gradient-to-b from-white via-ocean-soft/40 to-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-sun-soft text-sun text-xs font-bold uppercase tracking-wider px-3 py-1">
            Parcours
          </span>
          <h2 className="mt-4 font-display font-bold text-3xl md:text-5xl text-ocean">
            Une progression <span className="text-sun">adaptée</span> à chaque
            enfant
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            4 étapes claires, pour avancer à son rythme et sans se décourager.
          </p>
        </Reveal>
        <div className="mt-16 relative">
          <div
            className="hidden lg:block absolute top-8 left-[8%] right-[8%] h-1 bg-gradient-to-r from-ocean via-sun to-ocean rounded-full"
            aria-hidden
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="flex flex-col items-center text-center lg:pt-2">
                  <div className="relative z-10 h-16 w-16 rounded-full bg-white ring-4 ring-ocean/10 flex items-center justify-center shadow-lg">
                    <span className="font-display font-bold text-xl text-ocean">
                      {s.n}
                    </span>
                  </div>
                  <div className="mt-5 bg-ocean-soft rounded-2xl p-5 w-full transition-all duration-300 hover:bg-white hover:shadow-xl border border-transparent hover:border-ocean/10">
                    <h3 className="font-display font-bold text-lg text-ocean">
                      {s.t}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                      {s.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <p className="mt-10 text-center text-foreground/80 max-w-3xl mx-auto bg-sun-soft rounded-2xl p-5">
            <Trophy className="inline h-5 w-5 text-sun mr-1 -mt-1" />
            {"Possibilité d'obtenir un "}
            <strong>brevet homologué ADEPS</strong>
            {" — passages organisés chaque année en juin."}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function Tarifs() {
  const plans = [
    {
      title: "1ère saison",
      period: "sept. – déc.",
      price: "195€",
      note: "Dégressif selon le mois",
      cta: "Nous contacter",
      href: `tel:${PHONE_TEL}`,
    },
    {
      title: "Abonnement annuel",
      period: "année complète",
      price: "475€",
      note: "-50€ sur l'année",
      // Seul point d'entrée vers les inscriptions en ligne
      cta: "Réserver",
      href: INSCRIPTION_URL,
      best: true,
      badge: "Meilleure offre",
    },
    {
      title: "2ème saison",
      period: "jan. – juil.",
      price: "330€",
      note: "Dégressif selon le mois",
      cta: "Nous contacter",
      href: `tel:${PHONE_TEL}`,
    },
  ];
  return (
    <Section id="tarifs" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal className="text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-ocean">
            Des tarifs <span className="text-sun">clairs</span>, sans mauvaise
            surprise
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            1 cours par semaine, au choix le mercredi ou le samedi.
          </p>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div
                className={`relative h-full rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${p.best ? "bg-ocean text-white shadow-2xl scale-[1.03]" : "bg-ocean-soft"}`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sun text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                    {p.badge}
                  </span>
                )}
                <h3
                  className={`font-display font-bold text-2xl ${p.best ? "text-white" : "text-ocean"}`}
                >
                  {p.title}
                </h3>
                <p
                  className={`mt-1 text-sm font-medium ${p.best ? "text-white/80" : "text-foreground/60"}`}
                >
                  {p.period}
                </p>
                <p
                  className={`mt-6 font-display font-bold text-5xl ${p.best ? "text-white" : "text-ocean"}`}
                >
                  {p.price}
                </p>
                <p
                  className={`mt-3 text-sm ${p.best ? "text-white/85" : "text-foreground/70"}`}
                >
                  {p.note}
                </p>
                <CTAButton
                  href={p.href}
                  variant={p.best ? "white" : "primary"}
                  className="mt-8 w-full"
                >
                  {p.href.startsWith("/") ? (
                    <Ticket className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}{" "}
                  {p.cta}
                </CTAButton>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-12 grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-sun-soft p-5 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-sun mt-0.5 shrink-0" />
              <div className="text-sm text-foreground/80">
                <strong className="block text-ocean">
                  Piscine Louis Namêche
                </strong>
                Route de Gembloux 256, 5002 Saint-Servais (Namur)
              </div>
            </div>
            <div className="rounded-2xl bg-sun-soft p-5 flex items-start gap-3">
              <Heart className="h-5 w-5 text-sun mt-0.5 shrink-0" />
              <div className="text-sm text-foreground/80">
                <strong className="block text-ocean">Avantages</strong>
                Attestation mutuelle possible • -10€ pour fratrie ou parrainage
              </div>
            </div>
          </div>
          <div className="mt-10 text-center bg-gradient-to-r from-ocean to-ocean/80 text-white rounded-3xl p-8 md:p-10 shadow-xl">
            <p className="font-display font-bold text-2xl md:text-3xl">
              Une question sur les tarifs ?
            </p>
            <p className="mt-2 text-white/85">
              Appelez-nous, on vous explique tout simplement.
            </p>
            <CTAButton href={`tel:${PHONE_TEL}`} className="mt-6">
              <Phone className="h-5 w-5" /> {PHONE}
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Stages() {
  return (
    <Section className="py-14 bg-ocean-soft">
      <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
        <p className="text-lg md:text-xl text-ocean font-semibold">
          🎒 <strong>Nos stages arrivent en 2027</strong> — nature, escalade,
          accrobranche et cohésion de groupe.{" "}
          <a
            href="#contact"
            className="underline decoration-sun decoration-2 underline-offset-4 hover:text-sun"
          >
            Restez informés.
          </a>
        </p>
      </div>
    </Section>
  );
}

function Temoignages() {
  const testis = [
    {
      name: "Bernadette",
      role: "maman de Roméo",
      text: "Roméo adore ses cours du mercredi. Il a pris confiance en quelques semaines et parle déjà de son brevet.",
    },
    {
      name: "Priscillia",
      role: "parent d'élève",
      text: "Une équipe passionnée et vraiment à l'écoute. Ma fille a progressé sans jamais avoir peur de l'eau.",
    },
    {
      name: "Florence",
      role: "parent d'élève",
      text: "Un cadre professionnel et bienveillant. Chaque enfant est considéré individuellement, on le sent.",
    },
    {
      name: "Magali",
      role: "parent d'élève",
      text: "Rapport qualité/prix imbattable et une pédagogie top. Brevet ADEPS passé avec fierté !",
    },
  ];
  return (
    <Section
      id="avis"
      className="py-20 md:py-28 bg-ocean-soft relative overflow-hidden"
    >
      <div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sun/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-ocean/10 blur-3xl"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <Reveal className="lg:col-span-6">
            <div className="flex text-sun mb-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-ocean leading-tight">
              Les familles nous font <span className="text-sun">confiance</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={100}>
            <div className="grid grid-cols-3 gap-4 max-w-md ml-auto">
              <div className="text-center bg-white rounded-2xl p-4 shadow-sm">
                <div className="font-display font-bold text-3xl text-sun">
                  20+
                </div>
                <div className="text-xs text-foreground/70 mt-1">
                  {"ans d'expérience"}
                </div>
              </div>
              <div className="text-center bg-white rounded-2xl p-4 shadow-sm">
                <div className="font-display font-bold text-3xl text-sun">
                  100+
                </div>
                <div className="text-xs text-foreground/70 mt-1">familles</div>
              </div>
              <div className="text-center bg-white rounded-2xl p-4 shadow-sm">
                <div className="font-display font-bold text-3xl text-sun">
                  5/5
                </div>
                <div className="text-xs text-foreground/70 mt-1">
                  avis parents
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testis.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <blockquote
                className={`h-full bg-white rounded-3xl p-6 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${i % 2 === 1 ? "md:translate-y-6" : ""}`}
              >
                <span className="font-display text-5xl text-sun leading-none">
                  &quot;
                </span>
                <p className="mt-2 text-foreground/85 leading-relaxed text-sm">
                  {t.text}
                </p>
                <footer className="mt-5 pt-4 border-t border-border flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sun to-ocean text-white font-bold flex items-center justify-center font-display text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-ocean text-sm">{t.name}</div>
                    <div className="text-xs text-foreground/60">{t.role}</div>
                  </div>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-14 relative rounded-3xl overflow-hidden aspect-[21/9] shadow-2xl ring-8 ring-ocean-soft">
            <LandingImage
              src={landingImages.joy}
              alt="Enfant heureuse en cours de natation à Namur"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean/70 via-transparent to-transparent" />
            <p className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 text-white font-display font-bold text-2xl md:text-4xl max-w-2xl">
              Le sourire de votre enfant, notre plus belle récompense.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function FAQ() {
  const items = [
    {
      q: "À partir de quel âge ?",
      a: "Dès 4 ans. Exception possible si l'enfant est déjà à l'aise dans l'eau.",
    },
    {
      q: "Cours en groupe ou individuel ?",
      a: "Groupes réduits : progression plus rapide et motivation partagée.",
    },
    {
      q: "Brevet ADEPS ?",
      a: "Oui, brevet homologué avec passages en juin.",
    },
    {
      q: "Mutuelle et réductions ?",
      a: "Attestation mutuelle sur demande. -10€ fratrie/parrainage.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <Reveal className="text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-ocean">
            Vos <span className="text-sun">questions</span>, nos réponses
          </h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {items.map((it, i) => (
            <Reveal key={it.q} delay={i * 80}>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                >
                  <span className="font-display font-bold text-lg text-ocean">
                    {it.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-sun shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-6 text-foreground/75">
                      {it.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <LandingImage
            src={landingImages.mascotte}
            alt="Mascotte"
            className="animate-float w-24 md:w-28"
          />
        </div>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <Section id="contact" className="relative overflow-hidden">
      <WaveDivider color={OCEAN} flip />
      <div className="bg-ocean text-white relative">
        <Bubbles />
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Reveal>
                <h2 className="font-display font-bold text-3xl md:text-5xl">
                  Prêt à <span className="text-sun-soft">plonger</span> ?
                </h2>
                <p className="mt-4 text-lg text-white/85">
                  Un appel suffit pour réserver une place.
                </p>
              </Reveal>
              <Reveal delay={150}>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded-2xl p-5 transition-colors"
                >
                  <div className="h-14 w-14 rounded-2xl bg-sun flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Appelez-nous</div>
                    <div className="font-display font-bold text-2xl md:text-3xl">
                      {PHONE}
                    </div>
                  </div>
                </a>
                <CTAButton
                  href={`tel:${PHONE_TEL}`}
                  className="mt-6 w-full sm:w-auto !text-xl !px-10 !py-5"
                >
                  <Phone className="h-6 w-6" /> Appelez-nous maintenant
                </CTAButton>
                <div className="mt-8 space-y-3 text-white/85">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 mt-0.5 text-sun-soft" />
                    <a href={`mailto:${EMAIL}`} className="hover:underline">
                      {EMAIL}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-sun-soft" />
                    <span>Rue Saint-Joseph 1, 5000 Namur</span>
                  </div>
                </div>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <form
                className="bg-white text-foreground rounded-3xl p-6 md:p-8 shadow-2xl space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <h3 className="font-display font-bold text-2xl text-ocean">
                  Écrivez-nous
                </h3>
                {[
                  { l: "Nom", t: "text", n: "name" },
                  { l: "Email", t: "email", n: "email" },
                  { l: "Téléphone", t: "tel", n: "phone" },
                ].map((f) => (
                  <div key={f.n}>
                    <label className="block text-sm font-semibold text-foreground/80 mb-1.5">
                      {f.l}
                    </label>
                    <input
                      type={f.t}
                      name={f.n}
                      required
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sun focus:border-sun transition"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sun focus:border-sun transition"
                  />
                </div>
                <CTAButton className="w-full">Envoyer</CTAButton>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-white/80">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <LandingImage
              src={landingImages.logo}
              alt="Logo Les enfants de l'aube"
              className="h-10 w-auto"
            />
            <span className="font-display font-bold text-white text-lg">
              Les enfants
              <br />
              {"de l'aube"}
            </span>
          </div>
          <p className="mt-4 text-sm">
            ASBL — École de natation pour enfants à Namur.
          </p>
        </div>
        <div>
          <h4 className="text-white font-display font-bold mb-3">Contact</h4>
          <ul className="text-sm space-y-2">
            <li>
              <a href={`tel:${PHONE_TEL}`} className="hover:text-sun">
                {PHONE}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-sun break-all">
                {EMAIL}
              </a>
            </li>
            <li>Rue Saint-Joseph 1, 5000 Namur</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-display font-bold mb-3">Navigation</h4>
          <ul className="text-sm space-y-2">
            {NAV_LINKS.map(([l, h]) => (
              <li key={h}>
                <a href={h} className="hover:text-sun">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-display font-bold mb-3">Newsletter</h4>
          <p className="text-sm mb-3">
            Restez informés des stages 2027 et nouveautés.
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 min-w-0 rounded-full bg-white/10 border border-white/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sun"
            />
            <button className="rounded-full bg-sun text-white font-bold px-4 text-sm hover:brightness-110 transition">
              OK
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-5 text-xs flex flex-wrap justify-between gap-3">
          <span>
            © {new Date().getFullYear()}{" "}
            {"Les enfants de l'aube ASBL — Tous droits réservés."}
          </span>
          <a href="#" className="hover:text-sun">
            Mentions légales
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-nunito">
      <Header />
      <main>
        <Hero />
        <Approche />
        <Benefices />
        <Securite />
        <Progression />
        <Tarifs />
        <Stages />
        <Temoignages />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
