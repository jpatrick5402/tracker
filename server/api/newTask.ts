import { neon } from "@neondatabase/serverless";

export default defineCachedEventHandler((event) => {
  const { DB_URL } = useRuntimeConfig(event);
  const sql = neon(DB_URL);
  return sql`
  INSERT INTO projects (id, name, description)
  VALUES (DEFAULT, 'New Project', '');
  `;
});
