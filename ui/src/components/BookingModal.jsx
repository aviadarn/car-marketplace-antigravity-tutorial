import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Check, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingModal({ car, slot, onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/customers').then(res => setCustomers(res.data));
    }, []);

    const handleBooking = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post('/api/book-test-drive', {
                customer_id: selectedCustomer._id,
                car_id: car._id,
                slot_id: slot._id
            });
            setStep(3);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Booking failed");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-elite-card w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 flex justify-between items-center border-b border-white/5">
                    <h2 className="text-xl font-bold">Reserve Experience</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
                </div>

                <div className="p-6">
                    <div className="flex gap-4 mb-8">
                        <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-elite-gold' : 'bg-white/10'}`} />
                        <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-elite-gold' : 'bg-white/10'}`} />
                        <div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-elite-gold' : 'bg-white/10'}`} />
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                <p className="text-slate-400 mb-4">Select your profile:</p>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {customers.map(c => (
                                        <div
                                            key={c._id}
                                            onClick={() => setSelectedCustomer(c)}
                                            className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between ${selectedCustomer?._id === c._id ? 'border-elite-gold bg-elite-gold/10' : 'border-white/5 hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCustomer?._id === c._id ? 'bg-elite-gold text-elite-darker' : 'bg-slate-700'}`}>
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-bold">{c.name}</div>
                                                    <div className="text-xs text-slate-400">{c.loyalty_tier}</div>
                                                </div>
                                            </div>
                                            {selectedCustomer?._id === c._id && <Check className="text-elite-gold" />}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    disabled={!selectedCustomer}
                                    onClick={() => setStep(2)}
                                    className="w-full mt-6 bg-elite-gold text-elite-darker font-bold py-3 rounded-xl disabled:opacity-50"
                                >
                                    Continue
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                                <h3 className="text-lg font-bold mb-4">Confirm Reservation</h3>
                                <div className="bg-white/5 rounded-xl p-4 space-y-3 mb-6">
                                    <div className="flex justify-between"><span className="text-slate-400">Vehicle</span><span>{car.brand} {car.model}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">Date</span><span>{new Date(slot.start_time).toLocaleDateString()}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">Time</span><span>{new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-400">Client</span><span>{selectedCustomer.name}</span></div>
                                </div>
                                {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10">Back</button>
                                    <button onClick={handleBooking} disabled={loading} className="flex-1 bg-elite-gold text-elite-darker font-bold py-3 rounded-xl">
                                        {loading ? 'Processing...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" className="text-center py-8">
                                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Booking Confirmed</h3>
                                <p className="text-slate-400">We await your arrival.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
