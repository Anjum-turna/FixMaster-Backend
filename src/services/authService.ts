import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface RegisterInput {
  email: string;
  username: string;
  phone: string;
  address: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    phone: string;
    address: string;
  };
}

export const registerService = async (input: RegisterInput): Promise<AuthResponse> => {
  const { email, username, phone, address, password } = input;
  
  // Check if user exists (by email)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = new User({ email, username, phone, address, password });
  await user.save();

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: { 
      id: user.id, 
      email: user.email, 
      username: user.username, 
      phone: user.phone, 
      address: user.address 
    },
  };
};

export const loginService = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  // Find user (exclude password)
  const user = await User.findOne({ email }).select('-password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password (note: comparePassword accesses full document, so fetch without select for this check)
  const fullUser = await User.findOne({ email }); // Temporary fetch for password comparison
  const isMatch = await fullUser!.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: { 
      id: user.id, 
      email: user.email, 
      username: user.username, 
      phone: user.phone, 
      address: user.address 
    },
  };
};