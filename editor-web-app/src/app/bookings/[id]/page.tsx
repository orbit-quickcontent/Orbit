"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileVideo, CheckCircle, UploadCloud, Link as LinkIcon, Info } from "lucide-react";

export default function BookingStudio({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: bookingId } = use(params);

  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [reelUrl, setReelUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("orbit_editor_id");
    if (!savedId) {
      router.push("/");
      return;
    }

    // Fetch booking details
    fetch(`http://localhost:3000/api/editor/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.booking) {
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);

    const storageKey = `reels/${bookingId}_${Date.now()}_${file.name}`;
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    // Call S3 Mock upload route
    fetch(`http://localhost:3000/api/upload/mock-s3?key=${encodeURIComponent(storageKey)}`, {
      method: "PUT",
      body: file,
    })
      .then((res) => {
        clearInterval(progressInterval);
        if (res.ok) {
          setUploadProgress(100);
          setTimeout(() => {
            const finalUrl = `http://localhost:3000/upload/${storageKey}`;
            setReelUrl(finalUrl);
            setIsUploading(false);
          }, 500);
        } else {
          throw new Error("Upload failed");
        }
      })
      .catch((err) => {
        clearInterval(progressInterval);
        console.error(err);
        alert("Upload failed. Try again.");
        setIsUploading(false);
        setUploadProgress(0);
      });
  };

  const handleDeliver = () => {
    if (!reelUrl) return;

    fetch("http://localhost:3000/api/editor/deliver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: booking.id,
        reelUrl: reelUrl,
        editorId: localStorage.getItem("orbit_editor_id") || "editor_1",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.push("/dashboard");
        } else {
          alert("Delivery failed: " + data.error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Network error delivering reel.");
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-orbit-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm font-semibold">Opening project files...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400 font-semibold">Project not found or access denied.</p>
        <button onClick={() => router.push("/dashboard")} className="px-4 py-2 bg-gray-900 border border-orbit-border rounded-xl">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-orbit-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 bg-gray-900 border border-orbit-border hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg md:text-xl font-bold">Assembly Studio</h1>
              <span className="text-xs px-2 py-0.5 bg-orbit-cyan/15 text-orbit-cyan border border-orbit-cyan/30 rounded-full font-bold uppercase">
                {booking.status}
              </span>
            </div>
            <p className="text-xs text-gray-500">Project ID: {booking.id}</p>
          </div>
        </div>
      </header>

      {/* Workspace Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Briefing & Footage */}
        <div className="lg:col-span-2 space-y-8">
          {/* Brief & Requirements */}
          <div className="orbit-card p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Info size={18} className="text-orbit-cyan" />
              <span>Project Briefing & Brand DNA</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#050505] p-4 rounded-xl border border-orbit-border">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Package Tier
                </p>
                <p className="text-sm font-semibold">{booking.packageName}</p>
              </div>

              <div className="bg-[#050505] p-4 rounded-xl border border-orbit-border">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Target Turnaround
                </p>
                <p className="text-sm font-semibold text-orbit-cyan">
                  {booking.package?.deliveryTime || "60-120 mins"}
                </p>
              </div>
            </div>

            {/* Brand DNA Visual Guidelines */}
            <div className="bg-[#050505] p-5 rounded-xl border border-orbit-border mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">
                Brand Identity Guidelines
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Color Palette</p>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-5 h-5 rounded border border-gray-800"
                      style={{ backgroundColor: booking.client?.brandColor || "#00BFFF" }}
                    />
                    <span className="text-xs font-mono">{booking.client?.brandColor || "Default"}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Typography</p>
                  <span className="text-xs font-semibold">{booking.client?.brandFont || "Geist Sans"}</span>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Brand Assets</p>
                  {booking.client?.brandLogo ? (
                    <a
                      href={booking.client.brandLogo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orbit-cyan hover:underline flex items-center space-x-1"
                    >
                      <LinkIcon size={12} />
                      <span>Download Logo</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-600">None Provided</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
                Client Editing Requirements
              </p>
              <div className="bg-[#050505] p-4 rounded-xl border border-orbit-border text-sm text-gray-300">
                {booking.client?.editorRequirements || "No special instructions provided. Follow standard Orbit cinematic templates."}
              </div>
            </div>
          </div>

          {/* Raw Footage Downloader */}
          <div className="orbit-card p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <FileVideo size={18} className="text-orbit-cyan" />
              <span>Raw Footage ({booking.footageUrls?.length || 0} Files)</span>
            </h2>

            {(!booking.footageUrls || booking.footageUrls.length === 0) ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No raw footage synced yet. Wait for partner upload completion.
              </div>
            ) : (
              <div className="space-y-3">
                {booking.footageUrls.map((url: string, index: number) => {
                  const filename = url.split("/").pop() || `Footage_${index + 1}.mp4`;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[#050505] border border-orbit-border rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <FileVideo size={20} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-semibold truncate max-w-xs md:max-w-md">
                            {filename}
                          </p>
                          <p className="text-xs text-gray-600">Raw Media Asset</p>
                        </div>
                      </div>
                      <a
                        href={url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-gray-900 border border-orbit-border hover:bg-gray-800 rounded-xl transition-colors text-orbit-cyan flex items-center space-x-1 text-xs font-semibold"
                      >
                        <Download size={14} />
                        <span className="hidden md:inline">Download</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reel Upload & Delivery */}
        <div className="space-y-8">
          <div className="orbit-card p-6 rounded-2xl border border-orbit-purple/30">
            <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <UploadCloud size={18} className="text-orbit-purple" />
              <span>Deliver Final Edit</span>
            </h2>

            {/* Drag Drop File Area */}
            {booking.status === "EDITING" ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-orbit-cyan bg-orbit-cyan/5"
                    : "border-orbit-border hover:border-orbit-purple/50 bg-[#050505]"
                } ${isUploading ? "pointer-events-none" : ""}`}
              >
                <input
                  type="file"
                  id="reel-file-upload"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                
                {isUploading ? (
                  <div className="space-y-3">
                    <div className="w-8 h-8 border-4 border-orbit-purple border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-semibold">Uploading video... {uploadProgress}%</p>
                    <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-orbit-purple h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : reelUrl ? (
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Video Ready</p>
                      <p className="text-xs text-gray-500 truncate mt-1">URL: {reelUrl}</p>
                    </div>
                    <label
                      htmlFor="reel-file-upload"
                      className="inline-block text-xs text-orbit-cyan hover:underline cursor-pointer"
                    >
                      Replace File
                    </label>
                  </div>
                ) : (
                  <label htmlFor="reel-file-upload" className="cursor-pointer space-y-3 block">
                    <UploadCloud size={32} className="text-gray-600 mx-auto" />
                    <div>
                      <p className="text-sm font-semibold">Drag & Drop edited video</p>
                      <p className="text-xs text-gray-600 mt-1">or click to browse local files</p>
                    </div>
                  </label>
                )}
              </div>
            ) : (
              <div className="bg-[#050505] border border-orbit-border p-4 rounded-xl space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Reel Delivered</p>
                  <p className="text-xs text-gray-500 truncate mt-1">URL: {reelUrl}</p>
                </div>
                <a
                  href={reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs bg-gray-900 border border-orbit-border hover:bg-gray-800 text-orbit-cyan px-3 py-1.5 rounded-lg"
                >
                  Preview Reel
                </a>
              </div>
            )}

            {/* Deliver Trigger Button */}
            {booking.status === "EDITING" && (
              <button
                onClick={handleDeliver}
                disabled={!reelUrl || isUploading}
                className="w-full bg-gradient-to-r from-orbit-cyan to-orbit-purple text-black font-bold py-3 mt-6 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
              >
                Deliver to Client
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
