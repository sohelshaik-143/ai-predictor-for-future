import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagneticButton } from '../components/ui/MagneticButton';
import { loginUser } from '../api/api';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginUser({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {/* subtle top glare */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
            <p className="text-white/50 text-sm font-light">Enter your credentials to access your predictions.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-4 rounded-xl mb-6 text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block tracking-wide text-white/70 text-xs font-bold mb-2 uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                placeholder="alex@example.com"
              />
            </div>
            <div>
              <label className="block tracking-wide text-white/70 text-xs font-bold mb-2 uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <MagneticButton 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-base"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Sign In to AuraAI"}
              </MagneticButton>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/50">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-primary hover:text-white font-semibold transition-colors">
                Apply for Access
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
