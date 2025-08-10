import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);

  const { user_id: id } = await readBody(event);

  const sql = neon(DB_URL);
  return sql`
WITH new_project AS (
  INSERT INTO project (name, description)
  VALUES ('', '')
  RETURNING id
)
INSERT INTO join_user_project (user_id, project_id)
SELECT ${id}, id FROM new_project;
  `;
});
