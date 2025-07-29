interface taskInput {
  id?: string;
  [key: string]: string | undefined;
}

export default async function addTasks(tasks: taskInput[]) {
  return await fetch("/api/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasks),
  });
}
