import { auth, signOut } from "@/auth";
import List from "./components/List";
import getId from "@/lib/getId";
import getTasks from "@/lib/getTasks";
import getProjects from "@/lib/getProjects";
import buttons from "@styles/buttons.module.css";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.email) return;
  const id = await getId(session.user.email);
  const tasks = await getTasks(id);
  const projects = await getProjects(id);

  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className={`${buttons.auth}`}>Sign Out</button>
      </form>
      <span className="flex">
        <List
          type="project"
          items={projects}
          columns={["name", "description"]}
        />
        <List
          type="task"
          items={tasks}
          columns={["name", "description", "status"]}
        />
      </span>
    </div>
  );
}
