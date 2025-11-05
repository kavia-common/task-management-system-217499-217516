import React, { useState } from 'react';
import TodoForm from './TodoForm';

/**
 * Renders a single todo item entry as a card with actions.
 * Props:
 * - todo: { id, title, description, completed }
 * - onToggle: (id, completed) => void
 * - onDelete: (id) => void
 * - onUpdate: (id, updates) => void
 */
export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => onToggle(todo.id, !todo.completed);

  const handleSave = async (values) => {
    await onUpdate(todo.id, values);
    setIsEditing(false);
  };

  return (
    <div className={`todo-card ${todo.completed ? 'completed' : ''}`} aria-label={`todo-${todo.id}`}>
      {!isEditing ? (
        <>
          <div className="todo-main">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={!!todo.completed}
                onChange={handleToggle}
                aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
              <span className="checkmark" />
            </label>
            <div className="todo-content">
              <div className="todo-title">{todo.title}</div>
              {todo.description ? (
                <div className="todo-description">{todo.description}</div>
              ) : null}
            </div>
          </div>
          <div className="todo-actions">
            <button className="btn btn-ghost" onClick={() => setIsEditing(true)} aria-label="Edit task">
              ✏️ Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(todo.id)} aria-label="Delete task">
              🗑️ Delete
            </button>
          </div>
        </>
      ) : (
        <TodoForm
          initialData={{ title: todo.title, description: todo.description }}
          onSubmit={handleSave}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save"
        />
      )}
    </div>
  );
}
