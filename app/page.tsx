import { auth, signOut } from "@/auth";
import List from "./components/List";
import getTasks from "@/lib/getTasks";
import getProjects from "@/lib/getProjects";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.email) return null;
  const tasks = await getTasks(session.user.email);
  const projects = await getProjects(session.user.email);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tracker</h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Sign Out
          </button>
        </form>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      </div>
    </div>
  );
}
