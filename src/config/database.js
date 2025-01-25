export default {
	//conexão entre o sequelize e o banco de dados postgres
	dialect: "postgres",
	host: "127.0.0.1",
	username: "postgres",
	password: "postgres",
	database: "devburger",

	define: {
		timestamps: false,
		underscored: true,
		undescoredAll: true,
	},
};