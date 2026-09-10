import {
  createUserAction,
  deleteUserAction,
  getUsersAction,
} from "@/lib/server/actions/users";
import { CreateUserInput, UserData } from "@/lib/types";
import { User } from "@prisma/client";

export const getUsers = async (): Promise<User[]> => {
  return getUsersAction();
};

export const createUser = async (
  values: Pick<User, "name" | "email" | "roleName">,
) => {
  const res = await createUserAction(values);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return res;
};

export const deleteUser = async (id: string): Promise<any> => {
  const res = await deleteUserAction(id);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return res;
};
