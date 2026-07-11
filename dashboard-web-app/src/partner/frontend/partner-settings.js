const _jsxFileName = "src\\partner\\frontend\\partner-settings.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

/**
 * PartnerSettings
 *
 * Full settings page for the partner app. Sections:
 * - Notification Settings
 * - Sync & Upload Settings
 * - Bank Account
 * - Wallet & Withdrawal
 * - Account & Security
 * - About
 *
 * Used by: partner-app.tsx
 * Category: Partner UI
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Wifi,
  Upload,
  MapPin,
  Building2,
  Wallet,
  Shield,
  Info,
  ChevronLeft,
  Check,
  AlertTriangle,
  Clock,
  ArrowDownToLine,
  ExternalLink,
  FileText,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { toast } from "sonner";

export function PartnerSettings() {
  const {
    user,
    updatePartnerSettings,
    linkBankAccount,
    withdrawFromWallet,
    setCurrentView,
  } = useAppStore();

  const settings = user.settings;
  const bankAccount = user.bankAccount;
  const wallet = user.wallet;

  // Bank account form state
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [pan, setPan] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankLinkLoading, setBankLinkLoading] = useState(false);
  const [bankLinkError, setBankLinkError] = useState(null);

  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawInput, setShowWithdrawInput] = useState(false);

  const resetBankForm = () => {
    setBankName("");
    setAccountNumber("");
    setConfirmAccountNumber("");
    setIfscCode("");
    setPan("");
    setAccountHolderName("");
    setBankLinkError(null);
    setBankLinkLoading(false);
  };

  const bankFormValid =
    accountHolderName.trim().length > 2 &&
    accountNumber.trim().length >= 9 &&
    accountNumber.trim() === confirmAccountNumber.trim() &&
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim().toUpperCase()) &&
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());

  const handleLinkBank = async () => {
    if (!bankFormValid) {
      toast.error("Please fill in all bank details correctly");
      return;
    }
    setBankLinkLoading(true);
    setBankLinkError(null);
    try {
      const res = await fetch("/api/partners/link-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountHolderName: accountHolderName.trim(),
          accountNumber: accountNumber.trim(),
          ifsc: ifscCode.trim().toUpperCase(),
          pan: pan.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBankLinkError(data.error || "Verification failed. Check your details.");
        return;
      }
      // Sync verified bank info into store from API response
      const { bankAccount: apiBankAccount } = data ;
      linkBankAccount({
        id: `bank-${Date.now()}`,
        bankName: _optionalChain([apiBankAccount, 'optionalAccess', _ => _.bankName]) || bankName.trim(),
        accountNumber: "•••• " + accountNumber.slice(-4),
        ifscCode: _optionalChain([apiBankAccount, 'optionalAccess', _2 => _2.ifscCode]) || ifscCode.trim().toUpperCase(),
        accountHolderName: _optionalChain([apiBankAccount, 'optionalAccess', _3 => _3.accountHolderName]) || accountHolderName.trim(),
        isVerified: true,
        linkedAt: new Date().toISOString(),
      });
      setShowBankForm(false);
      resetBankForm();
      toast.success("Bank account verified and linked successfully ✓");
    } catch (e2) {
      setBankLinkError("Network error. Please check your connection and retry.");
    } finally {
      setBankLinkLoading(false);
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 500) {
      toast.error("Minimum withdrawal amount is ₹500");
      return;
    }
    if (amount > wallet.balance) {
      toast.error("Insufficient wallet balance");
      return;
    }
    if (!bankAccount) {
      toast.error("Link a bank account first to withdraw");
      return;
    }
    withdrawFromWallet(amount);
    setWithdrawAmount("");
    setShowWithdrawInput(false);
    toast.success(`₹${amount.toLocaleString("en-IN")} withdrawn successfully`);
  };

  const maskAccountNumber = (acc) => {
    if (acc.length <= 4) return acc;
    return "XXXX XXXX " + acc.slice(-4);
  };

  return (
    React.createElement(motion.div, {
      variants: staggerContainer,
      initial: "hidden",
      animate: "show",
      className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}

      /* Header */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
        , React.createElement('div', { className: "flex items-center gap-3 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
          , React.createElement('button', {
            onClick: () => setCurrentView("profile"),
            className: "w-8 h-8 rounded-lg bg-white/[0.06] border border-orbit-border/30 flex items-center justify-center hover:bg-white/[0.1] transition-colors"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}

            , React.createElement(ChevronLeft, { className: "w-4 h-4 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}} )
          )
          , React.createElement('h2', { className: "text-lg font-black text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}, "Settings")
        )
      )

      /* ─── Notification Settings ─── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 border border-orbit-border/30"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
            , React.createElement('div', { className: "w-7 h-7 rounded-lg bg-orbit-purple/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
              , React.createElement(Bell, { className: "w-3.5 h-3.5 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}} )
            )
            , React.createElement('h3', { className: "text-xs font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}, "Notifications"

            )
          )

          , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}
                , React.createElement('p', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}, "All Notifications" )
                , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}, "Enable or disable all alerts"    )
              )
              , React.createElement(Switch, {
                checked: settings.notificationsEnabled,
                onCheckedChange: (checked) =>
                  updatePartnerSettings({
                    notificationsEnabled: checked,
                    newBookingAlerts: checked ? settings.newBookingAlerts : false,
                    paymentAlerts: checked ? settings.paymentAlerts : false,
                  })
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 201}}
              )
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}} )

            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
                , React.createElement('p', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "New Booking Alerts"  )
                , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}, "Get notified when new work arrives"     )
              )
              , React.createElement(Switch, {
                checked: settings.newBookingAlerts,
                disabled: !settings.notificationsEnabled,
                onCheckedChange: (checked) =>
                  updatePartnerSettings({ newBookingAlerts: checked })
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}
              )
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}} )

            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
                , React.createElement('p', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}, "Payment Alerts" )
                , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}, "Get notified on payment updates"    )
              )
              , React.createElement(Switch, {
                checked: settings.paymentAlerts,
                disabled: !settings.notificationsEnabled,
                onCheckedChange: (checked) =>
                  updatePartnerSettings({ paymentAlerts: checked })
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
              )
            )
          )
        )
      )

      /* ─── Sync & Upload Settings ─── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 border border-orbit-border/30"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
            , React.createElement('div', { className: "w-7 h-7 rounded-lg bg-orbit-cyan/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}
              , React.createElement(Upload, { className: "w-3.5 h-3.5 text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}} )
            )
            , React.createElement('h3', { className: "text-xs font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}, "Sync & Upload"

            )
          )

          , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}
                , React.createElement(Wifi, { className: "w-3.5 h-3.5 text-muted-foreground/50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}} )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
                  , React.createElement('p', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}, "Auto Sync on Wi-Fi Only"    )
                  , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}, "Save mobile data"  )
                )
              )
              , React.createElement(Switch, {
                checked: settings.autoSyncOnWifi,
                onCheckedChange: (checked) =>
                  updatePartnerSettings({ autoSyncOnWifi: checked })
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
              )
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}} )

            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
                , React.createElement(Upload, { className: "w-3.5 h-3.5 text-muted-foreground/50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}} )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
                  , React.createElement('p', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}, "High Quality Upload"  )
                  , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                    , settings.highQualityUpload ? (
                        React.createElement('span', { className: "text-amber-400 flex items-center gap-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}
                          , React.createElement(AlertTriangle, { className: "w-2.5 h-2.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}} ), " Uses more data"
                        )
                      ) : (
                        "Larger files, more data"
                      )
                    
                  )
                )
              )
              , React.createElement(Switch, {
                checked: settings.highQualityUpload,
                onCheckedChange: (checked) =>
                  updatePartnerSettings({ highQualityUpload: checked })
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}
              )
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}} )

            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}
              , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}
                , React.createElement(MapPin, { className: "w-3.5 h-3.5 text-muted-foreground/50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}} )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
                  , React.createElement('p', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}, "Location Tracking" )
                  , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}, "For accurate shoot locations"   )
                )
              )
              , React.createElement(Switch, {
                checked: settings.locationTracking,
                onCheckedChange: (checked) =>
                  updatePartnerSettings({ locationTracking: checked })
                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}
              )
            )
          )
        )
      )

      /* ─── Bank Account ─── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 border border-orbit-border/30"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
            , React.createElement('div', { className: "w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}
              , React.createElement(Building2, { className: "w-3.5 h-3.5 text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 330}} )
            )
            , React.createElement('h3', { className: "text-xs font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}}, "Bank Account"

            )
          )

          , bankAccount ? (
            React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}
              , React.createElement('div', { className: "rounded-lg bg-white/[0.04] border border-white/[0.06] p-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
                , React.createElement('div', { className: "flex items-center justify-between mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}
                  , React.createElement('p', { className: "text-xs font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}, bankAccount.bankName)
                  , bankAccount.isVerified ? (
                    React.createElement(Badge, { variant: "outline", className: "border-green-500/30 text-green-400 text-[8px] px-1.5 py-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}
                      , React.createElement(Check, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}} ), " Verified"
                    )
                  ) : (
                    React.createElement(Badge, { variant: "outline", className: "border-amber-400/30 text-amber-400 text-[8px] px-1.5 py-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 347}}
                      , React.createElement(Clock, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}} ), " Pending"
                    )
                  )
                )
                , React.createElement('p', { className: "text-xs text-muted-foreground font-mono tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
                  , maskAccountNumber(bankAccount.accountNumber)
                )
                , React.createElement('p', { className: "text-[10px] text-muted-foreground/60 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}
                  , bankAccount.accountHolderName
                )
              )

              , React.createElement(Button, {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  setShowBankForm(true);
                },
                className: "w-full border-orbit-border/50 text-muted-foreground hover:text-foreground hover:border-orbit-purple/30 h-8 text-[11px]"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}}
, "Change Bank Account"

              )
            )
          ) : (
            React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}
              , !showBankForm ? (
                React.createElement('div', { className: "text-center py-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}
                  , React.createElement('p', { className: "text-[11px] text-muted-foreground/60 mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}, "No bank account linked. Link one to enable withdrawals."

                  )
                  , React.createElement(Button, {
                    onClick: () => setShowBankForm(true),
                    className: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90 h-9 text-xs"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}

                    , React.createElement(Building2, { className: "w-3.5 h-3.5 mr-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}} ), "Link Bank Account"

                  )
                )
              ) : null
            )
          )

          , showBankForm && (
            React.createElement(motion.div, {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              className: "space-y-2.5 mt-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}

              /* Security notice */
              , React.createElement('div', { className: "flex items-start gap-2 p-2 rounded-lg bg-orbit-purple/5 border border-orbit-purple/20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}
                , React.createElement(Shield, { className: "w-3.5 h-3.5 text-orbit-purple shrink-0 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}} )
                , React.createElement('p', { className: "text-[9px] text-muted-foreground/80" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}, "Details are verified via Penny Drop. Account number is encrypted with AES-256 before storage."             )
              )

              /* Account Holder Name */
              , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}
                , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
                  , React.createElement(Lock, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}} ), " Account Holder Name"
                )
                , React.createElement(Input, {
                  value: accountHolderName,
                  onChange: (e) => setAccountHolderName(e.target.value),
                  placeholder: "Name as per bank records"    ,
                  className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs"    ,
                  disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}
                )
              )

              /* Account Number */
              , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}
                , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}
                  , React.createElement(Lock, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}} ), " Account Number"
                )
                , React.createElement(Input, {
                  type: "password",
                  value: accountNumber,
                  onChange: (e) => setAccountNumber(e.target.value),
                  placeholder: "Enter account number"  ,
                  className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs"    ,
                  disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 422}}
                )
              )

              /* Confirm Account Number */
              , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}
                , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}
                  , React.createElement(Lock, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}} ), " Confirm Account Number"
                  , confirmAccountNumber && accountNumber !== confirmAccountNumber && (
                    React.createElement('span', { className: "text-red-400 text-[9px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}, "— Numbers don't match"   )
                  )
                )
                , React.createElement(Input, {
                  value: confirmAccountNumber,
                  onChange: (e) => setConfirmAccountNumber(e.target.value),
                  placeholder: "Re-enter account number"  ,
                  className: `bg-white/5 border-orbit-border text-foreground h-9 text-xs ${confirmAccountNumber && accountNumber !== confirmAccountNumber ? "border-red-500/50" : ""}`,
                  disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}
                )
              )

              /* IFSC Code */
              , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 450}}
                , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}
                  , React.createElement(FileText, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}} ), " IFSC Code"
                  , ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase()) && (
                    React.createElement('span', { className: "text-red-400 text-[9px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 454}}, "— Invalid format"  )
                  )
                )
                , React.createElement(Input, {
                  value: ifscCode,
                  onChange: (e) => setIfscCode(e.target.value.toUpperCase()),
                  placeholder: "e.g. HDFC0001234" ,
                  className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs font-mono tracking-wider"      ,
                  disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 457}}
                )
              )

              /* PAN Number */
              , React.createElement('div', { className: "space-y-1.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 467}}
                , React.createElement('label', { className: "text-[10px] text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 468}}
                  , React.createElement(FileText, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 469}} ), " PAN Number"
                  , pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase()) && (
                    React.createElement('span', { className: "text-red-400 text-[9px]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}, "— Invalid (e.g. ABCDE1234F)"   )
                  )
                )
                , React.createElement(Input, {
                  value: pan,
                  onChange: (e) => setPan(e.target.value.toUpperCase()),
                  placeholder: "e.g. ABCDE1234F" ,
                  className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs font-mono tracking-wider"      ,
                  disabled: bankLinkLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}
                )
              )

              /* API Error Banner */
              , bankLinkError && (
                React.createElement('div', { className: "flex items-start gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}}
                  , React.createElement(AlertTriangle, { className: "w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}} )
                  , React.createElement('p', { className: "text-[10px] text-red-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}, bankLinkError)
                )
              )

              , React.createElement('div', { className: "flex gap-2 pt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 491}}
                , React.createElement(Button, {
                  variant: "outline",
                  onClick: () => {
                    setShowBankForm(false);
                    resetBankForm();
                  },
                  disabled: bankLinkLoading,
                  className: "flex-1 border-orbit-border text-muted-foreground h-8 text-[11px]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 492}}
, "Cancel"

                )
                , React.createElement(Button, {
                  onClick: handleLinkBank,
                  disabled: !bankFormValid || bankLinkLoading,
                  className: "flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90 h-8 text-[11px] disabled:opacity-50"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 503}}

                  , bankLinkLoading ? (
                    React.createElement('span', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 509}}
                      , React.createElement('span', { className: "inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}} ), "Verifying..."

                    )
                  ) : (
                    React.createElement(React.Fragment, null, React.createElement(Check, { className: "w-3 h-3 mr-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}} ), " Verify & Link"   )
                  )
                )
              )
            )
          )
        )
      )

      /* ─── Wallet & Withdrawal ─── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 524}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 border border-orbit-border/30"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 525}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 526}}
            , React.createElement('div', { className: "w-7 h-7 rounded-lg bg-orbit-purple/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 527}}
              , React.createElement(Wallet, { className: "w-3.5 h-3.5 text-orbit-purple"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 528}} )
            )
            , React.createElement('h3', { className: "text-xs font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 530}}, "Wallet & Withdrawal"

            )
          )

          , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 535}}
            /* Balance Row */
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}
                , React.createElement('p', { className: "text-[10px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 539}}, "Available Balance" )
                , React.createElement('p', { className: "text-xl font-black text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 540}}, formatCurrency(wallet.balance))
              )
              , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 542}}
                , React.createElement('p', { className: "text-[10px] text-muted-foreground/60 uppercase tracking-wider"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 543}}, "Pending Clearance" )
                , React.createElement('p', { className: "text-sm font-bold text-amber-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 544}}, formatCurrency(wallet.pendingClearance))
              )
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 548}} )

            /* Withdraw Section */
            , !showWithdrawInput ? (
              React.createElement(Button, {
                onClick: () => {
                  if (!bankAccount) {
                    toast.error("Link a bank account first to withdraw");
                    return;
                  }
                  setShowWithdrawInput(true);
                },
                disabled: wallet.balance < 500,
                className: "w-full bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90 h-9 text-xs"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 552}}

                , React.createElement(ArrowDownToLine, { className: "w-3.5 h-3.5 mr-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 563}} ), "Withdraw Funds"

              )
            ) : (
              React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 567}}
                , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 568}}
                  , React.createElement(Input, {
                    type: "number",
                    value: withdrawAmount,
                    onChange: (e) => setWithdrawAmount(e.target.value),
                    placeholder: "Min ₹500" ,
                    className: "bg-white/5 border-orbit-border text-foreground h-9 text-xs flex-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 569}}
                  )
                  , React.createElement(Button, {
                    onClick: handleWithdraw,
                    disabled: !withdrawAmount || parseFloat(withdrawAmount) < 500,
                    className: "bg-gradient-to-r from-orbit-purple to-orbit-cyan text-white hover:opacity-90 h-9 text-xs px-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 576}}
, "Withdraw"

                  )
                )
                , React.createElement('p', { className: "text-[10px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 584}}, "Minimum withdrawal: ₹500 · Funds will be sent to "
                           , _optionalChain([bankAccount, 'optionalAccess', _4 => _4.bankName]) || "your bank account"
                )
                , React.createElement(Button, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => {
                    setShowWithdrawInput(false);
                    setWithdrawAmount("");
                  },
                  className: "text-muted-foreground/50 text-[10px] h-6 px-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 587}}
, "Cancel"

                )
              )
            )

            , !bankAccount && (
              React.createElement('p', { className: "text-[10px] text-red-400/80 flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 602}}
                , React.createElement(AlertTriangle, { className: "w-2.5 h-2.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 603}} ), "Link a bank account to enable withdrawals"

              )
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 608}} )

            /* Withdrawal History Summary */
            , React.createElement('div', { className: "rounded-lg bg-white/[0.03] border border-white/[0.05] p-2.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 611}}
              , React.createElement('p', { className: "text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-1.5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 612}}, "Withdrawal History"

              )
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 615}}
                , React.createElement('span', { className: "text-[10px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 616}}, "Total Withdrawn" )
                , React.createElement('span', { className: "text-xs font-bold text-green-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 617}}, formatCurrency(wallet.totalWithdrawn))
              )
              , wallet.lastWithdrawnAt && (
                React.createElement('div', { className: "flex items-center justify-between mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 620}}
                  , React.createElement('span', { className: "text-[10px] text-muted-foreground/50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 621}}, "Last Withdrawal" )
                  , React.createElement('span', { className: "text-[10px] text-muted-foreground/70" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 622}}
                    , new Date(wallet.lastWithdrawnAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  )
                )
              )
              , wallet.totalWithdrawn === 0 && (
                React.createElement('p', { className: "text-[10px] text-muted-foreground/40 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 632}}, "No withdrawals yet"  )
              )
            )
          )
        )
      )

      /* ─── Account & Security ─── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 640}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 border border-orbit-border/30"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 641}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 642}}
            , React.createElement('div', { className: "w-7 h-7 rounded-lg bg-amber-400/10 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}}
              , React.createElement(Shield, { className: "w-3.5 h-3.5 text-amber-400"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 644}} )
            )
            , React.createElement('h3', { className: "text-xs font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 646}}, "Account & Security"

            )
          )

          , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 652}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}
                , React.createElement('p', { className: "text-xs font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 654}}, "Verification Status" )
                , React.createElement('p', { className: "text-[10px] text-muted-foreground/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 655}}
                  , user.isVerified ? "Your identity is verified" : "Verification pending or not started"
                )
              )
              , user.isVerified ? (
                React.createElement(Badge, { variant: "outline", className: "border-green-500/30 text-green-400 text-[8px] px-1.5 py-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 660}}
                  , React.createElement(Check, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 661}} ), " Verified"
                )
              ) : (
                React.createElement(Badge, { variant: "outline", className: "border-amber-400/30 text-amber-400 text-[8px] px-1.5 py-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 664}}
                  , React.createElement(Clock, { className: "w-2.5 h-2.5 mr-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 665}} ), " Unverified"
                )
              )
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 670}} )

            , React.createElement(Button, {
              variant: "outline",
              size: "sm",
              className: "w-full border-orbit-border/50 text-muted-foreground hover:text-foreground hover:border-orbit-purple/30 h-8 text-[11px]"      ,
              onClick: () => toast.info("Support chat coming soon!"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 672}}

              , React.createElement(Info, { className: "w-3.5 h-3.5 mr-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}} ), "Contact Support"

            )
          )
        )
      )

      /* ─── About ─── */
      , React.createElement(motion.div, { variants: staggerItem, __self: this, __source: {fileName: _jsxFileName, lineNumber: 686}}
        , React.createElement('div', { className: "orbit-card rounded-xl p-3 sm:p-4 border border-orbit-border/30"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 687}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 688}}
            , React.createElement('div', { className: "w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 689}}
              , React.createElement(Info, { className: "w-3.5 h-3.5 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 690}} )
            )
            , React.createElement('h3', { className: "text-xs font-bold text-foreground uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 692}}, "About"

            )
          )

          , React.createElement('div', { className: "space-y-2.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 697}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 698}}
              , React.createElement('span', { className: "text-xs text-muted-foreground/70" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 699}}, "App Version" )
              , React.createElement('span', { className: "text-xs font-mono text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 700}}, "1.0.0")
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 703}} )

            , React.createElement('button', {
              className: "w-full flex items-center justify-between group"    ,
              onClick: () => toast.info("Terms of Service page coming soon"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 705}}

              , React.createElement('span', { className: "text-xs text-foreground group-hover:text-orbit-cyan transition-colors"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 709}}, "Terms of Service"

              )
              , React.createElement(ExternalLink, { className: "w-3 h-3 text-muted-foreground/30 group-hover:text-orbit-cyan transition-colors"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 712}} )
            )

            , React.createElement(Separator, { className: "bg-orbit-border/20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 715}} )

            , React.createElement('button', {
              className: "w-full flex items-center justify-between group"    ,
              onClick: () => toast.info("Privacy Policy page coming soon"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 717}}

              , React.createElement('span', { className: "text-xs text-foreground group-hover:text-orbit-cyan transition-colors"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 721}}, "Privacy Policy"

              )
              , React.createElement(ExternalLink, { className: "w-3 h-3 text-muted-foreground/30 group-hover:text-orbit-cyan transition-colors"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 724}} )
            )
          )
        )
      )
    )
  );
}