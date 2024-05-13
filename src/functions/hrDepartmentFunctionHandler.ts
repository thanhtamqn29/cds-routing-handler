import cds from "@sap/cds";
import { Handler, Req, Param, Action, Func, Use } from "cds-routing-handlers";
import { HrManagerService, ManagerService } from "../entities";
import { HandleMiddleware } from "../middlewares/handler.middleware";

@Handler()
export class HrManagerFunctionHandler {
    @Func(HrManagerService.FuncGetRequestsForHR.name)
    public async getRequestsForHR(@Req() req: any): Promise<void> {
        const { authentication } = req;
        const { staffName, department, startDay, endDay } = req.data;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if ((startDay && !endDay) || (!startDay && endDay)) return req.reject(400, "Searching by date must have both start day and end day");

        let startDate: Date;
        let endDate: Date;
        if (startDay && endDay) {
            if (!dateRegex.test(startDay) || !dateRegex.test(endDay)) {
                return req.reject(400, "Start day and end day must be in the yyyy-mm-dd format");
            }
            startDate = new Date(startDay + "T00:00:00Z");
            endDate = new Date(endDay + "T23:59:59Z");

            if (startDate >= endDate) return req.reject(400, "End day must be after start day");
        }
        const hrStaff = await cds.ql.SELECT.one
            .from("Users")
            .columns(col => {
                col.ID,
                    col.username,
                    col.fullName,
                    col.address,
                    col.department((department: ManagerService.IDepartments) => {
                        department.departmentName, department.isHRDepartment;
                    });
            })
            .where({
                ID: authentication.id,
            });

        if (hrStaff.department.isHRDepartment !== true) {
            return req.reply("You're not from the HR department");
        }
        const query = await SELECT.from("Requests").columns(col => {
            col.ID,
                col.status,
                col.reason,
                col.startDay,
                col.endDay,
                col.isOutOfDay,
                col.comment,
                col.user(user => {
                    user.ID, user.fullName, user.username as "username", user.address, user.isActive, user.role, user.dayOffThisYear, user.dayOffLastYear;
                });
        });
        const filteredRequests = query.filter(request => {
            let isMatch = true;
        
            // Lọc theo staffName
            if (staffName && !request.user.username.includes(staffName)) {
                isMatch = false;
            }
        
            // Lọc theo department
            if (department !== undefined && request.user.department.department_id !== department) {
                isMatch = false;
            }
        
            // Lọc theo startDay và endDay
            if (startDay && endDay) {
                const requestStartDate = new Date(request.startDay);
                const requestEndDate = new Date(request.endDay);
        
                if (requestStartDate < startDate || requestEndDate > endDate) {
                    isMatch = false;
                }
            }
        
            return isMatch;
        });
        req.results = {
            code: 200,
            data: filteredRequests,
        };
    }
}
