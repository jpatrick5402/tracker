import { neon } from "@neondatabase/serverless";

export default async function getProjects(id: string) {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL environment variable is not set.");
  const sql = neon(process.env.DATABASE_URL);

  const projectIdRes = await sql.query(
    `SELECT project_id FROM users_projects WHERE user_id=${id}`
  );

  const projectIds = projectIdRes.map((item) => {
    return item.project_id;
  });

  return await sql.query(
    `SELECT * FROM projects WHERE id IN (${projectIds.join(",")})`
  );
}
