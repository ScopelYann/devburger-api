import * as yup from "yup";

import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import CategoryController from "./CategoryController.js";

class ProductsController {
	async store(req, res) {
		const schema = yup.object({
			name: yup.string().required(),
			price: yup.number().required(),
			category_id: yup.number().required(),
			offer: yup.boolean(),
		});

		try {
			schema.validateSync(req.body, {abortEarly: false});
		} catch (error) {
			return res.status(400).json({error: error.errors});
		}

		const {admin: isAdmin} = await User.findByPk(req.userInfo);

		if (!isAdmin) {
			return res.status(401).json();
		}

		const {filename} = req.file;
		const {name, price, category_id, offer} = req.body;

		const CreateProduct = await Product.create({
			name,
			price,
			category_id,
			path: filename,
			offer,
		});
		return res.status(201).json({CreateProduct});
	}

	async index(req, res) {
		const getImages = await Product.findAll({
			include: [
				{
					model: Category,
					as: "category",
					attributes: ["id", "name"],
				},
			],
		});

		return res.status(201).json(getImages);
	}

	async update(req, res) {
		const schema = yup.object({
			name: yup.string(),
			price: yup.number(),
			category_id: yup.number(),
			offer: yup.boolean(),
		});

		try {
			schema.validateSync(req.body, {abortEarly: false});
		} catch (error) {
			return res.status(400).json({error: error.errors});
		}

		const {admin: isAdmin} = await User.findByPk(req.userInfo);

		if (!isAdmin) {
			return res.status(401).json();
		}
		const {id} = req.params;

		const findProduct = await Product.findByPk(id);

		if (!findProduct) {
			return res
				.status(400)
				.json({message: "Make sure your product ID is correct"});
		}

		let path;

		if (req.file) {
			path = req.file.filename;
		}

		const {name, price, category_id, offer} = req.body;

		await Product.update(
			{
				name,
				price,
				category_id,
				path,
				offer,
			},
			{
				where: {
					id,
				},
			},
		);
		return res.status(200).json();
	}
}

export default new ProductsController();
