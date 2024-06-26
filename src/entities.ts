export namespace vacation {
    export enum Role {
        staff,
        manager,
    }

    export enum Status {
        pending,
        accepted,
        rejected,
    }

    export interface IUsers {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        username: string;
        password: string;
        fullName: string;
        isActive?: boolean;
        address: string;
        role?: Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: IRequests[];
        department?: IDepartments;
        department_id?: number;
    }

    export enum RequestsDayOffType {
        FULL_DAY,
        HALF_DAY,
        PERIOD_TIME,
    }

    export enum RequestsLeavePeriod {
        MORNING,
        AFTERNOON,
    }

    export interface IRequests {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: Status;
        reason: string;
        user?: IUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        dayOffType: RequestsDayOffType;
        isOutOfDay?: boolean;
        comment?: string;
        leavePeriod: RequestsLeavePeriod;
        notification?: INotifications;
    }

    export interface INotifications {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        sender?: IUsers;
        sender_ID?: string;
        receiver?: IUsers;
        receiver_ID?: string;
        message: string;
        isRead?: boolean;
        request?: IRequests;
        request_ID?: string;
    }

    export interface IDepartments {
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: IUsers[];
        isActive?: boolean;
    }

    export interface ICalendar {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        startDay: Date;
        endDay: Date;
        holidayName: string;
    }

    export enum Entity {
        Users = "vacation.Users",
        Requests = "vacation.Requests",
        Notifications = "vacation.Notifications",
        Departments = "vacation.Departments",
        Calendar = "vacation.Calendar",
    }

    export enum SanitizedEntity {
        Users = "Users",
        Requests = "Requests",
        Notifications = "Notifications",
        Departments = "Departments",
        Calendar = "Calendar",
    }
}

export namespace sap.common {
    export interface ILanguages {
        name: string;
        descr: string;
        code: string;
        texts: ITexts[];
        localized?: ITexts;
    }

    export interface ICountries {
        name: string;
        descr: string;
        code: string;
        texts: ITexts[];
        localized?: ITexts;
    }

    export interface ICurrencies {
        name: string;
        descr: string;
        code: string;
        symbol: string;
        texts: ITexts[];
        localized?: ITexts;
    }

    export interface ITexts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export interface ITexts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export interface ITexts {
        locale: string;
        name: string;
        descr: string;
        code: string;
    }

    export enum Entity {
        Languages = "sap.common.Languages",
        Countries = "sap.common.Countries",
        Currencies = "sap.common.Currencies",
        Texts = "sap.common.Currencies.texts",
    }

    export enum SanitizedEntity {
        Languages = "Languages",
        Countries = "Countries",
        Currencies = "Currencies",
        Texts = "Texts",
    }
}

export namespace UsersService {
    export interface IUsers {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        username: string;
        password: string;
        fullName: string;
        isActive?: boolean;
        address: string;
        role?: vacation.Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: vacation.IRequests[];
        department?: vacation.IDepartments;
        department_id?: number;
    }

    export enum ActionLogin {
        name = "login",
        paramUsername = "username",
        paramPassword = "password",
    }

    export interface IActionLoginParams {
        username: string;
        password: string;
    }

    export type ActionLoginReturn = string;

    export enum Entity {
        Users = "UsersService.Users",
    }

    export enum SanitizedEntity {
        Users = "Users",
    }
}

export namespace HrManagerService {
    export interface IUsers {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        username: string;
        password: string;
        fullName: string;
        isActive?: boolean;
        address: string;
        role?: vacation.Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: IRequests[];
        department?: vacation.IDepartments;
        department_id?: number;
    }

    export enum RequestsDayOffType {
        FULL_DAY,
        HALF_DAY,
        PERIOD_TIME,
    }

    export enum RequestsLeavePeriod {
        MORNING,
        AFTERNOON,
    }

    export interface IRequests {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: vacation.Status;
        reason: string;
        user?: IUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        dayOffType: RequestsDayOffType;
        isOutOfDay?: boolean;
        comment?: string;
        leavePeriod: RequestsLeavePeriod;
        notification?: vacation.INotifications;
    }

    export interface IUserRequests {
        request_ID: string;
        request_status?: vacation.Status;
        user_ID: string;
        username: string;
        role?: vacation.Role;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        startDay: Date;
        endDay: Date;
        reason: string;
        comment?: string;
    }

    export enum FuncExportExcel {
        name = "exportExcel",
    }

    export type FuncExportExcelReturn = string;

    export enum Entity {
        Users = "HrManagerService.Users",
        Requests = "HrManagerService.Requests",
        UserRequests = "HrManagerService.UserRequests",
    }

    export enum SanitizedEntity {
        Users = "Users",
        Requests = "Requests",
        UserRequests = "UserRequests",
    }
}

export namespace ManagerService {
    export interface IUserManage {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        username: string;
        password: string;
        fullName: string;
        isActive?: boolean;
        address: string;
        role?: vacation.Role;
        refreshToken: string;
        dayOffThisYear?: number;
        dayOffLastYear?: number;
        requests?: IRequestManage[];
        department?: IDepartments;
        department_id?: number;
    }

    export interface IDepartments {
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        id: number;
        departmentName: string;
        isHRDepartment?: boolean;
        members?: IUserManage[];
        isActive?: boolean;
    }

    export interface ICalendar {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        startDay: Date;
        endDay: Date;
        holidayName: string;
    }

    export enum RequestManageDayOffType {
        FULL_DAY,
        HALF_DAY,
        PERIOD_TIME,
    }

    export enum RequestManageLeavePeriod {
        MORNING,
        AFTERNOON,
    }

    export interface IRequestManage {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: vacation.Status;
        reason: string;
        user?: IUserManage;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        dayOffType: RequestManageDayOffType;
        isOutOfDay?: boolean;
        comment?: string;
        leavePeriod: RequestManageLeavePeriod;
        notification?: vacation.INotifications;
    }

    export enum ActionInviteMember {
        name = "inviteMember",
        paramMembers = "members",
    }

    export interface IActionInviteMemberParams {
        members: string[];
    }

    export type ActionInviteMemberReturn = string;

    export enum Entity {
        UserManage = "ManagerService.UserManage",
        Departments = "ManagerService.Departments",
        Calendar = "ManagerService.Calendar",
        RequestManage = "ManagerService.RequestManage",
    }

    export enum SanitizedEntity {
        UserManage = "UserManage",
        Departments = "Departments",
        Calendar = "Calendar",
        RequestManage = "RequestManage",
    }
}

export namespace RequestsService {
    export enum RequestsDayOffType {
        FULL_DAY,
        HALF_DAY,
        PERIOD_TIME,
    }

    export enum RequestsLeavePeriod {
        MORNING,
        AFTERNOON,
    }

    export interface IRequests {
        ID: string;
        createdAt?: Date;
        createdBy?: string;
        modifiedAt?: Date;
        modifiedBy?: string;
        status?: vacation.Status;
        reason: string;
        user?: vacation.IUsers;
        user_ID?: string;
        startDay: Date;
        endDay: Date;
        dayOffType: RequestsDayOffType;
        isOutOfDay?: boolean;
        comment?: string;
        leavePeriod: RequestsLeavePeriod;
        notification?: vacation.INotifications;
    }

    export enum Entity {
        Requests = "RequestsService.Requests",
    }

    export enum SanitizedEntity {
        Requests = "Requests",
    }
}

export type User = string;

export enum Entity {}

export enum SanitizedEntity {}
