import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex">

                {/* LEFT SIDE */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex-col justify-between p-10">

                    <div>
                        <h1 className="text-2xl font-bold">AbsensiKu</h1>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Revolutionize your workflow
                        </h2>
                        <p className="text-blue-100">
                            Sistem absensi modern untuk memudahkan monitoring karyawan.
                        </p>

                        <div className="mt-6 space-y-3 text-sm">
                            <p>✔ Real-time tracking</p>
                            <p>✔ Dashboard interaktif</p>
                            <p>✔ Riwayat lengkap</p>
                        </div>
                    </div>

                    <p className="text-xs text-blue-200">
                        © 2026 AbsensiKu
                    </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100">

                    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

                        <h2 className="text-2xl font-bold mb-2">
                            Selamat Datang 👋
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Silakan login untuk melanjutkan
                        </p>

                        <form onSubmit={submit}>

                            {/* EMAIL */}
                            <div className="mb-4">
                                <label className="block text-sm mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            {/* PASSWORD */}
                            <div className="mb-4">
                                <label className="block text-sm mb-1">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>

                            {/* REMEMBER */}
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm">Remember me</span>
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Login
                            </button>

                            {/* REGISTER */}
                            <p className="text-sm text-center mt-4">
                                Belum punya akun?{" "}
                                <Link href="/register" className="text-blue-600 font-semibold">
                                    Daftar
                                </Link>
                            </p>

                        </form>
                    </div>

                </div>
            </div>
        </>
    );
}
