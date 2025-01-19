import bcrypt from "bcrypt";
import {DataTypes, Model, Sequelize} from "sequelize";

class User extends Model {
	static init(sequelize) {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		super.init(
			{
				id: {
					primaryKey: true,
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
				},
				name: DataTypes.STRING,
				email: DataTypes.STRING,
				password: DataTypes.VIRTUAL,
				password_hash: DataTypes.STRING,
				admin: DataTypes.BOOLEAN,
				created_at: DataTypes.STRING,
				updated_at: DataTypes.STRING,
			},
			{
				sequelize,
				modelName: "Users",
				timestamps: false,
			},
		); /*
		models vai ter acesso direto ao banco de dados, ele e chamado por controller
		 e executa aquilo que foi chamado pra fazer
		 como criar um produto ou usuario
		 o models, tambem define o tipo de dados, dos campos configurados no banco de dados
		 */

		//Models tambem é a representação do banco de dados.

		this.addHook("beforeSave", async (user) => {
			if (user.password) {
				user.password_hash = await bcrypt.hash(user.password, 10);
			}
		});

		return this;
	}

	checkPassword(password) {
		const passhashed = bcrypt.compare(password, this.password_hash);
		return passhashed
	}
}

export default User;
