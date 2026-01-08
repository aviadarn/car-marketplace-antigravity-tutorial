import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Calendar, DollarSign, Zap, Gauge } from 'lucide-react';
import BookingModal from '../components/BookingModal';

export default function VehicleDetail() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [carsRes, schedRes] = await Promise.all([
                    axios.get('/api/cars'),
                    axios.get(`/api/schedules/car/${id}`)
                ]);
                setCar(carsRes.data.find(c => c._id === id));
                setSchedules(schedRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-slate-500">Loading...</div>;
    if (!car) return <div className="text-center py-20">Vehicle not found</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8">
                <ChevronLeft size={20} /> Back to Gallery
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl mb-8 flex items-center justify-center relative">
                        <span className="text-6xl font-black text-white/5 uppercase">{car.brand}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <DollarSign className="text-elite-gold mb-2" />
                            <div className="text-slate-400 text-sm">Price</div>
                            <div className="text-2xl font-bold">${car.price?.toLocaleString()}</div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <Zap className="text-elite-gold mb-2" />
                            <div className="text-slate-400 text-sm">Power</div>
                            <div className="text-2xl font-bold">{car.specs?.hp} HP</div>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 col-span-2">
                            <Gauge className="text-elite-gold mb-2" />
                            <div className="text-slate-400 text-sm">Engine</div>
                            <div className="text-2xl font-bold">{car.specs?.engine}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h1 className="text-4xl font-bold mb-2">{car.brand} <span className="text-elite-gold">{car.model}</span></h1>
                    <p className="text-slate-400 text-lg mb-8">{car.year} • {car.category}</p>

                    <div className="bg-elite-card rounded-3xl p-8 border border-white/5">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar className="text-elite-gold" /> Schedule Viewing
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                            {schedules.map(slot => {
                                const date = new Date(slot.start_time);
                                const isSelected = selectedSlot?._id === slot._id;
                                return (
                                    <button
                                        key={slot._id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-3 rounded-xl border text-sm transition-all ${isSelected ? 'bg-elite-gold text-elite-darker border-elite-gold font-bold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <div className="mb-1 opacity-80">{date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                        <div className="text-lg">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </button>
                                );
                            })}
                            {schedules.length === 0 && <div className="col-span-3 text-center py-6 text-slate-500">No available slots</div>}
                        </div>

                        <button
                            disabled={!selectedSlot}
                            onClick={() => setShowModal(true)}
                            className="w-full py-4 bg-elite-gold text-elite-darker font-bold rounded-xl text-lg disabled:opacity-50 hover:shadow-lg transition-all"
                        >
                            Reserve Experience
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <BookingModal
                    car={car}
                    slot={selectedSlot}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        axios.get(`/api/schedules/car/${id}`).then(res => setSchedules(res.data));
                        setSelectedSlot(null);
                    }}
                />
            )}
        </div>
    );
}
