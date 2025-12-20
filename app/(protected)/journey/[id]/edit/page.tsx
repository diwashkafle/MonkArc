import { auth } from '@/lib/auth'
import { getJourneyById } from '@/lib/queries/journey-queries'
import { notFound, redirect } from 'next/navigation'
import { EditJourneyForm } from '@/components/ProtectedUiComponents/journeys/edit-journey-form'
import { hasGitHubConnected } from '@/lib/github/github-status'
import { db } from '@/db'
import { and, eq } from 'drizzle-orm'
import { accounts } from '@/db/schema'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DeleteJourneyButton } from '@/components/ProtectedUiComponents/journeys/delete-journey-button'
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator"
import PauseAndResume from '@/components/ProtectedUiComponents/journeys/PauseAndResume'

interface EditJourneyPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditJourneyPage({ params }: EditJourneyPageProps) {
  const session = await auth()
  if (!session) redirect('/login')
   const githubConnected = await hasGitHubConnected(session.user.id);
      
        let githubUsername: string | null = null;
        if (githubConnected) {
          const githubAccount = await db.query.accounts.findFirst({
            where: and(
              eq(accounts.userId, session.user.id),
              eq(accounts.provider, "github")
            ),
          });
      
          githubUsername = githubAccount?.providerAccountId || null;
        }
  const { id } = await params
  const journey = await getJourneyById(id, session.user.id)
  
  if (!journey) notFound()

  
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="advance_setting">Advance setting</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <main className='grid mt-5'>
            <section className='flex flex-col gap-2'>
              <h1 className='text-xl font-semibold'>
                Edit Journey
              </h1>
              <p className='text-sm text-gray-600'>You can edit your journey and hit save button to save any changes.</p>
            </section>
          <EditJourneyForm githubConnected={githubConnected} githubUsername={githubUsername} journey={journey} />
          </main>

        </TabsContent>
        <TabsContent value="advance_setting">
         
             <main className='grid gap-6'>
              <PauseAndResume status={journey.status} id={id} />
               <Separator className="" />
               <div className='flex flex-col gap-3'>
                 <h2 className='text-sm font-semibold'>{`Delete your journey`} </h2>
                <div className='flex text-gray-500 flex-col gap-1 pb-1'>
                  <p className='flex items-center gap-1 text-xs'><IoMdInformationCircleOutline/> <span>{`If you delete your journey it's can't get back.`}</span></p>
                  <p className='flex items-center gap-1 text-xs'><IoMdInformationCircleOutline/> <span>{`Before you delete it make sure, you really want to delete it permanently.`}</span></p>
                  </div>
                <DeleteJourneyButton journeyId={id} journeyTitle={journey.title} />
               </div>
             </main>
        </TabsContent>
      </Tabs>
    </div>
      </main>
    </div>
  )
}