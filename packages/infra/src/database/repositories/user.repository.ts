import { UserRepository } from '@tdc/domain';
import { UserEntity } from '@tdc/domain';
import { prisma } from '../prisma-client.js';
import { User, Prisma } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tenant: true,
        addresses: true,
      },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        tenant: true,
        addresses: true,
      },
    });

    if (!user) return null;

    return this.mapToEntity(user);
  }

  async save(user: UserEntity): Promise<void> {
    const userData: Prisma.UserCreateInput = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role as any,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      tenant: {
        connect: { id: user.tenantId },
      },
    };

    await prisma.user.upsert({
      where: { id: user.id },
      create: userData,
      update: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role as any,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findAll(limit?: number, offset?: number): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      include: {
        tenant: true,
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => this.mapToEntity(user));
  }

  async findByRole(role: string): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      where: { role: role as any },
      include: {
        tenant: true,
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => this.mapToEntity(user));
  }

  async count(): Promise<number> {
    return await prisma.user.count();
  }

  private mapToEntity(user: User & { tenant: any; addresses: any[] }): UserEntity {
    return new UserEntity(
      user.id,
      user.email,
      user.name || '',
      user.role as any,
      user.isActive,
      user.createdAt,
      user.updatedAt
    );
  }
}

