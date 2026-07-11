const _jsxFileName = "src\\client\\frontend\\profile-view.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

/**
 * CLIENT FRONTEND | ProfileView
 *
 * User profile page showing avatar, name, email, phone,
 * booking stats, download history, and settings.
 * Instagram-style profile layout with full avatar editing
 * (Color, Avatar, Photo) and booking management.
 *
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Edit3,
  LogOut,
  Check,
  X,
  Film,
  Settings,
  ChevronRight,
  ChevronDown,
  Shield,
  HelpCircle,
  Download,
  ImageIcon,
  UserCircle,
  Palette,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import {
  AVATAR_COLORS,
  AVATAR_PRESETS,
  isWithinRedownloadWindow,
  getRedownloadDaysRemaining,
} from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";




export function ProfileView() {
  const { user, setUser, logout, bookings, reviews, cancelBooking } =
    useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editAvatarMode, setEditAvatarMode] = useState(
    user.avatarType === "photo"
      ? "photo"
      : user.avatarType === "avatar"
      ? "avatar"
      : "color"
  );
  const [editAvatar, setEditAvatar] = useState(
    (AVATAR_COLORS ).indexOf(user.avatar || "") >= 0
      ? (AVATAR_COLORS ).indexOf(user.avatar || "")
      : 0
  );
  const [editAvatarPreset, setEditAvatarPreset] = useState(
    _nullishCoalesce(_optionalChain([AVATAR_PRESETS, 'access', _ => _.find, 'call', _2 => _2((p) => p.emoji === user.avatarEmoji), 'optionalAccess', _3 => _3.id]), () => ( null))
  );
  const [editPhotoPreview, setEditPhotoPreview] = useState(
    user.avatarPhotoUrl
  );
  const photoInputRef = useRef(null);

  const avatarGradient = user.avatar || "from-orbit-cyan to-orbit-purple";
  const initials = getInitials(user.name);

  // Render avatar based on type
  const renderProfileAvatar = (size, textSize) => {
    if (user.avatarType === "photo" && user.avatarPhotoUrl) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden shadow-xl`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
          , React.createElement('img', {
            src: user.avatarPhotoUrl,
            alt: "Profile",
            className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
          )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarImage) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden shadow-xl ring-2 ring-white/10`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
          , React.createElement('img', {
            src: user.avatarImage,
            alt: "Profile",
            className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
          )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarEmoji) {
      return (
        React.createElement('div', {
          className: `${size} rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 backdrop-blur-sm flex items-center justify-center ${textSize} shadow-xl`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}

          , user.avatarEmoji
        )
      );
    }
    return (
      React.createElement('div', {
        className: `${size} rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center ${textSize} font-black text-white shadow-xl`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}

        , initials
      )
    );
  };

  // Render edit-mode avatar preview
  const renderEditAvatarPreview = () => {
    if (editAvatarMode === "photo" && editPhotoPreview) {
      return (
        React.createElement('div', { className: "w-16 h-16 rounded-full overflow-hidden shadow-xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
          , React.createElement('img', {
            src: editPhotoPreview,
            alt: "Preview",
            className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
          )
        )
      );
    }
    if (editAvatarMode === "avatar" && editAvatarPreset) {
      const preset = AVATAR_PRESETS.find((p) => p.id === editAvatarPreset);
      if (preset) {
        return (
          React.createElement('div', { className: "w-16 h-16 rounded-full overflow-hidden shadow-xl ring-1 ring-white/10"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
            , React.createElement('img', { src: preset.image, alt: preset.label, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}} )
          )
        );
      }
    }
    return (
      React.createElement('div', {
        className: `w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORS[editAvatar]} flex items-center justify-center text-xl font-black text-white shadow-xl`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}

        , editName ? editName[0].toUpperCase() : "?"
      )
    );
  };

  const handlePhotoSelect = (e) => {
    const file = _optionalChain([e, 'access', _4 => _4.target, 'access', _5 => _5.files, 'optionalAccess', _6 => _6[0]]);
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Please select an image under 5MB" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please select an image file" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result ;
      setEditPhotoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const completedBookingsList = bookings.filter((b) => b.status === "DELIVERED");
  const activeBookingsList = bookings.filter(
    (b) => !["DELIVERED", "CANCELLED"].includes(b.status)
  );
  const completedBookings = completedBookingsList.length;
  const activeBookings = activeBookingsList.length;

  // Get filtered bookings based on active tab
  const filteredBookings =
    activeTab === "total" ? bookings :
    activeTab === "active" ? activeBookingsList :
    completedBookingsList;

  const handleSave = useCallback(() => {
    const updates = {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
    };

    if (editAvatarMode === "photo") {
      updates.avatarType = "photo";
      updates.avatarEmoji = null;
      updates.avatarPhotoUrl = editPhotoPreview;
      updates.avatar = null;
      updates.avatarImage = null;
    } else if (editAvatarMode === "avatar") {
      const preset = AVATAR_PRESETS.find((p) => p.id === editAvatarPreset);
      updates.avatarType = "avatar";
      updates.avatarEmoji = _nullishCoalesce(_optionalChain([preset, 'optionalAccess', _7 => _7.emoji]), () => ( null));
      updates.avatarPhotoUrl = null;
      updates.avatar = _nullishCoalesce(_optionalChain([preset, 'optionalAccess', _8 => _8.gradient]), () => ( null));
      updates.avatarImage = _nullishCoalesce(_optionalChain([preset, 'optionalAccess', _9 => _9.image]), () => ( null));
    } else {
      updates.avatarType = "color";
      updates.avatarEmoji = null;
      updates.avatarPhotoUrl = null;
      updates.avatar = AVATAR_COLORS[editAvatar];
      updates.avatarImage = null;
    }

    setUser(updates);
    setIsEditing(false);
    toast.success("Profile updated!");
  }, [
    editName,
    editEmail,
    editPhone,
    editAvatarMode,
    editAvatarPreset,
    editPhotoPreview,
    editAvatar,
    setUser,
  ]);

  const handleCancel = useCallback(() => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    const idx = (AVATAR_COLORS ).indexOf(user.avatar || "");
    setEditAvatar(idx >= 0 ? idx : 0);
    setEditAvatarMode(
      user.avatarType === "photo"
        ? "photo"
        : user.avatarType === "avatar"
        ? "avatar"
        : "color"
    );
    setEditAvatarPreset(
      _nullishCoalesce(_optionalChain([AVATAR_PRESETS, 'access', _10 => _10.find, 'call', _11 => _11((p) => p.emoji === user.avatarEmoji), 'optionalAccess', _12 => _12.id]), () => ( null))
    );
    setEditPhotoPreview(user.avatarPhotoUrl);
    setIsEditing(false);
  }, [user.name, user.email, user.phone, user.avatar, user.avatarType, user.avatarEmoji, user.avatarPhotoUrl]);

  const handleCancelBooking = useCallback(
    (bookingId) => {
      if (confirm("Are you sure you want to cancel this booking?")) {
        cancelBooking(bookingId, "CLIENT");
        toast.success("Booking cancelled successfully.");
      }
    },
    [cancelBooking]
  );

  const menuItems = [
    {
      icon: React.createElement(Shield, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}} ),
      label: "Privacy & Security",
      desc: "Manage data and permissions",
    },
    {
      icon: React.createElement(Settings, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}} ),
      label: "App Settings",
      desc: "Notifications, language, theme",
    },
    {
      icon: React.createElement(HelpCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}} ),
      label: "Help & Support",
      desc: "FAQs, contact, report",
    },
  ];

  return (
    React.createElement('div', { className: "pb-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
      /* Profile Header - Compact */
      , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
          /* Avatar */
          , React.createElement('div', { className: "relative shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
            , renderProfileAvatar(
              "w-14 h-14 sm:w-16 sm:h-16",
              "text-lg sm:text-xl"
            )
            /* Online indicator */
            , React.createElement('div', { className: "absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#000000]"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}} )
          )

          /* Info */
          , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}
            , React.createElement('h2', { className: "text-lg font-black text-foreground truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}
              , user.name || "Orbit User"
            )
            , React.createElement('p', { className: "text-[11px] text-muted-foreground truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}
              , user.email || "No email set"
            )
            , user.phone && (
              React.createElement('p', { className: "text-[10px] text-muted-foreground/70 truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}
                , user.phone
              )
            )
            , React.createElement('div', { className: "flex items-center gap-1.5 mt-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
              , React.createElement(Badge, {
                variant: "outline",
                className: "border-orbit-cyan/30 text-orbit-cyan text-[8px] px-1.5 py-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}

                , React.createElement(Film, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}} ), " Client"
              )
              , user.location && (
                React.createElement(Badge, {
                  variant: "outline",
                  className: "border-orbit-border text-muted-foreground text-[8px] px-1.5 py-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}

                  , React.createElement(MapPin, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}} ), " " , user.location
                )
              )
            )
          )

          /* Edit button */
          , React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: () => setIsEditing(!isEditing),
            className: "border-orbit-border text-muted-foreground hover:text-foreground hover:border-orbit-cyan/30 h-8 text-[10px] shrink-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}

            , isEditing ? (
              React.createElement(X, { className: "w-3 h-3 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 335}} )
            ) : (
              React.createElement(Edit3, { className: "w-3 h-3 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}} )
            )
            , isEditing ? "Close" : "Edit"
          )
        )
      )

      /* Total Video — Compact Card + Tab-Filtered Details */
      , bookings.length > 0 && (
        React.createElement('div', { className: "mb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}
          /* Compact TOTAL Card */
          , React.createElement('button', {
            onClick: () => setActiveTab(activeTab ? null : "total"),
            className: "w-full orbit-card rounded-xl p-2.5 sm:p-3 text-center transition-all duration-300 active:scale-[0.99] hover:border-orbit-cyan/20"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}

            , React.createElement('div', { className: "flex items-center justify-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
              , React.createElement('div', { className: "w-7 h-7 rounded-md bg-orbit-cyan/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}
                , React.createElement(Film, { className: "w-3.5 h-3.5 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 354}} )
              )
              , React.createElement('div', { className: "text-xl sm:text-2xl font-black text-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}
                , bookings.length
              )
              , React.createElement('div', { className: "text-[9px] text-muted-foreground uppercase tracking-widest"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}, "Bookings"

              )
              , React.createElement(ChevronDown, {
                className: `w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-300 ${
                  activeTab ? "rotate-180" : ""
                }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}
              )
            )
          )

          /* Tab Bar: Total | Active | Done */
          , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 371}}
            , activeTab && (
              React.createElement(motion.div, {
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                transition: { duration: 0.25 },
                className: "overflow-hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}

                , React.createElement('div', { className: "flex items-center gap-1 mt-1.5 p-0.5 bg-white/[0.03] rounded-lg"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}
                  , ([
                    { key: "total" , label: "All", count: bookings.length },
                    { key: "active" , label: "Active", count: activeBookings },
                    { key: "done" , label: "Done", count: completedBookings },
                  ]).map((tab) => (
                    React.createElement('button', {
                      key: tab.key,
                      onClick: () => setActiveTab(tab.key),
                      className: `flex-1 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        activeTab === tab.key
                          ? "bg-orbit-cyan/15 text-orbit-cyan"
                          : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-white/[0.03]"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}

                      , tab.label
                      , React.createElement('span', { className: `ml-0.5 text-[8px] ${
                        activeTab === tab.key
                          ? "text-orbit-cyan/60"
                          : "text-muted-foreground/40"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}, "("
                        , tab.count, ")"
                      )
                    )
                  ))
                )
              )
            )
          )

          /* Expandable Detail List (filtered by active tab) */
          , React.createElement(AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}
            , activeTab && filteredBookings.length > 0 && (
              React.createElement(motion.div, {
                key: activeTab,
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: "auto" },
                exit: { opacity: 0, height: 0 },
                transition: { duration: 0.3 },
                className: "overflow-hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}

                , React.createElement('div', { className: "mt-1.5 space-y-1 max-h-52 overflow-y-auto"   , style: { scrollbarWidth: "thin", scrollbarColor: "rgba(0,191,255,0.15) transparent" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}
                  , filteredBookings
                    .slice()
                    .reverse()
                    .map((b) => {
                      const isActive = !["DELIVERED", "CANCELLED"].includes(b.status);
                      const isDelivered = b.status === "DELIVERED";
                      const isCancelled = b.status === "CANCELLED";
                      const canCancel = isActive && ["PAID", "PARTNER_DISPATCHED", "EN_ROUTE"].includes(b.status);
                      const withinWindow = isDelivered && isWithinRedownloadWindow(b.deliveredAt);
                      const daysLeft = isDelivered ? getRedownloadDaysRemaining(b.deliveredAt) : 0;

                      return (
                        React.createElement('div', {
                          key: b.id,
                          className: "flex items-center justify-between bg-white/[0.03] rounded-lg px-2.5 py-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}

                          , React.createElement('div', { className: "flex items-center gap-2 flex-1 min-w-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}
                            , React.createElement('div', {
                              className: `w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                                isDelivered
                                  ? "bg-green-500/10 text-green-400"
                                  : isCancelled
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-orbit-cyan/10 text-orbit-cyan"
                              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}

                              , isDelivered ? (
                                React.createElement(CheckCircle2, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}} )
                              ) : isCancelled ? (
                                React.createElement(X, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}} )
                              ) : (
                                React.createElement(Film, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 453}} )
                              )
                            )
                            , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 456}}
                              , React.createElement('div', { className: "text-[10px] sm:text-[11px] font-medium text-foreground truncate"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 457}}
                                , b.packageName
                              )
                              , React.createElement('div', { className: "text-[9px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 460}}
                                , new Date(b.bookingDate).toLocaleDateString("en-IN", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }), " ", "· "
                                 , b.timeSlot
                              )
                            )
                          )
                          , React.createElement('div', { className: "flex items-center gap-1 shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 470}}
                            , isDelivered && withinWindow && !b.downloaded && (
                              React.createElement(Button, {
                                size: "sm",
                                className: "h-5 px-1.5 text-[8px] bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}}

                                , React.createElement(Download, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 476}} ), " Save"
                              )
                            )
                            , isDelivered && b.downloaded && (
                              React.createElement('span', { className: "text-[8px] text-green-400/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 480}}
                                , daysLeft, "d"
                              )
                            )
                            , isDelivered && !withinWindow && (
                              React.createElement('span', { className: "text-[8px] text-muted-foreground/40" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}}, "Expired")
                            )
                            , React.createElement(Badge, {
                              variant: "outline",
                              className: `text-[7px] sm:text-[8px] ${
                                isDelivered
                                  ? "border-green-400/30 text-green-400"
                                  : isCancelled
                                  ? "border-red-400/30 text-red-400"
                                  : "border-orbit-cyan/30 text-orbit-cyan"
                              }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}

                              , b.status
                            )
                            , canCancel && (
                              React.createElement(Button, {
                                variant: "outline",
                                size: "sm",
                                onClick: (e) => { e.stopPropagation(); handleCancelBooking(b.id); },
                                className: "h-5 px-1.5 text-[8px] border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}
, "Cancel"

                              )
                            )
                          )
                        )
                      );
                    })
                )
              )
            )
          )
        )
      )

      /* Edit Profile Modal */
      , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 521}}
        , isEditing && (
          React.createElement(motion.div, {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.3 },
            className: "overflow-hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}

            , React.createElement('div', { className: "orbit-card rounded-xl p-4 sm:p-5 space-y-3 mb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 530}}
              , React.createElement('h3', { className: "text-sm font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}, "Edit Profile"

              )

              /* Avatar preview */
              , React.createElement('div', { className: "flex items-center justify-center gap-4 mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 536}}
                , renderEditAvatarPreview()
              )

              /* Avatar mode tabs */
              , React.createElement('div', { className: "flex items-center justify-center gap-2 mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 541}}
                , React.createElement('button', {
                  onClick: () => setEditAvatarMode("color"),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    editAvatarMode === "color"
                      ? "bg-orbit-cyan/20 text-orbit-cyan"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 542}}

                  , React.createElement(Palette, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 550}} ), " Color"
                )
                , React.createElement('button', {
                  onClick: () => setEditAvatarMode("avatar"),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    editAvatarMode === "avatar"
                      ? "bg-orbit-cyan/20 text-orbit-cyan"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 552}}

                  , React.createElement(UserCircle, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 560}} ), " Avatar"
                )
                , React.createElement('button', {
                  onClick: () => setEditAvatarMode("photo"),
                  className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    editAvatarMode === "photo"
                      ? "bg-orbit-cyan/20 text-orbit-cyan"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 562}}

                  , React.createElement(ImageIcon, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 570}} ), " Photo"
                )
              )

              /* Color picker */
              , editAvatarMode === "color" && (
                React.createElement('div', { className: "flex items-center justify-center gap-3 mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 576}}
                  , AVATAR_COLORS.map((color, i) => (
                    React.createElement('button', {
                      key: i,
                      onClick: () => setEditAvatar(i),
                      className: `w-7 h-7 rounded-full bg-gradient-to-br ${color} transition-all duration-200 ${
                        editAvatar === i
                          ? "scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-[#000000]"
                          : "opacity-50 hover:opacity-100 hover:scale-110"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 578}}
                    )
                  ))
                )
              )

              /* Avatar preset picker */
              , editAvatarMode === "avatar" && (
                React.createElement('div', { className: "flex items-center justify-center gap-3 mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 593}}
                  , AVATAR_PRESETS.map((preset) => (
                    React.createElement('button', {
                      key: preset.id,
                      onClick: () => setEditAvatarPreset(preset.id),
                      className: `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                        editAvatarPreset === preset.id
                          ? "bg-orbit-cyan/10 ring-1 ring-orbit-cyan/40"
                          : "bg-white/5 hover:bg-white/10"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 595}}

                      , React.createElement('div', {
                        className: "w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/10"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 604}}

                        , React.createElement('img', { src: preset.image, alt: preset.label, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 607}} )
                      )
                      , React.createElement('span', { className: "text-[9px] text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 609}}
                        , preset.label
                      )
                    )
                  ))
                )
              )

              /* Photo upload */
              , editAvatarMode === "photo" && (
                React.createElement('div', { className: "flex flex-col items-center gap-3 mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 619}}
                  , React.createElement('input', {
                    ref: photoInputRef,
                    type: "file",
                    accept: "image/*",
                    className: "hidden",
                    onChange: handlePhotoSelect, __self: this, __source: {fileName: _jsxFileName, lineNumber: 620}}
                  )
                  , editPhotoPreview ? (
                    React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 628}}
                      , React.createElement('div', { className: "w-20 h-20 rounded-full overflow-hidden shadow-xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}
                        , React.createElement('img', {
                          src: editPhotoPreview,
                          alt: "Preview",
                          className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 630}}
                        )
                      )
                      , React.createElement('button', {
                        onClick: () => _optionalChain([photoInputRef, 'access', _13 => _13.current, 'optionalAccess', _14 => _14.click, 'call', _15 => _15()]),
                        className: "absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orbit-cyan flex items-center justify-center text-white shadow-lg"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}

                        , React.createElement(Edit3, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 640}} )
                      )
                    )
                  ) : (
                    React.createElement('button', {
                      onClick: () => _optionalChain([photoInputRef, 'access', _16 => _16.current, 'optionalAccess', _17 => _17.click, 'call', _18 => _18()]),
                      className: "w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-orbit-border flex items-center justify-center text-muted-foreground hover:border-orbit-cyan/40 hover:text-orbit-cyan transition-colors"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 644}}

                      , React.createElement(ImageIcon, { className: "w-6 h-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 648}} )
                    )
                  )
                  , React.createElement('p', { className: "text-[10px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}, "Tap to upload a photo"

                  )
                )
              )

              , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 657}}
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 658}}
                  , React.createElement('label', { className: "text-xs text-muted-foreground flex items-center gap-1.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 659}}
                    , React.createElement(Edit3, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 660}} ), " Name"
                  )
                  , React.createElement(Input, {
                    value: editName,
                    onChange: (e) => setEditName(e.target.value),
                    className: "bg-white/5 border-orbit-border text-foreground h-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 662}}
                  )
                )
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 668}}
                  , React.createElement('label', { className: "text-xs text-muted-foreground flex items-center gap-1.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 669}}
                    , React.createElement(Mail, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 670}} ), " Email"
                  )
                  , React.createElement(Input, {
                    value: editEmail,
                    onChange: (e) => setEditEmail(e.target.value),
                    type: "email",
                    className: "bg-white/5 border-orbit-border text-foreground h-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 672}}
                  )
                )
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 679}}
                  , React.createElement('label', { className: "text-xs text-muted-foreground flex items-center gap-1.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 680}}
                    , React.createElement(Phone, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 681}} ), " Phone"
                  )
                  , React.createElement(Input, {
                    value: editPhone,
                    onChange: (e) => setEditPhone(e.target.value),
                    type: "tel",
                    className: "bg-white/5 border-orbit-border text-foreground h-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 683}}
                  )
                )
              )

              , React.createElement('div', { className: "flex gap-3 pt-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 692}}
                , React.createElement(Button, {
                  onClick: handleCancel,
                  variant: "outline",
                  className: "flex-1 border-orbit-border text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 693}}
, "Cancel"

                )
                , React.createElement(Button, {
                  onClick: handleSave,
                  disabled: !editName.trim() || !editEmail.trim(),
                  className: "flex-1 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 700}}

                  , React.createElement(Check, { className: "w-4 h-4 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 705}} ), " Save"
                )
              )
            )
          )
        )
      )

      /* Menu Items */
      , React.createElement('div', { className: "orbit-card rounded-xl overflow-hidden mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 714}}
        , menuItems.map((item, i) => (
          React.createElement('div', { key: i, __self: this, __source: {fileName: _jsxFileName, lineNumber: 716}}
            , React.createElement('button', { className: "w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.03] transition-colors text-left"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 717}}
              , React.createElement('span', { className: "text-orbit-cyan", __self: this, __source: {fileName: _jsxFileName, lineNumber: 718}}, item.icon)
              , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 719}}
                , React.createElement('div', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}
                  , item.label
                )
                , React.createElement('div', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 723}}
                  , item.desc
                )
              )
              , React.createElement(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 727}} )
            )
            , i < menuItems.length - 1 && (
              React.createElement(Separator, { className: "bg-orbit-border/30", __self: this, __source: {fileName: _jsxFileName, lineNumber: 730}} )
            )
          )
        ))
      )

      /* Logout */
      , React.createElement(Button, {
        onClick: logout,
        variant: "outline",
        className: "w-full border-red-500/20 text-red-400 hover:bg-red-500/5 hover:border-red-500/30 h-10 text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 737}}

        , React.createElement(LogOut, { className: "w-3.5 h-3.5 mr-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 742}} ), "Log Out"

      )
    )
  );
}