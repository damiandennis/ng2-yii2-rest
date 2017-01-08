# Angular Yii2 REST

This module included two basic classes. 

In this example we have an endpoint "/api/v1/users" which returns registered users on the server.


- The first helps build a simple model which get populated by the second service class.
~~~typescript
import {BaseModel} from "ng2-yii2-rest";

export class UserModel extends BaseModel {
    
}

~~~
- The second is used to be extended by services. It requires three methods to be implemented and the angular http class injected.
  
~~~typescript
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {EndPointService} from "ng2-yii2-rest";
import {User} from "./user.model";

@Injectable()
export class UserService extends EndPointService {
    
  constructor(public http: Http) {}

  public endPointUrl(): string {
    return "/api/v1/users";
  }

  public initModel(data) {
    return new UserModel(data);
  }

  public primaryKey(): string {
    return "id";
  }

}
~~~

This allows us to consume the api is a nice easy way.

~~~typescript
import {Component} from "@angular/core";
import {UserService} from "./user.service";

@Component({
    moduleId: module.id,
    selector: "c-user-list",
    templateUrl: "users.component.html",
    providers: [UserService]
})

export class UsersComponent {

    public users: Array<UserModel>;

    constructor(userService: UserService) {
        this.userService
            .fetchAll()
            .subscribe(
                (data) => {
                    this.users = data.payload;
                },
                (err) => {
                    console.error(err);
                }
            );
    }
}
~~~
