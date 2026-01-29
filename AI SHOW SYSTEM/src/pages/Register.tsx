import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Box, Hexagon, ArrowLeft, Loader2, Component, CloudDownload } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

// --- Zod Schemas ---
const participantSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    department: z.string().min(2, "Department is required"),
    level: z.string().min(1, "Level is required"),
    projectTitle: z.string().optional(),
});

const organizerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.string().min(2, "Role/Position is required"),
});

const alumniSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
});

type ParticipantForm = z.infer<typeof participantSchema>;
type OrganizerForm = z.infer<typeof organizerSchema>;
type AlumniForm = z.infer<typeof alumniSchema>;

// Shared Input Component
const Input = ({ label, error, ...props }: any) => (
    <div className="mb-5">
        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 px-1">{label}</label>
        <input
            {...props}
            className={`w-full glass-dark border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-showcase-cyan/50 transition-all duration-300`}
        />
        {error && (
            <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-[10px] font-bold uppercase tracking-tighter mt-1.5 block px-1"
            >
                {error.message}
            </motion.span>
        )}
    </div>
);

import { toPng } from 'html-to-image';
import { API_ENDPOINTS } from '../config/api';

const Badge = ({ data }: { data: any }) => {
    const downloadBadge = () => {
        const element = document.getElementById('digital-badge');
        if (element) {
            toPng(element, { cacheBust: true, pixelRatio: 3 })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `emerge2026-pass-${data.fullName.replace(/\s+/g, '-').toLowerCase()}.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch((err) => {
                    console.error('Badge capture failed:', err);
                    alert("Capture failed. Try taking a screenshot!");
                });
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div
                id="digital-badge"
                className="w-full max-w-[300px] sm:max-w-xs bg-showcase-dark rounded-[2.5rem] border border-white/10 relative overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-showcase-cyan/10 rounded-full blur-[60px] -z-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-showcase-blue/10 rounded-full blur-[60px] -z-10" />

                {/* Top Section */}
                <div className="p-8 pb-6 flex flex-col items-center border-b border-dashed border-white/20 relative">
                    {/* Official Logo */}
                    <div className="w-12 h-12 mb-6 p-1 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                        <img src={logo} alt="Veritas Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-showcase-cyan font-black tracking-[0.4em] text-[8px] uppercase mb-1">Official Entry Pass</span>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter">EMERGE 2026</h3>

                    {/* Left/Right Notches (Hybrid Ticket feel) */}
                    <div className="absolute -left-3 bottom-0 -mb-3 w-6 h-6 bg-black rounded-full border border-white/10" />
                    <div className="absolute -right-3 bottom-0 -mb-3 w-6 h-6 bg-black rounded-full border border-white/10" />
                </div>

                {/* Middle Info Section */}
                <div className="p-8 py-10 space-y-8 flex-1">
                    <div className="space-y-1 text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Registrant</span>
                        <p className="text-xl font-black text-white px-2 break-words leading-tight uppercase font-sans tracking-tight">
                            {data.fullName}
                        </p>
                    </div>

                    <div className="space-y-1 text-center">
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Classification</span>
                        <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-lg">
                            <p className="text-sm font-black text-showcase-cyan italic uppercase tracking-widest">{data.type}</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section with QR */}
                <div className="p-8 pt-0 flex flex-col items-center">
                    <div className="w-full p-4 bg-white/[0.03] rounded-3xl border border-white/5 flex flex-col items-center gap-4">
                        {/* QR Code Mock */}
                        <div className="w-24 h-24 bg-white/90 rounded-xl p-3 flex items-center justify-center relative shadow-inner">
                            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-0.5 p-3">
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} className={`rounded-[1px] ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`} />
                                ))}
                            </div>
                            <Box className="text-black/20 w-8 h-8 relative z-10" />
                        </div>
                        <div className="text-center">
                            <p className="text-[8px] font-mono text-gray-500 tracking-widest leading-none">VERITAS UNV / ID-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 mb-2">
                        <div className="w-1 h-1 bg-showcase-cyan rounded-full animate-pulse" />
                        <span className="text-[7px] font-black text-gray-600 uppercase tracking-[0.5em] italic">Authorized Entry Only</span>
                    </div>
                </div>
            </div>

            <button
                onClick={downloadBadge}
                className="mt-8 group flex items-center gap-3 px-8 py-4 glass-dark border border-white/10 rounded-2xl text-white font-black tracking-widest text-[10px] hover:bg-showcase-cyan hover:text-showcase-dark hover:border-showcase-cyan transition-all duration-300 transform hover:scale-105"
            >
                <CloudDownload size={16} className="group-hover:animate-bounce" /> SAVE PASS TO DEVICE
            </button>
        </div>
    );
};

const Register = () => {
    const [activeTab, setActiveTab] = useState<'participant' | 'organizer' | 'alumni'>('participant');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [regData, setRegData] = useState<any>(null);

    const participantForm = useForm<ParticipantForm>({ resolver: zodResolver(participantSchema) });
    const organizerForm = useForm<OrganizerForm>({ resolver: zodResolver(organizerSchema) });
    const alumniForm = useForm<AlumniForm>({ resolver: zodResolver(alumniSchema) });

    const onSubmit = async (data: any, type: string) => {
        setIsSubmitting(true);
        try {
            const payload = {
                full_name: data.fullName,
                email: data.email,
                type: type.toLowerCase(),
                phone: '',
                institution: data.department || '',
                role: data.role || data.level || '',
                team_name: data.projectTitle || '',
                graduation_year: ''
            };
            
            const res = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const result = await res.json();
            
            if (res.ok) {
                setRegData({ ...data, type, date: new Date().toISOString() });
                setIsSuccess(true);
            } else {
                alert(result.error || 'Registration failed');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess && regData) {
        return (
            <div className="min-h-screen py-16 px-4 relative overflow-hidden flex flex-col items-center justify-center">
                {/* Hybrid Background Decor */}
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-showcase-cyan/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-showcase-blue/5 rounded-full blur-[120px]" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="w-20 h-20 bg-showcase-cyan/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-showcase-cyan/30">
                        <Hexagon className="w-10 h-10 text-showcase-cyan" />
                    </div>
                    <h2 className="text-4xl font-black text-white italic">YOU'RE IN!</h2>
                    <p className="text-gray-400 mt-2">Your registration for Emerge 2026 is confirmed.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Badge data={regData} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 flex flex-col items-center gap-6"
                >
                    <Link to="/" className="px-10 py-4 glass text-white font-black rounded-2xl hover:bg-white/10 transition-all text-sm tracking-widest uppercase">
                        RETURN TO HUB
                    </Link>
                    <button
                        onClick={() => { setIsSuccess(false); setRegData(null); }}
                        className="text-gray-600 hover:text-white transition-colors text-[10px] font-black tracking-[0.2em] uppercase"
                    >
                        Register Another
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-4 relative overflow-hidden flex flex-col items-center">
            {/* Hybrid Background Decor */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-showcase-cyan/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-showcase-blue/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="w-full max-w-2xl mx-auto">

                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-showcase-cyan hover:text-white transition-colors mb-8 group font-bold tracking-tighter">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 italic">GET <span className="bg-showcase-blue px-4 py-1">INVOLVED</span></h1>
                    <p className="text-showcase-gray font-medium">Join the frontier of AI innovation at Veritas University.</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1.5 glass-dark rounded-2xl mb-12 border-white/10">
                    {[
                        { id: 'participant', label: 'Participant', icon: Component },
                        { id: 'organizer', label: 'Organizer', icon: Layers },
                        { id: 'alumni', label: 'Alumni', icon: Box },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            disabled={isSubmitting}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-black tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-showcase-blue text-white shadow-[0_0_15px_rgba(26,60,94,0.4)]'
                                : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Forms */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="glass p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-2xl border-white/20 relative"
                    >
                        {activeTab === 'participant' && (
                            <form onSubmit={participantForm.handleSubmit((d) => onSubmit(d, 'Participant'))}>
                                <Input label="Full Name" placeholder="e.g. John Doe" {...participantForm.register('fullName')} error={participantForm.formState.errors.fullName} />
                                <Input label="Email Address" type="email" placeholder="john@example.com" {...participantForm.register('email')} error={participantForm.formState.errors.email} />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <Input label="Department" placeholder="Computer Science" {...participantForm.register('department')} error={participantForm.formState.errors.department} />
                                    <Input label="Level" placeholder="400" {...participantForm.register('level')} error={participantForm.formState.errors.level} />
                                </div>
                                <Input label="Project Title (Optional)" placeholder="AI for Agriculture..." {...participantForm.register('projectTitle')} error={participantForm.formState.errors.projectTitle} />
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full mt-6 py-4 bg-white text-showcase-dark font-black rounded-2xl hover:bg-showcase-cyan transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'REGISTER AS PARTICIPANT'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'organizer' && (
                            <form onSubmit={organizerForm.handleSubmit((d) => onSubmit(d, 'Organizer'))}>
                                <Input label="Full Name" placeholder="Enter your full name" {...organizerForm.register('fullName')} error={organizerForm.formState.errors.fullName} />
                                <Input label="Email Address" type="email" placeholder="your.email@example.com" {...organizerForm.register('email')} error={organizerForm.formState.errors.email} />
                                <Input label="Role / Position" placeholder="e.g. Technical Lead" {...organizerForm.register('role')} error={organizerForm.formState.errors.role} />
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full mt-6 py-4 bg-showcase-blue text-white font-black rounded-2xl hover:shadow-[0_0_25px_rgba(26,60,94,0.3)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'JOIN ORGANIZING TEAM'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'alumni' && (
                            <form onSubmit={alumniForm.handleSubmit((d) => onSubmit(d, 'Alumni'))}>
                                <Input label="Full Name" placeholder="Your name" {...alumniForm.register('fullName')} error={alumniForm.formState.errors.fullName} />
                                <Input label="Email Address" type="email" placeholder="your.email@example.com" {...alumniForm.register('email')} error={alumniForm.formState.errors.email} />
                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full mt-6 py-4 bg-showcase-cyan text-showcase-dark font-black rounded-2xl hover:shadow-[0_0_25px_rgba(0,247,255,0.2)] transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'REGISTER AS ALUMNI'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Register;
