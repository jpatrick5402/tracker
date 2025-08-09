import { neon } from "@neondatabase/serverless";

export default defineEventHandler(async (event) => {
  const { DB_URL } = useRuntimeConfig(event);

  const { type, id, field, value } = await readBody(event);

  const sql = neon(DB_URL);

  const query = `UPDATE ${type} SET ${field} = '${value}' WHERE id = ${id};`;

  return sql(query);
});
