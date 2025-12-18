"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ArcCelebrationProps {
  journeyTitle: string;
  totalCheckIns: number;
  targetCheckIns: number;
}

export function ArcCelebration({
  journeyTitle,
  totalCheckIns,
  targetCheckIns,
}: ArcCelebrationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Derive state directly from URL - no useState needed!
  const isOpen = searchParams.get("became-arc") === "true";

  // Only use useEffect for SIDE EFFECTS (confetti)
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti - this is a valid side effect
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#10b981", "#34d399", "#6ee7b7"],
        });

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#10b981", "#34d399", "#6ee7b7"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]); // Only fire when isOpen changes

  const handleClose = () => {
    // Remove query param
    router.replace(window.location.pathname);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mx-auto text-8xl mb-4 animate-bounce">🎋</div>
          <DialogTitle className="text-center text-3xl">
            Journey Complete! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-4">
            Congratulations! Your journey <strong>{`"${journeyTitle}"`}</strong>{" "}
            has transformed from a Seed into an Arc!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-emerald-50 p-6 text-center">
            <div className="text-sm font-medium text-emerald-900">
              Achievement Unlocked
            </div>
            <div className="mt-2 text-4xl font-bold text-emerald-600">
              {totalCheckIns} / {targetCheckIns} Check-ins
            </div>
            <div className="mt-2 text-sm text-emerald-700">
              {` You've reached your target and proven your commitment!`}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleClose} className="w-full">
            Continue Journey 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
