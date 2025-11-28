import React from 'react'
import { auth } from '@/lib/auth'

const  page = async () => {

    const session = await auth(); 
    // this is new ay of getting session's data for server side which is replaced from this : const session = await getServerSession(authOptions)

  return (
    <div>
        Hey welcome {session ? <h1>{session.user?.name}</h1>:<h1>user</h1> }
    </div>
  )
}

export default page