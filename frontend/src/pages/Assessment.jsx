import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, BookOpen, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { MagneticButton } from '../components/ui/MagneticButton';
import { StaggerText } from '../components/ui/StaggerText';

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    currentRole: '',
    targetRole: '',
    experienceYears: 0,
    topSkills: '',
    goal: 'salary_growth'
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const submitAssessment = () => {
    setLoading(true);
    // Parse skills into array
    const parsedData = {
      ...data,
      skillsArray: data.topSkills.split(',').map(s => s.trim()).filter(Boolean)
    };
    
    // Save to local logic (acting as DB)
    localStorage.setItem("user_assessment", JSON.stringify(parsedData));

    // Fake AI computation time
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 font-sans">
      <div className="fixed inset-0 z-0 bg-gradient-mesh opacity-30" />
      
      <GlassCard className="relative z-10 w-full max-w-2xl p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-1 flex items-center justify-center pulse-glow">
            <div className="w-full h-full bg-[#09090b] rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            <StaggerText text="Calibrating Your AI Engine" />
          </h2>
          <p className="text-white/50 text-sm">
            We need a baseline before Aura can predict your future mapping.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-white/60 font-medium animate-pulse">Running Neural Market Analysis...</p>
          </div>
        ) : (
          <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
             className="space-y-6"
          >
            {step === 1 && (
              <>
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary"/> Current Role</label>
                  <input 
                    name="currentRole" value={data.currentRole} onChange={handleChange}
                    placeholder="e.g. Junior Web Developer" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-2"><Target className="w-4 h-4 text-accent"/> Target Role</label>
                  <input 
                    name="targetRole" value={data.targetRole} onChange={handleChange}
                    placeholder="e.g. Senior Full Stack Engineer" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="pt-6">
                  <MagneticButton onClick={() => setStep(2)} className="w-full py-4 text-sm" disabled={!data.currentRole || !data.targetRole}>
                    Continue
                  </MagneticButton>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white/80 flex items-center gap-2"><Sparkles className="w-4 h-4 text-secondary"/> Core Skills (Comma Separated)</label>
                  <input 
                    name="topSkills" value={data.topSkills} onChange={handleChange}
                    placeholder="e.g. React, Node.js, Python, Mentorship" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-white/80">Years Exp.</label>
                    <input 
                      type="number" name="experienceYears" value={data.experienceYears} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-white/80">Primary Goal</label>
                    <select 
                      name="goal" value={data.goal} onChange={handleChange}
                      className="w-full bg-[#1e1e24] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none"
                    >
                      <option value="salary_growth">Maximize Salary</option>
                      <option value="role_transition">Job Transition</option>
                      <option value="skill_mastery">Skill Mastery</option>
                    </select>
                  </div>
                </div>
                <div className="pt-6 flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">Back</button>
                  <MagneticButton onClick={submitAssessment} className="flex-1 py-4 text-sm group" disabled={!data.topSkills}>
                    <span className="flex items-center justify-center gap-2">
                       Generate Dashboard <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </span>
                  </MagneticButton>
                </div>
              </>
            )}
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}
