import { serverErrorHandler } from "@/src/serverErrorHandler.js";
import type { userFilterQuery } from "@/types/Admin.types.js";
import { UserModel } from "@/registration/data/UserSchema.js";
import type { Role, userWithoutPassword } from "@/types/User.types.js";
import type { Todo } from "@/types/Todo.types.js";
import TodosModel from "@/todo/data/TodoSchema.js";

class AdminDB {
  async getUsers(
    page: number,
    limit: number,
    filter: userFilterQuery,
  ): Promise<{ users: userWithoutPassword[]; totalFiltered: number }> {
    try {
      const totalFiltered = await UserModel.countDocuments(filter);
      const users = await UserModel.find(filter)
        .select("-password")
        .skip((page - 1) * limit)
        .limit(limit);

      return { totalFiltered, users };
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async changeRole(
    adminId: string,
    userId: string,
    role: Role,
  ): Promise<userWithoutPassword> {
    try {
      if (userId === adminId) {
        throw {
          status: 403,
          field: null,
          message: "The user cannot change his own role",
        };
      }

      const user = await UserModel.findById(userId).select("-password");
      if (!user) {
        throw {
          status: 404,
          field: null,
          message: "The user was not found",
          isManual: true,
        };
      }

      user.role = role;
      return await user.save();
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async changeStatus(
    adminId: string,
    userId: string,
  ): Promise<userWithoutPassword> {
    try {
      if (adminId === userId) {
        throw {
          status: 403,
          field: null,
          message: "The user cannot change his own status",
          isManual: true,
        };
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw {
          status: 404,
          field: null,
          message: "The user was not found",
          isManual: true,
        };
      }

      user.profile.isActive = !user.profile.isActive;
      return await user.save();
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async getAllUsers(): Promise<userWithoutPassword[]> {
    try {
      const users = await UserModel.find().select("-password");
      return users;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async getAllTodos(): Promise<Todo[]> {
    try {
      const todos = await TodosModel.find();
      return todos;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async getUserTodos(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Todo[]> {
    try {
      const userTodos = await UserModel.findById(userId)
        .populate<{ todos: Todo[] }>("todos")
        .skip((page - 1) * limit)
        .limit(limit);

      if (!userTodos) {
        throw {
          status: 404,
          field: null,
          message: "The user was not found",
          isManual: true,
        };
      }

      return userTodos.todos;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }
}

export default new AdminDB();
