import React from 'react'
import { Link } from '@inertiajs/react'
import {
    FaHome,
    FaUsers,
    FaClock,
    FaChartBar,
    FaEnvelope,
    FaPhoneAlt,
    FaInstagram,
    FaFacebook,
} from 'react-icons/fa'

export default function Welcome() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#140B2D] text-white">

            {/* BACKGROUND GRID */}
            <div
                className="
                absolute inset-0
                bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),
                     linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
                bg-[size:60px_60px]
                "
            ></div>

            {/* GLOW EFFECT */}
            <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-indigo-500/20 rounded-full blur-3xl"></div>

            {/* CONTENT */}
            <div className="relative z-10">

                {/* NAVBAR */}
                <nav className="fixed top-0 left-0 w-full bg-[#140B2D]/70 backdrop-blur-lg border-b border-white/10 z-50">
                    <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">

                        {/* LOGO */}
                        <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                            AbsensiKu
                        </h1>

                        {/* MENU */}
                        <div className="hidden md:flex gap-10 text-slate-300 font-medium">
                            <a href="#home" className="hover:text-cyan-400 transition">Home</a>
                            <a href="#tentang" className="hover:text-cyan-400 transition">Tentang</a>
                            <a href="#kontak" className="hover:text-cyan-400 transition">Kontak</a>
                        </div>

                        {/* LOGIN & REGISTER */}
                        <div className="flex gap-4">
                            <Link
                                href="/login"
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 transition px-6 py-3 rounded-full font-semibold shadow-lg"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-white/10 border border-white/10 px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* HERO SECTION */}
                <section id="home" className="pt-44 pb-28">
                    <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-20 items-center">

                        {/* LEFT HERO */}
                        <div>
                            <p className="text-cyan-400 uppercase tracking-[6px] mb-6">
                                Sistem Absensi Modern
                            </p>
                            <h1 className="text-6xl md:text-7xl font-black leading-tight">
                                Sistem Absensi<br/>
                                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                                    Karyawan Modern
                                </span>
                            </h1>
                            <p className="mt-8 text-slate-300 text-lg leading-relaxed">
                                Kelola absensi karyawan secara digital dengan cepat, aman, dan real-time. Optimalkan produktivitas Anda dengan monitoring modern.
                            </p>
                            <div className="flex gap-5 mt-10 flex-wrap">
                                <Link
                                    href="/login"
                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 transition px-8 py-4 rounded-2xl font-semibold shadow-xl"
                                >
                                    Mulai Sekarang
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-white/10 backdrop-blur-lg border border-white/10 hover:bg-white/20 transition px-8 py-4 rounded-2xl font-semibold"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT HERO IMAGE */}
                        <div>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 shadow-2xl">
                                <img
                                    src="https://img.freepik.com/free-vector/dashboard-concept-illustration_114360-4456.jpg"
                                    alt="dashboard"
                                    className="rounded-2xl w-full"
                                />
                            </div>
                        </div>

                    </div>
                </section>

                {/* FITUR SECTION */}
                <section id="tentang" className="py-28">
                    <div className="max-w-7xl mx-auto px-10">
                        <div className="text-center mb-20">
                            <h2 className="text-5xl font-black">Fitur Aplikasi</h2>
                            <p className="text-slate-300 mt-5 max-w-3xl mx-auto text-lg">
                                Dirancang untuk fleksibilitas dan kecepatan, AbsensiKu menghadirkan pengalaman absensi modern untuk perusahaan Anda.
                            </p>
                        </div>

                        {/* FEATURE CARDS */}
                        <div className="grid md:grid-cols-4 gap-8">

                            {/* CARD 1 */}
                            <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:-translate-y-2 transition duration-300 shadow-xl">
                                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-3xl mb-6">
                                    <FaClock />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Check In/Out</h3>
                                <p className="text-slate-300 leading-relaxed">Proses absensi lebih cepat dan akurat.</p>
                            </div>

                            {/* CARD 2 */}
                            <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:-translate-y-2 transition duration-300 shadow-xl">
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 text-3xl mb-6">
                                    <FaChartBar />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Dashboard</h3>
                                <p className="text-slate-300 leading-relaxed">Monitoring statistik absensi secara real-time.</p>
                            </div>

                            {/* CARD 3 */}
                            <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:-translate-y-2 transition duration-300 shadow-xl">
                                <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 text-3xl mb-6">
                                    <FaUsers />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Data Karyawan</h3>
                                <p className="text-slate-300 leading-relaxed">Kelola seluruh data karyawan secara praktis.</p>
                            </div>

                            {/* CARD 4 */}
                            <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl hover:-translate-y-2 transition duration-300 shadow-xl">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-3xl mb-6">
                                    <FaHome />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Responsive</h3>
                                <p className="text-slate-300 leading-relaxed">Tampilan modern untuk desktop & mobile.</p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* KONTAK SECTION */}
                <section id="kontak" className="pb-28">
                    <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-12">

                        {/* LEFT */}
                        <div>
                            <h2 className="text-5xl font-black mb-6">Hubungi Kami</h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-10">
                                Punya pertanyaan seputar implementasi sistem atau butuh bantuan teknis? Tim kami siap membantu Anda.
                            </p>

                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                        <FaEnvelope />
                                    </div>
                                    <p className="font-medium">support@absensi.com</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <FaPhoneAlt />
                                    </div>
                                    <p className="font-medium">+62 812 555 324</p>
                                </div>

                                <div className="flex gap-5 mt-10 text-3xl">
                                    <FaInstagram className="text-pink-400 cursor-pointer hover:scale-110 transition" />
                                    <FaFacebook className="text-cyan-400 cursor-pointer hover:scale-110 transition" />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTACT FORM */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
                            <form className="space-y-6">
                                <div>
                                    <label className="block mb-2 font-medium">Nama Lengkap</label>
                                    <input type="text" className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-cyan-400" />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">Email</label>
                                    <input type="email" className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-cyan-400" />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">Pesan</label>
                                    <textarea rows="5" className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-cyan-400"></textarea>
                                </div>

                                <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-[1.02] transition py-4 rounded-xl font-semibold">
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    )
}
