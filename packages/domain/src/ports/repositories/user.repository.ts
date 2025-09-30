import { UserEntity } from '../../entities/user.entity.js';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<UserEntity[]>;
  findByRole(role: string): Promise<UserEntity[]>;
  count(): Promise<number>;
}



