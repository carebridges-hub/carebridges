import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  Play,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        fetch('/.netlify/functions/complaints', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/.netlify/functions/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      const complaintsData = await complaintsRes.json();
      const statsData = await statsRes.json();
      
      setComplaints(complaintsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/.netlify/functions/complaints', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus keluhan ini?')) return;
    try {
      const res = await fetch(`/.netlify/functions/complaints?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'verified': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'closed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const unitColors: Record<string, string> = {
    'Poli Umum': '#2DD4BF',
    'Poli Jiwa': '#3B82F6',
    'Poli KIA': '#F59E0B',
    'UGD': '#EF4444',
    'Poli Persalinan': '#10B981',
    'Poli KB': '#8B5CF6',
    'Poli Gizi': '#EC4899',
    'Poli Gigi & Mulut': '#06B6D4',
    'Laboratorium': '#F97316',
    'Poli Lansia': '#14B8A6',
    'Poli TB & Paru': '#6366F1',
    'Kunjungan Online': '#D946EF',
    'Home-Visit': '#84CC16',
    'Poli HIV & IMS': '#475569',
    'Farmasi': '#0EA5E9',
    'Kasir': '#EAB308',
    'Ranap': '#22C55E'
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Selamat Datang, {user?.name}</h1>
            <p className="text-slate-500">Berikut adalah ringkasan keluhan fasilitas rumah sakit saat ini.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 transition-all group-hover:scale-110">
                <ClipboardList className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-400">Total Keluhan</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats?.total || 0}</p>
            <p className="text-sm text-slate-500 font-medium mt-1">Laporan Masuk</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-amber-600">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 transition-all group-hover:scale-110">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-400">Dalam Proses</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.summary?.find((s: any) => s.status === 'pending' || s.status === 'verified' || s.status === 'in_progress')?.count || 0}
            </p>
            <p className="text-sm text-slate-500 font-medium mt-1">Sedang Ditangani</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 transition-all group-hover:scale-110">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-400">Selesai</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats?.summary?.find((s: any) => s.status === 'resolved' || s.status === 'closed')?.count || 0}
            </p>
            <p className="text-sm text-slate-500 font-medium mt-1">Telah Diselesaikan</p>
          </div>
        </div>

        {/* Interactive Trend Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Grafik Tren Keluhan per Unit</h3>
            <div className="flex gap-2 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Real-time Data</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 overflow-x-auto pb-4">
            {stats?.unitTrend?.map((u: any) => {
              const hexColor = unitColors[u.unit] || '#94A3B8';
              return (
                <div key={u.unit} className="flex-1 min-w-[60px] flex flex-col items-center gap-4 group">
                  <div className="flex flex-col items-center gap-2 w-full h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-500">{u.count}</span>
                    <div 
                      className="w-full rounded-t-lg transition-all duration-700 ease-in-out relative shadow-md hover:scale-x-110"
                      style={{ 
                        height: `${Math.max((u.count / (stats.total || 1)) * 100, 10)}%`,
                        backgroundColor: hexColor,
                        opacity: 1
                      }}
                    >
                      <div className="absolute inset-0 bg-black/5 rounded-t-lg" />
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter text-center h-10 leading-tight">
                    {u.unit.split(' ').join('\n')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Keluhan Terbaru</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Pasien / Unit</th>
                  <th className="px-6 py-4">Deskripsikan Keluhan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{c.patientName || 'Anonim'}</p>
                      <p className="text-xs text-slate-500">{c.unit}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-1 max-w-xs">{c.content}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(c.createdAt).toLocaleString('id-ID')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(c.status)}`}>
                        {c.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user?.role === 'admin' && c.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(c.id, 'verified')}
                            className="text-[10px] font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Verifikasi
                          </button>
                        )}
                        {user?.role === 'technician' && c.status === 'verified' && (
                          <button 
                            onClick={() => updateStatus(c.id, 'in_progress')}
                            className="text-[10px] font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-1"
                          >
                            <Play className="h-3 w-3" /> Kerjakan
                          </button>
                        )}
                        {(user?.role === 'technician' || user?.role === 'admin') && (c.status === 'verified' || c.status === 'in_progress') && (
                          <button 
                            onClick={() => updateStatus(c.id, 'resolved')}
                            className="text-[10px] font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Selesai
                          </button>
                        )}
                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => handleDelete(c.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus Keluhan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
