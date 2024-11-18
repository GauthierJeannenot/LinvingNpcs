import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
  } from "next"
  import type { NextAuthOptions } from "next-auth"
  import { getServerSession } from "next-auth"
  import GoogleProvider from "next-auth/providers/google";
  import { supabase } from "./supabase";
  // You'll need to import and pass this
  // to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
  export const config = {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
      ], 
      callbacks: {
        async signIn({ user }) {
            const { data, error } = await supabase
            .from('User')
            .select('id')
            .eq('email', user.email)
            .single();


      if (error && error.code === 'PGRST116') {
        // User doesn't exist in Supabase, so create a new entry
        await supabase
          .from('User')
          .insert([
            {
              email: user.email,
            },
          ]);
      }
            return true
        }
      }
  } satisfies NextAuthOptions
  
  // Use it in server contexts
  export function auth(
    ...args:
      | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
      | [NextApiRequest, NextApiResponse]
      | []
  ) {
    return getServerSession(...args, config)
  }