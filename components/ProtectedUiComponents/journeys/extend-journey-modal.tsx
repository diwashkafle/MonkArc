"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { completeJourney, extendJourney } from "@/lib/server-actions/journey-actions";
import { Loader2 } from "lucide-react";
import { useState } from "react";


interface ExtendJourneyProp {
  username:string | null | undefined;
  journeyTitle: string;
  totalCheckIns: number;
  targetCheckIns: number;
  journeyId:string;
}

export function ExtendJourney({
  username,
  journeyId,
  journeyTitle,
  totalCheckIns,
  targetCheckIns,
}: ExtendJourneyProp) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isExtendJourney, setIsExtendJourney] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ Derive state directly from URL - no useState needed!
  const isOpen = searchParams.get("should-complete") === "true";

  const handleClose = async () => {
    setIsSubmitting(true);
    await completeJourney(journeyId);
    router.replace(window.location.pathname);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
  
      const formData = new FormData(e.currentTarget);  
      try {
        await extendJourney(journeyId,formData);
      } catch (error) {
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          throw error;
        }
        console.error("Real error:", error);
        alert(
          error instanceof Error ? error.message : "Failed to create journey"
        );
        setIsSubmitting(false);
      }
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
          <DialogTitle className="text-center text-3xl">
            {!isExtendJourney ? "Target Complete!" :" Extend your journey"}
          </DialogTitle>
          <div className="text-center text-base pt-4">
             {!isExtendJourney ? <div className="flex items-center flex-col">
              <h1>Congratulations {username}</h1>
               <h1>Extended target reached for <strong>{journeyTitle}</strong>!</h1>
              </div>: <div>
                <h1>Add new target days to extend your journey. You can complete it anytime you want when you are in extended state.</h1>
                </div>}
          </div>
        </DialogHeader>

        {!isExtendJourney ? <section>
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
        <div className="flex flex-col gap-1 my-4">
          <p className="flex gap-1 text-xs items-center text-gray-500">
            <IoMdInformationCircleOutline/> <span>If your project is yet to finish, you can extended your journey.</span>
          </p>
           <p className="flex gap-1 text-xs items-center text-gray-500">
            <IoMdInformationCircleOutline/> <span>If your project is finished, you can complete your journey.</span>
          </p>
          
        </div>

        <div className="flex  justify-end gap-2">
          <Button disabled={isSubmitting} onClick={()=>setIsExtendJourney(true)} className="cursor-pointer">
            Extend journey
          </Button>
          <Button variant={'outline'} disabled={isSubmitting} onClick={handleClose} className="cursor-pointer">
            {isSubmitting?<p className="flex gap-1 items-center"><Loader2 className="animate-spin"/> Completing</p>:<p>Complete journey</p>}
          </Button>
        </div>
        </section> : <section>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
           <div className="flex flex-col gap-1">
             <label>Add additional days</label>
            <input
            name="daysToAdd"
            className="border-gray-300 border p-1 rounded-sm outline-none"
            type="number"
            min={1}
            max={30}
            required
            />
            <p className="text-xs text-gray-500">Additional days should be between 1 to 30</p>
           </div>
           <div className="flex justify-end gap-5">
            <Button onClick={()=>setIsExtendJourney(false)} variant="outline" className="cursor-pointer" type="submit">
            Cancel
           </Button>
           <Button disabled={isSubmitting} className="cursor-pointer" type="submit">
           {
            isSubmitting ? <div className="flex gap-1"> <Loader2 className="animate-spin"/> Submitting</div> : 
            <h1> Submit journey extension.</h1>
           }
           </Button>
           </div>
          </form>
          </section>}
      </DialogContent>
    </Dialog>
  );
}
