import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  ShieldAlert,
  BarChart,
  PieChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Monitoring = () => {
  const [stats, setStats] = useState<any>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetch('/.netlify/functions/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setStats(data));
  }, [token]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Executive Monitoring</h1>
            <p className="text-slate-500">Analisis tren dan performa respon unit.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <TrendingUp className="h-4 w-4" />
            <span>+12% vs Bulan Lalu</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Placeholder */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary-600" />
                Tren Keluhan per Unit
              </h3>
            </div>
            <div className="h-64 flex items-end justify-between gap-4">
              {stats?.unitTrend?.map((u: any) => (
                <div key={u.unit} className="flex-1 flex flex-col items-center gap-4">
                  <div 
                    className="w-full bg-primary-500 rounded-t-lg transition-all duration-1000 ease-out hover:bg-primary-600 cursor-pointer relative group"
                    style={{ height: `${(u.count / (stats.total || 1)) * 100}%`, minHeight: '10%' }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all">
                      {u.count} Keluhan
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{u.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-8">
              <PieChart className="h-5 w-5 text-indigo-600" />
              Response Performance
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Rata-rata Respon</span>
                  <span className="font-bold text-slate-900">45 Menit</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tingkat Penyelesaian</span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[92%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Kepuasan Pasien</span>
                  <span className="font-bold text-slate-900">4.8/5.0</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[96%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-600">Alert Keluhan</p>
              <p className="text-2xl font-bold text-red-700">
                {stats?.summary?.find((s: any) => s.status === 'pending')?.count || 0} Belum Respon
              </p>
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Total User Aktif</p>
              <p className="text-2xl font-bold text-blue-700">12 Staf</p>
            </div>
          </div>
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-600">Avg. Resolution</p>
              <p className="text-2xl font-bold text-indigo-700">2.4 Jam</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Monitoring;
