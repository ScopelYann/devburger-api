import Sequelize, {Model} from "sequelize";

class Category extends Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				path: Sequelize.STRING,
				url: {
					type: Sequelize.VIRTUAL,
					get() {
						return `http://localhost:3200/categories-file/${this.path}`;
					},
				},
			},
			{
				sequelize,
				tableName: "Categories",
				createdAt: "created_at",
				updatedAt: "updated_at",
			},
		);
		return this;
	}
}

export default Category;
