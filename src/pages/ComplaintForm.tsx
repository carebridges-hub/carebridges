import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  CheckCircle2, 
  Hospital, 
  MessageSquare, 
  User, 
  Phone, 
  LogIn,
  Search,
  ClipboardList,
  ShieldCheck,
  Smartphone,
  ArrowRight
} from 'lucide-react';

const units = ['Poli', 'Farmasi', 'Kasir', 'Ranap'];

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    whatsapp: '',
    unit: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const procedures = [
    { icon: Smartphone, title: 'Input Laporan', desc: 'Isi formulir pengaduan dengan lengkap.' },
    { icon: ClipboardList, title: 'Verifikasi', desc: 'Tim admin akan memverifikasi laporan Anda.' },
    { icon: Search, title: 'Pengerjaan', desc: 'Teknisi segera meluncur ke lokasi.' },
    { icon: ShieldCheck, title: 'Selesai', desc: 'Fasilitas kembali nyaman digunakan.' },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-50">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Laporan Diterima!</h2>
          <p className="text-slate-500 leading-relaxed">
            Terima kasih kak! Laporan kamu sudah masuk ke sistem kami. Tim teknisi akan segera menindaklanjuti.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-primary w-full h-12 rounded-2xl shadow-lg shadow-primary-200"
          >
            Kirim Laporan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Hero Section with Medical Gradient */}
      <div className="medical-gradient pt-20 pb-32 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        {/* Admin Login Button */}
        <div className="absolute top-6 right-6">
          <Link 
            to="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white hover:text-primary-700 transition-all shadow-xl"
          >
            <LogIn className="h-4 w-4" />
            Login Admin
          </Link>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-widest uppercase mb-4">
            <Hospital className="h-4 w-4" /> E-Care Response System
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Layanan Pengaduan Cepat <br className="hidden md:block" />
            <span className="text-primary-100">Sarana & Prasarana</span>
          </h1>
          <p className="text-primary-50 text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-90">
            Kenyamanan Anda adalah prioritas kami. Laporkan kerusakan fasilitas rumah sakit dalam sekejap.
          </p>
        </div>
      </div>

      {/* Procedure Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {procedures.map((p, i) => (
            <div key={i} className="text-center space-y-3 group">
              <div className="mx-auto h-14 w-14 bg-slate-50 text-primary-600 rounded-2xl flex items-center justify-center transition-all group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-6 shadow-sm border border-slate-100">
                <p.icon className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed px-2">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-slate-50 border-b border-slate-100 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Buat Laporan Baru</h2>
            <p className="text-slate-500 text-sm mt-1">Isi data di bawah ini dengan santai ya kak.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                  <User className="h-4 w-4 text-primary-500" /> Nama Anda
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className="input-field h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all pl-12"
                    placeholder="Contoh: Bp. Ahmad"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                  <Smartphone className="h-4 w-4 text-primary-500" /> WhatsApp
                </label>
                <div className="relative group">
                  <input
                    type="tel"
                    required
                    className="input-field h-14 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all pl-12"
                    placeholder="Contoh: 0812..."
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                <Hospital className="h-4 w-4 text-primary-500" /> Unit Mana yang Bermasalah?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {units.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setFormData({ ...formData, unit: u })}
                    className={`h-16 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-sm ${
                      formData.unit === u
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md scale-[1.02]'
                        : 'border-slate-50 bg-slate-50/50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                <MessageSquare className="h-4 w-4 text-primary-500" /> Jelaskan Keluhannya
              </label>
              <div className="relative group">
                <textarea
                  required
                  rows={4}
                  className="input-field rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all pt-12 pl-12"
                  placeholder="Ceritakan detail kerusakannya di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <MessageSquare className="absolute left-4 top-12 h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.unit}
              className="btn-primary w-full h-16 rounded-[1.25rem] text-lg font-bold shadow-xl shadow-primary-200 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              {loading ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-6 w-6" /> Kirim Laporan Sekarang
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Section */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-slate-900">Cek Status Laporan?</h4>
            <p className="text-xs text-slate-500">Masukkan Nomor WA kamu untuk melihat progres.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="text" 
              placeholder="Nomor WA / ID Laporan" 
              className="input-field h-12 rounded-xl text-sm"
            />
            <button className="px-6 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all">
              Cek <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="#" className="hover:text-primary-600">Privacy Policy</Link>
          <Link to="#" className="hover:text-primary-600">Terms of Service</Link>
          <Link to="#" className="hover:text-primary-600">Help Center</Link>
        </div>
        <p>&copy; 2024 CAREBRIDGES. Dibuat dengan sepenuh hati untuk kenyamanan pasien.</p>
      </footer>
    </div>
  );
};

export default ComplaintForm;
