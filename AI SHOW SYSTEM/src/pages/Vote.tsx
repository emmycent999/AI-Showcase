import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Vote as VoteIcon, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const Vote = () => {
    const [email, setEmail] = useState('');
    const [teamName, setTeamName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [teams, setTeams] = useState<any[]>([]);

    useEffect(() => {
        fetch(API_ENDPOINTS.teams)
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error('Failed to fetch teams:', err));
    }, []);

    const handleVote = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const res = await fetch(API_ENDPOINTS.vote, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, team_name: teamName })
            });

            const data = await res.json();

            if (res.ok) {
                setIsSuccess(true);
                setMessage('Vote submitted successfully!');
            } else {
                setMessage(data.error || 'Vote submission failed');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen py-16 px-4 relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-showcase-cyan/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-showcase-blue/5 rounded-full blur-[120px]" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 bg-showcase-cyan/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-showcase-cyan/30">
                        <CheckCircle className="w-10 h-10 text-showcase-cyan" />
                    </div>
                    <h2 className="text-4xl font-black text-white italic mb-4">VOTE RECORDED!</h2>
                    <p className="text-gray-400 mb-8">Your vote for {teamName} has been counted.</p>
                    <Link to="/" className="px-10 py-4 glass text-white font-black rounded-2xl hover:bg-white/10 transition-all text-sm tracking-widest uppercase">
                        RETURN HOME
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-4 relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-showcase-cyan/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-showcase-blue/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-showcase-cyan hover:text-white transition-colors mb-8 group font-bold tracking-tighter">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 italic">CAST YOUR <span className="bg-showcase-blue px-4 py-1">VOTE</span></h1>
                    <p className="text-showcase-gray font-medium">Support your favorite team in the hackathon.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 md:p-12 rounded-[2rem] backdrop-blur-2xl border-white/20"
                >
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl ${message.includes('success') ? 'bg-showcase-cyan/10 text-showcase-cyan border border-showcase-cyan/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleVote}>
                        <div className="mb-5">
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">Your Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                className="w-full glass-dark border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-showcase-cyan/50 transition-all duration-300"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">Select Team</label>
                            <div className="grid grid-cols-1 gap-3">
                                {teams.map(team => (
                                    <label key={team.id} className={`glass-dark border rounded-xl p-4 cursor-pointer transition-all ${
                                        teamName === team.name ? 'border-showcase-cyan bg-showcase-cyan/10' : 'border-white/10 hover:border-white/20'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="team"
                                            value={team.name}
                                            checked={teamName === team.name}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-4">
                                            {team.logo_url ? (
                                                <img src={team.logo_url} alt={team.name} className="w-12 h-12 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg" style={{backgroundColor: team.color}} />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold">{team.name}</h3>
                                                <p className="text-xs text-gray-400">{team.category}</p>
                                            </div>
                                            {teamName === team.name && <CheckCircle className="w-5 h-5 text-showcase-cyan" />}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full mt-6 py-4 bg-showcase-cyan text-showcase-dark font-black rounded-2xl hover:shadow-[0_0_25px_rgba(0,247,255,0.2)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><VoteIcon className="w-5 h-5" /> SUBMIT VOTE</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Vote;
