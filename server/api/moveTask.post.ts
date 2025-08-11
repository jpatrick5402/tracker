import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);

  const { task_id, from_project_id, to_project_id } = await readBody(event);

  try {
    // If moving from project to orphan (to_project_id is null/undefined)
    if (!to_project_id && from_project_id) {
      await sql`
        DELETE FROM join_project_task 
        WHERE project_id = ${from_project_id} AND task_id = ${task_id};
      `;
      return { success: true, message: "Task moved to orphaned tasks" };
    }
    
    // If moving from orphan to project (from_project_id is null/undefined)
    if (to_project_id && !from_project_id) {
      await sql`
        INSERT INTO join_project_task (project_id, task_id)
        VALUES (${to_project_id}, ${task_id});
      `;
      return { success: true, message: "Task moved to project" };
    }
    
    // If moving from one project to another
    if (to_project_id && from_project_id && to_project_id !== from_project_id) {
      await sql`
        UPDATE join_project_task 
        SET project_id = ${to_project_id} 
        WHERE project_id = ${from_project_id} AND task_id = ${task_id};
      `;
      return { success: true, message: "Task moved between projects" };
    }
    
    return { success: false, message: "No valid move operation specified" };
    
  } catch (error) {
    console.error("Error moving task:", error);
    return { success: false, message: "Error moving task" };
  }
});
