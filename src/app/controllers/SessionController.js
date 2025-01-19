import jwt from "jsonwebtoken";
import * as yup from "yup";
import auth from "../../config/auth.js";
import User from "../models/User.js";

class SessionController {
  async store(req, res) {
    const Schema = yup.object({
      email: yup.string().email().required(),
      password: yup.string().required().min(6),
    });

    const isValid = await Schema.isValid(req.body);

    console.log(isValid);

    const emailOrPasswordIncorrect = () => {
      return res
        .status(401)
        .json({ error: "Make sure your email or password are correct" });
    };

    if (!isValid) {
      //validation!!!!!!!!!!!!!!
      return emailOrPasswordIncorrect();
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    }); // retorna 0, undefined ou null caso seja false/ caso seja verdadeiro 1, array ou object

    if (!user) {
      //validation!!!!!!!!!!!!!!!!!!!!!

      //caso n exista um usuario com o email que veio em req.body, ele vem como false e o if inverte para que o erro seja validado
      return emailOrPasswordIncorrect();
    }

    const IsSamePassword = await user.checkPassword(password);

    if (!IsSamePassword) {
      //validation!!!!!!!!!!!!
      return emailOrPasswordIncorrect();
    }

    if (isValid && user && IsSamePassword) {
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        token: jwt.sign({ id: user.id, name: user.name }, auth.secrect, {
          expiresIn: auth.expiresIn,
        }),
      });
    }
  }
}

export default new SessionController();
