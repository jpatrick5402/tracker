import { neon } from "@neondatabase/serverless";

export default async function getId(email: string) {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL environment variable is not set.");
  const sql = neon(process.env.DATABASE_URL);
  const idRes = await sql.query(`SELECT id FROM users WHERE email='${email}'`);
  const id = idRes[0].id as string;
  return id;
}
