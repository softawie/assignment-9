import UserModel from "../../db/models/user.model.js";
export const createUser = async (req, res, next) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(201).json({
      message: "User added successfully.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
