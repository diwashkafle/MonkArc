
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import clsx from 'clsx'

interface CancelButtonProps {
  hasFormData: boolean
  onClear: () => void // Function to clear the draft
  isDisabled?: boolean
}

export function CancelButton({ hasFormData, onClear, isDisabled }: CancelButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // If no form data, navigate directly
  const handleClick = () => {
    if (!hasFormData) {
      onClear()
      router.push('/dashboard')
    } else {
      setOpen(true) // Show dialog
    }
  }

  // Confirm discard
  const handleConfirm = () => {
    onClear()
    setOpen(false)
    router.push('/dashboard')
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={clsx(
          "inline-flex border border-gray-400 items-center rounded-md px-4 py-2",
          isDisabled ? "pointer-events-none opacity-50" : "hover:bg-gray-100"
        )}
      >
        Cancel
      </button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard journey draft?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes in this form. If you cancel now, your progress will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep editing</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Discard changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}