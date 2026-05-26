import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex">

                {/* LEFT SIDE */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex-col justify-between p-10">

                    <div>
                        <h1 className="text-2xl font-bold">AbsensiKu</h1>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4">
                            Join us & manage attendance easily
                        </h2>
                        <p className="text-blue-100">
                            Buat akun untuk mulai menggunakan sistem absensi modern.
                        </p>

                        <div className="mt-6 space-y-3 text-sm">
                            <p>✔ Monitoring karyawan</p>
                            <p>✔ Absensi cepat</p>
                            <p>✔ Data tersimpan aman</p>
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
                            Buat Akun ✨
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Daftar untuk mulai menggunakan aplikasi
                        </p>

                        <form onSubmit={submit}>

                            {/* NAME */}
                            <div className="mb-4">
                                <label className="block text-sm mb-1">Nama</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

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

                            {/* CONFIRM PASSWORD */}
                            <div className="mb-4">
                                <label className="block text-sm mb-1">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Register
                            </button>

                            {/* LOGIN LINK */}
                            <p className="text-sm text-center mt-4">
                                Sudah punya akun?{" "}
                                <Link href="/login" className="text-blue-600 font-semibold">
                                    Login
                                </Link>
                            </p>

                        </form>
                    </div>

                </div>
            </div>
        </>
    );
}
