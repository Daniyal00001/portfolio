"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-lg"
      >
        <div className="relative">
          <h1 className="text-[150px] font-black font-display leading-none text-charcoal-blue/5 dark:text-verdigris/10 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold font-display text-charcoal-blue dark:text-verdigris bg-background px-4">
              Page Not Found
            </span>
          </div>
        </div>

        <p className="text-xl text-muted-foreground">
          Whoops! It seems you've ventured into the void.
          <br />
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="pt-4">
          <Button asChild size="lg" className="bg-burnt-peach hover:bg-burnt-peach/90 text-white font-bold">
            <Link href="/">
              <MoveLeft className="mr-2 h-4 w-4" /> Return Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
