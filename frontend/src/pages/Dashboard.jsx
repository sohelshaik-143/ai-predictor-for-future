import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell,
} from 'recharts';
import { GlassCard } from '../components/ui/GlassCard';
import { LayoutDashboard, Compass, Briefcase, Zap, FileText, Settings, LogOut, Bell, Search, TrendingUp, CheckCircle, BrainCircuit } from 'lucide-react';
import { logoutUser } from '../api/api';

import { 
  predictCareerMatch, 
  predictSalaryGrowth, 
  detectSkillGap, 
  generateRoadmap, 
  scoreReadiness 
} from '../api/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Get contextual data
  const assessmentData = JSON.parse(localStorage.getItem('user_assessment') || "{}");
  const userName = localStorage.getItem('user_name') || 'Aura Professional';
  const roleName = assessmentData.currentRole || 'Premium Tier';
  
  // Dynamic State for AI Data
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [salaryData, setSalaryData] = useState([]);
  const [skillData, setSkillData] = useState([]);
  const [careerMatch, setCareerMatch] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [readiness, setReadiness] = useState({ score: 0, status: '', color: '' });

  const loadAIData = async () => {
    try {
      const [salaryRes, skillRes, matchRes, roadmapRes, readyRes] = await Promise.all([
        predictSalaryGrowth(80000),
        detectSkillGap('Senior Software Engineer'),
        predictCareerMatch(),
        generateRoadmap(),
        scoreReadiness()
      ]);
      setSalaryData(salaryRes);
      setSkillData(skillRes);
      setCareerMatch(matchRes);
      setRoadmap(roadmapRes);
      setReadiness(readyRes);
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
      setIsRegenerating(false);
    }
  };

  React.useEffect(() => {
    loadAIData();
  }, []);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    // Add some random perturbations to simulate dynamic generation
    setSalaryData(prev => prev.map((s, i) => i === 0 ? s : { ...s, projected: s.projected + (Math.random() > 0.5 ? 2000 : -2000) }));
    setSkillData(prev => prev.map(s => ({ ...s, A: Math.min(150, s.A + (Math.random() * 20 - 5)) })));
    setCareerMatch(prev => {
      const updated = prev.map(m => ({ ...m, value: Math.min(100, Math.max(0, m.value + Math.round(Math.random() * 10 - 5))) }));
      updated.sort((a,b) => b.value - a.value);
      return updated;
    });
    setTimeout(() => setIsRegenerating(false), 2000);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-white font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 bg-gradient-mesh opacity-50 pointer-events-none" />
      
      {/* Sidebar */}
      <div className="relative z-10 w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col transition-all">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg">AuraAI</span>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'predictions', icon: Compass, label: 'Predictions' },
            { id: 'skills', icon: Zap, label: 'Skill Gap' },
            { id: 'salary', icon: TrendingUp, label: 'Salary Forecast' },
            { id: 'interview', icon: Briefcase, label: 'Interview Prep' },
            { id: 'roadmap', icon: FileText, label: 'Roadmap' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-white/40'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
            <Settings className="w-5 h-5 text-white/40" /> Settings
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
            <LogOut className="w-5 h-5 text-red-500/40" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-96">
            <Search className="w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Ask Aura AI for insights..." 
              className="bg-transparent border-none text-sm text-white placeholder-white/40 focus:outline-none w-full"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-white/60 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold">{userName}</div>
                <div className="text-xs text-white/40">{roleName}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-secondary p-[2px]">
                <div className="w-full h-full rounded-full bg-[#09090b] flex items-center justify-center font-bold text-xs">
                  {userName.substring(0,2).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Header Area */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back, {userName.split(' ')[0]}.</h1>
                <p className="text-white/50 text-sm">Your intelligent {assessmentData.targetRole || 'career'} trajectory is on track. Here's your latest forecast.</p>
              </div>
              <button 
                onClick={handleRegenerate} 
                disabled={isRegenerating}
                className={`bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isRegenerating ? 'opacity-50 blur-[1px]' : ''}`}
              >
                <Zap className={`w-4 h-4 text-accent ${isRegenerating ? 'animate-pulse' : ''}`} /> 
                {isRegenerating ? 'Regenerating AI Data...' : 'Regenerate Prediction'}
              </button>
            </div>

            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50 rounded-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { title: 'Career Match Score', value: `${careerMatch[0]?.value || 0}%`, badge: 'Top Match', color: 'text-primary' },
                    { title: 'Salary Trajectory', value: `$${Math.round((salaryData[salaryData.length-1]?.projected || 0) / 1000)}k`, badge: `By ${salaryData[salaryData.length-1]?.year}`, color: 'text-accent' },
                    { title: 'Market Demand', value: 'High', badge: 'Top 10%', color: 'text-secondary' },
                    { title: 'Readiness Score', value: `${readiness.score}/100`, badge: readiness.status, color: readiness.color },
                  ].map((stat, idx) => (
                    <GlassCard key={idx} className="p-5">
                      <div className="text-white/50 text-sm font-medium mb-2">{stat.title}</div>
                      <div className={`text-3xl font-bold mb-3 ${stat.color}`}>{stat.value}</div>
                      <div className="inline-block px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                        {stat.badge}
                      </div>
                    </GlassCard>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <GlassCard className="lg:col-span-2 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold">5-Year Salary Growth Forecast</h3>
                      <button className="text-xs text-primary hover:underline" onClick={() => setActiveTab('salary')}>View Breakdown</button>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salaryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                          <YAxis tickFormatter={(val) => `$${val/1000}k`} stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: 'rgba(9,9,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Projected']}
                          />
                          <Area type="monotone" dataKey="projected" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorProjected)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                
                  {/* Career Radar */}
                  <GlassCard className="p-6 flex flex-col">
                    <div className="mb-2">
                      <h3 className="text-lg font-bold">Skill Gap Analysis</h3>
                      <p className="text-xs text-white/40">Current vs Required</p>
                    </div>
                    <div className="flex-1 min-h-[300px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 10}} />
                          <Radar name="Current Skills" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                          <Radar name="Required Target" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeDasharray="3 3" />
                          <RechartsTooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ backgroundColor: 'black', border: '1px solid #333', borderRadius: '8px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 mt-6">
                  <GlassCard className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold">AI Priority Roadmap</h3>
                      <span className="text-xs text-accent">{Math.round((roadmap.filter(r => r.status === 'completed').length / roadmap.length) * 100 || 0)}% Completed</span>
                    </div>
                    <div className="space-y-4">
                      {roadmap.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            item.status === 'completed' ? 'bg-primary/20 text-primary' : 
                            item.status === 'in-progress' ? 'bg-accent/20 text-accent animate-pulse' : 'bg-white/10 text-white/30'
                          }`}>
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${item.status === 'pending' ? 'text-white/60' : 'text-white'}`}>{item.title}</h4>
                          </div>
                          {item.status === 'in-progress' && <span className="text-xs font-semibold text-accent border border-accent/30 px-2 py-1 rounded bg-accent/10">Action</span>}
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h3 className="text-lg font-bold mb-6">Optimal Role Match Probabilities</h3>
                    <div className="space-y-6">
                      {careerMatch.map((role, idx) => (
                        <div key={idx} className="relative">
                          <div className="flex justify-between text-sm font-medium mb-2">
                            <span>{role.name}</span>
                            <span style={{ color: role.color }}>{role.value}% Match</span>
                          </div>
                          <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${role.value}%` }}
                              transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: role.color }}
                            />
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-6xl opacity-10">🧠</div>
                        <h4 className="text-sm font-bold text-primary mb-1">Aura Insight</h4>
                        <p className="text-xs text-white/70 leading-relaxed">
                          Your skill trajectory heavily favors a Software Engineering role. To reach the 100% threshold, we recommend focusing on advanced distributed systems within the next 3 weeks.
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </>
            )}

            {activeTab === 'predictions' && (
              <GlassCard className="p-8 pb-20">
                <h3 className="text-2xl font-bold mb-6">Career Path Predictions</h3>
                <div className="space-y-8">
                  {careerMatch.map((role, idx) => (
                    <div key={idx} className="relative">
                      <div className="flex justify-between text-lg font-medium mb-2">
                        <span>{role.name}</span>
                        <span style={{ color: role.color }}>{role.value}% Match Probablity</span>
                      </div>
                      <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${role.value}%` }}
                          transition={{ duration: 1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: role.color }}
                        />
                      </div>
                      <p className="text-white/60 text-sm">Based on your current skills and active roadmap execution, this aligns securely with market demand expected in 2025.</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {activeTab === 'skills' && (
              <GlassCard className="p-8 pb-20 h-auto flex flex-col items-center">
                <h3 className="text-2xl font-bold mb-2">Detailed Skill Gap Detector</h3>
                <p className="text-white/50 mb-8">Comprehensive radar mapping against 10M+ tech resumes.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mt-4">
                  {/* Radar Chart */}
                  <div className="flex flex-col items-center bg-white/5 border border-white/5 rounded-3xl p-6">
                    <h4 className="text-lg font-bold mb-4">Competency Map</h4>
                    <div className="w-full h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 13}} />
                          <Radar name="Current Mastery" dataKey="A" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.4} />
                          <Radar name="Target Requirement" dataKey="B" stroke="#10b981" strokeWidth={3} fill="#10b981" fillOpacity={0.2} strokeDasharray="5 5" />
                          <RechartsTooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ backgroundColor: 'black', border: '1px solid #333', borderRadius: '8px' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Dynamic Pie Chart */}
                  <div className="flex flex-col items-center bg-white/5 border border-white/5 rounded-3xl p-6">
                    <h4 className="text-lg font-bold mb-4">Skill Weight Distribution</h4>
                    <div className="w-full h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={skillData} 
                            dataKey="A" 
                            nameKey="subject" 
                            cx="50%" cy="50%" 
                            innerRadius={80} 
                            outerRadius={120} 
                            paddingAngle={5}
                          >
                            {skillData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'][index % 5]} />
                            ))}
                          </Pie>
                          <RechartsTooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {activeTab === 'salary' && (
              <GlassCard className="p-8 pb-20">
                <h3 className="text-2xl font-bold mb-6">Advanced Salary Trajectory</h3>
                <div className="flex-1 min-h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.8)', fontSize: 14}} />
                      <YAxis tickFormatter={(val) => `$${val/1000}k`} stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.8)', fontSize: 14}} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'rgba(9,9,11,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Projected Base Salary']}
                      />
                      <Area type="monotone" dataKey="projected" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorProjected)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            )}

            {activeTab === 'roadmap' && (
              <GlassCard className="p-8 pb-20">
                <h3 className="text-2xl font-bold mb-6">Actionable Growth Roadmap</h3>
                <div className="space-y-6">
                  {roadmap.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.status === 'completed' ? 'bg-primary/20 text-primary' : 
                        item.status === 'in-progress' ? 'bg-accent/20 text-accent animate-pulse' : 'bg-white/10 text-white/30'
                      }`}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg font-medium ${item.status === 'pending' ? 'text-white/60' : 'text-white'}`}>{item.title}</h4>
                        <p className="text-white/40 text-sm mt-1">Generated by AI based on market deficiencies.</p>
                      </div>
                      <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                        View Focus Mode
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {activeTab === 'interview' && (
              <GlassCard className="p-8 pb-20 text-center">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-6 opacity-80 animate-pulse">
                    <Briefcase className="w-10 h-10 text-white" />
                 </div>
                 <h3 className="text-3xl font-bold mb-4">Technical Readiness: {readiness.score}/100</h3>
                 <p className="text-white/60 max-w-lg mx-auto mb-8 font-light leading-relaxed">
                   According to recent mock sessions and skill radar mapping, your System Design fundamentals are trailing. Launch an interactive AI voice mock-interview to level up your verbal explanations.
                 </p>
                 <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition-colors">
                   Start Practice Interview
                 </button>
              </GlassCard>
            )}

          </motion.div>
        </main>
      </div>
    </div>
  );
}
