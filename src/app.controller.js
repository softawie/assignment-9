import { CheckDB } from "./db/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
const bootstrap = (app, express) => {
  app.use(express.json());
  CheckDB();
  app.use("/", userRouter);
};

export { bootstrap };

// to convert to import control + option + r
