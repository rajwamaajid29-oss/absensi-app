import { Head } from '@inertiajs/react'
import { useState } from 'react'

import {
    Users,
    ClipboardList,
    Clock3,
    CalendarDays,
    RotateCcw,
    TriangleAlert,
    Bell,
    Menu
} from 'lucide-react'

import Sidebar from "../Components/Sidebar"

export default function Dashboard(props) {

    const role = props.role

    const totalUsers = props.totalKaryawan ?? 0
    const checkInToday = props.checkInToday ?? 0
    const lateEmployees = props.lateEmployees ?? 0
    const leaveRequests = props.leaveRequests ?? 0
    const autoCheckout = props.autoCheckout ?? 0
    const notCheckedOut = props.notCheckedOut ?? 0

    const attendances = props.attendances ?? []
    const monthlyAttendance = props.monthlyAttendance ?? []
    const todayShifts = props.todayShifts ?? []

    const employeeName = props.employeeName ?? ''

    const [sidebarOpen, setSidebarOpen] = useState(false)

    /*
    |--------------------------------------------------------------------------
    | ADMIN CARD
    |--------------------------------------------------------------------------
    */

    const adminStats = [

        {
            title: 'Total Employees',
            total: totalUsers,
            icon: Users,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            badge: 'TOTAL',
            badgeColor: 'bg-blue-50 text-blue-600'
        },

        {
            title: 'Present Today',
            total: checkInToday,
            icon: ClipboardList,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
            badge: 'TODAY',
            badgeColor: 'bg-green-50 text-green-600'
        },

        {
            title: 'Late Employees',
            total: lateEmployees,
            icon: Clock3,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            badge: 'LATE',
            badgeColor: 'bg-red-50 text-red-500'
        },

        {
            title: 'Leave Requests',
            total: leaveRequests,
            icon: CalendarDays,
            iconBg: 'bg-yellow-50',
            iconColor: 'text-yellow-500',
            badge: 'LEAVE',
            badgeColor: 'bg-yellow-50 text-yellow-500'
        },

        {
            title: 'Auto Checkout',
            total: autoCheckout,
            icon: RotateCcw,
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            badge: 'AUTO',
            badgeColor: 'bg-indigo-50 text-indigo-600'
        },

        {
            title: 'Not Checked Out',
            total: notCheckedOut,
            icon: TriangleAlert,
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-500',
            badge: 'PENDING',
            badgeColor: 'bg-orange-50 text-orange-500'
        },
    ]

    /*
    |--------------------------------------------------------------------------
    | KARYAWAN CARD
    |--------------------------------------------------------------------------
    */

    const employeeStats = [

        {
            title: 'Present Today',
            total: checkInToday,
            icon: ClipboardList,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
            badge: 'TODAY',
            badgeColor: 'bg-green-50 text-green-600'
        },

        {
            title: 'Late',
            total: lateEmployees,
            icon: Clock3,
            iconBg: 'bg-red-50',
            iconColor: 'text-red-500',
            badge: 'LATE',
            badgeColor: 'bg-red-50 text-red-500'
        },

        {
            title: 'Leave',
            total: leaveRequests,
            icon: CalendarDays,
            iconBg: 'bg-yellow-50',
            iconColor: 'text-yellow-500',
            badge: 'LEAVE',
            badgeColor: 'bg-yellow-50 text-yellow-500'
        },

        {
            title: 'Auto Checkout',
            total: autoCheckout,
            icon: RotateCcw,
            iconBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            badge: 'AUTO',
            badgeColor: 'bg-indigo-50 text-indigo-600'
        },
    ]

    const stats =
        role === 'admin'
            ? adminStats
            : employeeStats

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-screen bg-[#f4f7fe] overflow-hidden">

                {/* SIDEBAR */}
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* MAIN */}
                <main className="flex-1 overflow-y-auto p-5 lg:p-8">

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">

                        <div className="flex items-center gap-3">

                            <button
                                className="lg:hidden bg-white p-3 rounded-xl shadow"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu size={18} />
                            </button>

                            <div>

                                <h1 className="text-3xl font-bold text-gray-800">
                                    {role === 'admin'
                                        ? 'Dashboard Admin'
                                        : `Welcome, ${employeeName}`}
                                </h1>

                                <p className="text-gray-500">
                                    {role === 'admin'
                                        ? 'Monitor employee attendance activity'
                                        : 'Your attendance activity'}
                                </p>

                            </div>

                        </div>

                        <button className="bg-white w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center">
                            <Bell size={18} />
                        </button>

                    </div>

                    {/* STATS */}
                    <div className={`grid gap-5 mb-8 ${role === 'admin'
                            ? 'grid-cols-2 xl:grid-cols-6'
                            : 'grid-cols-2 xl:grid-cols-4'
                        }`}>

                        {stats.map((item, i) => (

                            <div
                                key={i}
                                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
                            >

                                <div className="flex items-center justify-between">

                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.iconBg}`}>
                                        <item.icon
                                            size={20}
                                            className={item.iconColor}
                                        />
                                    </div>

                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${item.badgeColor}`}>
                                        {item.badge}
                                    </span>

                                </div>

                                <p className="text-gray-400 text-sm mt-5">
                                    {item.title}
                                </p>

                                <h2 className="text-4xl font-bold mt-2 text-gray-800">
                                    {item.total}
                                </h2>

                            </div>

                        ))}

                    </div>

                    {/* CHART + SHIFT */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

                        {/* CHART */}
                        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

                            <h2 className="text-2xl font-bold mb-8">

                                {role === 'admin'
                                    ? 'Monthly Attendance'
                                    : 'Your Attendance'}

                            </h2>

                            <div className="h-[320px] flex items-end gap-4">

                                {monthlyAttendance.length > 0 ? (

                                    monthlyAttendance.map((item, i) => (

                                        <div
                                            key={i}
                                            className="flex-1 flex flex-col items-center"
                                        >

                                            <div className="h-[250px] flex items-end">

                                                <div
                                                    className="w-[40px] rounded-t-2xl bg-gradient-to-t from-blue-700 to-blue-400"
                                                    style={{
                                                        height: `${item.total * 12}px`
                                                    }}
                                                />

                                            </div>

                                            <p className="mt-3 text-sm text-gray-500">
                                                {item.month}
                                            </p>

                                        </div>

                                    ))

                                ) : (

                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No attendance data
                                    </div>

                                )}

                            </div>

                        </div>

                        {/* SHIFT */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

                            <h2 className="text-2xl font-bold mb-6">

                                {role === 'admin'
                                    ? 'Today Shifts'
                                    : 'Your Shift'}

                            </h2>

                            <div className="space-y-4">

                                {todayShifts.length > 0 ? (

                                    todayShifts.map((shift, i) => (

                                        <div
                                            key={i}
                                            className="flex items-center justify-between border-b pb-4"
                                        >

                                            <div>

                                                <h3 className="font-semibold">

                                                    {role === 'admin'
                                                        ? shift.karyawan?.name
                                                        : employeeName}

                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    {shift.start_time} - {shift.end_time}
                                                </p>

                                            </div>

                                            <Clock3
                                                className="text-blue-600"
                                                size={20}
                                            />

                                        </div>

                                    ))

                                ) : (

                                    <p className="text-gray-400">
                                        Tidak ada shift hari ini
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                    {/* HISTORY */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                        <div className="p-5 border-b">

                            <h2 className="text-xl font-bold">

                                {role === 'admin'
                                    ? 'Attendance History'
                                    : 'Your Attendance History'}

                            </h2>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">

                                    <tr className="text-left text-gray-500 text-sm">

                                        {[
                                            'Employee',
                                            'Date',
                                            'Check In',
                                            'Check Out',
                                            'Status'
                                        ].map((h, i) => (

                                            <th
                                                key={i}
                                                className="px-6 py-4"
                                            >
                                                {h}
                                            </th>

                                        ))}

                                    </tr>

                                </thead>

                                <tbody>

                                    {attendances.length > 0 ? (

                                        attendances.map((item, i) => (

                                            <tr
                                                key={i}
                                                className="border-b hover:bg-gray-50"
                                            >

                                                <td className="px-6 py-4">

                                                    {role === 'admin'
                                                        ? item.karyawan?.name ?? '-'
                                                        : employeeName}

                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.date}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.check_in ?? '-'}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {item.check_out ?? '-'}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-semibold">
                                                        {item.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-center py-10 text-gray-400"
                                            >
                                                Belum ada data attendance
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </main>

            </div>
        </>
    )
}
