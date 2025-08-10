import { neon } from "@neondatabase/serverless";
import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);

  const { user_id: id } = await readBody(event);

  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user.id)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to perform this action.",
    });

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
