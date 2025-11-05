const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001';

// Helper to handle JSON responses and errors
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  // Try to parse JSON body, even on non-2xx responses
  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await response.text();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = (data && (data.detail || data.message)) || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// PUBLIC_INTERFACE
export async function fetchTodos() {
  /** Fetch all todos from the backend. Returns array of todos. */
  return request('/tasks', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function createTodo(todo) {
  /** Create a new todo. todo: { title: string, description?: string }. Returns created todo. */
  return request('/tasks', { method: 'POST', body: JSON.stringify(todo) });
}

// PUBLIC_INTERFACE
export async function updateTodo(id, updates) {
  /** Update an existing todo by id with partial updates. Returns updated todo. */
  return request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
}

// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  /** Delete a todo by id. Returns { success: true } or deleted entity. */
  return request(`/tasks/${id}`, { method: 'DELETE' });
}

// PUBLIC_INTERFACE
export async function toggleTodoComplete(id, completed) {
  /** Toggle completion status of a todo. Returns updated todo. */
  return updateTodo(id, { completed });
}

export default {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
};
