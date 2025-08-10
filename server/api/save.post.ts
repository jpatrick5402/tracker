import { neon } from "@neondatabase/serverless";
import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);

  const { type, id, field, value } = await readBody(event);

  const sql = neon(DB_URL);

  const query = `UPDATE ${type} SET ${field} = '${value}' WHERE id = ${id};`;

  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user.id)
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to perform this action.",
    });

  return sql(query);
});
