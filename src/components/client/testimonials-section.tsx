"use client";

/**
 * 🔵 CLIENT FRONTEND | TestimonialsSection
 * 
 * 3-card testimonial section with star ratings and user quotes
 * from creators who have used the Orbit platform.
 * 
 * Used by: client-app.tsx
 * Category: Client UI
 */

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const testimonials = [
    { name: "Riya Mehta", role: "Fashion Influencer", quote: "Got my reel in 47 minutes. The color grading was insane — way beyond what I expected for the price.", avatar: "RM" },
    { name: "Karan Desai", role: "Startup Founder", quote: "The Brand DNA feature is a game-changer. Our UGC reels now match our corporate identity perfectly.", avatar: "KD" },
    { name: "Ananya Singh", role: "Wedding Planner", quote: "My clients cried happy tears when they saw their cinematic highlight reel the same evening.", avatar: "AS" },
  ];

  return (
    <section className="py-12 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-8 sm:mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Badge variant="outline" className="mb-4 border-orbit-cyan/30 text-orbit-cyan bg-orbit-cyan/5">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            What Creators Say
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Trusted by <span className="text-gradient-orbit">500+</span> Creators
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
              <Card className="orbit-card border-orbit-border hover:border-orbit-cyan/20 transition-all duration-300 h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orbit-cyan/10 to-orbit-purple/10 flex items-center justify-center text-orbit-cyan text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex gap-0.5 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-orbit-cyan fill-orbit-cyan" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
