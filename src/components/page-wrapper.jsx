"use client";
import React from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "@/components/site-content";

export function PageWrapper({ title, titleKey, children, className }) {
  const { content } = useSiteContent()
  const heading = titleKey ? content[titleKey] || title : title
  return (
    <div className={`min-h-screen pt-24 pb-12 container max-w-screen-xl px-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="border-b border-border/50 pb-6 mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {heading}
          </h1>
          <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
        </div>

        {children}
      </motion.div>
    </div>
  );
}
