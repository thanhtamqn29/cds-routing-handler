import { AfterCreate, AfterRead, BeforeCreate, BeforeRead, Handler, OnCreate, Req, Use } from "cds-routing-handlers";
import { HrManagerService, ManagerService } from "../entities";
import { HandleMiddleware } from "../middlewares/handler.middleware";
import { OnRead } from "cds-routing-handlers";

@Handler(HrManagerService.SanitizedEntity.Requests)
@Use(HandleMiddleware)
export class HrManageHandler {
    @AfterRead()
    public async searchForHrHandler(@Req() req: any): Promise<any> {
        console.log(req);
        
        console.log('///////////////////////////////////////////////////////');
        
        console.log(req.results);
        

//         const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        
//         // if ((startDay && !endDay) || (!startDay && endDay))
//         //         return req.reject(
//         //         400,
//         //         "Searching by date must have both start day and end day"
//         //         );
//         //         let startDate: Date;
//         //         let endDate : Date;
//         //         if (startDay && endDay) {
//         //           if (!dateRegex.test(startDay) || !dateRegex.test(endDay)) {
//         //             return req.reject(
//         //               400,
//         //               "Start day and end day must be in the yyyy-mm-dd format"
//         //             );
//         //           }
//         //           startDate = new Date(startDay + "T00:00:00Z");
//         //           endDate = new Date(endDay + "T23:59:59Z");
            
//         //           if (startDate >= endDate)
//         //             return req.reject(400, "End day must be after start day");
//         //         }

//         //         const hrStaff = await cds.ql.SELECT.one.from("Users").columns(col => {
//         //                 col.ID,
//         //                 col.username
//         //                 col.department((department: ManagerService.IDepartments)=> {
//         //                         department.id
//         //                         department.isHRDepartment
//         //                         department.departmentName
//         //             });
//         //         })
//         //         .where({
//         //           ID: authentication.id,
//         //         })
//         //         .and("department.isHRDepartment", "=", true);
//         //         console.log(hrStaff);
                
//         //         // if (!hrStaff) return req.reject(400, "You're not from the HR department");
          
//                 const requests = await cds.ql.SELECT.from("Requests").columns(col => {
//                         col.ID,
//                                 col.reason,
//                                 col.startDay,
//                                 col.endDay,
//                                 col.status,
//                                 col.isOutOfDay,
//                                 col.user((user: ManagerService.IUserManage) => {
//                                 user.ID, user.department_id, user.fullName, user.username;
//                                 });
//                         });
//                 console.log("CÓ CÁI NỊT", requests);
    }
}
