"use client";

/**
 * 🔵 CLIENT FRONTEND | FeaturesSection
 * 
 * "The Orbit Edge" 6-card feature grid showcasing key platform
 * capabilities: 60-min delivery, privacy, 4K quality, Brand DNA, etc.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { motion } from "framer-motion";
import { Star, Camera, Shield, Sparkles, Users, Lock, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function FeaturesSection() {
  const features = [
    { icon: <Timer className="w-5 h-5" />, title: "60-Min Delivery", description: "Professional edits faster than anyone in the market." },
    { icon: <Shield className="w-5 h-5" />, title: "Privacy Shield", description: "Auto-wipe of local footage after cloud sync verification." },
    { icon: <Camera className="w-5 h-5" />, title: "4K Quality", description: "Raw footage captured on flagship devices, edited on desktop software." },
    { icon: <Sparkles className="w-5 h-5" />, title: "Brand DNA", description: "Logo, font matching & direct editor chat for the Pro tier." },
    { icon: <Users className="w-5 h-5" />, title: "Human Editors", description: "Not AI — real professionals using Premiere Pro & DaVinci." },
    { icon: <Lock className="w-5 h-5" />, title: "Payment Gate", description: "Hard stop: partners only dispatched after payment success." },
  ];

  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8 sm:mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            The Orbit Edge
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Fluidity & <span className="text-gradient-orbit">Precision</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}>
              <div className="orbit-card rounded-xl p-4 sm:p-5 hover:border-orbit-cyan/20 transition-all duration-300 group h-full">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center text-orbit-cyan shrink-0 group-hover:from-orbit-cyan/20 group-hover:to-orbit-purple/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
