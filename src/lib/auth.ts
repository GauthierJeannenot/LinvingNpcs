import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from './supabase';
// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const createUser = async() => {
        const { error } = await supabase
        .from('User')
        .select('id')
        .eq('email', user.email || "")
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist in Supabase, so create a new entry
        const now = new Date()
        await supabase.from('User').insert([
          {
            created_at: now.toLocaleString(),
            email: user.email!,
          },
        ]);
      }
      }
      await createUser()

      const addTestGameToUser = async() => {
        const { data } = await supabase
          .from('User')
          .select('id')
          .eq('email', user.email!)
          .single()
        

        const userId = data?.id
        
        if (userId) {
          const { data } = await supabase
            .from('user_game')
            .select('gameId')
            .eq('userId', userId)
          if (data?.length === 0) {
            await supabase
              .from('user_game')
              .insert({
                userId: userId,
                gameId: 1,
                created_at: new Date().toLocaleString()
              })
          }
        }
        
      }
      
      await addTestGameToUser()
      

      return true;
    },

    async session({ session }) {
      // Send properties to the client, like an access_token and user id from a provider.
        const userEmail = session.user.email

        const { data, error } = await supabase
          .from('User')
          .select('id')
          .eq('email', userEmail || "")
          .single()
        
          if (error) {
            console.error('Error fetching user ID:', error);
            throw new Error('Failed to fetch user ID.');
          }
  
          // Add `id` to the session user object
          if (session.user) session.user.id = data?.id;

      return session
    }

  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
