import { neon } from "@neondatabase/serverless";

export default async function getTasks(email: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  const sql = neon(process.env.DATABASE_URL);

  return await sql`
    SELECT t.* FROM tasks t
    JOIN users_tasks ut ON t.id = ut.task_id
    JOIN users u ON ut.user_id = u.id
    WHERE u.email = ${email}
    ORDER BY t.id
  `;
}
