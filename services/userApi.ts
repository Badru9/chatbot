import { CreateUserInput, UserData } from "@/lib/types";
import {
  getUsersAction,
  createUserAction,
  deleteUserAction,
} from "@/lib/server/actions/users";

export const getUsers = async (): Promise<UserData[]> => {
  return getUsersAction();
};

export const createUser = async (values: CreateUserInput): Promise<UserData> => {
  const res = await createUserAction(values);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return res as UserData;
};

export const deleteUser = async (id: string): Promise<any> => {
  const res = await deleteUserAction(id);
  if ("error" in res && res.error) {
    throw new Error(res.error);
  }
  return res;
};
