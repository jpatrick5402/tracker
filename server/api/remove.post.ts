import { neon } from "@neondatabase/serverless";
import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { type: type, id: id } = await readBody(event);

  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user.id)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to perform this action.",
    });

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
