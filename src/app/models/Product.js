import Sequelize, {Model} from "sequelize";
import Category from "./Category.js";

class Product extends Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				price: Sequelize.INTEGER,
				path: Sequelize.STRING,
				offer: Sequelize.BOOLEAN,
				url: {
					type: Sequelize.VIRTUAL,
					get() {
						return `http://localhost:3200/products-file/${this.path}`;
					},
				},
			},
			{
				sequelize,
				createdAt: "created_at",
				updatedAt: "updated_at",
			},
		);
		return this;
	}


	static associate(models) {
		this.belongsTo(models.Category, {
			foreignKey: 'category_id',
			as: 'category'
		})
	}
}

export default Product;
