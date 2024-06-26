import { Handler, Req, AfterRead, Entities, BeforeRead, BeforeCreate, AfterCreate } from "cds-routing-handlers";
import { UsersService } from "../entities";
import { request } from "express";
import bcrypt from "bcrypt";
import { calculateVacationDays } from "../helpers/leaveDayCalculation";
@Handler(UsersService.SanitizedEntity.Users)
export class AuthHandler {
    @BeforeCreate()
    public async sign_upHandler(@Entities() request: UsersService.IUsers[], @Req() req: any): Promise<void> {
        const { data } = req;
        const isInSystem = await SELECT.one.from("Users").where({ username: data.username });

        if (isInSystem) {
            req.reject(400, "User is already in the system");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;
    }

    @AfterCreate()
    public async updateDayoffThisYear(@Req() req: any):Promise<any> {
            const {results} = req;
            const user = await cds.ql.SELECT.one.from("Users").where({id: results.ID});     
            calculateVacationDays(user.ID);
            return req.results = {
                code: 201,
                message: "Welcome to the system!",
              };
    }
}
