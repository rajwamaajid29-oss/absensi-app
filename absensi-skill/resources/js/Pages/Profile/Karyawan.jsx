import { useForm, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Menu, Pencil, Trash2, Users, UserCheck, UserX, UserPlus } from 'lucide-react'

import Sidebar from "../../Components/Sidebar";
export default function Karyawan({ karyawans = [] }) {

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedId, setSelectedId]   = useState(null)

    const { data, setData, post, put, processing, reset } = useForm({
        name:       '',
        email:      '',
        password:   '',
        role:       'karyawan',
        phone:      '',
        jabatan:    '',
        department: '',
    })

    // ── CREATE ────────────────────────────────────────────────
    const submit = (e) => {
        e.preventDefault()
        post('/karyawan', {
            onSuccess: () => {
                reset()
                document.getElementById('modalTambah').close()
            },
        })
    }

    // ── UPDATE ────────────────────────────────────────────────
    const updateKaryawan = (e) => {
        e.preventDefault()
        put(`/karyawan/${selectedId}`, {
            onSuccess: () => {
                reset()
                document.getElementById('modalEdit').close()
            },
        })
    }

    // ── DELETE ────────────────────────────────────────────────
    const deleteKaryawan = (id, name) => {
        if (confirm(`Hapus ${name}?`)) router.delete(`/karyawan/${id}`)
    }

    // ── STATS CARDS ───────────────────────────────────────────
    const cards = [
        { title: 'Total Karyawan',   value: karyawans.length,         icon: Users,     color: 'blue'   },
        { title: 'Aktif',            value: karyawans.length,         icon: UserCheck, color: 'green'  },
        { title: 'On Leave',         value: 0,                        icon: UserX,     color: 'orange' },
        { title: 'New This Month',   value: `+${karyawans.length}`,   icon: UserPlus,  color: 'cyan'   },
    ]

    const inputClass = "w-full h-11 lg:h-12 border border-gray-200 rounded-xl px-4 outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"

    return (
        <div className="flex h-screen overflow-hidden bg-[#f7f8fc]">

            {/* ── SIDEBAR ── */}
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* ── MAIN ── */}
            <main className="flex-1 overflow-y-auto px-4 lg:px-7 py-5 lg:py-6 pb-24 lg:pb-6">

                {/* HEADER */}
                <div className="flex items-start justify-between mb-6 lg:mb-7">

                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={18} className="text-gray-600" />
                        </button>

                        <div>
                            <h1 className="text-2xl lg:text-[36px] font-bold text-[#111827] leading-none">
                                Employees
                            </h1>
                            <p className="text-gray-500 mt-1 lg:mt-2 text-xs lg:text-sm hidden sm:block">
                                Manage and monitor your workforce records and employment status.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => document.getElementById('modalTambah').showModal()}
                        className="h-10 lg:h-11 px-3 lg:px-5 rounded-xl bg-[#2563eb] text-white text-xs lg:text-sm font-semibold shadow-lg shadow-blue-200 whitespace-nowrap shrink-0"
                    >
                        + Tambah Karyawan
                    </button>
                </div>

                {/* CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-7">
                    {cards.map((c, i) => {
                        const Icon = c.icon
                        return (
                            <div key={i} className="bg-white rounded-[20px] lg:rounded-[26px] p-4 lg:p-5 shadow-sm border border-gray-100">
                                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-${c.color}-50 flex items-center justify-center`}>
                                    <Icon size={18} className={`text-${c.color}-500`} />
                                </div>
                                <p className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase mt-3 lg:mt-4">{c.title}</p>
                                <h2 className={`text-3xl lg:text-[36px] font-bold mt-1 text-${c.color}-500`}>{c.value}</h2>
                            </div>
                        )
                    })}
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                                    {['Employee', 'Position', 'Contact', 'Department', 'Status', 'Action'].map((t, i) => (
                                        <th key={i} className="px-6 py-4">{t}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {karyawans.map((k) => (
                                    <tr key={k.id} className="border-b border-gray-100 hover:bg-gray-50">

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={`https://ui-avatars.com/api/?background=random&name=${k.name}`}
                                                    className="w-11 h-11 rounded-full"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-[15px] text-[#111827]">{k.name}</h3>
                                                    <p className="text-sm text-gray-500">{k.employee_id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <h3 className="font-semibold text-[15px] text-[#111827]">{k.jabatan}</h3>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="text-sm text-gray-700">{k.email}</p>
                                            <p className="text-sm text-gray-500 mt-1">{k.phone}</p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="text-sm text-gray-700">{k.department}</p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-600">
                                                ● ACTIVE
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setData({ name: k.name||'', email: k.email||'', phone: k.phone||'', jabatan: k.jabatan||'', department: k.department||'' })
                                                        setSelectedId(k.id)
                                                        document.getElementById('modalEdit').showModal()
                                                    }}
                                                    className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"
                                                >
                                                    <Pencil size={17} />
                                                </button>
                                                <button
                                                    onClick={() => deleteKaryawan(k.id, k.name)}
                                                    className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>

            {/* ── MODAL TAMBAH ── */}
            <dialog id="modalTambah" className="rounded-3xl p-0 w-[calc(100vw-2rem)] lg:w-[500px] max-w-[500px] backdrop:bg-black/40">
                <form onSubmit={submit} className="bg-white rounded-3xl p-6 lg:p-7">
                    <h2 className="text-xl lg:text-2xl font-bold mb-5 lg:mb-6">Tambah Karyawan</h2>
                    <div className="space-y-3 lg:space-y-4">
                        {[['name','Nama'],['email','Email'],['password','Password'],['phone','No HP'],['jabatan','Jabatan'],['department','Department']].map(([field, placeholder], i) => (
                            <input key={i} type={field==='password'?'password':'text'} placeholder={placeholder} value={data[field]} onChange={(e) => setData(field, e.target.value)} className={inputClass} />
                        ))}
                        <select value={data.role} onChange={(e) => setData('role', e.target.value)} className={inputClass}>
                            <option value="karyawan">Karyawan</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 lg:mt-7">
                        <button type="button" onClick={() => document.getElementById('modalTambah').close()} className="px-5 h-10 lg:h-11 rounded-xl border text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="px-5 h-10 lg:h-11 rounded-xl bg-[#2563eb] text-white font-semibold text-sm">Simpan</button>
                    </div>
                </form>
            </dialog>

            {/* ── MODAL EDIT ── */}
            <dialog id="modalEdit" className="rounded-3xl p-0 w-[calc(100vw-2rem)] lg:w-[500px] max-w-[500px] backdrop:bg-black/40">
                <form onSubmit={updateKaryawan} className="bg-white rounded-3xl p-6 lg:p-7">
                    <h2 className="text-xl lg:text-2xl font-bold mb-5 lg:mb-6">Edit Karyawan</h2>
                    <div className="space-y-3 lg:space-y-4">
                        {[['name','Nama'],['email','Email'],['phone','No HP'],['jabatan','Jabatan'],['department','Department']].map(([field, placeholder], i) => (
                            <input key={i} type="text" placeholder={placeholder} value={data[field]} onChange={(e) => setData(field, e.target.value)} className={inputClass} />
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6 lg:mt-7">
                        <button type="button" onClick={() => document.getElementById('modalEdit').close()} className="px-5 h-10 lg:h-11 rounded-xl border text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="px-5 h-10 lg:h-11 rounded-xl bg-[#2563eb] text-white font-semibold text-sm">Update</button>
                    </div>
                </form>
            </dialog>

        </div>
    )
}
