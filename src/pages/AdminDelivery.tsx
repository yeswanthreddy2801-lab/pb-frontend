import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminDeliveryApi } from "@/api/adminDelivery";
import { toast } from "sonner";
import { MapPin, Truck } from "lucide-react";

export default function AdminDelivery() {
  const [activeTab, setActiveTab] = useState("today");
  const queryClient = useQueryClient();

  const { data: staff, isLoading: isStaffLoading } = useQuery({
    queryKey: ["adminDeliveryStaff"],
    queryFn: adminDeliveryApi.getStaff,
  });

  const { data: deliveries, isLoading: isDeliveriesLoading } = useQuery({
    queryKey: ["adminTodayDeliveries"],
    queryFn: adminDeliveryApi.getTodayDeliveries,
  });

  const { data: stats } = useQuery({
    queryKey: ["adminDeliveryStats"],
    queryFn: adminDeliveryApi.getStats,
  });

  const { mutate: assign } = useMutation({
    mutationFn: (data: { id: string; staffId: string }) => 
      adminDeliveryApi.assignDelivery(data.id, data.staffId),
    onSuccess: () => {
      toast.success("Assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["adminTodayDeliveries"] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || "Failed to assign")
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin"><Button variant="outline">← Back</Button></Link>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">Delivery Management 🚚</h1>
          </div>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="today">Today's Deliveries</TabsTrigger>
          <TabsTrigger value="staff">Delivery Staff</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
            <h2 className="text-xl font-bold">Today's Schedule ({deliveries?.length || 0})</h2>
            
            {isDeliveriesLoading ? (
              <p>Loading...</p>
            ) : deliveries?.length > 0 ? (
              <div className="space-y-4">
                {deliveries.map((d: any) => (
                  <div key={d.id} className="border p-4 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-bold">{d.users?.name} - {d.users?.mobile}</h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate max-w-xs md:max-w-md" title={d.addresses?.address}>
                          {d.addresses?.area ? `${d.addresses.area}, ${d.addresses.city}` : (d.addresses?.address || 'No address provided')}
                        </span>
                      </p>
                      <p className="text-sm mt-1">Status: <span className="font-semibold capitalize text-brand-green">{d.delivery_status.replace(/_/g, ' ')}</span></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select 
                        className="border rounded-lg p-2 bg-white"
                        value={d.delivery_boy_id || ""}
                        onChange={(e) => assign({ id: d.id, staffId: e.target.value })}
                        disabled={d.delivery_status === 'delivered'}
                      >
                        <option value="">Unassigned</option>
                        {staff?.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No deliveries scheduled for today.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="staff">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delivery Partners</h2>
            </div>
            
            {isStaffLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff?.map((s: any) => (
                  <div key={s.id} className="border p-4 rounded-xl flex items-start gap-4">
                    <div className="bg-brand-green/10 p-3 rounded-full text-brand-green">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{s.name}</h3>
                      <p className="text-gray-600">{s.mobile}</p>
                      <p className="text-sm text-gray-500 mt-1">Vehicle: {s.vehicle_number}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border">
                <p className="text-gray-500 font-semibold">Total Assigend</p>
                <p className="text-3xl font-bold">{stats?.totalAssigned || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-green-600 font-semibold">Delivered</p>
                <p className="text-3xl font-bold text-green-700">{stats?.delivered || 0}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-amber-600 font-semibold">Pending</p>
                <p className="text-3xl font-bold text-amber-700">{stats?.pending || 0}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-600 font-semibold">Failed</p>
                <p className="text-3xl font-bold text-red-700">{stats?.failed || 0}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold mt-8 mb-4">Partner Performance</h3>
            <div className="space-y-3">
              {stats?.byDeliveryBoy?.map((b: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                  <span className="font-semibold">{b.name}</span>
                  <span className="text-gray-600">{b.delivered} / {b.total} delivered</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </main>
    </div>
  );
}
