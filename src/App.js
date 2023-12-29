import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [categories, setCategories] = useState(JSON.parse(localStorage.getItem('categories')) || []);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTodo, setNewTodo] = useState({ category: '', text: '' });
  const [editing, setEditing] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    setCategories([...categories, { name: newCategoryName, todos: [] }]);
    setNewCategoryName('');
  };

  const handleAddTodo = () => {
    if (!newTodo.category || !newTodo.text) return;
    const updatedCategories = categories.map(category => {
      if (category.name === newTodo.category) {
        return { ...category, todos: [...category.todos, { id: Date.now(), text: newTodo.text, isCompleted: false }] };
      }
      return category;
    });
    setCategories(updatedCategories);
    setNewTodo({ category: '', text: '' });
  };

  const handleEditTodo = (categoryName, todoId, text) => {
    setEditing(todoId);
    setEditingText(text);
  };

  const handleSaveEdit = (categoryName, todoId) => {
    const updatedCategories = categories.map(category => {
      if (category.name === categoryName) {
        return {
          ...category,
          todos: category.todos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, text: editingText };
            }
            return todo;
          })
        };
      }
      return category;
    });
    setCategories(updatedCategories);
    setEditing(null);
  };

  const handleDeleteTodo = (categoryName, todoId) => {
    const updatedCategories = categories.map(category => {
      if (category.name === categoryName) {
        return {
          ...category,
          todos: category.todos.filter(todo => todo.id !== todoId)
        };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const handleToggleComplete = (categoryName, todoId) => {
    const updatedCategories = categories.map(category => {
      if (category.name === categoryName) {
        return {
          ...category,
          todos: category.todos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, isCompleted: !todo.isCompleted };
            }
            return todo;
          })
        };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const getFilteredTodos = todos => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.isCompleted);
      case 'active':
        return todos.filter(todo => !todo.isCompleted);
      default:
        return todos;
    }
  };

  return (
    <div>
      <h1>Todo List</h1>

      {/* Thêm danh mục mới */}
      <div>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Tên danh mục mới"
        />
        <button onClick={handleAddCategory}>Thêm Danh Mục</button>
      </div>

      {/* Thêm công việc mới */}
      <div>
        <select
          value={newTodo.category}
          onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
        >
          <option value="">Chọn Danh Mục</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>{category.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={newTodo.text}
          onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
          placeholder="Thêm công việc mới"
        />
        <button onClick={handleAddTodo}>Thêm Công Việc</button>
      </div>

      {/* Lựa chọn lọc công việc */}
      <div>
        <button onClick={() => setFilter('all')}>Tất cả</button>
        <button onClick={() => setFilter('completed')}>Hoàn thành</button>
        <button onClick={() => setFilter('active')}>Chưa hoàn thành</button>
      </div>

      {/* Hiển thị danh mục và công việc */}
      {categories.map((category, index) => (
        <div key={index}>
          <h2>{category.name}</h2>
          <ul>
            {getFilteredTodos(category.todos).map(todo => (
              <li key={todo.id} style={{ textDecoration: todo.isCompleted ? 'line-through' : 'none' }}>
                {editing === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(category.name, todo.id)}>Lưu</button>
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => handleToggleComplete(category.name, todo.id)}
                    />
                      {todo.text}
                      <button onClick={() => handleEditTodo(category.name, todo.id, todo.text)}>Sửa</button>
                      <button onClick={() => handleDeleteTodo(category.name, todo.id)}>Xóa</button>
                    
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
