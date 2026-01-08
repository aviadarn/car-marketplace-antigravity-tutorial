import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CarCard({ car }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-elite-card rounded-2xl overflow-hidden border border-white/5 hover:border-elite-gold/50 transition-all shadow-lg group"
        >
            <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <span className="text-5xl font-black text-white/5 uppercase absolute">{car.brand}</span>
                <span className="text-slate-500 text-sm z-10">{car.category || 'Luxury'}</span>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">{car.brand} {car.model}</h3>
                        <p className="text-elite-gold text-sm">{car.year}</p>
                    </div>
                    <span className="bg-white/5 px-3 py-1 rounded-full text-sm font-mono text-slate-300">
                        ${car.price?.toLocaleString()}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-elite-gold" />
                        {car.specs?.hp} HP
                    </div>
                    <div className="flex items-center gap-2">
                        <Gauge size={14} className="text-elite-gold" />
                        {car.specs?.engine}
                    </div>
                </div>

                <Link
                    to={`/car/${car._id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-elite-gold hover:text-elite-darker rounded-xl transition-all font-medium"
                >
                    Reserve Experience <ArrowRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
}
