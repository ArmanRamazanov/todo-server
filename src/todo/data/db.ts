import { serverErrorHandler } from "@/src/serverErrorHandler.js";
import type {
  FilterQuery,
  Todo,
  UpdateTodoInput,
} from "../../types/Todo.types.js";
import TodosModel from "@/todo/data/TodoSchema.js";

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
      throw serverErrorHandler(error);
    }
  }

  async getAllTodos(userId: string): Promise<Todo[]> {
    try {
      const todos = await TodosModel.find({ userId: userId });

      if (!todos) {
        throw {
          status: 404,
          field: null,
          message: "The todos were not found",
          isManual: true,
        };
      }
      return todos;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async getTodo(id: string, userId: string): Promise<Todo> {
    try {
      const todo = await TodosModel.findOne({ id: id, userId: userId });

      if (!todo) {
        throw {
          status: 404,
          field: null,
          message: "The todo was not found",
          isManual: true,
        };
      }

      return todo;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async addTodo(todoCreate: Todo) {
    try {
      const todo = await TodosModel.create(todoCreate);
      return todo;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async updateTodo(
    id: string,
    updateInput: UpdateTodoInput,
    userId: string,
  ): Promise<Todo> {
    try {
      const todoToUpdate = await TodosModel.findOne({
        id: id,
        userId: userId,
      });

      if (!todoToUpdate) {
        throw {
          status: 404,
          field: null,
          message: "The todo was not found",
          isManual: true,
        };
      }

      const { text, completed, priority, dueDate } = updateInput;

      if (text) {
        todoToUpdate.text = text.trim();
      }
      if (completed !== undefined) {
        todoToUpdate.completed = completed;
      }
      if (priority) {
        todoToUpdate.priority = priority;
      }
      if (dueDate) {
        todoToUpdate.dueDate = new Date(dueDate);
      }

      return await todoToUpdate.save();
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async deleteTodo(id: string, userId: string): Promise<true> {
    try {
      const todo = await TodosModel.findOne({ id: id, userId: userId });

      if (!todo) {
        throw {
          status: 404,
          field: null,
          message: "The todo was not found",
          isManual: true,
        };
      }

      return true;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }
}

export default new TodoDatabase();
