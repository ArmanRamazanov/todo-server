import type { userFilterQuery } from "@/types/Admin.types.js";
import db from "@/admin/data/db.js";
import type { Role, User, userWithoutPassword } from "@/types/User.types.js";
import type { Todo } from "@/types/Todo.types.js";

export async function getUsers(query: userFilterQuery): Promise<{
  users: userWithoutPassword[];
  meta: {
    totalUsers: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}> {
  let { page = 1, limit = 10, search, role, status } = query;

  page = typeof page === "string" ? parseInt(page) : page;
  limit = typeof limit === "string" ? parseInt(limit) : limit;

  const filter = {
    ...(search && {
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }),
    ...(role && { role: role }),
    ...(status && { status: status }),
  };

  const { totalFiltered, users } = await db.getUsers(page, limit, filter);

  return {
    users,
    meta: {
      totalUsers: totalFiltered,
      totalPages: Math.ceil(totalFiltered / limit),
      page: page,
      limit: limit,
    },
  };
}

export async function changeRole(
  adminId: string,
  userId: string,
  role: Role,
): Promise<userWithoutPassword> {
  return await db.changeRole(adminId, userId, role);
}

export async function changeStatus(
  adminId: string,
  userId: string,
): Promise<userWithoutPassword> {
  return await db.changeStatus(adminId, userId);
}

export async function getStatistics(): Promise<{
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
  completedTodos: number;
  pendingTodos: number;
}> {
  const users = await db.getAllUsers();
  const todos = await db.getAllTodos();
  const byRole = users.reduce(
    (acc: Record<string, number>, currentValue: userWithoutPassword) => {
      if (!acc.hasOwnProperty(currentValue.role)) {
        acc[currentValue.role] = 0;
      }
      acc[currentValue.role]!++;
      return acc;
    },
    {} as Record<string, number>,
  );

  const byStatus = users.reduce(
    (acc: Record<string, number>, currentValue: userWithoutPassword) => {
      if (currentValue.profile.isActive) {
        acc["active"] = acc["active"] ? acc["active"]++ : 0;
      }
      if (!currentValue.profile.isActive) {
        acc["inActive"] = acc["inActive"] ? acc["inActive"]++ : 0;
      }

      return acc;
    },
    {} as Record<string, number>,
  );

  const todosCompleted = todos.filter((todo) => todo.completed).length;

  return {
    byRole,
    byStatus,
    completedTodos: todosCompleted,
    pendingTodos: todos.length - todosCompleted,
  };
}

export async function getUserTodos(
  userId: string,
  query: Pick<userFilterQuery, "page" | "limit">,
): Promise<{
  todos: Todo[];
  meta: {
    totalTodos: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}> {
  let { page = 1, limit = 10 } = query;
  page = typeof page === "string" ? parseInt(page) : page;
  limit = typeof limit === "string" ? parseInt(limit) : limit;

  const todos = await db.getUserTodos(userId, page, limit);

  return {
    todos,
    meta: {
      totalTodos: todos.length,
      totalPages: Math.ceil(todos.length / limit),
      page,
      limit,
    },
  };
}
