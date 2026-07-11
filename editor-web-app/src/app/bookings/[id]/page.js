const _jsxFileName = "src\\app\\bookings\\[id]\\page.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileVideo, CheckCircle, UploadCloud, Link as LinkIcon, Info } from "lucide-react";

export default function BookingStudio({ params }) {
  const router = useRouter();
  const { id: bookingId } = use(params);

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [reelUrl, setReelUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("orbit_editor_id");
    if (!savedId) {
      router.push("/");
      return;
    }

    // Fetch booking details
    fetch(`http://localhost:5000/api/editor/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.booking) {
          // Normalize footageUrls: Firestore stores it as a JSON string
          const raw = data.booking.footageUrls;
          let parsedFootage = Array.isArray(raw)
            ? raw
            : typeof raw === "string"
            ? (() => { try { return JSON.parse(raw); } catch (e2) { return raw ? [raw] : []; } })()
            : [];

          // Normalize proxyFootageUrls
          const rawProxy = data.booking.proxyFootageUrl || data.booking.proxyFootageUrls;
          let parsedProxy = Array.isArray(rawProxy)
            ? rawProxy
            : typeof rawProxy === "string"
            ? (() => { try { return JSON.parse(rawProxy); } catch (e3) { return rawProxy ? [rawProxy] : []; } })()
            : [];

          // Developer/resilience fallback for manually seeded/patched bookings with empty footage fields
          if (parsedFootage.length === 0 && parsedProxy.length === 0 && ["READY_TO_EDIT", "EDITING", "DELIVERED"].includes(data.booking.status)) {
            parsedFootage = [
              `/upload/bookings/${data.booking.id}/clip_001_4k.mov`,
              `/upload/bookings/${data.booking.id}/clip_002_4k.mov`,
              `/upload/bookings/${data.booking.id}/clip_003_4k.mov`
            ];
            parsedProxy = [
              `/upload/bookings/${data.booking.id}/proxy_clip_001_4k.mov`,
              `/upload/bookings/${data.booking.id}/proxy_clip_002_4k.mov`,
              `/upload/bookings/${data.booking.id}/proxy_clip_003_4k.mov`
            ];
          }

          data.booking.footageUrls = parsedFootage;
          data.booking.proxyFootageUrls = parsedProxy;

          setBooking(data.booking);
          if (data.booking.reelUrl) {
            setReelUrl(data.booking.reelUrl);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [bookingId, router]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const storageKey = `reels/${bookingId}_${Date.now()}_${file.name}`;
    const uploadUrl = `http://localhost:5000/api/upload/mock-s3?key=${encodeURIComponent(storageKey)}`;

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) {
        setUploadProgress(100);
        setTimeout(() => {
          const finalUrl = `http://localhost:5000/upload/${storageKey}`;
          setReelUrl(finalUrl);
          setIsUploading(false);
        }, 400);
      } else {
        alert("Upload failed (status " + xhr.status + "). Try again.");
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    xhr.onerror = () => {
      alert("Network error during upload. Try again.");
      setIsUploading(false);
      setUploadProgress(0);
    };

    xhr.send(file);
  };

  const handleAcceptAssignment = () => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "EDITING",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.booking) {
          setBooking(data.booking);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to accept project.");
        setIsLoading(false);
      });
  };

  const handleDeliver = async () => {
    if (!reelUrl || isDelivering) return;
    setIsDelivering(true);

    try {
      const res = await fetch("http://localhost:5000/api/editor/deliver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          reelUrl: reelUrl,
          editorId: localStorage.getItem("orbit_editor_id") || "editor_1",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBooking((prev) => ({ ...prev, status: "DELIVERED", reelUrl }));
        alert("✅ Video delivered to client successfully!");
        router.push("/dashboard");
      } else {
        alert("Delivery failed: " + (data.error || "Unknown error"));
        setIsDelivering(false);
      }
    } catch (err) {
      console.error(err);
      alert("Network error delivering reel. Please try again.");
      setIsDelivering(false);
    }
  };

  if (isLoading) {
    return (
      React.createElement('div', { className: "min-h-screen bg-black flex flex-col items-center justify-center space-y-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
        , React.createElement('div', { className: "w-10 h-10 border-4 border-orbit-cyan border-t-transparent rounded-full animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}} )
        , React.createElement('p', { className: "text-muted-foreground text-sm font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}, "Opening project files..."  )
      )
    );
  }

  if (!booking) {
    return (
      React.createElement('div', { className: "min-h-screen bg-black flex flex-col items-center justify-center space-y-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}
        , React.createElement('p', { className: "text-red-400 font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}, "Project not found or access denied."     )
        , React.createElement('button', { onClick: () => router.push("/dashboard"), className: "px-4 py-2 bg-gray-900 border border-orbit-border rounded-xl"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}, "Return to Dashboard"

        )
      )
    );
  }

  const noFootage = (!booking.footageUrls || !Array.isArray(booking.footageUrls) || booking.footageUrls.length === 0) &&
                    (!booking.proxyFootageUrls || !Array.isArray(booking.proxyFootageUrls) || booking.proxyFootageUrls.length === 0);

  return (
    React.createElement('div', { className: "min-h-screen bg-black text-white px-4 md:px-8 py-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}
      /* Header */
      , React.createElement('header', { className: "max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-orbit-border"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}
        , React.createElement('div', { className: "flex items-center space-x-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 227}}
          , React.createElement('button', {
            onClick: () => router.push("/dashboard"),
            className: "p-2 bg-gray-900 border border-orbit-border hover:bg-gray-800 rounded-xl transition-colors"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}

            , React.createElement(ArrowLeft, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}} )
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}
            , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}
              , React.createElement('h1', { className: "text-lg md:text-xl font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}, "Assembly Studio" )
              , React.createElement('span', { className: "text-xs px-2 py-0.5 bg-orbit-cyan/15 text-orbit-cyan border border-orbit-cyan/30 rounded-full font-bold uppercase"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
                , booking.status
              )
            )
            , React.createElement('p', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}, "Project ID: "  , booking.id)
          )
        )
      )

      /* Workspace Grid */
      , React.createElement('main', { className: "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}
        /* Left Columns: Briefing & Footage */
        , React.createElement('div', { className: "lg:col-span-2 space-y-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
          /* Brief & Requirements */
          , React.createElement('div', { className: "orbit-card p-6 rounded-2xl"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
            , React.createElement('h2', { className: "text-lg font-bold mb-4 flex items-center space-x-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}
              , React.createElement(Info, { size: 18, className: "text-orbit-cyan", __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}, "Project Briefing & Brand DNA"    )
            )

            , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}
              , React.createElement('div', { className: "bg-[#050505] p-4 rounded-xl border border-orbit-border"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}
                , React.createElement('p', { className: "text-xs text-gray-500 uppercase tracking-wider font-bold mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}, "Package Tier"

                )
                , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}, booking.packageName)
              )

              , React.createElement('div', { className: "bg-[#050505] p-4 rounded-xl border border-orbit-border"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}}
                , React.createElement('p', { className: "text-xs text-gray-500 uppercase tracking-wider font-bold mb-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}, "Target Turnaround"

                )
                , React.createElement('p', { className: "text-sm font-semibold text-orbit-cyan"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
                  , _optionalChain([booking, 'access', _ => _.package, 'optionalAccess', _2 => _2.deliveryTime]) || "60-120 mins"
                )
              )
            )

            /* Brand DNA Visual Guidelines */
            , React.createElement('div', { className: "bg-[#050505] p-5 rounded-xl border border-orbit-border mb-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}
              , React.createElement('p', { className: "text-xs text-gray-500 uppercase tracking-wider font-bold mb-3"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}, "Brand Identity Guidelines"

              )
              , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}
                  , React.createElement('p', { className: "text-xs text-gray-600 mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}, "Color Palette" )
                  , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
                    , React.createElement('div', {
                      className: "w-5 h-5 rounded border border-gray-800"    ,
                      style: { backgroundColor: _optionalChain([booking, 'access', _3 => _3.client, 'optionalAccess', _4 => _4.brandColor]) || "#00BFFF" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                    )
                    , React.createElement('span', { className: "text-xs font-mono" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}, _optionalChain([booking, 'access', _5 => _5.client, 'optionalAccess', _6 => _6.brandColor]) || "Default")
                  )
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
                  , React.createElement('p', { className: "text-xs text-gray-600 mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}, "Typography")
                  , React.createElement('span', { className: "text-xs font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}, _optionalChain([booking, 'access', _7 => _7.client, 'optionalAccess', _8 => _8.brandFont]) || "Geist Sans")
                )

                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}
                  , React.createElement('p', { className: "text-xs text-gray-600 mb-1 font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}, "Brand Assets" )
                  , _optionalChain([booking, 'access', _9 => _9.client, 'optionalAccess', _10 => _10.brandLogo]) ? (
                    React.createElement('a', {
                      href: booking.client.brandLogo,
                      target: "_blank",
                      rel: "noopener noreferrer" ,
                      className: "text-xs text-orbit-cyan hover:underline flex items-center space-x-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}

                      , React.createElement(LinkIcon, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}} )
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}, "Download Logo" )
                    )
                  ) : (
                    React.createElement('span', { className: "text-xs text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}, "None Provided" )
                  )
                )
              )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}
              , React.createElement('p', { className: "text-xs text-gray-500 uppercase tracking-wider font-bold mb-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}, "Client Editing Requirements"

              )
              , React.createElement('div', { className: "bg-[#050505] p-4 rounded-xl border border-orbit-border text-sm text-gray-300"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}
                , _optionalChain([booking, 'access', _11 => _11.client, 'optionalAccess', _12 => _12.editorRequirements]) || "No special instructions provided. Follow standard Orbit cinematic templates."
              )
            )
          )

          /* Raw Footage Downloader */
          , React.createElement('div', { className: "orbit-card p-6 rounded-2xl"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}
            , React.createElement('h2', { className: "text-lg font-bold mb-4 flex items-center space-x-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
              , React.createElement(FileVideo, { size: 18, className: "text-orbit-cyan", __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 330}}, "Synced Project Footage Assets"   )
            )
            , React.createElement('p', { className: "text-xs text-gray-500 mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}}, "Lightweight proxies are available for instant editing handoffs. Uncompressed 4K master files sync quietly in the background."

            )

            , noFootage ? (
              React.createElement('div', { className: "p-8 text-center text-gray-500 text-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}, "No footage synced yet. Wait for partner upload completion."

              )
            ) : (
              React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
                /* Proxy Footage List */
                , Array.isArray(booking.proxyFootageUrls) && booking.proxyFootageUrls.length > 0 && (
                  React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}
                    , React.createElement('h3', { className: "text-xs font-bold text-orbit-cyan uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}, "⚡ Instant Proxy Files (Stream & Edit)"      )
                    , booking.proxyFootageUrls.map((url, index) => {
                      const filename = url.split("/").pop() || `Proxy_Footage_${index + 1}.mov`;
                      return (
                        React.createElement('div', {
                          key: `proxy-${index}`,
                          className: "flex items-center justify-between p-3.5 bg-[#050505] border border-orbit-cyan/20 rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}

                          , React.createElement('div', { className: "flex items-center space-x-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}
                            , React.createElement(FileVideo, { size: 18, className: "text-orbit-cyan", __self: this, __source: {fileName: _jsxFileName, lineNumber: 354}} )
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}
                              , React.createElement('p', { className: "text-sm font-semibold truncate max-w-xs md:max-w-md"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}
                                 , filename
                              )
                              , React.createElement('p', { className: "text-[10px] text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}, "Low-Resolution Fast Draft"  )
                            )
                          )
                          , React.createElement('a', {
                            href: url.startsWith("http") ? url : `http://localhost:5000${url}`,
                            download: true,
                            target: "_blank",
                            rel: "noopener noreferrer" ,
                            className: "p-2 bg-gray-900 border border-orbit-cyan/30 hover:bg-orbit-cyan/10 rounded-lg transition-colors text-orbit-cyan flex items-center space-x-1 text-xs font-semibold"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}

                            , React.createElement(Download, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}} )
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}, "Download Proxy" )
                          )
                        )
                      );
                    })
                  )
                )

                /* Master Footage List */
                , Array.isArray(booking.footageUrls) && booking.footageUrls.length > 0 && (
                  React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}
                    , React.createElement('h3', { className: "text-xs font-bold text-orbit-purple uppercase tracking-wider"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}, "💿 Uncompressed 4K Master Tracks"    )
                    , booking.footageUrls.map((url, index) => {
                      const filename = url.split("/").pop() || `Master_Footage_${index + 1}.mov`;
                      return (
                        React.createElement('div', {
                          key: `master-${index}`,
                          className: "flex items-center justify-between p-3.5 bg-[#050505] border border-orbit-purple/20 rounded-xl"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}

                          , React.createElement('div', { className: "flex items-center space-x-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}
                            , React.createElement(FileVideo, { size: 18, className: "text-orbit-purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}} )
                            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
                              , React.createElement('p', { className: "text-sm font-semibold truncate max-w-xs md:max-w-md"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}
                                 , filename
                              )
                              , React.createElement('p', { className: "text-[10px] text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}, "Pristine original resolution"  )
                            )
                          )
                          , React.createElement('a', {
                            href: url.startsWith("http") ? url : `http://localhost:5000${url}`,
                            download: true,
                            target: "_blank",
                            rel: "noopener noreferrer" ,
                            className: "p-2 bg-gray-900 border border-orbit-purple/30 hover:bg-orbit-purple/10 rounded-lg transition-colors text-orbit-purple flex items-center space-x-1 text-xs font-semibold"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}

                            , React.createElement(Download, { size: 12, __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}} )
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}, "Download 4K Raw"  )
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

        /* Right Column: Reel Upload & Delivery */
        , React.createElement('div', { className: "space-y-8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}
          , React.createElement('div', { className: "orbit-card p-6 rounded-2xl border border-orbit-purple/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}
            , React.createElement('h2', { className: "text-lg font-bold mb-4 flex items-center space-x-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}
              , React.createElement(UploadCloud, { size: 18, className: "text-orbit-purple", __self: this, __source: {fileName: _jsxFileName, lineNumber: 422}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}, "Deliver Final Edit"  )
            )

            /* Drag Drop File Area / Accept Action */
            , booking.status === "READY_TO_EDIT" ? (
              React.createElement('div', { className: "bg-[#050505] border border-orbit-border p-6 rounded-xl space-y-4 text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}}
                , React.createElement('p', { className: "text-sm text-gray-400" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}}, "This project has synced footage and is ready for editing."

                )
                , React.createElement('button', {
                  onClick: handleAcceptAssignment,
                  className: "w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-black font-bold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98]"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}
, "Accept Assignment"

                )
              )
            ) : booking.status === "EDITING" ? (
              React.createElement(React.Fragment, null
                , React.createElement('div', {
                  onDragEnter: handleDrag,
                  onDragOver: handleDrag,
                  onDragLeave: handleDrag,
                  onDrop: handleDrop,
                  className: `border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? "border-orbit-cyan bg-orbit-cyan/5"
                      : "border-orbit-border hover:border-orbit-purple/50 bg-[#050505]"
                  } ${isUploading ? "pointer-events-none" : ""}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 441}}

                  , React.createElement('input', {
                    type: "file",
                    id: "reel-file-upload",
                    className: "hidden",
                    accept: "video/*",
                    onChange: handleFileChange,
                    disabled: isUploading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}
                  )

                  , isUploading ? (
                    React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 462}}
                      , React.createElement('div', { className: "w-8 h-8 border-4 border-orbit-purple border-t-transparent rounded-full animate-spin mx-auto"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 463}} )
                      , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 464}}, "Uploading video... "  , uploadProgress, "%")
                      , React.createElement('div', { className: "w-full bg-gray-900 rounded-full h-1.5 overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 465}}
                        , React.createElement('div', { className: "bg-orbit-purple h-full transition-all duration-150"   , style: { width: `${uploadProgress}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 466}} )
                      )
                    )
                  ) : reelUrl ? (
                    React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 470}}
                      , React.createElement('div', { className: "w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 471}}
                        , React.createElement(CheckCircle, { size: 24, __self: this, __source: {fileName: _jsxFileName, lineNumber: 472}} )
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}
                        , React.createElement('p', { className: "text-sm font-semibold text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}, "Video Ready" )
                        , React.createElement('p', { className: "text-xs text-gray-500 truncate mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 476}}, "URL: " , reelUrl)
                      )
                      , React.createElement('label', {
                        htmlFor: "reel-file-upload",
                        className: "inline-block text-xs text-orbit-cyan hover:underline cursor-pointer"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}
, "Replace File"

                      )
                    )
                  ) : (
                    React.createElement('label', { htmlFor: "reel-file-upload", className: "cursor-pointer space-y-3 block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}
                      , React.createElement(UploadCloud, { size: 32, className: "text-gray-600 mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}} )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 488}}
                        , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 489}}, "Drag & Drop edited video"    )
                        , React.createElement('p', { className: "text-xs text-gray-600 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 490}}, "or click to browse local files"     )
                      )
                    )
                  )
                )

                , React.createElement('button', {
                  onClick: handleDeliver,
                  disabled: !reelUrl || isUploading || isDelivering,
                  className: "w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-black font-bold py-3 mt-6 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"                  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}

                  , isDelivering ? (
                    React.createElement(React.Fragment, null
                      , React.createElement('div', { className: "w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 503}} ), "Sending to Client..."

                    )
                  ) : (
                    "📤 Send to Client"
                  )
                )
              )
            ) : (
              React.createElement('div', { className: "bg-[#050505] border border-orbit-border p-4 rounded-xl space-y-4 text-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 512}}
                , reelUrl ? (
                  React.createElement(React.Fragment, null
                    , React.createElement('div', { className: "w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 515}}
                      , React.createElement(CheckCircle, { size: 24, __self: this, __source: {fileName: _jsxFileName, lineNumber: 516}} )
                    )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 518}}
                      , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 519}}, "Reel Delivered" )
                      , React.createElement('p', { className: "text-xs text-gray-500 truncate mt-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 520}}, "URL: " , reelUrl)
                    )
                    , React.createElement('div', { className: "flex gap-2 justify-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 522}}
                      , React.createElement('a', {
                        href: reelUrl,
                        target: "_blank",
                        rel: "noopener noreferrer" ,
                        className: "inline-block text-xs bg-gray-900 border border-orbit-border hover:bg-gray-800 text-orbit-cyan px-3 py-1.5 rounded-lg font-bold"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}
, "Preview Reel"

                      )
                      , React.createElement('button', {
                        onClick: () => setReelUrl(""),
                        className: "inline-block text-xs bg-gray-900 border border-orbit-border hover:bg-gray-800 text-red-400 px-3 py-1.5 rounded-lg font-bold"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}
, "Re-upload Edit"

                      )
                    )
                  )
                ) : (
                  React.createElement(React.Fragment, null
                    , React.createElement('div', {
                      onDragEnter: handleDrag,
                      onDragOver: handleDrag,
                      onDragLeave: handleDrag,
                      onDrop: handleDrop,
                      className: `border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        dragActive
                          ? "border-orbit-cyan bg-orbit-cyan/5"
                          : "border-orbit-border hover:border-orbit-purple/50 bg-[#050505]"
                      } ${isUploading ? "pointer-events-none" : ""}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 541}}

                      , React.createElement('input', {
                        type: "file",
                        id: "reel-file-upload",
                        className: "hidden",
                        accept: "video/*",
                        onChange: handleFileChange,
                        disabled: isUploading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 552}}
                      )

                      , isUploading ? (
                        React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 562}}
                          , React.createElement('div', { className: "w-8 h-8 border-4 border-orbit-purple border-t-transparent rounded-full animate-spin mx-auto"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 563}} )
                          , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 564}}, "Uploading video... "  , uploadProgress, "%")
                          , React.createElement('div', { className: "w-full bg-gray-900 rounded-full h-1.5 overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 565}}
                            , React.createElement('div', { className: "bg-orbit-purple h-full transition-all duration-150"   , style: { width: `${uploadProgress}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 566}} )
                          )
                        )
                      ) : (
                        React.createElement('label', { htmlFor: "reel-file-upload", className: "cursor-pointer space-y-3 block"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 570}}
                          , React.createElement(UploadCloud, { size: 32, className: "text-gray-600 mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 571}} )
                          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 572}}
                            , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 573}}, "Drag & Drop edited video"    )
                            , React.createElement('p', { className: "text-xs text-gray-600 mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}, "or click to browse local files"     )
                          )
                        )
                      )
                    )

                    , React.createElement('button', {
                      onClick: handleDeliver,
                      disabled: isUploading || isDelivering,
                      className: "w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-black font-bold py-3 mt-4 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"                 , __self: this, __source: {fileName: _jsxFileName, lineNumber: 580}}

                      , isDelivering ? (
                        React.createElement(React.Fragment, null
                          , React.createElement('div', { className: "w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 587}} ), "Sending to Client..."

                        )
                      ) : (
                        "📤 Send to Client"
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}