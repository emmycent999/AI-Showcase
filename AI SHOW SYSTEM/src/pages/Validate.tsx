import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Shield, Calendar, MapPin, Building2, Award } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Validate = () => {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_ENDPOINTS.validate}?email=${email}`);
            const data = await res.json();
            setResult(data);
        } catch (error) {
            setResult({ error: 'Validation failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 px-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-showcase-cyan/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-showcase-blue/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-white mb-4 italic">CERTIFICATE <span className="bg-showcase-cyan px-4 py-1 text-showcase-dark">VALIDATION</span></h1>
                    <p className="text-gray-400">Verify the authenticity of your certificate</p>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/10 mb-8">
                    <form onSubmit={handleValidate}>
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                        <div className="flex gap-4">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                className="flex-1 glass-dark border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-showcase-cyan/50"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3.5 bg-showcase-cyan text-showcase-dark font-black rounded-xl hover:shadow-[0_0_25px_rgba(0,247,255,0.2)] transition-all"
                            >
                                {loading ? 'Validating...' : 'VALIDATE'}
                            </button>
                        </div>
                    </form>
                </div>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-8 md:p-12 rounded-[2rem] border-white/10"
                    >
                        {result.registered ? (
                            <>
                                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                                    <div className="w-16 h-16 bg-showcase-cyan/20 rounded-full flex items-center justify-center border-2 border-showcase-cyan">
                                        <CheckCircle className="w-8 h-8 text-showcase-cyan" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white italic">Certificate Verified</h2>
                                        <p className="text-showcase-cyan font-bold">Valid and Authentic</p>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <p className="text-gray-300 leading-relaxed">
                                        This certifies that the individual whose name appears on the certificate was a recognized <span className="text-white font-bold">{result.data.type}</span> at the <span className="text-showcase-cyan font-bold">Emerging Technology Showcase Event</span> held at Veritas University, Abuja, in January 2026.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="glass-dark p-4 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Award className="w-5 h-5 text-showcase-cyan" />
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">Name</span>
                                            </div>
                                            <p className="text-white font-bold text-lg">{result.data.full_name}</p>
                                        </div>

                                        <div className="glass-dark p-4 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Shield className="w-5 h-5 text-showcase-cyan" />
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">Role</span>
                                            </div>
                                            <p className="text-white font-bold text-lg capitalize">{result.data.type}</p>
                                        </div>

                                        <div className="glass-dark p-4 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Building2 className="w-5 h-5 text-showcase-cyan" />
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">Institution</span>
                                            </div>
                                            <p className="text-white font-bold">Veritas University, Abuja</p>
                                        </div>

                                        <div className="glass-dark p-4 rounded-xl">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Calendar className="w-5 h-5 text-showcase-cyan" />
                                                <span className="text-xs text-gray-400 uppercase tracking-wider">Event Date</span>
                                            </div>
                                            <p className="text-white font-bold">January 2026</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-showcase-cyan/5 border border-showcase-cyan/20 rounded-xl p-6 mb-8">
                                    <h3 className="text-xl font-black text-white mb-4">Official Confirmation</h3>
                                    <p className="text-gray-300 leading-relaxed">
                                        This certificate was officially issued and validated by the Emerging Technology Showcase Organizing Committee in collaboration with the Department of Computer Science at Veritas University to acknowledge the holder's strategic involvement, support, and contribution to the success of the event.
                                    </p>
                                </div>

                                <div className="bg-white/5 rounded-xl p-6 mb-8">
                                    <h3 className="text-xl font-black text-white mb-4">Verification Statement</h3>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-showcase-cyan mt-0.5 flex-shrink-0" />
                                            <span>This page serves as formal verification that the certificate holder participated in the event in a stakeholder capacity.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-showcase-cyan mt-0.5 flex-shrink-0" />
                                            <span>The certificate associated with this verification is authentic and traceable within the event's official records.</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-white/10 pt-6">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Issued By</p>
                                    <p className="text-white font-bold text-lg">Emerging Technology Showcase</p>
                                    <p className="text-gray-400">Department of Computer Science</p>
                                    <p className="text-gray-400">Veritas University, Abuja</p>
                                    <p className="text-gray-400">January 2026</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500 mx-auto mb-6">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-4">Certificate Not Found</h2>
                                <p className="text-gray-400">No certificate found for this email address.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Validate;
