import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { fetchTodos, createTodo, deleteTodo, toggleTodoComplete, updateTodo } from './api';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application component: manages theme and todo list state,
   * wires up CRUD actions to the API client.
   */
  const [theme, setTheme] = useState('light');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load todos on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const items = await fetchTodos();
        if (!active) return;

        // Normalize potential backend shapes:
        // expected: [{ id, title, description?, completed }]
        const normalized = (items || []).map((t) => ({
          id: t.id ?? t.task_id ?? t.uuid ?? t._id ?? Math.random().toString(36).slice(2),
          title: t.title ?? t.name ?? '',
          description: t.description ?? '',
          completed: !!(t.completed ?? t.is_done ?? t.done ?? false),
        }));
        setTodos(normalized);
      } catch (err) {
        setErrorMsg(err?.message || 'Failed to load tasks.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const toggleTheme = () => setTheme((p) => (p === 'light' ? 'dark' : 'light'));

  const handleAdd = async (values) => {
    try {
      setErrorMsg('');
      const created = await createTodo({ title: values.title, description: values.description });
      const newItem = {
        id: created.id ?? Math.random().toString(36).slice(2),
        title: created.title ?? values.title,
        description: created.description ?? values.description,
        completed: !!(created.completed ?? false),
      };
      setTodos((prev) => [newItem, ...prev]);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to add task.');
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      setErrorMsg('');
      const updated = await toggleTodoComplete(id, completed);
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: !!(updated.completed ?? completed),
              }
            : t
        )
      );
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update task status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setErrorMsg('');
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to delete task.');
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      setErrorMsg('');
      // Backend PUT requires title, description, and completed fields.
      const current = todos.find((t) => t.id === id) || {};
      const payload = {
        title: updates.title ?? current.title ?? '',
        description: updates.description ?? current.description ?? '',
        completed: typeof updates.completed === 'boolean' ? updates.completed : !!current.completed,
      };
      const updated = await updateTodo(id, payload);
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                title: updated.title ?? updates.title ?? t.title,
                description: updated.description ?? updates.description ?? t.description,
              }
            : t
        )
      );
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to save changes.');
    }
  };

  const remainingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <div>
            <div className="title">Tasks</div>
            <div className="subtitle">
              {loading ? 'Loading…' : `${remainingCount} task${remainingCount === 1 ? '' : 's'} remaining`}
            </div>
          </div>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        <TodoForm onSubmit={handleAdd} />

        {errorMsg && <div className="error-text" role="alert" style={{ marginBottom: 12 }}>{errorMsg}</div>}

        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}

export default App;
