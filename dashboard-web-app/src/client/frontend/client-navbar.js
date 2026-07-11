const _jsxFileName = "src\\client\\frontend\\client-navbar.tsx";"use client";

/**
 * CLIENT FRONTEND | ClientNavbar
 * 
 * Personalized greeting header inspired by modern app dashboards.
 * Shows user avatar, greeting ("Hi, {Name}"), subtitle, and notification bell.
 * Includes functional search bar with suggestions and notification panel.
 * No traditional nav links — navigation is handled by BottomNav.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Settings, ChevronDown, Search, X, CheckCircle2, CreditCard, Clock, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { getInitials, getGreeting } from "@/lib/utils";










export function ClientNavbar() {
  const { user, currentBooking, bookings, logout, setCurrentView } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState(new Set());

  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const avatarGradient = user.avatar || "from-orbit-cyan to-orbit-purple";
  const initials = getInitials(user.name);

  // Render avatar based on type (color gradient, image, or photo)
  const renderAvatar = (size, textSize) => {
    if (user.avatarType === "photo" && user.avatarPhotoUrl) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden shadow-lg`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
          , React.createElement('img', { src: user.avatarPhotoUrl, alt: "Profile", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}} )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarImage) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden shadow-lg ring-1 ring-white/10`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
          , React.createElement('img', { src: user.avatarImage, alt: "Profile", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}} )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarEmoji) {
      return (
        React.createElement('div', { className: `${size} rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 backdrop-blur-sm flex items-center justify-center ${textSize} shadow-lg`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
          , user.avatarEmoji
        )
      );
    }
    return (
      React.createElement('div', { className: `${size} rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center ${textSize} font-bold text-white shadow-lg`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
        , initials
      )
    );
  };

  const firstName = user.name ? user.name.split(" ")[0] : "there";
  const activeBookings = bookings.filter(
    (b) => !["DELIVERED", "CANCELLED"].includes(b.status)
  ).length;
  const hasActiveBooking = currentBooking
    ? !["DELIVERED", "CANCELLED"].includes(currentBooking.status)
    : false;
  // Generate notifications from bookings via useMemo
  const notifications = useMemo(() => {
    const notifs = [];
    bookings.forEach((b) => {
      const isActive = !["DELIVERED", "CANCELLED"].includes(b.status);
      const bookingDate = new Date(b.bookingDate);
      const timeAgo = getTimeAgo(bookingDate);

      if (b.paymentStatus === "SUCCESS") {
        const id = `${b.id}-payment`;
        notifs.push({
          id,
          title: "Payment Confirmed",
          description: `${b.packageName} - Payment successful`,
          time: timeAgo,
          read: readNotifIds.has(id) || !isActive,
          icon: "payment",
        });
      }

      if (isActive) {
        const id = `${b.id}-status`;
        notifs.push({
          id,
          title: getStatusTitle(b.status),
          description: `${b.packageName} - ${b.status.replace(/_/g, " ")}`,
          time: timeAgo,
          read: readNotifIds.has(id),
          icon: "status",
        });
      }

      if (b.status === "DELIVERED") {
        const id = `${b.id}-delivered`;
        notifs.push({
          id,
          title: "Edit Delivered",
          description: `${b.packageName} - Your edit is ready!`,
          time: timeAgo,
          read: readNotifIds.has(id) || true,
          icon: "delivery",
        });
      }
    });
    return notifs.reverse();
  }, [bookings, readNotifIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close search/notif on outside click (mousedown + touchstart for mobile)
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target )) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target )) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  // Close search on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const searchSuggestions = [
    { label: "Book a session", view: "packages"  },
    { label: "Track my order", view: "tracking"  },
    { label: "View packages", view: "packages"  },
    { label: "My Profile", view: "profile"  },
  ];

  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter((s) =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchSuggestions;

  function markAllRead() {
    setReadNotifIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      return next;
    });
  }

  return (
    React.createElement('header', { className: "sticky top-0 z-50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}
      /* Solid background to prevent text overlap */
      , React.createElement('div', { className: "bg-[#000000] border-b border-white/[0.06]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
        , React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
          , React.createElement('div', { className: "flex items-center justify-between py-2.5 sm:py-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
            /* Left: Avatar + Greeting */
            , React.createElement('div', { className: "flex items-center gap-3 sm:gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
              /* Avatar */
              , React.createElement('button', {
                onClick: () => setCurrentView("profile"),
                className: "relative group" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}

                , React.createElement('div', { className: "transition-transform duration-200 group-hover:scale-105 group-active:scale-95"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
                  , renderAvatar("w-9 h-9 sm:w-11 sm:h-11", "text-xs sm:text-sm")
                )
                /* Online indicator */
                , React.createElement('div', { className: "absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 border-2 border-[#000000]"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}} )
              )

              /* Greeting Text */
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}
                , React.createElement('p', { className: "text-[10px] sm:text-xs text-muted-foreground/50 font-bold uppercase tracking-widest leading-none mb-1"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
                  , getGreeting()
                )
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}
                  , React.createElement('h1', { className: "text-base sm:text-lg font-extrabold text-white leading-none"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}, "Hi, "
                     , firstName
                  )
                  , React.createElement(Badge, { className: "bg-orbit-cyan/15 hover:bg-orbit-cyan/20 text-orbit-cyan border-none text-[8px] font-extrabold px-1.5 py-0.5 rounded-md leading-none uppercase tracking-wider"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}, "Client"

                  )
                )
              )
            )

            /* Right: Search + Notification + Menu */
            , React.createElement('div', { className: "flex items-center gap-2 sm:gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}
              /* Search bar */
              , React.createElement('div', { ref: searchRef, className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
                , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}
                  , searchOpen && (
                    React.createElement(motion.div, {
                      initial: { opacity: 0, x: 8 },
                      animate: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: 8 },
                      transition: { duration: 0.2, ease: "easeInOut" },
                      className: "absolute right-0 top-0 z-10 flex items-center w-[260px] sm:w-[220px]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}

                      , React.createElement('div', { className: "w-full flex items-center gap-2 bg-white/[0.10] backdrop-blur-lg rounded-full px-3 h-10 sm:h-11 border border-white/10"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
                        , React.createElement(Search, { className: "w-4 h-4 text-muted-foreground shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}} )
                        , React.createElement('input', {
                          autoFocus: true,
                          value: searchQuery,
                          onChange: (e) => setSearchQuery(e.target.value),
                          placeholder: "Search...",
                          className: "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none min-w-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}
                        )
                        , searchQuery && (
                          React.createElement('button', {
                            onClick: () => setSearchQuery(""),
                            className: "shrink-0 text-muted-foreground hover:text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}

                            , React.createElement(X, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}} )
                          )
                        )
                      )
                    )
                  )
                )

                /* Search suggestions dropdown */
                , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}
                  , searchOpen && filteredSuggestions.length > 0 && (
                    React.createElement(motion.div, {
                      initial: { opacity: 0, y: -4, scale: 0.95 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                      exit: { opacity: 0, y: -4, scale: 0.95 },
                      transition: { duration: 0.15 },
                      className: "absolute right-0 top-12 sm:top-13 w-56 bg-[#0A0A0A]/95 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[70]"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}

                      , React.createElement('div', { className: "p-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}
                        , React.createElement('p', { className: "px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}, "Quick Actions"

                        )
                        , filteredSuggestions.map((s, i) => (
                          React.createElement('button', {
                            key: i,
                            onClick: () => {
                              setCurrentView(s.view);
                              setSearchOpen(false);
                              setSearchQuery("");
                            },
                            className: "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left text-sm text-foreground/80 hover:text-foreground"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}

                            , React.createElement(Search, { className: "w-3.5 h-3.5 text-muted-foreground/50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}} )
                            , s.label
                          )
                        ))
                      )
                    )
                  )
                )

                , React.createElement('button', {
                  onClick: () => {
                    setSearchOpen(!searchOpen);
                    setNotifOpen(false);
                    if (searchOpen) setSearchQuery("");
                  },
                  className: "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.08] backdrop-blur-lg flex items-center justify-center text-muted-foreground hover:text-orbit-cyan hover:bg-white/10 transition-all duration-200"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}

                  , React.createElement(Search, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}} )
                )
              )

              /* Notification bell */
              , React.createElement('div', { ref: notifRef, className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}}
                , React.createElement('button', {
                  className: "relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/[0.08] backdrop-blur-lg flex items-center justify-center text-muted-foreground hover:text-orbit-cyan hover:bg-white/10 transition-all duration-200"               ,
                  onClick: () => {
                    setNotifOpen(!notifOpen);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}

                  , React.createElement(Bell, { className: "w-4 h-4 sm:w-5 sm:h-5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}} )
                  , unreadCount > 0 && (
                    React.createElement('span', { className: "absolute -top-0.5 -right-0.5 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse"                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
                      , unreadCount
                    )
                  )
                )

                /* Notification panel */
                , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}
                  , notifOpen && (
                    React.createElement(motion.div, {
                      initial: { opacity: 0, y: -8, scale: 0.95 },
                      animate: { opacity: 1, y: 0, scale: 1 },
                      exit: { opacity: 0, y: -8, scale: 0.95 },
                      transition: { duration: 0.2 },
                      className: "absolute right-0 top-12 sm:top-13 w-72 max-w-[300px] bg-[#0A0A0A]/95 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[70]"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}

                      , React.createElement('div', { className: "p-3 border-b border-white/5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}
                        , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}
                          , React.createElement('h3', { className: "text-sm font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}, "Notifications")
                          , unreadCount > 0 && (
                            React.createElement('button', {
                              onClick: markAllRead,
                              className: "text-[11px] text-orbit-cyan hover:underline font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 330}}
, "Mark all read"

                            )
                          )
                        )
                      )

                      , React.createElement('div', { className: "max-h-80 overflow-y-auto custom-scrollbar"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}
                        , notifications.length === 0 ? (
                          React.createElement('div', { className: "p-6 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}
                            , React.createElement(Bell, { className: "w-8 h-8 text-muted-foreground/20 mx-auto mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}} )
                            , React.createElement('p', { className: "text-sm text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}, "No new notifications"  )
                          )
                        ) : (
                          React.createElement('div', { className: "p-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 347}}
                            , notifications.map((notif) => (
                              React.createElement('div', {
                                key: notif.id,
                                className: `flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                                  notif.read
                                    ? "hover:bg-white/[0.02]"
                                    : "bg-white/[0.04] hover:bg-white/[0.06]"
                                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}

                                , React.createElement('div', {
                                  className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                    notif.icon === "payment"
                                      ? "bg-green-500/10 text-green-400"
                                      : notif.icon === "status"
                                      ? "bg-orbit-cyan/10 text-orbit-cyan"
                                      : notif.icon === "delivery"
                                      ? "bg-orbit-purple/10 text-orbit-purple"
                                      : "bg-white/5 text-muted-foreground"
                                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}

                                  , notif.icon === "payment" ? (
                                    React.createElement(CreditCard, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}} )
                                  ) : notif.icon === "status" ? (
                                    React.createElement(Film, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 371}} )
                                  ) : notif.icon === "delivery" ? (
                                    React.createElement(CheckCircle2, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}} )
                                  ) : (
                                    React.createElement(Clock, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}} )
                                  )
                                )
                                , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}
                                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}
                                    , React.createElement('p', { className: "text-xs font-semibold text-foreground truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}
                                      , notif.title
                                    )
                                    , !notif.read && (
                                      React.createElement('div', { className: "w-1.5 h-1.5 rounded-full bg-orbit-cyan shrink-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 384}} )
                                    )
                                  )
                                  , React.createElement('p', { className: "text-[11px] text-muted-foreground/70 truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}
                                    , notif.description
                                  )
                                  , React.createElement('p', { className: "text-[10px] text-muted-foreground/40 mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}
                                    , notif.time
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

              /* Quick menu dropdown toggle (mobile) */
              , React.createElement('button', {
                onClick: () => {
                  setMenuOpen(!menuOpen);
                  setSearchOpen(false);
                  setNotifOpen(false);
                },
                className: "md:hidden w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}

                , React.createElement(ChevronDown, {
                  className: `w-4 h-4 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
                )
              )
            )
          )

          /* Subtitle / Status line */
          , React.createElement('div', { className: "pb-2 sm:pb-3 flex items-center gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}
            , hasActiveBooking ? (
              React.createElement('div', { className: "flex items-center gap-2 min-w-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}
                , React.createElement('div', { className: "w-2 h-2 rounded-full bg-orbit-cyan animate-pulse shrink-0"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 426}} )
                , React.createElement('p', { className: "text-xs sm:text-sm text-muted-foreground truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}, "Your edit is"
                    , " "
                  , React.createElement('span', {
                    className: "text-orbit-cyan font-semibold cursor-pointer hover:underline"   ,
                    onClick: () => setCurrentView("tracking"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}
, "being tracked"

                  )
                )
              )
            ) : (
              React.createElement('p', { className: "text-xs sm:text-sm text-muted-foreground/60 truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}, "Ready to create something cinematic?"

              )
            )
          )
        )
      )

      /* Dropdown Menu (mobile) */
      , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 447}}
        , menuOpen && (
          React.createElement(motion.div, {
            initial: { opacity: 0, y: -8, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -8, scale: 0.95 },
            transition: { duration: 0.2 },
            className: "absolute right-4 sm:right-6 top-[4.5rem] sm:top-[5.5rem] w-56 bg-[#0A0A0A]/95 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[60]"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}}

            , React.createElement('div', { className: "p-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 456}}
              /* Notifications */
              , activeBookings > 0 && (
                React.createElement('button', {
                  onClick: () => {
                    setCurrentView("tracking");
                    setMenuOpen(false);
                  },
                  className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 459}}

                  , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-orbit-cyan/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}}
                    , React.createElement(Bell, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 467}} )
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 469}}
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 470}}, "Active Booking" )
                    , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}
                      , activeBookings, " in progress"
                    )
                  )
                )
              )

              , React.createElement('button', {
                onClick: () => {
                  setCurrentView("profile");
                  setMenuOpen(false);
                },
                className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}

                , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-orbit-purple/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}}
                  , React.createElement(Settings, { className: "w-4 h-4 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}} )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 488}}
                  , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}, "Settings")
                  , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}, "Profile & preferences"

                  )
                )
              )

              , React.createElement('div', { className: "h-px bg-orbit-border/30 my-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}} )

              , React.createElement('button', {
                onClick: () => {
                  logout();
                  setMenuOpen(false);
                },
                className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/5 transition-colors text-left"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}

                , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 505}}
                  , React.createElement(LogOut, { className: "w-4 h-4 text-red-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 506}} )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 508}}
                  , React.createElement('p', { className: "text-sm font-medium text-red-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 509}}, "Log Out" )
                )
              )
            )
          )
        )
      )
    )
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusTitle(status) {
  const map = {
    PENDING: "Booking Confirmed",
    PAID: "Payment Received",
    PARTNER_DISPATCHED: "Partner Dispatched",
    EN_ROUTE: "Partner En Route",
    SHOOTING: "Shooting in Progress",
    SYNCING: "Media Syncing",
    EDITING: "Edit in Progress",
    DELIVERED: "Edit Delivered",
    CANCELLED: "Booking Cancelled",
  };
  return map[status] || "Booking Update";
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}