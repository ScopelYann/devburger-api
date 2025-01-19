import {Router} from "express";
import {Sequelize} from "sequelize";

import multer from "multer";
import multerConfig from "./config/multer.cjs";

//Controllers
import CategoryController from "./app/controllers/CategoryController.js";
import ProductsController from "./app/controllers/ProductsController.js";
import SessionController from "./app/controllers/SessionController.js";
import UserController from "./app/controllers/UserController.js";

import OrderController from "./app/controllers/OrderController.js";
import CreatePaymentControlller from "./app/controllers/stripe/CreatePaymentControlller.cjs";
import authMiddleware from "./app/middlewares/auth.js";

const routes = new Router();

const upload = multer(multerConfig);

routes.post("/users", UserController.store); //cadastro!!!
routes.get("/users", UserController.index); //listagem de users

routes.post("/sessions", SessionController.store); //login!!

routes.use(authMiddleware);

routes.post("/products", upload.single("file"), ProductsController.store); //store for produtos
routes.get("/products", ProductsController.index); // index de produtos
routes.put("/products/:id", upload.single("file"), ProductsController.update); //update for produtos

routes.post("/categories", upload.single("file"), CategoryController.store); //store for categoria
routes.get("/categories", CategoryController.index); //index de categoria
routes.put("/categories/:id", upload.single("file"), CategoryController.update); //update for categoria

routes.post("/orders", OrderController.store); //store for orders
routes.get("/orders", OrderController.index); //index for orders
routes.put("/orders/:_id", OrderController.update); //update for orders

routes.post("/create-payment-intent", CreatePaymentControlller.store)



export default routes; // - mesma coisa que module.exports, só que mais moderno que o module
