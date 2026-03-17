import type { SortQuery, Todo } from "@/types/todo.types.js";

export function sort(sortOptions: SortQuery, todos: Todo[]) {
  const { sortBy, sortOrder } = sortOptions;

  console.log("sortBy: ", sortBy);
  console.log("sortOrder: ", sortOrder);
  if (sortBy) {
    if (sortOrder === "asc") {
      return todos.toSorted((a, b) => {
        if (!a[sortBy]) return 1;
        if (!b[sortBy]) return -1;
        return Date.parse(a[sortBy]) - Date.parse(b[sortBy]);
      });
    } else if (sortOrder === "desc") {
      return todos.toSorted((a, b) => {
        if (!a[sortBy]) return 1;
        if (!b[sortBy]) return -1;
        return Date.parse(b[sortBy]) - Date.parse(a[sortBy]);
      });
    }
  }
}
