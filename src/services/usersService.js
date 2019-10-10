import { UsersApi } from 'sdk/api/';

export class UsersListService {
  static async getUsersList({ limit, offset, sort }) {
    const { data } = await UsersApi.getList({ limit, offset, sort });
    return data;
  }
}
