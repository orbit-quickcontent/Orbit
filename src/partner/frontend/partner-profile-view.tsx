"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerProfileView
 *
 * Partner profile page with stats, full edit functionality (color/avatar/photo),
 * online/offline toggle, and logout.
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Edit3,
  LogOut,
  Check,
  X,
  Camera,
  Clock,
  Star,
  Settings,
  ChevronRight,
  Shield,
  HelpCircle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { AVATAR_COLORS, AVATAR_PRESETS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

type EditAvatarMode = "color" | "avatar" | "photo";

export function PartnerProfileView() {
  const { user, setUser, logout, bookings } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editAvatar, setEditAvatar] = useState(
    AVATAR_COLORS.indexOf(user.avatar || "") >= 0
      ? AVATAR_COLORS.indexOf(user.avatar || "")
      : 0
  );
  const [editAvatarMode, setEditAvatarMode] = useState<EditAvatarMode>(
    user.avatarType === "photo" ? "photo" : user.avatarType === "avatar" ? "avatar" : "color"
  );
  const [editAvatarPreset, setEditAvatarPreset] = useState(
    AVATAR_PRESETS.findIndex((p) => p.emoji === user.avatarEmoji) >= 0
      ? AVATAR_PRESETS.findIndex((p) => p.emoji === user.avatarEmoji)
      : 0
  );
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(
    user.avatarPhotoUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarGradient = user.avatar || "from-orbit-purple to-orbit-cyan";
  const initials = getInitials(user.name);

  const renderProfileAvatar = (size: string, textSize: string) => {
    if (user.avatarType === "photo" && user.avatarPhotoUrl) {
      return (
        <div className={`${size} rounded-full overflow-hidden shadow-xl`}>
          <img src={user.avatarPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
        </div>
      );
    }
    if (user.avatarType === "avatar" && user.avatarImage) {
      return (
        <div className={`${size} rounded-full overflow-hidden shadow-xl ring-2 ring-white/10`}>
          <img src={user.avatarImage} alt="Profile" className="w-full h-full object-cover" />
        </div>
      );
    }
    if (user.avatarType === "avatar" && user.avatarEmoji) {
      return (
        <div className={`${size} rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 backdrop-blur-sm flex items-center justify-center ${textSize} shadow-xl`}>
          {user.avatarEmoji}
        </div>
      );
    }
    return (
      <div className={`${size} rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center ${textSize} font-black text-white shadow-xl`}>
        {initials}
      </div>
    );
  };

  const renderEditPreviewAvatar = () => {
    if (editAvatarMode === "photo" && editPhotoPreview) {
      return (
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl">
          <img src={editPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
        </div>
      );
    }
    if (editAvatarMode === "avatar") {
      const preset = AVATAR_PRESETS[editAvatarPreset];
      return (
        <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl ring-1 ring-white/10">
          <img src={preset.image} alt={preset.label} className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORS[editAvatar]} flex items-center justify-center text-xl font-black text-white shadow-xl`}>
        {editName ? editName[0].toUpperCase() : "?"}
      </div>
    );
  };

  const completedBookings = bookings.filter((b) => b.status === "DELIVERED").length;
  const activeBookings = bookings.filter((b) => !["DELIVERED", "CANCELLED"].includes(b.status)).length;

  const handleSave = useCallback(() => {
    const updates: Record<string, unknown> = {
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
    };

    if (editAvatarMode === "color") {
      updates.avatarType = "color";
      updates.avatar = AVATAR_COLORS[editAvatar];
      updates.avatarEmoji = null;
      updates.avatarPhotoUrl = null;
      updates.avatarImage = null;
    } else if (editAvatarMode === "avatar") {
      const preset = AVATAR_PRESETS[editAvatarPreset];
      updates.avatarType = "avatar";
      updates.avatar = preset.gradient;
      updates.avatarEmoji = preset.emoji;
      updates.avatarPhotoUrl = null;
      updates.avatarImage = preset.image;
    } else if (editAvatarMode === "photo") {
      updates.avatarType = "photo";
      updates.avatar = null;
      updates.avatarEmoji = null;
      updates.avatarPhotoUrl = editPhotoPreview;
      updates.avatarImage = null;
    }

    setUser(updates as Partial<typeof user>);
    setIsEditing(false);
  }, [editName, editEmail, editPhone, editAvatar, editAvatarMode, editAvatarPreset, editPhotoPreview, setUser]);

  const handleCancel = useCallback(() => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    const idx = AVATAR_COLORS.indexOf(user.avatar || "");
    setEditAvatar(idx >= 0 ? idx : 0);
    setEditAvatarMode(
      user.avatarType === "photo" ? "photo" : user.avatarType === "avatar" ? "avatar" : "color"
    );
    setEditAvatarPreset(
      AVATAR_PRESETS.findIndex((p) => p.emoji === user.avatarEmoji) >= 0
        ? AVATAR_PRESETS.findIndex((p) => p.emoji === user.avatarEmoji)
        : 0
    );
    setEditPhotoPreview(user.avatarPhotoUrl || null);
    setIsEditing(false);
  }, [user.name, user.email, user.phone, user.avatar, user.avatarType, user.avatarEmoji, user.avatarPhotoUrl]);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const menuItems = [
    { icon: <Shield className="w-4 h-4" />, label: "Privacy Shield", desc: "Client data protection" },
    { icon: <Settings className="w-4 h-4" />, label: "App Settings", desc: "Notifications, sync preferences" },
    { icon: <HelpCircle className="w-4 h-4" />, label: "Help & Support", desc: "Guides, contact, report" },
  ];

  return (
    <div className="pb-4">
      {/* Profile Header */}
      <div className="orbit-card rounded-2xl p-6 sm:p-8 mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            {renderProfileAvatar("w-24 h-24 sm:w-28 sm:h-28", "text-3xl sm:text-4xl")}
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#000000] ${user.isOnline ? "bg-green-400" : "bg-gray-400"}`} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-black text-foreground">{user.name || "Orbit Partner"}</h2>
            <p className="text-sm text-muted-foreground mt-1">{user.email || "No email set"}</p>
            {user.phone && (
              <p className="text-sm text-muted-foreground/70 mt-0.5">{user.phone}</p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <Badge variant="outline" className="border-orbit-purple/30 text-orbit-purple text-[10px]">
                <Camera className="w-3 h-3 mr-1" /> Partner
              </Badge>
              {/* Online/Offline Toggle */}
              <button
                onClick={() => setUser({ isOnline: !user.isOnline })}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-orbit-border/30 hover:bg-white/10 transition-all duration-200"
              >
                <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${user.isOnline ? "bg-green-400" : "bg-gray-400"}`} />
                <span className={`text-[10px] font-medium transition-colors duration-200 ${user.isOnline ? "text-green-400" : "text-gray-400"}`}>
                  {user.isOnline ? "Online" : "Offline"}
                </span>
              </button>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-orbit-border text-muted-foreground hover:text-foreground hover:border-orbit-purple/30"
          >
            {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <motion.div className="orbit-card rounded-xl p-4 text-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Camera className="w-5 h-5 text-orbit-purple mx-auto mb-1" />
          <div className="text-xl font-black text-foreground">{bookings.length}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Shoots</div>
        </motion.div>
        <motion.div className="orbit-card rounded-xl p-4 text-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-xl font-black text-foreground">{activeBookings}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Active</div>
        </motion.div>
        <motion.div className="orbit-card rounded-xl p-4 text-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Star className="w-5 h-5 text-orbit-cyan mx-auto mb-1" />
          <div className="text-xl font-black text-foreground">{completedBookings}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Done</div>
        </motion.div>
      </div>

      {/* Edit Profile */}
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
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Edit Profile</h3>

              {/* Avatar Preview */}
              <div className="flex items-center justify-center mb-2">
                {renderEditPreviewAvatar()}
              </div>

              {/* Avatar Mode Tabs */}
              <div className="flex items-center justify-center gap-1 p-1 bg-white/[0.04] rounded-xl">
                {(["color", "avatar", "photo"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setEditAvatarMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      editAvatarMode === mode
                        ? "bg-white/[0.1] text-foreground"
                        : "text-muted-foreground/60 hover:text-muted-foreground"
                    }`}
                  >
                    {mode === "color" ? "Color" : mode === "avatar" ? "Avatar" : "Photo"}
                  </button>
                ))}
              </div>

              {/* Color Picker */}
              {editAvatarMode === "color" && (
                <div className="flex items-center justify-center gap-3">
                  {AVATAR_COLORS.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setEditAvatar(i)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} transition-all duration-200 ${
                        editAvatar === i ? "scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-[#000000]" : "opacity-50 hover:opacity-100 hover:scale-110"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Avatar Presets */}
              {editAvatarMode === "avatar" && (
                <div className="grid grid-cols-4 gap-2">
                  {AVATAR_PRESETS.map((preset, i) => (
                    <button
                      key={preset.id}
                      onClick={() => setEditAvatarPreset(i)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                        editAvatarPreset === i
                          ? "bg-white/[0.1] ring-1 ring-orbit-purple/40"
                          : "bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/10">
                        <img src={preset.image} alt={preset.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] text-muted-foreground">{preset.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Photo Upload */}
              {editAvatarMode === "photo" && (
                <div className="flex flex-col items-center gap-3">
                  {editPhotoPreview ? (
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-orbit-purple/30">
                        <img src={editPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => setEditPhotoPreview(null)}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-orbit-border/50 text-muted-foreground hover:text-foreground hover:border-orbit-purple/30"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    {editPhotoPreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                  <p className="text-[10px] text-muted-foreground/50">Choose a photo from your gallery</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground flex items-center gap-1.5"><Edit3 className="w-3 h-3" /> Name</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-white/5 border-orbit-border text-foreground h-10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</label>
                  <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} type="email" className="bg-white/5 border-orbit-border text-foreground h-10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} type="tel" className="bg-white/5 border-orbit-border text-foreground h-10" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleCancel} variant="outline" className="flex-1 border-orbit-border text-muted-foreground">Cancel</Button>
                <Button onClick={handleSave} disabled={!editName.trim() || !editEmail.trim()} className="flex-1 bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90">
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
              <span className="text-orbit-purple">{item.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground/60">{item.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
            </button>
            {i < menuItems.length - 1 && <Separator className="bg-orbit-border/30" />}
          </div>
        ))}
      </div>

      <Button onClick={logout} variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/5 hover:border-red-500/30 py-5">
        <LogOut className="w-4 h-4 mr-2" /> Log Out
      </Button>
    </div>
  );
}
