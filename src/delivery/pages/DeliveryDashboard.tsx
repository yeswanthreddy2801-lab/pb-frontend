import { useNavigate } from 'react-router-dom';
import { useDeliveryAuth } from '../hooks/useDeliveryAuth';
import { useTodayDeliveries } from '../hooks/useTodayDeliveries';
import { useDeliveryStats } from '../hooks/useDeliveryStats';
import { DeliveryCard } from '../components/DeliveryCard';

export default function DeliveryDashboard() {
  const { deliveryBoy, logout } = useDeliveryAuth();
  const navigate = useNavigate();
  const { data: stats } = useDeliveryStats();
  const { data: todayDeliveries, isLoading } = useTodayDeliveries();

  const total = stats?.total || 0;
  const pending = stats?.pending || 0;
  const delivered = stats?.delivered || 0;
  const failed = stats?.failed || 0;
  const progressPercent = total > 0 ? (delivered / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-surface p-4 pb-20">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6">
        <div>
          <h1 className="text-xl font-bold">Good Morning, {deliveryBoy?.name}! 🚚</h1>
          <p className="text-sm text-gray-500">{new Date().toDateString()}</p>
        </div>
        <button onClick={logout} className="text-red-500 font-semibold px-4 py-2 border rounded-lg">Logout</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-blue-600 text-sm font-semibold">📦 Total Today</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
          <p className="text-amber-600 text-sm font-semibold">⏳ Pending</p>
          <p className="text-2xl font-bold">{pending}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-green-600 text-sm font-semibold">✅ Delivered</p>
          <p className="text-2xl font-bold">{delivered}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <p className="text-red-600 text-sm font-semibold">❌ Failed</p>
          <p className="text-2xl font-bold">{failed}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          className="flex-1 bg-brand-green text-white py-3 rounded-xl font-semibold shadow-sm"
          onClick={() => navigate('/delivery/pending')}
        >
          Pending Deliveries
        </button>
        <button 
          className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-semibold border shadow-sm"
          onClick={() => navigate('/delivery/completed')}
        >
          Completed Today
        </button>
      </div>
      
      <h2 className="text-lg font-bold mb-4">Today's Progress</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8">
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className="bg-brand-green h-4 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className="text-sm text-center text-gray-500">{delivered} / {total} deliveries completed</p>
      </div>

      <h2 className="text-lg font-bold mb-4">Pending Assignments</h2>
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl w-full"></div>)}
        </div>
      ) : (
        <div className="space-y-4">
          {todayDeliveries
            ?.filter(d => ['pending', 'out_for_delivery'].includes(d.delivery_status))
            .slice(0, 5)
            .map(delivery => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
          {(!todayDeliveries || todayDeliveries.filter(d => ['pending', 'out_for_delivery'].includes(d.delivery_status)).length === 0) && (
            <p className="text-gray-500 text-center py-4">No pending deliveries right now! 🎉</p>
          )}
        </div>
      )}
    </div>
  );
}
