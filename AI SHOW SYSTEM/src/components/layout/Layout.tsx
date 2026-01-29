import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#050510] relative overflow-hidden flex flex-col">
            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <Navbar />

            <main className="relative z-10 flex-grow pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </main>

            <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-md py-8">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>© 2026 Veritas University - Emerging Tech Showcase</p>
                    <div className="flex justify-center gap-4 mt-4 text-sm">
                        <span className="text-veritas-green">Department of Computer Science</span>
                        <span>|</span>
                        <span className="text-neon-cyan">AI & Robotics Club</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
