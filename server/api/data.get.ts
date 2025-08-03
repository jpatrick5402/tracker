import { neon } from "@neondatabase/serverless";

export default defineCachedEventHandler((event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);
  return sql`
SELECT p.id AS id, p.name AS name, p.description AS description, 
       json_agg(json_build_object('id', t.id, 'name', t.name, 'description', t.description, 'status', t.status)) AS tasks
FROM projects p
LEFT JOIN projects_tasks pt ON p.id = pt.project_id
LEFT JOIN tasks t ON pt.task_id = t.id
GROUP BY p.id, p.name, p.description
ORDER BY p.id
`;
});
