import { neon } from "@neondatabase/serverless";

export default async function getProjects(email: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  const sql = neon(process.env.DATABASE_URL);

  return await sql`
    SELECT p.* FROM projects p
    JOIN users_projects up ON p.id = up.project_id
    JOIN users u ON u.id = up.user_id
    WHERE u.email = ${email}
    ORDER BY p.id
  `;
}
