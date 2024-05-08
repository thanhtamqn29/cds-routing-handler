import cds from "@sap/cds";
import { Handler, Req, Param, Action } from "cds-routing-handlers";
import { UsersService } from "../entities";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwt";
@Handler()
export class FunctionHandler {
    @Action(UsersService.ActionLogin.name)
    public async loginHandler(@Req() req: any): Promise<void> {
        const user = await cds.read(UsersService.Entity.Users).where({
            username: req.data.username,
        });

        if (!user || user.length !== 1) {
            req.error(401, "Invalid username or password", "");
            return;
        }

        if (!(await bcrypt.compare(req.data.password, user[0].password))) {
            req.error(401, "Invalid password", "");
            return;
        }

        const accessToken = generateAccessToken(user[0]);
        const refreshToken = generateRefreshToken(user[0]);

        const updatedUser = await cds.update(UsersService.Entity.Users).where({ ID: user[0].ID }).set({ refreshToken: refreshToken });

        if (!updatedUser) {
            req.error(500, "Failed to update the user's token.", "");
            return;
        }

        return req.info({
            code: 200,
            message: "Login successfully",
            "access token": accessToken,
        });
    }
}
