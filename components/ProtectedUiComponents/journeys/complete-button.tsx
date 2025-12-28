'use client'
import { Button } from '@/components/ui/button'
import { completeJourney } from '@/lib/server-actions/journey-actions';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

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
         <Button disabled={isComplete} onClick={handleButton} variant={'outline'}>
                {isComplete ? "Completing..." : "Complete"}
              </Button>
    </div>
  )
}

export default CompleteButton