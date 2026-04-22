import React from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../api/api";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlassCard } from "../components/ui/GlassCard";
import { MagneticButton } from "../components/ui/MagneticButton";
import { OrbScene } from "../components/ui/OrbScene";
import { StaggerText } from "../components/ui/StaggerText";
import { PlayCircle, ShieldCheck, Zap, BrainCircuit, LineChart, Target, Sparkles, Navigation, Globe2 } from "lucide-react";

const FEATURES = [
  {
    id: "predictor",
    title: "Career Predictor",
    description: "Analyze skills, education, and market trends to forecast your optimal path.",
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    colSpan: "col-span-12 md:col-span-8",
    bg: "bg-gradient-to-br from-primary/10 to-transparent",
  },
  {
    id: "salary",
    title: "Salary Growth AI",
    description: "Predict your 5-year earning potential with 94% accuracy.",
    icon: <LineChart className="w-8 h-8 text-secondary" />,
    colSpan: "col-span-12 md:col-span-4",
    bg: "bg-gradient-to-br from-secondary/10 to-transparent",
  },
  {
    id: "skills",
    title: "Skill Gap Detector",
    description: "Real-time comparison between your current skills and target role requirements.",
    icon: <Target className="w-8 h-8 text-accent" />,
    colSpan: "col-span-12 md:col-span-4",
    bg: "bg-gradient-to-br from-accent/10 to-transparent",
  },
  {
    id: "interview",
    title: "Interview Readiness",
    description: "Score your technical prep and communication skills before the real thing.",
    icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
    colSpan: "col-span-12 md:col-span-4",
    bg: "bg-gradient-to-br from-blue-500/10 to-transparent",
  },
  {
    id: "roadmap",
    title: "Personalized Roadmap",
    description: "Daily task planning and course recommendations tailored to your goals.",
    icon: <Navigation className="w-8 h-8 text-orange-500" />,
    colSpan: "col-span-12 md:col-span-4",
    bg: "bg-gradient-to-br from-orange-500/10 to-transparent",
  },
];

const TRUST_BADGES = [
  { icon: Globe2, text: "Used in 150+ Countries" },
  { icon: ShieldCheck, text: "SOC2 Compliant" },
  { icon: Zap, text: "Sub-50ms Latency" },
];

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-gradient-mesh opacity-60" />
      <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 " />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/5 py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white mb-0 pb-0">Aura<span className="font-light text-white/70">AI</span></h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button className="text-sm font-medium text-white/60 hover:text-white transition-colors" onClick={() => navigate("/")}>Home</button>
          <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Features</button>
          <button className="text-sm font-medium text-white/60 hover:text-white transition-colors" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">Pricing</button>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <MagneticButton variant="primary" onClick={() => navigate("/dashboard")} className="hidden md:flex py-2 px-5 text-sm">
              Open Dashboard
            </MagneticButton>
          ) : (
            <>
              <button className="text-sm font-semibold text-white/80 hover:text-white transition-colors hidden md:block" onClick={() => navigate("/login")}>
                Log in
              </button>
              <MagneticButton variant="primary" onClick={() => navigate("/register")} className="py-2 px-5 text-sm">
                Start Free
              </MagneticButton>
            </>
          )}
        </div>
      </nav>

      <div className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <motion.section 
          style={{ opacity, scale }}
          className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[75vh]"
        >
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wide text-primary mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AURA AI ENGINE 4.0 LIVE
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-6">
              <StaggerText text="Predict Your Future with AI." />
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-xl text-white/50 mb-10 max-w-lg leading-relaxed font-light"
            >
              Career. Salary. Skills. Success — Powered by Intelligent Forecasting and real-time market data.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <MagneticButton onClick={() => navigate(isLoggedIn ? "/dashboard" : "/register")} className="w-full sm:w-auto px-8 py-4 text-base">
                Start Free Prediction
              </MagneticButton>
              <MagneticButton variant="outline" className="w-full sm:w-auto px-8 py-4 text-base group">
                <PlayCircle className="w-5 h-5 mr-2 group-hover:text-primary transition-colors" />
                View Live Demo
              </MagneticButton>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 flex items-center gap-6"
            >
              {TRUST_BADGES.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-2 text-white/40 text-xs font-medium">
                  <badge.icon className="w-4 h-4" />
                  {badge.text}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative h-[500px] w-full hidden lg:block"
          >
            <OrbScene />
          </motion.div>
        </motion.section>

        {/* Features Bento Grid */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Intelligent Forecasting.</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Everything you need to predict, plan, and accelerate your career trajectory.</p>
          </div>

          <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={feature.colSpan}
              >
                <GlassCard className={`h-full flex flex-col justify-between ${feature.bg} border-white/5 hover:border-white/20 transition-colors`}>
                  <div className="mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-white/60 font-light leading-relaxed">{feature.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global CTA Section */}
        <section className="container mx-auto px-6 py-24">
           <GlassCard className="max-w-5xl mx-auto text-center py-20 px-8 bg-gradient-to-t from-primary/10 to-transparent border-t border-primary/20">
             <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 relative z-10">Stop guessing your future.</h2>
             <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto relative z-10 font-light">
               Join elite professionals who use AuraAI to predict their career moves and maximize their earning potential.
             </p>
             <div className="relative z-10">
               <MagneticButton onClick={() => navigate("/register")} className="px-10 py-5 text-lg">
                 Get Started for Free
               </MagneticButton>
             </div>
           </GlassCard>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 text-center text-white/40 text-sm">
        <p>© {new Date().getFullYear()} AuraAI Inc. The future of career intelligence.</p>
      </footer>
    </div>
  );
}
