import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "user" | "admin";

export const rolesEnum = {
  USER: "user" as UserRole,
  ADMIN: "admin" as UserRole,
};
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  age?: number;
  role: UserRole;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "the {VALUE} must be at most 50 characters long"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
      trim: true,
    },
    phone: { type: String, required: true },
    age: {
      type: Number,
      validate: {
        validator: function (value: number) {
          return value >= 18 && value <= 60;
        },
        message: "Age must be between 18 and 60 years",
      },
    },
    role: {
      type: Schema.Types.String,
      enum: Object.values(rolesEnum),
      default: rolesEnum.USER,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
