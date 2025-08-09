import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { project_id, user_id } = await readBody(event);
  console.log(project_id);

  if (project_id) {
    return sql`
    WITH inserted_task AS (
      INSERT INTO task (id, title, description, status)
      VALUES (DEFAULT, 'New Task', '', 'planning')
      RETURNING id
    )
    INSERT INTO join_project_task (task_id, project_id)
    SELECT id, ${project_id} FROM inserted_task;
    `;
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
