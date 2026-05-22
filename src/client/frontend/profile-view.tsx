"use client";

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
  Clock,
  Star,
  Settings,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Shield,
  HelpCircle,
  Download,
  AlertTriangle,
  ImageIcon,
  UserCircle,
  Palette,
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

type EditAvatarMode = "color" | "avatar" | "photo";

export function ProfileView() {
  const { user, setUser, logout, bookings, reviews, cancelBooking } =
    useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editAvatarMode, setEditAvatarMode] = useState<EditAvatarMode>(
    user.avatarType === "photo"
      ? "photo"
      : user.avatarType === "avatar"
      ? "avatar"
      : "color"
  );
  const [editAvatar, setEditAvatar] = useState(
    AVATAR_COLORS.indexOf(user.avatar || "") >= 0
      ? AVATAR_COLORS.indexOf(user.avatar || "")
      : 0
  );
  const [editAvatarPreset, setEditAvatarPreset] = useState<string | null>(
    AVATAR_PRESETS.find((p) => p.emoji === user.avatarEmoji)?.id ?? null
  );
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(
    user.avatarPhotoUrl
  );
  const photoInputRef = useRef<HTMLInputElement>(null);

  const avatarGradient = user.avatar || "from-orbit-cyan to-orbit-purple";
  const initials = getInitials(user.name);

  // Render avatar based on type
  const renderProfileAvatar = (size: string, textSize: string) => {
    if (user.avatarType === "photo" && user.avatarPhotoUrl) {
      return (
        <div className={`${size} rounded-full overflow-hidden shadow-xl`}>
          <img
            src={user.avatarPhotoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    if (user.avatarType === "avatar" && user.avatarImage) {
      return (
        <div className={`${size} rounded-full overflow-hidden shadow-xl ring-2 ring-white/10`}>
          <img
            src={user.avatarImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    if (user.avatarType === "avatar" && user.avatarEmoji) {
      return (
        <div
          className={`${size} rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 backdrop-blur-sm flex items-center justify-center ${textSize} shadow-xl`}
        >
          {user.avatarEmoji}
        </div>
      );
    }
    return (
      <div
        className={`${size} rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center ${textSize} font-black text-white shadow-xl`}
      >
        {initials}
      </div>
    );
  };

  // Render edit-mode avatar preview
  const renderEditAvatarPreview = () => {
    if (editAvatarMode === "photo" && editPhotoPreview) {
      return (
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl">
          <img
            src={editPhotoPreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    if (editAvatarMode === "avatar" && editAvatarPreset) {
      const preset = AVATAR_PRESETS.find((p) => p.id === editAvatarPreset);
      if (preset) {
        return (
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl ring-1 ring-white/10">
            <img src={preset.image} alt={preset.label} className="w-full h-full object-cover" />
          </div>
        );
      }
    }
    return (
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORS[editAvatar]} flex items-center justify-center text-xl font-black text-white shadow-xl`}
      >
        {editName ? editName[0].toUpperCase() : "?"}
      </div>
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setEditPhotoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const completedBookings = bookings.filter(
    (b) => b.status === "DELIVERED"
  ).length;
  const activeBookings = bookings.filter(
    (b) => !["DELIVERED", "CANCELLED"].includes(b.status)
  ).length;

  const handleSave = useCallback(() => {
    const updates: Record<string, unknown> = {
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
      updates.avatarEmoji = preset?.emoji ?? null;
      updates.avatarPhotoUrl = null;
      updates.avatar = preset?.gradient ?? null;
      updates.avatarImage = preset?.image ?? null;
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
    const idx = AVATAR_COLORS.indexOf(user.avatar || "");
    setEditAvatar(idx >= 0 ? idx : 0);
    setEditAvatarMode(
      user.avatarType === "photo"
        ? "photo"
        : user.avatarType === "avatar"
        ? "avatar"
        : "color"
    );
    setEditAvatarPreset(
      AVATAR_PRESETS.find((p) => p.emoji === user.avatarEmoji)?.id ?? null
    );
    setEditPhotoPreview(user.avatarPhotoUrl);
    setIsEditing(false);
  }, [user.name, user.email, user.phone, user.avatar, user.avatarType, user.avatarEmoji, user.avatarPhotoUrl]);

  const handleCancelBooking = useCallback(
    (bookingId: string) => {
      if (confirm("Are you sure you want to cancel this booking?")) {
        cancelBooking(bookingId, "CLIENT");
        toast.success("Booking cancelled successfully.");
      }
    },
    [cancelBooking]
  );

  const menuItems = [
    {
      icon: <Shield className="w-4 h-4" />,
      label: "Privacy & Security",
      desc: "Manage data and permissions",
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: "App Settings",
      desc: "Notifications, language, theme",
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: "Help & Support",
      desc: "FAQs, contact, report",
    },
  ];

  // Delivered bookings for download history
  const deliveredBookings = bookings.filter((b) => b.status === "DELIVERED");

  return (
    <div className="pb-4">
      {/* Profile Header */}
      <div className="orbit-card rounded-2xl p-6 sm:p-8 mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {renderProfileAvatar(
              "w-24 h-24 sm:w-28 sm:h-28",
              "text-3xl sm:text-4xl"
            )}
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0A2860]" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-black text-foreground">
              {user.name || "Orbit User"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user.email || "No email set"}
            </p>
            {user.phone && (
              <p className="text-sm text-muted-foreground/70 mt-0.5">
                {user.phone}
              </p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <Badge
                variant="outline"
                className="border-orbit-cyan/30 text-orbit-cyan text-[10px]"
              >
                <Film className="w-3 h-3 mr-1" /> Client
              </Badge>
              {user.location && (
                <Badge
                  variant="outline"
                  className="border-orbit-border text-muted-foreground text-[10px]"
                >
                  <MapPin className="w-3 h-3 mr-1" /> {user.location}
                </Badge>
              )}
            </div>
          </div>

          {/* Edit button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-orbit-border text-muted-foreground hover:text-foreground hover:border-orbit-cyan/30"
          >
            {isEditing ? (
              <X className="w-4 h-4 mr-1" />
            ) : (
              <Edit3 className="w-4 h-4 mr-1" />
            )}
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <motion.div
          className="orbit-card rounded-xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Film className="w-5 h-5 text-orbit-cyan mx-auto mb-1" />
          <div className="text-xl font-black text-foreground">
            {bookings.length}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Total
          </div>
        </motion.div>
        <motion.div
          className="orbit-card rounded-xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-xl font-black text-foreground">
            {activeBookings}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Active
          </div>
        </motion.div>
        <motion.div
          className="orbit-card rounded-xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Star className="w-5 h-5 text-orbit-purple mx-auto mb-1" />
          <div className="text-xl font-black text-foreground">
            {completedBookings}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Done
          </div>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="orbit-card rounded-2xl p-6 space-y-4 mb-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Edit Profile
              </h3>

              {/* Avatar preview */}
              <div className="flex items-center justify-center gap-4 mb-2">
                {renderEditAvatarPreview()}
              </div>

              {/* Avatar mode tabs */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <button
                  onClick={() => setEditAvatarMode("color")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    editAvatarMode === "color"
                      ? "bg-orbit-cyan/20 text-orbit-cyan"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  <Palette className="w-3 h-3" /> Color
                </button>
                <button
                  onClick={() => setEditAvatarMode("avatar")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    editAvatarMode === "avatar"
                      ? "bg-orbit-cyan/20 text-orbit-cyan"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  <UserCircle className="w-3 h-3" /> Avatar
                </button>
                <button
                  onClick={() => setEditAvatarMode("photo")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    editAvatarMode === "photo"
                      ? "bg-orbit-cyan/20 text-orbit-cyan"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  <ImageIcon className="w-3 h-3" /> Photo
                </button>
              </div>

              {/* Color picker */}
              {editAvatarMode === "color" && (
                <div className="flex items-center justify-center gap-3 mb-2">
                  {AVATAR_COLORS.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setEditAvatar(i)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} transition-all duration-200 ${
                        editAvatar === i
                          ? "scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-[#0A2860]"
                          : "opacity-50 hover:opacity-100 hover:scale-110"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Avatar preset picker */}
              {editAvatarMode === "avatar" && (
                <div className="flex items-center justify-center gap-3 mb-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setEditAvatarPreset(preset.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                        editAvatarPreset === preset.id
                          ? "bg-orbit-cyan/10 ring-1 ring-orbit-cyan/40"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/10"
                      >
                        <img src={preset.image} alt={preset.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] text-muted-foreground">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Photo upload */}
              {editAvatarMode === "photo" && (
                <div className="flex flex-col items-center gap-3 mb-2">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                  {editPhotoPreview ? (
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-xl">
                        <img
                          src={editPhotoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-orbit-cyan flex items-center justify-center text-white shadow-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-orbit-border flex items-center justify-center text-muted-foreground hover:border-orbit-cyan/40 hover:text-orbit-cyan transition-colors"
                    >
                      <ImageIcon className="w-6 h-6" />
                    </button>
                  )}
                  <p className="text-[10px] text-muted-foreground/50">
                    Tap to upload a photo
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Edit3 className="w-3 h-3" /> Name
                  </label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-white/5 border-orbit-border text-foreground h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <Input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    type="email"
                    className="bg-white/5 border-orbit-border text-foreground h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Phone
                  </label>
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    type="tel"
                    className="bg-white/5 border-orbit-border text-foreground h-10"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 border-orbit-border text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!editName.trim() || !editEmail.trim()}
                  className="flex-1 bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90"
                >
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Items */}
      <div className="orbit-card rounded-2xl overflow-hidden mb-4">
        {menuItems.map((item, i) => (
          <div key={i}>
            <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors text-left">
              <span className="text-orbit-cyan">{item.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground/60">
                  {item.desc}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
            </button>
            {i < menuItems.length - 1 && (
              <Separator className="bg-orbit-border/30" />
            )}
          </div>
        ))}
      </div>

      {/* Recent Bookings — Stats + Collapsible */}
      {bookings.length > 0 && (
        <div className="mb-4">
          <div
            className="orbit-card rounded-2xl p-5 cursor-pointer hover:border-orbit-cyan/20 transition-all duration-300"
            onClick={() => setBookingsOpen(!bookingsOpen)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Film className="w-4 h-4 text-orbit-cyan" />
                Recent Bookings
              </h3>
              <div className="flex items-center gap-1.5 text-muted-foreground hover:text-orbit-cyan transition-colors">
                {bookingsOpen ? "Hide" : "View"}
                {bookingsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: <Film className="w-4 h-4 text-orbit-cyan" />,
                  value: bookings.length,
                  label: "Total",
                },
                {
                  icon: <Clock className="w-4 h-4 text-yellow-400" />,
                  value: activeBookings,
                  label: "Active",
                },
                {
                  icon: <Star className="w-4 h-4 text-orbit-purple" />,
                  value: completedBookings,
                  label: "Done",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center justify-center mb-1.5">
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {bookingsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,191,255,0.15) transparent" }}>
                  {bookings
                    .slice()
                    .reverse()
                    .map((b) => {
                      const isActive = !["DELIVERED", "CANCELLED"].includes(b.status);
                      const canCancel = isActive && ["PAID", "PARTNER_DISPATCHED", "EN_ROUTE"].includes(b.status);
                      return (
                        <div
                          key={b.id}
                          className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2.5"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {b.packageName}
                            </div>
                            <div className="text-xs text-muted-foreground/60">
                              {new Date(b.bookingDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}{" "}
                              · {b.timeSlot}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                b.status === "DELIVERED"
                                  ? "border-green-400/30 text-green-400"
                                  : b.status === "CANCELLED"
                                  ? "border-red-400/30 text-red-400"
                                  : "border-orbit-cyan/30 text-orbit-cyan"
                              }`}
                            >
                              {b.status}
                            </Badge>
                            {canCancel && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleCancelBooking(b.id); }}
                                className="h-6 px-2 text-[10px] border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Video History — Re-download within 30 days */}
      {deliveredBookings.length > 0 && (
        <div className="orbit-card rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Download className="w-4 h-4 text-orbit-cyan" />
              Video History
            </h3>
            <span className="text-[9px] text-muted-foreground/40 font-medium">Auto-deletes after 30 days</span>
          </div>
          <p className="text-[10px] text-muted-foreground/50 mb-4">Re-download your edited videos within 30 days of delivery</p>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {deliveredBookings.map((b) => {
              const withinWindow = isWithinRedownloadWindow(b.deliveredAt);
              const daysLeft = getRedownloadDaysRemaining(b.deliveredAt);

              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {b.packageName}
                    </div>
                    <div className="text-xs text-muted-foreground/60">
                      Delivered
                      {b.deliveredAt &&
                        ` ${new Date(b.deliveredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {b.downloaded && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-green-400/30 text-green-400"
                      >
                        Downloaded
                      </Badge>
                    )}
                    {withinWindow ? (
                      !b.downloaded ? (
                        <>
                          <span className="text-[10px] text-muted-foreground">
                            {daysLeft} days left
                          </span>
                          <Button
                            size="sm"
                            className="h-6 px-2 text-[10px] bg-gradient-to-r from-orbit-cyan to-orbit-purple text-white hover:opacity-90"
                          >
                            <Download className="w-3 h-3 mr-1" /> Download
                          </Button>
                        </>
                      ) : (
                        <span className="text-[10px] text-green-400/60">
                          {daysLeft} days left
                        </span>
                      )
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-muted-foreground/30" />
                        <Badge
                          variant="outline"
                          className="text-[10px] border-muted-foreground/20 text-muted-foreground/50"
                        >
                          Auto-deleted
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Reviews */}
      {reviews.length > 0 && (
        <div className="orbit-card rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            My Reviews
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {reviews
              .slice(-5)
              .reverse()
              .map((r) => {
                const booking = bookings.find((b) => b.id === r.bookingId);
                return (
                  <div key={r.bookingId} className="bg-white/[0.03] rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">
                        {booking?.packageName || "Session"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        #{r.bookingId.slice(-6)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">
                          Partner
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= r.partnerRating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">
                          Editor
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= r.editorRating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted-foreground/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {r.feedback && (
                      <p className="text-[11px] text-muted-foreground/80 italic">
                        &ldquo;{r.feedback}&rdquo;
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Logout */}
      <Button
        onClick={logout}
        variant="outline"
        className="w-full border-red-500/20 text-red-400 hover:bg-red-500/5 hover:border-red-500/30 py-5"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </div>
  );
}
