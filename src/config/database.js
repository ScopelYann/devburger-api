export default {
	//conexão entre o sequelize e o banco de dados postgres
	dialect: "postgres",
	host: "localhost",
	username: "postgres",
	password: "postgres",
	database: "devburger",

	define: {
		timestamps: false,
		underscored: true,
		undescoredAll: true,
	},
};