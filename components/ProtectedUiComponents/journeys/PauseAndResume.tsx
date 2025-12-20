'use client'
import { Button } from '@/components/ui/button'
import { pauseJourney, resumeJourney } from '@/lib/server-actions/journey-actions'
import React, { useState, useTransition } from 'react'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { Loader2 } from 'lucide-react'

type PauseAndResumeProp = {
  status: 'active' | 'paused' | 'completed' | "frozen" | "dead" | "scheduled" | "extended"
  id: string
}

const PauseAndResume = ({ status, id }: PauseAndResumeProp) => { 
  const [isPausing, startPauseTransition] = useTransition();
  const [isResuming, startResumeTransition] = useTransition();

  const pauseHandler = () => {
    startPauseTransition(async()=>{
 try {
      await pauseJourney(id)
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      if (msg.includes("NEXT_REDIRECT")) {
        throw error
      }
      alert(msg)
    }
    })
   
  }

 const resumeHandler = () => {
    startResumeTransition(async()=>{
      try {
        await resumeJourney(id)
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        if (!msg.includes("NEXT_REDIRECT")) {
          alert(msg)
        }
      }
    })
  }

  return (
    <div>
      {status === "active" && (
        <form className='flex flex-col gap-3' action={pauseHandler}>
          <h2 className='text-sm font-semibold'>Pause your journey</h2>
          <div className='flex text-gray-500 flex-col gap-1 pb-1'>
            <p className='flex items-center gap-1 text-xs'>
              <IoMdInformationCircleOutline /> 
              <span>{"If you don't want your journey to freeze or die, then pause it."}</span>
            </p>
            <p className='flex items-center gap-1 text-xs'>
              <IoMdInformationCircleOutline /> 
              <span>Your missed days will still be recorded but your journey will be safe from freezing or dying.</span>
            </p>
            <p className='flex items-center gap-1 text-xs'>
              <IoMdInformationCircleOutline /> 
              <span>{"After pausing it you can't do daily check-in"}</span>
            </p>
          </div>
          <Button 
            disabled={isPausing} 
            variant={"outline"} 
            className='cursor-pointer w-fit' 
          >
            {isPausing ? (
              <span className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' /> 
                Pausing
              </span>
            ) : (
              'Pause Journey'
            )}
          </Button>
        </form>
      )}

      {status === "paused" && (
        <form className='flex flex-col gap-3' action={resumeHandler}>
          <h2 className='text-sm font-semibold'>Resume your journey</h2>
          <div className='flex text-gray-500 flex-col gap-1 pb-1'>
            <p className='flex items-center gap-1 text-xs'>
              <IoMdInformationCircleOutline /> 
              <span>If you resume your journey it will back to active state.</span>
            </p>
            <p className='flex items-center gap-1 text-xs'>
              <IoMdInformationCircleOutline /> 
              <span>You can continue to do daily check-in and log your journey</span>
            </p>
          </div>
          <Button 
            disabled={isResuming} 
            variant={"outline"} 
            className='cursor-pointer w-fit' 
          >
            {isResuming ? (
              <span className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' /> 
                Resuming
              </span>
            ) : (
              'Resume Journey'
            )}
          </Button>
        </form>
      )}
    </div>
  )
}

export default PauseAndResume