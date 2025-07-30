import { auth, signOut } from "@/auth";
import List from "./components/List";
import getTasks from "@/lib/getTasks";
import getProjects from "@/lib/getProjects";
import buttons from "@styles/buttons.module.css";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.email) return;
  const tasks = await getTasks(session.user.email);
  const projects = await getProjects(session.user.email);

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
