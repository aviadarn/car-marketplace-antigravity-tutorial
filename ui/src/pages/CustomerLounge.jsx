import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Calendar, AlertTriangle, ChevronRight, Check } from 'lucide-react';

export default function CustomerLounge() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [serviceAlerts, setServiceAlerts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('/api/customers').then(res => setCustomers(res.data));
    }, []);

    const handleLogin = async (customer) => {
        setLoading(true);
        setSelectedCustomer(customer);
        try {
            const [bookingsRes, servicesRes] = await Promise.all([
                axios.get(`/api/customers/${customer._id}/history`),
                axios.get('/api/services/due')
            ]);
            setBookings(bookingsRes.data);
            setServiceAlerts(servicesRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (!selectedCustomer) {
        return (
            <div className="max-w-md mx-auto py-20">
                <h1 className="text-3xl font-bold mb-8 text-center">Client Access</h1>
                <div className="bg-elite-card rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-4 bg-white/5 font-medium border-b border-white/5">Select Profile</div>
                    <div className="divide-y divide-white/5">
                        {customers.map(c => (
                            <button
                                key={c._id}
                                onClick={() => handleLogin(c)}
                                className="w-full text-left p-4 hover:bg-white/5 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-elite-gold group-hover:text-elite-darker transition-colors">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold">{c.name}</div>
                                        <div className="text-xs text-slate-400">{c.loyalty_tier}</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-600 group-hover:text-elite-gold" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Welcome, {selectedCustomer.name.split(' ')[0]}</h1>
                    <p className="text-slate-400">{selectedCustomer.loyalty_tier} Member</p>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="text-sm text-slate-400 hover:text-white underline">Sign Out</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="text-elite-gold" /> Upcoming Sessions
                    </h2>
                    <div className="bg-elite-card border border-white/5 rounded-2xl p-6 min-h-[300px]">
                        {bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.map(booking => (
                                    <div key={booking._id} className="bg-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                                        <div className="w-full md:w-32 h-20 bg-slate-800 rounded-lg flex items-center justify-center">
                                            <span className="text-xs text-slate-500">{booking.car_details?.brand}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{booking.car_details?.brand} {booking.car_details?.model}</h3>
                                            <div className="text-slate-400 text-sm flex gap-4 mt-2">
                                                <span className="flex items-center gap-1"><Calendar size={14} /> {booking.slot_details ? new Date(booking.slot_details.start_time).toLocaleDateString() : 'TBD'}</span>
                                                <span>{booking.slot_details ? new Date(booking.slot_details.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 bg-green-500/10 text-green-500 text-sm font-bold rounded-lg border border-green-500/20 flex items-center gap-1">
                                            <Check size={14} /> CONFIRMED
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">No upcoming sessions.</div>
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-elite-gold" /> Service Alerts
                    </h2>
                    <div className="bg-elite-card border border-white/5 rounded-2xl p-6 min-h-[300px]">
                        {serviceAlerts.length > 0 ? (
                            <div className="space-y-4">
                                {serviceAlerts.map(alert => (
                                    <div key={alert._id} className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                                        <div className="font-bold text-red-200 mb-2">{alert.car_details?.brand} {alert.car_details?.model}</div>
                                        <p className="text-sm text-red-200/70">{alert.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">No alerts.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
