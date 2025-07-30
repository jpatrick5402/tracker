import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { neon } from "@neondatabase/serverless";

interface ItemData {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
}

interface RequestBody {
  action: "create" | "update" | "delete";
  type: "task" | "project";
  data?: ItemData;
  id?: string;
}

export const POST = auth(async function POST(req) {
  if (!req.auth?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    const { action, type, data, id }: RequestBody = await req.json();

    // Get user ID using parameterized query
    const userResult =
      await sql`SELECT id FROM users WHERE email = ${req.auth.user.email}`;
    if (userResult.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const userId = userResult[0].id;

    let result;

    switch (action) {
      case "create":
        if (type === "task") {
          result = await sql`
            INSERT INTO tasks (name, description, status) 
            VALUES (${data?.name || ""}, ${data?.description || ""}, ${
            data?.status || ""
          })
            RETURNING *
          `;
          // Link to user
          await sql`
            INSERT INTO users_tasks (user_id, task_id) 
            VALUES (${userId}, ${result[0].id})
          `;
        } else if (type === "project") {
          result = await sql`
            INSERT INTO projects (name, description) 
            VALUES (${data?.name || ""}, ${data?.description || ""})
            RETURNING *
          `;
          // Link to user
          await sql`
            INSERT INTO users_projects (user_id, project_id) 
            VALUES (${userId}, ${result[0].id})
          `;
        }
        break;

      case "update":
        if (!id) {
          return NextResponse.json(
            { message: "ID required for update" },
            { status: 400 }
          );
        }
        if (type === "task") {
          result = await sql`
            UPDATE tasks 
            SET name = ${data?.name || ""}, 
                description = ${data?.description || ""}, 
                status = ${data?.status || ""}
            WHERE id = ${id} 
            AND EXISTS (SELECT 1 FROM users_tasks WHERE user_id = ${userId} AND task_id = ${id})
            RETURNING *
          `;
        } else if (type === "project") {
          result = await sql`
            UPDATE projects 
            SET name = ${data?.name || ""}, 
                description = ${data?.description || ""}
            WHERE id = ${id} 
            AND EXISTS (SELECT 1 FROM users_projects WHERE user_id = ${userId} AND project_id = ${id})
            RETURNING *
          `;
        }
        break;

      case "delete":
        if (!id) {
          return NextResponse.json(
            { message: "ID required for delete" },
            { status: 400 }
          );
        }
        if (type === "task") {
          // Delete user association first
          await sql`DELETE FROM users_tasks WHERE user_id = ${userId} AND task_id = ${id}`;
          // Delete task if no other users are associated
          result = await sql`
            DELETE FROM tasks 
            WHERE id = ${id} 
            AND NOT EXISTS (SELECT 1 FROM users_tasks WHERE task_id = ${id})
            RETURNING *
          `;
        } else if (type === "project") {
          // Delete user association first
          await sql`DELETE FROM users_projects WHERE user_id = ${userId} AND project_id = ${id}`;
          // Delete project if no other users are associated
          result = await sql`
            DELETE FROM projects 
            WHERE id = ${id} 
            AND NOT EXISTS (SELECT 1 FROM users_projects WHERE project_id = ${id})
            RETURNING *
          `;
        }
        break;

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: "Operation successful",
      data: result?.[0] || null,
    });
  } catch (error) {
    console.error("Database operation failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});
