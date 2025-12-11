'use client'

export function DeleteAccountButton() {
  const handleDelete = () => {
    alert('Account deletion feature coming soon!')
  }
  
  return (
    <button
      onClick={handleDelete}
      className="rounded-lg border-2 border-red-400 bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
    >
      Delete Account
    </button>
  )
}