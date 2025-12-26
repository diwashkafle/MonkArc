"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdArrowRightAlt } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { completeJourney, extendJourney } from "@/lib/server-actions/journey-actions";
import { Loader2, Sprout, Trophy } from "lucide-react";


interface ArcCelebrationProps {
  username:string | null | undefined;
  journeyTitle: string;
  totalCheckIns: number;
  targetCheckIns: number;
  journeyId:string;
}

export function ArcCelebration({
  username,
  journeyId,
  journeyTitle,
  totalCheckIns,
  targetCheckIns,
}: ArcCelebrationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isExtendJourney, setIsExtendJourney] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  // ✅ Derive state directly from URL - no useState needed!


  const isOpen = searchParams.get("became-arc") === "true"  ;

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

  const handleClose = async () => {
    setIsComplete(true);
    try{
 await completeJourney(journeyId);
    router.replace(window.location.pathname);
    setIsComplete(false);
    }catch(error){
      console.log(error)
      setIsComplete(false);
    }
   
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
      <DialogContent className="sm:max-w-[500px] bg-white! text-slate-900! border-slate-200 [&>button]:text-slate-500! [&>button:hover]:text-slate-900!">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl text-slate-900!">
            {!isExtendJourney ? "Target Complete!" :" Extend your journey"}
          </DialogTitle>
          <div className="text-center text-base pt-4 text-slate-600!">
             {!isExtendJourney ? <div className="flex items-center flex-col">
              <h1>Congratulations {username}</h1>
              <div className="flex items-center justify-center gap-2">
               <span className="flex gap-1 items-center"><Sprout size={15}/> seed</span>  <MdArrowRightAlt size={25}/>  <span className="flex gap-1 items-center"><Trophy size={15}/> arc</span>
              </div>
               <h1>Arc phase achieved for <strong>{journeyTitle}</strong></h1>
              </div>: <div>
                <h1>Add new target days to extend your journey. You can complete it anytime you want when you are in extended state.</h1>
                </div>}
          </div>
        </DialogHeader>

        {!isExtendJourney ? <section>
          <div className="space-y-4 py-4">
          <div className="rounded-lg bg-emerald-50 p-6 text-center border border-emerald-200">
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
          <h1 className="flex gap-1 text-xs items-center text-slate-500">
            <IoMdInformationCircleOutline/> <span>If your project is yet to finish, you can extended your journey.</span>
          </h1>
           <h1 className="flex gap-1 text-xs items-center text-slate-500">
            <IoMdInformationCircleOutline/> <span>If your project is finished, you can complete your journey.</span>
          </h1>
          
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={()=>setIsExtendJourney(true)} className="cursor-pointer">
            Extend journey
          </Button>
          <Button variant={'outline'} disabled={isComplete} onClick={handleClose} className="cursor-pointer">
           {
            isComplete ? <span className="flex items-center gap-1">
              <Loader2 className="animate-spin"/> Completing... </span> : <span>Complete</span>
           }
          </Button>
        </div>
        </section> : <section>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
           <div className="flex flex-col gap-1">
             <label className="text-slate-900 font-medium">Add additional days</label>
            <input
            name="daysToAdd"
            className="border-slate-300 no-spinner bg-white text-slate-900 border p-2 rounded-lg outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            type="number"
            min={1}
            max={30}
            required
            />
            <p className="text-xs text-slate-500">Additional days should be between 1 to 30</p>
           </div>
           <div className="flex justify-end gap-5">
            <Button onClick={()=>setIsExtendJourney(false)} variant="outline" className="cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900" type="button">
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