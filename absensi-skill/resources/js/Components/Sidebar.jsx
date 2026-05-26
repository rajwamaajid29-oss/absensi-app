import {
    LayoutDashboard,
    Users,
    Clock3,
    History,
    ClipboardList,
    Briefcase,
    LogOut,
    X
} from 'lucide-react'

import { Link, usePage } from '@inertiajs/react'

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen
}) {

    /*
    |--------------------------------------------------------------------------
    | AUTH USER
    |--------------------------------------------------------------------------
    */

    const { auth } = usePage().props

    const user = auth.user

    /*
    |--------------------------------------------------------------------------
    | MENU BERDASARKAN ROLE
    |--------------------------------------------------------------------------
    */

    const menus =
        user.role === 'admin'
            ? [
                {
                    href: '/dashboard',
                    icon: LayoutDashboard,
                    label: 'Dashboard'
                },
                {
                    href: '/karyawan',
                    icon: Users,
                    label: 'Employees'
                },
                {
                    href: '/shift-management',
                    icon: Clock3,
                    label: 'Shift Management'
                },
                {
                    href: '/departments',
                    icon: Briefcase,
                    label: 'Departments'
                },
                {
                    href: '/activity-logs',
                    icon: History,
                    label: 'History'
                },
            ]
            : [
                {
                    href: '/dashboard',
                    icon: LayoutDashboard,
                    label: 'Dashboard'
                },
                {
                    href: '/attendance',
                    icon: ClipboardList,
                    label: 'Attendance'
                },
                {
                    href: '/activity-logs',
                    icon: History,
                    label: 'History'
                },
            ]

    /*
    |--------------------------------------------------------------------------
    | STYLE
    |--------------------------------------------------------------------------
    */

    const menuClass =
        "flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium hover:bg-white/10 transition"

    return (

        <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-[220px] bg-gradient-to-b from-[#2563eb] to-[#1e40af] text-white flex flex-col justify-between lg:sticky top-0 h-screen shrink-0 transition-transform duration-300 ${
                sidebarOpen
                    ? 'translate-x-0'
                    : '-translate-x-full lg:translate-x-0'
            }`}
        >

            <div>

                {/* LOGO */}
                <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">

                    <div>

                        <h1 className="text-[24px] font-bold">
                            AbsensiKu
                        </h1>

                        <p className="text-[12px] text-blue-100 mt-1">
                            {user.role === 'admin'
                                ? 'Enterprise Admin'
                                : 'Employee Panel'}
                        </p>

                    </div>

                    <button
                        className="lg:hidden text-white/80 hover:text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* MENU */}
                <div className="p-3 space-y-1.5 relative z-50">
                    {menus.map((m, i) => {

                        const Icon = m.icon

                        return (

                        <Link
                            key={i}
                            href={m.href}
                            as="a"
                            className={`pointer-events-auto ${
                                route().current(m.href.replace('/', ''))
                                    ? "flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold bg-white text-[#2563eb] shadow-lg"
                                    : menuClass
                            }`}

                            >

                                <Icon size={18} />

                                {m.label}

                            </Link>
                        )
                    })}

                </div>

            </div>

            {/* BOTTOM */}
            <div className="p-3 border-t border-white/10">

                <div className="flex items-center gap-3 px-2 py-2">

                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold uppercase">
                        {user.name?.charAt(0)}
                    </div>

                    <div>

                        <h3 className="text-sm font-semibold">
                            {user.name}
                        </h3>

                        <p className="text-xs text-blue-100 capitalize">
                            {user.role}
                        </p>

                    </div>

                </div>

                <form method="POST" action="/logout">

                    <button
                        type="submit"
                        className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-white/10 transition"
                    >

                        <LogOut size={17} />

                        Logout

                    </button>

                </form>

            </div>

        </aside>
    )
}
