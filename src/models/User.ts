import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  username: string;
  phone: string;
  address: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    trim: true,
  },
  address: {
    type: mongoose.Schema.Types.String,
    required: true,
    trim: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 6,
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  const user = this as IUser;  // Cast 'this' to IUser for type safety
  if (!user.isModified('password')) return next();
  user.password = await bcrypt.hash(user.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, (this as IUser).password);  // Cast for consistency
};

export default mongoose.model<IUser>('User', UserSchema);