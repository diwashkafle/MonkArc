'use client'
import { Button } from '@/components/ui/button'
import { completeJourney } from '@/lib/server-actions/journey-actions';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';

const CompleteButton = ({journeyId}:{journeyId:string}) => {

    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();
    const handleButton = async () => {
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
  return (
    <div>
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Complete</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete the Journey</DialogTitle>
          </DialogHeader>
         <section>
            <h1 className='text-sm text-slate-800'>Your journey will be completed from this point of time. It can not be get back into active mode after completion, so Please begin with caution</h1>
         </section>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isComplete} variant="outline">Cancel</Button>
            </DialogClose>
             <Button disabled={isComplete} onClick={handleButton} variant={'default'}>
                {isComplete ? <span className='flex items-center gap-1'><Loader2 className='animate-spin'/>Completing...</span> : "Complete"}
              </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  )
}

export default CompleteButton




