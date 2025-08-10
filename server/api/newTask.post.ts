import { neon } from "@neondatabase/serverless";
import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { project_id, user_id } = await readBody(event);

  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user.id)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to perform this action.",
    });

  if (project_id) {
    const { id: task_id } = (
      await sql`
      INSERT INTO task (id, title, description, status)
      VALUES (DEFAULT, '', '', '')
      RETURNING id;`
    )[0];

    await sql`
      INSERT INTO join_project_task(project_id, task_id)
      VALUES (${project_id}, ${task_id});  
    `;

    await sql`
      INSERT INTO join_user_task(user_id, task_id)
      VALUES (${user_id}, ${task_id});  
    `;

    return;
  } else {
    return sql`
    WITH inserted_task AS (
      INSERT INTO task (id, title, description, status)
      VALUES (DEFAULT, '', '', '')
      RETURNING id
    )
    INSERT INTO join_user_task (user_id, task_id)
    SELECT ${user_id}, id FROM inserted_task;
    `;
  }
});
