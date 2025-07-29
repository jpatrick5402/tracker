import { neon } from "@neondatabase/serverless";

export default async function getTasks(id: string) {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL environment variable is not set.");
  const sql = neon(process.env.DATABASE_URL);

  const taskIdRes = await sql.query(
    `SELECT task_id FROM users_tasks WHERE user_id=${id}`
  );

  const taskIds = taskIdRes.map((item) => {
    return item.task_id;
  });

  return await sql.query(
    `SELECT * FROM tasks WHERE id IN (${taskIds.join(",")})`
  );
}
