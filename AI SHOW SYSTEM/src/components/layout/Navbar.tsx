import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Power } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isAdmin = localStorage.getItem('isAdminAuthenticated') === 'true';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Schedule', path: '/schedule' },
        { name: 'Vote', path: '/vote' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/');
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 glass border-b' : 'py-8 bg-transparent border-none'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-showcase-cyan/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img
                                src={logo}
                                alt="Veritas Logo"
                                className="w-12 h-12 object-contain relative z-10"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tighter text-white leading-none italic uppercase">
                                Veritas
                            </span>
                            <span className="text-[10px] font-black text-showcase-cyan tracking-[0.2em] uppercase">
                                Emerge 2026
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-xs font-black tracking-widest uppercase transition-colors hover:text-showcase-cyan ${location.pathname === link.path ? 'text-showcase-cyan' : 'text-gray-400'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAdmin ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/admin"
                                    className={`text-xs font-black tracking-widest uppercase transition-colors hover:text-showcase-cyan ${location.pathname === '/admin' ? 'text-showcase-cyan' : 'text-gray-400'}`}
                                >
                                    ADMIN
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 glass text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <Power size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/register"
                                className="px-8 py-2.5 bg-white text-showcase-dark font-black rounded-xl hover:bg-showcase-cyan transition-all transform hover:scale-105 text-xs tracking-widest uppercase"
                            >
                                REGISTER
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <motion.div
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                variants={{
                    open: { opacity: 1, height: 'auto', display: 'block' },
                    closed: { opacity: 0, height: 0, transitionEnd: { display: 'none' } },
                }}
                className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
            >
                <div className="flex flex-col p-6 gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`text-xl font-black tracking-widest uppercase transition-colors ${location.pathname === link.path ? 'text-showcase-cyan' : 'text-white/60'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin"
                                onClick={() => setIsOpen(false)}
                                className={`text-xl font-black tracking-widest uppercase transition-colors ${location.pathname === '/admin' ? 'text-showcase-cyan' : 'text-white/60'}`}
                            >
                                ADMIN CENTER
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-2 text-xl font-black tracking-widest uppercase text-red-500 text-left"
                            >
                                <Power size={20} /> LOGOUT
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/register"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-4 bg-white text-showcase-dark text-center font-black rounded-xl text-sm tracking-widest uppercase mt-4"
                        >
                            REGISTER NOW
                        </Link>
                    )}
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;
