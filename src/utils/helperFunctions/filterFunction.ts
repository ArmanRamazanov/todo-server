import type { FilterQuery, Todo } from "@/types/todo.types.js";

export function filter(filterOptions: FilterQuery, todos: Todo[]) {
  const { completed, priority, search } = filterOptions;

  return todos.filter((todo) => {
    const completedMatch = !completed || String(todo.completed) === completed;
    const priorityMatch = !priority || todo.priority === priority;
    const searchMatch = !search || todo.text.includes(search);

    return completedMatch && priorityMatch && searchMatch;
  });
}
