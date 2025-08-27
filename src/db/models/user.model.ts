import { providersEnum, UserRole } from "@utils/enums";
import mongoose, { Schema, Document } from "mongoose";

Object.freeze(UserRole);
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  age?: number;
  role: UserRole;
  photo?: string;
  provider: providersEnum;
  confirmEmail?: boolean;
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
      required: function() {
        return this.provider === providersEnum.SYSTEM ? true : false;
      },
      minlength: [6, "Password must be at least 6 characters long"],
      trim: true,
    },
    phone: { type: String, required: false },
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
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },
    confirmEmail:Date,
    photo:String,
    provider: {
      type: String,
      enum:{ values:Object.values(providersEnum),message:"{VALUE} is not supported"},
      default: providersEnum.SYSTEM,
    },

  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
