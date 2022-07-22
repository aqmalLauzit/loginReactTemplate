import express from "express";
import { getUsers, login, logout, register } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js"
import { refreshToken } from "../controllers/refreshToken.js";

const routes = express.Router();

routes.route('/').post(register);
routes.route('/').get(verifyToken,getUsers);
routes.route('/login').post(login);
routes.route('/token').get(refreshToken);
routes.route('/logout').delete(logout);

export default routes;