import { neon } from "@neondatabase/serverless";

export default defineCachedEventHandler((event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);
  return sql`
SELECT t.*, p.name AS project_name, p.description AS project_description
FROM tasks t
FULL OUTER JOIN projects_tasks pt ON t.id = pt.task_id
FULL OUTER JOIN projects p ON pt.project_id = p.id
`;
});
