import { neon } from "@neondatabase/serverless";

export default async function getProjectsTasks(email: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  const sql = neon(process.env.DATABASE_URL);

  return await sql`
    SELECT * FROM projects_tasks
  `;
}
