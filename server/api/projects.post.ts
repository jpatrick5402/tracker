import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { user_id } = await readBody(event);

  return sql`
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
       )
    ELSE NULL
  END AS tasks
FROM project p
JOIN join_user_project jup ON p.id = jup.project_id
LEFT JOIN join_project_task jpt ON p.id = jpt.project_id
LEFT JOIN task t ON jpt.task_id = t.id
WHERE jup.user_id = ${user_id}
GROUP BY p.id, p.name, p.description, p.created_at
ORDER BY p.created_at DESC;
  `;
});
