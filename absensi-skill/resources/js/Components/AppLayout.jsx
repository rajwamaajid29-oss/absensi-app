import { useState } from 'react'
import Sidebar from '@/Components/Sidebar'

export default function AppLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* 🔥 BUTTON ☰ */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-[60] bg-blue-600 text-white p-2 rounded"
            >
                ☰
            </button>

            {/* 🔥 SIDEBAR */}
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* 🔥 OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* 🔥 CONTENT */}
            <main className="flex-1 p-6 lg:ml-[240px]">
                {children}
            </main>

        </div>
    )
}
