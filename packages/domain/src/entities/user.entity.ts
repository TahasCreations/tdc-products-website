import { z } from 'zod';

// User entity schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// User value object
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: 'USER' | 'ADMIN' | 'SUPER_ADMIN',
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.length === 0) {
      throw new Error('User ID is required');
    }
    if (!this.email || !this.email.includes('@')) {
      throw new Error('Valid email is required');
    }
    if (!this.name || this.name.length === 0) {
      throw new Error('User name is required');
    }
  }

  // Business methods
  public activate(): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      this.name,
      this.role,
      true,
      this.createdAt,
      new Date()
    );
  }

  public deactivate(): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      this.name,
      this.role,
      false,
      this.createdAt,
      new Date()
    );
  }

  public changeRole(newRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN'): UserEntity {
    return new UserEntity(
      this.id,
      this.email,
      this.name,
      newRole,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }

  public isAdmin(): boolean {
    return this.role === 'ADMIN' || this.role === 'SUPER_ADMIN';
  }

  public canManageUsers(): boolean {
    return this.role === 'SUPER_ADMIN';
  }
}



