import { Head, usePage, useForm } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import {
    Users, Clock3, Briefcase, CalendarDays, Plus, Bell, Search,
    ChevronLeft, ChevronRight, Menu, X, Sun, Moon, Umbrella,
    CalendarRange, CalendarCheck2,
} from 'lucide-react'

import Sidebar from "../Components/Sidebar";   // ← sesuaikan path project kamu

// ── Shift config ──────────────────────────────────────────────
const SHIFT_CONFIG = {
    pagi:  { label: 'PAGI',  icon: Sun,     bg: 'bg-blue-50',   border: 'border-blue-200',   iconColor: 'text-blue-400',   textColor: 'text-blue-700',   timeColor: 'text-blue-500'   },
    siang: { label: 'SIANG', icon: Sun,     bg: 'bg-orange-50', border: 'border-orange-200', iconColor: 'text-orange-400', textColor: 'text-orange-600', timeColor: 'text-orange-500' },
    malam: { label: 'MALAM', icon: Moon,    bg: 'bg-indigo-50', border: 'border-indigo-200', iconColor: 'text-indigo-400', textColor: 'text-indigo-700', timeColor: 'text-indigo-500' },
    libur: { label: 'LIBUR', icon: Umbrella,bg: 'bg-gray-50',   border: 'border-gray-200',   iconColor: 'text-gray-400',   textColor: 'text-gray-500',   timeColor: 'text-gray-400'   },
}

const MONTHS_ID   = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const DAYS_FULL_ID = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']

export default function ShiftManagement({ shifts = [], karyawans = [] }) {

    const { url } = usePage()

    const [openModal,   setOpenModal]   = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const today      = new Date()
    const [weekOffset, setWeekOffset] = useState(0)

    const startOfWeek = useMemo(() => {
        const current = new Date(today)
        const day  = current.getDay()
        const diff = current.getDate() - day + (day === 0 ? -6 : 1)
        current.setDate(diff + weekOffset * 7)
        return current
    }, [weekOffset])

    const formatDate = (date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    const weekDays = useMemo(() => {
        const names = ['Sen','Sel','Rab','Kam','Jum','Sab','Min']
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek)
            date.setDate(startOfWeek.getDate() + i)
            return { name: names[i], number: date.getDate(), fullDate: formatDate(date), dateObj: date }
        })
    }, [startOfWeek])

    const endOfWeek    = weekDays[6].dateObj
    const weekRangeLabel = useMemo(() => {
        const s = weekDays[0].dateObj
        const e = endOfWeek
        return `${s.getDate()} ${MONTHS_ID[s.getMonth()]} – ${e.getDate()} ${MONTHS_ID[e.getMonth()]} ${e.getFullYear()}`
    }, [weekDays])

    const { data, setData, post, processing, reset } = useForm({
        karyawan_id: '', department: '', selected_dates: [],
        start_time: '', end_time: '', shift_type: 'pagi',
    })

    const submit = (e) => {
        e.preventDefault()
        post('/shift-management', {
            preserveScroll: true,
            onSuccess: () => { reset(); setOpenModal(false) },
            onError:   (errors) => console.log(errors),
        })
    }

    const grouped      = {}
    shifts.forEach((shift) => {
        const name = shift.karyawan?.name
        if (!grouped[name]) grouped[name] = []
        grouped[name].push(shift)
    })

    const totalKaryawan = karyawans.length
    const totalShifts   = shifts.length
    const shiftsToday   = shifts.filter(s => s.date === formatDate(today)).length

    return (
        <>
            <Head title="Shift Management" />

            <div className="flex h-screen bg-[#f4f7fe] overflow-hidden">

                {/* ── SIDEBAR ── */}
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* ── MAIN ── */}
                <main className="flex-1 h-screen overflow-y-auto flex flex-col">
                    <div className="flex-1 p-4 lg:p-6 pb-0 space-y-5">

                        {/* TOPBAR */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button className="lg:hidden w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center" onClick={() => setSidebarOpen(true)}>
                                    <Menu size={18} className="text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-[#111827]">Shift Management</h1>
                                    <p className="text-sm text-gray-400 mt-0.5">Manage employee work schedules efficiently</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="w-11 h-11 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 transition">
                                    <Bell size={18} />
                                </button>
                                <button onClick={() => setOpenModal(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg text-sm font-semibold transition">
                                    <Plus size={18} /> Tambah Shift
                                </button>
                            </div>
                        </div>

                        {/* STATS */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { label: 'Total Karyawan', value: totalKaryawan, sub: 'Aktif',    icon: Users,          bg: 'bg-blue-50',   color: 'text-blue-500'   },
                                { label: 'Shift Aktif',    value: totalShifts,   sub: 'Jadwal',   icon: CalendarCheck2, bg: 'bg-green-50',  color: 'text-green-500'  },
                                { label: 'Shift Hari Ini', value: shiftsToday,   sub: 'Karyawan', icon: Clock3,         bg: 'bg-orange-50', color: 'text-orange-500' },
                                {
                                    label: 'Hari Ini',
                                    value: `${DAYS_FULL_ID[today.getDay()]}, ${today.getDate()} ${MONTHS_ID[today.getMonth()]}`,
                                    sub: `Minggu ke-${Math.ceil(((today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1) / 7)}`,
                                    icon: CalendarDays, bg: 'bg-purple-50', color: 'text-purple-500', textSm: true,
                                },
                            ].map((s, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex items-center gap-3">
                                    <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                                        <s.icon size={18} className={s.color} />
                                    </div>
                                    <div>
                                        <p className={`text-[11px] ${s.color} font-semibold uppercase tracking-wide`}>{s.label}</p>
                                        <p className={`font-bold text-gray-800 leading-tight ${s.textSm ? 'text-sm' : 'text-2xl'}`}>{s.value}</p>
                                        <p className="text-[10px] text-gray-400">{s.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* WEEK NAV */}
                        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
                            <button onClick={() => setWeekOffset(o => o - 1)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <CalendarRange size={16} className="text-blue-500" />
                                {weekRangeLabel}
                            </div>
                            <button onClick={() => setWeekOffset(o => o + 1)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                                Next <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* TABLE */}
                        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left px-6 py-4 font-bold text-gray-500 text-xs uppercase tracking-widest w-[230px]">Employee</th>
                                            {weekDays.map((day, i) => (
                                                <th key={i} className="px-3 py-4 text-center min-w-[110px]">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{day.name}</span>
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${day.fullDate === formatDate(today) ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
                                                            {day.number}
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(grouped).length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="py-20 text-center text-gray-400 text-sm">Belum ada data shift untuk minggu ini.</td>
                                            </tr>
                                        ) : (
                                            Object.keys(grouped).map((name, i) => (
                                                <tr key={i} className="border-t border-gray-50 hover:bg-blue-50/30 transition-all duration-150">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-base shadow uppercase flex-shrink-0">
                                                                {name?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-800 text-sm">{name}</p>
                                                                <p className="text-xs text-gray-400 mt-0.5">{grouped[name][0]?.karyawan?.department}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {weekDays.map((day, idx) => {
                                                        const shift = grouped[name].find(s => s.date === day.fullDate)
                                                        const type  = shift?.shift_name?.toLowerCase()
                                                        const cfg   = SHIFT_CONFIG[type] || null
                                                        return (
                                                            <td key={idx} className="px-2 py-3 text-center">
                                                                {shift && cfg ? (
                                                                    <div className={`mx-auto w-[108px] px-2 py-3 rounded-2xl border ${cfg.bg} ${cfg.border}`}>
                                                                        <div className="flex items-center justify-center gap-1 mb-1">
                                                                            <cfg.icon size={13} className={cfg.iconColor} />
                                                                            <span className={`text-[11px] font-bold ${cfg.textColor}`}>{cfg.label}</span>
                                                                        </div>
                                                                        {type !== 'libur' ? (
                                                                            <div className={`text-[10px] font-medium ${cfg.timeColor}`}>{shift.start_time?.slice(0, 5)} – {shift.end_time?.slice(0, 5)}</div>
                                                                        ) : (
                                                                            <div className="text-[10px] text-gray-400 font-medium">Full Day</div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mx-auto w-[108px] h-[66px] rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1">
                                                                        <CalendarDays size={14} className="text-gray-300" />
                                                                        <span className="text-[10px] text-gray-300 font-medium">Empty</span>
                                                                    </div>
                                                                )}
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* ── MODAL CREATE ── */}
            {openModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Tambah Shift</h2>
                                <p className="text-blue-100 text-sm mt-1">Tambahkan jadwal shift karyawan</p>
                            </div>
                            <button onClick={() => setOpenModal(false)} className="w-11 h-11 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Karyawan</label>
                                <select value={data.karyawan_id} onChange={(e) => { const sel = karyawans.find(k => k.id == e.target.value); setData('karyawan_id', e.target.value); setData('department', sel?.department || '') }} className="w-full border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                                    <option value="">Pilih Karyawan</option>
                                    {karyawans.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                <input type="text" value={data.department} readOnly className="w-full border border-gray-200 rounded-2xl px-4 py-3 bg-gray-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Hari Kerja</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {weekDays.map((day) => (
                                        <label key={day.fullDate} className={`border rounded-2xl p-4 cursor-pointer transition-all ${data.selected_dates.includes(day.fullDate) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" checked={data.selected_dates.includes(day.fullDate)} onChange={(e) => setData('selected_dates', e.target.checked ? [...data.selected_dates, day.fullDate] : data.selected_dates.filter(d => d !== day.fullDate))} />
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-700">{day.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{day.number}</p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Shift</label>
                                <select value={data.shift_type} onChange={(e) => { const v = e.target.value; setData('shift_type', v); if (v === 'libur') { setData('start_time', '00:00'); setData('end_time', '00:00') } }} className="w-full border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="pagi">Pagi</option>
                                    <option value="siang">Siang</option>
                                    <option value="malam">Malam</option>
                                    <option value="libur">Libur / Minggu</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Masuk</label>
                                    <input type="time" value={data.start_time} disabled={data.shift_type === 'libur'} onChange={(e) => setData('start_time', e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 disabled:bg-gray-100" required={data.shift_type !== 'libur'} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Keluar</label>
                                    <input type="time" value={data.end_time} disabled={data.shift_type === 'libur'} onChange={(e) => setData('end_time', e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 disabled:bg-gray-100" required={data.shift_type !== 'libur'} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setOpenModal(false)} className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 font-medium transition">Batal</button>
                                <button type="submit" disabled={processing} className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition">
                                    {processing ? 'Menyimpan...' : 'Simpan Shift'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
