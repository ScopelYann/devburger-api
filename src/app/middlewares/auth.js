import jwt from "jsonwebtoken";
import authSecret from "../../config/auth.js";

function authMiddleware(req, res, next) {
	const authToken = req.headers.authorization; // pegamos o valor de autorization

	if (!authToken) {
		return res.status(401).json({error: "Token not provided!"}); // verificamos se existe
	}

	const tokenSplit = authToken.split(" ").at(1); // tiramos o bearer da string

	jwt.verify(tokenSplit, authSecret.secrect, (err, userInfo) => { // verificamos se o token e valido.
		if (err) {
			return res.status(403).json({error: "Invalid or expired token"}); // Resposta de erro se o token for inválido
		}

		req.userInfo = userInfo.id; // criamos um request com userinfo que pode ser usado em Controller
		req.userName = userInfo.name
		return next();
	});
}

export default authMiddleware;
