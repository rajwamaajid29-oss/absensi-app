import { Head, usePage, router } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'
import { useGeolocated } from 'react-geolocated'
import {
    MapPin, Clock3, ShieldCheck, ScanLine,
    LogIn, LogOut, AlertCircle, Menu,
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import Sidebar from "../Components/Sidebar";  // ← sesuaikan path project kamu

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const OFFICE_LAT      = -6.495181
const OFFICE_LNG      = 107.052369
const CHECKIN_RADIUS  = 100
const AUTO_CHECKOUT_H = 17
const AUTO_CHECKOUT_M = 0

export default function Attendance() {

    const page            = usePage()
    const todayAttendance = page.props.todayAttendance

    const videoRef  = useRef(null)
    const canvasRef = useRef(null)
    const qrRef     = useRef(null)
    const streamRef = useRef(null)

    const [sidebarOpen, setSidebarOpen]   = useState(false)
    const [mode,        setMode]          = useState('camera')
    const [time,        setTime]          = useState('')
    const [qr,          setQr]            = useState('')
    const [successPopup,    setSuccessPopup]    = useState(false)
    const [successMsg,      setSuccessMsg]      = useState('')
    const [checkoutNote,    setCheckoutNote]    = useState('')
    const [checkoutTime,    setCheckoutTime]    = useState('')
    const [showCheckoutForm,setShowCheckoutForm]= useState(false)
    const [alreadyCheckedIn,  setAlreadyCheckedIn]  = useState(!!todayAttendance?.check_in)
    const [alreadyCheckedOut, setAlreadyCheckedOut] = useState(!!todayAttendance?.check_out)
    const [attendanceId,      setAttendanceId]      = useState(todayAttendance?.id ?? null)

    const { coords } = useGeolocated({ positionOptions: { enableHighAccuracy: true }, userDecisionTimeout: 5000, watchPosition: true })

    useEffect(() => {
        const today = new Date().toDateString()
        const savedDate = localStorage.getItem('absen_date')
        if (savedDate !== today) { localStorage.removeItem('auto_absen_done'); localStorage.removeItem('auto_checkout_done'); localStorage.setItem('absen_date', today) }
        if (!todayAttendance?.check_in) localStorage.removeItem('auto_absen_done')
        if (!todayAttendance?.check_out) localStorage.removeItem('auto_checkout_done')
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (mode === 'camera') { startCamera(); if (qrRef.current) qrRef.current.stop().catch(() => {}) }
        else { stopCamera(); startQR() }
        return () => { stopCamera(); if (qrRef.current) qrRef.current.stop().catch(() => {}) }
    }, [mode])

    const startCamera = async () => {
        try {
            const media = await navigator.mediaDevices.getUserMedia({ video: true })
            if (videoRef.current) videoRef.current.srcObject = media
            streamRef.current = media
        } catch (err) { console.error('Camera error:', err); alert('Camera tidak diizinkan') }
    }

    const stopCamera = () => {
        const s = streamRef.current
        if (s) s.getTracks().forEach(t => t.stop())
        streamRef.current = null
    }

    const startQR = async () => {
        try {
            qrRef.current = new Html5Qrcode('qr-reader')
            await qrRef.current.start({ facingMode: 'environment' }, { fps: 10, qrbox: 220 }, (decoded) => setQr(decoded))
        } catch (err) { console.error('QR error:', err); alert('QR gagal jalan') }
    }

    const capturePhoto = () => {
        const canvas = canvasRef.current; const video = videoRef.current
        if (!canvas || !video || video.readyState < 2) return null
        canvas.width = video.videoWidth; canvas.height = video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0)
        return canvas.toDataURL('image/png')
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3, φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180
        const Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }

    const nowTime = () => {
        const n = new Date()
        return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`
    }

    const showSuccess = (msg) => { setSuccessMsg(msg); setSuccessPopup(true); setTimeout(() => setSuccessPopup(false), 4000) }

    // Auto check-in
    useEffect(() => {
        if (!coords || alreadyCheckedIn || localStorage.getItem('auto_absen_done')) return
        const distance = calculateDistance(coords.latitude, coords.longitude, OFFICE_LAT, OFFICE_LNG)
        if (distance > CHECKIN_RADIUS) return
        localStorage.setItem('auto_absen_done', 'true')
        const payload = { lat: coords.latitude, lng: coords.longitude, auto: true, check_in_time: nowTime() }
        if (mode === 'camera') { const photo = capturePhoto(); if (photo) payload.photo = photo }
        if (mode === 'qr' && qr) payload.qr = qr
        router.post('/attendance/check-in', payload, {
            preserveScroll: true,
            onSuccess: (p) => { setAlreadyCheckedIn(true); setAttendanceId(p.props.todayAttendance?.id ?? null); showSuccess('Auto Check In Berhasil! 🎉') },
            onError: (errors) => { console.error(errors); localStorage.removeItem('auto_absen_done') },
        })
    }, [coords, alreadyCheckedIn, mode, qr])

    // Auto check-out
    useEffect(() => {
        if (!alreadyCheckedIn || alreadyCheckedOut || !attendanceId || localStorage.getItem('auto_checkout_done')) return
        const doCheckout = () => {
            if (localStorage.getItem('auto_checkout_done')) return
            localStorage.setItem('auto_checkout_done', 'true')
            router.post(`/attendance/check-out/${attendanceId}`, { auto: true, checkout_note: 'Auto checkout oleh sistem', checkout_time: nowTime() }, {
                preserveScroll: true,
                onSuccess: () => { setAlreadyCheckedOut(true); showSuccess('Auto Check Out Berhasil! 👋') },
                onError: (errors) => { console.error(errors); localStorage.removeItem('auto_checkout_done') },
            })
        }
        const checkTime = () => { const n = new Date(); if (n.getHours() >= AUTO_CHECKOUT_H && n.getMinutes() >= AUTO_CHECKOUT_M) doCheckout() }
        checkTime(); const interval = setInterval(checkTime, 30000); return () => clearInterval(interval)
    }, [alreadyCheckedIn, alreadyCheckedOut, attendanceId])

    const handleCheckIn = () => {
        if (!coords) return alert('GPS belum siap')
        const payload = { lat: coords.latitude, lng: coords.longitude, check_in_time: nowTime() }
        if (mode === 'camera') { const photo = capturePhoto(); if (photo) payload.photo = photo }
        if (mode === 'qr') { if (!qr) return alert('Scan QR dulu'); payload.qr = qr }
        router.post('/attendance/check-in', payload, {
            preserveScroll: true,
            onSuccess: (p) => { setAlreadyCheckedIn(true); setAttendanceId(p.props.todayAttendance?.id ?? null); showSuccess('Check In Berhasil! ✅') },
            onError: (err) => { console.error(err); alert(JSON.stringify(err)) },
        })
    }

    const handleCheckOut = () => {
        if (!attendanceId) return alert('Data absen tidak ditemukan')
        router.post(`/attendance/check-out/${attendanceId}`, { checkout_note: checkoutNote || null, checkout_time: checkoutTime || nowTime() }, {
            preserveScroll: true,
            onSuccess: () => { setAlreadyCheckedOut(true); setShowCheckoutForm(false); localStorage.setItem('auto_checkout_done', 'true'); showSuccess('Check Out Berhasil! 👋') },
            onError: (err) => { console.error(err); alert(JSON.stringify(err)) },
        })
    }

    return (
        <>
            <Head title="Attendance" />

            <div className="flex min-h-screen bg-[#f4f7fe]">

                {/* ── SIDEBAR ── */}
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* ── CONTENT ── */}
                <main className="flex-1 p-5 lg:p-8 overflow-y-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <button className="lg:hidden w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center" onClick={() => setSidebarOpen(true)}>
                                <Menu size={18} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Attendance Verification</h1>
                                <p className="text-gray-500 mt-1">GPS + Camera + QR Verification</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl px-8 py-5 shadow-sm border border-gray-100">
                            <p className="text-gray-400 text-sm">LIVE CLOCK</p>
                            <h2 className="text-4xl font-bold text-gray-800">{time}</h2>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className="flex gap-4 mb-6">
                        <div className={`flex-1 rounded-3xl px-6 py-4 flex items-center gap-4 border ${alreadyCheckedIn ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${alreadyCheckedIn ? 'bg-green-100' : 'bg-gray-100'}`}>
                                <LogIn size={22} className={alreadyCheckedIn ? 'text-green-600' : 'text-gray-400'} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Check In</p>
                                <p className={`font-bold text-lg ${alreadyCheckedIn ? 'text-green-700' : 'text-gray-400'}`}>
                                    {todayAttendance?.check_in ? todayAttendance.check_in.substring(0, 5) : alreadyCheckedIn ? '✓ Done' : 'Belum'}
                                </p>
                            </div>
                        </div>
                        <div className={`flex-1 rounded-3xl px-6 py-4 flex items-center gap-4 border ${alreadyCheckedOut ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${alreadyCheckedOut ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                <LogOut size={22} className={alreadyCheckedOut ? 'text-indigo-600' : 'text-gray-400'} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Check Out</p>
                                <p className={`font-bold text-lg ${alreadyCheckedOut ? 'text-indigo-700' : 'text-gray-400'}`}>
                                    {todayAttendance?.check_out ? todayAttendance.check_out.substring(0, 5) : alreadyCheckedOut ? '✓ Done' : 'Belum'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Debug GPS */}
                    {coords && (
                        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3 text-sm text-yellow-800">
                            📍 GPS aktif — Jarak ke kantor: <strong>{Math.round(calculateDistance(coords.latitude, coords.longitude, OFFICE_LAT, OFFICE_LNG))} m</strong>{' '}
                            | Radius absen: <strong>{CHECKIN_RADIUS} m</strong>{' '}
                            | Status: <strong>{calculateDistance(coords.latitude, coords.longitude, OFFICE_LAT, OFFICE_LNG) <= CHECKIN_RADIUS ? '✅ Dalam radius' : '❌ Di luar radius'}</strong>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* LEFT */}
                        <div className="xl:col-span-2 flex flex-col gap-6">

                            {!alreadyCheckedIn && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                                    <div className="flex gap-4">
                                        <button onClick={() => setMode('camera')} className={`flex-1 py-4 rounded-2xl font-semibold transition ${mode === 'camera' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>📷 Camera Mode</button>
                                        <button onClick={() => setMode('qr')} className={`flex-1 py-4 rounded-2xl font-semibold transition ${mode === 'qr' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>🔳 QR Scanner</button>
                                    </div>
                                </div>
                            )}

                            {!alreadyCheckedIn && mode === 'camera' && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                                    <div className="flex items-center gap-2 mb-4"><Clock3 className="text-blue-600" /><h2 className="font-bold text-lg">Live Camera Verification</h2></div>
                                    <div className="relative overflow-hidden rounded-3xl">
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-[420px] object-cover bg-black" />
                                        <div className="absolute inset-0 border-[4px] border-blue-500 rounded-3xl" />
                                    </div>
                                    <canvas ref={canvasRef} className="hidden" />
                                </div>
                            )}

                            {!alreadyCheckedIn && mode === 'qr' && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                                    <div className="flex items-center gap-2 mb-4"><ScanLine className="text-blue-600" /><h2 className="font-bold text-lg">QR Attendance Scanner</h2></div>
                                    {qr && <div className="mb-3 px-4 py-2 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-semibold">✅ QR Terbaca: {qr}</div>}
                                    <div className="relative overflow-hidden rounded-3xl"><div id="qr-reader" /></div>
                                </div>
                            )}

                            {alreadyCheckedIn && !alreadyCheckedOut && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                                    <div className="flex items-center gap-2 mb-2"><AlertCircle className="text-amber-500" /><h2 className="font-bold text-lg">Info Auto Check Out</h2></div>
                                    <p className="text-gray-500 text-sm mb-4">Sistem akan otomatis check out pada jam <span className="font-semibold text-gray-700">{String(AUTO_CHECKOUT_H).padStart(2,'0')}:{String(AUTO_CHECKOUT_M).padStart(2,'0')}</span>.</p>
                                    {!showCheckoutForm ? (
                                        <button onClick={() => setShowCheckoutForm(true)} className="w-full py-3 rounded-2xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition">✏️ Isi Form Check Out Manual</button>
                                    ) : (
                                        <div className="flex flex-col gap-4 mt-2">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Jam Pulang <span className="text-gray-400 font-normal ml-1">(kosongkan = pakai waktu sekarang)</span></label>
                                                <input type="time" value={checkoutTime} onChange={e => setCheckoutTime(e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan <span className="text-red-400 ml-1">*</span></label>
                                                <textarea value={checkoutNote} onChange={e => setCheckoutNote(e.target.value)} placeholder="contoh: lembur meeting dengan klien..." rows={3} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setShowCheckoutForm(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Batal</button>
                                                <button onClick={handleCheckOut} className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition">Konfirmasi Check Out</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {alreadyCheckedOut && (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3"><ShieldCheck size={32} className="text-green-600" /></div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">Absensi Hari Ini Selesai</h2>
                                    <p className="text-gray-500 text-sm">Check in dan check out sudah tercatat. Sampai jumpa besok!</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-center gap-2 mb-4"><MapPin className="text-blue-600" /><h2 className="font-bold">GPS Verification</h2></div>
                                <div className="rounded-3xl overflow-hidden">
                                    {coords ? (
                                        <MapContainer center={[coords.latitude, coords.longitude]} zoom={18} scrollWheelZoom={false} className="h-[280px] w-full z-0">
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Marker position={[coords.latitude, coords.longitude]}><Popup>Lokasi Anda</Popup></Marker>
                                            <Circle center={[OFFICE_LAT, OFFICE_LNG]} radius={CHECKIN_RADIUS} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
                                        </MapContainer>
                                    ) : (
                                        <div className="h-[280px] flex flex-col items-center justify-center bg-gray-100 gap-2">
                                            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                            <p className="text-gray-500 text-sm">Mengambil GPS...</p>
                                        </div>
                                    )}
                                </div>
                                {coords && (
                                    <div className="mt-3 text-center text-sm text-gray-500">
                                        Jarak ke kantor:{' '}
                                        <span className={`font-semibold ${calculateDistance(coords.latitude, coords.longitude, OFFICE_LAT, OFFICE_LNG) <= CHECKIN_RADIUS ? 'text-green-600' : 'text-red-500'}`}>
                                            {Math.round(calculateDistance(coords.latitude, coords.longitude, OFFICE_LAT, OFFICE_LNG))} m
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                                <div className="flex items-center gap-2 mb-4"><ShieldCheck className="text-blue-600" /><h2 className="font-bold">Attendance Action</h2></div>
                                {!alreadyCheckedIn && (
                                    <button onClick={handleCheckIn} disabled={!coords} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-white py-5 rounded-2xl text-lg font-bold shadow-lg">
                                        {coords ? '✔ Check In Now' : '⏳ Menunggu GPS...'}
                                    </button>
                                )}
                                {alreadyCheckedIn && !alreadyCheckedOut && (
                                    <button onClick={() => setShowCheckoutForm(v => !v)} className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-5 rounded-2xl text-lg font-bold shadow-lg">
                                        🚪 Check Out Now
                                    </button>
                                )}
                                {alreadyCheckedOut && <div className="text-center text-gray-400 py-4 font-semibold">✅ Absensi Selesai</div>}
                            </div>
                        </div>
                    </div>

                    {/* SUCCESS POPUP */}
                    {successPopup && (
                        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="bg-white w-[430px] rounded-[35px] overflow-hidden shadow-2xl">
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-600" />
                                <div className="p-8">
                                    <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">{successMsg}</h1>
                                    <p className="text-center text-gray-500 mb-7 text-lg">Data absensi berhasil tersimpan</p>
                                    <button onClick={() => setSuccessPopup(false)} className="mt-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold">Done</button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </>
    )
}
