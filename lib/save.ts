export default async function save(inputObject: object) {
  return await fetch("/api/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputObject),
  });
}
