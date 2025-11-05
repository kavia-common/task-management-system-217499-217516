import React from 'react';
import TodoItem from './TodoItem';

/**
 * Renders a list of todo cards.
 * Props:
 * - todos: array of todo objects
 * - onToggle: (id, completed) => void
 * - onDelete: (id) => void
 * - onUpdate: (id, updates) => void
 */
export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (!todos.length) {
    return <div className="empty-state">No tasks yet. Add your first one above!</div>;
  }

  return (
    <div className="todo-list">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
