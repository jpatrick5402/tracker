import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { project: project_id } = await readBody(event);

  return sql`
  WITH inserted_task AS (
    INSERT INTO tasks (id, name, description, status)
    VALUES (DEFAULT, 'New Task', '', 'planning')
    RETURNING id
  )
  INSERT INTO projects_tasks (task_id, project_id)
  SELECT id, ${project_id} FROM inserted_task;
  `;
});
