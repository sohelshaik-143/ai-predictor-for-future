import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagneticButton } from '../components/ui/MagneticButton';
import { registerUser } from '../api/api';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-blob" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent to-primary flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create Account</h2>
            <p className="text-white/50 text-sm font-light">Join elite professionals planning their future.</p>
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

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block tracking-wide text-white/70 text-xs font-bold mb-2 uppercase">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                placeholder="Alex Walker"
              />
            </div>
            <div>
              <label className="block tracking-wide text-white/70 text-xs font-bold mb-2 uppercase">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                placeholder="alex@example.com"
              />
            </div>
            <div>
              <label className="block tracking-wide text-white/70 text-xs font-bold mb-2 uppercase">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <MagneticButton 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-base"
                style={{ background: 'linear-gradient(90deg, #10b981, #059669)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Apply for Access"}
              </MagneticButton>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/50">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-primary hover:text-white font-semibold transition-colors">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
