import {
    Handler,
    Use,
    Req,
    AfterRead,
    Entities,
    BeforeRead,
    BeforeCreate,
    AfterCreate,
    BeforeUpdate,
    OnUpdate,
    BeforeDelete,
    OnDelete,
} from "cds-routing-handlers";
import { RequestsService } from "../entities";
import { request } from "express";
import { HandleMiddleware } from "../middlewares/handler.middleware";
import { getAllDaysBetween } from "../helpers/leaveDayCalculation";
import { cds_ql } from "@sap/cds/apis/ql";
import { notify } from "../helpers/notification";
@Handler(RequestsService.SanitizedEntity.Requests)
@Use(HandleMiddleware)
export class BookHandler {
    @BeforeCreate()
    @BeforeUpdate()
    public async checkrequestHandler(@Req() req: any): Promise<void> {
        const startDay = new Date(req.data.startDay);
        const endDay = new Date(req.data.endDay);
        const currentDate = new Date();

        if (startDay < currentDate || endDay < currentDate) {
            return req.error(400, "Start day and end day must be after the current date.", "");
        } else if (startDay >= endDay) {
            return req.error(400, "End day must be after start day.", "");
        }
    }

    @AfterCreate()
    public async updateRequestHandler(@Req() req: any): Promise<any> {
        const { data, authentication } = req;
        const user = await cds.ql.SELECT.one.from("Users").where({ ID: authentication.id });
        const daysOff = getAllDaysBetween(new Date(req.data.startDay), new Date(req.data.endDay)).length;
        if (daysOff > user.dayOffThisYear + user.dayOffLastYear) {
            await cds.ql.UPDATE("Requests").where({ ID: req.data.ID }).set({ isOutOfDay: true, user_ID: user.ID });
        } else {
            await cds.ql.UPDATE("Requests").where({ ID: req.data.ID }).set({ user_ID: user.ID });
        }
        const response = await cds.ql.SELECT.one.from("Requests").where({ ID: data.ID });

        await notify({ data: response, authentication }, "new");
        return req.reply({ code: 200, message: "Created successfully", data: req.reply });
    }

    @AfterRead()
    public async getRequestsHandler(@Req() req: any): Promise<any> {
        try {
            const { authentication } = req;
            const requests = await SELECT.from("Requests").where({ user_ID: authentication.id });
            return (req.results = requests);
        } catch (error) {
            return {
                code: 500,
                massage: error,
            };
        }
    }

    @OnUpdate()
    public async updateHandler(@Req() req: any): Promise<any> {
        try {
            const currentDate = new Date();
            const findRequest = await SELECT.one.from("Requests").where({ ID: req.data.ID });
            if (!findRequest) {
                return req.reject(404, "Couldn't find this request to update.");
            }
            if (findRequest.status !== "pending") {
                return req.reject(403, "Cannot update request");
            }
            if (req.data.startDay < currentDate || req.data.endDay < currentDate) {
                return req.reject(400, "Start day and end day must be after the current date.");
            } else if (req.data.endDay < req.data.startDay) {
                return req.reject(400, "End day must be after start day.");
            } else if (req.data.startDay > findRequest.endDay) {
                return req.reject(400, "Input start day invalid");
            } else if (req.data.endDay < findRequest.startDay) {
                return req.reject(400, "Input end day invalid");
            }

            const updateData: {
                reason?: string;
                startDay?: Date;
                endDay?: Date;
            } = {};
            if (req.data.reason !== undefined && req.data.reason !== null) {
                updateData.reason = req.data.reason;
            }
            if (req.data.startDay !== undefined && req.data.startDay !== null) {
                updateData.startDay = req.data.startDay;
            }
            if (req.data.endDay !== undefined && req.data.endDay !== null) {
                updateData.endDay = req.data.endDay;
            }

            if (Object.keys(updateData).length === 0) {
                return req.reject(400, "No valid fields provided for update.");
            }

            await cds.update("Requests").set(updateData).where({ ID: req.data.ID });
            const { data, authentication } = req;
            await notify({ data: data, authentication }, "update");
            return req.reply({
                code: 200,
                message: "Updated successfully",
            });
        } catch (error) {
            console.error("Error occurred during request update:", error);
            return req.reject(error.status || 500, error.message || "Internal Server Error");
        }
    }

    @BeforeDelete()
    public async deleteHanler(@Req() req: any): Promise<any> {
        try {
            const findRequest = await SELECT.one.from("Requests").where({ ID: req.data.ID });
            if (!findRequest) {
                return req.reject(404, "Request not found");
            }
            if (findRequest.status !== "pending") {
                return req.reject(403, "Cannot delete request");
            }
        } catch (error) {
            return req.reject(error.status || 500, error.message || "Internal Server Error");
        }
    }
}
