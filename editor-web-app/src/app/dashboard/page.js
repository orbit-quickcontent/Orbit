const _jsxFileName = "src\\app\\dashboard\\page.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, CheckCircle, Clock, LogOut, Video, Plus, Sparkles, } from "lucide-react";

export default function EditorDashboard() {
  const router = useRouter();
  const [editorName, setEditorName] = useState("");
  const [editorId, setEditorId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [available, setAvailable] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(null);

  const fetchBookings = (eid) => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/editor/bookings?editorId=${eid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) {
          // Sort: active assignments first, then newest bookingDate at top
          const statusOrder = {
            READY_TO_EDIT: 0,
            EDITING: 1,
            DELIVERED: 2,
          };
          const sorted = [...data.bookings].sort((a, b) => {
            const sDiff =
              (_nullishCoalesce(statusOrder[a.status], () => ( 99))) - (_nullishCoalesce(statusOrder[b.status], () => ( 99)));
            if (sDiff !== 0) return sDiff;
            // Within same status group — newest booking date first
            return (
              new Date(b.bookingDate).getTime() -
              new Date(a.bookingDate).getTime()
            );
          });
          setBookings(sorted);
        }
        if (data.available) {
          setAvailable(data.available);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const savedId = localStorage.getItem("orbit_editor_id");
    const savedName = localStorage.getItem("orbit_editor_name");
    
    if (!savedId) {
      router.push("/");
      return;
    }
    setEditorId(savedId);
    setEditorName(savedName || "Alex Mercer");

    fetchBookings(savedId);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("orbit_editor_id");
    localStorage.removeItem("orbit_editor_name");
    router.push("/");
  };

  const handleAcceptProject = async (bookingId) => {
    if (!editorId) return;
    setIsAccepting(bookingId);
    try {
      const res = await fetch(`http://localhost:5000/api/editor/bookings/${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editorId }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBookings(editorId);
      } else {
        alert("Failed to accept project: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error accepting project.");
    } finally {
      setIsAccepting(null);
    }
  };

  const activeAssignments = bookings.filter((b) => b.status === "EDITING" || b.status === "READY_TO_EDIT").length;
  const completedAssignments = bookings.filter((b) => b.status === "DELIVERED").length;

  return (
    React.createElement('div', { className: "min-h-screen bg-black text-white px-4 md:px-8 py-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
      /* Navbar */
      , React.createElement('nav', { className: "flex justify-between items-center max-w-7xl mx-auto mb-10 pb-6 border-b border-orbit-border"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
        , React.createElement('div', { className: "flex items-center space-x-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
          , React.createElement('div', { className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-orbit-cyan to-orbit-purple flex items-center justify-center font-black text-black"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "O"

          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
            , React.createElement('h1', { className: "text-xl font-bold tracking-tight"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, "ORBIT EDITOR" )
            , React.createElement('p', { className: "text-xs text-muted-foreground uppercase tracking-wider font-semibold"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}, "Studio Workspace"

            )
          )
        )

        , React.createElement('div', { className: "flex items-center space-x-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
          , React.createElement('div', { className: "hidden md:block text-right"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
            , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, editorName)
            , React.createElement('p', { className: "text-xs text-orbit-cyan font-bold uppercase"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}, "Active Editor" )
          )
          , React.createElement('button', {
            onClick: handleLogout,
            className: "p-2 bg-gray-900 border border-orbit-border hover:bg-gray-800 rounded-xl transition-colors text-red-400 flex items-center space-x-2"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}

            , React.createElement(LogOut, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}} )
            , React.createElement('span', { className: "hidden md:inline text-xs font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}, "Logout")
          )
        )
      )

      /* Main Grid */
      , React.createElement('div', { className: "max-w-7xl mx-auto space-y-12"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
        /* Status Metrics Banner */
        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
          , React.createElement('div', { className: "orbit-card p-6 rounded-2xl flex items-center space-x-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}
            , React.createElement('div', { className: "p-3 bg-orbit-cyan/10 rounded-xl text-orbit-cyan"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
              , React.createElement(Play, { size: 24, __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}} )
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
              , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, "Active Assignments" )
              , React.createElement('h3', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, activeAssignments)
            )
          )

          , React.createElement('div', { className: "orbit-card p-6 rounded-2xl flex items-center space-x-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
            , React.createElement('div', { className: "p-3 bg-emerald-500/10 rounded-xl text-emerald-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
              , React.createElement(CheckCircle, { size: 24, __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}} )
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
              , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}, "Completed Edits" )
              , React.createElement('h3', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}, completedAssignments)
            )
          )

          , React.createElement('div', { className: "orbit-card p-6 rounded-2xl flex items-center space-x-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
            , React.createElement('div', { className: "p-3 bg-orbit-purple/10 rounded-xl text-orbit-purple"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
              , React.createElement(Clock, { size: 24, __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}} )
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
              , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}, "Available Pool" )
              , React.createElement('h3', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}, available.length, " projects" )
            )
          )
        )

        /* Available Pool section */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}
          , React.createElement('h2', { className: "text-2xl font-bold mb-6 flex items-center space-x-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}
            , React.createElement(Sparkles, { className: "text-orbit-purple animate-pulse" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}} )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}, "Available Projects (Pool)"  )
          )

          , available.length === 0 ? (
            React.createElement('div', { className: "orbit-card p-8 text-center rounded-2xl border border-dashed border-orbit-border/60"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
              , React.createElement('p', { className: "text-muted-foreground text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}, "No new projects in the available pool right now."        )
              , React.createElement('p', { className: "text-[11px] text-gray-600 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}, "When videographers sync and upload raw footage, projects will appear here for editors to accept."

              )
            )
          ) : (
            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
              , available.map((booking) => (
                React.createElement(motion.div, {
                  key: booking.id,
                  whileHover: { y: -3 },
                  className: "orbit-card p-5 rounded-2xl border border-orbit-purple/30 bg-gradient-to-br from-black via-black to-orbit-purple/5 flex flex-col justify-between"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                    , React.createElement('div', { className: "flex justify-between items-start mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                      , React.createElement('span', { className: "text-xs px-2.5 py-1 bg-gray-900 border border-orbit-border text-gray-400 rounded-full font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}, "ID: #"
                         , booking.id.substring(0, 8)
                      )
                      , React.createElement('span', { className: "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-orbit-purple/20 text-orbit-purple border border-orbit-purple/30"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}, "Awaiting Editor"

                      )
                    )

                    , React.createElement('h3', { className: "text-lg font-bold text-white mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                      , booking.packageName || "Professional UGC"
                    )

                    , React.createElement('p', { className: "text-xs text-gray-400 mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}, "Scheduled: "
                       , new Date(booking.bookingDate).toLocaleDateString(), " at "  , booking.timeSlot
                    )

                    , _optionalChain([booking, 'access', _ => _.client, 'optionalAccess', _2 => _2.editorRequirements]) && (
                      React.createElement('div', { className: "bg-[#050505] border border-orbit-border/50 p-2.5 rounded-xl mb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
                        , React.createElement('p', { className: "text-[10px] text-muted-foreground uppercase font-bold mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}, "Brief:"

                        )
                        , React.createElement('p', { className: "text-xs text-gray-300 line-clamp-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}}
                          , booking.client.editorRequirements
                        )
                      )
                    )
                  )

                  , React.createElement('div', { className: "flex items-center justify-between mt-3 pt-3 border-t border-orbit-border/50"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
                    , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Client: "
                       , React.createElement('span', { className: "text-white font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}, _optionalChain([booking, 'access', _3 => _3.client, 'optionalAccess', _4 => _4.name]) || "N/A")
                    )
                    , React.createElement('button', {
                      onClick: () => handleAcceptProject(booking.id),
                      disabled: isAccepting === booking.id,
                      className: "px-3 py-1.5 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-black font-bold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center space-x-1"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}

                      , isAccepting === booking.id ? (
                        React.createElement('span', { className: "w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}} )
                      ) : (
                        React.createElement(Plus, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}} )
                      )
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}, "Accept Project" )
                    )
                  )
                )
              ))
            )
          )
        )

        /* Assigned bookings section */
        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}
          , React.createElement('h2', { className: "text-2xl font-bold mb-6 flex items-center space-x-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
            , React.createElement(Video, { className: "text-orbit-cyan", __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}} )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}, "Assigned Projects" )
          )

          , isLoading ? (
            React.createElement('div', { className: "flex flex-col items-center justify-center py-20 space-y-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}
              , React.createElement('div', { className: "w-10 h-10 border-4 border-orbit-cyan border-t-transparent rounded-full animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}} )
              , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}, "Loading workspace files..."  )
            )
          ) : bookings.length === 0 ? (
            React.createElement('div', { className: "orbit-card p-12 text-center rounded-2xl border border-dashed border-orbit-border"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}
              , React.createElement('p', { className: "text-muted-foreground text-lg mb-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}, "No active assignments"  )
              , React.createElement('p', { className: "text-sm text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}, "Accept projects from the available pool above to begin editing."

              )
            )
          ) : (
            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}
              , bookings.map((booking) => (
                React.createElement(motion.div, {
                  key: booking.id,
                  whileHover: { y: -4 },
                  className: `orbit-card p-6 rounded-2xl border ${
                    booking.status === "EDITING"
                      ? "border-orbit-cyan/30 bg-gradient-to-br from-black via-black to-orbit-cyan/5"
                      : "border-orbit-border"
                  } flex flex-col justify-between`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}

                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}
                    , React.createElement('div', { className: "flex justify-between items-start mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
                        , React.createElement('span', { className: "text-xs px-2.5 py-1 bg-gray-900 border border-orbit-border text-gray-400 rounded-full font-medium"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}, "ID: #"
                           , booking.id.substring(0, 8)
                        )
                      )
                      , React.createElement('span', {
                        className: `text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                          booking.status === "READY_TO_EDIT"
                            ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                            : booking.status === "EDITING"
                            ? "bg-orbit-cyan/15 text-orbit-cyan border border-orbit-cyan/30"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}

                        , booking.status === "READY_TO_EDIT" ? "Ready to Edit" : booking.status === "EDITING" ? "Editing" : "Delivered"
                      )
                    )

                    , React.createElement('h3', { className: "text-xl font-bold text-white mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}
                      , booking.packageName || "Professional UGC"
                    )

                    , React.createElement('p', { className: "text-sm text-gray-400 mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}, "Scheduled: "
                       , new Date(booking.bookingDate).toLocaleDateString(), " at" , " "
                      , booking.timeSlot
                    )

                    , _optionalChain([booking, 'access', _5 => _5.client, 'optionalAccess', _6 => _6.editorRequirements]) && (
                      React.createElement('div', { className: "bg-[#0A0A0A] border border-orbit-border/50 p-3 rounded-xl mb-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}
                        , React.createElement('p', { className: "text-xs text-muted-foreground uppercase font-bold mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}, "Briefing & Requirements:"

                        )
                        , React.createElement('p', { className: "text-xs text-gray-300 line-clamp-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
                          , booking.client.editorRequirements
                        )
                      )
                    )
                  )

                  , React.createElement('div', { className: "flex items-center justify-between mt-4 pt-4 border-t border-orbit-border/50"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}
                    , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}, "Client: "
                       , React.createElement('span', { className: "text-white font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}, _optionalChain([booking, 'access', _7 => _7.client, 'optionalAccess', _8 => _8.name]) || "N/A")
                    )
                    , React.createElement('button', {
                      onClick: () => router.push(`/bookings/${booking.id}`),
                      className: "px-4 py-2 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-black font-semibold rounded-lg text-sm hover:opacity-90 active:scale-[0.98] transition-all"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}

                      , booking.status === "READY_TO_EDIT" ? "Accept & Edit" : booking.status === "EDITING" ? "Open Studio" : "View Delivery"
                    )
                  )
                )
              ))
            )
          )
        )
      )
    )
  );
}
