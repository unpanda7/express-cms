import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

const prisma = new PrismaClient();

export class UserService {
  async registerAdmin(userData: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const existingPhone = await prisma.user.findUnique({
      where: { phone: userData.phone }
    });
    if (existingPhone) {
      throw new Error('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        roles: {
          create: {
            role: {
              connect: {
                name: 'admin',
              },
            },
          },
        },
      },
    });

  }
  async register(userData: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const existingPhone = await prisma.user.findUnique({
      where: { phone: userData.phone }
    });
    if (existingPhone) {
      throw new Error('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        roles: {
          create: {
            role: {
              connect: {
                name: 'user',
              },
            },
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

  }

  async login(identifier: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
          { phone: identifier },
        ],
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles: user.roles.map(r => r.role.name),
        permissions: user.roles.flatMap(r =>
          r.role.permissions.map(p => p.name)
        )
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    const { password: _, ...result } = user;
    return {
      user: result,
      token,
    };
  }
}