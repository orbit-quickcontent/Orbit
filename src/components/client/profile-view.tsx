"use client";

/**
 * 🔵 CLIENT FRONTEND | ProfileView
 * 
 * User profile page showing avatar, name, email, phone,
 * booking stats, and settings. Instagram-style profile layout.
 * Includes edit mode and logout functionality.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { useState, useCallback } from "react";
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
  Shield,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { AVATAR_COLORS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

export function ProfileView() {
  const { user, setUser, logout, bookings, reviews } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editAvatar, setEditAvatar] = useState(
    AVATAR_COLORS.indexOf(user.avatar || "") >= 0
      ? AVATAR_COLORS.indexOf(user.avatar || "")
      : 0
  );

  const avatarGradient = user.avatar || "from-orbit-cyan to-orbit-purple";
  const initials = getInitials(user.name);

  // Render avatar based on type
  const renderProfileAvatar = (size: string, textSize: string) => {
    if (user.avatarType === "photo" && user.avatarPhotoUrl) {
      return (
        <div className={`${size} rounded-full overflow-hidden shadow-xl`}>
          <img src={user.avatarPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
        </div>
      );
    }
    if (user.avatarType === "emoji" && user.avatarEmoji) {
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

  const completedBookings = bookings.filter((b) => b.status === "DELIVERED").length;
  const activeBookings = bookings.filter((b) => !["DELIVERED", "CANCELLED"].includes(b.status)).length;

  const handleSave = useCallback(() => {
    setUser({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      avatar: AVATAR_COLORS[editAvatar],
      avatarType: "color",
      avatarEmoji: null,
      avatarPhotoUrl: null,
    });
    setIsEditing(false);
  }, [editName, editEmail, editPhone, editAvatar, setUser]);

  const handleCancel = useCallback(() => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    const idx = AVATAR_COLORS.indexOf(user.avatar || "");
    setEditAvatar(idx >= 0 ? idx : 0);
    setIsEditing(false);
  }, [user.name, user.email, user.phone, user.avatar]);

  const menuItems = [
    { icon: <Shield className="w-4 h-4" />, label: "Privacy & Security", desc: "Manage data and permissions" },
    { icon: <Settings className="w-4 h-4" />, label: "App Settings", desc: "Notifications, language, theme" },
    { icon: <HelpCircle className="w-4 h-4" />, label: "Help & Support", desc: "FAQs, contact, report" },
  ];

  return (
    <div className="pb-4">
      {/* Profile Header */}
      <div className="orbit-card rounded-2xl p-6 sm:p-8 mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {renderProfileAvatar("w-24 h-24 sm:w-28 sm:h-28", "text-3xl sm:text-4xl")}
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0A2860]" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-black text-foreground">{user.name || "Orbit User"}</h2>
            <p className="text-sm text-muted-foreground mt-1">{user.email || "No email set"}</p>
            {user.phone && (
              <p className="text-sm text-muted-foreground/70 mt-0.5">{user.phone}</p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <Badge variant="outline" className="border-orbit-cyan/30 text-orbit-cyan text-[10px]">
                <Film className="w-3 h-3 mr-1" /> Client
              </Badge>
              {user.location && (
                <Badge variant="outline" className="border-orbit-border text-muted-foreground text-[10px]">
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
            {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit3 className="w-4 h-4 mr-1" />}
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
          <div className="text-xl font-black text-foreground">{bookings.length}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</div>
        </motion.div>
        <motion.div
          className="orbit-card rounded-xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-xl font-black text-foreground">{activeBookings}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Active</div>
        </motion.div>
        <motion.div
          className="orbit-card rounded-xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Star className="w-5 h-5 text-orbit-purple mx-auto mb-1" />
          <div className="text-xl font-black text-foreground">{completedBookings}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Done</div>
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
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Edit Profile</h3>

              {/* Avatar picker */}
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORS[editAvatar]} flex items-center justify-center text-xl font-black text-white`}>
                  {editName ? editName[0].toUpperCase() : "?"}
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                {AVATAR_COLORS.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setEditAvatar(i)}
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} transition-all duration-200 ${
                      editAvatar === i ? "scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-[#0A2860]" : "opacity-50 hover:opacity-100 hover:scale-110"
                    }`}
                  />
                ))}
              </div>

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
                <div className="text-sm font-medium text-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground/60">{item.desc}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
            </button>
            {i < menuItems.length - 1 && <Separator className="bg-orbit-border/30" />}
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <div className="orbit-card rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Recent Bookings</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {bookings.slice(-3).reverse().map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2.5">
                <div>
                  <div className="text-sm font-medium text-foreground">{b.packageName}</div>
                  <div className="text-xs text-muted-foreground/60">{b.bookingDate}</div>
                </div>
                <Badge variant="outline" className={`text-[10px] ${
                  b.status === "DELIVERED" ? "border-green-400/30 text-green-400" :
                  b.status === "CANCELLED" ? "border-red-400/30 text-red-400" :
                  "border-orbit-cyan/30 text-orbit-cyan"
                }`}>
                  {b.status}
                </Badge>
              </div>
            ))}
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
            {reviews.slice(-5).reverse().map((r) => {
              const booking = bookings.find((b) => b.id === r.bookingId);
              return (
                <div key={r.bookingId} className="bg-white/[0.03] rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-foreground">
                      {booking?.packageName || "Session"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">#{r.bookingId.slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">Partner</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= r.partnerRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">Editor</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= r.editorRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {r.feedback && (
                    <p className="text-[11px] text-muted-foreground/80 italic">&ldquo;{r.feedback}&rdquo;</p>
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
