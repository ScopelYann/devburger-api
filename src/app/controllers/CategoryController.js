import {mapWhereFieldNames} from "sequelize/lib/utils";
import * as yup from "yup";
import Category from "../models/Category.js";
import User from "../models/User.js";

class CategoryController {
	async store(req, res) {
		const schema = yup.object({
			name: yup.string().required(),
			path: yup.string(),
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

		const {name} = req.body;
		const {filename: path} = req.file;

		const isValid = await Category.findOne({
			where: {
				name,
			},
		});

		if (isValid) {
			res.status(400).json({error: "This category already exists!"});
			return;
		}

		const {id} = await Category.create({
			name,
			path,
		});
		return res.status(201).json({id, name});
	}

	async index(req, res) {
		const categoriess = await Category.findAll();
		return res.status(200).json(categoriess);
	}

	async delete(req, res) {
		const {id} = req.params;

		const {admin: isAdmin} = await User.findByPk(req.userInfo);

		if (!isAdmin) {
			return res.status(401).json();
		}

		const deleteCategory = await Category.destroy({
			where: {
				id,
			},
		});
		return res.status(201).json({categoryDeleted: deleteCategory});
	}

	async update(req, res) {
		const schema = yup.object({
			name: yup.string(),
			path: yup.string(),
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

		const categoryExists = await Category.findByPk(id);

		if (!categoryExists) {
			return res
				.status(400)
				.json({message: "Make Sure your category_id is Correct!"});
		}

		let path;
		
		if (req.file) {
			path = req.file.filename;
		}
		
		const {name} = req.body;


		if (name) {
			const isValid = await Category.findOne({
				where: {
					name,
				},
			});
			if (isValid && isValid.id != id) {
				res.status(400).json({error: "This category already exists!"});
				return;
			}
		}


		await Category.update(
			{
				name,
				path,
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

export default new CategoryController();
