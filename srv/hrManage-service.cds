using { vacation as my } from '../db/schema';

service HrManagerService @(path: '/manage/manageHr') {
  entity Users as projection on my.Users;
  entity Requests as projection on my.Requests;
  function getRequestsForHR(staffName : String, department : String, startDay : String, endDay : String) returns String;
}
