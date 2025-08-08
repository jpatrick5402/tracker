import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { type: type, id: id } = await readBody(event);

  if (type === "project") {
    await sql`DELETE FROM join_user_project WHERE project_id = ${id};`;
    await sql`DELETE FROM join_project_task WHERE project_id = ${id};`;
    await sql`DELETE FROM project WHERE id = ${id};`;
    return new Response("Successfully removed");
  } else if (type === "task") {
    await sql`DELETE FROM join_user_task WHERE task_id = ${id};`;
    await sql`DELETE FROM join_project_task WHERE task_id = ${id};`;
    await sql`DELETE FROM task WHERE id = ${id};`;
    return new Response("Successfully removed");
  } else {
    return new Error("incorrect parameters");
  }
});
