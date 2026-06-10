"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShieldAlert, Video, DollarSign, Award, Activity, Check } from "lucide-react";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>({
    totalPartners: 0,
    verifiedPartners: 0,
    onlinePartners: 0,
    verificationRate: 0,
    totalClients: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [partners, setPartners] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"partners" | "clients" | "audit">("partners");

  useEffect(() => {
    // Fetch directory & metrics
    Promise.all([
      fetch("http://localhost:3000/api/admin/onboarded-directory").then((res) => res.json()),
      fetch("http://localhost:3000/api/admin/audit-logs").then((res) => res.json()),
    ])
      .then(([dirData, auditData]) => {
        if (dirData.success) {
          setPartners(dirData.partners || []);
          setClients(dirData.clients || []);
          
          // Calculate sum of completed bookings revenue for showcase
          const totalRev = (dirData.partners || []).reduce(
            (sum: number, p: any) => sum + (p.stats?.totalEarnings || 0),
            0
          );
          
          setMetrics({
            ...dirData.metrics,
            totalRevenue: totalRev,
          });
        }
        if (auditData.success) {
          setAuditLogs(auditData.logs || []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const toggleVerification = (partnerId: string, currentStatus: boolean) => {
    fetch("http://localhost:3000/api/admin/verify-partner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partnerId,
        isVerified: !currentStatus,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Update local state
          setPartners((prev) =>
            prev.map((p) =>
              p.id === partnerId ? { ...p, isVerified: !currentStatus } : p
            )
          );
          // Recalculate metrics
          setMetrics((prev: any) => {
            const nextVerified = currentStatus
              ? prev.verifiedPartners - 1
              : prev.verifiedPartners + 1;
            return {
              ...prev,
              verifiedPartners: nextVerified,
              verificationRate: prev.totalPartners > 0 ? (nextVerified / prev.totalPartners) * 100 : 0,
            };
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-6">
      {/* Header */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-10 pb-6 border-b border-orbit-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orbit-cyan to-orbit-purple flex items-center justify-center font-black text-black">
            O
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ORBIT COMPANY</h1>
            <p className="text-xs text-orbit-purple font-semibold uppercase tracking-wider">
              Control Panel & Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            System Live
          </span>
        </div>
      </nav>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <div className="w-10 h-10 border-4 border-orbit-purple border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-semibold">Aggregating platform audit metrics...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="orbit-card p-6 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                Total Marketplace Revenue
              </p>
              <h3 className="text-2xl font-black text-gradient-orbit">
                ₹{metrics.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-[10px] text-gray-500 mt-2 flex items-center space-x-1">
                <TrendingUp size={10} className="text-orbit-cyan" />
                <span>15% platform fee matching</span>
              </p>
            </div>

            <div className="orbit-card p-6 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                Onboarded Shooters
              </p>
              <h3 className="text-2xl font-black text-white">{metrics.totalPartners}</h3>
              <p className="text-[10px] text-gray-500 mt-2">
                {metrics.onlinePartners} partners currently online
              </p>
            </div>

            <div className="orbit-card p-6 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                KyC Verification Rate
              </p>
              <h3 className="text-2xl font-black text-white">
                {metrics.verificationRate.toFixed(1)}%
              </h3>
              <p className="text-[10px] text-gray-500 mt-2">
                {metrics.verifiedPartners} verified shooters
              </p>
            </div>

            <div className="orbit-card p-6 rounded-2xl">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                Marketplace Bookings
              </p>
              <h3 className="text-2xl font-black text-white">{metrics.totalBookings}</h3>
              <p className="text-[10px] text-gray-500 mt-2">
                Across client accounts: {metrics.totalClients}
              </p>
            </div>
          </div>

          {/* Directory Tabs Navigation */}
          <div className="orbit-card p-2 rounded-xl inline-flex space-x-1 bg-[#050505]">
            <button
              onClick={() => setActiveTab("partners")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "partners" ? "bg-orbit-cyan text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Partner Profiles ({partners.length})
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "clients" ? "bg-orbit-cyan text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Client Accounts ({clients.length})
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "audit" ? "bg-orbit-cyan text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              System Audit Logs ({auditLogs.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="orbit-card p-6 rounded-2xl min-h-[400px]">
            {activeTab === "partners" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-orbit-border text-gray-500 text-xs uppercase font-bold">
                      <th className="pb-3">Partner Info</th>
                      <th className="pb-3">Location & Device</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Earning stats</th>
                      <th className="pb-3 text-right">KYC Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((partner) => (
                      <tr key={partner.id} className="border-b border-orbit-border/30 hover:bg-[#050505] transition-colors">
                        <td className="py-4">
                          <div className="font-semibold text-white">{partner.name}</div>
                          <div className="text-xs text-gray-500">{partner.email}</div>
                        </td>
                        <td className="py-4">
                          <div className="text-white">{partner.location}</div>
                          <div className="text-xs text-gray-500">{partner.deviceInfo || "Unspecified"}</div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              partner.availability === "ONLINE"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-gray-800 text-gray-500"
                            }`}
                          >
                            {partner.availability}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="font-bold text-white">
                            ₹{(partner.stats?.totalEarnings || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {partner.stats?.completedBookings || 0} completed projects
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => toggleVerification(partner.id, partner.isVerified)}
                            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                              partner.isVerified
                                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                                : "border-orbit-purple/50 bg-orbit-purple/15 text-orbit-purple hover:bg-orbit-purple/25"
                            }`}
                          >
                            {partner.isVerified ? "Verified ✅" : "Verify KYC"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "clients" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-orbit-border text-gray-500 text-xs uppercase font-bold">
                      <th className="pb-3">Client Info</th>
                      <th className="pb-3">Registered At</th>
                      <th className="pb-3">Requirements Profile</th>
                      <th className="pb-3 text-right">Marketplace Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b border-orbit-border/30 hover:bg-[#050505] transition-colors">
                        <td className="py-4">
                          <div className="font-semibold text-white">{client.name}</div>
                          <div className="text-xs text-gray-500">{client.email}</div>
                        </td>
                        <td className="py-4 text-gray-400">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 max-w-xs truncate text-xs text-gray-400">
                          {client.editorRequirements || "Default guidelines"}
                        </td>
                        <td className="py-4 text-right">
                          <div className="font-bold text-white">
                            ₹{(client.stats?.totalSpent || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {client.stats?.completedBookings || 0} completed bookings
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "audit" && (
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-4 bg-[#050505] border border-orbit-border rounded-xl text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-orbit-cyan uppercase">
                          {log.action}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-white font-medium">
                          {log.user?.email || log.userEmail || "System"}
                        </span>
                      </div>
                      <p className="text-gray-400">
                        Entity: {log.entity} (#{log.entityId?.substring(0, 8)})
                      </p>
                      {log.details && (
                        <p className="text-[10px] text-gray-600 font-mono">
                          Details: {log.details}
                        </p>
                      )}
                    </div>

                    <div className="text-right text-gray-600">
                      <div>{new Date(log.createdAt || log.timestamp).toLocaleDateString()}</div>
                      <div>{new Date(log.createdAt || log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
