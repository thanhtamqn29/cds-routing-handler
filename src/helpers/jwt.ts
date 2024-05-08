import * as jwt from "jsonwebtoken";
import * as env from "dotenv";
import { UsersService} from "../entities";


env.configDotenv();
const accessTokenKey = process.env.ACCESS_TOKEN;
const refreshTokenKey = process.env.REFRESH_TOKEN;



const generateAccessToken = (user: UsersService.IUsers) => {
    return jwt.sign(
        {
            id: user.ID,
            role: user.role,
        },
        accessTokenKey,
        { expiresIn: "30d" }
    );
};

const generateRefreshToken = (user: UsersService.IUsers) => {
    return jwt.sign(
        {
            id: user.ID,
            role: user.role,
        },
        refreshTokenKey,
        { expiresIn: "30d" }
    );
};

const verifyAccessToken = (token: string) => {
    if (!token) return;



    try {
        const decoded = jwt.verify(token, accessTokenKey);
        return decoded;
    } catch (err) {
        const decoded : string | jwt.JwtPayload = jwt.decode(token);
        return  decoded ? (decoded as jwt.JwtPayload).id : null;
    }
};
const verifyRefreshToken = (token: string) => {
    if (!token) return;
    try {
        const decoded = jwt.verify(token, refreshTokenKey);
        return decoded;
    } catch (err) {
        const decoded = jwt.decode(token);
        return decoded;
    }
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };