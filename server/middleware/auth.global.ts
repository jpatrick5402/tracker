import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  if (
    !(await auth.api.getSession(event))?.user &&
    event.path.startsWith("/api") &&
    !event.path.startsWith("/api/auth") &&
    !event.path.startsWith("/api/projects")
  ) {
    return createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      message: "You must be logged in to perform this action.",
    });
  }
});
