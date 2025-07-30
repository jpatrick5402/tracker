import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";

export const POST = auth(async function POST(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  // filter body into database
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL environment variable is not set.");
  const sql = neon(process.env.DATABASE_URL);

  if (!req.body)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const input = await req.json();

  console.log(input);

  const tasks = input["task"];
  const projects = input["project"];

  // Build values string for tasks
  const taskValues = tasks
    ? tasks
        .map(
          (task: {
            id: string;
            name: string;
            description: string;
            status: string;
          }) => `('${task.name}', '${task.description}', '${task.status}')`
        )
        .join(",\n    ")
    : null;

  // Build values string for projects
  const projectValues = projects
    ? projects
        .map(
          (project: { name: string; description: string }) =>
            `('${project.name}', '${project.description}')`
        )
        .join(",\n    ")
    : null;

  // Run the query
  if (taskValues)
    await sql.query(`
    INSERT INTO tasks (name, description, status) VALUES ${taskValues};
    `);

  if (projectValues)
    await sql.query(`
    INSERT INTO projects (name, description) VALUES ${projectValues};
    `);

  return NextResponse.json(
    { message: `User information updated` },
    { status: 200 }
  );
});
