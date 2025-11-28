import NextAuth from "next-auth";
import {DrizzleAdapter} from '@auth/drizzle-adapter';
import Google from "next-auth/providers/google";
import {db} from '@/db'
import Github from "next-auth/providers/github";


export const {handlers, auth, signIn, signout} = NextAuth({
    adapter: DrizzleAdapter(db),
    providers:[
        Google({ 
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_ID!,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email',  // Minimal scope for sign-in
        },
      },
        })
    ],
    callbacks:{
        async session({session,user}){
            if(session.user){
                session.user.id = user.id
            }
            return session;
        },
    },
    pages: {
        signIn:'/auth/signin',
    },
})