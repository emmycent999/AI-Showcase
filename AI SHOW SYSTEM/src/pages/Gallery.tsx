import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Cpu, Database, Heart, ExternalLink, Zap } from 'lucide-react';

const Gallery = () => {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('registrations') || '[]');
        setRegistrations(data.filter((r: any) => r.type === 'Participant' && r.projectTitle));
    }, []);

    const filteredProjects = registrations.filter(p => {
        const matchesSearch = p.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
            p.fullName.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || p.department === filter;
        return matchesSearch && matchesFilter;
    });

    const departments = ['All', ...new Set(registrations.map(p => p.department))];

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
            {/* Hybrid Background Decor */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-showcase-cyan/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-showcase-blue/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-showcase-cyan font-black tracking-[0.3em] uppercase text-xs"
                    >
                        Innovation Catalog
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-white italic tracking-tighter"
                    >
                        PROJECT <span className="text-outline-white">SHOWCASE</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base font-medium"
                    >
                        Explore the cutting-edge AI solutions developed by our participants, ranging from robotics to autonomous software agents.
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            placeholder="Search by project or innovator..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full glass-dark border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 sm:py-4 text-white focus:border-showcase-cyan/50 outline-none transition-all placeholder-white/20 font-medium text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setFilter(dept)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${filter === dept
                                    ? 'bg-showcase-blue text-white shadow-lg border-white/20'
                                    : 'glass text-gray-400 hover:text-white border-white/5'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredProjects.map((project, idx) => (
                                <motion.div
                                    key={idx}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="glass rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border-white/5 group hover:border-showcase-cyan/30 transition-all duration-500 flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Zap className="text-showcase-cyan" size={24} />
                                    </div>

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-showcase-blue/20 rounded-xl flex items-center justify-center border border-white/5">
                                            <Cpu className="text-showcase-cyan" size={20} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{project.department}</span>
                                    </div>

                                    <h3 className="text-2xl font-black text-white italic mb-4 leading-tight group-hover:text-showcase-cyan transition-colors">
                                        {project.projectTitle}
                                    </h3>

                                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Developer</span>
                                            <span className="text-white font-bold">{project.fullName}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 glass rounded-lg hover:text-showcase-cyan transition-colors">
                                                <Heart size={18} />
                                            </button>
                                            <button className="p-2 glass rounded-lg hover:text-showcase-cyan transition-colors">
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 glass rounded-[3rem] border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Database className="text-gray-500" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white italic">NO PROJECTS FOUND</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or filters to explore more innovation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
