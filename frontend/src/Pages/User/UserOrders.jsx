import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, IndianRupee, Package, ShoppingBag } from 'lucide-react';
import UserHeader from '../../Components/User/UserHeader';
import UserFooter from '../../Components/User/UserFooter';

const statusStyles = {
    placed: 'bg-[#0f766e]/10 text-[#0f766e]',
    processing: 'bg-[#fef9c3] text-[#92400e]',
    shipped: 'bg-[#dbeafe] text-[#1d4ed8]',
    delivered: 'bg-[#dcfce7] text-[#166534]',
    cancelled: 'bg-[#fff4f0] text-[#b34a2f]'
};

const UserOrders = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/user/login');
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchOrders = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data.orders || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('We could not load your orders right now.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const totalSpent = useMemo(() => {
        return orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    }, [orders]);

    const formattedTotal = Number.isFinite(totalSpent)
        ? totalSpent.toLocaleString('en-IN')
        : '0';

    if (!user) return null;

    return (
        <div className="user-shell min-h-screen flex flex-col">
            <UserHeader user={user} />

            <main className="flex-1">
                <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
                    <section className="rounded-[28px] border border-[#eadfd0] bg-white p-8 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfd0] bg-[#f9f5ef] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8b7d6b]">
                                    <Package className="h-4 w-4" />
                                    My Orders
                                </div>
                                <h1 className="user-heading mt-4 text-3xl font-semibold text-[#1f2933]">
                                    Your recent purchases
                                </h1>
                                <p className="user-muted mt-2 text-sm">
                                    Track order status and delivery details.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-[#eadfd0] bg-white px-5 py-3 text-sm font-semibold text-[#1f2933] shadow-sm">
                                <IndianRupee className="h-4 w-4" />
                                {formattedTotal}
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            {loading ? (
                                <div className="rounded-2xl border border-[#eadfd0] bg-[#f9f5ef] p-6 text-sm text-[#8b7d6b]">
                                    Loading your orders...
                                </div>
                            ) : error ? (
                                <div className="rounded-2xl border border-[#f2c3b4] bg-[#fff4f0] p-6 text-sm text-[#b34a2f]">
                                    {error}
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="rounded-2xl border border-[#eadfd0] bg-white p-6 text-sm text-[#5c4f44]">
                                    You do not have any orders yet.
                                    <button
                                        type="button"
                                        onClick={() => navigate('/user/buy')}
                                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-200/70"
                                    >
                                        <ShoppingBag className="h-4 w-4" />
                                        Browse books
                                    </button>
                                </div>
                            ) : (
                                orders.map((order) => {
                                    const createdAt = order.purchasedAt || order.createdAt;
                                    const orderedOn = createdAt
                                        ? new Date(createdAt).toLocaleDateString()
                                        : 'Date not set';
                                    const status = (order.status || 'placed').toLowerCase();
                                    const statusClass = statusStyles[status] || statusStyles.placed;

                                    return (
                                        <div
                                            key={order._id}
                                            className="rounded-2xl border border-[#eadfd0] bg-white p-6 shadow-sm"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-[#1f2933]">
                                                        {order.bookName || order.bookId?.name || 'Book order'}
                                                    </h3>
                                                    <p className="text-sm text-[#8b7d6b]">
                                                        Qty {order.quantity} • {order.bookAuthor || order.bookId?.author || 'Unknown author'}
                                                    </p>
                                                </div>
                                                <div className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}>
                                                    {status}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-[#5c4f44]">
                                                <div className="flex items-center gap-2">
                                                    <IndianRupee className="h-4 w-4 text-[#8b7d6b]" />
                                                    <span>{Number(order.totalPrice || 0).toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-[#8b7d6b]" />
                                                    <span>{orderedOn}</span>
                                                </div>
                                            </div>

                                            {order.shippingAddress && (
                                                <div className="mt-4 rounded-xl border border-[#eadfd0] bg-[#f9f5ef] px-4 py-3 text-xs text-[#6b5e4d]">
                                                    {[
                                                        order.shippingAddress.line1,
                                                        order.shippingAddress.line2,
                                                        order.shippingAddress.city,
                                                        order.shippingAddress.state,
                                                        order.shippingAddress.postalCode,
                                                        order.shippingAddress.country
                                                    ].filter(Boolean).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <UserFooter />
        </div>
    );
};

export default UserOrders;
