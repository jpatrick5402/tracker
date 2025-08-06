import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { type: type, id: id } = await readBody(event);

  if (type === "project") {
    await sql`DELETE FROM users_projects WHERE project_id = ${id};`;
    await sql`DELETE FROM projects_tasks WHERE project_id = ${id};`;
    await sql`DELETE FROM projects WHERE id = ${id};`;
    return new Response("Successfully removed");
  } else if (type === "task") {
    await sql`DELETE FROM users_tasks WHERE task_id = ${id};`;
    await sql`DELETE FROM projects_tasks WHERE task_id = ${id};`;
    await sql`DELETE FROM tasks WHERE id = ${id};`;
    return new Response("Successfully removed");
  } else {
    return new Error("incorrect parameters");
  }
});
