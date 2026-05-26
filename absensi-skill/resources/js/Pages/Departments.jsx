import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { Bell, Menu, Building2 } from 'lucide-react'

import Sidebar from "../Components/Sidebar";  // ← sesuaikan path project kamu

export default function Departments(props) {

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const departments = props.departments ?? []

    return (
        <>
            <Head title="Departments" />

            <div className="flex h-screen bg-[#f5f7fb] overflow-hidden">

                {/* ── SIDEBAR ── */}
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* ── MAIN ── */}
                <main className="flex-1 h-screen overflow-y-auto p-6 lg:p-8">

                    {/* TOPBAR */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <button
                                className="lg:hidden w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu size={18} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-[38px] font-bold text-[#111827] tracking-tight">Manajemen Departemen</h1>
                                <p className="text-gray-500 mt-2 text-[15px]">Struktur organisasi dan pengawasan divisi AbsensiKu.</p>
                            </div>
                        </div>
                        <button className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <Bell className="text-gray-600" size={18} />
                        </button>
                    </div>

                    {/* SEARCH */}
                    <div className="bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan nama departemen atau manager..."
                                    className="w-full h-[56px] rounded-2xl border border-gray-200 bg-[#f9fafb] pl-14 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                            <div className="flex gap-3">
                                <button className="h-[56px] px-6 rounded-2xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">Filter Status</button>
                                <button className="h-[56px] px-6 rounded-2xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">Terbaru</button>
                            </div>
                        </div>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {departments.map((item, i) => {
                            const colors = [
                                { border: 'bg-blue-500',  icon: 'bg-blue-50 text-blue-600'  },
                                { border: 'bg-cyan-500',  icon: 'bg-cyan-50 text-cyan-600'  },
                                { border: 'bg-gray-500',  icon: 'bg-gray-100 text-gray-600' },
                                { border: 'bg-red-500',   icon: 'bg-red-50 text-red-500'    },
                            ]
                            const style = colors[i % colors.length]

                            return (
                                <div
                                    key={i}
                                    className="relative bg-white rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                >
                                    <div className={`absolute left-0 top-0 w-[4px] h-full ${style.border}`} />
                                    <div className="p-8">
                                        <div className={`w-[74px] h-[74px] rounded-full flex items-center justify-center mx-auto mb-8 ${style.icon}`}>
                                            <Building2 size={34} />
                                        </div>
                                        <div className="text-center min-h-[80px]">
                                            <h2 className="text-[32px] font-bold text-[#111827] leading-tight">{item.department}</h2>
                                        </div>
                                        <div className="mt-6 text-center">
                                            <h3 className="text-[54px] font-black text-[#111827] leading-none">{item.total}</h3>
                                            <p className="text-gray-400 font-bold text-[13px] tracking-[2px] mt-3 uppercase">Employees</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </main>
            </div>
        </>
    )
}
