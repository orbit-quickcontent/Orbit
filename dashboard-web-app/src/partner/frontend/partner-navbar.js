const _jsxFileName = "src\\partner\\frontend\\partner-navbar.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerNavbar
 *
 * Personalized greeting header for partners (matching client style).
 * Shows avatar, "Hi, {Name}", PARTNER badge, earnings indicator,
 * online/offline toggle, and notification bell.
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Settings, ChevronDown, Search, Wallet, X, MapPin, FileText, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { getInitials, getGreeting } from "@/lib/utils";

export function PartnerNavbar() {
  const { user, setUser, toggleOnline, partnerActiveBooking, bookings, logout, setCurrentView } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter bookings for search
  const searchableBookings = bookings.filter((b) => {
    // When offline, don't show available work (PENDING / PARTNER_DISPATCHED) in results
    if (!user.isOnline && (b.status === "PENDING" || b.status === "PARTNER_DISPATCHED")) {
      return false;
    }
    return true;
  });

  const searchResults = searchQuery.trim()
    ? searchableBookings.filter((b) => {
        const q = searchQuery.toLowerCase();
        return (
          b.id.toLowerCase().includes(q) ||
          b.packageName.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          b.notes.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSearchSelect = useCallback(
    (booking) => {
      setSearchOpen(false);
      setSearchQuery("");
      // Navigate to the right view based on status
      if (booking.status === "DELIVERED" || booking.status === "CANCELLED") {
        setCurrentView("partner-earnings");
      } else {
        setCurrentView("partner");
      }
    },
    [setCurrentView]
  );

  // Close search on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    if (searchOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [searchOpen]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target )) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => _optionalChain([searchInputRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.focus, 'call', _3 => _3()]), 100);
    }
  }, [searchOpen]);

  const avatarGradient = user.avatar || "from-orbit-purple to-orbit-cyan";
  const initials = getInitials(user.name);

  const renderAvatar = (size, textSize) => {
    if (user.avatarType === "photo" && user.avatarPhotoUrl) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden shadow-lg`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
          , React.createElement('img', { src: user.avatarPhotoUrl, alt: "Profile", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}} )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarImage) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden shadow-lg ring-1 ring-white/10`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
          , React.createElement('img', { src: user.avatarImage, alt: "Profile", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}} )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarEmoji) {
      return (
        React.createElement('div', { className: `${size} rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 backdrop-blur-sm flex items-center justify-center ${textSize} shadow-lg`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
          , user.avatarEmoji
        )
      );
    }
    return (
      React.createElement('div', { className: `${size} rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center ${textSize} font-bold text-white shadow-lg`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
        , initials
      )
    );
  };

  const firstName = user.name ? user.name.split(" ")[0] : "there";

  // Only count truly active bookings for notifications
  // Suppress notifications when partner is offline - they shouldn't see new work alerts
  const hasActiveWork = !!partnerActiveBooking;
  const unreadNotifications = user.isOnline && hasActiveWork ? 1 : 0;

  const handleToggleOnline = () => {
    toggleOnline();
  };

  return (
    React.createElement('header', { className: "sticky top-0 z-50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
      , React.createElement('div', { className: "bg-[#000000] border-b border-white/[0.06]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
        , React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}
          , React.createElement('div', { className: "flex items-center justify-between py-2.5 sm:py-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}
            /* Left: Avatar + Greeting */
            , React.createElement('div', { className: "flex items-center gap-3 sm:gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
              , React.createElement('button', { className: "relative group" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
                , React.createElement('div', { className: "transition-transform duration-200 group-hover:scale-105 group-active:scale-95"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
                  , renderAvatar("w-9 h-9 sm:w-11 sm:h-11", "text-xs sm:text-sm")
                )
                , React.createElement('div', { className: `absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#000000] ${user.isOnline ? "bg-green-400" : "bg-gray-400"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}} )
              )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
                  , React.createElement('p', { className: "text-xs sm:text-sm text-muted-foreground/70 font-medium"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
                    , getGreeting()
                  )
                  , React.createElement(Badge, { variant: "outline", className: "border-orbit-purple/30 text-orbit-purple text-[8px] sm:text-[9px] px-1.5 py-0"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}, "PARTNER"

                  )
                )
                , React.createElement('h1', { className: "text-lg sm:text-xl font-bold text-foreground leading-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}, "Hi, "
                   , firstName
                )
              )
            )

            /* Right: Search + Online Toggle + Notification + Menu */
            , React.createElement('div', { className: "flex items-center gap-2 sm:gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
              , React.createElement('button', {
                onClick: () => { setSearchOpen(true); setMenuOpen(false); },
                className: "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.08] backdrop-blur-lg flex items-center justify-center text-muted-foreground hover:text-orbit-purple hover:bg-white/10 transition-all duration-200"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}

                , React.createElement(Search, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}} )
              )

              /* Online/Offline Toggle */
              , React.createElement('button', {
                onClick: handleToggleOnline,
                className: "flex items-center gap-1.5 h-9 sm:h-10 px-2.5 rounded-full bg-white/[0.08] backdrop-blur-lg hover:bg-white/10 transition-all duration-200"           ,
                title: user.isOnline ? "Go Offline" : "Go Online", __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}

                , React.createElement('div', { className: `w-2.5 h-2.5 rounded-full transition-colors duration-200 ${user.isOnline ? "bg-green-400" : "bg-gray-400"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}} )
                , React.createElement('span', { className: `text-[11px] sm:text-xs font-medium transition-colors duration-200 ${user.isOnline ? "text-green-400" : "text-gray-400"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                  , user.isOnline ? "Online" : "Offline"
                )
              )

              , React.createElement('button', {
                className: "relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.08] backdrop-blur-lg flex items-center justify-center text-muted-foreground hover:text-orbit-purple hover:bg-white/10 transition-all duration-200"               ,
                onClick: () => setMenuOpen(!menuOpen), __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}

                , React.createElement(Bell, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}} )
                , unreadNotifications > 0 && (
                  React.createElement('span', { className: "absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                    , unreadNotifications
                  )
                )
              )

              , React.createElement('button', {
                onClick: () => setMenuOpen(!menuOpen),
                className: "md:hidden w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}

                , React.createElement(ChevronDown, {
                  className: `w-4 h-4 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}
                )
              )
            )
          )

          /* Subtitle / Status line */
          , React.createElement('div', { className: "pb-2 sm:pb-3 flex items-center gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}
            , hasActiveWork ? (
              React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}
                , React.createElement('div', { className: "w-2 h-2 rounded-full bg-orbit-purple animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}} )
                , React.createElement('p', { className: "text-[10px] sm:text-xs text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}, "You have an"
                    , " "
                  , React.createElement('span', { className: "text-orbit-purple font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}, "active shoot"

                  )
                )
              )
            ) : user.isOnline ? (
              React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
                , React.createElement(Wallet, { className: "w-3.5 h-3.5 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}} )
                , React.createElement('p', { className: "text-[10px] sm:text-xs text-muted-foreground/70"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}, "Ready for your next gig"

                )
              )
            ) : (
              React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
                , React.createElement('div', { className: "w-2 h-2 rounded-full bg-gray-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}} )
                , React.createElement('p', { className: "text-[10px] sm:text-xs text-muted-foreground/70"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}, "You're offline — won't receive new bookings"

                )
              )
            )
          )
        )
      )

      /* Search Overlay */
      , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
        , searchOpen && (
          React.createElement(motion.div, {
            ref: searchRef,
            initial: { opacity: 0, y: -8, scale: 0.97 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -8, scale: 0.97 },
            transition: { duration: 0.2 },
            className: "absolute left-4 right-4 sm:left-6 sm:right-6 top-16 sm:top-20 z-[70]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}

            , React.createElement('div', { className: "bg-[#0A0A0A]/95 backdrop-blur-lg border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}
              /* Search Input */
              , React.createElement('div', { className: "flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}
                , React.createElement(Search, { className: "w-4 h-4 text-orbit-cyan shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}} )
                , React.createElement('input', {
                  ref: searchInputRef,
                  type: "text",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  placeholder: "Search bookings by ID, package, location, notes…"      ,
                  className: "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}
                )
                , searchQuery && (
                  React.createElement('button', {
                    onClick: () => setSearchQuery(""),
                    className: "w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}

                    , React.createElement(X, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}} )
                  )
                )
              )

              /* Results */
              , searchQuery.trim() && (
                React.createElement('div', { className: "max-h-72 overflow-y-auto p-2 custom-scrollbar"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
                  , searchResults.length === 0 ? (
                    React.createElement('div', { className: "py-6 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
                      , React.createElement('p', { className: "text-sm text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}, "No bookings found"  )
                      , React.createElement('p', { className: "text-xs text-muted-foreground/40 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}, "Try a different search term"    )
                    )
                  ) : (
                    searchResults.map((booking) => {
                      const isActive = !["DELIVERED", "CANCELLED"].includes(booking.status);
                      return (
                        React.createElement('button', {
                          key: booking.id,
                          onClick: () => handleSearchSelect(booking),
                          className: "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}

                          , React.createElement('div', { className: `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isActive ? "bg-orbit-purple/10" : "bg-white/[0.04]"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}
                            , React.createElement(Package, { className: `w-4 h-4 ${isActive ? "text-orbit-purple" : "text-muted-foreground/60"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}} )
                          )
                          , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}
                            , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
                              , React.createElement('p', { className: "text-sm font-medium text-foreground truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}, booking.packageName)
                              , React.createElement('span', { className: `text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${isActive ? "bg-orbit-purple/10 text-orbit-purple" : "bg-white/[0.04] text-muted-foreground/60"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
                                , booking.status
                              )
                            )
                            , React.createElement('div', { className: "flex items-center gap-3 mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}
                              , booking.location && (
                                React.createElement('span', { className: "flex items-center gap-1 text-xs text-muted-foreground/60 truncate"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
                                  , React.createElement(MapPin, { className: "w-3 h-3 shrink-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}} ), booking.location
                                )
                              )
                              , booking.notes && (
                                React.createElement('span', { className: "flex items-center gap-1 text-xs text-muted-foreground/40 truncate"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}
                                  , React.createElement(FileText, { className: "w-3 h-3 shrink-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}} ), booking.notes
                                )
                              )
                            )
                            , React.createElement('p', { className: "text-[10px] text-muted-foreground/30 mt-0.5 font-mono"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}, booking.id)
                          )
                        )
                      );
                    })
                  )
                )
              )

              /* Hint when empty query */
              , !searchQuery.trim() && (
                React.createElement('div', { className: "py-4 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground/40 text-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}}, "Type to search across "
                        , searchableBookings.length, " booking" , searchableBookings.length !== 1 ? "s" : ""
                  )
                )
              )
            )
          )
        )
      )

      /* Dropdown Menu */
      , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}
        , menuOpen && (
          React.createElement(motion.div, {
            initial: { opacity: 0, y: -8, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -8, scale: 0.95 },
            transition: { duration: 0.2 },
            className: "absolute right-4 sm:right-6 top-20 sm:top-24 w-56 bg-[#0A0A0A]/95 backdrop-blur-lg border border-orbit-border/40 rounded-2xl overflow-hidden shadow-2xl z-[60]"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}

            , React.createElement('div', { className: "p-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
              , hasActiveWork && (
                React.createElement('button', {
                  onClick: () => {
                    setCurrentView("partner");
                    setMenuOpen(false);
                  },
                  className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 354}}

                  , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-orbit-purple/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}
                    , React.createElement(Bell, { className: "w-4 h-4 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}} )
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}, "Active Shoot" )
                    , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}, "1 in progress"  )
                  )
                )
              )

              , React.createElement('button', {
                onClick: () => {
                  setCurrentView("profile");
                  setMenuOpen(false);
                },
                className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 371}}

                , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-orbit-cyan/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}
                  , React.createElement(Settings, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}} )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}
                  , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}, "Settings")
                  , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}, "Profile & preferences"  )
                )
              )

              , React.createElement('div', { className: "h-px bg-orbit-border/30 my-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}} )

              , React.createElement('button', {
                onClick: () => {
                  logout();
                  setMenuOpen(false);
                },
                className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/5 transition-colors text-left"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}

                , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}
                  , React.createElement(LogOut, { className: "w-4 h-4 text-red-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}} )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
                  , React.createElement('p', { className: "text-sm font-medium text-red-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}, "Log Out" )
                )
              )
            )
          )
        )
      )
    )
  );
}