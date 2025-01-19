import * as yup from "yup";

import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../schemas/order.js";
import CategoryController from "./CategoryController.js";

class OrderController {
  async store(req, res) {
    const schema = yup.object({
      products: yup
        .array()
        .required()
        .of(
          yup.object({
            id: yup.number().required(),
            quantity: yup.number().required(),
          })
        ),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { products } = req.body;

    const productsIds = products.map((product) => product.id);

    const findProducts = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: {
        model: Category,
        as: "category",
        attributes: ["name"],
      },
    });

    

    const formattedProducts = findProducts.map((product) => {
      const productIndex = products.findIndex((item) => item.id === product.id);

      const newProduct = {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.url,
        quantity: products[productIndex].quantity,
      };

      return newProduct;
    });

    const order = {
      user: {
        id: req.userInfo,
        name: req.userName,
      },
      products: formattedProducts,
      status: "Pedido Realizado",
    };

    const createdOrder = await Order.create(order);

    return res.status(201).json({ createdOrder });
  }

  async index(req, res) {
    const orders = await Order.find();
    return res.status(200).json(orders);
  }

  async update(req, res) {
    const schema = yup.object({
      status: yup.string().required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { admin: isAdmin } = await User.findByPk(req.userInfo);

    if (!isAdmin) {
      return res.status(401).json();
    }

    const { _id } = req.params;

    const { status } = req.body;

    try {
      await Order.updateOne({ _id }, { status });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ message: "Status updated sucessfully" });
  }
}

export default new OrderController();
