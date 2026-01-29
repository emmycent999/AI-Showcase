import { motion } from 'framer-motion';
import { Telescope, Satellite, FlagTriangleRight, Podcast, Binary, GlassWater, CircuitBoard, Wind } from 'lucide-react';

const Schedule = () => {
    const events = [
        {
            time: "08:30 AM",
            title: "Check-in & Registration",
            description: "Participants and guests check-in at the main lobby and receive their event badges.",
            icon: FlagTriangleRight,
            category: "Process"
        },
        {
            time: "09:30 AM",
            title: "Opening Ceremony",
            description: "Keynote address by the HOD of Computer Science.",
            icon: Podcast,
            category: "Main Stage"
        },
        {
            time: "10:30 AM",
            title: "Project Showcase Opens",
            description: "Live exhibition of AI projects across all domains. Interactive demos begin.",
            icon: CircuitBoard,
            category: "Showcase"
        },
        {
            time: "01:00 PM",
            title: "Networking and Alumni Engagement",
            description: "Opportunity for innovators to engage with industry experts and alumni.",
            icon: GlassWater,
            category: "Break"
        },
        {
            time: "02:30 PM",
            title: "Special Presentations",
            description: "Selected projects pitch their ideas to  the audience.",
            icon: Wind,
            category: "Main Stage"
        },
        {
            time: "04:30 PM",
            title: "Award Ceremony",
            description: "Recognition of outstanding projects and closing remarks.",
            icon: Binary,
            category: "Closing"
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Hybrid Background Decor */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-showcase-cyan/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-showcase-blue/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-showcase-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5"
                    >
                        <Telescope className="text-showcase-cyan" size={32} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-white italic tracking-tighter"
                    >
                        EVENT <span className="text-outline-white">ROADMAP</span>
                    </motion.h1>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                            <Telescope size={14} className="text-showcase-cyan" /> Friday, Jan 30
                        </div>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                            <Satellite size={14} className="text-showcase-cyan" /> Main Auditorium
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-showcase-blue to-transparent md:-translate-x-1/2" />

                    <div className="space-y-12">
                        {events.map((event, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Dot */}
                                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-showcase-dark border-2 border-showcase-cyan shadow-[0_0_10px_rgba(0,247,255,0.5)] md:-translate-x-1/2 z-10" />

                                {/* Content */}
                                <div className="w-full md:w-[45%] pl-12 md:pl-0">
                                    <div className={`glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/5 hover:border-white/20 transition-all group ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'
                                        }`}>
                                        <div className={`flex items-center gap-3 mb-4 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                                            }`}>
                                            <div className="w-10 h-10 bg-showcase-blue/20 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-showcase-cyan group-hover:text-showcase-dark transition-colors">
                                                <event.icon size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-showcase-cyan font-black italic text-lg leading-none">{event.time}</span>
                                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{event.category}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black text-white italic mb-2 uppercase">{event.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{event.description}</p>
                                    </div>
                                </div>

                                {/* Spacer for desktop */}
                                <div className="hidden md:block w-[45%]" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-24 text-center">
                    <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.3em]">
                        Live updates will be broadcasted throughout the gala
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
