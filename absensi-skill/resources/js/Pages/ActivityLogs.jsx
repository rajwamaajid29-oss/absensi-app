import { useState } from 'react'
import { Head, usePage, router, Link } from '@inertiajs/react'
import { BadgeCheck, Clock4, TriangleAlert, TimerReset, CalendarDays, Search, Download, Filter, MapPin, Menu } from 'lucide-react'

import Sidebar from "../Components/Sidebar";   // ← sesuaikan path project kamu

export default function ActivityLogs({ attendances, stats, filters }) {

    const { url } = usePage()
    const [selectedAttendance, setSelectedAttendance] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleFilter = (key, value) => {
        router.get('/activity-logs', { ...filters, [key]: value }, { preserveState: true, replace: true })
    }

    const statusStyle = (status) => {
        switch (status) {
            case 'on_time': return 'bg-green-100 text-green-700'
            case 'late':    return 'bg-orange-100 text-orange-700'
            case 'leave':   return 'bg-blue-100 text-blue-700'
            case 'alpha':   return 'bg-red-100 text-red-700'
            default:        return 'bg-gray-100 text-gray-700'
        }
    }

    const statusLabel = (status) => {
        switch (status) {
            case 'on_time': return 'HADIR'
            case 'late':    return 'TERLAMBAT'
            case 'leave':   return 'IZIN/CUTI'
            case 'alpha':   return 'ALPHA'
            default:        return status
        }
    }

    return (
        <>
            <Head title="Riwayat Absensi" />

            <div className="flex min-h-screen bg-[#f4f7fe]">

                {/* ── SIDEBAR ── */}
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* ── CONTENT ── */}
                <main className="flex-1 p-5 lg:p-8 overflow-y-auto">

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <button
                                className="lg:hidden w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu size={18} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Riwayat Absensi</h1>
                                <p className="text-gray-500 mt-2">Kelola dan tinjau data kehadiran karyawan secara real-time</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl text-gray-700">
                                <Filter size={18} /> Filter
                            </button>
                            <button className="flex items-center gap-2 bg-blue-600 px-5 py-3 rounded-2xl text-white">
                                <Download size={18} /> Export
                            </button>
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {[
                            { label: 'Hadir Hari Ini', value: stats?.present ?? 0, icon: BadgeCheck, bg: 'bg-blue-100',   color: 'text-blue-600'   },
                            { label: 'Terlambat',       value: stats?.late    ?? 0, icon: Clock4,    bg: 'bg-orange-100', color: 'text-orange-600' },
                            { label: 'Alpha',           value: stats?.alpha   ?? 0, icon: TriangleAlert, bg: 'bg-red-100', color: 'text-red-600'   },
                            { label: 'Izin/Cuti',       value: stats?.leave   ?? 0, icon: TimerReset, bg: 'bg-cyan-100',  color: 'text-cyan-600'   },
                        ].map((s, i) => (
                            <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                                <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4`}>
                                    <s.icon className={s.color} />
                                </div>
                                <p className="text-gray-400 text-sm">{s.label}</p>
                                <h2 className="text-3xl font-bold text-gray-800 mt-1">{s.value}</h2>
                            </div>
                        ))}
                    </div>

                    {/* FILTER */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                            {/* Start Date */}
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Start Date</label>
                                <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
                                    <CalendarDays size={18} className="text-gray-400" />
                                    <input type="date" value={filters?.start_date || ''} onChange={(e) => handleFilter('start_date', e.target.value)} className="w-full outline-none text-sm" />
                                </div>
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">End Date</label>
                                <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
                                    <CalendarDays size={18} className="text-gray-400" />
                                    <input type="date" value={filters?.end_date || ''} onChange={(e) => handleFilter('end_date', e.target.value)} className="w-full outline-none text-sm" />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Status Kehadiran</label>
                                <select value={filters?.status || 'all'} onChange={(e) => handleFilter('status', e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none">
                                    <option value="all">Semua Status</option>
                                    <option value="on_time">Hadir</option>
                                    <option value="late">Terlambat</option>
                                    <option value="leave">Izin/Cuti</option>
                                    <option value="alpha">Alpha</option>
                                </select>
                            </div>

                            {/* Search */}
                            <div>
                                <label className="text-sm text-gray-500 mb-2 block">Cari Karyawan</label>
                                <div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
                                    <Search size={18} className="text-gray-400" />
                                    <input type="text" placeholder="Cari nama..." defaultValue={filters?.search || ''} onChange={(e) => handleFilter('search', e.target.value)} className="w-full outline-none text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Nama Karyawan','Tanggal','Jam Masuk','Jam Keluar','Lokasi','Status','Action'].map((h, i) => (
                                            <th key={i} className="px-6 py-5 text-left text-sm text-gray-500">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances?.data?.length > 0 ? (
                                        attendances.data.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                                                            {item.karyawan?.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">{item.karyawan?.name}</h3>
                                                            <p className="text-sm text-gray-400">Employee</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-gray-700">{item.date}</td>
                                                <td className="px-6 py-5 font-semibold text-gray-700">{item.check_in || '--'}</td>
                                                <td className="px-6 py-5 text-gray-700">{item.check_out || '--'}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-gray-600"><MapPin size={16} /> Office</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold ${statusStyle(item.status)}`}>{statusLabel(item.status)}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <button onClick={() => setSelectedAttendance(item)} className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-semibold">
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-16 text-gray-400">Belum ada data absensi</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="px-6 py-5 flex items-center justify-between border-t border-gray-100">
                            <p className="text-sm text-gray-400">Menampilkan {attendances?.data?.length || 0} data</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {attendances?.links?.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`min-w-[42px] h-[42px] px-4 flex items-center justify-center rounded-2xl text-sm font-semibold transition ${link.active ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            {/* ── MODAL DETAIL ── */}
            {selectedAttendance && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5">
                    <div className="bg-white w-full max-w-3xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Detail Absensi</h2>
                                <p className="text-gray-400 text-sm mt-1">Informasi lengkap kehadiran</p>
                            </div>
                            <button onClick={() => setSelectedAttendance(null)} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600">✕</button>
                        </div>
                        {selectedAttendance.photo && (
                            <div className="mb-6">
                                <img src={selectedAttendance.photo} alt="Attendance" className="w-full h-[300px] object-cover rounded-2xl border border-gray-200" />
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-5">
                            {[
                                ['Nama Karyawan', selectedAttendance.karyawan?.name],
                                ['Tanggal', selectedAttendance.date],
                                ['Check In', selectedAttendance.check_in || '--'],
                                ['Check Out', selectedAttendance.check_out || '--'],
                                ['Latitude', selectedAttendance.latitude || '-'],
                                ['Longitude', selectedAttendance.longitude || '-'],
                                ['Status', statusLabel(selectedAttendance.status)],
                                ['QR', selectedAttendance.qr || '-'],
                            ].map(([label, value], i) => (
                                <div key={i} className="bg-gray-50 rounded-2xl p-4">
                                    <p className="text-sm text-gray-400">{label}</p>
                                    <h3 className="font-bold text-gray-800 mt-1">{value}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 bg-gray-50 rounded-2xl p-4">
                            <p className="text-sm text-gray-400 mb-1">Catatan Checkout</p>
                            <p className="text-gray-700">{selectedAttendance.checkout_note || '-'}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
