import type { FilterQuery, Todo, UpdateTodoInput } from "@/types/todo.types.js";
import TodosModel from "./schemas/todoSchema.js";

class TodoDatabase {
  async getTodos(
    page: number,
    limit: number,
    filter: FilterQuery,
    sort: Record<string, 1 | -1>,
  ): Promise<{ todos: Todo[]; totalFiltered: number }> {
    try {
      const totalFiltered = await TodosModel.countDocuments(filter);
      const todos = await TodosModel.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort);

      return { todos, totalFiltered };
    } catch (error) {
      throw new Error("Failed to fetch todos");
    }
  }

  async getAllTodos(): Promise<Todo[] | { error: string }> {
    try {
      const todos = await TodosModel.find();
      return todos;
    } catch (error) {
      return {
        error: (error as { message: string }).message,
      };
    }
  }

  async getTodo(id: string): Promise<Todo | null | { error: string }> {
    try {
      const todo = await TodosModel.findById(id);
      return todo;
    } catch (error) {
      return {
        error: (error as { message: string }).message,
      };
    }
  }

  async addTodo(todoCreate: Todo) {
    try {
      const todo = await TodosModel.create(todoCreate);
      return todo;
    } catch (error) {
      return {
        error: (error as { message: string }).message,
      };
    }
  }

  async updateTodo(
    id: string,
    updateInput: UpdateTodoInput,
  ): Promise<Todo | { error: string }> {
    try {
      const todoToUpdate = await TodosModel.findById(id);

      if (!todoToUpdate) {
        return {
          error: "Todo not found",
        };
      }

      const { text, completed, priority, dueDate } = updateInput;

      if (text !== undefined) {
        todoToUpdate.text = text.trim();
      }
      if (completed !== undefined) {
        todoToUpdate.completed = completed;
      }
      if (priority !== undefined) {
        todoToUpdate.priority = priority;
      }
      if (dueDate !== undefined) {
        todoToUpdate.dueDate = new Date(dueDate);
      }

      todoToUpdate.updatedAt = new Date();

      return await todoToUpdate.save();
    } catch (error) {
      return {
        error: (error as { message: string }).message,
      };
    }
  }

  async deleteTodo(id: string): Promise<boolean | { error: string }> {
    try {
      const result = await TodosModel.deleteOne({ _id: id });
      return Boolean(result.deletedCount);
    } catch (error) {
      return {
        error: (error as { message: string }).message,
      };
    }
  }
}

export default new TodoDatabase();
