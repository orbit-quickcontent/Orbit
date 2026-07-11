const _jsxFileName = "src\\app\\admin\\page.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import {
  LayoutDashboard,
  Building2,
  Users,
  Film,
  CheckSquare,
  CreditCard,
  TrendingUp,
  FileText,
  Activity,
  Settings,

  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,

  HardDrive,

  RefreshCw,
  Plus
} from "lucide-react";

// Mock SaaS Analytics charts data
const revenueChartData = [0, 0, 0, 0, 0, 0, 0]; // In Lakhs or thousands
const userChartData = [0, 0, 0, 0, 0, 0, 0];

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("overview");
  const [darkMode, setDarkMode] = useState(true);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("Orbit India Corp");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [togglingVerify, setTogglingVerify] = useState(null);

  const [seeding, setSeeding] = useState(false);

  // States for database entities
  const [partners, setPartners] = useState([]);
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    totalPartners: 0,
    onlinePartners: 0,
    totalClients: 0,
    verifiedPartners: 0,
    verificationRate: 0.0
  });

  const fetchLogsAndData = async () => {
    setLoading(true);
    try {
      const dirRes = await fetch("/api/admin/onboarded-directory");
      if (dirRes.ok) {
        const data = await dirRes.json();
        setMetrics(data.metrics || metrics);
        setPartners(data.partners || []);
        setClients(data.clients || []);
        setBookings(data.bookings || []);
      }
      const logsRes = await fetch("/api/admin/audit-logs");
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
      }
    } catch (e2) {
      toast.error("Failed to load operations logs");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Firestore Database seeded successfully!");
        await fetchLogsAndData();
      } else {
        toast.error(data.error || "Failed to seed database. Verify Firestore write rules.");
      }
    } catch (e3) {
      toast.error("Failed to connect to seeder API endpoint");
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchLogsAndData();
  }, []);

  const handleToggleVerification = async (partnerId, currentStatus) => {
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
        setMetrics((prev) => ({
          ...prev,
          verifiedPartners: currentStatus ? prev.verifiedPartners - 1 : prev.verifiedPartners + 1,
        }));
      } else {
        toast.error("Failed to update status");
      }
    } catch (e4) {
      toast.error("An error occurred");
    } finally {
      setTogglingVerify(null);
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.packagePrice || 0), 0);
  const cloudStorageUsed = (bookings.length * 12.5).toFixed(1); // 12.5 GB per shoot
  const cloudStoragePercent = Math.min(100, Math.round((bookings.length * 12.5 / 5000) * 100)); // 5000 GB = 5 TB

  const getRevenueChartPoints = () => {
    if (bookings.length === 0) {
      return {
        points: "0,180 100,180 200,180 300,180 400,180 500,180 600,180",
        yCoords: [180, 180, 180, 180, 180, 180, 180]
      };
    }
    return {
      points: "0,180 100,170 200,150 300,110 400,80 500,50 600,20",
      yCoords: [180, 170, 150, 110, 80, 50, 20]
    };
  };

  const getUserChartPoints = () => {
    if (clients.length === 0) {
      return {
        points: "0,180 100,180 200,180 300,180 400,180 500,180 600,180",
        yCoords: [180, 180, 180, 180, 180, 180, 180]
      };
    }
    return {
      points: "0,180 100,165 200,140 300,120 400,90 500,60 600,30",
      yCoords: [180, 165, 140, 120, 90, 60, 30]
    };
  };

  const revChart = getRevenueChartPoints();
  const userChart = getUserChartPoints();

  return (
    React.createElement('div', { className: `min-h-screen flex ${darkMode ? "bg-[#0b0c10] text-gray-200" : "bg-gray-50 text-gray-800"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
      /* ─── SIDEBAR ──────────────────────────────────────────────────────── */
      , React.createElement('aside', { className: `w-64 border-r ${darkMode ? "bg-[#111217] border-gray-800" : "bg-white border-gray-200"} flex flex-col hidden md:flex shrink-0`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}
        /* Sidebar Header */
        , React.createElement('div', { className: "h-16 flex items-center gap-3 px-6 border-b border-inherit"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
          , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-orbit-cyan to-orbit-purple flex items-center justify-center text-white font-black text-sm"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, "O"

          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
            , React.createElement('span', { className: "font-extrabold text-sm uppercase tracking-wider text-white"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}, "Orbit Admin" )
            , React.createElement('p', { className: "text-[9px] text-muted-foreground/60 leading-none"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}, "v1.0.4 - Premium"  )
          )
        )

        /* Sidebar Navigation */
        , React.createElement('nav', { className: "flex-1 px-4 py-6 space-y-1 overflow-y-auto"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}
          , [
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "organizations", label: "Organizations", icon: Building2 },
            { id: "users", label: "Users & Roles", icon: Users },
            { id: "projects", label: "Projects", icon: Film },
            { id: "tasks", label: "Tasks", icon: CheckSquare },
            { id: "payments", label: "Payments", icon: CreditCard },
            { id: "analytics", label: "Live Analytics", icon: TrendingUp },
            { id: "settings", label: "Settings", icon: Settings },
            { id: "logs", label: "Audit Logs", icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              React.createElement('button', {
                key: item.id,
                onClick: () => setActiveModule(item.id),
                className: `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-orbit-cyan/15 to-orbit-purple/10 text-orbit-cyan border-l-4 border-orbit-cyan"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}

                , React.createElement(Icon, { className: `w-4 h-4 ${isActive ? "text-orbit-cyan" : "text-gray-400"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}} )
                , item.label
              )
            );
          })
        )

        /* Sidebar Footer */
        , React.createElement('div', { className: "p-4 border-t border-inherit"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}
          , React.createElement('button', { className: "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/5 transition-colors"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
            , React.createElement(LogOut, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}} ), "Sign Out"

          )
        )
      )

      /* ─── MAIN CONTENT AREA ────────────────────────────────────────────── */
      , React.createElement('div', { className: "flex-1 flex flex-col min-w-0 overflow-x-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}
        /* TOPBAR */
        , React.createElement('header', { className: `h-16 border-b ${darkMode ? "bg-[#111217] border-gray-800" : "bg-white border-gray-200"} flex items-center justify-between px-6 z-20`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
          /* Left: Organization Switcher */
          , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}
            , React.createElement('button', {
              onClick: () => setOrgDropdownOpen(!orgDropdownOpen),
              className: "flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm font-bold text-white transition-colors"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}

              , React.createElement(Building2, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}} )
              , selectedOrg
              , React.createElement(ChevronDown, { className: "w-3.5 h-3.5 opacity-50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}} )
            )

            , orgDropdownOpen && (
              React.createElement(React.Fragment, null
                , React.createElement('div', { className: "fixed inset-0 z-30"  , onClick: () => setOrgDropdownOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}} )
                , React.createElement('div', { className: `absolute left-0 mt-2 w-56 rounded-xl border p-2 shadow-2xl z-40 ${
                  darkMode ? "bg-[#16171d] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-800"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}
                  , ["Orbit India Corp", "Orbit Global Inc", "Acme Production LLC"].map((org) => (
                    React.createElement('button', {
                      key: org,
                      onClick: () => {
                        setSelectedOrg(org);
                        setOrgDropdownOpen(false);
                      },
                      className: "w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}

                      , org
                    )
                  ))
                )
              )
            )
          )

          /* Right: Quick actions, Search, Bell, Dark mode, Profile */
          , React.createElement('div', { className: "flex items-center gap-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}
            /* Search bar */
            , React.createElement('div', { className: "relative hidden sm:block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
              , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}} )
              , React.createElement('input', {
                placeholder: "Global search..." ,
                className: `pl-9 pr-4 py-1.5 w-60 rounded-full text-xs font-semibold border focus:outline-none ${
                  darkMode ? "bg-[#16171d] border-gray-800 text-white placeholder:text-gray-600 focus:border-orbit-cyan" : "bg-gray-100 border-gray-200 placeholder:text-gray-400"
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
              )
            )

            /* Dark Mode toggle */
            , React.createElement('button', {
              onClick: () => setDarkMode(!darkMode),
              className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}

              , darkMode ? React.createElement(Sun, { className: "w-4 h-4 text-amber-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}} ) : React.createElement(Moon, { className: "w-4 h-4 text-indigo-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}} )
            )

            /* Bell notification */
            , React.createElement('button', { className: "w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 relative"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}
              , React.createElement(Bell, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}} )
              , React.createElement('div', { className: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orbit-cyan"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}} )
            )

            /* Profile Dropdown */
            , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
              , React.createElement('button', {
                onClick: () => setProfileDropdownOpen(!profileDropdownOpen),
                className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}

                , React.createElement('div', { className: "w-8 h-8 rounded-full bg-gradient-to-r from-orbit-cyan to-orbit-purple flex items-center justify-center text-white font-extrabold text-xs shadow-lg"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}}, "AD"

                )
              )

              , profileDropdownOpen && (
                React.createElement(React.Fragment, null
                  , React.createElement('div', { className: "fixed inset-0 z-30"  , onClick: () => setProfileDropdownOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}} )
                  , React.createElement('div', { className: `absolute right-0 mt-2 w-48 rounded-xl border p-2 shadow-2xl z-40 ${
                    darkMode ? "bg-[#16171d] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-800"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}
                    , React.createElement('div', { className: "px-3 py-2 border-b border-gray-800/50 mb-1.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
                      , React.createElement('p', { className: "text-xs font-bold text-white leading-none"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}, "Admin User" )
                      , React.createElement('p', { className: "text-[10px] text-muted-foreground/60 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}, "admin@orbitlogic.io")
                    )
                    , React.createElement('button', { className: "w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/5 flex items-center gap-2"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}
                      , React.createElement(Settings, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}} ), " Settings"
                    )
                    , React.createElement('button', { className: "w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/5 flex items-center gap-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}
                      , React.createElement(LogOut, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}} ), " Sign Out"
                    )
                  )
                )
              )
            )
          )
        )

        /* CONTAINER */
        , React.createElement('main', { className: "flex-1 p-6 sm:p-8 overflow-y-auto"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
          , React.createElement(AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}
            , React.createElement(motion.div, {
              key: activeModule,
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -12 },
              transition: { duration: 0.25 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 330}}

              /* 🟢 OVERVIEW MODULE ────────────────────────────── */
              , activeModule === "overview" && (
                React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
                  /* Top Stats Banner */
                  , React.createElement('div', { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}
                      , React.createElement('h2', { className: "text-2xl sm:text-3xl font-black text-white font-space"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}, "Operations Command Center"

                      )
                      , React.createElement('p', { className: "text-xs text-muted-foreground mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}, "Monitoring multi-tenant SaaS activity metrics, revenue, and resources allocation"

                      )
                    )
                    , React.createElement(Button, { onClick: fetchLogsAndData, disabled: loading, variant: "outline", className: "border-gray-800 text-gray-300 hover:bg-gray-900"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}
                      , React.createElement(RefreshCw, { className: `w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}} ), "Sync"

                    )
                  )

                  /* Summary Metric Cards */
                  , React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
                    , [
                      { title: "Monthly Recurring Revenue", val: `₹${totalRevenue.toLocaleString()}`, desc: bookings.length > 0 ? "+12.4% vs last month" : "0% vs last month", icon: CreditCard, color: "text-orbit-cyan", trend: bookings.length > 0 ? [45, 60, 55, 75, 95, 110, 142] : Array(10).fill(0) },
                      { title: "Active Creators / Clients", val: metrics.totalClients, desc: "SaaS accounts active", icon: Users, color: "text-orbit-purple", trend: clients.length > 0 ? [120, 150, 180, 240, 310, 390, 480] : Array(10).fill(0) },
                      { title: "Active Production Shoots", val: metrics.totalBookings, desc: "Shoots currently dispatching", icon: Film, color: "text-green-400" },
                      { title: "Cloud Storage Allocation", val: `${(bookings.length * 12.5 / 1000).toFixed(2)} TB / 5 TB`, desc: `${cloudStoragePercent}% system capacity`, icon: HardDrive, color: "text-yellow-400" },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        React.createElement(Card, { key: i, className: "bg-[#111217] border-gray-800/80 text-white relative overflow-hidden glassmorphism shadow-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}
                          , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 367}}
                            , React.createElement(CardDescription, { className: "text-gray-400 text-xs uppercase tracking-wider font-bold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}, stat.title)
                            , React.createElement(CardTitle, { className: "text-2xl sm:text-3xl font-black font-space"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}, stat.val)
                          )
                          , React.createElement(CardContent, { className: "pb-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 371}}
                            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}
                              , React.createElement('span', { className: `text-xs ${stat.color} flex items-center font-bold`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}
                                , React.createElement(Icon, { className: "w-3.5 h-3.5 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}} )
                                , stat.desc
                              )
                              , stat.trend && (
                                React.createElement('svg', { className: "w-16 h-8 text-orbit-cyan opacity-50"   , viewBox: "0 0 100 50"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}
                                  , React.createElement('polyline', {
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "3",
                                    points: stat.trend.map((val, idx) => `${idx * 16},${50 - (val / 150) * 50}`).join(" "), __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}
                                  )
                                )
                              )
                            )
                          )
                        )
                      );
                    })
                  )

                  /* Main Directories & Analytics grid */
                  , React.createElement('div', { className: "grid lg:grid-cols-3 gap-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
                    , React.createElement(Card, { className: "lg:col-span-2 bg-[#111217] border-gray-800 text-white shadow-xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}
                      , React.createElement(CardHeader, { className: "border-b border-gray-800 flex flex-row items-center justify-between"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}
                          , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}, "Active Videographers (Partners)"  )
                          , React.createElement(CardDescription, { className: "text-gray-400 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}, "Verify credentials and review ratings"    )
                        )
                        , React.createElement('div', { className: "relative w-48" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}
                          , React.createElement(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}} )
                          , React.createElement(Input, {
                            placeholder: "Filter list..." ,
                            value: searchQuery,
                            onChange: (e) => setSearchQuery(e.target.value),
                            className: "pl-8 h-8 text-xs bg-[#16171d] border-gray-800 text-white focus-visible:ring-orbit-cyan"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}
                          )
                        )
                      )
                      , React.createElement(CardContent, { className: "p-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}
                        , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
                          , React.createElement('table', { className: "w-full text-left text-xs text-gray-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}
                            , React.createElement('thead', { className: "bg-[#16171d] uppercase text-gray-400 border-b border-gray-800 font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}
                              , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}
                                , React.createElement('th', { className: "px-6 py-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 417}}, "Partner / Contact"  )
                                , React.createElement('th', { className: "px-6 py-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, "Device Info" )
                                , React.createElement('th', { className: "px-6 py-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}, "Verification")
                                , React.createElement('th', { className: "px-6 py-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}, "Completed Jobs" )
                                , React.createElement('th', { className: "px-6 py-3.5 text-right"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}, "Moderation")
                              )
                            )
                            , React.createElement('tbody', { className: "divide-y divide-gray-800/40" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                              , partners.filter(p => _optionalChain([p, 'access', _2 => _2.name, 'optionalAccess', _3 => _3.toLowerCase, 'call', _4 => _4(), 'access', _5 => _5.includes, 'call', _6 => _6(searchQuery.toLowerCase())]) || _optionalChain([p, 'access', _7 => _7.email, 'optionalAccess', _8 => _8.toLowerCase, 'call', _9 => _9(), 'access', _10 => _10.includes, 'call', _11 => _11(searchQuery.toLowerCase())])).slice(0, 5).map((partner) => (
                                React.createElement('tr', { key: partner.id, className: "hover:bg-white/5 transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 426}}
                                  , React.createElement('td', { className: "px-6 py-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}
                                    , React.createElement('div', { className: "font-bold text-white text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}}, partner.name)
                                    , React.createElement('div', { className: "text-gray-500", __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}, partner.email)
                                  )
                                  , React.createElement('td', { className: "px-6 py-3.5 text-gray-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 431}}, partner.deviceInfo || "N/A")
                                  , React.createElement('td', { className: "px-6 py-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}
                                    , partner.isVerified ? (
                                      React.createElement(Badge, { className: "bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] px-1.5 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}, "Verified")
                                    ) : (
                                      React.createElement(Badge, { className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[9px] px-1.5 py-0.5 rounded"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}, "Pending")
                                    )
                                  )
                                  , React.createElement('td', { className: "px-6 py-3.5 text-orbit-cyan font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}, partner.completedProjects, " Jobs" )
                                  , React.createElement('td', { className: "px-6 py-3.5 text-right"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}
                                    , React.createElement(Button, {
                                      onClick: () => handleToggleVerification(partner.id, partner.isVerified),
                                      disabled: togglingVerify === partner.id,
                                      size: "sm",
                                      variant: partner.isVerified ? "destructive" : "default",
                                      className: `h-7 text-[10px] ${partner.isVerified ? "bg-red-950 text-red-400 hover:bg-red-900" : "bg-orbit-cyan text-black hover:bg-orbit-cyan/95"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 441}}

                                      , partner.isVerified ? "Revoke" : "Approve"
                                    )
                                  )
                                )
                              ))
                            )
                          )
                        )
                      )
                    )

                    /* Right side activity feed */
                    , React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl flex flex-col"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 460}}
                      , React.createElement(CardHeader, { className: "border-b border-gray-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 461}}
                        , React.createElement(CardTitle, { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 462}}
                          , React.createElement(Activity, { className: "w-4.5 h-4.5 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 463}} ), "Audit Activity Log"

                        )
                        , React.createElement(CardDescription, { className: "text-gray-400 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}, "Realtime SaaS transactions audit trail"    )
                      )
                      , React.createElement(CardContent, { className: "flex-1 p-4 space-y-4 overflow-y-auto max-h-[320px]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 468}}
                        , logs.slice(0, 5).map((log) => (
                          React.createElement('div', { key: log.id, className: "flex gap-3 border-b border-gray-900 pb-3 last:border-0 last:pb-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 470}}
                            , React.createElement('div', { className: "w-2 h-2 rounded-full bg-orbit-cyan mt-1.5 shrink-0"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}} )
                            , React.createElement('div', { className: "min-w-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}
                              , React.createElement('p', { className: "text-xs text-white font-semibold truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}}, log.action)
                              , React.createElement('p', { className: "text-[10px] text-gray-500 truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}, _optionalChain([log, 'access', _12 => _12.user, 'optionalAccess', _13 => _13.email]) || "anonymous", " · "  , log.entity)
                              , React.createElement('span', { className: "text-[9px] text-gray-600 font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}, new Date(log.createdAt).toLocaleTimeString())
                            )
                          )
                        ))
                      )
                    )
                  )
                )
              )

              /* 🟢 ORGANIZATIONS MODULE ───────────────────────── */
              , activeModule === "organizations" && (
                React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}
                  , React.createElement(CardHeader, { className: "border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 488}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}
                      , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}, "SaaS Tenants & Organizations"   )
                      , React.createElement(CardDescription, { className: "text-gray-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 491}}, "Review registered company workspaces and active settings"      )
                    )
                    , React.createElement(Button, { className: "bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white font-bold text-xs h-9"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 493}}
                      , React.createElement(Plus, { className: "w-4 h-4 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 494}} ), " New Organization"
                    )
                  )
                  , React.createElement(CardContent, { className: "pt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 497}}
                    , React.createElement('div', { className: "overflow-x-auto rounded-lg border border-gray-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}
                      , React.createElement('table', { className: "w-full text-left text-sm text-gray-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 499}}
                        , React.createElement('thead', { className: "bg-[#16171d] text-xs uppercase text-gray-400 border-b border-gray-800"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}
                          , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 501}}
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 502}}, "Workspace / Slug"  )
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 503}}, "Status")
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 504}}, "Created Date" )
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}}, "Owner ID" )
                          )
                        )
                        , React.createElement('tbody', { className: "divide-y divide-gray-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 508}}
                          , React.createElement('tr', { className: "hover:bg-[#151515] transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 509}}
                            , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}}
                              , React.createElement('div', { className: "font-bold text-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}, "Orbit India Corp"  )
                              , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 512}}, "slug: orbit-india" )
                            )
                            , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}, React.createElement(Badge, { className: "bg-green-500/10 text-green-400 border border-green-500/20"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}, "Active"))
                            , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 515}}, "04-Jul-2026")
                            , React.createElement('td', { className: "px-6 py-4 text-xs font-mono text-gray-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 516}}, "usr-demo")
                          )
                          , React.createElement('tr', { className: "hover:bg-[#151515] transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 518}}
                            , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 519}}
                              , React.createElement('div', { className: "font-bold text-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 520}}, "Acme Production LLC"  )
                              , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 521}}, "slug: acme-prod" )
                            )
                            , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}, React.createElement(Badge, { className: "bg-green-500/10 text-green-400 border border-green-500/20"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}, "Active"))
                            , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 524}}, "02-Jul-2026")
                            , React.createElement('td', { className: "px-6 py-4 text-xs font-mono text-gray-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 525}}, "usr-acme")
                          )
                        )
                      )
                    )
                  )
                )
              )

              /* 🟢 USERS MODULE ───────────────────────────────── */
              , activeModule === "users" && (
                React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 536}}
                  , React.createElement(CardHeader, { className: "border-b border-gray-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}
                    , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}, "SaaS Users Directory"  )
                    , React.createElement(CardDescription, { className: "text-gray-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 539}}, "Manage client accounts, employees, and custom roles"      )
                  )
                  , React.createElement(CardContent, { className: "pt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 541}}
                    , React.createElement('div', { className: "overflow-x-auto rounded-lg border border-gray-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 542}}
                      , React.createElement('table', { className: "w-full text-left text-sm text-gray-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 543}}
                        , React.createElement('thead', { className: "bg-[#16171d] text-xs uppercase text-gray-400 border-b border-gray-800"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 544}}
                          , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 545}}
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 546}}, "User")
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 547}}, "Registration")
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 548}}, "Audit Status" )
                          )
                        )
                        , React.createElement('tbody', { className: "divide-y divide-gray-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 551}}
                          , clients.map(c => (
                            React.createElement('tr', { key: c.id, className: "hover:bg-[#151515] transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 553}}
                              , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 554}}
                                , React.createElement('div', { className: "font-semibold text-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 555}}, c.name)
                                , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 556}}, c.email)
                              )
                              , React.createElement('td', { className: "px-6 py-4 text-xs text-gray-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 558}}, new Date(c.createdAt).toLocaleDateString())
                              , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 559}}, React.createElement(Badge, { className: "bg-orbit-cyan/15 text-orbit-cyan border-none"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 559}}, "Active Client" ))
                            )
                          ))
                        )
                      )
                    )
                  )
                )
              )

              /* 🟢 PROJECTS MODULE ────────────────────────────── */
              , activeModule === "projects" && (
                React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 571}}
                  , React.createElement(CardHeader, { className: "border-b border-gray-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 572}}
                    , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 573}}, "Active Client Projects"  )
                    , React.createElement(CardDescription, { className: "text-gray-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}, "Review status, owners, and deliverables"    )
                  )
                  , React.createElement(CardContent, { className: "pt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 576}}
                    , React.createElement('div', { className: "overflow-x-auto rounded-lg border border-gray-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 577}}
                      , React.createElement('table', { className: "w-full text-left text-sm text-gray-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 578}}
                        , React.createElement('thead', { className: "bg-[#16171d] text-xs uppercase text-gray-400 border-b border-gray-800"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 579}}
                          , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 580}}
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 581}}, "Project Name" )
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 582}}, "Tenant Org ID"  )
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}, "Status")
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 584}}, "Active Plan" )
                          )
                        )
                        , React.createElement('tbody', { className: "divide-y divide-gray-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 587}}
                          , bookings.length === 0 ? (
                            React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 589}}
                              , React.createElement('td', { colSpan: 4, className: "px-6 py-8 text-center text-gray-500 font-semibold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 590}}, "No active client projects found. Database is empty."

                              )
                            )
                          ) : (
                            bookings.map((b) => (
                              React.createElement('tr', { key: b.id, className: "hover:bg-[#151515] transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 596}}
                                , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 597}}
                                  , React.createElement('div', { className: "font-bold text-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 598}}, b.packageName, " Cinematic Reel"  )
                                  , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 599}}, "ID: " , b.id)
                                )
                                , React.createElement('td', { className: "px-6 py-4 text-xs font-mono text-gray-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 601}}, b.clientName)
                                , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 602}}
                                  , React.createElement(Badge, { className: 
                                    b.status === "DELIVERED"
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                      : b.status === "CANCELLED"
                                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                      : "bg-orbit-cyan/15 text-orbit-cyan border-none animate-pulse"
                                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 603}}
                                    , b.status.replace(/_/g, " ")
                                  )
                                )
                                , React.createElement('td', { className: "px-6 py-4 text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 613}}, b.packageName)
                              )
                            ))
                          )
                        )
                      )
                    )
                  )
                )
              )

              /* 🟢 PAYMENTS MODULE ────────────────────────────── */
              , activeModule === "payments" && (
                React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 626}}
                  , React.createElement(CardHeader, { className: "border-b border-gray-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 627}}
                    , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 628}}, "SaaS Billing & Invoices"   )
                    , React.createElement(CardDescription, { className: "text-gray-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}, "Track client subscription payments and payouts"     )
                  )
                  , React.createElement(CardContent, { className: "pt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 631}}
                    , React.createElement('div', { className: "overflow-x-auto rounded-lg border border-gray-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 632}}
                      , React.createElement('table', { className: "w-full text-left text-sm text-gray-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 633}}
                        , React.createElement('thead', { className: "bg-[#16171d] text-xs uppercase text-gray-400 border-b border-gray-800"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 634}}
                          , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 635}}
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}, "Transaction ID" )
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 637}}, "Amount")
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 638}}, "Payment Method" )
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 639}}, "Status")
                          )
                        )
                        , React.createElement('tbody', { className: "divide-y divide-gray-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 642}}
                          , bookings.length === 0 ? (
                            React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 644}}
                              , React.createElement('td', { colSpan: 4, className: "px-6 py-8 text-center text-gray-500 font-semibold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 645}}, "No billing transactions found. Database is empty."

                              )
                            )
                          ) : (
                            bookings.map((b) => (
                              React.createElement('tr', { key: b.id, className: "hover:bg-[#151515] transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}
                                , React.createElement('td', { className: "px-6 py-4 text-xs font-mono text-gray-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 652}}, "TXN-", b.id)
                                , React.createElement('td', { className: "px-6 py-4 text-green-400 font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}, "₹", b.packagePrice.toLocaleString())
                                , React.createElement('td', { className: "px-6 py-4 text-xs"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 654}}, "Stripe Gateway (UPI)"  )
                                , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 655}}
                                  , React.createElement(Badge, { className: "bg-green-500/10 text-green-400 border border-green-500/20"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 656}}
                                    , b.paymentStatus || "SUCCESS"
                                  )
                                )
                              )
                            ))
                          )
                        )
                      )
                    )
                  )
                )
              )

              /* 🟢 ANALYTICS MODULE ───────────────────────────── */
              , activeModule === "analytics" && (
                React.createElement('div', { className: "grid lg:grid-cols-2 gap-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 672}}
                  , React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 673}}
                    , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 674}}
                      , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 675}}, "Live Revenue Stream Graph"   )
                      , React.createElement(CardDescription, { className: "text-xs text-gray-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 676}}, "Total monthly revenue trend analytics"    )
                    )
                    , React.createElement(CardContent, { className: "flex items-center justify-center p-6 h-64"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}
                      , React.createElement('div', { className: "w-full h-full relative"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 679}}
                        /* Grid background */
                        , React.createElement('div', { className: "absolute inset-0 grid grid-rows-4 grid-cols-6 border-b border-l border-gray-800/60"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 681}}
                          , Array.from({ length: 24 }).map((_, i) => (
                            React.createElement('div', { key: i, className: "border-t border-r border-gray-900/40"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 683}} )
                          ))
                        )
                        /* SVG Polyline Chart */
                        , React.createElement('svg', { className: "w-full h-full text-orbit-cyan z-10 relative"    , viewBox: "0 0 600 200"   , preserveAspectRatio: "none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 687}}
                          , React.createElement('polyline', {
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "3.5",
                            points: revChart.points, __self: this, __source: {fileName: _jsxFileName, lineNumber: 688}}
                          )
                          /* Data point markers */
                          , revChart.yCoords.map((y, idx) => (
                            React.createElement('circle', { key: idx, cx: idx * 100, cy: y, r: "5", className: "fill-white stroke-orbit-cyan stroke-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 696}} )
                          ))
                        )
                      )
                    )
                  )

                  , React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 703}}
                    , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 704}}
                      , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 705}}, "Active User Growth Trends"   )
                      , React.createElement(CardDescription, { className: "text-xs text-gray-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 706}}, "Total active creator profiles over time"     )
                    )
                    , React.createElement(CardContent, { className: "flex items-center justify-center p-6 h-64"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 708}}
                      , React.createElement('div', { className: "w-full h-full relative"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 709}}
                        /* Grid background */
                        , React.createElement('div', { className: "absolute inset-0 grid grid-rows-4 grid-cols-6 border-b border-l border-gray-800/60"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 711}}
                          , Array.from({ length: 24 }).map((_, i) => (
                            React.createElement('div', { key: i, className: "border-t border-r border-gray-900/40"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 713}} )
                          ))
                        )
                        /* SVG Polyline Chart */
                        , React.createElement('svg', { className: "w-full h-full text-orbit-purple z-10 relative"    , viewBox: "0 0 600 200"   , preserveAspectRatio: "none", __self: this, __source: {fileName: _jsxFileName, lineNumber: 717}}
                          , React.createElement('polyline', {
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "3.5",
                            points: userChart.points, __self: this, __source: {fileName: _jsxFileName, lineNumber: 718}}
                          )
                          /* Data point markers */
                          , userChart.yCoords.map((y, idx) => (
                            React.createElement('circle', { key: idx, cx: idx * 100, cy: y, r: "5", className: "fill-white stroke-orbit-purple stroke-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 726}} )
                          ))
                        )
                      )
                    )
                  )
                )
              )

              /* 🟢 SETTINGS MODULE ────────────────────────────── */
              , activeModule === "settings" && (
                React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 737}}
                  , React.createElement(CardHeader, { className: "border-b border-gray-800" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 738}}
                    , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 739}}, "SaaS System Configurations"  )
                    , React.createElement(CardDescription, { className: "text-gray-400 font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 740}}, "Configure security overrides, pricing, and system variables"      )
                  )
                  , React.createElement(CardContent, { className: "pt-6 space-y-4 max-w-xl"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 742}}
                    , React.createElement('div', { className: "flex items-center justify-between border-b border-gray-900 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 743}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 744}}
                        , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 745}}, "Maintenance Mode Override"  )
                        , React.createElement('p', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 746}}, "Temporarily redirect non-admins to main lobby page"      )
                      )
                      , React.createElement(Badge, { className: "bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px]"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 748}}, "Disabled")
                    )
                    , React.createElement('div', { className: "flex items-center justify-between border-b border-gray-900 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 750}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 751}}
                        , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 752}}, "Enable Global Stripe Billing"   )
                        , React.createElement('p', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 753}}, "Activate credit card recurring billing gateway features"      )
                      )
                      , React.createElement(Badge, { className: "bg-green-500/10 text-green-400 border border-green-500/20 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[9px]"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 755}}, "Active")
                    )
                    , React.createElement('div', { className: "flex items-center justify-between border-b border-gray-900 pb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 757}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 758}}
                        , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 759}}, "Cloud Database Seeding"  )
                        , React.createElement('p', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 760}}, "Seed packages, clients, and partners into Firestore"      )
                      )
                      , React.createElement(Button, {
                        onClick: handleSeedDatabase,
                        disabled: seeding,
                        className: "bg-orbit-cyan text-black hover:bg-orbit-cyan/90 h-8 font-bold text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 762}}

                        , seeding ? "Seeding..." : "Seed Database"
                      )
                    )
                  )
                )
              )

              /* 🟢 AUDIT LOGS MODULE ──────────────────────────── */
              , activeModule === "logs" && (
                React.createElement(Card, { className: "bg-[#111217] border-gray-800 text-white shadow-xl"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 776}}
                  , React.createElement(CardHeader, { className: "border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 777}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 778}}
                      , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 779}}, "Operation Audit Logs"  )
                      , React.createElement(CardDescription, { className: "text-gray-400", __self: this, __source: {fileName: _jsxFileName, lineNumber: 780}}, "Complete historical operations logs of all data write events"        )
                    )
                    , React.createElement('div', { className: "relative w-72" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 782}}
                      , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 783}} )
                      , React.createElement(Input, {
                        placeholder: "Search logs action..."  ,
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value),
                        className: "pl-9 bg-[#16171d] border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-orbit-cyan"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 784}}
                      )
                    )
                  )
                  , React.createElement(CardContent, { className: "pt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 792}}
                    , React.createElement('div', { className: "overflow-x-auto rounded-lg border border-gray-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 793}}
                      , React.createElement('table', { className: "w-full text-left text-sm text-gray-300"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 794}}
                        , React.createElement('thead', { className: "bg-[#16171d] text-xs uppercase text-gray-400 border-b border-gray-800"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 795}}
                          , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 796}}
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 797}}, "Timestamp")
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 798}}, "User")
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 799}}, "Action")
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 800}}, "Target Entity" )
                            , React.createElement('th', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 801}}, "Details")
                          )
                        )
                        , React.createElement('tbody', { className: "divide-y divide-gray-900" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 804}}
                          , logs.filter(l => _optionalChain([l, 'access', _14 => _14.action, 'optionalAccess', _15 => _15.toLowerCase, 'call', _16 => _16(), 'access', _17 => _17.includes, 'call', _18 => _18(searchQuery.toLowerCase())])).map((log) => (
                            React.createElement('tr', { key: log.id, className: "hover:bg-[#151515] transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 806}}
                              , React.createElement('td', { className: "px-6 py-4 text-gray-500 font-mono text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 807}}
                                , new Date(log.createdAt).toLocaleString()
                              )
                              , React.createElement('td', { className: "px-6 py-4 font-semibold text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 810}}
                                , _optionalChain([log, 'access', _19 => _19.user, 'optionalAccess', _20 => _20.email]) || "anonymous"
                              )
                              , React.createElement('td', { className: "px-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 813}}
                                , React.createElement(Badge, { className: "bg-[#242424] text-gray-300 border border-gray-800"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 814}}, log.action)
                              )
                              , React.createElement('td', { className: "px-6 py-4 text-xs font-mono text-gray-400"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 816}}
                                , log.entity, " (" , log.entityId || "N/A", ")"
                              )
                              , React.createElement('td', { className: "px-6 py-4 text-xs text-gray-500 max-w-xs truncate"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 819}}
                                , log.details || "None"
                              )
                            )
                          ))
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}