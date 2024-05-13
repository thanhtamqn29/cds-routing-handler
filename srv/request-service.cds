using {vacation as my} from '../db/schema';

service RequestsService @(path:'/request'){

  entity Requests as projection on my.Requests;
}
