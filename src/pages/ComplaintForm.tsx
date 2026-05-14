import React, { useState } from 'react';
import { Send, CheckCircle2, Hospital, MessageSquare, User, Phone } from 'lucide-react';

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

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Keluhan Terkirim</h2>
          <p className="text-slate-500">
            Terima kasih atas laporan Anda. Tim kami akan segera menindaklanjuti keluhan tersebut.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-primary w-full"
          >
            Kirim Keluhan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-600 rounded-xl shadow-lg shadow-primary-200">
              <Hospital className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient E-Complaint Form</h1>
          <p className="mt-3 text-slate-500 max-w-sm mx-auto">
            Sampaikan keluhan atau saran Anda untuk membantu kami memberikan pelayanan yang lebih baik.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="h-2 bg-primary-600 w-full" />
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary-500" /> Nama Pasien (Opsional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Contoh: Bp. Ahmad"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary-500" /> Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="Contoh: 0812..."
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Hospital className="h-4 w-4 text-primary-500" /> Unit yang Dikeluhkan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {units.map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setFormData({ ...formData, unit: u })}
                    className={`py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium ${
                      formData.unit === u
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-md'
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary-500" /> Detail Keluhan
              </label>
              <textarea
                required
                rows={5}
                className="input-field resize-none"
                placeholder="Jelaskan keluhan Anda secara rinci..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.unit}
              className="btn-primary w-full h-14 text-lg font-bold shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" /> Kirim Keluhan Sekarang
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
