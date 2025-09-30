import { UserEntity } from '../../entities/user.entity.js';
import { UserRepository } from '../../ports/repositories/user.repository.js';

export interface CreateUserRequest {
  email: string;
  name: string;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface CreateUserResponse {
  success: boolean;
  user?: UserEntity;
  error?: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(request.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists',
        };
      }

      // Create new user entity
      const user = new UserEntity(
        crypto.randomUUID(),
        request.email,
        request.name,
        request.role || 'USER'
      );

      // Save user
      await this.userRepository.save(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}



