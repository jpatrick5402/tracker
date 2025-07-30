import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";

export const POST = auth(async function POST(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  if (!req.auth.user)
    return NextResponse.json({ message: "No email" }, { status: 401 });

  // filter body into database
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL environment variable is not set.");
  const sql = neon(process.env.DATABASE_URL);

  if (!req.body)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  // Extract input data
  const input = await req.json();
  const tasks = input["task"];
  const projects = input["project"];

  // Get user ID
  const userIdRes = await sql.query(
    `SELECT id FROM users WHERE email='${req.auth.user.email}'`
  );
  const userId = userIdRes[0].id;

  // Build values string for tasks
  const taskValues = tasks
    ? tasks
        .map(
          (task: {
            id: string | null;
            name: string;
            description: string;
            status: string;
          }) =>
            `(${task.id ? `'${task.id}'` : "DEFAULT"}, '${task.name}', '${
              task.description
            }', '${task.status}')`
        )
        .join(",\n    ")
    : null;

  // Build values string for projects
  const projectValues = projects
    ? projects
        .map(
          (project: { id: string; name: string; description: string }) =>
            `(${project.id ? `'${project.id}'` : "DEFAULT"}, '${
              project.name
            }', '${project.description}')`
        )
        .join(",\n    ")
    : null;

  // Run the query
  if (taskValues) {
    const ids = await sql.query(`
    INSERT INTO tasks (id, name, description, status) VALUES ${taskValues} ON CONFLICT (id) DO UPDATE SET id=EXCLUDED.id, name=EXCLUDED.name, description=EXCLUDED.description, status=EXCLUDED.status RETURNING id;`);

    const joinInput = ids
      .map((item) => `('${userId}', '${item["id"]}')`)
      .join(",\n    ");

    await sql.query(
      `INSERT INTO users_tasks (user_id, task_id) VALUES ${joinInput} ON CONFLICT DO NOTHING;`
    );
  }

  if (projectValues) {
    const ids = await sql.query(`
    INSERT INTO projects (id, name, description) VALUES ${projectValues} ON CONFLICT (id) DO UPDATE SET id=EXCLUDED.id, name=EXCLUDED.name, description=EXCLUDED.description RETURNING id;
    `);

    const joinInput = ids
      .map((item) => `('${userId}', '${item["id"]}')`)
      .join(",\n    ");

    await sql.query(
      `INSERT INTO users_projects (user_id, project_id) VALUES ${joinInput} ON CONFLICT DO NOTHING;`
    );
  }

  return NextResponse.json(
    { message: `User information updated` },
    { status: 200 }
  );
});
