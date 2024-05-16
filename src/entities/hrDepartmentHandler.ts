import { AfterCreate, AfterRead, BeforeCreate, BeforeRead, Handler, OnCreate, Req, Use } from "cds-routing-handlers";
import { HrManagerService, ManagerService } from "../entities";
import { HandleMiddleware } from "../middlewares/handler.middleware";
import { OnRead } from "cds-routing-handlers";

@Handler(HrManagerService.SanitizedEntity.Requests)
@Use(HandleMiddleware)
export class HrManageHandler {
   
    }
