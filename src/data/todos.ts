import type { Todo } from "@/types/todo.types.js";
import { Priority } from "@/types/todo.types.js";
class TodoDatabase {
  todos: Todo[] = [
    {
      id: 1,
      text: "todo1",
      completed: true,
      priority: Priority.Low,
      createdAt: "2026-03-17T02:49:28.863Z",
    },
    {
      id: 2,
      text: "todo1",
      completed: false,
      priority: Priority.Low,
      createdAt: "2026-03-17T02:49:37.507Z",
    },
    {
      id: 3,
      text: "todo1",
      completed: false,
      priority: Priority.Medium,
      dueDate: "2027-01-03",
      createdAt: "2026-03-17T02:49:46.648Z",
    },
    {
      id: 4,
      text: "todo1",
      completed: false,
      priority: Priority.High,
      dueDate: "2027-03-03",
      createdAt: "2026-03-17T02:49:50.821Z",
    },
    {
      id: 5,
      text: "todo1",
      completed: true,
      priority: Priority.Low,
      dueDate: "2027-03-03",
      createdAt: "2026-03-17T02:49:54.957Z",
    },
    {
      id: 6,
      text: "todo1",
      completed: true,
      priority: Priority.Medium,
      createdAt: "2026-03-17T02:50:01.857Z",
    },
  ];

  getTodos() {
    return this.todos;
  }

  getTodo(id: number) {
    return this.todos.find((todo) => todo.id === id) ?? null;
  }

  addTodo(todo: Todo) {
    this.todos.push(todo);
  }

  updateTodo(index: number, updateInput: Todo) {
    this.todos[index] = updateInput;
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  getIndex(id: number) {
    return this.todos.findIndex((todo) => todo.id === id);
  }
}

export default new TodoDatabase();
