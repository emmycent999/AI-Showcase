import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight, Fingerprint, Wind, Radio, Target, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const targetDate = new Date('2026-01-30T09:00:00');
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) return null;

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return (
        <div className="glass px-8 py-3 rounded-full text-showcase-cyan font-black tracking-widest animate-pulse">
            EVENT IS LIVE!
        </div>
    );

    return (
        <div className="flex gap-2 md:gap-8 mt-10">
            {[
                { label: 'DAYS', value: timeLeft.days },
                { label: 'HOURS', value: timeLeft.hours },
                { label: 'MINS', value: timeLeft.minutes },
                { label: 'SECS', value: timeLeft.seconds },
            ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="glass w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 border-showcase-blue/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-showcase-blue/10 group-hover:bg-showcase-blue/20 transition-colors" />
                        <span className="text-xl sm:text-2xl md:text-3xl font-black text-white relative z-10">{String(unit.value).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[8px] md:text-[10px] font-black text-showcase-cyan tracking-widest">{unit.label}</span>
                </div>
            ))}
        </div>
    );
};

const Home = () => {
    return (
        <div className="flex flex-col gap-16 pb-20 overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex items-center justify-center px-4 pt-24">
                {/* Background Decor - Futuristic AI Vibes */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-showcase-blue/20 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-showcase-cyan/10 rounded-full blur-[150px] animate-pulse-slow delay-1000" />

                    {/* Hybrid Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-50 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center">
                    <div className="text-center space-y-6 max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="inline-block text-showcase-cyan text-sm font-bold tracking-[0.3em] uppercase mb-6">
                                Department of Computer Science
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tight leading-none"
                        >
                            <span className="text-white block">EMERGING</span>
                            <span className="bg-showcase-blue px-4 md:px-6 py-1 md:py-2 inline-block text-white mt-1 md:mt-2">TECH</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="relative"
                        >
                            <h2 className="text-5xl sm:text-7xl md:text-9xl font-black text-white italic opacity-80 leading-none">
                                SHOWCASE <span className="text-outline-white">2026</span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex justify-center"
                        >
                            <CountdownTimer />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-lg md:text-xl text-showcase-gray max-w-2xl mx-auto leading-relaxed mt-4"
                        >
                            Discover innovation and creativity as artificial intelligence projects are displayed across various domains in healthcare, finance, education, climate, robotics and agriculture.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 }}
                            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mt-10 md:mt-12"
                        >
                            <Link to="/register" className="group px-8 md:px-10 py-3.5 md:py-4 bg-white text-showcase-dark font-black rounded-xl md:rounded-full hover:bg-showcase-cyan transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] text-sm md:text-base">
                                REGISTER NOW <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#details" className="px-8 md:px-10 py-3.5 md:py-4 glass text-white font-bold rounded-xl md:rounded-full hover:bg-white/10 transition-all transform hover:scale-105 text-sm md:text-base text-center">
                                EXPLORE EVENT
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Event Info - From Flier */}
            <section id="details" className="container mx-auto px-4 py-10 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: <Calendar className="w-8 h-8" />, label: "DATE", value: "FRIDAY 30TH JANUARY 2026", color: "text-showcase-cyan" },
                        { icon: <Clock className="w-8 h-8" />, label: "TIME", value: "9:00 AM", color: "text-white" },
                        { icon: <MapPin className="w-8 h-8" />, label: "VENUE", value: "NEW LT THEATRE", color: "text-red-500" },
                    ].map((item, i) => (
                        <div key={i} className="glass p-8 rounded-[2rem] border-white/5 group hover:border-showcase-cyan/30 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-showcase-cyan/5 rounded-full blur-3xl -z-10 group-hover:bg-showcase-cyan/10 transition-colors" />
                            <div className={`${item.color} mb-6 transform group-hover:scale-110 transition-transform`}>{item.icon}</div>
                            <h3 className="text-gray-500 text-xs font-black tracking-[0.2em] mb-2">{item.label}</h3>
                            <p className="text-2xl font-black text-white italic tracking-tighter leading-tight">{item.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Tech Stack Section */}
            <section className="bg-showcase-blue/10 py-20 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-white mb-4 italic">CORE TECHNOLOGIES</h2>
                        <div className="w-24 h-1 bg-showcase-cyan mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { icon: Fingerprint, name: "SECURITY" },
                            { icon: Wind, name: "VELOCITY" },
                            { icon: Radio, name: "CONNECT" },
                            { icon: Target, name: "PRECISION" },
                            { icon: Database, name: "DEEP LEARNING" },
                        ].map((tech, i) => (
                            <div key={i} className="glass p-6 text-center group hover:bg-showcase-cyan hover:text-showcase-dark transition-all duration-300 rounded-xl">
                                <div className="flex justify-center mb-4 opacity-50 group-hover:opacity-100 transition-opacity"><tech.icon className="w-8 h-8" /></div>
                                <span className="font-bold text-sm tracking-tighter">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Speakers / Footer Detail */}
            <section className="container mx-auto px-4 pb-20">
                <div className="max-w-4xl mx-auto glass p-1 rounded-full flex flex-col md:flex-row items-center justify-between px-10 py-6 text-sm font-bold tracking-wide">
                    <div className="flex flex-col text-center md:text-left">
                        <span className="text-showcase-cyan opacity-80">HOD, COMPUTER SCIENCE</span>
                        <span className="text-white">ASSOC. PROF JOE ESSIEN</span>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden md:block" />
                    <div className="flex flex-col text-center md:text-right mt-4 md:mt-0">
                        <span className="text-showcase-cyan opacity-80">ORGANIZER</span>
                        <span className="text-white">DR. FELIX ULOKO</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
