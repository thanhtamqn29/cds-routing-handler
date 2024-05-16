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

        const userRequest = await cds.ql.SELECT.one.from("Users").where({ ID: request.user_ID});

        let endDay = request.endDay;
        let startDay = request.startDay;

        if(endDay === null){endDay = startDay;};
        const removeWeekend = getAllDaysBetween(startDay, endDay);
        const removeHoliday = await removeHolidays(removeWeekend);

        startDay = new Date(request.startDay + "T00:00:00Z");
        endDay = new Date(request.endDay + "T23:59:59Z");
        
        const startDayMonth = startDay.getMonth() + 1;
        const endDayMonth = endDay.getMonth() + 1;

        if (request.dayOffType === "HALF_DAY") {
            if (startDayMonth > 3) {
                await cds.ql
                    .UPDATE("Users")
                    .where({ ID: request.user_ID })
                    .set({
                        dayOffThisYear: { "-=": removeHoliday.length / 2 },
                    });
            } else {
                if (userRequest.dayOffLastYear > 0) {
                    if(userRequest.dayOffLastYear< 0.5){
                        console.log(0.5 -userRequest.dayOffLastYear);
                        
                        await cds.ql
                            .UPDATE("Users")
                            .where({ ID: userRequest.ID })
                            .set({                                      
                                dayOffThisYear: { "-=": 0.5 -userRequest.dayOffLastYear },
                                dayOffLastYear: 0,
                            });
                    }else{
                    await cds.ql
                        .UPDATE("Users")
                        .where({ ID: request.user_ID })
                        .set({
                            dayOffLastYear: { "-=": removeHoliday.length / 2 },
                        });
                    };
                } else {
                    await cds.ql
                        .UPDATE("Users")
                        .where({ ID: request.user_ID })
                        .set({
                            dayOffThisYear: { "-=": removeHoliday.length / 2 },
                        });
                };
            };
        };

        if (request.dayOffType === "FULL_DAY") {
            if (startDayMonth > 3) {
                await cds.ql
                    .UPDATE("Users")
                    .where({ ID: userRequest.ID })
                    .set({
                        dayOffThisYear: { "-=": removeHoliday.length },
                    });
            } else {
                if (userRequest.dayOffLastYear > 0) {
                    if(userRequest.dayOffLastYear< 1){  
                        await cds.ql
                            .UPDATE("Users")
                            .where({ ID: userRequest.ID })
                            .set({                                      
                                dayOffThisYear: { "-=": 1 -userRequest.dayOffLastYear },
                                dayOffLastYear: 0,
                            });
                    }else{
                    await cds.ql
                        .UPDATE("Users")
                        .where({ ID: request.user_ID })
                        .set({
                            dayOffLastYear: { "-=": removeHoliday.length  },
                        });
                    };
                } else {
                    await cds.ql
                        .UPDATE("Users")
                        .where({ ID: request.user_ID })
                        .set({
                            dayOffThisYear: { "-=": removeHoliday.length  },
                        });
                };
            };
        };

        if (request.dayOffType === "PERIOD_TIME") {
            if (startDayMonth < 3 && endDayMonth == 3) {
                const { daysBeforeApril, daysAfterApril } = getDaysBeforeAfterApril(removeHoliday);
                const newDayOffLastYear = userRequest.dayOffLastYear - daysBeforeApril;

                await cds.ql
                    .UPDATE("Users")
                    .set({ dayOffThisYear: { "-=": daysAfterApril } })
                    .where({ ID: userRequest.ID });

                if (newDayOffLastYear >= 0) await cds.ql.UPDATE("Users").set({ dayOffLastYear: newDayOffLastYear }).where({ ID: userRequest.ID });

                if (newDayOffLastYear < 0)
                    await cds.ql
                        .UPDATE("Users")
                        .set({
                            dayOffLastYear: 0,
                            dayOffThisYear: { "+=": newDayOffLastYear },
                        })
                        .where({ ID: userRequest.ID });
            } else {
                const newDayOffLastYear = userRequest.dayOffLastYear - removeHoliday.length;

                if (newDayOffLastYear >= 0)
                    await cds.ql
                        .UPDATE("Users")
                        .set({ dayOffLastYear: { "-=": removeHoliday.length } })
                        .where({ ID: userRequest.ID });

                if (newDayOffLastYear < 0)
                    await cds.ql
                        .UPDATE("Users")
                        .set({
                            dayOffLastYear: 0,
                            dayOffThisYear: { "+=": newDayOffLastYear },
                        })
                        .where({ ID: userRequest.ID });
            }
        }
        const data = await cds.ql.SELECT.one.from("Requests").where({ ID: req.params[0] });
        
        await notify({ data, authentication }, data.status);
        return req.reply({
            massage:"updated successfully"
        })
     
    }
}
