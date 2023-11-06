import { sequelize } from '../db';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const User = sequelize.define('User', {
  givenName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  familyName: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '/dummy_profile_image.jpeg',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
});

async function register(
  givenName: string,
  familyName: string = '',
  email: string,
  userName: string,
  password: string,
  avatar: string = '/dummy_profile_image.jpeg',
  role: string = 'user'
): Promise<{
  id: number;
  givenName: string;
  familyName: string;
  email: string;
  userName: string;
  password: string;
  avatar: string;
  role: string;
}> {
  try {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      givenName,
      familyName,
      email,
      userName,
      password: hashedPassword,
      avatar,
      role,
    });

    return await user.toJSON();
  } catch (error) {
    console.error('Failed to register user', error);
    throw error;
  }
}

async function getByUsername(userName: string): Promise<{
  id: number;
  givenName: string;
  familyName: string;
  email: string;
  userName: string;
  password: string;
  avatar: string;
  role: string;
} | null> {
  try {
    const user = await User.findOne({ where: { userName } });

    if (!user) {
      return null;
    }

    const dataToJson = await user.toJSON();

    return dataToJson;
  } catch (error) {
    console.error('Failed to get User', error);
    throw error;
  }
}

async function isPasswordCorrect(
  userName: string,
  password: string
): Promise<boolean> {
  try {
    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return false;
    }

    const hashedPassword = await user.toJSON().password;

    return bcrypt.compareSync(password, hashedPassword);
  } catch (error) {
    console.error('Failed to check password', error);
    throw error;
  }
}

async function generateAccessToken(user: {
  id: number;
  givenName: string;
  familyName: string;
  email: string;
  userName: string;
  password: string;
  avatar: string;
  role: string;
}): Promise<string> {
  try {
    const { id, email, userName, password } = user;

    return jwt.sign(
      { id, email, userName, password },
      String(process.env.ACCESS_TOKEN_SECRET),
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    console.error('Failed to generate access token', error);
    throw error;
  }
}

export { register, getByUsername, isPasswordCorrect, generateAccessToken };
export default User;