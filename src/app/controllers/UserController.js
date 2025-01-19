import {ValidationError, where} from "sequelize";
/**
 * store => cadastrar / adicionar
 * index => Listar Varios
 * show => Listar apenas um
 * update => atualizar
 * delete => deletar
 */
import {v4} from "uuid";
import User from "../models/User.js";

import * as yup from "yup";

const datas = new Date();

class UserController {
	async store(req, res) {
		const Schema = yup.object({
			name: yup
				.string()
				.strict(true)
				.matches(/^[A-Za-z\s]+$/, "O nome deve conter apenas letras"),
			email: yup.string().email().required(),
			admin: yup.boolean(),
			password: yup.string().required().min(6),
		});

		try {
			Schema.validateSync(req.body, {abortEarly: false});
		} catch (error) {
			return res.status(400).json({error: error.errors});
		}

		const {name, email, password, admin} = req.body;

		const userExist = await User.findOne({
			where: {
				email,
			},
		});

		if (userExist) {
			return res.status(400).json({error: "User ready exist!"});
			/* caso userExist retornar um valor positivo, que significaria 
			que existe um usuario com mesmo email, o codigo acima seria executado, 
			pulando todo codigo abaixo desse if por conta do return e mostrando uma mensagem de error
			*/

			/**
			 * caso userExist retorne um valor negativo, que significaria
			 * que n existe usuario nenhum com mesmo email, o if n seria executado, e o usuario seria
			 * cadastrado com sucesso.
			 */
		}

		try {
			const user = await User.create({
				id: v4(),
				name: name,
				email: email,
				admin: admin,
				password: password,
				created_at: String(datas.toDateString()),
				updated_at: String(datas.toDateString()),
			});
			return res.status(201).json({
				id: user.id,
				name: name,
				email: email,
				admin: admin,
			});
		} catch (error) {
			return res.status(404).send(console.log(error));
		}
	}

	async index(req, res){
		const getUser = await User.findAll()
		return res.status(201).json(getUser)
	}
}

export default new UserController();
