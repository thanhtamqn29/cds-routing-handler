using {vacation as my} from '../db/schema';

service ManagerService @(path: '/manage') {

  entity UserManage    as projection on my.Users;
  entity Departments   as projection on my.Departments;
  entity Calendar      as projection on my.Calendar;
  entity RequestManage as projection on my.Requests;
  action inviteMember(members :   array of String   ) returns String;
}
