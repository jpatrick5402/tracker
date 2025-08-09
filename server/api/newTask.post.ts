import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { project_id, user_id } = await readBody(event);

  if (project_id) {
    const { id: task_id } = (
      await sql`
      INSERT INTO task (id, title, description, status)
      VALUES (DEFAULT, 'New Task', '', 'planning')
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
      VALUES (DEFAULT, 'New Task', '', 'planning')
      RETURNING id
    )
    INSERT INTO join_user_task (user_id, task_id)
    SELECT ${user_id}, id FROM inserted_task;
    `;
  }
});
