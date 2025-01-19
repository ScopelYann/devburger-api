import mongoose from "mongoose";
import {Sequelize} from "sequelize";

//models
import Category from "../app/models/Category.js";
import Product from "../app/models/Product.js";
import User from "../app/models/User.js";
//models

import configDatabase from "../config/database.js";

const model = [User, Product, Category];

class DataBase {
	constructor() {
		this.init();
		this.mongo();
	}

	init() {
		this.conection = new Sequelize({
			dialect: "postgres",
			host: "localhost",
			username: "postgres",
			password: "postgres",
			database: "devburger",
		});
		model
			.map((model) => model.init(this.conection))
			.map(
				(model) => model.associate && model.associate(this.conection.models),
			);
	}

	mongo() {
		this.mongoConnection = mongoose.connect(
			"mongodb://localhost:27017/devburger",
		);
	}

	
}

export default new DataBase();
