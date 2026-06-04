"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ShieldAlert, Users, Camera, ClipboardList, CheckCircle, XCircle, Search, RefreshCw } from "lucide-react";

interface MetricStats {
  totalPartners: number;
  verifiedPartners: number;
  onlinePartners: number;
  verificationRate: number;
  totalClients: number;
  totalBookings: number;
}

interface PartnerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  isVerified: boolean;
  availability: string;
  rating: number;
  completedProjects: number;
  walletBalance: number;
  totalWithdrawn: number;
  createdAt: string;
}

interface ClientItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  stats: {
    totalBookings: number;
    completedBookings: number;
    totalSpent: number;
  };
}

interface AuditLogItem {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  } | null;
}

export default function AdminPage() {
  const [metrics, setMetrics] = useState<MetricStats | null>(null);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [togglingVerify, setTogglingVerify] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch directory & metrics
      const dirRes = await fetch("/api/admin/onboarded-directory");
      if (dirRes.ok) {
        const data = await dirRes.json();
        setMetrics(data.metrics);
        setPartners(data.partners || []);
        setClients(data.clients || []);
      }

      // 2. Fetch audit logs
      const logsRes = await fetch("/api/admin/audit-logs");
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (partnerId: string, currentStatus: boolean) => {
    setTogglingVerify(partnerId);
    try {
      const res = await fetch("/api/admin/verify-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, isVerified: !currentStatus }),
      });

      if (res.ok) {
        toast.success(currentStatus ? "Partner unverified" : "Partner verified successfully");
        setPartners((prev) =>
          prev.map((p) => (p.id === partnerId ? { ...p, isVerified: !currentStatus } : p))
        );
        if (metrics) {
          setMetrics({
            ...metrics,
            verifiedPartners: currentStatus ? metrics.verifiedPartners - 1 : metrics.verifiedPartners + 1,
          });
        }
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setTogglingVerify(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPartners = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orbit-cyan to-orbit-purple bg-clip-text text-transparent">
            Orbit Command Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Production operations panel & system moderation portal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchData} disabled={loading} variant="outline" className="border-gray-800 text-gray-300 hover:bg-gray-900">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 px-3 py-1.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin Role Active
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-[#121212] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400 text-xs uppercase tracking-wider">Total Bookings</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-black">{metrics.totalBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-orbit-cyan">
                <ClipboardList className="w-3.5 h-3.5 mr-1" /> System volume active
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#121212] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400 text-xs uppercase tracking-wider">Total Partners</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-black">{metrics.totalPartners}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-orbit-purple">
                <Camera className="w-3.5 h-3.5 mr-1" /> {metrics.onlinePartners} online now
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#121212] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400 text-xs uppercase tracking-wider">Total Clients</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-black">{metrics.totalClients}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-green-400">
                <Users className="w-3.5 h-3.5 mr-1" /> Registered accounts
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#121212] border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400 text-xs uppercase tracking-wider">Verification Rate</CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-black">{metrics.verificationRate.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-yellow-400">
                <CheckCircle className="w-3.5 h-3.5 mr-1" /> {metrics.verifiedPartners} verified videographers
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Card className="bg-[#121212] border-gray-800 text-white">
        <CardHeader className="pb-4 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>System Directory</CardTitle>
            <CardDescription className="text-gray-400">Moderate accounts and review system operations logs</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by name, email, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#1c1c1c] border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-orbit-cyan"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="partners" className="w-full">
            <TabsList className="bg-[#1c1c1c] border border-gray-800 mb-6">
              <TabsTrigger value="partners" className="data-[state=active]:bg-orbit-cyan data-[state=active]:text-black">
                Partners Directory ({filteredPartners.length})
              </TabsTrigger>
              <TabsTrigger value="clients" className="data-[state=active]:bg-orbit-purple data-[state=active]:text-white">
                Clients Directory ({filteredClients.length})
              </TabsTrigger>
              <TabsTrigger value="audit" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                Audit Logs ({logs.length})
              </TabsTrigger>
            </TabsList>

            {/* Partners Tab */}
            <TabsContent value="partners" className="space-y-4">
              <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1c1c1c] text-xs uppercase text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Name / Contact</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Verification</th>
                      <th className="px-6 py-4">Availability</th>
                      <th className="px-6 py-4">Stats</th>
                      <th className="px-6 py-4">Wallet</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900">
                    {filteredPartners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-[#151515] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{partner.name}</div>
                          <div className="text-xs text-gray-500">{partner.email}</div>
                          <div className="text-xs text-gray-500">{partner.phone}</div>
                        </td>
                        <td className="px-6 py-4">{partner.location}</td>
                        <td className="px-6 py-4">
                          {partner.isVerified ? (
                            <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">Verified</Badge>
                          ) : (
                            <Badge className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Pending KYC</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${partner.availability === "ONLINE" ? "bg-green-400" : "bg-gray-600"}`} />
                          {partner.availability}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs">Projects: {partner.completedProjects}</div>
                          <div className="text-xs text-yellow-400">★ {partner.rating.toFixed(1)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs">Bal: ₹{partner.walletBalance}</div>
                          <div className="text-xs text-gray-500">Withdrawn: ₹{partner.totalWithdrawn}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            onClick={() => handleToggleVerification(partner.id, partner.isVerified)}
                            disabled={togglingVerify === partner.id}
                            size="sm"
                            variant={partner.isVerified ? "destructive" : "default"}
                            className={partner.isVerified ? "bg-red-950 text-red-400 hover:bg-red-900" : "bg-orbit-cyan text-black hover:bg-orbit-cyan/95"}
                          >
                            {partner.isVerified ? "Revoke KYC" : "Approve KYC"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-4">
              <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1c1c1c] text-xs uppercase text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Name / Contact</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4">Total Bookings</th>
                      <th className="px-6 py-4">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-[#151515] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.email}</div>
                          <div className="text-xs text-gray-500">{client.phone}</div>
                        </td>
                        <td className="px-6 py-4">{new Date(client.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{client.stats.totalBookings}</td>
                        <td className="px-6 py-4 text-green-400">₹{client.stats.totalSpent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Audit Logs Tab */}
            <TabsContent value="audit" className="space-y-4">
              <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1c1c1c] text-xs uppercase text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Target Entity</th>
                      <th className="px-6 py-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#151515] transition-colors">
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{log.user?.name || "System"}</div>
                          <div className="text-xs text-gray-500">{log.user?.email || "anonymous"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-[#242424] text-gray-300 border border-gray-800">{log.action}</Badge>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono">
                          {log.entity} ({log.entityId || "N/A"})
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                          {log.ipAddress || "local"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
