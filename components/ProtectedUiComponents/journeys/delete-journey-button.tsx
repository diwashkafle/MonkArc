'use client'

import { useState } from 'react'
import { deleteJourney } from '@/lib/server-actions/journey-actions'
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
import { Button } from '../../ui/button'
import { Loader2 } from 'lucide-react'

interface DeleteJourneyButtonProps {
  journeyId: string
  journeyTitle: string
}

export function DeleteJourneyButton({ journeyId, journeyTitle }: DeleteJourneyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)
  
  const handleDelete = async () => {
  console.log("delete button clicked")
  setIsDeleting(true)
  try {
    await deleteJourney(journeyId)
    // Dialog will close on redirect
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:{ message?: string } | any) {
    console.error("Error deleting journey:", error)
    if(error?.message?.includes('NEXT_REDIRECT')) {
        return;
    }
    alert(`Failed to delete journey: ${error instanceof Error ? error.message : 'Unknown error'}`)
    setIsDeleting(false)
    setOpen(false)
  }
}
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer w-fit' variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete <span className='text-red-600'>{journeyTitle}</span>?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this journey? This action cannot be undone.
            All check-ins, milestones, and resources will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button 
              type="button" 
              disabled={isDeleting} 
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <span className='flex items-center gap-1'><Loader2 className='animate-spin'/><h1>Deleting...</h1></span> : 'Delete Permanently'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}