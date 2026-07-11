const _jsxFileName = "src\\partner\\frontend\\partner-profile-view.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

/**
 * 🟣 PARTNER FRONTEND | PartnerProfileView
 *
 * Partner profile page with avatar-only editing (verified fields locked),
 * verification status badge, wallet balance, bank account section,
 * online/offline toggle, and logout.
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {


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
  Lock,
  Building2,
  Wallet,


  Plus,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { AVATAR_COLORS, AVATAR_PRESETS, formatCurrency } from "@/lib/constants";
import { getInitials } from "@/lib/utils";




/** Mask account number: show only last 4 digits */
function maskAccountNumber(accNum) {
  if (accNum.length <= 4) return accNum;
  return "•••••" + accNum.slice(-4);
}

export function PartnerProfileView() {
  const { user, setUser, toggleOnline, logout, bookings, linkBankAccount, withdrawFromWallet, setCurrentView } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);

  // Avatar editing state
  const [editAvatar, setEditAvatar] = useState(
    (AVATAR_COLORS ).indexOf(user.avatar || "") >= 0
      ? (AVATAR_COLORS ).indexOf(user.avatar || "")
      : 0
  );
  const [editAvatarMode, setEditAvatarMode] = useState(
    user.avatarType === "photo" ? "photo" : user.avatarType === "avatar" ? "avatar" : "color"
  );
  const [editAvatarPreset, setEditAvatarPreset] = useState(
    AVATAR_PRESETS.findIndex((p) => p.emoji === user.avatarEmoji) >= 0
      ? AVATAR_PRESETS.findIndex((p) => p.emoji === user.avatarEmoji)
      : 0
  );
  const [editPhotoPreview, setEditPhotoPreview] = useState(
    user.avatarPhotoUrl || null
  );
  const fileInputRef = useRef(null);

  // Bank linking state
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    pan: "",
  });
  const [bankLinkLoading, setBankLinkLoading] = useState(false);
  const [bankLinkError, setBankLinkError] = useState(null);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);

  const avatarGradient = user.avatar || "from-orbit-purple to-orbit-cyan";
  const initials = getInitials(user.name);

  const wallet = user.wallet;
  const bankAccount = user.bankAccount;

  const renderProfileAvatar = (size, textSize) => {
    if (user.avatarType === "photo" && user.avatarPhotoUrl) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden shadow-xl`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
          , React.createElement('img', { src: user.avatarPhotoUrl, alt: "Profile", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}} )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarImage) {
      return (
        React.createElement('div', { className: `${size} rounded-full overflow-hidden shadow-xl ring-2 ring-white/10`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
          , React.createElement('img', { src: user.avatarImage, alt: "Profile", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}} )
        )
      );
    }
    if (user.avatarType === "avatar" && user.avatarEmoji) {
      return (
        React.createElement('div', { className: `${size} rounded-full bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 backdrop-blur-sm flex items-center justify-center ${textSize} shadow-xl`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
          , user.avatarEmoji
        )
      );
    }
    return (
      React.createElement('div', { className: `${size} rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center ${textSize} font-black text-white shadow-xl`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
        , initials
      )
    );
  };

  const renderEditPreviewAvatar = () => {
    if (editAvatarMode === "photo" && editPhotoPreview) {
      return (
        React.createElement('div', { className: "w-16 h-16 rounded-full overflow-hidden shadow-xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
          , React.createElement('img', { src: editPhotoPreview, alt: "Preview", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}} )
        )
      );
    }
    if (editAvatarMode === "avatar") {
      const preset = AVATAR_PRESETS[editAvatarPreset];
      return (
        React.createElement('div', { className: "w-16 h-16 rounded-full overflow-hidden shadow-xl ring-1 ring-white/10"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
          , React.createElement('img', { src: preset.image, alt: preset.label, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}} )
        )
      );
    }
    return (
      React.createElement('div', { className: `w-16 h-16 rounded-full bg-gradient-to-br ${AVATAR_COLORS[editAvatar]} flex items-center justify-center text-xl font-black text-white shadow-xl`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
        , user.name ? user.name[0].toUpperCase() : "?"
      )
    );
  };

  const completedBookings = bookings.filter((b) => b.status === "DELIVERED").length;
  const activeBookings = bookings.filter((b) => !["DELIVERED", "CANCELLED"].includes(b.status)).length;

  const handleSave = useCallback(() => {
    const updates = {};

    // Only save avatar changes — name/email/phone are locked
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

    setUser(updates );
    setIsEditing(false);
  }, [editAvatar, editAvatarMode, editAvatarPreset, editPhotoPreview, setUser]);

  const handleCancel = useCallback(() => {
    const idx = (AVATAR_COLORS ).indexOf(user.avatar || "");
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
  }, [user.avatar, user.avatarType, user.avatarEmoji, user.avatarPhotoUrl]);

  const handlePhotoUpload = useCallback((e) => {
    const file = _optionalChain([e, 'access', _ => _.target, 'access', _2 => _2.files, 'optionalAccess', _3 => _3[0]]);
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditPhotoPreview(reader.result );
    };
    reader.readAsDataURL(file);
  }, []);

  const resetBankForm = useCallback(() => {
    setBankForm({ accountHolderName: "", accountNumber: "", confirmAccountNumber: "", ifscCode: "", pan: "" });
    setBankLinkError(null);
    setBankLinkLoading(false);
  }, []);

  const bankFormValid =
    bankForm.accountHolderName.trim().length > 2 &&
    bankForm.accountNumber.trim().length >= 9 &&
    bankForm.accountNumber.trim() === bankForm.confirmAccountNumber.trim() &&
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankForm.ifscCode.trim().toUpperCase()) &&
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(bankForm.pan.trim().toUpperCase());

  const handleLinkBank = useCallback(async () => {
    if (!bankFormValid) return;
    setBankLinkLoading(true);
    setBankLinkError(null);
    try {
      const res = await fetch("/api/partners/link-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountHolderName: bankForm.accountHolderName.trim(),
          accountNumber: bankForm.accountNumber.trim(),
          ifsc: bankForm.ifscCode.trim().toUpperCase(),
          pan: bankForm.pan.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBankLinkError(data.error || "Verification failed. Please check your details.");
        return;
      }
      // Sync verified bank info back from API response into local store
      const { bankAccount: apiBankAccount } = data ;
      if (apiBankAccount) {
        linkBankAccount({
          id: `bank-${Date.now()}`,
          bankName: apiBankAccount.bankName,
          accountNumber: "•••• " + bankForm.accountNumber.slice(-4),
          ifscCode: apiBankAccount.ifscCode,
          accountHolderName: apiBankAccount.accountHolderName,
          isVerified: true,
          linkedAt: new Date().toISOString(),
        });
      }
      toast.success("Bank account linked and verified via Penny Drop ✓");
      setShowBankForm(false);
      resetBankForm();
    } catch (e2) {
      setBankLinkError("Network error. Please check your connection and retry.");
    } finally {
      setBankLinkLoading(false);
    }
  }, [bankForm, bankFormValid, linkBankAccount, resetBankForm]);

  const handleWithdraw = useCallback(() => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > wallet.balance) return;
    withdrawFromWallet(amount);
    setWithdrawAmount("");
    setShowWithdrawInput(false);
  }, [withdrawAmount, wallet.balance, withdrawFromWallet]);

  const menuItems = [
    { icon: React.createElement(Shield, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}} ), label: "Privacy Shield", desc: "Client data protection", action: () => {} },
    { icon: React.createElement(Settings, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}} ), label: "App Settings", desc: "Notifications, sync preferences", action: () => setCurrentView("partner-settings") },
    { icon: React.createElement(HelpCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}} ), label: "Help & Support", desc: "Guides, contact, report", action: () => {} },
  ];

  return (
    React.createElement('div', { className: "pb-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
      /* Profile Header - Compact */
      , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
          , React.createElement('div', { className: "relative shrink-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}
            , renderProfileAvatar("w-14 h-14 sm:w-16 sm:h-16", "text-lg sm:text-xl")
            , React.createElement('div', { className: `absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#000000] ${user.isOnline ? "bg-green-400" : "bg-gray-400"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}} )
          )

          , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
            , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
              , React.createElement('h2', { className: "text-lg font-black text-foreground truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}, user.name || "Orbit Partner")
              /* Verification Status Badge */
              , user.isVerified ? (
                React.createElement(Badge, { className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[8px] px-1.5 py-0 gap-0.5"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}
                  , React.createElement(Shield, { className: "w-2.5 h-2.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}} ), " Verified"
                )
              ) : (
                React.createElement(Badge, { className: "bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[8px] px-1.5 py-0 gap-0.5"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}
                  , React.createElement(Clock, { className: "w-2.5 h-2.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}} ), " Pending"
                )
              )
            )
            , React.createElement('p', { className: "text-[11px] text-muted-foreground truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}, user.email || "No email set")
            , user.phone && (
              React.createElement('p', { className: "text-[10px] text-muted-foreground/70 truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}, user.phone)
            )
            , React.createElement('div', { className: "flex items-center gap-1.5 mt-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
              , React.createElement(Badge, { variant: "outline", className: "border-orbit-purple/30 text-orbit-purple text-[8px] px-1.5 py-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
                , React.createElement(Camera, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}} ), " Partner"
              )
              /* Online/Offline Toggle */
              , React.createElement('button', {
                onClick: () => toggleOnline(),
                className: "flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.08] border border-orbit-border/30 hover:bg-white/10 transition-all duration-200"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}

                , React.createElement('div', { className: `w-1.5 h-1.5 rounded-full transition-colors duration-200 ${user.isOnline ? "bg-green-400" : "bg-gray-400"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}} )
                , React.createElement('span', { className: `text-[9px] font-medium transition-colors duration-200 ${user.isOnline ? "text-green-400" : "text-gray-400"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}
                  , user.isOnline ? "Online" : "Offline"
                )
              )
            )
          )

          , React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: () => setIsEditing(!isEditing),
            className: "border-orbit-border text-muted-foreground hover:text-foreground hover:border-orbit-purple/30 h-8 text-[10px] shrink-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}

            , isEditing ? React.createElement(X, { className: "w-3 h-3 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}} ) : React.createElement(Edit3, { className: "w-3 h-3 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}} )
            , isEditing ? "Close" : "Edit"
          )
        )

        /* Wallet Balance Row */
        , React.createElement('div', { className: "mt-3 p-2.5 rounded-lg bg-gradient-to-r from-orbit-purple/10 to-orbit-cyan/10 border border-white/[0.06]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}
          , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
            , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}
              , React.createElement('div', { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-orbit-purple/20 to-orbit-cyan/20 flex items-center justify-center"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
                , React.createElement(Wallet, { className: "w-4 h-4 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}} )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}
                , React.createElement('p', { className: "text-[9px] text-muted-foreground uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}, "Wallet Balance" )
                , React.createElement('p', { className: "text-base font-black text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}, formatCurrency(wallet.balance))
              )
            )
            , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}
              , wallet.pendingClearance > 0 && (
                React.createElement('p', { className: "text-[9px] text-amber-400/80" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}, formatCurrency(wallet.pendingClearance), " pending" )
              )
              , wallet.totalWithdrawn > 0 && (
                React.createElement('p', { className: "text-[8px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 354}}, "Withdrawn: " , formatCurrency(wallet.totalWithdrawn))
              )
            )
          )
          , wallet.balance > 0 && (
            React.createElement('div', { className: "mt-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}
              , !showWithdrawInput ? (
                React.createElement(Button, {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setShowWithdrawInput(true),
                  className: "w-full h-7 text-[10px] border-orbit-cyan/30 text-orbit-cyan hover:bg-orbit-cyan/10"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}

                  , React.createElement(IndianRupee, { className: "w-3 h-3 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 367}} ), " Withdraw Funds"
                )
              ) : (
                React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}
                  , React.createElement(Input, {
                    type: "number",
                    placeholder: "Amount",
                    value: withdrawAmount,
                    onChange: (e) => setWithdrawAmount(e.target.value),
                    className: "flex-1 h-7 text-xs bg-white/5 border-orbit-border"    ,
                    max: wallet.balance,
                    min: 1, __self: this, __source: {fileName: _jsxFileName, lineNumber: 371}}
                  )
                  , React.createElement(Button, {
                    size: "sm",
                    onClick: handleWithdraw,
                    disabled: !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > wallet.balance,
                    className: "h-7 text-[10px] bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}

                    , React.createElement(Check, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}} )
                  )
                  , React.createElement(Button, {
                    variant: "outline",
                    size: "sm",
                    onClick: () => { setShowWithdrawInput(false); setWithdrawAmount(""); },
                    className: "h-7 text-[10px] border-orbit-border text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 388}}

                    , React.createElement(X, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}} )
                  )
                )
              )
            )
          )
        )
      )

      /* Stats - Compact */
      , React.createElement('div', { className: "grid grid-cols-3 gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}
        , React.createElement(motion.div, { className: "orbit-card rounded-xl p-2.5 text-center"   , whileHover: { scale: 1.02 }, transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
          , React.createElement(Camera, { className: "w-4 h-4 text-orbit-purple mx-auto mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}} )
          , React.createElement('div', { className: "text-lg font-black text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}, bookings.length)
          , React.createElement('div', { className: "text-[8px] text-muted-foreground uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}, "Shoots")
        )
        , React.createElement(motion.div, { className: "orbit-card rounded-xl p-2.5 text-center"   , whileHover: { scale: 1.02 }, transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}
          , React.createElement(Clock, { className: "w-4 h-4 text-yellow-400 mx-auto mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}} )
          , React.createElement('div', { className: "text-lg font-black text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}, activeBookings)
          , React.createElement('div', { className: "text-[8px] text-muted-foreground uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}, "Active")
        )
        , React.createElement(motion.div, { className: "orbit-card rounded-xl p-2.5 text-center"   , whileHover: { scale: 1.02 }, transition: { duration: 0.2 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}
          , React.createElement(Star, { className: "w-4 h-4 text-orbit-cyan mx-auto mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}} )
          , React.createElement('div', { className: "text-lg font-black text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 417}}, completedBookings)
          , React.createElement('div', { className: "text-[8px] text-muted-foreground uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, "Done")
        )
      )

      /* Bank Account Section */
      , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}
        , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
          , React.createElement(Building2, { className: "w-4 h-4 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}} )
          , React.createElement('h3', { className: "text-sm font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 426}}, "Bank Account" )
          , bankAccount && (
            React.createElement(Badge, { className: `text-[8px] px-1.5 py-0 gap-0.5 ${bankAccount.isVerified ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border border-amber-500/30"}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}}
              , React.createElement(Shield, { className: "w-2.5 h-2.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}} ), " " , bankAccount.isVerified ? "Verified" : "Pending"
            )
          )
        )

        , bankAccount ? (
          React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}
            , React.createElement('div', { className: "flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}
                , React.createElement('p', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}, bankAccount.bankName || "Linked Bank")
                , React.createElement('p', { className: "text-[10px] text-muted-foreground font-mono tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}, maskAccountNumber(bankAccount.accountNumber))
                , React.createElement('p', { className: "text-[9px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}, "IFSC: " , bankAccount.ifscCode)
              )
              , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 442}}
                , React.createElement('p', { className: "text-[9px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 443}}, bankAccount.accountHolderName)
                , React.createElement('p', { className: "text-[8px] text-muted-foreground/40" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 444}}, "Linked " , new Date(bankAccount.linkedAt).toLocaleDateString())
              )
            )
          )
        ) : (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 449}}
            , !showBankForm ? (
              React.createElement('button', {
                onClick: () => setShowBankForm(true),
                className: "w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-orbit-purple/30 hover:border-orbit-purple/50 hover:bg-orbit-purple/5 transition-all duration-200"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}

                , React.createElement(Plus, { className: "w-4 h-4 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 455}} )
                , React.createElement('span', { className: "text-xs text-orbit-purple font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 456}}, "Link Bank Account"  )
              )
            ) : (
              React.createElement('div', { className: "space-y-2.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 459}}
                /* Security notice */
                , React.createElement('div', { className: "flex items-start gap-2 p-2 rounded-lg bg-orbit-purple/5 border border-orbit-purple/20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 461}}
                  , React.createElement(Shield, { className: "w-3.5 h-3.5 text-orbit-purple shrink-0 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 462}} )
                  , React.createElement('p', { className: "text-[9px] text-muted-foreground/80" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 463}}, "Details are verified via Penny Drop. Account number is encrypted with AES-256 before storage."             )
                )

                /* Account Holder Name */
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 467}}
                  , React.createElement('label', { className: "text-[10px] text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 468}}, "Account Holder Name"  )
                  , React.createElement(Input, {
                    value: bankForm.accountHolderName,
                    onChange: (e) => setBankForm({ ...bankForm, accountHolderName: e.target.value }),
                    placeholder: "As per bank records"   ,
                    className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs"    ,
                    disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 469}}
                  )
                )

                /* Account Number */
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 479}}
                  , React.createElement('label', { className: "text-[10px] text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 480}}, "Account Number" )
                  , React.createElement(Input, {
                    type: "password",
                    value: bankForm.accountNumber,
                    onChange: (e) => setBankForm({ ...bankForm, accountNumber: e.target.value }),
                    placeholder: "Enter account number"  ,
                    className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs"    ,
                    disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 481}}
                  )
                )

                /* Confirm Account Number */
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 492}}
                  , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 493}}, "Confirm Account Number"

                    , bankForm.confirmAccountNumber && bankForm.accountNumber !== bankForm.confirmAccountNumber && (
                      React.createElement('span', { className: "text-red-400 text-[9px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}, "— Numbers don't match"   )
                    )
                  )
                  , React.createElement(Input, {
                    value: bankForm.confirmAccountNumber,
                    onChange: (e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value }),
                    placeholder: "Re-enter account number"  ,
                    className: `bg-white/5 border-orbit-border text-foreground h-9 text-xs ${
                      bankForm.confirmAccountNumber && bankForm.accountNumber !== bankForm.confirmAccountNumber
                        ? "border-red-500/50"
                        : ""
                    }`,
                    disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 499}}
                  )
                )

                /* IFSC Code */
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 513}}
                  , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}, "IFSC Code"

                    , bankForm.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankForm.ifscCode.toUpperCase()) && (
                      React.createElement('span', { className: "text-red-400 text-[9px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 517}}, "— Invalid format"  )
                    )
                  )
                  , React.createElement(Input, {
                    value: bankForm.ifscCode,
                    onChange: (e) => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() }),
                    placeholder: "e.g. HDFC0001234" ,
                    className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs font-mono tracking-wider"      ,
                    disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 520}}
                  )
                )

                /* PAN Number */
                , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 530}}
                  , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}, "PAN Number"

                    , bankForm.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(bankForm.pan.toUpperCase()) && (
                      React.createElement('span', { className: "text-red-400 text-[9px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 534}}, "— Invalid format (e.g. ABCDE1234F)"    )
                    )
                  )
                  , React.createElement(Input, {
                    value: bankForm.pan,
                    onChange: (e) => setBankForm({ ...bankForm, pan: e.target.value.toUpperCase() }),
                    placeholder: "e.g. ABCDE1234F" ,
                    className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs font-mono tracking-wider"      ,
                    disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}
                  )
                )

                /* API Error */
                , bankLinkError && (
                  React.createElement('div', { className: "flex items-start gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 548}}
                    , React.createElement(X, { className: "w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 549}} )
                    , React.createElement('p', { className: "text-[10px] text-red-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 550}}, bankLinkError)
                  )
                )

                , React.createElement('div', { className: "flex gap-2 pt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 554}}
                  , React.createElement(Button, {
                    variant: "outline",
                    size: "sm",
                    onClick: () => { setShowBankForm(false); resetBankForm(); },
                    disabled: bankLinkLoading,
                    className: "flex-1 border-orbit-border text-muted-foreground h-8 text-[10px]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 555}}
, "Cancel"

                  )
                  , React.createElement(Button, {
                    size: "sm",
                    onClick: handleLinkBank,
                    disabled: !bankFormValid || bankLinkLoading,
                    className: "flex-1 bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90 h-8 text-[10px] disabled:opacity-50"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 564}}

                    , bankLinkLoading ? (
                      React.createElement(React.Fragment, null
                        , React.createElement(motion.span, {
                          animate: { rotate: 360 },
                          transition: { duration: 1, repeat: Infinity, ease: "linear" },
                          className: "inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full mr-1.5"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 572}}
                        ), "Verifying..."

                      )
                    ) : (
                      React.createElement(React.Fragment, null, React.createElement(Building2, { className: "w-3 h-3 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 580}} ), " Verify & Link"   )
                    )
                  )
                )
              )
            )
          )
        )
      )

      /* Edit Profile — Avatar Only */
      , React.createElement(AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 591}}
        , isEditing && (
          React.createElement(motion.div, {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.3 },
            className: "overflow-hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 593}}

            , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 space-y-2.5 mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 600}}
              , React.createElement('h3', { className: "text-sm font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 601}}, "Edit Avatar" )

              /* Locked Fields Notice */
              , React.createElement('div', { className: "flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 604}}
                , React.createElement(Lock, { className: "w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 605}} )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 606}}
                  , React.createElement('p', { className: "text-[10px] font-medium text-amber-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 607}}, "Contact Support to Change"   )
                  , React.createElement('p', { className: "text-[9px] text-amber-400/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 608}}, "Verified fields are locked for security"     )
                )
              )

              /* Locked Profile Fields (Read-Only) */
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 613}}
                , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 614}}
                  , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 615}}
                    , React.createElement(Lock, { className: "w-2.5 h-2.5 text-amber-400/60"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 616}} ), " Name"
                  )
                  , React.createElement('div', { className: "flex items-center gap-2 h-9 px-3 rounded-md bg-white/[0.02] border border-white/[0.06] text-muted-foreground text-xs"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 618}}
                    , React.createElement('span', { className: "flex-1 truncate" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 619}}, user.name || "—")
                    , React.createElement(Lock, { className: "w-3 h-3 text-muted-foreground/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 620}} )
                  )
                )
                , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 623}}
                  , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 624}}
                    , React.createElement(Lock, { className: "w-2.5 h-2.5 text-amber-400/60"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 625}} ), " Email"
                  )
                  , React.createElement('div', { className: "flex items-center gap-2 h-9 px-3 rounded-md bg-white/[0.02] border border-white/[0.06] text-muted-foreground text-xs"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 627}}
                    , React.createElement('span', { className: "flex-1 truncate" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 628}}, user.email || "—")
                    , React.createElement(Lock, { className: "w-3 h-3 text-muted-foreground/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}} )
                  )
                )
                , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 632}}
                  , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 633}}
                    , React.createElement(Lock, { className: "w-2.5 h-2.5 text-amber-400/60"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 634}} ), " Phone"
                  )
                  , React.createElement('div', { className: "flex items-center gap-2 h-9 px-3 rounded-md bg-white/[0.02] border border-white/[0.06] text-muted-foreground text-xs"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 636}}
                    , React.createElement('span', { className: "flex-1 truncate" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 637}}, user.phone || "—")
                    , React.createElement(Lock, { className: "w-3 h-3 text-muted-foreground/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 638}} )
                  )
                )
              )

              , React.createElement(Separator, { className: "bg-white/[0.06]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}} )

              /* Avatar Preview */
              , React.createElement('div', { className: "flex items-center justify-center mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 646}}
                , renderEditPreviewAvatar()
              )

              /* Avatar Mode Tabs */
              , React.createElement('div', { className: "flex items-center justify-center gap-1 p-1 bg-white/[0.04] rounded-xl"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}
                , (["color", "avatar", "photo"] ).map((mode) => (
                  React.createElement('button', {
                    key: mode,
                    onClick: () => setEditAvatarMode(mode),
                    className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      editAvatarMode === mode
                        ? "bg-white/[0.1] text-foreground"
                        : "text-muted-foreground/60 hover:text-muted-foreground"
                    }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}

                    , mode === "color" ? "Color" : mode === "avatar" ? "Avatar" : "Photo"
                  )
                ))
              )

              /* Color Picker */
              , editAvatarMode === "color" && (
                React.createElement('div', { className: "flex items-center justify-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 669}}
                  , AVATAR_COLORS.map((color, i) => (
                    React.createElement('button', {
                      key: i,
                      onClick: () => setEditAvatar(i),
                      className: `w-7 h-7 rounded-full bg-gradient-to-br ${color} transition-all duration-200 ${
                        editAvatar === i ? "scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-[#000000]" : "opacity-50 hover:opacity-100 hover:scale-110"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 671}}
                    )
                  ))
                )
              )

              /* Avatar Presets */
              , editAvatarMode === "avatar" && (
                React.createElement('div', { className: "grid grid-cols-4 gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 684}}
                  , AVATAR_PRESETS.map((preset, i) => (
                    React.createElement('button', {
                      key: preset.id,
                      onClick: () => setEditAvatarPreset(i),
                      className: `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                        editAvatarPreset === i
                          ? "bg-white/[0.1] ring-1 ring-orbit-purple/40"
                          : "bg-white/[0.03] hover:bg-white/[0.06]"
                      }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 686}}

                      , React.createElement('div', { className: "w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/10"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 695}}
                        , React.createElement('img', { src: preset.image, alt: preset.label, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 696}} )
                      )
                      , React.createElement('span', { className: "text-[9px] text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 698}}, preset.label)
                    )
                  ))
                )
              )

              /* Photo Upload */
              , editAvatarMode === "photo" && (
                React.createElement('div', { className: "flex flex-col items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 706}}
                  , editPhotoPreview ? (
                    React.createElement('div', { className: "relative group" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 708}}
                      , React.createElement('div', { className: "w-20 h-20 rounded-full overflow-hidden border-2 border-orbit-purple/30"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 709}}
                        , React.createElement('img', { src: editPhotoPreview, alt: "Preview", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 710}} )
                      )
                      , React.createElement('button', {
                        onClick: () => setEditPhotoPreview(null),
                        className: "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors"             , __self: this, __source: {fileName: _jsxFileName, lineNumber: 712}}

                        , React.createElement(X, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 716}} )
                      )
                    )
                  ) : null
                  , React.createElement('input', {
                    ref: fileInputRef,
                    type: "file",
                    accept: "image/*",
                    onChange: handlePhotoUpload,
                    className: "hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 720}}
                  )
                  , React.createElement(Button, {
                    variant: "outline",
                    size: "sm",
                    onClick: () => _optionalChain([fileInputRef, 'access', _4 => _4.current, 'optionalAccess', _5 => _5.click, 'call', _6 => _6()]),
                    className: "border-orbit-border/50 text-muted-foreground hover:text-foreground hover:border-orbit-purple/30"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 727}}

                    , React.createElement(Upload, { className: "w-3.5 h-3.5 mr-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 733}} )
                    , editPhotoPreview ? "Change Photo" : "Upload Photo"
                  )
                  , React.createElement('p', { className: "text-[10px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 736}}, "Choose a photo from your gallery"     )
                )
              )

              , React.createElement('div', { className: "flex gap-3 pt-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 740}}
                , React.createElement(Button, { onClick: handleCancel, variant: "outline", className: "flex-1 border-orbit-border text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 741}}, "Cancel")
                , React.createElement(Button, { onClick: handleSave, className: "flex-1 bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 742}}
                  , React.createElement(Check, { className: "w-4 h-4 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 743}} ), " Save Avatar"
                )
              )
            )
          )
        )
      )

      /* Menu Items - Compact */
      , React.createElement('div', { className: "orbit-card rounded-xl overflow-hidden mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 752}}
        , menuItems.map((item, i) => (
          React.createElement('div', { key: i, __self: this, __source: {fileName: _jsxFileName, lineNumber: 754}}
            , React.createElement('button', { onClick: item.action, className: "w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.03] transition-colors text-left"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 755}}
              , React.createElement('span', { className: "text-orbit-purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 756}}, item.icon)
              , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 757}}
                , React.createElement('div', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 758}}, item.label)
                , React.createElement('div', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 759}}, item.desc)
              )
              , React.createElement(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 761}} )
            )
            , i < menuItems.length - 1 && React.createElement(Separator, { className: "bg-orbit-border/30", __self: this, __source: {fileName: _jsxFileName, lineNumber: 763}} )
          )
        ))
      )

      , React.createElement(Button, { onClick: logout, variant: "outline", className: "w-full border-red-500/20 text-red-400 hover:bg-red-500/5 hover:border-red-500/30 h-10 text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 768}}
        , React.createElement(LogOut, { className: "w-3.5 h-3.5 mr-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 769}} ), " Log Out"
      )
    )
  );
}