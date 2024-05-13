using {vacation as my} from '../db/schema';

service UsersService @(path:'/auth'){

    entity Users as projection on my.Users;
    action   login  (username : String, password : String)   returns String;


}
