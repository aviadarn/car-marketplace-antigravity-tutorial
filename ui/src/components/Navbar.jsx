import { Link, useLocation } from 'react-router-dom';
import { Car, User } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-widest">
                    <Car className="text-elite-gold" size={28} />
                    <span className="text-white">ELITE</span>
                    <span className="text-elite-gold">DRIVE</span>
                </Link>

                <div className="flex gap-4">
                    <Link
                        to="/"
                        className={`px-4 py-2 rounded-lg transition-all ${isActive('/') ? 'bg-elite-gold text-elite-darker font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                        Gallery
                    </Link>
                    <Link
                        to="/lounge"
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isActive('/lounge') ? 'bg-elite-gold text-elite-darker font-bold' : 'text-slate-400 hover:text-white'}`}
                    >
                        <User size={16} />
                        Lounge
                    </Link>
                </div>
            </div>
        </nav>
    );
}
