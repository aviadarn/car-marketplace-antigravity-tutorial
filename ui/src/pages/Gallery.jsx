import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import CarCard from '../components/CarCard';

export default function Gallery() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState('All');

    useEffect(() => {
        axios.get('/api/cars')
            .then(res => { setCars(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const filteredCars = cars.filter(car => {
        const matchesSearch = car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = filterBrand === 'All' || car.brand === filterBrand;
        return matchesSearch && matchesBrand;
    });

    const brands = ['All', ...new Set(cars.map(c => c.brand))];

    return (
        <div className="min-h-screen">
            <header className="mb-12 text-center py-10 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-elite-gold/20 blur-[120px] rounded-full -z-10" />
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
                    Elite Drive
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Experience the world's most prestigious automobiles
                </p>
            </header>

            <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-elite-dark p-4 rounded-2xl border border-white/5">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        className="w-full bg-elite-darker border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-elite-gold/50"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                    {brands.map(brand => (
                        <button
                            key={brand}
                            onClick={() => setFilterBrand(brand)}
                            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filterBrand === brand ? 'bg-elite-gold text-elite-darker' : 'bg-white/5 hover:bg-white/10'}`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading inventory...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCars.map(car => (
                        <CarCard key={car._id} car={car} />
                    ))}
                    {filteredCars.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-500">No vehicles found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
