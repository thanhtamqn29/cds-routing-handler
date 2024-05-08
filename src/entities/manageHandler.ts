import { AfterRead, Handler, Use, Req, OnRead, AfterUpdate, BeforeUpdate, OnUpdate } from "cds-routing-handlers";
import { HandleMiddleware } from "../middlewares/handler.middleware";
import { ManagerService } from "../entities";
import { getAllDaysBetween, getDaysBeforeAfterApril, removeHolidays } from "../helpers/leaveDayCalculation";
import { notify } from "../helpers/notification";

@Handler(ManagerService.SanitizedEntity.RequestManage)
@Use(HandleMiddleware)
export class ManageHandler {
    @OnRead()
    public async requestHandler(@Req() req: any): Promise<any> {
        const { authentication } = req;

        const requests = await cds.ql.SELECT.from("Requests")
            .columns(col => {
                col.ID,
                    col.reason,
                    col.startDay,
                    col.endDay,
                    col.status,
                    col.isOutOfDay,
                    col.user((user: ManagerService.IUserManage) => {
                        user.ID, user.department_id, user.fullName, user.username;
                    });
            })
            .where(req.params.length > 0 ? { ID: req.params[0] } : "");
        const data = requests.filter((request: any) => request.user.department_id === authentication.department);
        req.results = data;
    }

    @OnUpdate()
    public async validManager(@Req() req: any) {
        const { authentication } = req;
        const request = await cds.ql.SELECT.one.from("Requests").where({ ID: req.params[0] });
        console.log(request);

        if (!request) req.error(404, "Couldn't find this request", "");

        if (request.status !== "pending") {
            req.error(400, `You have already ${request.status} this request!!`, "");
        }
        const member = await cds.ql.SELECT.one.from("Users").where({ ID: authentication.id });

        if (member.department_id !== authentication.department) req.error(400, "You're not the manager of this request!!!", "");

        await cds.ql.UPDATE("Requests").where({ ID: request.ID }).set({ status: req.data.status, comment: req.data.comment });
    }

    @AfterUpdate()
    public async removeTotalDayOff(@Req() req: any) {
        const { authentication } = req;
        const request = await cds.ql.SELECT.one.from("Requests").where({ ID: req.params[0] });
        const user = await cds.ql.SELECT.one.from("Users").where({ ID: authentication.id });

        let endDay = new Date(request.endDay + "T23:59:59Z");
        let startDay = new Date(request.startDay + "T00:00:00Z");

        const removeWeekend = getAllDaysBetween(startDay, endDay);
        const removeHoliday = await removeHolidays(removeWeekend);

        startDay = new Date(request.startDay + "T00:00:00Z");
        endDay = new Date(request.endDay + "T23:59:59Z");

        const startDayMonth = startDay.getMonth();
        const endDayMonth = endDay.getMonth();

        if (startDayMonth >= 3) user.dayOffLastYear = 0;

        if (!user.dayOffLastYear) {
            await cds.ql
                .UPDATE("Users")
                .where({ ID: request.user_ID })
                .set({
                    dayOffLastYear: 0,
                    dayOffThisYear: { "-=": removeHoliday.length },
                });
        } else {
            if (startDayMonth < 3 && endDayMonth == 3) {
                const { daysBeforeApril, daysAfterApril } = getDaysBeforeAfterApril(removeHoliday);
                const newDayOffLastYear = user.dayOffLastYear - daysBeforeApril;

                await cds.ql
                    .UPDATE("Users")
                    .set({ dayOffThisYear: { "-=": daysAfterApril } })
                    .where({ ID: user.ID });

                if (newDayOffLastYear >= 0) await cds.ql.UPDATE("Users").set({ dayOffLastYear: newDayOffLastYear }).where({ ID: user.ID });

                if (newDayOffLastYear < 0)
                    await cds.ql
                        .UPDATE("Users")
                        .set({
                            dayOffLastYear: 0,
                            dayOffThisYear: { "+=": newDayOffLastYear },
                        })
                        .where({ ID: user.ID });
            } else {
                const newDayOffLastYear = user.dayOffLastYear - removeHoliday.length;

                if (newDayOffLastYear >= 0)
                    await cds.ql
                        .UPDATE("Users")
                        .set({ dayOffLastYear: { "-=": removeHoliday.length } })
                        .where({ ID: user.ID });

                if (newDayOffLastYear < 0)
                    await cds.ql
                        .UPDATE("Users")
                        .set({
                            dayOffLastYear: 0,
                            dayOffThisYear: { "+=": newDayOffLastYear },
                        })
                        .where({ ID: user.ID });
            }
        }
        const response = await cds.ql.SELECT.one.from("Requests").where({ ID: req.params[0] });
        await notify({ response, authentication }, response.status);
        return req.reply({
            code: 200,
            message: "Updated successfully",
        });
    }
}
