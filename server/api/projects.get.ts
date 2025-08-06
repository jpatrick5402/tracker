import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);
  return await sql`
  SELECT p.id AS id, p.name AS name, p.description AS description,
  CASE 
      WHEN COUNT(t.id) > 0 THEN 
          json_agg(json_build_object('id', t.id, 'name', t.name, 'description', t.description, 'status', t.status))
      ELSE NULL
  END AS tasks
  FROM projects p
  LEFT JOIN projects_tasks pt ON p.id = pt.project_id
  LEFT JOIN tasks t ON pt.task_id = t.id
  GROUP BY p.id, p.name, p.description
  ORDER BY p.id
  `;
});
