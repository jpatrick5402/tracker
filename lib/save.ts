interface ItemData {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
}

export async function saveItem(
  action: 'create' | 'update' | 'delete',
  type: 'task' | 'project',
  data?: ItemData,
  id?: string
) {
  try {
    const response = await fetch("/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, type, data, id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Save operation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Save operation failed:', error);
    throw error;
  }
}

// Legacy function for backwards compatibility
export default async function save(inputObject: object) {
  return await fetch("/api/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputObject),
  });
}
