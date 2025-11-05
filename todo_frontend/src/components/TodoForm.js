import React, { useEffect, useState } from 'react';

/**
 * TodoForm handles creating and editing a todo item.
 * Props:
 * - initialData: { title?: string, description?: string } initial values
 * - onSubmit: (values) => void called when form is submitted successfully
 * - onCancel?: () => void called when cancel is clicked (edit mode)
 * - submitLabel?: string overrides submit button text
 */
export default function TodoForm({ initialData = {}, onSubmit, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initialData.title || '');
    setDescription(initialData.description || '');
  }, [initialData.title, initialData.description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Minimal validation
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }
    setError('');
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form" aria-label="todo form">
      <div className="form-row">
        <input
          className="input title-input"
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task title"
        />
      </div>
      <div className="form-row">
        <textarea
          className="input description-input"
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          aria-label="Task description"
        />
      </div>
      {error && <div className="error-text" role="alert">{error}</div>}
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          {submitLabel || 'Add Task'}
        </button>
        {onCancel && (
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
