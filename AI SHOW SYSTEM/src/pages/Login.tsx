import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fingerprint, SquareUser, ShieldAlert, Zap } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simple mock authentication for demo purposes
        setTimeout(() => {
            if (username === 'admin' && password === 'veritas2026') {
                localStorage.setItem('isAdminAuthenticated', 'true');
                navigate('/admin');
            } else {
                setError('Invalid credentials. Access denied.');
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-showcase-dark">
            {/* Background Decor */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-showcase-blue/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-showcase-cyan/10 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-showcase-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <Fingerprint className="text-showcase-cyan w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter">ADMIN ACCESS</h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Veritas AI Showcase 2026</p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldAlert size={100} />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest"
                            >
                                <Zap size={16} /> {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Username</label>
                            <div className="relative">
                                <SquareUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter admin ID"
                                    className="w-full glass-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/20 outline-none focus:border-showcase-cyan/50 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Security Key</label>
                            <div className="relative">
                                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full glass-dark border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-white/20 outline-none focus:border-showcase-cyan/50 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 ${isLoading
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-showcase-dark hover:bg-showcase-cyan transform hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                }`}
                        >
                            {isLoading ? 'Verifying Identity...' : 'Authorize Login'}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                        Unauthorized access is strictly monitored
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
