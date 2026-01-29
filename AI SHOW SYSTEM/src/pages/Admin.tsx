import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    SquareUser, Activity, Layers, Box, ScanSearch, Binary,
    CloudDownload, Dna, Calendar, Mail, Send, Plus, Trash2, BarChart3
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Admin = () => {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [sendingCert, setSendingCert] = useState<string | null>(null);
    const [sendingAll, setSendingAll] = useState(false);
    const [teams, setTeams] = useState<any[]>([]);
    const [votes, setVotes] = useState<any[]>([]);
    const [showTeamForm, setShowTeamForm] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', category: '', description: '', color: '#3b82f6' });
    const [activeTab, setActiveTab] = useState<'registrations' | 'teams' | 'voting'>('registrations');

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching admin data...');
            try {
                const regRes = await fetch(API_ENDPOINTS.adminRegistrations, {
                    headers: { email: 'admin', password: 'veritas2026' }
                });
                console.log('Registrations response:', regRes.status);
                
                if (regRes.ok) {
                    const data = await regRes.json();
                    console.log('Registrations data:', data);
                    const formatted = data.map((r: any) => ({
                        id: r.id,
                        fullName: r.full_name,
                        email: r.email,
                        type: r.type.charAt(0).toUpperCase() + r.type.slice(1),
                        role: r.role,
                        department: r.institution,
                        date: r.created_at
                    }));
                    setRegistrations(formatted);
                } else {
                    console.error('Failed to fetch registrations:', await regRes.text());
                }

                const teamsRes = await fetch(API_ENDPOINTS.teams);
                console.log('Teams response:', teamsRes.status);
                
                if (teamsRes.ok) {
                    const teamsData = await teamsRes.json();
                    console.log('Teams data:', teamsData);
                    setTeams(teamsData);
                } else {
                    console.error('Failed to fetch teams:', await teamsRes.text());
                }

                const votesRes = await fetch(API_ENDPOINTS.adminVotes, {
                    headers: { email: 'admin', password: 'veritas2026' }
                });
                console.log('Votes response:', votesRes.status);
                
                if (votesRes.ok) {
                    const votesData = await votesRes.json();
                    console.log('Votes data:', votesData);
                    setVotes(votesData);
                } else {
                    console.error('Failed to fetch votes:', await votesRes.text());
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    const filteredData = registrations.filter(r => {
        const matchesFilter = filter === 'All' || r.type === filter;
        const matchesSearch = r.fullName.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: registrations.length,
        participants: registrations.filter(r => r.type === 'Participant').length,
        organizers: registrations.filter(r => r.type === 'Organizer').length,
        alumni: registrations.filter(r => r.type === 'Alumni').length,
        totalVotes: Object.keys(localStorage).filter(key => key === 'hasVoted').length,
    };

    const sendCertificate = async (userId: string, email: string) => {
        setSendingCert(userId);
        try {
            const res = await fetch(API_ENDPOINTS.certificateSend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    email: 'admin',
                    password: 'veritas2026'
                },
                body: JSON.stringify({ userId })
            });
            if (res.ok) {
                alert(`Certificate sent to ${email}`);
            } else {
                alert('Failed to send certificate');
            }
        } catch (error) {
            alert('Network error');
        } finally {
            setSendingCert(null);
        }
    };

    const sendAllCertificates = async () => {
        if (!confirm('Send certificates to all registered users?')) return;
        setSendingAll(true);
        try {
            const res = await fetch(API_ENDPOINTS.certificateSendAll, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    email: 'admin',
                    password: 'veritas2026'
                }
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Certificates sent to ${data.count} users`);
            } else {
                alert('Failed to send certificates');
            }
        } catch (error) {
            alert('Network error');
        } finally {
            setSendingAll(false);
        }
    };

    const addTeam = async () => {
        if (!newTeam.name || !newTeam.category) {
            alert('Name and category are required');
            return;
        }
        console.log('Adding team:', newTeam);
        try {
            const res = await fetch(API_ENDPOINTS.teams, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    email: 'admin',
                    password: 'veritas2026'
                },
                body: JSON.stringify(newTeam)
            });
            console.log('Add team response:', res.status);
            
            if (res.ok) {
                const data = await res.json();
                console.log('Team added:', data);
                setTeams([...teams, data.data]);
                setNewTeam({ name: '', category: '', description: '', color: '#3b82f6' });
                setShowTeamForm(false);
                alert('Team added successfully!');
            } else {
                const error = await res.text();
                console.error('Failed to add team:', error);
                alert('Failed to add team: ' + error);
            }
        } catch (error) {
            console.error('Error adding team:', error);
            alert('Failed to add team');
        }
    };

    const deleteTeam = async (id: string) => {
        if (!confirm('Delete this team?')) return;
        try {
            const res = await fetch(`${API_ENDPOINTS.teams}/${id}`, {
                method: 'DELETE',
                headers: {
                    email: 'admin',
                    password: 'veritas2026'
                }
            });
            if (res.ok) {
                setTeams(teams.filter(t => t.id !== id));
            }
        } catch (error) {
            alert('Failed to delete team');
        }
    };

    const clearData = async () => {
        if (confirm('Are you sure you want to clear all registration data? This action cannot be undone.')) {
            alert('This feature requires backend implementation for data deletion.');
        }
    };

    const exportData = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Name,Type,Detail1,Detail2,Date\n"
            + registrations.map(e => `${e.fullName},${e.type},${e.email || e.role || e.gradYear},${e.department || e.contact || e.field},${e.date}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "showcase_registrations.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="min-h-screen py-16 px-4 relative overflow-hidden">
            {/* Hybrid Background Decor */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-showcase-cyan/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-showcase-blue/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-showcase-cyan font-bold tracking-[0.3em] uppercase text-xs">SYSTEM CONTROL</span>
                        <h1 className="text-5xl font-black text-white italic mt-2">ADMIN <span className="bg-showcase-blue px-3 py-1">CENTER</span></h1>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setActiveTab('registrations')} className={`px-6 py-3 font-bold rounded-xl text-sm uppercase tracking-widest ${activeTab === 'registrations' ? 'bg-showcase-cyan text-showcase-dark' : 'glass text-white'}`}>
                            Registrations
                        </button>
                        <button onClick={() => setActiveTab('teams')} className={`px-6 py-3 font-bold rounded-xl text-sm uppercase tracking-widest ${activeTab === 'teams' ? 'bg-showcase-cyan text-showcase-dark' : 'glass text-white'}`}>
                            Teams
                        </button>
                        <button onClick={() => setActiveTab('voting')} className={`px-6 py-3 font-bold rounded-xl text-sm uppercase tracking-widest ${activeTab === 'voting' ? 'bg-showcase-cyan text-showcase-dark' : 'glass text-white'}`}>
                            <BarChart3 size={16} className="inline mr-2" />Voting
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
                    {[
                        { label: "Total Registrations", value: stats.total, icon: SquareUser, color: "text-white" },
                        { label: "Participants", value: stats.participants, icon: Activity, color: "text-showcase-cyan" },
                        { label: "Organizers", value: stats.organizers, icon: Layers, color: "text-showcase-blue" },
                        { label: "Alumni", value: stats.alumni, icon: Box, color: "text-purple-500" },
                    ].map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-2xl border-white/5 relative overflow-hidden group hover:border-white/20 transition-all">
                            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-120 transition-transform">
                                <stat.icon size={100} />
                            </div>
                            <div className={`${stat.color} mb-4`}><stat.icon size={24} /></div>
                            <div className="text-4xl font-black text-white mb-1 italic">{stat.value}</div>
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Insights Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                    <div className="lg:col-span-2 glass p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-white/5">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black text-white italic lowercase font-sans"><span className="uppercase italic">Distribution</span> Analysis</h3>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-showcase-cyan" />
                                    <span className="text-[10px] text-gray-400 font-bold">P</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-showcase-blue" />
                                    <span className="text-[10px] text-gray-400 font-bold">O</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                    <span className="text-[10px] text-gray-400 font-bold">A</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end gap-1 h-48 mb-8">
                            {[
                                { color: 'bg-showcase-cyan', val: stats.participants, total: stats.total, label: 'Participants' },
                                { color: 'bg-showcase-blue', val: stats.organizers, total: stats.total, label: 'Organizers' },
                                { color: 'bg-purple-500', val: stats.alumni, total: stats.total, label: 'Alumni' },
                            ].map((bar, i) => {
                                const height = stats.total > 0 ? Math.max((bar.val / stats.total) * 100, 5) : 5;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group">
                                        <div className="w-full relative flex items-end justify-center min-h-[4px]">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                className={`${bar.color} w-4/5 rounded-t-lg relative group-hover:brightness-125 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center`}
                                            >
                                                <span className="text-white font-black text-lg">{bar.val}</span>
                                            </motion.div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 font-bold">{bar.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest text-center">Registration Volume by Category</p>
                    </div>

                    <div className="glass p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-white/5 flex flex-col justify-center">
                        <h3 className="text-xl font-black text-white italic mb-8 uppercase text-center">Engagement <span className="text-showcase-cyan">Rate</span></h3>
                        <div className="relative w-40 h-40 mx-auto mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-white/5"
                                />
                                <motion.circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 440 - (440 * (stats.total > 0 ? votes.length / stats.total : 0)) }}
                                    className="text-showcase-cyan"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-white">{stats.total > 0 ? Math.floor((votes.length / stats.total) * 100) : 0}%</span>
                                <span className="text-[10px] text-gray-500 font-bold">VOTED</span>
                            </div>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-showcase-cyan font-black text-xl">{votes.length} / {stats.total}</p>
                            <p className="text-gray-400 text-xs">Votes Cast / Total Registered</p>
                        </div>
                    </div>
                </div>

                {/* Teams Tab */}
                {activeTab === 'teams' && (
                    <div className="glass rounded-[2rem] border-white/10 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-white">Manage Teams</h2>
                            <button onClick={() => setShowTeamForm(!showTeamForm)} className="flex items-center gap-2 px-6 py-3 bg-showcase-cyan text-showcase-dark font-bold rounded-xl">
                                <Plus size={16} /> Add Team
                            </button>
                        </div>

                        {showTeamForm && (
                            <div className="glass-dark p-6 rounded-xl mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input placeholder="Team Name" value={newTeam.name} onChange={(e) => setNewTeam({...newTeam, name: e.target.value})} className="glass-dark border border-white/10 rounded-xl px-4 py-3 text-white" />
                                    <input placeholder="Category" value={newTeam.category} onChange={(e) => setNewTeam({...newTeam, category: e.target.value})} className="glass-dark border border-white/10 rounded-xl px-4 py-3 text-white" />
                                </div>
                                <textarea placeholder="Description" value={newTeam.description} onChange={(e) => setNewTeam({...newTeam, description: e.target.value})} className="w-full glass-dark border border-white/10 rounded-xl px-4 py-3 text-white mb-4" rows={3} />
                                <div className="flex gap-4">
                                    <input type="color" value={newTeam.color} onChange={(e) => setNewTeam({...newTeam, color: e.target.value})} className="w-20 h-12 rounded-xl" />
                                    <button onClick={addTeam} className="px-6 py-3 bg-showcase-cyan text-showcase-dark font-bold rounded-xl">Save Team</button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teams.map(team => (
                                <div key={team.id} className="glass p-6 rounded-xl border-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-4 h-4 rounded-full" style={{backgroundColor: team.color}} />
                                        <button onClick={() => deleteTeam(team.id)} className="text-red-500 hover:text-red-400">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{team.category}</span>
                                    <p className="text-sm text-gray-400 mt-2">{team.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Voting Tab */}
                {activeTab === 'voting' && (
                    <div className="glass rounded-[2rem] border-white/10 p-8">
                        <h2 className="text-2xl font-black text-white mb-6">Live Voting Results</h2>
                        <div className="space-y-4">
                            {teams.map(team => {
                                const teamVotes = votes.filter(v => v.team_name === team.name).length;
                                const percentage = votes.length > 0 ? (teamVotes / votes.length * 100) : 0;
                                return (
                                    <div key={team.id} className="glass-dark p-6 rounded-xl">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: team.color}} />
                                                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-black text-white">{teamVotes}</div>
                                                <div className="text-xs text-gray-400">votes</div>
                                            </div>
                                        </div>
                                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full transition-all duration-500" style={{width: `${percentage}%`, backgroundColor: team.color}} />
                                        </div>
                                        <div className="text-right text-sm text-gray-400 mt-2">{percentage.toFixed(1)}%</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 text-center text-gray-400">
                            Total Votes: {votes.length}
                        </div>
                    </div>
                )}

                {/* Registrations Tab */}
                {activeTab === 'registrations' && (
                    <>
                        <div className="flex gap-4 mb-6">
                            <button onClick={sendAllCertificates} disabled={sendingAll} className="flex items-center gap-2 px-6 py-3 bg-showcase-cyan/10 text-showcase-cyan font-bold border border-showcase-cyan/20 rounded-xl">
                                <Send size={16} /> {sendingAll ? 'Sending...' : 'Send All Certificates'}
                            </button>
                            <button onClick={exportData} className="flex items-center gap-2 px-6 py-3 glass text-white font-bold rounded-xl">
                                <CloudDownload size={16} /> Export CSV
                            </button>
                        </div>

                {/* Management Section */}
                <div className="glass rounded-[1.5rem] sm:rounded-[2rem] border-white/10 overflow-hidden backdrop-blur-3xl">
                    <div className="p-6 md:p-8 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
                        <div className="relative flex-1">
                            <ScanSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                placeholder="Search registrations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full glass-dark border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-showcase-cyan/50 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Binary className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="glass-dark border border-white/10 rounded-xl pl-12 pr-10 py-3 text-white focus:border-showcase-cyan/50 outline-none transition-all appearance-none cursor-pointer text-sm"
                            >
                                <option value="All">All Types</option>
                                <option value="Participant">Participant</option>
                                <option value="Organizer">Organizer</option>
                                <option value="Alumni">Alumni</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={exportData}
                                className="p-3 glass hover:text-showcase-cyan rounded-xl transition-all"
                                title="Export CSV"
                            >
                                <CloudDownload size={20} />
                            </button>
                            <button
                                onClick={clearData}
                                className="p-3 glass hover:text-red-500 rounded-xl transition-all"
                                title="Clear Data"
                            >
                                <Dna size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/40 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-8 py-5">Full Name</th>
                                    <th className="px-8 py-5">Email</th>
                                    <th className="px-8 py-5">Classification</th>
                                    <th className="px-8 py-5">Details</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredData.length > 0 ? filteredData.map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6 font-bold text-white tracking-tight">{row.fullName}</td>
                                        <td className="px-8 py-6 text-sm text-gray-300">{row.email}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${row.type === 'Participant' ? 'border-showcase-cyan/30 text-showcase-cyan bg-showcase-cyan/5' :
                                                row.type === 'Organizer' ? 'border-showcase-blue/30 text-showcase-blue bg-showcase-blue/5' :
                                                    'border-purple-500/30 text-purple-400 bg-purple-500/5'
                                                }`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-400 italic">
                                            {row.role || row.department || '-'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                                                <Calendar size={12} />
                                                {new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                onClick={() => sendCertificate(row.id, row.email)}
                                                disabled={sendingCert === row.id}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-showcase-cyan/10 text-showcase-cyan border border-showcase-cyan/20 rounded-lg hover:bg-showcase-cyan/20 transition-all text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                                            >
                                                <Mail size={14} />
                                                {sendingCert === row.id ? 'Sending...' : 'Send Cert'}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="inline-flex flex-col items-center opacity-20">
                                                <SquareUser size={40} className="mb-4" />
                                                <p className="font-black text-sm tracking-widest">NO RECORDS FOUND</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;
