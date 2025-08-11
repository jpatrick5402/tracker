import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { user_id, project_sort, project_task_sort, orphan_task_sort } =
    await readBody(event);

  const project_query = `
SELECT p.id, p.name, p.description, p.created_at,
CASE 
    WHEN COUNT(t.id) > 0 THEN 
       JSON_AGG(
           JSON_BUILD_OBJECT(
               'id', t.id,
               'title', t.title,
               'description', t.description,
               'status', t.status,
               'created_at', t.created_at
           )
          ORDER BY t.${project_task_sort} ASC
       )
    ELSE NULL
  END AS tasks
FROM project p
JOIN join_user_project jup ON p.id = jup.project_id
LEFT JOIN join_project_task jpt ON p.id = jpt.project_id
LEFT JOIN task t ON jpt.task_id = t.id
WHERE jup.user_id = '${user_id}'
GROUP BY p.id, p.name, p.description, p.created_at
ORDER BY p.${project_sort} ASC;
  `;

  const orphan_task_query = `
    SELECT t.* FROM task t
LEFT JOIN join_project_task jpt ON t.id = jpt.task_id
JOIN join_user_task jut ON t.id = jut.task_id
WHERE jpt.project_id IS NULL
AND jut.user_id = '${user_id}'
ORDER BY t.${orphan_task_sort} ASC;
    `;

  return {
    projects: await sql(project_query),
    tasks: await sql(orphan_task_query),
  };
});
