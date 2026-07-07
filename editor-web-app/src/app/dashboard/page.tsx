"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, CheckCircle, Clock, Layout, LogOut, Video } from "lucide-react";

export default function EditorDashboard() {
  const router = useRouter();
  const [editorName, setEditorName] = useState("");
  const [editorId, setEditorId] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem("orbit_editor_id");
    const savedName = localStorage.getItem("orbit_editor_name");
    
    if (!savedId) {
      router.push("/");
      return;
    }
    setEditorId(savedId);
    setEditorName(savedName || "Alex Mercer");

    // Fetch assigned bookings
    fetch(`http://localhost:5000/api/editor/bookings?editorId=${savedId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) {
          setBookings(data.bookings);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("orbit_editor_id");
    localStorage.removeItem("orbit_editor_name");
    router.push("/");
  };

  const activeAssignments = bookings.filter((b) => b.status === "EDITING" || b.status === "READY_TO_EDIT").length;
  const completedAssignments = bookings.filter((b) => b.status === "DELIVERED").length;

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-10 pb-6 border-b border-orbit-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orbit-cyan to-orbit-purple flex items-center justify-center font-black text-black">
            O
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ORBIT EDITOR</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Studio Workspace
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold">{editorName}</p>
            <p className="text-xs text-orbit-cyan font-bold uppercase">Active Editor</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-gray-900 border border-orbit-border hover:bg-gray-800 rounded-xl transition-colors text-red-400 flex items-center space-x-2"
          >
            <LogOut size={16} />
            <span className="hidden md:inline text-xs font-semibold">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Status Metrics Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="orbit-card p-6 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-orbit-cyan/10 rounded-xl text-orbit-cyan">
              <Play size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Assignments</p>
              <h3 className="text-2xl font-bold">{activeAssignments}</h3>
            </div>
          </div>

          <div className="orbit-card p-6 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Edits</p>
              <h3 className="text-2xl font-bold">{completedAssignments}</h3>
            </div>
          </div>

          <div className="orbit-card p-6 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-orbit-purple/10 rounded-xl text-orbit-purple">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Turnaround Time</p>
              <h3 className="text-2xl font-bold">42 mins</h3>
            </div>
          </div>
        </div>

        {/* Assigned bookings section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Video className="text-orbit-cyan" />
            <span>Assigned Projects</span>
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-orbit-cyan border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading workspace files...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="orbit-card p-12 text-center rounded-2xl border border-dashed border-orbit-border">
              <p className="text-muted-foreground text-lg mb-2">No active assignments</p>
              <p className="text-sm text-gray-500">
                You will be assigned projects automatically as partner footages sync.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  whileHover={{ y: -4 }}
                  className={`orbit-card p-6 rounded-2xl border ${
                    booking.status === "EDITING"
                      ? "border-orbit-cyan/30"
                      : "border-orbit-border"
                  } flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs px-2.5 py-1 bg-gray-900 border border-orbit-border text-gray-400 rounded-full font-medium">
                          ID: #{booking.id.substring(0, 8)}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                          booking.status === "READY_TO_EDIT"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : booking.status === "EDITING"
                            ? "bg-orbit-cyan/15 text-orbit-cyan"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {booking.status === "READY_TO_EDIT" ? "Ready to Edit" : booking.status === "EDITING" ? "Editing" : "Delivered"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {booking.packageName || "Professional UGC"}
                    </h3>

                    <p className="text-sm text-gray-400 mb-4">
                      Scheduled: {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                      {booking.timeSlot}
                    </p>

                    {booking.client?.editorRequirements && (
                      <div className="bg-[#0A0A0A] border border-orbit-border/50 p-3 rounded-xl mb-4">
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">
                          Briefing & Requirements:
                        </p>
                        <p className="text-xs text-gray-300 line-clamp-2">
                          {booking.client.editorRequirements}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-orbit-border/50">
                    <div className="text-xs text-gray-500">
                      Client: <span className="text-white font-medium">{booking.client?.name || "N/A"}</span>
                    </div>
                    <button
                      onClick={() => router.push(`/bookings/${booking.id}`)}
                      className="px-4 py-2 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-black font-semibold rounded-lg text-sm hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      {booking.status === "READY_TO_EDIT" ? "Accept & Edit" : booking.status === "EDITING" ? "Open Studio" : "View Delivery"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
