import NextAuth from "next-auth";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: NeonAdapter(
    new Pool({ connectionString: process.env.DATABASE_URL })
  ),
  providers: [GitHub],
  session: {
    strategy: "database",
  },
});
