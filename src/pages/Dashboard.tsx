import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  ArrowRight
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

  const statCards = [
    { label: 'Total Keluhan', value: stats?.total || 0, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending', value: stats?.summary?.find((s: any) => s.status === 'pending')?.count || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Dalam Proses', value: stats?.summary?.find((s: any) => s.status === 'in_progress' || s.status === 'verified')?.count || 0, icon: AlertCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Selesai', value: stats?.summary?.find((s: any) => s.status === 'resolved' || s.status === 'closed')?.count || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-all group-hover:scale-110`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-slate-400">Minggu Ini</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Keluhan Terbaru</h3>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Pasien / Unit</th>
                  <th className="px-6 py-4">Isi Keluhan</th>
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
                        {user.role === 'admin' && c.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(c.id, 'verified')}
                            className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all"
                          >
                            Verifikasi
                          </button>
                        )}
                        {user.role === 'technician' && c.status === 'verified' && (
                          <button 
                            onClick={() => updateStatus(c.id, 'in_progress')}
                            className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all"
                          >
                            Kerjakan
                          </button>
                        )}
                        {user.role === 'technician' && c.status === 'in_progress' && (
                          <button 
                            onClick={() => updateStatus(c.id, 'resolved')}
                            className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all"
                          >
                            Selesaikan
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
