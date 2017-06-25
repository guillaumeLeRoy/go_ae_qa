webpackJsonp([0,3],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__environments_environment__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__firebase_service__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__model_Coach__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__model_HR__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__model_PotentialCoachee__ = __webpack_require__(232);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var AuthService = AuthService_1 = (function () {
    function AuthService(firebase, router, httpService) {
        this.firebase = firebase;
        this.router = router;
        this.httpService = httpService;
        this.onAuthStateChangedCalled = false;
        // private user: User
        this.isUserAuth = new __WEBPACK_IMPORTED_MODULE_2_rxjs__["BehaviorSubject"](false); //NOT auth by default
        // private ApiUserSubject = new BehaviorSubject<ApiUser>(null);//NOT auth by default
        this.ApiUserSubject = new __WEBPACK_IMPORTED_MODULE_2_rxjs__["Subject"](); //NOT auth by default
        /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
        this.isSignInOrUp = false;
        this.ApiUser = null;
        firebase.auth().onAuthStateChanged(function (user) {
            console.log("onAuthStateChanged, user : " + user);
            this.onAuthStateChangedCalled = true;
            this.updateAuthStatus(user);
        }.bind(this));
        console.log("ctr done");
    }
    /*
     * Get connected user from backend
     */
    AuthService.prototype.refreshConnectedUser = function () {
        console.log("refreshConnectedUser");
        if (this.ApiUser != null) {
            if (this.ApiUser instanceof __WEBPACK_IMPORTED_MODULE_7__model_Coach__["a" /* Coach */]) {
                return this.fetchCoach(this.ApiUser.id);
            }
            else if (this.ApiUser instanceof __WEBPACK_IMPORTED_MODULE_8__model_Coachee__["a" /* Coachee */]) {
                return this.fetchCoachee(this.ApiUser.id);
            }
            else if (this.ApiUser instanceof __WEBPACK_IMPORTED_MODULE_9__model_HR__["a" /* HR */]) {
                return this.fetchRh(this.ApiUser.id);
            }
        }
        else {
            console.log("refreshConnectedUser, no connected user");
        }
        return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].from(null);
    };
    AuthService.prototype.fetchCoach = function (userId) {
        var _this = this;
        var param = [userId];
        var obs = this.get(AuthService_1.GET_COACH_FOR_ID, param);
        return obs.map(function (res) {
            console.log("fetchCoach, obtained from API : ", res);
            var coach = _this.parseCoach(res.json());
            _this.onAPIuserObtained(coach, _this.ApiUser.firebaseToken);
            return coach;
        });
    };
    AuthService.prototype.fetchCoachee = function (userId) {
        var _this = this;
        var param = [userId];
        var obs = this.get(AuthService_1.GET_COACHEE_FOR_ID, param);
        return obs.map(function (res) {
            console.log("fetchCoachee, obtained from API : ", res);
            var coachee = _this.parseCoachee(res.json());
            _this.onAPIuserObtained(coachee, _this.ApiUser.firebaseToken);
            return coachee;
        });
    };
    AuthService.prototype.fetchRh = function (userId) {
        var _this = this;
        var param = [userId];
        var obs = this.get(AuthService_1.GET_RH_FOR_ID, param);
        return obs.map(function (res) {
            console.log("fetchRh, obtained from API : ", res);
            var rh = _this.parseRh(res.json());
            _this.onAPIuserObtained(rh, _this.ApiUser.firebaseToken);
            return rh;
        });
    };
    AuthService.prototype.getConnectedUser = function () {
        return this.ApiUser;
    };
    AuthService.prototype.getConnectedUserObservable = function () {
        return this.ApiUserSubject.asObservable();
    };
    AuthService.prototype.isAuthenticated = function () {
        return this.isUserAuth.asObservable();
    };
    AuthService.prototype.post = function (path, params, body) {
        var _this = this;
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                return _this.httpService.post(_this.generatePath(path, params), body, { headers: headers });
            });
        });
        return method;
    };
    AuthService.prototype.postNotAuth = function (path, params, body) {
        return this.httpService.post(this.generatePath(path, params), body);
    };
    AuthService.prototype.put = function (path, params, body) {
        var _this = this;
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                return _this.httpService.put(_this.generatePath(path, params), body, { headers: headers });
            });
        });
        return method;
    };
    AuthService.prototype.get = function (path, params) {
        return this.getWithSearchParams(path, params, null);
    };
    AuthService.prototype.getWithSearchParams = function (path, params, searchParams) {
        var _this = this;
        console.log("1. get");
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                console.log("4. start request");
                return _this.httpService.get(_this.generatePath(path, params), { headers: headers, search: searchParams });
            });
        });
        return method;
    };
    AuthService.prototype.delete = function (path, params) {
        var _this = this;
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                console.log("4. start request");
                return _this.httpService.delete(_this.generatePath(path, params), { headers: headers });
            });
        });
        return method;
    };
    AuthService.prototype.getNotAuth = function (path, params) {
        console.log("getNotAuth, start request");
        return this.httpService.get(this.generatePath(path, params)).map(function (res) {
            console.log("getNotAuth, got user", res);
            return res;
        }, function (error) {
            console.log("getNotAuth, error", error);
        });
    };
    AuthService.prototype.getPotentialCoachee = function (path, params) {
        var _this = this;
        return this.httpService.get(this.generatePath(path, params)).map(function (res) {
            return _this.parsePotentialCoachee(res.json());
        });
    };
    AuthService.prototype.getConnectedApiUser = function () {
        console.log("2. getConnectedApiUser");
        if (this.ApiUser) {
            console.log("getConnectedApiUser, user OK");
            return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(this.ApiUser);
        }
        else {
            console.log("getConnectedApiUser, NO user");
            //check if onAuthStateChanged was called
            if (this.onAuthStateChangedCalled) {
                console.log("getConnectedApiUser, user state changed already call");
                //now we know we really don't have a user
                return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].throw('No current user');
            }
            else {
                console.log("getConnectedApiUser, wait for change state");
                return this.ApiUserSubject.map(function (apiUser) {
                    if (apiUser) {
                        console.log("getConnectedApiUser, got event, with user");
                        return apiUser;
                    }
                    else {
                        console.log("getConnectedApiUser, got event, no user after state change");
                        return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].throw('No user after state changed');
                    }
                });
            }
        }
    };
    AuthService.prototype.getHeader = function (user) {
        console.log("getHeader");
        if (user) {
            // console.log("getHeader, currentUser : ", user);
            var token = user.firebaseToken;
            if (token) {
                // console.log("getHeader, token : ", token);
                var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["d" /* Headers */]();
                headers.append('Authorization', 'Bearer ' + token);
                return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(headers);
            }
            else {
                return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].throw('No token');
            }
        }
        else {
            console.log("getHeader, NO user");
            return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].throw('No current user');
        }
    };
    AuthService.prototype.generatePath = function (path, params) {
        // console.log("generatePath, path : ", path);
        // console.log("generatePath, params : ", params);
        var completedPath = "";
        var segs = path.split("/");
        var paramIndex = 0;
        for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
            var seg = segs_1[_i];
            if (seg == "" || seg == null) {
                continue;
            }
            // console.log("generatePath, seg : ", seg);
            // console.log("generatePath, paramIndex : ", paramIndex);
            completedPath += "/";
            if (seg.charAt(0) == ":") {
                completedPath += params[paramIndex];
                paramIndex++;
            }
            else {
                completedPath += seg;
            }
        }
        //always add a "/" at the end
        completedPath += "/";
        // console.log("generatePath, completedPath : ", completedPath);
        // console.log("generatePath, BACKEND_BASE_URL : ", environment.BACKEND_BASE_URL);
        var finalUrl = __WEBPACK_IMPORTED_MODULE_5__environments_environment__["a" /* environment */].BACKEND_BASE_URL + completedPath;
        console.log("generatePath, finalUrl : ", finalUrl);
        return finalUrl;
    };
    AuthService.prototype.updateAuthStatus = function (fbUser) {
        var _this = this;
        console.log("updateAuthStatus isSignInOrUp : ", this.isSignInOrUp);
        if (this.isSignInOrUp) {
            return;
        }
        console.log("updateAuthStatus user : ", fbUser);
        if (fbUser) {
            if (this.ApiUser == null) {
                console.log("updateAuthStatus, get A USER");
                var firebaseObs = __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__["PromiseObservable"].create(fbUser.getToken());
                firebaseObs.subscribe(function (token) {
                    //get user from API
                    _this.getUserForFirebaseId(fbUser.uid, token).subscribe();
                });
            }
            else {
                console.log("updateAuthStatus already have a user API");
            }
        }
        else {
            console.log("updateAuthStatus NO user");
            this.ApiUser = null;
            this.ApiUserSubject.next(null);
            this.isUserAuth.next(false);
        }
    };
    /* when we obtained a User from the API ( coach or coachee ) */
    AuthService.prototype.onAPIuserObtained = function (user, firebaseToken) {
        console.log("onAPIuserObtained, user : ", user);
        if (user) {
            //keep current user
            this.ApiUser = user;
            //save token
            this.ApiUser.firebaseToken = firebaseToken;
            //dispatch
            this.ApiUserSubject.next(user);
            this.isUserAuth.next(true);
        }
        else {
            this.ApiUserSubject.next(null);
            this.isUserAuth.next(false);
        }
        return user;
    };
    AuthService.prototype.getUserForFirebaseId = function (firebaseId, token) {
        var _this = this;
        console.log("getUserForFirebaseId : ", firebaseId);
        var params = [firebaseId];
        var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["d" /* Headers */]();
        headers.append('Authorization', 'Bearer ' + token);
        return this.httpService.get(this.generatePath(AuthService_1.LOGIN, params), { headers: headers }).map(function (response) {
            var apiUser = response.json();
            var res = _this.parseAPIuser(apiUser);
            console.log("getUserForFirebaseId, apiUser : ", apiUser);
            // console.log("getUserForFirebaseId, token : ", token);
            return _this.onAPIuserObtained(res, token);
        });
    };
    AuthService.prototype.signUpCoach = function (user) {
        return this.signup(user, AuthService_1.POST_SIGN_UP_COACH);
    };
    AuthService.prototype.signUpCoachee = function (user) {
        //add plan
        return this.signup(user, AuthService_1.POST_SIGN_UP_COACHEE);
    };
    AuthService.prototype.signUpRh = function (user) {
        return this.signup(user, AuthService_1.POST_SIGN_UP_RH);
    };
    AuthService.prototype.signup = function (user, path) {
        var _this = this;
        console.log("1. user signUp : ", user);
        this.isSignInOrUp = true;
        //create user with email and pwd
        var firebasePromise = this.firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(function (fbUser) {
            console.log("2. authService, user sign up, success : ", fbUser);
            //user successfully sign up in Firebase
            console.log("3. fb user, start getToken");
            return fbUser.getToken();
        });
        var firebaseObs = __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__["PromiseObservable"].create(firebasePromise);
        return firebaseObs.flatMap(function (token) {
            //user should be ok just after a sign up
            var fbUser = _this.firebase.auth().currentUser;
            var body = {
                email: fbUser.email,
                uid: fbUser.uid,
                plan_id: user.contractPlanId
            };
            var params = [fbUser.uid];
            var headers = new __WEBPACK_IMPORTED_MODULE_4__angular_http__["d" /* Headers */]();
            headers.append('Authorization', 'Bearer ' + token);
            // start sign up request
            return _this.httpService.post(_this.generatePath(path, params), body, { headers: headers })
                .map(function (response) {
                var loginResponse = response.json();
                console.log("signUp, loginResponse : ", loginResponse);
                // return json;
                _this.isSignInOrUp = false;
                return _this.onAPIuserObtained(_this.parseAPIuser(loginResponse), token);
            });
        });
    };
    AuthService.prototype.parseAPIuser = function (response) {
        console.log("parseAPIuser, response :", response);
        if (response.coach) {
            var coach = response.coach;
            //coach
            return this.parseCoach(coach);
        }
        else if (response.coachee) {
            var coachee = response.coachee;
            //coachee
            return this.parseCoachee(coachee);
        }
        else if (response.rh) {
            var rh = response.rh;
            return this.parseRh(rh);
        }
        return null;
    };
    AuthService.prototype.parseCoach = function (json) {
        var coach = new __WEBPACK_IMPORTED_MODULE_7__model_Coach__["a" /* Coach */](json.id);
        coach.email = json.email;
        coach.firstName = json.firstName;
        coach.lastName = json.lastName;
        coach.avatar_url = json.avatar_url;
        coach.start_date = json.start_date;
        coach.description = json.description;
        coach.chat_room_url = json.chat_room_url;
        return coach;
    };
    AuthService.prototype.parseCoachee = function (json) {
        // TODO : don't really need to manually parse the received Json
        var coachee = new __WEBPACK_IMPORTED_MODULE_8__model_Coachee__["a" /* Coachee */](json.id);
        coachee.id = json.id;
        coachee.email = json.email;
        coachee.firstName = json.firstName;
        coachee.lastName = json.lastName;
        coachee.avatar_url = json.avatar_url;
        coachee.start_date = json.start_date;
        coachee.selectedCoach = json.selectedCoach;
        coachee.contractPlan = json.plan;
        coachee.availableSessionsCount = json.available_sessions_count;
        coachee.updateAvailableSessionCountDate = json.update_sessions_count_date;
        coachee.associatedRh = json.associatedRh;
        coachee.last_objective = json.last_objective;
        return coachee;
    };
    AuthService.prototype.parseRh = function (json) {
        var rh = new __WEBPACK_IMPORTED_MODULE_9__model_HR__["a" /* HR */](json.id);
        rh.email = json.email;
        rh.firstName = json.firstName;
        rh.lastName = json.lastName;
        rh.start_date = json.start_date;
        rh.avatar_url = json.avatar_url;
        return rh;
    };
    AuthService.prototype.parsePotentialCoachee = function (json) {
        var potentialCoachee = new __WEBPACK_IMPORTED_MODULE_10__model_PotentialCoachee__["a" /* PotentialCoachee */](json.id);
        potentialCoachee.email = json.email;
        potentialCoachee.start_date = json.create_date;
        potentialCoachee.plan = json.plan;
        return potentialCoachee;
    };
    AuthService.prototype.signIn = function (user) {
        var _this = this;
        console.log("1. user signIn : ", user);
        this.isSignInOrUp = true;
        //fb sign in with email and pwd
        var firebasePromise = this.firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then(function (fbUser) {
            console.log("2. authService, user sign up, success : ", fbUser);
            //user successfully sign up in Firebase
            console.log("3. fb user, start getToken");
            return fbUser.getToken();
        });
        var firebaseObs = __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_PromiseObservable__["PromiseObservable"].create(firebasePromise);
        return firebaseObs.flatMap(function (token) {
            //user should be ok just after a sign up
            var fbUser = _this.firebase.auth().currentUser;
            //now sign up in AppEngine
            _this.isSignInOrUp = false;
            return _this.getUserForFirebaseId(fbUser.uid, token);
        });
    };
    AuthService.prototype.loginOut = function () {
        console.log("user loginOut");
        this.firebase.auth().signOut();
        this.updateAuthStatus(null);
        this.router.navigate(['/welcome']);
    };
    AuthService.prototype.updateCoacheeForId = function (id, firstName, lastName, avatarUrl) {
        console.log("updateCoacheeForId, id", id);
        var body = {
            first_name: firstName,
            last_name: lastName,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_COACHEE, params, body).map(function (response) {
            //return thing s -e glrs.onUserResponse(response);
            return null;
        });
    };
    AuthService.prototype.updateCoachForId = function (id, firstName, lastName, description, avatarUrl) {
        console.log("updateCoachDisplayNameForId, id", id);
        var body = {
            first_name: firstName,
            last_name: lastName,
            description: description,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_COACH, params, body).map(function (response) {
            //convert to coach
            // return this.onUserResponse(response);
            return null;
        });
    };
    // /**
    //  *
    //  * @param coacheeId
    //  * @param coachId
    //  * @returns {Observable<Coachee>}
    //  */
    // updateCoacheeSelectedCoach(coacheeId: string, coachId: string): Observable<Coachee> {
    //   console.log("updateCoacheeSelectedCoach, coacheeId", coacheeId);
    //   console.log("updateCoacheeSelectedCoach, coachId", coachId);
    //
    //   let params = [coacheeId, coachId];
    //   return this.put(AuthService.UPDATE_COACHEE_SELECTED_COACH, params, null).map(
    //     (response: Response) => {
    //       //convert to coachee
    //       return this.parseCoachee(response.json());
    //     });
    // }
    /**
     *
     * @param response
     * @returns {Coach|Coachee}
     */
    AuthService.prototype.onUserResponse = function (response) {
        var json = response.json();
        console.log("onUserResponse, response json : ", json);
        var res = this.parseAPIuser(json);
        console.log("onUserResponse, parsed user : ", res);
        //dispatch
        return this.onAPIuserObtained(res, this.ApiUser.firebaseToken);
    };
    return AuthService;
}());
/* contract plan*/
AuthService.GET_CONTRACT_PLANS = "/v1/plans/";
AuthService.POST_POTENTIAL_COACHEE = "/v1/potentials/coachees";
AuthService.POST_POTENTIAL_COACH = "/v1/potentials/coachs";
AuthService.POST_POTENTIAL_RH = "/v1/potentials/rhs";
AuthService.LOGIN = "/login/:firebaseId";
AuthService.GET_POTENTIAL_COACHEE_FOR_TOKEN = "/v1/potentials/coachees/:token";
AuthService.GET_POTENTIAL_COACH_FOR_TOKEN = "/v1/potentials/coachs/:token";
AuthService.GET_POTENTIAL_RH_FOR_TOKEN = "/v1/potentials/rhs/:token";
/* coachee */
AuthService.UPDATE_COACHEE = "v1/coachees/:id";
AuthService.POST_SIGN_UP_COACHEE = "/v1/coachees";
AuthService.GET_COACHEES = "/v1/coachees";
AuthService.GET_COACHEE_FOR_ID = "/v1/coachees/:id";
AuthService.GET_COACHEE_NOTIFICATIONS = "/v1/coachees/:id/notifications";
AuthService.PUT_COACHEE_NOTIFICATIONS_READ = "/v1/coachees/:id/notifications/read";
/* coach */
AuthService.UPDATE_COACH = "/v1/coachs/:id";
AuthService.POST_SIGN_UP_COACH = "/v1/coachs";
AuthService.GET_COACHS = "/v1/coachs";
AuthService.GET_COACH_FOR_ID = "/v1/coachs/:id";
AuthService.GET_COACH_NOTIFICATIONS = "/v1/coachs/:id/notifications";
AuthService.PUT_COACH_NOTIFICATIONS_READ = "/v1/coachs/:id/notifications/read";
/* HR */
AuthService.POST_SIGN_UP_RH = "/v1/rhs";
AuthService.GET_COACHEES_FOR_RH = "/v1/rhs/:uid/coachees";
AuthService.GET_POTENTIAL_COACHEES_FOR_RH = "/v1/rhs/:uid/potentials";
AuthService.GET_RH_FOR_ID = "/v1/rhs/:id";
AuthService.GET_USAGE_RATE_FOR_RH = "/v1/rhs/:id/usage";
AuthService.GET_RH_NOTIFICATIONS = "/v1/rhs/:id/notifications";
AuthService.PUT_RH_NOTIFICATIONS_READ = "/v1/rhs/:id/notifications/read";
AuthService.POST_COACHEE_OBJECTIVE = "/v1/rhs/:uidRH/coachees/:uidCoachee/objective"; //create new objective for this coachee
/* admin */
AuthService.GET_ADMIN = "/v1/admins/user";
AuthService.ADMIN_GET_COACHS = "/v1/admins/coachs";
AuthService.ADMIN_GET_COACHEES = "/v1/admins/coachees";
AuthService.ADMIN_GET_RHS = "/v1/admins/rhs";
/*Meeting*/
AuthService.POST_MEETING = "/meeting";
AuthService.DELETE_MEETING = "/meeting/:meetingId";
AuthService.GET_MEETING_REVIEWS = "/meeting/:meetingId/reviews";
AuthService.PUT_MEETING_REVIEW = "/v1/meetings/:meetingId/reviews"; //add or replace meeting review
AuthService.DELETE_MEETING_REVIEW = "/meeting/reviews/:reviewId"; //delete review
AuthService.CLOSE_MEETING = "/v1/meetings/:meetingId/close"; // close meeting
AuthService.GET_MEETINGS_FOR_COACHEE_ID = "/meetings/coachee/:coacheeId";
AuthService.GET_MEETINGS_FOR_COACH_ID = "/meetings/coach/:coachId";
AuthService.POST_MEETING_POTENTIAL_DATE = "/meeting/:meetingId/potential";
AuthService.GET_MEETING_POTENTIAL_DATES = "/meeting/:meetingId/potentials";
AuthService.PUT_POTENTIAL_DATE_TO_MEETING = "/meeting/potential/:potentialId"; //update potential date
AuthService.DELETE_POTENTIAL_DATE = "/meeting/potentials/:potentialId"; //delete potential date
AuthService.PUT_FINAL_DATE_TO_MEETING = "/meeting/:meetingId/date/:potentialId"; //set the potential date as the meeting selected date
AuthService.GET_AVAILABLE_MEETINGS = "/v1/meetings"; //get available meetings ( meetings with NO coach associated )
AuthService.PUT_COACH_TO_MEETING = "/v1/meeting/:meetingId/coach/:coachId"; //associate coach with meeting
AuthService = AuthService_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_6__firebase_service__["a" /* FirebaseService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__firebase_service__["a" /* FirebaseService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_http__["b" /* Http */]) === "function" && _c || Object])
], AuthService);

var AuthService_1, _a, _b, _c;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/auth.service.js.map

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__environments_environment__ = __webpack_require__(61);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AdminComponent = (function () {
    function AdminComponent(router, adminHttpService, cd) {
        this.router = router;
        this.adminHttpService = adminHttpService;
        this.cd = cd;
    }
    AdminComponent.prototype.ngOnInit = function () {
        this.getAdmin();
    };
    AdminComponent.prototype.getAdmin = function () {
        var _this = this;
        if (__WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].production) {
            this.adminHttpService.getAdmin().subscribe(function (admin) {
                console.log('getAdmin, obtained', admin);
                _this.admin = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(admin);
                _this.cd.detectChanges();
            }, function (error) {
                console.log('getAdmin, error obtained', error);
            });
        }
    };
    AdminComponent.prototype.navigateAdminHome = function () {
        console.log("navigateAdminHome");
        this.router.navigate(['/admin']);
    };
    AdminComponent.prototype.navigateToSignup = function () {
        console.log("navigateToSignup");
        this.router.navigate(['admin/signup']);
    };
    AdminComponent.prototype.navigateToCoachsList = function () {
        console.log("navigateToCoachsList");
        this.router.navigate(['admin/coachs-list']);
    };
    AdminComponent.prototype.navigateToCoacheesList = function () {
        console.log("navigateToCoacheesList");
        this.router.navigate(['admin/coachees-list']);
    };
    AdminComponent.prototype.navigateToRhsList = function () {
        console.log("navigateToRhsList");
        this.router.navigate(['admin/rhs-list']);
    };
    return AdminComponent;
}());
AdminComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-admin',
        template: __webpack_require__(626),
        styles: [__webpack_require__(585)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object])
], AdminComponent);

var _a, _b, _c;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin.component.js.map

/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__ = __webpack_require__(60);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoacheesListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CoacheesListComponent = (function () {
    function CoacheesListComponent(apiService, cd) {
        this.apiService = apiService;
        this.cd = cd;
    }
    CoacheesListComponent.prototype.ngOnInit = function () {
    };
    CoacheesListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    CoacheesListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoacheesSub != null) {
            this.getAllCoacheesSub.unsubscribe();
        }
    };
    CoacheesListComponent.prototype.fetchData = function () {
        var _this = this;
        this.getAllCoacheesSub = this.apiService.getCoachees().subscribe(function (coachees) {
            console.log('getAllCoachees subscribe, coachees : ', coachees);
            //filter coachee with NO selected coachs
            var notAssociatedCoachees = new Array();
            for (var _i = 0, coachees_1 = coachees; _i < coachees_1.length; _i++) {
                var coachee = coachees_1[_i];
                if (coachee.selectedCoach == null) {
                    notAssociatedCoachees.push(coachee);
                }
            }
            _this.coachees = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(notAssociatedCoachees);
            _this.cd.detectChanges();
        });
    };
    return CoacheesListComponent;
}());
CoacheesListComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-coachees-list',
        template: __webpack_require__(627),
        styles: [__webpack_require__(586)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object])
], CoacheesListComponent);

var _a, _b;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/coachees-list.component.js.map

/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__ = __webpack_require__(60);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminCoachsListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdminCoachsListComponent = (function () {
    function AdminCoachsListComponent(apiService, cd) {
        this.apiService = apiService;
        this.cd = cd;
    }
    AdminCoachsListComponent.prototype.ngOnInit = function () {
    };
    AdminCoachsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminCoachsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoachsSub != null) {
            this.getAllCoachsSub.unsubscribe();
        }
    };
    AdminCoachsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.getAllCoachsSub = this.apiService.getCoachs().subscribe(function (coachs) {
            console.log('getAllCoachs subscribe, coachs : ', coachs);
            _this.coachs = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(coachs);
            _this.cd.detectChanges();
        });
    };
    return AdminCoachsListComponent;
}());
AdminCoachsListComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-admin-coachs-list',
        template: __webpack_require__(628),
        styles: [__webpack_require__(587)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object])
], AdminCoachsListComponent);

var _a, _b;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/admin-coachs-list.component.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__ = __webpack_require__(60);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RhsListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RhsListComponent = (function () {
    function RhsListComponent(apiService, cd) {
        this.apiService = apiService;
        this.cd = cd;
    }
    RhsListComponent.prototype.ngOnInit = function () {
    };
    RhsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    RhsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllrhsSub != null) {
            this.getAllrhsSub.unsubscribe();
        }
    };
    RhsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.getAllrhsSub = this.apiService.getRhs().subscribe(function (rhs) {
            console.log('getAllrhsSub subscribe, rhs : ', rhs);
            _this.rhs = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(rhs);
            _this.cd.detectChanges();
        });
    };
    return RhsListComponent;
}());
RhsListComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-rhs-list',
        template: __webpack_require__(629),
        styles: [__webpack_require__(588)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object])
], RhsListComponent);

var _a, _b;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/rhs-list.component.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_firebase_service__ = __webpack_require__(85);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(firebaseService) {
        this.firebaseService = firebaseService;
        console.log("AppComponent ctr, env : ", __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */]);
        firebaseService.init();
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-root',
        template: __webpack_require__(630)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_firebase_service__["a" /* FirebaseService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_firebase_service__["a" /* FirebaseService */]) === "function" && _a || Object])
], AppComponent);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app.component.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__message__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__ = __webpack_require__(85);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ChatComponent = (function () {
    function ChatComponent(firebase, authService, cd, myElement) {
        this.firebase = firebase;
        this.authService = authService;
        this.cd = cd;
        this.myElement = myElement;
        this.userAuth = true;
        this.userAuth = true;
        this.messages = new Array();
    }
    ChatComponent.prototype.changeBackground = function () {
        return { 'background-image': 'url(' + "http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg" + ')' };
    };
    ChatComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.messagesRef = this.firebase.getInstance().database().ref('messages');
        var hElement = this.myElement.nativeElement;
        this.userName = hElement.querySelector("#user-name");
        this.messageInput = hElement.querySelector("#message");
        console.log("ngAfterViewInit : ", this.userName);
        this.subscription = this.authService.isAuthenticated().subscribe(function (authStatus) {
            if (authStatus) {
                console.log("user is authent");
                // Set the user's profile pic and name.
                // this.userPic.style.backgroundImage = 'url(' + "http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg" + ')';
                _this.userName.textContent = "toto is here";
                // Show user's profile and sign-out button.
                // Hide sign-in button.
                // We load currently existing chat messages.
                _this.loadMessages();
                //load top questions
                // this.recipeService.getTopQuestions().subscribe(
                //   response => {
                //     console.log("top questions response : ", response)
                //   }
                // )
            }
            else {
                console.log("user is NOT authent");
            }
            _this.userAuth = authStatus;
            _this.cd.detectChanges();
        });
    };
    ChatComponent.prototype.ngOnInit = function () {
        var hElement = this.myElement.nativeElement;
        var test = hElement.querySelector("#user-name");
        console.log("ngOnInit : ", test);
    };
    ChatComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    /**
     * Loads chat messages history and listens for upcoming ones.
     */
    ChatComponent.prototype.loadMessages = function () {
        // Make sure we remove all previous listeners.
        this.messagesRef.off();
        // Loads the last 12 messages and listen for new ones.
        var setMessage = function (data) {
            console.log("setMessage, data : ", data);
            var val = data.val();
            this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
        }.bind(this);
        this.messagesRef.limitToLast(12).on('child_added', setMessage);
        this.messagesRef.limitToLast(12).on('child_changed', setMessage);
    };
    ChatComponent.prototype.displayMessage = function (key, name, text, picUrl, imageUri) {
        console.log("displayMessage, key : ", key);
        console.log("displayMessage, name : ", name);
        this.messages.push(new __WEBPACK_IMPORTED_MODULE_2__message__["a" /* Message */](name, text, picUrl, imageUri));
        this.cd.detectChanges();
    };
    // Saves a new message on the Firebase DB.
    ChatComponent.prototype.saveMessage = function (text) {
        console.debug('saveMessage, input : ', text);
        if (text != null) {
            this.messagesRef.push({
                name: "username",
                text: text,
                // photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
                photoUrl: 'assets/profile_placeholder.png'
            }).then(function () {
                console.error('message added');
                // Clear message text field and SEND button state.
                // FriendlyChat.resetMaterialTextfield(this.messageInput);
                // this.toggleButton();
            }.bind(this)).catch(function (error) {
                console.error('Error writing new message to Firebase Database', error);
            });
        }
    };
    return ChatComponent;
}());
ChatComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-chat',
        template: __webpack_require__(632),
        styles: [__webpack_require__(590)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__["a" /* FirebaseService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_firebase_service__["a" /* FirebaseService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _d || Object])
], ChatComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/chat.component.js.map

/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
var Message = (function () {
    function Message(name, text, photoUrl, imageUrl) {
        this.name = name;
        this.text = text;
        this.photoUrl = photoUrl;
        this.imageUrl = imageUrl;
    }
    return Message;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/message.js.map

/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SigninComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SigninComponent = (function () {
    function SigninComponent(formBuilder, authService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.error = false;
        this.loginLoading = false;
        authService.isAuthenticated().subscribe(function (isAuth) { return console.log('onSignIn, isAuth', isAuth); });
    }
    SigninComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.signInForm = this.formBuilder.group({
            email: ['', [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
            password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
        });
    };
    SigninComponent.prototype.onSignIn = function () {
        var _this = this;
        // Activate spinner loader
        this.loginLoading = true;
        // reset errors
        this.error = false;
        this.errorMessage = '';
        this.authService.signIn(this.signInForm.value).subscribe(function (user) {
            console.log('onSignIn, user obtained', user);
            /*if (user instanceof Coach) {
              this.router.navigate(['/meetings']);
            } else {
              this.router.navigate(['/coachs'])
            }*/
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/meetings']);
            Materialize.toast('Bonjour ' + user.firstName + ' !', 3000, 'rounded');
            _this.loginLoading = false;
        }, function (error) {
            console.log('onSignIn, error obtained', error);
            Materialize.toast("Le mot de passe ou l'adresse mail est inccorect", 3000, 'rounded');
            _this.loginLoading = false;
            //this.error = true;
            //this.errorMessage = error;
        });
    };
    SigninComponent.prototype.goToSignUp = function () {
        this.router.navigate(['/signup']);
    };
    return SigninComponent;
}());
SigninComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-signin',
        template: __webpack_require__(634),
        styles: [__webpack_require__(592)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object])
], SigninComponent);

var _a, _b, _c;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signin.component.js.map

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_adminAPI_service__ = __webpack_require__(60);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupAdminComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignUpType;
(function (SignUpType) {
    SignUpType[SignUpType["COACH"] = 0] = "COACH";
    SignUpType[SignUpType["COACHEE"] = 1] = "COACHEE";
    SignUpType[SignUpType["RH"] = 2] = "RH";
    SignUpType[SignUpType["NULL"] = 3] = "NULL";
})(SignUpType || (SignUpType = {}));
var SignupAdminComponent = (function () {
    /* ----- END Contract Plan ----*/
    function SignupAdminComponent(formBuilder, authService, adminAPIService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.adminAPIService = adminAPIService;
        this.router = router;
        this.signUpSelectedType = SignUpType.NULL;
        this.error = false;
        this.errorMessage = "";
        console.log("constructor");
    }
    SignupAdminComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
        // this.signUpTypes = [SignUpType.COACH, SignUpType.COACHEE, SignUpType.RH];
        this.signUpTypes = [SignUpType.COACH, SignUpType.RH];
        this.signUpForm = this.formBuilder.group({
            email: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].compose([
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required,
                    this.isEmail
                ])]
        });
        this.getListOfContractPlans();
    };
    SignupAdminComponent.prototype.onSelectPlan = function (plan) {
        console.log("onSelectPlan, plan ", plan);
        this.mSelectedPlan = plan;
    };
    SignupAdminComponent.prototype.onSignUpSubmitted = function () {
        console.log("onSignUp");
        //reset errors
        this.error = false;
        this.errorMessage = '';
        if (this.signUpSelectedType == SignUpType.COACH) {
            console.log("onSignUp, coach");
            this.createPotentialCoach(this.signUpForm.value.email);
        }
        else if (this.signUpSelectedType == SignUpType.RH) {
            this.createPotentialRh(this.signUpForm.value.email);
        }
        else {
            Materialize.toast('Vous devez sélectionner un type', 3000, 'rounded');
        }
    };
    SignupAdminComponent.prototype.createPotentialRh = function (email) {
        console.log('createPotentialRh');
        var body = {
            "email": email,
        };
        this.adminAPIService.createPotentialRh(body).subscribe(function (res) {
            console.log('createPotentialRh, res', res);
            Materialize.toast('Collaborateur RH ajouté !', 3000, 'rounded');
        }, function (error) {
            console.log('createPotentialRh, error', error);
            Materialize.toast("Impossible d'ajouter le RH", 3000, 'rounded');
        });
    };
    SignupAdminComponent.prototype.createPotentialCoach = function (email) {
        console.log('createPotentialCoach');
        var body = {
            "email": email,
        };
        this.adminAPIService.createPotentialCoach(body).subscribe(function (res) {
            console.log('createPotentialCoach, res', res);
            Materialize.toast('Collaborateur Coach ajouté !', 3000, 'rounded');
        }, function (error) {
            console.log('createPotentialCoach, error', error);
            Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
        });
    };
    SignupAdminComponent.prototype.getListOfContractPlans = function () {
        var _this = this;
        this.authService.getNotAuth(__WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */].GET_CONTRACT_PLANS, null).subscribe(function (response) {
            var json = response.json();
            console.log("getListOfContractPlans, response json : ", json);
            _this.plans = __WEBPACK_IMPORTED_MODULE_4_rxjs__["Observable"].of(json);
            // this.cd.detectChanges();
        });
    };
    SignupAdminComponent.prototype.isEmail = function (control) {
        if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
            console.log("email NOT ok");
            // this.test = false
            return { noEmail: true };
        }
        // this.test = true
        console.log("email ok");
    };
    SignupAdminComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    SignupAdminComponent.prototype.getSignUpTypeName = function (type) {
        switch (type) {
            case SignUpType.COACH:
                return "Coach";
            case SignUpType.COACHEE:
                return "Coaché";
            case SignUpType.RH:
                return "RH";
        }
    };
    return SignupAdminComponent;
}());
SignupAdminComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-signup',
        template: __webpack_require__(635),
        styles: [__webpack_require__(593)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__service_adminAPI_service__["a" /* AdminAPIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__service_adminAPI_service__["a" /* AdminAPIService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _d || Object])
], SignupAdminComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signup-admin.component.js.map

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupCoachComponent = (function () {
    function SignupCoachComponent(formBuilder, authService, coachCoacheeService, router, route) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.router = router;
        this.route = route;
        this.error = false;
        this.errorMessage = "";
        console.log("constructor");
    }
    SignupCoachComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit");
        // meetingId should be in the router
        this.route.queryParams.subscribe(function (params) {
            var token = params['token'];
            console.log("ngOnInit, param token", token);
            _this.coachCoacheeService.getPotentialCoach(token).subscribe(function (coach) {
                console.log("getPotentialCoach, data obtained", coach);
                _this.potentialCoachObs = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(coach);
                _this.potentialCoach = coach;
            }, function (error) {
                console.log("getPotentialCoach, error obtained", error);
            });
        });
        this.signUpForm = this.formBuilder.group({
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].minLength(6)
                ])
            ],
            confirmPassword: ['',
                [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required,
                    this.isEqualPassword.bind(this)]
            ],
        });
    };
    SignupCoachComponent.prototype.onSignUpSubmitted = function () {
        var _this = this;
        console.log("onSignUp");
        //reset errors
        this.error = false;
        this.errorMessage = '';
        console.log("onSignUp, coachee");
        var user = this.signUpForm.value;
        user.email = this.potentialCoach.email;
        this.authService.signUpCoach(user).subscribe(function (data) {
            console.log("onSignUp, data obtained", data);
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/meetings']);
        }, function (error) {
            console.log("onSignUp, error obtained", error);
            _this.error = true;
            _this.errorMessage = error;
        });
    };
    SignupCoachComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    return SignupCoachComponent;
}());
SignupCoachComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-signup-coach',
        template: __webpack_require__(636),
        styles: [__webpack_require__(594)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */]) === "function" && _e || Object])
], SignupCoachComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signup-coach.component.js.map

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupCoacheeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupCoacheeComponent = (function () {
    /* ----- END Contract Plan ----*/
    function SignupCoacheeComponent(formBuilder, authService, coachCoacheeService, router, route) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.router = router;
        this.route = route;
        this.error = false;
        this.errorMessage = "";
        console.log("constructor");
    }
    SignupCoacheeComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit");
        // meetingId should be in the router
        this.route.queryParams.subscribe(function (params) {
            var token = params['token'];
            console.log("ngOnInit, param token", token);
            _this.coachCoacheeService.getPotentialCoachee(token).subscribe(function (coachee) {
                //TODO use this potential coachee
                console.log("getPotentialCoachee, data obtained", coachee);
                _this.potentialCoacheeObs = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(coachee);
                _this.potentialCoachee = coachee;
            }, function (error) {
                console.log("getPotentialCoachee, error obtained", error);
            });
        });
        this.signUpForm = this.formBuilder.group({
            password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].compose([
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required,
                    __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].minLength(6)
                ])
            ],
            confirmPassword: ['',
                [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required,
                    this.isEqualPassword.bind(this)]
            ],
        });
    };
    SignupCoacheeComponent.prototype.onSignUpSubmitted = function () {
        var _this = this;
        console.log("onSignUp");
        //reset errors
        this.error = false;
        this.errorMessage = '';
        console.log("onSignUp, coachee");
        var user = this.signUpForm.value;
        user.email = this.potentialCoachee.email;
        user.contractPlanId = this.potentialCoachee.plan.plan_id;
        this.authService.signUpCoachee(user).subscribe(function (data) {
            console.log("onSignUp, data obtained", data);
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/meetings']);
        }, function (error) {
            console.log("onSignUp, error obtained", error);
            _this.error = true;
            _this.errorMessage = error;
        });
    };
    SignupCoacheeComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    return SignupCoacheeComponent;
}());
SignupCoacheeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-signup-coachee',
        template: __webpack_require__(637),
        styles: [__webpack_require__(595)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["f" /* ActivatedRoute */]) === "function" && _e || Object])
], SignupCoacheeComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signup-coachee.component.js.map

/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupRhComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SignupRhComponent = (function () {
    function SignupRhComponent(formBuilder, authService, coachCoacheeService, router, route) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.router = router;
        this.route = route;
        this.error = false;
        this.errorMessage = "";
        console.log("constructor");
    }
    SignupRhComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit");
        // meetingId should be in the router
        this.route.queryParams.subscribe(function (params) {
            var token = params['token'];
            console.log("ngOnInit, param token", token);
            _this.coachCoacheeService.getPotentialRh(token).subscribe(function (coach) {
                console.log("getPotentialRh, data obtained", coach);
                _this.potentialRhObs = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(coach);
                _this.potentialRh = coach;
            }, function (error) {
                console.log("getPotentialRh, error obtained", error);
            });
        });
        this.signUpForm = this.formBuilder.group({
            password: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required,
                    __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].minLength(6)
                ])
            ],
            confirmPassword: ['',
                [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required,
                    this.isEqualPassword.bind(this)]
            ],
        });
    };
    SignupRhComponent.prototype.onSignUpSubmitted = function () {
        var _this = this;
        console.log("onSignUp");
        //reset errors
        this.error = false;
        this.errorMessage = '';
        console.log("onSignUp, rh");
        var user = this.signUpForm.value;
        user.email = this.potentialRh.email;
        this.authService.signUpRh(user).subscribe(function (data) {
            console.log("onSignUp, data obtained", data);
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/meetings']);
        }, function (error) {
            console.log("onSignUp, error obtained", error);
            _this.error = true;
            _this.errorMessage = error;
        });
    };
    SignupRhComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    return SignupRhComponent;
}());
SignupRhComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-signup-rh',
        template: __webpack_require__(638),
        styles: [__webpack_require__(596)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["f" /* ActivatedRoute */]) === "function" && _e || Object])
], SignupRhComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/signup-rh.component.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__ = __webpack_require__(37);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingDateComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MeetingDateComponent = (function () {
    function MeetingDateComponent(router, route, meetingService, authService, cd) {
        this.router = router;
        this.route = route;
        this.meetingService = meetingService;
        this.authService = authService;
        this.cd = cd;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        this.days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        this.now = new Date();
        this.dateModel = { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() };
        this.timeRange = [10, 18];
        this.hasPotentialDates = false;
        this.displayErrorBookingDate = false;
        this.isEditingPotentialDate = false;
        this.potentialDatesArray = new Array();
    }
    MeetingDateComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("MeetingDateComponent onInit");
        // meetingId should be in the router
        this.route.params.subscribe(function (params) {
            _this.meetingId = params['meetingId'];
            _this.loadMeetingPotentialTimes(_this.meetingId);
        });
        var user = this.authService.getConnectedUser();
        if (user) {
            this.onConnectedUserReceived(user);
        }
        else {
            this.subscriptionConnectUser = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('ngOnInit, sub received user', user);
                _this.onConnectedUserReceived(user);
            });
        }
    };
    MeetingDateComponent.prototype.onConnectedUserReceived = function (user) {
        this.connectedUser = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(user);
        this.cd.detectChanges();
    };
    MeetingDateComponent.prototype.bookOrUpdateADate = function () {
        var _this = this;
        console.log('bookADate, dateModel : ', this.dateModel);
        // console.log('bookADate, timeModel : ', this.timeModel);
        this.connectedUser.take(1).subscribe(function (user) {
            if (user == null) {
                console.log('no connected user');
                return;
            }
            var minDate = new Date(_this.dateModel.year, _this.dateModel.month - 1, _this.dateModel.day, _this.timeRange[0], 0);
            var maxDate = new Date(_this.dateModel.year, _this.dateModel.month - 1, _this.dateModel.day, _this.timeRange[1], 0);
            var timestampMin = +minDate.getTime().toFixed(0) / 1000;
            var timestampMax = +maxDate.getTime().toFixed(0) / 1000;
            if (_this.isEditingPotentialDate) {
                // just update potential date
                _this.meetingService.updatePotentialTime(_this.mEditingPotentialTimeId, timestampMin, timestampMax).subscribe(function (meetingDate) {
                    console.log('updatePotentialTime, meetingDate : ', meetingDate);
                    // Reload potential times
                    _this.loadMeetingPotentialTimes(_this.meetingId);
                    //reset progress bar values
                    _this.resetValues();
                    Materialize.toast('Plage modifiée !', 3000, 'rounded');
                }, function (error) {
                    console.log('updatePotentialTime error', error);
                    _this.displayErrorBookingDate = true;
                    Materialize.toast('Erreur lors de la modification', 3000, 'rounded');
                });
            }
            else {
                // create new date
                _this.meetingService.addPotentialDateToMeeting(_this.meetingId, timestampMin, timestampMax).subscribe(function (meetingDate) {
                    console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
                    _this.potentialDatesArray.push(meetingDate);
                    // Reload potential times
                    console.log('reload potential times');
                    // Reload potential times
                    _this.loadMeetingPotentialTimes(_this.meetingId);
                    //reset progress bar values
                    _this.resetValues();
                    Materialize.toast('Plage ajoutée !', 3000, 'rounded');
                }, function (error) {
                    console.log('addPotentialDateToMeeting error', error);
                    _this.displayErrorBookingDate = true;
                    Materialize.toast("Erreur lors de l'ajout", 3000, 'rounded');
                });
            }
        });
    };
    MeetingDateComponent.prototype.unbookAdate = function (potentialDateId) {
        var _this = this;
        console.log('unbookAdate');
        this.meetingService.removePotentialTime(potentialDateId).subscribe(function (response) {
            console.log('unbookAdate, response', response);
            //reset progress bar values
            _this.resetValues();
            // Reload potential times
            _this.loadMeetingPotentialTimes(_this.meetingId);
            _this.loadMeetingPotentialTimes(_this.meetingId);
        }, function (error) {
            console.log('unbookAdate, error', error);
        });
    };
    MeetingDateComponent.prototype.modifyPotentialDate = function (potentialDateId) {
        console.log('modifyPotentialDate, potentialDateId', potentialDateId);
        //find the potentialDate we want to modify
        for (var _i = 0, _a = this.potentialDatesArray; _i < _a.length; _i++) {
            var potential = _a[_i];
            if (potential.id === potentialDateId) {
                var startTime = this.getHours(potential.start_date);
                var endTime = this.getHours(potential.end_date);
                //switch to edit mode
                this.isEditingPotentialDate = true;
                this.mEditingPotentialTimeId = potentialDateId;
                this.timeRange = [startTime, endTime];
                break;
            }
        }
    };
    MeetingDateComponent.prototype.printTimeNumber = function (hour) {
        if (hour === Math.round(hour))
            return hour + ':00';
        else
            return Math.round(hour) - 1 + ':30';
    };
    MeetingDateComponent.prototype.printTimeString = function (date) {
        return this.getHours(date) + ':' + this.getMinutes(date);
    };
    MeetingDateComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingDateComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    MeetingDateComponent.prototype.resetValues = function () {
        this.mEditingPotentialTimeId = null;
        this.isEditingPotentialDate = false;
        this.timeRange = [10, 18];
    };
    MeetingDateComponent.prototype.dateToString = function (date) {
        var newDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day);
        return this.days[newDate.getDay()] + ' ' + date.day + ' ' + this.months[newDate.getMonth()];
    };
    MeetingDateComponent.prototype.stringToDate = function (date) {
        var d = new Date(date);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
    };
    MeetingDateComponent.prototype.compareDates = function (date1, date2) {
        return (date1.year === date2.year) && (date1.month === date2.month) && (date1.day === date2.day);
    };
    MeetingDateComponent.prototype.hasPotentialDate = function (date) {
        for (var i in this.potentialDatesArray) {
            if (this.compareDates(this.stringToDate(this.potentialDatesArray[i].start_date), date)) {
                return true;
            }
        }
        return false;
    };
    MeetingDateComponent.prototype.isDisabled = function (date, current) {
        var now = new Date();
        var newDate = new Date(date.year, date.month - 1, date.day);
        // TODO add this to block next month days
        // TODO date.month !== current.month ||
        return (newDate.getDay() === 6 || newDate.getDay() === 0 || date.year < now.getFullYear() || (date.month < now.getMonth() + 1 && date.year <= now.getFullYear()) || (date.year <= now.getFullYear() && date.month == now.getMonth() + 1 && date.day < now.getDate()));
    };
    /**
     * Fetch from API potential times for the given meeting id.
     * @param meetingId
     */
    MeetingDateComponent.prototype.loadMeetingPotentialTimes = function (meetingId) {
        var _this = this;
        this.meetingService.getMeetingPotentialTimes(meetingId).subscribe(function (dates) {
            console.log('loadMeetingPotentialTimes : ', dates);
            if (dates != null) {
                //clear array
                if (dates.length > 0)
                    _this.hasPotentialDates = true;
                _this.potentialDatesArray = new Array();
                //add received dates
                (_a = _this.potentialDatesArray).push.apply(_a, dates);
            }
            _this.potentialDates = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(dates);
            _this.cd.detectChanges();
            var _a;
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    /* Call this method to check if all required params are correctly set. */
    MeetingDateComponent.prototype.canFinish = function () {
        var canFinish = this.meetingGoal != null && this.meetingContext != null && this.dateModel != null && this.hasPotentialDates;
        // console.log('canFinish : ', canFinish);
        return canFinish;
    };
    /* Save the different dates and set goal and context.
     * Navigate to the list of meetings */
    MeetingDateComponent.prototype.finish = function () {
        var _this = this;
        console.log('finish, meetingGoal : ', this.meetingGoal);
        console.log('finish, meetingContext : ', this.meetingContext);
        //save GOAL and CONTEXT
        this.meetingService.addAContextForMeeting(this.meetingId, this.meetingContext).flatMap(function (meetingReview) {
            return _this.meetingService.addAGoalToMeeting(_this.meetingId, _this.meetingGoal);
        }).subscribe(function (meetingReview) {
            var user = _this.authService.getConnectedUser();
            if (user != null) {
                window.scrollTo(0, 0);
                _this.router.navigate(['/meetings']);
                Materialize.toast('Vos disponibilités on été enregitrées !', 3000, 'rounded');
            }
        }, function (error) {
            Materialize.toast("Impossible d'enregistrer vos disponibilités", 3000, 'rounded');
        });
    };
    MeetingDateComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionConnectUser) {
            this.subscriptionConnectUser.unsubscribe();
        }
    };
    //callback when "goal" for this meeting has changed
    MeetingDateComponent.prototype.onGoalValueUpdated = function (goal) {
        console.log('onGoalUpdated goal', goal);
        this.meetingGoal = goal;
    };
    //callback when "context" for this meeting has changed
    MeetingDateComponent.prototype.onContextValueUpdated = function (context) {
        console.log('onContextValueUpdated context', context);
        this.meetingContext = context;
    };
    return MeetingDateComponent;
}());
MeetingDateComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-meeting-date',
        template: __webpack_require__(639),
        styles: [__webpack_require__(597)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["f" /* ActivatedRoute */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _e || Object])
], MeetingDateComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-date.component.js.map

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_Coach__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AvailableMeetingsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AvailableMeetingsComponent = (function () {
    function AvailableMeetingsComponent(authService, meetingService, cd, router) {
        this.authService = authService;
        this.meetingService = meetingService;
        this.cd = cd;
        this.router = router;
        this.hasAvailableMeetings = false;
    }
    AvailableMeetingsComponent.prototype.ngOnInit = function () {
        this.onRefreshRequested();
    };
    AvailableMeetingsComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    AvailableMeetingsComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coach__["a" /* Coach */]) {
                // coach
                console.log('get a coach');
                this.getAllMeetings();
            }
            this.user = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(user);
            this.cd.detectChanges();
        }
    };
    AvailableMeetingsComponent.prototype.getAllMeetings = function () {
        var _this = this;
        this.meetingService.getAvailableMeetings().subscribe(function (meetings) {
            console.log('got getAllMeetings', meetings);
            _this.availableMeetings = __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(meetings);
            if (meetings != null && meetings.length > 0)
                _this.hasAvailableMeetings = true;
            _this.cd.detectChanges();
        });
    };
    AvailableMeetingsComponent.prototype.onSelectMeetingBtnClicked = function (meeting) {
        var _this = this;
        this.user.take(1).subscribe(function (user) {
            _this.meetingService.associateCoachToMeeting(meeting.id, user.id).subscribe(function (meeting) {
                console.log('on meeting associated : ', meeting);
                //navigate to dashboard
                _this.router.navigate(['/meetings']);
            });
        });
    };
    AvailableMeetingsComponent.prototype.confirmPotentialDate = function (meetingId) {
        var _this = this;
        var minDate = new Date(this.selectedDate);
        minDate.setHours(this.selectedHour);
        var maxDate = new Date(this.selectedDate);
        maxDate.setHours(this.selectedHour + 1);
        var timestampMin = +minDate.getTime().toFixed(0) / 1000;
        var timestampMax = +maxDate.getTime().toFixed(0) / 1000;
        // create new date
        this.meetingService.addPotentialDateToMeeting(meetingId, timestampMin, timestampMax).subscribe(function (meetingDate) {
            console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
            // validate date
            _this.meetingService.setFinalDateToMeeting(meetingId, meetingDate.id).subscribe(function (meeting) {
                console.log("confirmPotentialDate, response", meeting);
                _this.onRefreshRequested();
                Materialize.toast('Meeting validé !', 3000, 'rounded');
            }, function (error) {
                console.log('get potentials dates error', error);
                Materialize.toast('Erreur lors de la validation du meeting', 3000, 'rounded');
            });
        }, function (error) {
            console.log('addPotentialDateToMeeting error', error);
        });
    };
    AvailableMeetingsComponent.prototype.onSubmitValidateMeeting = function () {
        var _this = this;
        this.user.take(1).subscribe(function (user) {
            _this.meetingService.associateCoachToMeeting(_this.selectedMeeting.id, user.id).subscribe(function (meeting) {
                console.log('on meeting associated : ', meeting);
                //navigate to dashboard
                _this.confirmPotentialDate(meeting.id);
                _this.coachValidateModalVisibility(false);
            });
        });
    };
    AvailableMeetingsComponent.prototype.coachValidateModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coach_cancel_meeting').openModal();
        }
        else {
            $('#coach_cancel_meeting').closeModal();
        }
    };
    AvailableMeetingsComponent.prototype.openCoachValidateMeetingModal = function ($event) {
        this.selectedMeeting = $event.meeting;
        this.selectedDate = $event.selectedDate;
        this.selectedHour = $event.selectedHour;
        this.coachValidateModalVisibility(true);
    };
    AvailableMeetingsComponent.prototype.cancelCoachValidateMeeting = function () {
        this.coachValidateModalVisibility(false);
    };
    return AvailableMeetingsComponent;
}());
AvailableMeetingsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-available-meetings',
        template: __webpack_require__(640),
        styles: [__webpack_require__(598)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_meetings_service__["a" /* MeetingsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _d || Object])
], AvailableMeetingsComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/available-meetings.component.js.map

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_Coach__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_HR__ = __webpack_require__(52);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MeetingListComponent = (function () {
    function MeetingListComponent(authService, cd) {
        this.authService = authService;
        this.cd = cd;
    }
    MeetingListComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingListComponent.prototype.isUserACoach = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_3__model_Coach__["a" /* Coach */];
    };
    MeetingListComponent.prototype.isUserACoachee = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coachee__["a" /* Coachee */];
    };
    MeetingListComponent.prototype.isUserARh = function (user) {
        return user instanceof __WEBPACK_IMPORTED_MODULE_5__model_HR__["a" /* HR */];
    };
    MeetingListComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.user = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    return MeetingListComponent;
}());
MeetingListComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-meeting-list',
        template: __webpack_require__(645),
        styles: [__webpack_require__(603)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _b || Object])
], MeetingListComponent);

var _a, _b;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-list.component.js.map

/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Meeting; });
var Meeting = (function () {
    function Meeting(id) {
        this.id = id;
    }
    return Meeting;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/Meeting.js.map

/***/ }),

/***/ 232:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PotentialCoachee; });
/**
 * Created by guillaume on 18/05/2017.
 */
var PotentialCoachee = (function () {
    function PotentialCoachee(id) {
        this.id = id;
    }
    return PotentialCoachee;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/PotentialCoachee.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogService; });
var LogService = (function () {
    function LogService() {
    }
    LogService.prototype.writeToLog = function (logMessage) {
        console.log(logMessage);
    };
    return LogService;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/log.service.js.map

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_Coachee__ = __webpack_require__(51);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoachListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CoachListComponent = (function () {
    function CoachListComponent(service, authService, cd) {
        this.service = service;
        this.authService = authService;
        this.cd = cd;
    }
    CoachListComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    CoachListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        var user = this.authService.getConnectedUser();
        if (user) {
            // only a Coachee should see this component
            if (user instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coachee__["a" /* Coachee */]) {
                this.onUserObtained(user);
            }
        }
        else {
            this.authService.getConnectedUserObservable().subscribe(function (user) {
                // only a Coachee should see this component
                if (user instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coachee__["a" /* Coachee */]) {
                    _this.onUserObtained(user);
                }
            });
        }
    };
    CoachListComponent.prototype.onPotentialCoachSelected = function (coach) {
        console.log('potentialCoachSelected');
        this.potSelectedCoach = coach;
    };
    CoachListComponent.prototype.onFinalCoachSelected = function (selectedCoach) {
        console.log('onFinalCoachSelected');
        // reset pot coach
        this.potSelectedCoach = null;
        // // save in backend
        // this.coachee.last().flatMap(
        //   (coachee: Coachee) => {
        //     console.log('onFinalCoachSelected, get coachee', coachee);
        //     return this.authService.updateCoacheeSelectedCoach(coachee.id, selectedCoach.id);
        //   }
        // ).subscribe(
        //   (coachee: Coachee) => {
        //     console.log('coach selected saved, redirect to meetings');
        //     // redirect to a meeting page
        //     // this.router.navigate(['/meetings']);
        //     this.onUserObtained(coachee);
        //   }
        // );
    };
    CoachListComponent.prototype.onUserObtained = function (coachee) {
        var _this = this;
        console.log('onUserObtained, coachee', coachee);
        this.coachee = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(coachee);
        if (coachee.selectedCoach) {
            console.log('onUserObtained, we have a selected coach');
            // this.selectedCoach = coachee.selectedCoach;
        }
        else {
            // if not coach selected, display possible coachs
            this.subscription = this.service.getAllCoachs().subscribe(function (coachs) {
                console.log('getAllCoachs subscribe, coachs : ', coachs);
                _this.coachs = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(coachs);
                _this.cd.detectChanges();
            });
        }
    };
    CoachListComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    return CoachListComponent;
}());
CoachListComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-coach-list',
        template: __webpack_require__(650),
        styles: [__webpack_require__(608)]
    })
    //TODO to remove ?
    ,
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object])
], CoachListComponent);

var _a, _b, _c;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/coach-list.component.js.map

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(17);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ProfileCoachComponent = (function () {
    function ProfileCoachComponent(authService, router, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.router = router;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.status = 'visiter';
    }
    ProfileCoachComponent.prototype.ngOnInit = function () {
        this.formCoach = this.formBuilder.group({
            firstName: ['', __WEBPACK_IMPORTED_MODULE_5__angular_forms__["Validators"].required],
            lastName: ['', __WEBPACK_IMPORTED_MODULE_5__angular_forms__["Validators"].required],
            avatar: ['', __WEBPACK_IMPORTED_MODULE_5__angular_forms__["Validators"].required],
            description: ['', __WEBPACK_IMPORTED_MODULE_5__angular_forms__["Validators"].required],
        });
        this.getCoach();
        this.getUser();
    };
    ProfileCoachComponent.prototype.getCoach = function () {
        var _this = this;
        this.subscriptionGetCoach = this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.status = params['status'];
            _this.coachService.getCoachForId(coachId).subscribe(function (coach) {
                console.log("gotCoach", coach);
                _this.setFormValues(coach);
                _this.coach = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(coach);
                _this.cd.detectChanges();
            });
        });
    };
    ProfileCoachComponent.prototype.getUser = function () {
        var _this = this;
        this.subscriptionGetUser = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser : ' + user);
            _this.user = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(user);
            _this.cd.detectChanges();
        });
    };
    ProfileCoachComponent.prototype.setFormValues = function (coach) {
        this.formCoach.setValue({
            firstName: coach.firstName,
            lastName: coach.lastName,
            avatar: coach.avatar_url,
            description: coach.description
        });
    };
    ProfileCoachComponent.prototype.submitCoachProfilUpdate = function () {
        var _this = this;
        console.log("submitCoachProfilUpdate");
        this.coach.last().flatMap(function (coach) {
            console.log("submitCoachProfilUpdate, coach obtained");
            return _this.authService.updateCoachForId(coach.id, _this.formCoach.value.firstName, _this.formCoach.value.lastName, _this.formCoach.value.description, _this.formCoach.value.avatar);
        }).subscribe(function (user) {
            console.log("coach updated : ", user);
            //refresh page
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            _this.getCoach();
        }, function (error) {
            console.log('coach update, error', error);
            //TODO display error
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoachComponent.prototype.goToMeetings = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/meetings']);
    };
    ProfileCoachComponent.prototype.goToCoachsAdmin = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['admin/coachs-list']);
    };
    ProfileCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
    };
    ProfileCoachComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoach) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoach.unsubscribe();
        }
        if (this.subscriptionGetUser) {
            console.log("Unsubscribe user");
            this.subscriptionGetUser.unsubscribe();
        }
    };
    return ProfileCoachComponent;
}());
ProfileCoachComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-profile-coach',
        template: __webpack_require__(653),
        styles: [__webpack_require__(611)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_forms__["FormBuilder"]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["f" /* ActivatedRoute */]) === "function" && _f || Object])
], ProfileCoachComponent);

var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-coach.component.js.map

/***/ }),

/***/ 236:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileCoacheeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ProfileCoacheeComponent = (function () {
    function ProfileCoacheeComponent(authService, router, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.router = router;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.status = 'visiter';
    }
    ProfileCoacheeComponent.prototype.ngOnInit = function () {
        this.formCoachee = this.formBuilder.group({
            firstName: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required],
            lastName: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required],
            avatar: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required]
        });
        this.getCoachee();
        this.getUser();
    };
    ProfileCoacheeComponent.prototype.getCoachee = function () {
        var _this = this;
        this.subscriptionGetCoachee = this.route.params.subscribe(function (params) {
            var coacheeId = params['id'];
            _this.status = params['status'];
            _this.coachService.getCoacheeForId(coacheeId).subscribe(function (coachee) {
                console.log("gotCoachee", coachee);
                _this.setFormValues(coachee);
                _this.coachee = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(coachee);
                _this.cd.detectChanges();
            });
        });
    };
    ProfileCoacheeComponent.prototype.getUser = function () {
        var _this = this;
        this.subscriptionGetUser = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser : ' + user);
            _this.user = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(user);
            _this.cd.detectChanges();
        });
    };
    ProfileCoacheeComponent.prototype.setFormValues = function (coachee) {
        this.formCoachee.setValue({
            firstName: coachee.firstName,
            lastName: coachee.lastName,
            avatar: coachee.avatar_url
        });
    };
    ProfileCoacheeComponent.prototype.submitCoacheeProfilUpdate = function () {
        var _this = this;
        console.log("submitCoacheeProfilUpdate");
        this.coachee.last().flatMap(function (coachee) {
            console.log("submitCoacheeProfilUpdate, coachee obtained");
            return _this.authService.updateCoacheeForId(coachee.id, _this.formCoachee.value.firstName, _this.formCoachee.value.lastName, _this.formCoachee.value.avatar);
        }).subscribe(function (user) {
            console.log("coachee updated : ", user);
            //refresh page
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            _this.getCoachee();
        }, function (error) {
            console.log('coachee update, error', error);
            //TODO display error
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoacheeComponent.prototype.goToMeetings = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/meetings']);
    };
    ProfileCoacheeComponent.prototype.goToCoacheesAdmin = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['admin/coachees-list']);
    };
    ProfileCoacheeComponent.prototype.ngAfterViewInit = function () {
        // let user: ApiUser = this.authService.getConnectedUser();
        // console.log("ngAfterViewInit, user : ", user);
        // this.onUserObtained(user);
        //
        // this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
        //   (user: ApiUser) => {
        //     console.log("getConnectedUser");
        //     this.onUserObtained(user);
        //   }
        // );
    };
    ProfileCoacheeComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoachee) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoachee.unsubscribe();
        }
        if (this.subscriptionGetUser) {
            console.log("Unsubscribe user");
            this.subscriptionGetUser.unsubscribe();
        }
    };
    return ProfileCoacheeComponent;
}());
ProfileCoacheeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-profile-coachee',
        template: __webpack_require__(654),
        styles: [__webpack_require__(612)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormBuilder"]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["f" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["f" /* ActivatedRoute */]) === "function" && _f || Object])
], ProfileCoacheeComponent);

var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-coachee.component.js.map

/***/ }),

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_HR__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_auth_service__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileRhComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ProfileRhComponent = (function () {
    function ProfileRhComponent(authService, formBuilder, cd) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.cd = cd;
    }
    ProfileRhComponent.prototype.ngOnInit = function () {
        this.formRh = this.formBuilder.group({
            firstName: [''],
            lastName: [''],
            avatar: ['']
        });
    };
    ProfileRhComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log("ngAfterViewInit, user : ", user);
        this.onUserObtained(user);
        this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log("getConnectedUser");
            _this.onUserObtained(user);
        });
    };
    ProfileRhComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    ProfileRhComponent.prototype.submitRhProfileUpdate = function () {
        var _this = this;
        console.log("submitProfileUpdate");
        this.rh.last().flatMap(function (rh) {
            console.log("submitProfileUpdate, rh obtained");
            return _this.authService.updateCoacheeForId(rh.id, _this.formRh.value.firstName, _this.formRh.value.lastName, _this.formRh.value.avatar);
        }).subscribe(function (user) {
            console.log("rh updated : ", user);
            //refresh page
            _this.onUserObtained(user);
        }, function (error) {
            console.log('rh update, error', error);
            //TODO display error
        });
    };
    ProfileRhComponent.prototype.onUserObtained = function (user) {
        console.log("onUserObtained, user : ", user);
        this.connectedUser = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(user);
        if (user instanceof __WEBPACK_IMPORTED_MODULE_3__model_HR__["a" /* HR */]) {
            this.rh = __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(user);
        }
        this.cd.detectChanges();
    };
    return ProfileRhComponent;
}());
ProfileRhComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-profile-rh',
        template: __webpack_require__(655),
        styles: [__webpack_require__(613)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object])
], ProfileRhComponent);

var _a, _b, _c;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-rh.component.js.map

/***/ }),

/***/ 238:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WelcomeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var WelcomeComponent = (function () {
    function WelcomeComponent(router, authService, formBuilder) {
        this.router = router;
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.loginActivated = false;
        this.error = false;
    }
    WelcomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.contactForm = this.formBuilder.group({
            name: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            mail: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            message: ['', [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required]],
        });
        // this.connectedUser = this.authService.getConnectedUserObservable();
        this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser : ' + user);
            _this.onUserObtained(user);
        });
    };
    WelcomeComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained : ' + user);
        if (user != null)
            this.router.navigate(['/meetings']);
    };
    WelcomeComponent.prototype.activateLogin = function () {
        this.loginActivated = true;
    };
    /**
     * Start API request to contact Eritis
     */
    WelcomeComponent.prototype.onContactSubmit = function () {
        var _this = this;
        var body = {
            name: this.contactForm.value.name,
            email: this.contactForm.value.mail,
            message: this.contactForm.value.message
        };
        console.log("onContactSubmit, values : ", this.contactForm);
        console.log("onContactSubmit, values : ", this.contactForm.value);
        this.authService.postNotAuth("v1/contact", null, body).subscribe(function (res) {
            console.log("contact, response json : ", res);
            Materialize.toast('Votre demande de contact a bien été envoyée', 4000);
            _this.contactForm.value.name = "";
            _this.contactForm.value.mail = "";
            _this.contactForm.value.message = "";
        }, function (error) {
            Materialize.toast('Une erreur est survenue', 4000);
        });
    };
    return WelcomeComponent;
}());
WelcomeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-welcome',
        template: __webpack_require__(657),
        styles: [__webpack_require__(615)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"]) === "function" && _c || Object])
], WelcomeComponent);

var _a, _b, _c;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/welcome.component.js.map

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coach__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_HR__ = __webpack_require__(52);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoachCoacheeService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
///<reference path="auth.service.ts"/>




var CoachCoacheeService = (function () {
    function CoachCoacheeService(apiService) {
        this.apiService = apiService;
    }
    CoachCoacheeService.prototype.getAllCoachs = function () {
        console.log("getAllCoachs, start request");
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_COACHS, null).map(function (response) {
            var json = response.json();
            console.log("getAllCoachs, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getCoachForId = function (coachId) {
        console.log("getCoachForId, start request");
        var params = [coachId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_COACH_FOR_ID, params).map(function (response) {
            console.log("getCoachForId, got coach", response);
            var coach = response.json();
            return coach;
        }, function (error) {
            console.log("getCoachForId, error", error);
        });
    };
    CoachCoacheeService.prototype.getCoacheeForId = function (coacheeId) {
        console.log("getCoacheeForId, start request");
        var params = [coacheeId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_COACHEE_FOR_ID, params).map(function (response) {
            console.log("getCoacheeForId, got coachee", response);
            var coachee = response.json();
            return coachee;
        }, function (error) {
            console.log("getCoacheeForId, error", error);
        });
    };
    CoachCoacheeService.prototype.getAllCoacheesForRh = function (rhId) {
        console.log("getAllCoacheesForRh, start request");
        var param = [rhId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_COACHEES_FOR_RH, param).map(function (response) {
            var json = response.json();
            console.log("getAllCoacheesForRh, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getAllPotentialCoacheesForRh = function (rhId) {
        console.log("getAllPotentialCoacheesForRh, start request");
        var param = [rhId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_POTENTIAL_COACHEES_FOR_RH, param).map(function (response) {
            var json = response.json();
            console.log("getAllPotentialCoacheesForRh, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getPotentialCoachee = function (token) {
        console.log("getPotentialCoachee, start request");
        var param = [token];
        return this.apiService.getPotentialCoachee(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_POTENTIAL_COACHEE_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.getPotentialCoach = function (token) {
        console.log("getPotentialCoach, start request");
        var param = [token];
        return this.apiService.getPotentialCoachee(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_POTENTIAL_COACH_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.getPotentialRh = function (token) {
        console.log("getPotentialRh, start request");
        var param = [token];
        return this.apiService.getPotentialCoachee(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_POTENTIAL_RH_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.getUsageRate = function (rhId) {
        console.log("getUsageRate, start request");
        var param = [rhId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_USAGE_RATE_FOR_RH, param).map(function (response) {
            var json = response.json();
            console.log("getUsageRate, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.postPotentialCoachee = function (body) {
        console.log("postPotentialCoachee, start request");
        return this.apiService.post(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].POST_POTENTIAL_COACHEE, null, body).map(function (response) {
            var json = response.json();
            console.log("postPotentialCoachee, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getAllNotificationsForUser = function (user) {
        console.log("getAllNotifications, start request");
        var param = [user.id];
        var path = __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_COACHEE_NOTIFICATIONS;
        if (user instanceof __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */]) {
            path = __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_COACH_NOTIFICATIONS;
        }
        else if (user instanceof __WEBPACK_IMPORTED_MODULE_3__model_HR__["a" /* HR */]) {
            path = __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].GET_RH_NOTIFICATIONS;
        }
        return this.apiService.get(path, param).map(function (response) {
            var json = response.json();
            console.log("getAllNotifications, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.readAllNotificationsForUser = function (user) {
        console.log("readAllNotifications, start request");
        var param = [user.id];
        var path = __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].PUT_COACHEE_NOTIFICATIONS_READ;
        if (user instanceof __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */]) {
            path = __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].PUT_COACH_NOTIFICATIONS_READ;
        }
        else if (user instanceof __WEBPACK_IMPORTED_MODULE_3__model_HR__["a" /* HR */]) {
            path = __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].PUT_RH_NOTIFICATIONS_READ;
        }
        return this.apiService.put(path, param, null).map(function (response) {
            console.log("readAllNotifications done");
        }, function (error) {
            console.log('readAllNotifications error', error);
        });
    };
    /**
     * Add a new objective to this coachee.
     * @param coacheeId
     * @param rhId
     * @param objective
     */
    CoachCoacheeService.prototype.addObjectiveToCoachee = function (rhId, coacheeId, objective) {
        var param = [rhId, coacheeId];
        var body = {
            "objective": objective
        };
        return this.apiService.post(__WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */].POST_COACHEE_OBJECTIVE, param, body).map(function (response) {
            var json = response.json();
            console.log("POST coachee new objective, response json : ", json);
            return json;
        });
    };
    return CoachCoacheeService;
}());
CoachCoacheeService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */]) === "function" && _a || Object])
], CoachCoacheeService);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/coach_coachee.service.js.map

/***/ }),

/***/ 340:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 340;


/***/ }),

/***/ 341:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfills_ts__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app___ = __webpack_require__(357);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_4__app___["a" /* AppModule */]);
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/main.js.map

/***/ }),

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__header_header_component__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_data_service__ = __webpack_require__(368);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_log_service__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_routing__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__login_signup_signup_admin_component__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__login_signin_signin_component__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__login_auth_guard__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__welcome_welcome_component__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__chat_chat_component__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__chat_chat_item_component__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__user_coach_item_coach_list_component__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__user_coach_item_coach_item_component__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_angular_calendar__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__angular_platform_browser_animations__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ng_bootstrap_ng_bootstrap__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__meeting_meeting_list_meeting_list_component__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__meeting_meeting_list_coachee_meeting_item_coachee_component__ = __webpack_require__(361);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__meeting_pre_meeting_component__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__user_profile_coach_profile_coach_component__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__user_profile_coachee_profile_coachee_component__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__user_profile_coach_profile_coach_summary_component__ = __webpack_require__(371);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__meeting_meeting_list_coach_meeting_item_coach_component__ = __webpack_require__(359);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__service_firebase_service__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__meeting_meeting_date_meeting_date_component__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32_primeng_components_slider_slider__ = __webpack_require__(624);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32_primeng_components_slider_slider___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_32_primeng_components_slider_slider__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33_ng2_page_scroll__ = __webpack_require__(620);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__service_adminAPI_service__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__admin_admin_component__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__meeting_meeting_list_rh_meeting_item_rh_component__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__user_profile_rh_profile_rh_component__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__login_signup_signup_coachee_component__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__login_signup_signup_coach_component__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__login_signup_signup_rh_component__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__meeting_meeting_list_coach_available_meetings_component__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__admin_coachs_list_admin_coachs_list_component__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__admin_coachees_list_coachees_list_component__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__admin_rhs_list_rhs_list_component__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__meeting_meeting_list_coach_meeting_list_coach_meeting_list_coach_component__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__meeting_meeting_list_coachee_meeting_list_coachee_meeting_list_coachee_component__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__meeting_meeting_list_rh_meeting_list_rh_meeting_list_rh_component__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__user_coachee_item_coachee_item_component__ = __webpack_require__(370);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__user_rh_item_rh_item_component__ = __webpack_require__(372);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



















 // lib






























var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__header_header_component__["a" /* HeaderComponent */],
            __WEBPACK_IMPORTED_MODULE_9__login_signup_signup_admin_component__["a" /* SignupAdminComponent */],
            __WEBPACK_IMPORTED_MODULE_10__login_signin_signin_component__["a" /* SigninComponent */],
            __WEBPACK_IMPORTED_MODULE_26__user_profile_coach_profile_coach_component__["a" /* ProfileCoachComponent */],
            __WEBPACK_IMPORTED_MODULE_27__user_profile_coachee_profile_coachee_component__["a" /* ProfileCoacheeComponent */],
            __WEBPACK_IMPORTED_MODULE_37__user_profile_rh_profile_rh_component__["a" /* ProfileRhComponent */],
            __WEBPACK_IMPORTED_MODULE_28__user_profile_coach_profile_coach_summary_component__["a" /* ProfileCoachSummaryComponent */],
            __WEBPACK_IMPORTED_MODULE_13__welcome_welcome_component__["a" /* WelcomeComponent */],
            __WEBPACK_IMPORTED_MODULE_14__chat_chat_component__["a" /* ChatComponent */],
            __WEBPACK_IMPORTED_MODULE_15__chat_chat_item_component__["a" /* ChatItemComponent */],
            __WEBPACK_IMPORTED_MODULE_16__user_coach_item_coach_list_component__["a" /* CoachListComponent */],
            __WEBPACK_IMPORTED_MODULE_17__user_coach_item_coach_item_component__["a" /* CoachItemComponent */],
            __WEBPACK_IMPORTED_MODULE_23__meeting_meeting_list_meeting_list_component__["a" /* MeetingListComponent */],
            __WEBPACK_IMPORTED_MODULE_24__meeting_meeting_list_coachee_meeting_item_coachee_component__["a" /* MeetingItemCoacheeComponent */],
            __WEBPACK_IMPORTED_MODULE_29__meeting_meeting_list_coach_meeting_item_coach_component__["a" /* MeetingItemCoachComponent */],
            __WEBPACK_IMPORTED_MODULE_31__meeting_meeting_date_meeting_date_component__["a" /* MeetingDateComponent */],
            __WEBPACK_IMPORTED_MODULE_25__meeting_pre_meeting_component__["a" /* PreMeetingComponent */],
            __WEBPACK_IMPORTED_MODULE_42__admin_coachs_list_admin_coachs_list_component__["a" /* AdminCoachsListComponent */],
            __WEBPACK_IMPORTED_MODULE_35__admin_admin_component__["a" /* AdminComponent */],
            __WEBPACK_IMPORTED_MODULE_36__meeting_meeting_list_rh_meeting_item_rh_component__["a" /* MeetingItemRhComponent */],
            __WEBPACK_IMPORTED_MODULE_38__login_signup_signup_coachee_component__["a" /* SignupCoacheeComponent */],
            __WEBPACK_IMPORTED_MODULE_39__login_signup_signup_coach_component__["a" /* SignupCoachComponent */],
            __WEBPACK_IMPORTED_MODULE_40__login_signup_signup_rh_component__["a" /* SignupRhComponent */],
            __WEBPACK_IMPORTED_MODULE_41__meeting_meeting_list_coach_available_meetings_component__["a" /* AvailableMeetingsComponent */],
            __WEBPACK_IMPORTED_MODULE_43__admin_coachees_list_coachees_list_component__["a" /* CoacheesListComponent */],
            __WEBPACK_IMPORTED_MODULE_44__admin_rhs_list_rhs_list_component__["a" /* RhsListComponent */],
            __WEBPACK_IMPORTED_MODULE_45__meeting_meeting_list_coach_meeting_list_coach_meeting_list_coach_component__["a" /* MeetingListCoachComponent */],
            __WEBPACK_IMPORTED_MODULE_46__meeting_meeting_list_coachee_meeting_list_coachee_meeting_list_coachee_component__["a" /* MeetingListCoacheeComponent */],
            __WEBPACK_IMPORTED_MODULE_47__meeting_meeting_list_rh_meeting_list_rh_meeting_list_rh_component__["a" /* MeetingListRhComponent */],
            __WEBPACK_IMPORTED_MODULE_48__user_coachee_item_coachee_item_component__["a" /* CoacheeItemComponent */],
            __WEBPACK_IMPORTED_MODULE_49__user_rh_item_rh_item_component__["a" /* RhItemComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_20__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormsModule"],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_8__app_routing__["a" /* routing */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["ReactiveFormsModule"],
            __WEBPACK_IMPORTED_MODULE_19_angular_calendar__["a" /* CalendarModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_21__ng_bootstrap_ng_bootstrap__["a" /* NgbModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_32_primeng_components_slider_slider__["SliderModule"],
            __WEBPACK_IMPORTED_MODULE_33_ng2_page_scroll__["a" /* Ng2PageScrollModule */].forRoot()
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_6__service_data_service__["a" /* DataService */], __WEBPACK_IMPORTED_MODULE_7__service_log_service__["a" /* LogService */], __WEBPACK_IMPORTED_MODULE_11__service_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_12__login_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_18__service_coach_coachee_service__["a" /* CoachCoacheeService */], __WEBPACK_IMPORTED_MODULE_22__service_meetings_service__["a" /* MeetingsService */], __WEBPACK_IMPORTED_MODULE_30__service_firebase_service__["a" /* FirebaseService */], __WEBPACK_IMPORTED_MODULE_34__service_adminAPI_service__["a" /* AdminAPIService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app.module.js.map

/***/ }),

/***/ 354:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__login_signin_signin_component__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_signup_signup_admin_component__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__welcome_welcome_component__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__chat_chat_component__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__user_coach_item_coach_list_component__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__meeting_meeting_list_meeting_list_component__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__user_profile_coach_profile_coach_component__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__user_profile_coachee_profile_coachee_component__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__meeting_meeting_date_meeting_date_component__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__admin_coachs_list_admin_coachs_list_component__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__admin_admin_component__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__user_profile_rh_profile_rh_component__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__login_signup_signup_coachee_component__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__login_signup_signup_coach_component__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__login_signup_signup_rh_component__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__meeting_meeting_list_coach_available_meetings_component__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__admin_coachees_list_coachees_list_component__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__admin_rhs_list_rhs_list_component__ = __webpack_require__(219);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routing; });



















var APP_ROUTES = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: __WEBPACK_IMPORTED_MODULE_3__welcome_welcome_component__["a" /* WelcomeComponent */] },
    { path: 'chat', component: __WEBPACK_IMPORTED_MODULE_4__chat_chat_component__["a" /* ChatComponent */] },
    { path: 'signin', component: __WEBPACK_IMPORTED_MODULE_1__login_signin_signin_component__["a" /* SigninComponent */] },
    { path: 'signup_coachee', component: __WEBPACK_IMPORTED_MODULE_13__login_signup_signup_coachee_component__["a" /* SignupCoacheeComponent */] },
    { path: 'signup_coach', component: __WEBPACK_IMPORTED_MODULE_14__login_signup_signup_coach_component__["a" /* SignupCoachComponent */] },
    { path: 'signup_rh', component: __WEBPACK_IMPORTED_MODULE_15__login_signup_signup_rh_component__["a" /* SignupRhComponent */] },
    // {path: 'profile_coach', component: ProfileCoachComponent},
    // {path: 'profile_coachee', component: ProfileCoacheeComponent},
    { path: 'profile_rh', component: __WEBPACK_IMPORTED_MODULE_12__user_profile_rh_profile_rh_component__["a" /* ProfileRhComponent */] },
    { path: 'coachs', component: __WEBPACK_IMPORTED_MODULE_5__user_coach_item_coach_list_component__["a" /* CoachListComponent */] },
    { path: 'profile_coach/:status/:id', component: __WEBPACK_IMPORTED_MODULE_7__user_profile_coach_profile_coach_component__["a" /* ProfileCoachComponent */] },
    { path: 'coachees', component: __WEBPACK_IMPORTED_MODULE_5__user_coach_item_coach_list_component__["a" /* CoachListComponent */] },
    { path: 'profile_coachee/:status/:id', component: __WEBPACK_IMPORTED_MODULE_8__user_profile_coachee_profile_coachee_component__["a" /* ProfileCoacheeComponent */] },
    { path: 'meetings', component: __WEBPACK_IMPORTED_MODULE_6__meeting_meeting_list_meeting_list_component__["a" /* MeetingListComponent */] },
    { path: 'date/:meetingId', component: __WEBPACK_IMPORTED_MODULE_9__meeting_meeting_date_meeting_date_component__["a" /* MeetingDateComponent */] },
    { path: 'available_meetings', component: __WEBPACK_IMPORTED_MODULE_16__meeting_meeting_list_coach_available_meetings_component__["a" /* AvailableMeetingsComponent */] },
    {
        path: 'admin', component: __WEBPACK_IMPORTED_MODULE_11__admin_admin_component__["a" /* AdminComponent */],
        children: [
            { path: 'signup', component: __WEBPACK_IMPORTED_MODULE_2__login_signup_signup_admin_component__["a" /* SignupAdminComponent */] },
            { path: 'coachs-list', component: __WEBPACK_IMPORTED_MODULE_10__admin_coachs_list_admin_coachs_list_component__["a" /* AdminCoachsListComponent */] },
            { path: 'coachees-list', component: __WEBPACK_IMPORTED_MODULE_17__admin_coachees_list_coachees_list_component__["a" /* CoacheesListComponent */] },
            { path: 'rhs-list', component: __WEBPACK_IMPORTED_MODULE_18__admin_rhs_list_rhs_list_component__["a" /* RhsListComponent */] }
        ]
    },
];
var routing = __WEBPACK_IMPORTED_MODULE_0__angular_router__["e" /* RouterModule */].forRoot(APP_ROUTES);
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app.routing.js.map

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__message__ = __webpack_require__(222);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ChatItemComponent = (function () {
    function ChatItemComponent() {
    }
    ChatItemComponent.prototype.changeBackground = function () {
        if (this.message.photoUrl != null) {
            return { 'background-image': 'url(' + this.message.photoUrl + ')' };
        }
        else {
            return null;
        }
    };
    ChatItemComponent.prototype.ngOnInit = function () {
    };
    return ChatItemComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__message__["a" /* Message */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__message__["a" /* Message */]) === "function" && _a || Object)
], ChatItemComponent.prototype, "message", void 0);
ChatItemComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-chat-item',
        template: __webpack_require__(631),
        styles: [__webpack_require__(589)]
    }),
    __metadata("design:paramtypes", [])
], ChatItemComponent);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/chat-item.component.js.map

/***/ }),

/***/ 356:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_Coach__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__model_HR__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var HeaderComponent = (function () {
    function HeaderComponent(router, authService, coachCoacheeService, cd) {
        this.router = router;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.loginActivated = false;
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mUser = this.authService.getConnectedUser();
        this.onUserObtained(this.mUser);
        // this.isAuthenticated = this.authService.isAuthenticated();
        // this.authService.isAuthenticated().subscribe(
        //   (isAuth: boolean) => {
        //     console.log("isAuthenticated : " + isAuth);
        //     this.isAuthenticated = Observable.of(isAuth);
        //     this.cd.detectChanges();
        //   }
        // );
        if (this.user == null) {
            // Un utilisateur non connecté est redirigé sur la page d'accueil
            window.scrollTo(0, 0);
            this.router.navigate(['/']);
        }
        // this.connectedUser = this.authService.getConnectedUserObservable();
        this.subscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser : ' + user);
            _this.onUserObtained(user);
        });
    };
    HeaderComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained : ' + user);
        this.isAdminMode = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(false);
        if (this.isAdmin()) {
            this.user = null;
            this.isAuthenticated = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(false);
            this.isAdminMode = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(true);
        }
        if (user == null) {
            this.mUser = user;
            this.isAuthenticated = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(false);
        }
        else {
            this.mUser = user;
            this.isAuthenticated = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(true);
            this.fetchNotificationsForUser(user);
        }
        this.user = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(user);
        this.cd.detectChanges();
    };
    HeaderComponent.prototype.activateLogin = function () {
        this.loginActivated = true;
    };
    HeaderComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    HeaderComponent.prototype.onLogout = function () {
        window.scrollTo(0, 0);
        this.authService.loginOut();
    };
    HeaderComponent.prototype.onLogIn = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/signin']);
    };
    HeaderComponent.prototype.onSignUp = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/signup']);
    };
    HeaderComponent.prototype.goToHome = function () {
        if (this.isAuthenticated)
            this.goToMeetings();
        if (this.isAdmin())
            this.goToAdmin();
    };
    HeaderComponent.prototype.goToAdmin = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/admin']);
    };
    HeaderComponent.prototype.goToMeetings = function () {
        var user = this.authService.getConnectedUser();
        if (user != null) {
            window.scrollTo(0, 0);
            this.router.navigate(['/meetings']);
        }
    };
    HeaderComponent.prototype.goToAvailableSessions = function () {
        var user = this.authService.getConnectedUser();
        if (user != null) {
            window.scrollTo(0, 0);
            this.router.navigate(['/available_meetings']);
        }
    };
    HeaderComponent.prototype.goToProfile = function () {
        window.scrollTo(0, 0);
        if (this.mUser instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coach__["a" /* Coach */]) {
            this.router.navigate(['/profile_coach', 'owner', this.mUser.id]);
        }
        else if (this.mUser instanceof __WEBPACK_IMPORTED_MODULE_5__model_Coachee__["a" /* Coachee */]) {
            this.router.navigate(['/profile_coachee', 'owner', this.mUser.id]);
        }
        else if (this.mUser instanceof __WEBPACK_IMPORTED_MODULE_6__model_HR__["a" /* HR */]) {
            this.router.navigate(['/profile_rh']);
        }
    };
    // call API to inform that notifications have been read
    HeaderComponent.prototype.updateNotificationRead = function () {
        var user = this.authService.getConnectedUser();
        var obs;
        if (user != null) {
            if (user instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coach__["a" /* Coach */]) {
                var params = [user.id];
                obs = this.authService.put(__WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */].PUT_COACH_NOTIFICATIONS_READ, params, null);
            }
            else if (user instanceof __WEBPACK_IMPORTED_MODULE_5__model_Coachee__["a" /* Coachee */]) {
                var params = [user.id];
                obs = this.authService.put(__WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */].PUT_COACHEE_NOTIFICATIONS_READ, params, null);
            }
            if (obs != null) {
                obs.subscribe(function (response) {
                    console.log('updateNotificationRead response : ' + response);
                });
            }
        }
    };
    HeaderComponent.prototype.isUserACoach = function () {
        return this.mUser instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coach__["a" /* Coach */];
    };
    HeaderComponent.prototype.isUserACoachee = function () {
        return this.mUser instanceof __WEBPACK_IMPORTED_MODULE_5__model_Coachee__["a" /* Coachee */];
    };
    HeaderComponent.prototype.isUserARh = function () {
        return this.mUser instanceof __WEBPACK_IMPORTED_MODULE_6__model_HR__["a" /* HR */];
    };
    HeaderComponent.prototype.isAdmin = function () {
        return this.router.url === '/admin' || this.router.url === '/admin/signup' || this.router.url === '/admin/coachees-list' || this.router.url === '/admin/coachs-list' || this.router.url === '/admin/rhs-list';
    };
    HeaderComponent.prototype.isSigningUp = function () {
        return this.router.url === '/signup_coachee' || this.router.url === '/signup_coach' || this.router.url === '/signup_rh';
    };
    HeaderComponent.prototype.goToCoachs = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/coachs']);
    };
    HeaderComponent.prototype.canDisplayListOfCoach = function () {
        if (this.mUser == null) {
            return false;
        }
        if (this.mUser instanceof __WEBPACK_IMPORTED_MODULE_4__model_Coach__["a" /* Coach */]) {
            return false;
        }
        else {
            return true;
        }
    };
    HeaderComponent.prototype.fetchNotificationsForUser = function (user) {
        var _this = this;
        var param = user;
        this.coachCoacheeService.getAllNotificationsForUser(param).subscribe(function (notifs) {
            console.log('fetchNotificationsForUser : ' + notifs);
            //Sort notifs by date
            if (notifs != null) {
                notifs.sort(function (a, b) {
                    var d1 = new Date(a.date);
                    var d2 = new Date(b.date);
                    var res = d1.getUTCFullYear() - d2.getUTCFullYear();
                    if (res === 0)
                        res = d1.getUTCMonth() - d2.getUTCMonth();
                    if (res === 0)
                        res = d1.getUTCDate() - d2.getUTCDate();
                    if (res === 0)
                        res = d1.getUTCHours() - d2.getUTCHours();
                    return res;
                });
            }
            _this.notifications = __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(notifs);
        });
    };
    HeaderComponent.prototype.printDateString = function (date) {
        return this.getDate(date) + ' - ' + this.getHours(date) + ':' + this.getMinutes(date);
    };
    HeaderComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    HeaderComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    HeaderComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    HeaderComponent.prototype.readAllNotifications = function () {
        var _this = this;
        this.coachCoacheeService.readAllNotificationsForUser(this.mUser).subscribe(function (response) {
            console.log("getAllNotifications OK", response);
            _this.fetchNotificationsForUser(_this.mUser);
            _this.cd.detectChanges();
        });
    };
    /******* Admin page *****/
    HeaderComponent.prototype.navigateAdminHome = function () {
        console.log("navigateAdminHome");
        window.scrollTo(0, 0);
        this.router.navigate(['/admin']);
    };
    HeaderComponent.prototype.navigateToSignup = function () {
        console.log("navigateToSignup");
        window.scrollTo(0, 0);
        this.router.navigate(['admin/signup']);
    };
    HeaderComponent.prototype.navigateToCoachsList = function () {
        console.log("navigateToCoachsList");
        window.scrollTo(0, 0);
        this.router.navigate(['admin/coachs-list']);
    };
    HeaderComponent.prototype.navigateToCoacheesList = function () {
        console.log("navigateToCoacheesList");
        window.scrollTo(0, 0);
        this.router.navigate(['admin/coachees-list']);
    };
    HeaderComponent.prototype.navigateToRhsList = function () {
        console.log("navigateToRhsList");
        window.scrollTo(0, 0);
        this.router.navigate(['admin/rhs-list']);
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-header',
        template: __webpack_require__(633),
        styles: [__webpack_require__(591)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_7__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object])
], HeaderComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/header.component.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_component__ = __webpack_require__(220);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(353);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__app_module__["a"]; });


//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/index.js.map

/***/ }),

/***/ 358:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_auth_service__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AuthGuard = (function () {
    function AuthGuard(authService) {
        this.authService = authService;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var isAuth = this.authService.isAuthenticated();
        console.log("canActivate : ", isAuth);
        return isAuth;
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_auth_service__["a" /* AuthService */]) === "function" && _a || Object])
], AuthGuard);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/auth.guard.js.map

/***/ }),

/***/ 359:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Meeting__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_router__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingItemCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MeetingItemCoachComponent = (function () {
    function MeetingItemCoachComponent(authService, meetingService, cd, router) {
        this.authService = authService;
        this.meetingService = meetingService;
        this.cd = cd;
        this.router = router;
        this.onValidateDateBtnClick = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        // @Output()
        // dateRemoved = new EventEmitter();
        this.cancelMeetingTimeEvent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onCloseMeetingBtnClickEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.showDetails = false;
        this.selectedDate = '0';
        this.selectedHour = 0;
        $('select').material_select();
    }
    MeetingItemCoachComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit, meeting : ", this.meeting);
        this.onRefreshRequested();
        this.coachee = this.meeting.coachee;
        $('select').material_select();
    };
    MeetingItemCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("ngAfterViewInit");
        this.getGoal();
        this.getContext();
        this.getReviewValue();
        this.getReviewNextStep();
        this.loadMeetingPotentialTimes();
        this.loadPotentialDays();
        $('select').material_select();
    };
    MeetingItemCoachComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingItemCoachComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.user = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(user);
            this.cd.detectChanges();
        }
    };
    MeetingItemCoachComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.meetingService.getMeetingPotentialTimes(this.meeting.id).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            if (dates != null) {
                dates.sort(function (a, b) {
                    var d1 = new Date(a.start_date);
                    var d2 = new Date(b.start_date);
                    var res = d1.getUTCFullYear() - d2.getUTCFullYear();
                    if (res === 0)
                        res = d1.getUTCMonth() - d2.getUTCMonth();
                    if (res === 0)
                        res = d1.getUTCDate() - d2.getUTCDate();
                    if (res === 0)
                        res = d1.getUTCHours() - d2.getUTCHours();
                    return res;
                });
            }
            _this.potentialDatesArray = dates;
            _this.potentialDates = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(dates);
            _this.cd.detectChanges();
            _this.loadPotentialDays();
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoachComponent.prototype.onCloseMeetingBtnClick = function () {
        this.onCloseMeetingBtnClickEmitter.emit(this.meeting.id);
    };
    MeetingItemCoachComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingGoal(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.goal = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(reviews[0].value);
            else
                _this.goal = null;
            _this.cd.detectChanges();
            _this.hasGoal = (_this.goal != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getContext = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingContext(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != null)
                _this.context = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(reviews[0].value);
            else
                _this.context = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of('n/a');
            _this.loading = false;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getReviewValue = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewUtility(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingValue, got goal : ", reviews);
            if (reviews != null)
                _this.reviewValue = reviews[0].value;
            else
                _this.reviewValue = null;
            _this.cd.detectChanges();
            _this.hasValue = (_this.reviewValue != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingValue error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getReviewNextStep = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewResult(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingNextStep, : ", reviews);
            if (reviews != null)
                _this.reviewNextStep = reviews[0].value;
            else
                _this.reviewNextStep = null;
            _this.cd.detectChanges();
            _this.hasNextStep = (_this.reviewNextStep != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingNextStep error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.loadPotentialDays = function () {
        console.log("loadPotentialDays");
        var days = [];
        if (this.potentialDatesArray != null) {
            for (var _a = 0, _b = this.potentialDatesArray; _a < _b.length; _a++) {
                var date = _b[_a];
                var d = new Date(date.start_date);
                d.setHours(0);
                d.setMinutes(0);
                if (days.indexOf(d.toString()) < 0)
                    days.push(d.toString());
            }
        }
        this.potentialDays = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(days);
        this.cd.detectChanges();
        console.log("potentialDays", days);
    };
    MeetingItemCoachComponent.prototype.loadPotentialHours = function (selected) {
        console.log("loadPotentialHours", selected);
        var hours = [];
        for (var _a = 0, _b = this.potentialDatesArray; _a < _b.length; _a++) {
            var date = _b[_a];
            if (this.getDate(date.start_date) === this.getDate(selected)) {
                for (var _i = this.getHours(date.start_date); _i < this.getHours(date.end_date); _i++) {
                    hours.push(_i);
                }
            }
        }
        this.potentialHours = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(hours);
        this.cd.detectChanges();
        console.log("potentialHours", hours);
    };
    MeetingItemCoachComponent.prototype.printTimeNumber = function (hour) {
        return hour + ':00';
    };
    MeetingItemCoachComponent.prototype.printTimeString = function (date) {
        return this.getHours(date) + ':' + this.getMinutes(date);
    };
    MeetingItemCoachComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingItemCoachComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    MeetingItemCoachComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    MeetingItemCoachComponent.prototype.goToCoacheeProfile = function (coacheeId) {
        window.scrollTo(0, 0);
        this.router.navigate(['/profile_coachee', 'visiter', coacheeId]);
    };
    MeetingItemCoachComponent.prototype.onValidateDateClick = function () {
        this.onValidateDateBtnClick.emit({
            selectedDate: this.selectedDate,
            selectedHour: this.selectedHour,
            meeting: this.meeting
        });
    };
    return MeetingItemCoachComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */]) === "function" && _a || Object)
], MeetingItemCoachComponent.prototype, "meeting", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MeetingItemCoachComponent.prototype, "onValidateDateBtnClick", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MeetingItemCoachComponent.prototype, "cancelMeetingTimeEvent", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MeetingItemCoachComponent.prototype, "onCloseMeetingBtnClickEmitter", void 0);
MeetingItemCoachComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-meeting-item-coach',
        template: __webpack_require__(641),
        styles: [__webpack_require__(599)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__angular_router__["a" /* Router */]) === "function" && _e || Object])
], MeetingItemCoachComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-item-coach.component.js.map

/***/ }),

/***/ 360:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_Coach__ = __webpack_require__(47);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingListCoachComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MeetingListCoachComponent = (function () {
    /**
     *
     * @param meetingsService
     * @param coachCoacheeService
     * @param authService
     * @param cd
     */
    function MeetingListCoachComponent(meetingsService, coachCoacheeService, authService, cd) {
        this.meetingsService = meetingsService;
        this.coachCoacheeService = coachCoacheeService;
        this.authService = authService;
        this.cd = cd;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.hasUnbookedMeeting = false;
    }
    MeetingListCoachComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListCoachComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListCoachComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingListCoachComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof __WEBPACK_IMPORTED_MODULE_5__model_Coach__["a" /* Coach */]) {
                // coach
                console.log('get a coach');
                this.getAllMeetingsForCoach(user.id);
            }
            this.user = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListCoachComponent.prototype.getAllMeetingsForCoach = function (coachId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoachId(coachId).subscribe(function (meetings) {
            console.log('got meetings for coach', meetings);
            _this.meetingsArray = meetings;
            _this.meetings = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(meetings);
            _this.getBookedMeetings();
            _this.getClosedMeetings();
            _this.getUnbookedMeetings();
            _this.cd.detectChanges();
        });
    };
    MeetingListCoachComponent.prototype.getOpenedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && meeting.isOpen) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(opened);
        }
    };
    MeetingListCoachComponent.prototype.getClosedMeetings = function () {
        console.log('getClosedMeetings');
        if (this.meetingsArray != null) {
            var closed = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && !meeting.isOpen) {
                    closed.push(meeting);
                    this.hasClosedMeeting = true;
                }
            }
            this.meetingsClosed = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(closed);
        }
    };
    MeetingListCoachComponent.prototype.getBookedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && meeting.isOpen && meeting.agreed_date) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(opened);
        }
    };
    MeetingListCoachComponent.prototype.getUnbookedMeetings = function () {
        console.log('getAskedMeetings');
        if (this.meetingsArray != null) {
            var unbooked = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && meeting.isOpen && !meeting.agreed_date) {
                    unbooked.push(meeting);
                    this.hasUnbookedMeeting = true;
                }
            }
            this.meetingsUnbooked = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(unbooked);
        }
    };
    MeetingListCoachComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.rhUsageRate = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(rate);
        });
    };
    MeetingListCoachComponent.prototype.onCoachStartRoomClicked = function () {
        console.log('onCoachStartRoomClicked');
        this.user.take(1).subscribe(function (usr) {
            console.log('onCoachStartRoomClicked, get user');
            var coach = usr;
            var win = window.open(coach.chat_room_url, "_blank");
        });
    };
    MeetingListCoachComponent.prototype.refreshDashboard = function () {
        location.reload();
    };
    MeetingListCoachComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    /*************************************
     ----------- Modal control ------------
     *************************************/
    MeetingListCoachComponent.prototype.coachCancelModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coach_cancel_meeting').openModal();
        }
        else {
            $('#coach_cancel_meeting').closeModal();
        }
    };
    MeetingListCoachComponent.prototype.openCoachCancelMeetingModal = function (meeting) {
        this.meetingToCancel = meeting;
        this.coachCancelModalVisibility(true);
    };
    //
    // cancelCoachCancelMeeting() {
    //   this.coachCancelModalVisibility(false);
    //   this.meetingToCancel = null;
    // }
    //
    // // remove MeetingTime
    // validateCoachCancelMeeting() {
    //   console.log('validateCancelMeeting, agreed date : ', this.meetingToCancel.agreed_date);
    //   let meetingTimeId = this.meetingToCancel.agreed_date.id;
    //   console.log('validateCancelMeeting, id : ', meetingTimeId);
    //
    //   // hide modal
    //   this.coachCancelModalVisibility(false);
    //   this.meetingToCancel = null;
    //   // perform request
    //   this.meetingsService.removePotentialTime(meetingTimeId).subscribe(
    //     (response: Response) => {
    //       console.log('validateCancelMeeting, res ', response);
    //       console.log('emit');
    //       // this.dateRemoved.emit(null);
    //       this.onRefreshRequested();
    //       Materialize.toast('Meeting annulé !', 3000, 'rounded');
    //     }, (error) => {
    //       console.log('unbookAdate, error', error);
    //       Materialize.toast('Impossible d\'annuler le meeting', 3000, 'rounded');
    //     }
    //   );
    // }
    /*************************************
     ----------- Modal control to close a sessions ------------
     *************************************/
    MeetingListCoachComponent.prototype.updateCloseSessionModalVisibility = function (visible) {
        if (visible) {
            $('#complete_session_modal').openModal();
        }
        else {
            $('#complete_session_modal').closeModal();
        }
    };
    MeetingListCoachComponent.prototype.starCloseSessionFlow = function (meetingId) {
        console.log('startAddNewObjectiveFlow, coacheeId : ', meetingId);
        this.updateCloseSessionModalVisibility(true);
        this.meetingToReportId = meetingId;
    };
    MeetingListCoachComponent.prototype.cancelCloseSessionModal = function () {
        this.updateCloseSessionModalVisibility(false);
    };
    MeetingListCoachComponent.prototype.validateCloseSessionModal = function () {
        var _this = this;
        console.log('validateCloseSessionModal');
        //TODO start loader
        this.meetingsService.closeMeeting(this.meetingToReportId, this.sessionResult, this.sessionUtility).subscribe(function (meeting) {
            console.log("submitCloseMeetingForm, got meeting : ", meeting);
            // TODO stop loader
            //hide modal
            _this.updateCloseSessionModalVisibility(false);
            //refresh list of meetings
            _this.onRefreshRequested();
            Materialize.toast('Le compte-rendu a été envoyé !', 3000, 'rounded');
        }, function (error) {
            console.log('closeMeeting error', error);
            //TODO display error
            Materialize.toast('Impossible de clore la séance', 3000, 'rounded');
        });
    };
    return MeetingListCoachComponent;
}());
MeetingListCoachComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-meeting-list-coach',
        template: __webpack_require__(642),
        styles: [__webpack_require__(600)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object])
], MeetingListCoachComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-list-coach.component.js.map

/***/ }),

/***/ 361:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Meeting__ = __webpack_require__(231);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__ = __webpack_require__(37);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingItemCoacheeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MeetingItemCoacheeComponent = (function () {
    function MeetingItemCoacheeComponent(router, meetingService, cd) {
        this.router = router;
        this.meetingService = meetingService;
        this.cd = cd;
        // @Output()
        // onMeetingCancelled = new EventEmitter<any>();
        this.cancelMeetingTimeEvent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.onRateSessionBtnClickedEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    MeetingItemCoacheeComponent.prototype.ngOnInit = function () {
        this.coach = this.meeting.coach;
        console.log("ngOnInit, coach : ", this.coach);
        this.loadMeetingPotentialTimes();
        this.getGoal();
        this.getContext();
        this.getSessionCoachReview();
    };
    // onPreMeetingReviewPosted(meeting: Meeting) {
    //   console.log("onPreMeetingReviewPosted");
    //   this.getReview();
    // }
    //
    // onPotentialDatePosted(date: MeetingDate) {
    //   console.log("onPotentialDatePosted");
    //   this.potentialDatePosted.emit(date);
    // }
    MeetingItemCoacheeComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingPotentialTimes(this.meeting.id).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            _this.potentialDates = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(dates);
            _this.cd.detectChanges();
            _this.loading = false;
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoacheeComponent.prototype.printTimeString = function (date) {
        return this.getHours(date) + ':' + this.getMinutes(date);
    };
    MeetingItemCoacheeComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingItemCoacheeComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    MeetingItemCoacheeComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    MeetingItemCoacheeComponent.prototype.getSessionCoachReview = function () {
        this.getSessionReviewTypeResult();
        this.getSessionReviewTypeUtility();
        this.getSessionReviewTypeRate();
    };
    MeetingItemCoacheeComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingGoal(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null) {
                _this.hasGoal = true;
                _this.goal = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(reviews[0].value);
            }
            else {
                _this.hasGoal = false;
                _this.goal = null;
            }
            _this.cd.detectChanges();
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getContext = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingContext(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != null) {
                _this.hasContext = true;
                _this.context = __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].of(reviews[0].value);
            }
            else {
                _this.hasContext = false;
                _this.context = null;
            }
            _this.loading = false;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeResult = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewResult(this.meeting.id).subscribe(function (reviews) {
            console.log("getSessionReviewTypeResult, got result : ", reviews);
            if (reviews != null)
                _this.sessionResult = reviews[0].value;
            else
                _this.sessionResult = null;
            _this.cd.detectChanges();
            _this.hasSessionResult = (_this.sessionResult != null);
            _this.loading = false;
        }, function (error) {
            console.log('getReviewResult error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeUtility = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewUtility(this.meeting.id).subscribe(function (reviews) {
            console.log("getSessionReviewTypeUtility, got goal : ", reviews);
            if (reviews != null)
                _this.sessionUtility = reviews[0].value;
            else
                _this.sessionUtility = null;
            _this.cd.detectChanges();
            _this.hasSessionUtility = (_this.sessionUtility != null);
            _this.loading = false;
        }, function (error) {
            console.log('getSessionReviewTypeUtility error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeRate = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewRate(this.meeting.id).subscribe(function (reviews) {
            console.log("getSessionReviewTypeRate, got rate : ", reviews);
            if (reviews != null)
                _this.sessionRate = reviews[0].value;
            else
                _this.sessionRate = null;
            _this.cd.detectChanges();
            _this.hasRate = (_this.sessionRate != null);
            _this.loading = false;
        }, function (error) {
            console.log('getSessionReviewTypeRate error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.goToModifyDate = function (meetingId) {
        window.scrollTo(0, 0);
        this.router.navigate(['/date', meetingId]);
    };
    MeetingItemCoacheeComponent.prototype.openModal = function () {
        this.cancelMeetingTimeEvent.emit(this.meeting); //TODO to improve
        // $('#deleteModal').openModal();
    };
    MeetingItemCoacheeComponent.prototype.goToChatRoom = function () {
        console.log('goToChatRoom');
        var win = window.open(this.meeting.coach.chat_room_url, "_blank");
    };
    MeetingItemCoacheeComponent.prototype.goToCoachProfile = function (coachId) {
        window.scrollTo(0, 0);
        this.router.navigate(['/profile_coach', 'visiter', coachId]);
    };
    MeetingItemCoacheeComponent.prototype.rateSession = function () {
        console.log('rateSession');
        this.onRateSessionBtnClickedEmitter.emit(this.meeting.id);
    };
    return MeetingItemCoacheeComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Meeting__["a" /* Meeting */]) === "function" && _a || Object)
], MeetingItemCoacheeComponent.prototype, "meeting", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MeetingItemCoacheeComponent.prototype, "cancelMeetingTimeEvent", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MeetingItemCoacheeComponent.prototype, "onRateSessionBtnClickedEmitter", void 0);
MeetingItemCoacheeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-meeting-item-coachee',
        template: __webpack_require__(643),
        styles: [__webpack_require__(601)],
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _d || Object])
], MeetingItemCoacheeComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-item-coachee.component.js.map

/***/ }),

/***/ 362:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__model_Coachee__ = __webpack_require__(51);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingListCoacheeComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MeetingListCoacheeComponent = (function () {
    function MeetingListCoacheeComponent(router, meetingsService, coachCoacheeService, authService, cd) {
        this.router = router;
        this.meetingsService = meetingsService;
        this.coachCoacheeService = coachCoacheeService;
        this.authService = authService;
        this.cd = cd;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.sessionRate = '0';
        this.sessionPreRate = '0';
    }
    MeetingListCoacheeComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListCoacheeComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListCoacheeComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingListCoacheeComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof __WEBPACK_IMPORTED_MODULE_6__model_Coachee__["a" /* Coachee */]) {
                // coachee
                console.log('get a coachee');
                this.getAllMeetingsForCoachee(user.id);
            }
            this.user = __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListCoacheeComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            _this.meetingsArray = meetings;
            _this.meetings = __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(meetings);
            _this.getOpenedMeetings();
            _this.getClosedMeetings();
            _this.cd.detectChanges();
        });
    };
    MeetingListCoacheeComponent.prototype.goToDate = function () {
        var _this = this;
        console.log('goToDate');
        this.user.take(1).subscribe(function (user) {
            if (user == null) {
                console.log('no connected user');
                return;
            }
            // 1) create a new meeting
            // 2) refresh our user to have a correct number of available sessions
            // 3) redirect to our MeetingDateComponent
            _this.meetingsService.createMeeting(user.id).flatMap(function (meeting) {
                console.log('goToDate, meeting created');
                //meeting created, now fetch user
                return _this.authService.refreshConnectedUser().flatMap(function (user) {
                    console.log('goToDate, user refreshed');
                    return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(meeting);
                });
            }).subscribe(function (meeting) {
                // TODO display a loader
                console.log('goToDate, go to setup dates');
                window.scrollTo(0, 0);
                _this.router.navigate(['/date', meeting.id]);
            });
        });
    };
    MeetingListCoacheeComponent.prototype.getOpenedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(opened);
        }
    };
    MeetingListCoacheeComponent.prototype.getClosedMeetings = function () {
        console.log('getClosedMeetings');
        if (this.meetingsArray != null) {
            var closed = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (!meeting.isOpen) {
                    closed.push(meeting);
                    this.hasClosedMeeting = true;
                }
            }
            this.meetingsClosed = __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(closed);
        }
    };
    MeetingListCoacheeComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.rhUsageRate = __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(rate);
        });
    };
    MeetingListCoacheeComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    /*************************************
     ----------- Modal control ------------
     *************************************/
    MeetingListCoacheeComponent.prototype.coacheeDeleteModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coachee_delete_meeting_modal').openModal();
        }
        else {
            $('#coachee_delete_meeting_modal').closeModal();
        }
    };
    MeetingListCoacheeComponent.prototype.openCoacheeDeleteMeetingModal = function (meeting) {
        this.meetingToCancel = meeting;
        this.coacheeDeleteModalVisibility(true);
    };
    MeetingListCoacheeComponent.prototype.cancelCoacheeDeleteMeeting = function () {
        this.coacheeDeleteModalVisibility(false);
        this.meetingToCancel = null;
    };
    MeetingListCoacheeComponent.prototype.validateCoacheeDeleteMeeting = function () {
        var _this = this;
        console.log('validateCoacheeDeleteMeeting');
        var meetingId = this.meetingToCancel.id;
        this.coacheeDeleteModalVisibility(false);
        this.meetingToCancel = null;
        this.meetingsService.deleteMeeting(meetingId).subscribe(function (response) {
            console.log('confirmCancelMeeting, res', response);
            // this.onMeetingCancelled.emit();
            _this.onRefreshRequested();
            Materialize.toast('Meeting supprimé !', 3000, 'rounded');
        }, function (error) {
            console.log('confirmCancelMeeting, error', error);
            Materialize.toast('Impossible de supprimer le meeting', 3000, 'rounded');
        });
    };
    /*************************************
     ----------- Modal control - rate session ------------
     *************************************/
    MeetingListCoacheeComponent.prototype.setSessionRate = function (value) {
        this.sessionRate = value.toString();
    };
    MeetingListCoacheeComponent.prototype.setSessionPreRate = function (value) {
        this.sessionPreRate = value.toString();
    };
    MeetingListCoacheeComponent.prototype.updateRateSessionModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#rate_session_modal').openModal();
        }
        else {
            $('#rate_session_modal').closeModal();
        }
    };
    MeetingListCoacheeComponent.prototype.openRateSessionModal = function (meetingId) {
        this.rateSessionMeetingId = meetingId;
        this.updateRateSessionModalVisibility(true);
    };
    MeetingListCoacheeComponent.prototype.cancelRateSessionModal = function () {
        this.updateRateSessionModalVisibility(false);
        this.rateSessionMeetingId = null;
        this.sessionRate = null;
    };
    MeetingListCoacheeComponent.prototype.validateRateSessionModal = function () {
        var _this = this;
        console.log('validateRateSessionModal');
        this.meetingsService.addSessionRateToMeeting(this.rateSessionMeetingId, this.sessionRate).subscribe(function (response) {
            console.log('validateRateSessionModal, res', response);
            _this.onRefreshRequested();
            _this.updateRateSessionModalVisibility(false);
            Materialize.toast('Votre coach vient d\'être noté !', 3000, 'rounded');
        }, function (error) {
            console.log('validateRateSessionModal, error', error);
            _this.updateRateSessionModalVisibility(false);
            Materialize.toast('Impossible de noter votre coach', 3000, 'rounded');
        });
    };
    return MeetingListCoacheeComponent;
}());
MeetingListCoacheeComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-meeting-list-coachee',
        template: __webpack_require__(644),
        styles: [__webpack_require__(602)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_router__["a" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_auth_service__["a" /* AuthService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _e || Object])
], MeetingListCoacheeComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-list-coachee.component.js.map

/***/ }),

/***/ 363:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_PotentialCoachee__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_meetings_service__ = __webpack_require__(37);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingItemRhComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MeetingItemRhComponent = (function () {
    // private coacheeUsageRate: Observable<RhUsageRate>;
    function MeetingItemRhComponent(meetingsService, coachCoacheeService, cd) {
        this.meetingsService = meetingsService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        /**
         * Event emitted when user clicks on the "Objective" btn.
         * @type {EventEmitter<string>} the coacheeId
         */
        this.onUpdateObjectiveBtnClick = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        this.showDetails = false;
        this.hasBookedMeeting = false;
        this.goals = {};
    }
    MeetingItemRhComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.getUsageRate(this.coachee.id);
        this.getAllMeetingsForCoachee(this.coachee.id);
    };
    MeetingItemRhComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        // this.fetchConnectedUser();
    };
    MeetingItemRhComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    MeetingItemRhComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingItemRhComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    MeetingItemRhComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    MeetingItemRhComponent.prototype.toggleShowDetails = function () {
        this.showDetails = this.showDetails ? false : true;
    };
    MeetingItemRhComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.loading = true;
        this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            var bookedMeetings = [];
            for (var _i = 0, meetings_1 = meetings; _i < meetings_1.length; _i++) {
                var meeting = meetings_1[_i];
                if (meeting.agreed_date != null) {
                    bookedMeetings.push(meeting);
                    _this.hasBookedMeeting = true;
                    _this.getGoal(meeting.id);
                }
            }
            _this.meetings = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(bookedMeetings);
            _this.cd.detectChanges();
            _this.loading = false;
        });
    };
    MeetingItemRhComponent.prototype.getGoal = function (meetingId) {
        var _this = this;
        return this.meetingsService.getMeetingGoal(meetingId).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.goals[meetingId] = reviews[0].value;
            else
                _this.goals[meetingId] = 'n/a';
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemRhComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.coacheeUsageRate = __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"].of(rate);
        });
    };
    MeetingItemRhComponent.prototype.onClickAddObjectiveBtn = function () {
        this.onUpdateObjectiveBtnClick.emit(this.coachee.id);
    };
    return MeetingItemRhComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Coachee__["a" /* Coachee */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Coachee__["a" /* Coachee */]) === "function" && _a || Object)
], MeetingItemRhComponent.prototype, "coachee", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__model_PotentialCoachee__["a" /* PotentialCoachee */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__model_PotentialCoachee__["a" /* PotentialCoachee */]) === "function" && _b || Object)
], MeetingItemRhComponent.prototype, "potentialCoachee", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], MeetingItemRhComponent.prototype, "onUpdateObjectiveBtnClick", void 0);
MeetingItemRhComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-meeting-item-rh',
        template: __webpack_require__(646),
        styles: [__webpack_require__(604)]
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__service_meetings_service__["a" /* MeetingsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _e || Object])
], MeetingItemRhComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-item-rh.component.js.map

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_ContractPlan__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_HR__ = __webpack_require__(52);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingListRhComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MeetingListRhComponent = (function () {
    function MeetingListRhComponent(coachCoacheeService, authService, cd) {
        this.coachCoacheeService = coachCoacheeService;
        this.authService = authService;
        this.cd = cd;
        this.hasCollaborators = false;
        this.hasPotentialCollaborators = false;
        this.selectedPlan = new __WEBPACK_IMPORTED_MODULE_4__model_ContractPlan__["a" /* ContractPlan */]('-1');
    }
    MeetingListRhComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListRhComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListRhComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingListRhComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof __WEBPACK_IMPORTED_MODULE_5__model_HR__["a" /* HR */]) {
                // rh
                console.log('get a rh');
                this.getAllCoacheesForRh(user.id);
                this.getAllPotentialCoacheesForRh(user.id);
                this.getAllContractPlans();
                this.getUsageRate(user.id);
            }
            this.user = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListRhComponent.prototype.getAllCoacheesForRh = function (rhId) {
        var _this = this;
        this.subscription = this.coachCoacheeService.getAllCoacheesForRh(rhId).subscribe(function (coachees) {
            console.log('got coachees for rh', coachees);
            _this.coachees = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(coachees);
            if (coachees !== null && coachees.length > 0)
                _this.hasCollaborators = true;
            _this.cd.detectChanges();
        });
    };
    MeetingListRhComponent.prototype.getAllPotentialCoacheesForRh = function (rhId) {
        var _this = this;
        this.subscription = this.coachCoacheeService.getAllPotentialCoacheesForRh(rhId).subscribe(function (coachees) {
            console.log('got potentialCoachees for rh', coachees);
            _this.potentialCoachees = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(coachees);
            if (coachees !== null && coachees.length > 0)
                _this.hasPotentialCollaborators = true;
            _this.cd.detectChanges();
        });
    };
    MeetingListRhComponent.prototype.getAllContractPlans = function () {
        var _this = this;
        this.authService.getNotAuth(__WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */].GET_CONTRACT_PLANS, null).subscribe(function (response) {
            var json = response.json();
            console.log("getListOfContractPlans, response json : ", json);
            _this.plans = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(json);
            // this.cd.detectChanges();
        });
    };
    MeetingListRhComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.rhUsageRate = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].of(rate);
        });
    };
    MeetingListRhComponent.prototype.refreshDashboard = function () {
        location.reload();
    };
    MeetingListRhComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    /*************************************
     ----------- Modal control for Potential Coachee ------------
     *************************************/
    MeetingListRhComponent.prototype.addPotentialCoacheeModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#add_potential_coachee_modal').openModal();
        }
        else {
            $('#add_potential_coachee_modal').closeModal();
        }
    };
    MeetingListRhComponent.prototype.cancelAddPotentialCoachee = function () {
        this.potentialCoacheeEmail = null;
        this.addPotentialCoacheeModalVisibility(false);
    };
    MeetingListRhComponent.prototype.validateAddPotentialCoachee = function () {
        var _this = this;
        console.log('validateAddPotentialCoachee, potentialCoacheeEmail : ', this.potentialCoacheeEmail);
        this.addPotentialCoacheeModalVisibility(false);
        this.user.take(1).subscribe(function (user) {
            var body = {
                "email": _this.potentialCoacheeEmail,
                "plan_id": _this.selectedPlan.plan_id,
                "rh_id": user.id
            };
            _this.coachCoacheeService.postPotentialCoachee(body).subscribe(function (res) {
                console.log('postPotentialCoachee, res', res);
                _this.onRefreshRequested();
                Materialize.toast('Collaborateur ajouté !', 3000, 'rounded');
            }, function (error) {
                console.log('postPotentialCoachee, error', error);
                Materialize.toast("Impossible d'ajouter le collaborateur", 3000, 'rounded');
            });
        });
    };
    /*************************************
     ----------- Modal control for new coachee's objective ------------
     *************************************/
    MeetingListRhComponent.prototype.updateCoacheeObjectivePanelVisibility = function (visible) {
        if (visible) {
            $('#add_new_objective_modal').openModal();
        }
        else {
            $('#add_new_objective_modal').closeModal();
        }
    };
    MeetingListRhComponent.prototype.makeAPICallToAddNewObjective = function (user) {
        var _this = this;
        this.updateCoacheeObjectivePanelVisibility(false);
        //call API
        this.coachCoacheeService.addObjectiveToCoachee(user.id, this.addNewObjectiveCoacheeId, this.coacheeNewObjective).subscribe(function (obj) {
            console.log('addObjectiveToCoachee, SUCCESS', obj);
            // close modal
            _this.updateCoacheeObjectivePanelVisibility(false);
            _this.onRefreshRequested();
            Materialize.toast("L'objectif a été modifié !", 3000, 'rounded');
            // TODO stop loader
            // clean
            _this.coacheeNewObjective = null;
        }, function (error) {
            console.log('addObjectiveToCoachee, error', error);
            Materialize.toast("Imposible de modifier l'objectif", 3000, 'rounded');
        });
    };
    MeetingListRhComponent.prototype.startAddNewObjectiveFlow = function (coacheeId) {
        console.log('startAddNewObjectiveFlow, coacheeId : ', coacheeId);
        this.updateCoacheeObjectivePanelVisibility(true);
        this.addNewObjectiveCoacheeId = coacheeId;
    };
    MeetingListRhComponent.prototype.cancelAddNewObjectiveModal = function () {
        this.updateCoacheeObjectivePanelVisibility(false);
    };
    MeetingListRhComponent.prototype.validateAddNewObjectiveModal = function () {
        var _this = this;
        console.log('validateAddNewObjectiveModal');
        // TODO start loader
        var user = this.authService.getConnectedUser();
        if (user == null) {
            var userObs = this.authService.getConnectedUserObservable();
            userObs.take(1).subscribe(function (user) {
                console.log('validateAddNewObjectiveModal, got connected user');
                if (user instanceof __WEBPACK_IMPORTED_MODULE_5__model_HR__["a" /* HR */]) {
                    _this.makeAPICallToAddNewObjective(user);
                }
            });
            return;
        }
        if (user instanceof __WEBPACK_IMPORTED_MODULE_5__model_HR__["a" /* HR */]) {
            this.makeAPICallToAddNewObjective(user);
        }
    };
    return MeetingListRhComponent;
}());
MeetingListRhComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-meeting-list-rh',
        template: __webpack_require__(647),
        styles: [__webpack_require__(605)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_coach_coachee_service__["a" /* CoachCoacheeService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__service_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ChangeDetectorRef"]) === "function" && _c || Object])
], MeetingListRhComponent);

var _a, _b, _c;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meeting-list-rh.component.js.map

/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__ = __webpack_require__(37);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PreMeetingComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PreMeetingComponent = (function () {
    function PreMeetingComponent(meetingService) {
        this.meetingService = meetingService;
        this.meetingGoal = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.meetingContext = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    PreMeetingComponent.prototype.ngOnInit = function () {
        console.log("PreMeetingComponent onInit");
        //this.getAllMeetingReviews();
        this.getMeetingGoal();
        this.getMeetingContext();
    };
    /* Get from API review goal for the given meeting */
    PreMeetingComponent.prototype.getMeetingGoal = function () {
        var _this = this;
        this.meetingService.getMeetingGoal(this.meetingId).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.updateGoalValue(reviews[0].value);
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    /* Get from API all review context for the given meeting */
    PreMeetingComponent.prototype.getMeetingContext = function () {
        var _this = this;
        this.meetingService.getMeetingContext(this.meetingId).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != null)
                _this.updateContextValue(reviews[0].value);
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    PreMeetingComponent.prototype.onGoalValueChanged = function (event) {
        var goal = event.target.value;
        console.log('onGoalValueChanged res', goal);
        this.updateGoalValue(goal);
    };
    PreMeetingComponent.prototype.onContextValueChanged = function (event) {
        var context = event.target.value;
        console.log('onContextValueChanged res', context);
        this.updateContextValue(context);
    };
    PreMeetingComponent.prototype.updateGoalValue = function (goal) {
        this.uiMeetingGoal = goal;
        this.meetingGoal.emit(this.uiMeetingGoal);
    };
    PreMeetingComponent.prototype.updateContextValue = function (context) {
        this.uiMeetingContext = context;
        this.meetingContext.emit(this.uiMeetingContext);
    };
    return PreMeetingComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], PreMeetingComponent.prototype, "meetingId", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], PreMeetingComponent.prototype, "meetingGoal", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], PreMeetingComponent.prototype, "meetingContext", void 0);
PreMeetingComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'er-pre-meeting',
        template: __webpack_require__(648),
        styles: [__webpack_require__(606)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__service_meetings_service__["a" /* MeetingsService */]) === "function" && _a || Object])
], PreMeetingComponent);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/pre-meeting.component.js.map

/***/ }),

/***/ 366:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContractPlan; });
/**
 *
 */
var ContractPlan = (function () {
    function ContractPlan(id) {
        this.plan_id = id;
    }
    return ContractPlan;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/ContractPlan.js.map

/***/ }),

/***/ 367:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MEETING_REVIEW_TYPE_SESSION_CONTEXT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MEETING_REVIEW_TYPE_SESSION_GOAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return MEETING_REVIEW_TYPE_SESSION_RESULT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return MEETING_REVIEW_TYPE_SESSION_UTILITY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MEETING_REVIEW_TYPE_SESSION_RATE; });
var MEETING_REVIEW_TYPE_SESSION_CONTEXT = "SESSION_CONTEXT";
var MEETING_REVIEW_TYPE_SESSION_GOAL = "SESSION_GOAL";
var MEETING_REVIEW_TYPE_SESSION_RESULT = "SESSION_RESULT";
var MEETING_REVIEW_TYPE_SESSION_UTILITY = "SESSION_UTILITY";
var MEETING_REVIEW_TYPE_SESSION_RATE = "SESSION_RATE";
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/MeetingReview.js.map

/***/ }),

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__log_service__ = __webpack_require__(233);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DataService = (function () {
    function DataService(logService) {
        this.logService = logService;
        this.data = [];
        this.pushedData = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    DataService.prototype.addData = function (input) {
        this.data.push(input);
        this.logService.writeToLog("add new data");
        this.pushedData.emit(input);
    };
    DataService.prototype.getData = function () {
        return this.data;
    };
    return DataService;
}());
DataService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__log_service__["a" /* LogService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__log_service__["a" /* LogService */]) === "function" && _a || Object])
], DataService);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/data.service.js.map

/***/ }),

/***/ 369:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coach__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoachItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CoachItemComponent = (function () {
    function CoachItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    CoachItemComponent.prototype.ngOnInit = function () {
        console.log("CoachItemComponent, ngOnInit : ", this.coach);
    };
    CoachItemComponent.prototype.goToCoachProfile = function (coachId) {
        window.scrollTo(0, 0);
        this.router.navigate(['/profile_coach', 'admin', coachId]);
    };
    CoachItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    CoachItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    CoachItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    CoachItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    return CoachItemComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */]) === "function" && _a || Object)
], CoachItemComponent.prototype, "coach", void 0);
CoachItemComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-coach-item',
        template: __webpack_require__(649),
        styles: [__webpack_require__(607)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === "function" && _b || Object])
], CoachItemComponent);

var _a, _b;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/coach-item.component.js.map

/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__ = __webpack_require__(367);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeetingsService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MeetingsService = (function () {
    function MeetingsService(apiService) {
        this.apiService = apiService;
    }
    MeetingsService.prototype.getAllMeetingsForCoacheeId = function (coacheeId) {
        var param = [coacheeId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_MEETINGS_FOR_COACHEE_ID, param).map(function (response) {
            var json = response.json();
            console.log("getAllMeetingsForCoacheeId, response json : ", json);
            return json;
        });
    };
    MeetingsService.prototype.getAllMeetingsForCoachId = function (coachId) {
        var param = [coachId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_MEETINGS_FOR_COACH_ID, param).map(function (response) {
            var json = response.json();
            console.log("getAllMeetingsForCoachId, response json : ", json);
            return json;
        });
    };
    /**
     * Create a meeting for the given Coachee
     * @param coacheeId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.createMeeting = function (coacheeId) {
        console.log("bookAMeeting coacheeId %s", coacheeId); //todo check if userId ok
        var body = {
            coacheeId: coacheeId
        };
        return this.apiService.post(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].POST_MEETING, null, body).map(function (response) {
            var meeting = response.json();
            console.log("bookAMeeting, response json : ", meeting);
            return meeting;
        });
    };
    /**
     * Delete a meeting
     * @returns {Observable<Response>}
     */
    MeetingsService.prototype.deleteMeeting = function (meetingId) {
        var param = [meetingId];
        return this.apiService.delete(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].DELETE_MEETING, param);
    };
    /**
     * Delete a potential date
     * @param potentialId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.updatePotentialTime = function (potentialId, startDate, endDate) {
        console.log("updatePotentialTime, potentialId %s", potentialId);
        var body = {
            start_date: startDate.toString(),
            end_date: endDate.toString(),
        };
        var param = [potentialId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].PUT_POTENTIAL_DATE_TO_MEETING, param, body).map(function (response) {
            var json = response.json();
            console.log("updatePotentialTime, response json : ", json);
            return json;
        });
    };
    /**
     * Delete a potential date
     * @param potentialId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.removePotentialTime = function (potentialId) {
        console.log("removePotentialTime, potentialId %s", potentialId);
        var param = [potentialId];
        return this.apiService.delete(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].DELETE_POTENTIAL_DATE, param).map(function (response) {
            var json = response.json();
            console.log("removePotentialTime, response json : ", json);
            return json;
        });
    };
    /**
     * Close the given meeting with a comment
     * Only a Coach can close a meeting.
     * @param meetingId
     * @param comment
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.closeMeeting = function (meetingId, result, utility) {
        console.log("closeMeeting, meetingId %s, result : %s, utility : %s", meetingId, result, utility);
        var body = {
            result: result,
            utility: utility,
        };
        var param = [meetingId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].CLOSE_MEETING, param, body).map(function (response) {
            var json = response.json();
            console.log("closeMeeting, response json : ", json);
            return json;
        });
    };
    /**
     * Add this date as a Potential Date for the given meeting
     * @param meetingId
     * @param startDate
     * @param endDate
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.addPotentialDateToMeeting = function (meetingId, startDate, endDate) {
        console.log("addPotentialDateToMeeting, meeting id : %s, startDate : %s, endDate : %s", meetingId, startDate, endDate);
        var body = {
            start_date: startDate.toString(),
            end_date: endDate.toString(),
        };
        var param = [meetingId];
        return this.apiService.post(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].POST_MEETING_POTENTIAL_DATE, param, body).map(function (response) {
            var json = response.json();
            console.log("getCoachForId, response json : ", json);
            return json;
        });
    };
    /**
     * Fetch all potential dates for the given meeting
     * @param meetingId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.getMeetingPotentialTimes = function (meetingId) {
        console.log("getMeetingPotentialTimes, meetingId : ", meetingId);
        var param = [meetingId];
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_MEETING_POTENTIAL_DATES, param).map(function (response) {
            var dates = response.json();
            console.log("getMeetingPotentialTimes, response json : ", dates);
            return dates;
        });
    };
    /**
     *
     * @param meetingId
     * @param potentialDateId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.setFinalDateToMeeting = function (meetingId, potentialDateId) {
        console.log("setFinalDateToMeeting, meetingId %s, potentialId %s", meetingId, potentialDateId);
        var param = [meetingId, potentialDateId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].PUT_FINAL_DATE_TO_MEETING, param, null).map(function (response) {
            var meeting = response.json();
            console.log("setFinalDateToMeeting, response json : ", meeting);
            return meeting;
        });
    };
    //get all MeetingReview for context == SESSION_CONTEXT
    MeetingsService.prototype.getMeetingContext = function (meetingId) {
        console.log("getMeetingContext");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__["a" /* MEETING_REVIEW_TYPE_SESSION_CONTEXT */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getMeetingContext, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == SESSION_GOAL
    MeetingsService.prototype.getMeetingGoal = function (meetingId) {
        console.log("getMeetingGoal");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__["b" /* MEETING_REVIEW_TYPE_SESSION_GOAL */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getMeetingGoal, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RESULT
    MeetingsService.prototype.getSessionReviewResult = function (meetingId) {
        console.log("getSessionReviewResult");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__["c" /* MEETING_REVIEW_TYPE_SESSION_RESULT */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewResult, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_UTILITY
    MeetingsService.prototype.getSessionReviewUtility = function (meetingId) {
        console.log("getSessionReviewUtility");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__["d" /* MEETING_REVIEW_TYPE_SESSION_UTILITY */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewUtility, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RATE
    MeetingsService.prototype.getSessionReviewRate = function (meetingId) {
        console.log("getSessionReviewRate");
        var searchParams = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* URLSearchParams */]();
        searchParams.set('type', __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__["e" /* MEETING_REVIEW_TYPE_SESSION_RATE */]);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewRate, response json : ", json);
            return json;
        });
    };
    //add review for type SESSION_CONTEXT
    MeetingsService.prototype.addAContextForMeeting = function (meetingId, context) {
        console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, context);
        var body = {
            value: context,
            type: __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__["a" /* MEETING_REVIEW_TYPE_SESSION_CONTEXT */],
        };
        var param = [meetingId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].PUT_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
        });
    };
    //add review for type MEETING_REVIEW_TYPE_SESSION_GOAL
    MeetingsService.prototype.addAGoalToMeeting = function (meetingId, goal) {
        console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, goal);
        var body = {
            value: goal,
            type: __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__["b" /* MEETING_REVIEW_TYPE_SESSION_GOAL */],
        };
        var param = [meetingId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].PUT_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
        });
    };
    /**
     * Add a rate for this meeting
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.addSessionRateToMeeting = function (meetingId, rate) {
        console.log("addSessionRateToMeeting, meetingId %s, rate : %s", meetingId, rate);
        var body = {
            type: __WEBPACK_IMPORTED_MODULE_3__model_MeetingReview__["e" /* MEETING_REVIEW_TYPE_SESSION_RATE */],
            value: rate,
        };
        var param = [meetingId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].PUT_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addSessionRateToMeeting, response json : ", json);
            return json;
        });
    };
    /**
     * Fetch all meetings where no coach is associated
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.getAvailableMeetings = function () {
        console.log("getAvailableMeetings");
        return this.apiService.get(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].GET_AVAILABLE_MEETINGS, null).map(function (response) {
            var meetings = response.json();
            console.log("getAvailableMeetings");
            return meetings;
        });
    };
    /**
     * Associated this coach with this meeting
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.associateCoachToMeeting = function (meetingId, coachId) {
        console.log("associateCoachToMeeting");
        var param = [meetingId, coachId];
        return this.apiService.put(__WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */].PUT_COACH_TO_MEETING, param, null).map(function (response) {
            var meeting = response.json();
            console.log("associateCoachToMeeting");
            return meeting;
        });
    };
    return MeetingsService;
}());
MeetingsService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */]) === "function" && _a || Object])
], MeetingsService);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/meetings.service.js.map

/***/ }),

/***/ 370:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coachee__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(13);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoacheeItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CoacheeItemComponent = (function () {
    function CoacheeItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    CoacheeItemComponent.prototype.ngOnInit = function () {
    };
    CoacheeItemComponent.prototype.goToCoacheeProfile = function (coacheeId) {
        window.scrollTo(0, 0);
        this.router.navigate(['/profile_coachee', 'admin', coacheeId]);
    };
    CoacheeItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    CoacheeItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    CoacheeItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    CoacheeItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    return CoacheeItemComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Coachee__["a" /* Coachee */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Coachee__["a" /* Coachee */]) === "function" && _a || Object)
], CoacheeItemComponent.prototype, "coachee", void 0);
CoacheeItemComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-coachee-item',
        template: __webpack_require__(651),
        styles: [__webpack_require__(609)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === "function" && _b || Object])
], CoacheeItemComponent);

var _a, _b;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/coachee-item.component.js.map

/***/ }),

/***/ 371:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_Coach__ = __webpack_require__(47);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileCoachSummaryComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ProfileCoachSummaryComponent = (function () {
    function ProfileCoachSummaryComponent() {
    }
    ProfileCoachSummaryComponent.prototype.ngOnInit = function () {
    };
    return ProfileCoachSummaryComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__model_Coach__["a" /* Coach */]) === "function" && _a || Object)
], ProfileCoachSummaryComponent.prototype, "coach", void 0);
ProfileCoachSummaryComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-profile-coach-summary',
        template: __webpack_require__(652),
        styles: [__webpack_require__(610)]
    }),
    __metadata("design:paramtypes", [])
], ProfileCoachSummaryComponent);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/profile-coach-summary.component.js.map

/***/ }),

/***/ 372:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_HR__ = __webpack_require__(52);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RhItemComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RhItemComponent = (function () {
    function RhItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    RhItemComponent.prototype.ngOnInit = function () {
    };
    RhItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    RhItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    RhItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    RhItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    return RhItemComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__model_HR__["a" /* HR */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__model_HR__["a" /* HR */]) === "function" && _a || Object)
], RhItemComponent.prototype, "rh", void 0);
RhItemComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'rb-rh-item',
        template: __webpack_require__(656),
        styles: [__webpack_require__(614)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], RhItemComponent);

var _a, _b;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/rh-item.component.js.map

/***/ }),

/***/ 373:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_core_js_es6_symbol__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__ = __webpack_require__(405);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_core_js_es6_object___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_core_js_es6_object__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_core_js_es6_function___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_core_js_es6_function__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__ = __webpack_require__(407);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_js_es6_parse_int__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__ = __webpack_require__(406);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_js_es6_parse_float__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__ = __webpack_require__(404);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_js_es6_number___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_js_es6_number__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_core_js_es6_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_core_js_es6_math__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__ = __webpack_require__(411);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_core_js_es6_string___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_core_js_es6_string__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_core_js_es6_date___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_core_js_es6_date__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_core_js_es6_array___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_core_js_es6_array__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__ = __webpack_require__(409);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_core_js_es6_regexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_core_js_es6_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_core_js_es6_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_core_js_es6_set___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_core_js_es6_set__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__ = __webpack_require__(408);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_core_js_es6_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_core_js_es7_reflect__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__ = __webpack_require__(914);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_zone_js_dist_zone__);
// This file includes polyfills needed by Angular 2 and is loaded before
// the app. You can add your own extra polyfills to this file.
















//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/polyfills.js.map

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Coach; });
/**
 * Created by guillaume on 01/02/2017.
 */
var Coach = (function () {
    function Coach(id) {
        this.id = id;
    }
    return Coach;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/Coach.js.map

/***/ }),

/***/ 51:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Coachee; });
var Coachee = (function () {
    function Coachee(id) {
        this.id = id;
    }
    return Coachee;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/Coachee.js.map

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HR; });
/**
 * Created by guillaume on 15/05/2017.
 */
var HR = (function () {
    function HR(id) {
        this.id = id;
    }
    return HR;
}());

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/HR.js.map

/***/ }),

/***/ 585:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".admin-name {\n  font-size: 20px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 586:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 587:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 588:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 589:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".message-container:first-of-type {\n  border-top-width: 0; }\n\n.message-container {\n  display: block;\n  margin-top: 10px;\n  border-top: 1px solid #f3f3f3;\n  padding-top: 10px;\n  /*opacity: 0;*/\n  -webkit-transition: opacity 1s ease-in-out;\n  transition: opacity 1s ease-in-out; }\n\n.message-container.visible {\n  opacity: 1; }\n\n.message-container .pic {\n  /*background-image: url('assets/profile_placeholder.png');*/\n  background-repeat: no-repeat;\n  width: 30px;\n  height: 30px;\n  background-size: 30px;\n  border-radius: 20px; }\n\n.message-container .spacing {\n  display: table-cell;\n  vertical-align: top; }\n\n.message-container .message {\n  display: table-cell;\n  width: calc(100% - 40px);\n  padding: 5px 0 5px 10px; }\n\n.message-container .name {\n  display: inline-block;\n  width: 100%;\n  padding-left: 40px;\n  color: #bbb;\n  font-style: italic;\n  font-size: 12px;\n  box-sizing: border-box; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 590:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\nhtml, body {\n  font-family: 'Roboto', 'Helvetica', sans-serif; }\n\nmain, #messages-card {\n  height: 100%;\n  padding-bottom: 0; }\n\n#messages-card-container {\n  height: calc(100% - 150px);\n  padding-bottom: 0; }\n\n#messages-card {\n  margin-top: 15px; }\n\n.mdl-layout__header-row span {\n  margin-left: 15px;\n  margin-top: 17px; }\n\n.mdl-grid {\n  max-width: 1024px;\n  margin: auto; }\n\n.material-icons {\n  font-size: 36px;\n  top: 8px;\n  position: relative; }\n\n.mdl-layout__header-row {\n  padding: 0;\n  margin: 0 auto; }\n\n.mdl-card__supporting-text {\n  width: auto;\n  height: 100%;\n  padding-top: 0;\n  padding-bottom: 0; }\n\n#messages {\n  overflow-y: auto;\n  margin-bottom: 10px;\n  height: calc(100% - 80px); }\n\n#message-filler {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n\n#message-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  width: calc(100% - 48px);\n  float: left; }\n\n#image-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  width: 48px;\n  float: right; }\n\n#message-form .mdl-textfield {\n  width: calc(100% - 100px); }\n\n#message-form button, #image-form button {\n  width: 100px;\n  margin: 15px 0 0 10px; }\n\n.mdl-card {\n  min-height: 0; }\n\n.mdl-card {\n  background: -webkit-linear-gradient(white, #f9f9f9);\n  background: linear-gradient(white, #f9f9f9);\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n#user-container {\n  position: absolute;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  top: 22px;\n  width: 100%;\n  right: 0;\n  padding-left: 10px;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  padding-right: 10px; }\n\n#user-container #user-pic {\n  top: -3px;\n  position: relative;\n  display: inline-block;\n  /*background-image: url('assets/profile_placeholder.png');*/\n  background-repeat: no-repeat;\n  width: 40px;\n  height: 40px;\n  background-size: 40px;\n  border-radius: 20px; }\n\n#user-container #user-name {\n  font-size: 16px;\n  line-height: 36px;\n  padding-right: 10px;\n  padding-left: 20px; }\n\n#image-form #submitImage {\n  width: auto;\n  padding: 0 6px 0 1px;\n  min-width: 0; }\n\n#image-form #submitImage .material-icons {\n  top: -1px; }\n\n.message img {\n  max-width: 300px;\n  max-height: 200px; }\n\n#mediaCapture {\n  display: none; }\n\n@media screen and (max-width: 610px) {\n  header {\n    height: 113px;\n    padding-bottom: 80px !important; }\n  #user-container {\n    top: 72px;\n    background-color: #039be5;\n    height: 38px;\n    padding-top: 3px;\n    padding-right: 2px; }\n  #user-container #user-pic {\n    top: 2px;\n    width: 33px;\n    height: 33px;\n    background-size: 33px; } }\n\n.mdl-textfield__label:after {\n  background-color: #0288D1; }\n\n.mdl-textfield--floating-label.is-focused .mdl-textfield__label {\n  color: #0288D1; }\n\n.mdl-button .material-icons {\n  top: -1px;\n  margin-right: 5px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 591:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\nnav {\n  background-color: transparent;\n  background-attachment: scroll;\n  background-position: top;\n  background-size: cover;\n  min-height: 96px;\n  box-shadow: none; }\n\n.user-connected nav {\n  background-image: url(" + __webpack_require__(67) + "); }\n\nnav li {\n  background-color: transparent; }\n\nnav li a {\n  cursor: pointer;\n  color: #FFF;\n  opacity: .9; }\n\nnav li.active a {\n  font-weight: bold;\n  font-size: 110%;\n  padding: 0;\n  margin: 0 16px; }\n\nnav li a:hover,\nnav li a:focus,\nnav li.active a {\n  color: #FFF !important;\n  opacity: 1; }\n\n.side-nav li a:hover,\n.side-nav li a:focus,\n.side-nav li.active a {\n  color: #46b0ff !important; }\n\n.navbar-fixed,\n.navbar {\n  min-height: 96px;\n  padding: 0; }\n\n.navbar-color {\n  background-color: rgba(35, 88, 128, 0.6);\n  /*background-color: var(--main-dark-blue);*/\n  height: 100%;\n  padding: 16px; }\n\n.brand-logo {\n  padding: 0; }\n\n.logo-text img {\n  height: 50px; }\n\n.side-nav {\n  padding: 0;\n  background-color: white;\n  color: #3E3E3E; }\n\n.side-nav-header {\n  background-image: url(" + __webpack_require__(67) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  min-height: 96px;\n  box-shadow: none; }\n\n.side-nav-header-container {\n  padding: 64px 32px;\n  color: #FFF;\n  background-color: rgba(35, 88, 128, 0.6);\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  line-height: 1.5; }\n\n.side-nav-user-img {\n  width: 90px;\n  height: 90px;\n  margin-right: 16px; }\n\n.side-nav-user-info h5 {\n  margin: 0;\n  margin-bottom: 4px; }\n\n.side-nav-user-info span {\n  font-weight: 200;\n  color: #e5e5e5; }\n\n.side-nav-items {\n  padding: 16px; }\n\nheader {\n  background-image: url(" + __webpack_require__(67) + ");\n  background-attachment: fixed;\n  background-position: center;\n  background-size: cover; }\n\nheader.user-connected {\n  background-attachment: scroll; }\n\n.header-user {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); }\n\n.header-user-filter {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  padding: 64px 0; }\n\n.header-user-info {\n  margin-left: 16px; }\n\n.header-user-img {\n  height: 100px;\n  width: 100px; }\n\n.welcome-header {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  text-align: center;\n  color: #ffffff;\n  padding: 64px 0;\n  background-color: rgba(35, 88, 128, 0.6); }\n\n.header-title {\n  /*font-size: 66px*/\n  font-size: 8vmin;\n  /*Test taille adaptative relative à la taille minimale de l'écran*/\n  font-weight: 500;\n  letter-spacing: 1.1px;\n  margin: 0; }\n\n.header-subtitle {\n  /*font-size: 36px;*/\n  font-size: 4vmin;\n  font-weight: 300;\n  letter-spacing: 2.3px;\n  margin: 64px 0; }\n\n.header-btn {\n  text-align: center; }\n\n.header-btn .btn-basic {\n  min-width: 200px;\n  margin: 8px; }\n\n.header-arrow-bottom {\n  font-size: 66px;\n  color: #ffffff;\n  opacity: 0.6; }\n\n.header-arrow-bottom:hover {\n  opacity: 1; }\n\nrb-signin {\n  width: 30%; }\n\n@media (max-width: 960px) {\n  rb-signin {\n    width: 80%; } }\n\n.dropdown-notifs {\n  padding: 0; }\n\n.notif-item,\n.profil-item {\n  padding: 16px; }\n\n.profil-item:hover {\n  color: #46b0ff !important; }\n\n.notif-count {\n  background-color: #46b0ff;\n  height: 24px;\n  width: 24px;\n  padding: 0;\n  margin: 0;\n  font-size: 16px;\n  line-height: 24px;\n  text-align: center;\n  border-radius: 100%;\n  position: relative;\n  top: -55px;\n  right: -28px; }\n\n.notif-date {\n  margin: 0;\n  color: #C7C7C7; }\n\n.notif-messsage {\n  margin: 0;\n  font-weight: bold; }\n\n.notif-delete {\n  padding: 0;\n  text-align: center; }\n  .notif-delete a {\n    color: #C7C7C7 !important; }\n\nnav .notif-delete:hover a {\n  color: #46b0ff !important; }\n\n.item-user-img {\n  height: 35px;\n  width: 35px;\n  margin-right: 4px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 592:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "/*#main_container {\n  padding:32px;\n}\n\n#form_container {\n  padding: 32px;\n  max-width: 50%;\n}*/\nlabel {\n  color: #ffffff;\n  font-size: 20px;\n  font-weight: 300;\n  opacity: .6; }\n\ninput[type=\"password\"],\ninput[type=\"password\"]:focus:not([readonly]),\ninput[type=\"email\"],\ninput[type=\"email\"]:focus:not([readonly]),\ntextarea,\ntextarea:focus:not([readonly]) {\n  background-color: rgba(255, 255, 255, 0.6) !important; }\n\nbutton[type=\"submit\"] {\n  background-color: #46b0ff;\n  border: none;\n  border-radius: 100%;\n  width: 64px;\n  height: 64px;\n  font-size: 24px;\n  font-weight: 300; }\n\nbutton[type=\"submit\"]:hover {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12); }\n\nbutton[type=\"submit\"]:disabled {\n  opacity: .5; }\n\n#main_container {\n  width: 30%;\n  margin: auto; }\n\n@media (max-width: 960px) {\n  #main_container {\n    width: 80%; } }\n\n.spinner-white {\n  border-color: #FFF; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 593:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "#signup_btn {\n  margin-top: 2em; }\n\n.card-panel {\n  padding: 16px 32px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 594:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 595:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 596:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 597:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n.container {\n  /*Evite que le texte se sélectionne pendant la sélection sur le slider*/\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.header-date-picker {\n  line-height: 1.5;\n  margin-bottom: 64px; }\n\n.custom-day {\n  display: inline-block;\n  border-radius: 100%;\n  color: #3E3E3E;\n  font-size: 16px;\n  line-height: 40px;\n  height: 40px;\n  width: 40px; }\n\n.custom-day:hover {\n  background-color: #C7C7C7; }\n\n.custom-day.text-muted {\n  color: #e7e7e7 !important;\n  pointer-events: none;\n  cursor: default; }\n\n.bg-primary {\n  background-color: #46b0ff !important;\n  color: #FFF !important; }\n\n.has-potential-date {\n  color: #46b0ff;\n  font-weight: 600; }\n\n.plage-horaire {\n  font-weight: 800; }\n\n#datepicker-container {\n  display: inline-block;\n  width: 361.5px;\n  border-radius: 0.25rem;\n  margin-bottom: 32px; }\n\n#potential-dates {\n  padding: 0 32px 16px; }\n\n.potential-date {\n  margin-bottom: 16px; }\n\n.potential-date-content {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n\n.blue-point {\n  background-color: #46b0ff;\n  width: 20px;\n  height: 20px;\n  border-radius: 100%;\n  margin-right: 8px; }\n\n.potential-date-timeslot {\n  font-size: 20px;\n  font-weight: 600;\n  margin: 0; }\n\n.modify-timeslot,\n.delete-timeslot {\n  color: #C7C7C7 !important;\n  margin-left: 8px; }\n\n.modify-timeslot:hover,\n.delete-timeslot:hover {\n  color: #46b0ff !important;\n  cursor: pointer; }\n\n@media (max-width: 1180px) {\n  #datepicker-container {\n    -webkit-transform: scale(0.7);\n    transform: scale(0.7); } }\n\n@media (max-width: 990px) {\n  #datepicker-container {\n    -webkit-transform: scale(1);\n    transform: scale(1); } }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 598:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "#coach_cancel_meeting {\n  height: 200px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 599:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "button {\n  margin: 0; }\n\na:hover,\na:focus {\n  color: #46b0ff !important; }\n\np {\n  margin: 0; }\n\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item > .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0px; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  cursor: pointer; }\n\n.meeting-item-coach:hover,\n.meeting-item-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 22px;\n  margin-left: 32px;\n  text-align: right; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 64px; }\n\n.meeting-item-body-buttons {\n  padding: 16px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-potential {\n  margin: 4px 0; }\n\n.meeting-potential-date {\n  display: inline-block;\n  width: 60px; }\n\n.confirm-meeting-form {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -ms-flex-line-pack: center;\n      align-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.confirm-meeting-form .input-field {\n  margin-right: 16px;\n  margin-top: 0; }\n\n.confirm-meeting-form select {\n  min-width: 120px; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    padding-left: 0; }\n  .confirm-meeting-form {\n    /*flex-direction: column;*/\n    /*align-items: flex-start;*/\n    /*align-content: flex-start;*/ }\n  .confirm-meeting-form .input-field {\n    margin-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin-left: 8px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 60:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__auth_service__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminAPIService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AdminAPIService = (function () {
    function AdminAPIService(httpService) {
        this.httpService = httpService;
        console.log("ctr done");
    }
    AdminAPIService.prototype.createPotentialCoach = function (body) {
        return this.post(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].POST_POTENTIAL_COACH, null, body).map(function (res) {
            var potentialCoach = res.json();
            return potentialCoach;
        });
    };
    AdminAPIService.prototype.createPotentialRh = function (body) {
        return this.post(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].POST_POTENTIAL_RH, null, body).map(function (res) {
            var potentialRh = res.json();
            return potentialRh;
        });
    };
    AdminAPIService.prototype.getAdmin = function () {
        return this.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].GET_ADMIN, null).map(function (res) {
            var admin = res.json();
            return admin;
        });
    };
    AdminAPIService.prototype.getCoachs = function () {
        return this.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].ADMIN_GET_COACHS, null).map(function (res) {
            var coachs = res.json();
            return coachs;
        });
    };
    AdminAPIService.prototype.getCoachees = function () {
        return this.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].ADMIN_GET_COACHEES, null).map(function (res) {
            var Coachees = res.json();
            return Coachees;
        });
    };
    AdminAPIService.prototype.getRhs = function () {
        return this.get(__WEBPACK_IMPORTED_MODULE_3__auth_service__["a" /* AuthService */].ADMIN_GET_RHS, null).map(function (res) {
            var HRs = res.json();
            return HRs;
        });
    };
    AdminAPIService.prototype.post = function (path, params, body) {
        return this.httpService.post(this.generatePath(path, params), body);
    };
    AdminAPIService.prototype.put = function (path, params, body) {
        return this.httpService.put(this.generatePath(path, params), body);
    };
    AdminAPIService.prototype.get = function (path, params) {
        return this.getWithSearchParams(path, params, null);
    };
    AdminAPIService.prototype.getWithSearchParams = function (path, params, searchParams) {
        return this.httpService.get(this.generatePath(path, params), { search: searchParams });
    };
    AdminAPIService.prototype.generatePath = function (path, params) {
        // console.log("generatePath, path : ", path);
        // console.log("generatePath, params : ", params);
        var completedPath = "";
        var segs = path.split("/");
        var paramIndex = 0;
        for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
            var seg = segs_1[_i];
            if (seg == "" || seg == null) {
                continue;
            }
            // console.log("generatePath, seg : ", seg);
            // console.log("generatePath, paramIndex : ", paramIndex);
            completedPath += "/";
            if (seg.charAt(0) == ":") {
                completedPath += params[paramIndex];
                paramIndex++;
            }
            else {
                completedPath += seg;
            }
        }
        //always add a "/" at the end
        completedPath += "/";
        // console.log("generatePath, completedPath : ", completedPath);
        // console.log("generatePath, BACKEND_BASE_URL : ", environment.BACKEND_BASE_URL);
        var finalUrl = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].BACKEND_BASE_URL + completedPath;
        console.log("generatePath, finalUrl : ", finalUrl);
        return finalUrl;
    };
    return AdminAPIService;
}());
AdminAPIService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], AdminAPIService);

var _a;
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/adminAPI.service.js.map

/***/ }),

/***/ 600:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\n.modal {\n  min-height: 50%; }\n\n.modal textarea {\n  min-height: 100px; }\n\n#complete_session_modal {\n  height: 500px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 601:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "button {\n  margin: 0; }\n\np {\n  margin: 0; }\n\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item > .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach {\n  cursor: pointer; }\n\n.meeting-item-coach.has-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 22px;\n  margin-left: 32px;\n  text-align: right; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 64px; }\n\n.meeting-item.closed .meeting-item-header,\n.meeting-item.closed .meeting-item-body {\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start; }\n\n.meeting-item-body-buttons {\n  padding: 16px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0; }\n\n.meeting-review {\n  width: 100%; }\n\n.meeting-item-buttons {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -ms-flex-line-pack: end;\n      align-content: flex-end;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    /*flex-direction: column;*/\n    /*justify-content: flex-start;*/\n    /*align-content: flex-start;*/\n    /*align-items: left;*/\n    padding-left: 0; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.btn-cancel {\n  margin: 8px 0;\n  margin-left: 8px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 602:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\n.ratebar {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.rate-star {\n  display: inline-block;\n  cursor: pointer; }\n\n.rate-star .star {\n  color: #e5e5e5;\n  font-size: 60px;\n  padding: 0 16px; }\n\n.rate-star.pre-selected .star {\n  color: #46b0ff;\n  opacity: .6; }\n\n.rate-star.selected .star,\n.rate-star.selected:hover .star {\n  color: #46b0ff;\n  opacity: 1; }\n\n#coachee_delete_meeting_modal {\n  height: 200px !important; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 603:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".add-meeting-btn {\n  background-color: #46b0ff;\n  margin-left: 16px; }\n\n.collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 604:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "p {\n  margin: 0; }\n\n.row {\n  margin: 0; }\n\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important;\n  cursor: pointer; }\n\n.meeting-item > .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-date-hour {\n  margin-left: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0px; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center; }\n\n.meeting-item-date {\n  font-size: 22px;\n  margin-left: 32px;\n  text-align: right; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 112px; }\n\n.meeting-item-body-buttons {\n  padding: 16px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0; }\n\n.meeting-review {\n  width: 100%; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    padding-left: 0; }\n  .meeting-item-buttons {\n    width: 100%;\n    text-align: right;\n    -ms-flex-line-pack: justify;\n        align-content: space-between;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between; } }\n\n@media only screen and (max-width: 1400px) and (min-width: 1000px) {\n  .usage-title {\n    display: none; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.meeting-list-date {\n  font-size: 20px;\n  font-weight: 500;\n  margin-right: 8px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 605:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".collection-item {\n  padding: 0 16px; }\n\n.no-meeting {\n  padding: 16px 0; }\n\n.card.collection {\n  overflow: visible; }\n\n.welcome-message {\n  line-height: 1.5; }\n\n#add_new_objective_modal {\n  height: 220px; }\n\n#add_potential_coachee_modal {\n  height: 350px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 606:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 607:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "p {\n  margin: 0; }\n\n.row {\n  margin: 0; }\n\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item > .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-date-hour {\n  margin-left: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0px; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  cursor: pointer; }\n\n.meeting-item-coach:hover,\n.meeting-item-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 22px;\n  margin-left: 32px;\n  text-align: right; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 112px; }\n\n.meeting-item-body-buttons {\n  padding: 16px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0; }\n\n.meeting-review {\n  width: 100%; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    padding-left: 0; }\n  .meeting-item-buttons {\n    width: 100%;\n    text-align: right;\n    -ms-flex-line-pack: justify;\n        align-content: space-between;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between; } }\n\n@media only screen and (max-width: 1400px) and (min-width: 1000px) {\n  .usage-title {\n    display: none; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.meeting-list-date {\n  font-size: 20px;\n  font-weight: 500;\n  margin-right: 8px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 608:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 609:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "p {\n  margin: 0; }\n\n.row {\n  margin: 0; }\n\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item > .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-date-hour {\n  margin-left: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0px; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  cursor: pointer; }\n\n.meeting-item-coach:hover,\n.meeting-item-coach:hover .meeting-item-coach-name {\n  color: #46b0ff !important; }\n\n.meeting-item-date {\n  font-size: 22px;\n  margin-left: 32px;\n  text-align: right; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 112px; }\n\n.meeting-item-body-buttons {\n  padding: 16px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0; }\n\n.meeting-review {\n  width: 100%; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    padding-left: 0; }\n  .meeting-item-buttons {\n    width: 100%;\n    text-align: right;\n    -ms-flex-line-pack: justify;\n        align-content: space-between;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between; } }\n\n@media only screen and (max-width: 1400px) and (min-width: 1000px) {\n  .usage-title {\n    display: none; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.meeting-list-date {\n  font-size: 20px;\n  font-weight: 500;\n  margin-right: 8px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 61:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
/**
 * Created by guillaume on 31/03/2017.
 */
/**
 * Created by guillaume on 31/03/2017.
 */ var environment = {
    production: true,
    BACKEND_BASE_URL: "https://eritis-be-dev.appspot.com/api",
    firebase_apiKey: "AIzaSyDGJt42caQMGiRJDg8z_0C_sWhy1NFlHJ0",
    firebase_authDomain: "eritis-be-dev.firebaseapp.com",
    firebase_databaseURL: "https://eritis-be-dev.firebaseio.com",
};
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/environment.js.map

/***/ }),

/***/ 610:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 611:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(67) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-item {\n  text-align: center; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 612:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, ".header-user {\n  background-image: url(" + __webpack_require__(67) + ");\n  background-attachment: scroll;\n  background-position: center;\n  background-size: cover;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); }\n\n.header-user-filter {\n  background-color: rgba(35, 88, 128, 0.6);\n  color: #ffffff; }\n\n.header-user .container {\n  padding: 64px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between; }\n\n.user {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -ms-flex-line-pack: center;\n      align-content: center; }\n\n.user-info {\n  margin-left: 16px; }\n\n.user-img {\n  height: 100px;\n  width: 100px; }\n\n.header-item {\n  text-align: center; }\n\n.header-item-number {\n  margin: 0;\n  font-size: 40px;\n  font-weight: 500; }\n\n.header-item-number .indice {\n  font-size: 18px;\n  font-weight: 400; }\n\n.header-item-title {\n  margin: 0;\n  color: #e5e5e5; }\n\n.gap {\n  height: 64px; }\n\n.message-field {\n  min-height: 200px; }\n\n.description-field {\n  min-height: 100px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 613:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 614:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "p {\n  margin: 0; }\n\n.row {\n  margin: 0; }\n\n.card-content, .card-reveal {\n  padding: 0; }\n\n.meeting-item {\n  margin: 0;\n  padding: 16px 0 !important; }\n\n.meeting-item > .row {\n  margin: 0; }\n\n.meeting-item-coach {\n  margin-top: 2px;\n  margin-bottom: 0; }\n\n.meeting-item-coach-avatar {\n  height: 52px;\n  width: 52px;\n  margin-right: 16px; }\n\n.meeting-item-date-hour {\n  margin-left: 16px; }\n\n.meeting-item-header,\n.meeting-item-body {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  padding: 0px; }\n\n.meeting-item-header {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 8px 0; }\n\n.meeting-item-header > div {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0px; }\n\n.meeting-item-coach {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  /*cursor: pointer;*/ }\n\n/*.meeting-item-coach:hover,*/\n/*.meeting-item-coach:hover .meeting-item-coach-name {*/\n/*color: var(--main-electric-blue) !important;*/\n/*}*/\n.meeting-item-date {\n  font-size: 22px;\n  margin-left: 32px;\n  text-align: right; }\n\n.meeting-item-body {\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding-left: 112px; }\n\n.meeting-item-body-buttons {\n  padding: 16px 0;\n  text-align: right; }\n\n.meeting-item-body-content {\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -ms-flex-line-pack: justify;\n      align-content: space-between;\n  padding: 24px 0; }\n\n.meeting-review {\n  width: 100%; }\n\n@media screen and (max-device-width: 1240px), (max-width: 992px) {\n  .meeting-item-body {\n    padding-left: 0; }\n  .meeting-item-buttons {\n    width: 100%;\n    text-align: right;\n    -ms-flex-line-pack: justify;\n        align-content: space-between;\n    -webkit-box-pack: justify;\n        -ms-flex-pack: justify;\n            justify-content: space-between; } }\n\n@media only screen and (max-width: 1400px) and (min-width: 1000px) {\n  .usage-title {\n    display: none; } }\n\n.preloader-wrapper {\n  left: 50%;\n  margin-left: -30px;\n  margin: 32px 0; }\n\n.meeting-list-date {\n  font-size: 20px;\n  font-weight: 500;\n  margin-right: 8px; }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 615:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)();
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\nnav {\n  background-color: transparent;\n  box-shadow: none;\n  padding: 16px; }\n\nnav li {\n  background-color: transparent !important; }\n\nnav li:hover a,\nnav li:focus a {\n  color: #3E3E3E !important;\n  -webkit-transition: .3s;\n  transition: .3s; }\n\n.bg-top-image {\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-size: cover;\n  background: url(" + __webpack_require__(67) + ") no-repeat center;\n  height: 1000px;\n  width: 100%;\n  max-width: 100%;\n  z-index: -10; }\n\n.bg-top-filter {\n  position: fixed;\n  top: 0;\n  left: 0;\n  background-color: rgba(35, 88, 128, 0.6);\n  height: 1000px;\n  width: 100%;\n  max-width: 100%;\n  z-index: -1; }\n\n.section {\n  background-color: #FFF;\n  padding: 0;\n  width: 100%; }\n\nheader.section {\n  padding: 0; }\n\nheader.section .container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  text-align: center;\n  color: #ffffff;\n  padding: 160px 0; }\n\n.header-title {\n  /*font-size: 66px*/\n  font-size: 8vmin;\n  /*Test taille adaptative relative à la taille minimale de l'écran*/\n  font-weight: 500;\n  letter-spacing: 1.1px;\n  margin: 0; }\n\n.header-subtitle {\n  /*font-size: 36px;*/\n  font-size: 4vmin;\n  font-weight: 300;\n  letter-spacing: 2.3px;\n  margin: 64px 0;\n  opacity: 0.6; }\n\n.header-btn .btn-basic {\n  min-width: 200px; }\n\n.header-arrow-bottom {\n  font-size: 66px;\n  color: #ffffff;\n  opacity: 0.6; }\n\n.header-arrow-bottom:hover {\n  opacity: 1; }\n\nrb-signin {\n  width: 30%; }\n\n@media (max-width: 960px) {\n  rb-signin {\n    width: 80%; } }\n\n.desc_icon {\n  width: 96px;\n  height: 96px; }\n\n.content {\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n\n.section_title {\n  /*font-size: 42px;*/\n  color: #000;\n  font-size: 5vmin;\n  font-weight: 600;\n  margin-bottom: 32px;\n  margin-top: 0; }\n\n#presentation {\n  background: #ffffff; }\n\n.presentation_item {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  padding: 0 2%;\n  margin-top: 64px; }\n\n.presentation_item_title {\n  font-size: 32px;\n  /*font-size: 4vmin;*/\n  height: 64px;\n  color: #1D1D1D; }\n\n.presentation_item_text {\n  font-size: 22px;\n  /*font-size: 3vmin;*/\n  color: #C7C7C7; }\n\n#coach_section {\n  display: inline-block;\n  background-image: -webkit-linear-gradient(bottom, #46b0ff, #0073cf);\n  background-image: linear-gradient(to top, #46b0ff, #0073cf);\n  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.5);\n  text-align: center;\n  color: #ffffff; }\n\n.coach_section_title {\n  color: #ffffff;\n  margin-bottom: 32px; }\n\n.coach_section_subtitle {\n  margin: 0; }\n\n.coach_description {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  text-align: center;\n  padding: 0 2%;\n  margin-top: 64px; }\n\n.coach_description h4 {\n  font-size: 32px;\n  /*font-size: 4vmin;*/\n  height: 72px; }\n\n.coach_description p {\n  font-size: 22px;\n  /*font-size: 2.5vmin;*/\n  font-weight: 300;\n  color: #e5e5e5; }\n\n.coach_img {\n  height: 173px;\n  width: 173px;\n  background-size: cover; }\n\n.small-line-container {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin-top: 64px; }\n\n.small-line {\n  height: 1px;\n  width: 180px;\n  border: solid 1px rgba(255, 255, 255, 0.67); }\n\nfooter {\n  background-color: #ffffff; }\n\ntextarea {\n  width: 100%;\n  min-height: 192px; }\n\n.address {\n  color: #000; }\n\n.address p {\n  font-size: 22px;\n  font-weight: 400; }\n\n.btn-submit {\n  border-color: #44AFFE;\n  background-color: #44AFFE; }\n\n.btn-submit:disabled {\n  border-color: #E8E8E8;\n  background-color: #E8E8E8; }\n\n.side-nav {\n  background-color: rgba(255, 255, 255, 0.9); }\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 626:
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n\n  <h4 class=\"text-right\" (click)=\"navigateAdminHome()\">Espace admin\n    <span class=\"text-right italic blue-text admin-name\" *ngIf=\"(admin | async)?.email != null\">{{ (admin | async)?.email }}</span>\n    <span class=\"text-right italic blue-text admin-name\" *ngIf=\"(admin | async)?.email == null\">non identifié</span>\n  </h4>\n  <p class=\"text-right\">\n    <span class=\"blue-text\">Cliquez</span> ici pour ajouter un utilisateur\n    <a class=\"btn-floating btn-large waves-effect waves-light add-meeting-btn\"\n       (click)=\"navigateToSignup()\">\n      <i class=\"material-icons\">add</i>\n    </a>\n  </p>\n\n\n  <!--<button class=\"btn cyan waves-effect waves-light\" (click)=\"navigateToSignup()\">Envoyer invitations</button>-->\n  <!--<button class=\"btn cyan waves-effect waves-light\" (click)=\"navigateToCoachsList()\">Nos coachs</button>-->\n  <!--<button class=\"btn cyan waves-effect waves-light\" (click)=\"navigateToCoacheesList()\">Nos coachés</button>-->\n  <!--<button class=\"btn cyan waves-effect waves-light\" (click)=\"navigateToRhsList()\">Nos rhs</button>-->\n\n  <router-outlet></router-outlet>\n\n</div>\n\n"

/***/ }),

/***/ 627:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">Liste des coachees</h4>\n\n  <div class=\"col-lg-12 card collection\">\n    <div *ngIf=\"(coachees | async) != null\">\n      <div class=\"collection-item\" *ngFor=\"let coachee of coachees | async\">\n        <rb-coachee-item [coachee]=\"coachee\"></rb-coachee-item>\n      </div>\n    </div>\n\n    <div class=\"text-center\" *ngIf=\"(coachees | async) == null\">\n      <h5 class=\"no-meeting\">Les coachees apparaîtront ici</h5>\n    </div>\n  </div>\n\n\n  <!--<div class=\"col-lg-12\" *ngFor=\"let coachee of coachees| async\">-->\n    <!--<div class=\"row coach_card\">-->\n      <!--<div class=\"col s12\" style=\"padding: 16px\">-->\n        <!--<span>{{ coachee.firstName}} {{ coachee.lastName}}</span>-->\n        <!--<img style=\"width: 30px;height: 30px\" src=\"{{coachee.avatar_url}}\" alt=\"\">-->\n      <!--</div>-->\n    <!--</div>-->\n  <!--</div>-->\n</div> <!--end row-->\n"

/***/ }),

/***/ 628:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">Liste des coachs</h4>\n\n  <div class=\"col-lg-12 card collection\">\n    <div *ngIf=\"(coachs | async) != null\">\n      <div class=\"collection-item\" *ngFor=\"let coach of coachs | async\">\n        <rb-coach-item [coach]=\"coach\"></rb-coach-item>\n      </div>\n    </div>\n\n    <div class=\"text-center\" *ngIf=\"(coachs | async) == null\">\n      <h5 class=\"no-meeting\">Les coachs apparaîtront ici</h5>\n    </div>\n  </div>\n</div> <!--end row-->\n\n\n<!--<h4 class=\"black-text\">Liste des coachs</h4>-->\n\n<!--<div class=\"row\">-->\n  <!--<rb-coach-item class=\"col-xs-12\" *ngFor=\"let coach of coachs | async\" [coach]=\"coach\"-->\n                 <!--(click)=\"onCoachSelected(coach)\" [class.selected]=\"coach == selectedCoach\"></rb-coach-item>-->\n<!--</div>-->\n"

/***/ }),

/***/ 629:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">Liste des RH</h4>\n\n  <div class=\"col-lg-12 card collection\">\n    <div *ngIf=\"(rhs | async) != null\">\n      <div class=\"collection-item\" *ngFor=\"let rh of rhs | async\">\n        <rb-rh-item [rh]=\"rh\"></rb-rh-item>\n      </div>\n    </div>\n\n    <div class=\"text-center\" *ngIf=\"(rhs | async) == null\">\n      <h5 class=\"no-meeting\">Les RH apparaîtront ici</h5>\n    </div>\n  </div>\n</div> <!--end row-->\n\n<!--<h4 class=\"black-text\">Liste des rhs</h4>-->\n\n<!--<div class=\"row\">-->\n  <!--<div class=\"col-xs-12\" *ngFor=\"let rh of rhs| async\">-->\n\n    <!--<div class=\"row coach_card\">-->\n\n      <!--<div class=\"col s12\" style=\"padding: 16px\">-->\n\n        <!--<span>{{rh.firstName}} {{rh.lastName}}</span>-->\n        <!--<img style=\"width: 30px;height: 30px\" src=\"{{rh.avatar_url}}\" alt=\"\">-->\n\n      <!--</div>-->\n\n    <!--</div>-->\n\n  <!--</div>-->\n\n<!--</div>-->\n"

/***/ }),

/***/ 630:
/***/ (function(module, exports) {

module.exports = "<rb-header></rb-header>\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ 631:
/***/ (function(module, exports) {

module.exports = "<div class=\"message-container\">\n  <div class=\"spacing\">\n    <div class=\"pic\" [ngStyle]=\"changeBackground()\"></div>\n  </div>\n  <div class=\"message\">{{message.text}}</div>\n  <div class=\"name\">{{message.name}}</div>\n</div>\n"

/***/ }),

/***/ 632:
/***/ (function(module, exports) {

module.exports = "<!doctype html>\n<!--\n  Copyright 2015 Google Inc. All rights reserved.\n  Licensed under the Apache License, Version 2.0 (the \"License\");\n  you may not use this file except in compliance with the License.\n  You may obtain a copy of the License at\n      https://www.apache.org/licenses/LICENSE-2.0\n  Unless required by applicable law or agreed to in writing, software\n  distributed under the License is distributed on an \"AS IS\" BASIS,\n  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n  See the License for the specific language governing permissions and\n  limitations under the License\n-->\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"description\" content=\"Learn how to use the Firebase platform on the Web\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Friendly Chat</title>\n\n  <!-- Disable tap highlight on IE -->\n  <meta name=\"msapplication-tap-highlight\" content=\"no\">\n\n  <!-- Web Application Manifest -->\n  <link rel=\"manifest\" href=\"manifest.json\">\n\n  <!-- Add to homescreen for Chrome on Android -->\n  <meta name=\"mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"application-name\" content=\"Friendly Chat\">\n  <meta name=\"theme-color\" content=\"#303F9F\">\n\n  <!-- Add to homescreen for Safari on iOS -->\n  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">\n  <meta name=\"apple-mobile-web-app-title\" content=\"Friendly Chat\">\n  <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"#303F9F\">\n\n  <!-- Tile icon for Win8 -->\n  <meta name=\"msapplication-TileColor\" content=\"#3372DF\">\n  <meta name=\"msapplication-navbutton-color\" content=\"#303F9F\">\n\n  <!-- Material Design Lite -->\n  <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\">\n  <link rel=\"stylesheet\" href=\"https://code.getmdl.io/1.1.3/material.orange-indigo.min.css\">\n  <script defer src=\"https://code.getmdl.io/1.1.3/material.min.js\"></script>\n\n  <!-- App Styling -->\n  <link rel=\"stylesheet\"\n        href=\"https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en\">\n  <!--<link rel=\"stylesheet\" href=\"styles/main.css\">-->\n</head>\n<body>\n\n<div class=\"demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header\">\n\n  <!-- Header section containing logo -->\n  <header class=\"mdl-layout__header mdl-color-text--white mdl-color--light-blue-700\">\n    <div class=\"mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid\">\n      <div class=\"mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop\">\n        <h3><i class=\"material-icons\">chat_bubble_outline</i> Friendly Chat</h3>\n      </div>\n      <div id=\"user-container\">\n        <div id=\"user-pic\" *ngIf=\"userAuth\" [ngStyle]=\"changeBackground()\">user pic</div>\n        <div id=\"user-name\" *ngIf=\"userAuth\"></div>\n\n        <button id=\"sign-out\" *ngIf=\"userAuth\"\n                class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white\">\n          Sign-out\n        </button>\n        <button id=\"sign-in\" *ngIf=\"!userAuth\"\n                class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white\">\n          <i class=\"material-icons\">account_circle</i>Sign-in with Google\n        </button>\n\n      </div>\n    </div>\n  </header>\n\n  <main class=\"mdl-layout__content mdl-color--grey-100\">\n    <div id=\"messages-card-container\" class=\"mdl-cell mdl-cell--12-col mdl-grid\">\n\n      <!-- Messages container -->\n      <div id=\"messages-card\"\n           class=\"mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop\">\n        <div class=\"mdl-card__supporting-text mdl-color-text--grey-600\">\n          <div id=\"messages\">\n            <span id=\"message-filler\"></span>\n\n            <h1> ici ici </h1>\n\n            <ul class=\"list-group\">\n              <rb-chat-item class=\"list-group-item\" *ngFor=\"let msg of messages\" [message]=\"msg\"></rb-chat-item>\n            </ul>\n\n\n          </div>\n          <form id=\"message-form\" action=\"#\">\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n              <input class=\"mdl-textfield__input\" type=\"text\" id=\"message\" #msg_input>\n              <label class=\"mdl-textfield__label\" for=\"message\">Message...</label>\n            </div>\n            <!--<button id=\"submit\" disabled type=\"submit\"-->\n                    <!--class=\"mdl-button mdl-js-button mdl-button&#45;&#45;raised mdl-js-ripple-effect\"  (click)=\"saveMessage()\">-->\n              <!--Send-->\n            <!--</button>-->\n\n            <button id=\"submit\" type=\"submit\"\n                    class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect\"  (click)=\"saveMessage(msg_input.value)\">\n              Send\n            </button>\n          </form>\n          <form id=\"image-form\" action=\"#\">\n            <input id=\"mediaCapture\" type=\"file\" accept=\"image/*,capture=camera\">\n            <button id=\"submitImage\" title=\"Add an image\"\n                    class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white\">\n              <i class=\"material-icons\">image</i>\n            </button>\n          </form>\n        </div>\n      </div>\n\n      <div id=\"must-signin-snackbar\" class=\"mdl-js-snackbar mdl-snackbar\">\n        <div class=\"mdl-snackbar__text\"></div>\n        <button class=\"mdl-snackbar__action\" type=\"button\"></button>\n      </div>\n\n    </div>\n  </main>\n</div>\n\n\n</body>\n</html>\n"

/***/ }),

/***/ 633:
/***/ (function(module, exports) {

module.exports = "<header id=\"header\" class=\"page-topbar\"\n        [class.user-connected]=\"(isAuthenticated | async) || (isAdminMode | async )\"\n        [hidden]=\"isSigningUp()\">\n  <div class=\"navbar\" [class.navbar-fixed]=\"(isAuthenticated | async) || (isAdminMode | async )\" [class.z-depth-2]=\"!(isAuthenticated | async) && !(isAdminMode | async )\">\n    <nav>\n      <div class=\"navbar-color\" [class.z-depth-2]=\"(isAuthenticated | async) || (isAdminMode | async )\">\n        <div class=\"col s12\">\n\n          <a (click)=\"goToHome()\" class=\"brand-logo left hide-on-med-and-down\"\n             *ngIf=\"(isAuthenticated | async) || (isAdminMode | async )\"><img src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\"></a>\n          <a (click)=\"goToHome()\" class=\"brand-logo center hide-on-med-and-down\" *ngIf=\"!(isAuthenticated | async) && !(isAdminMode | async )\"><img\n            src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\"></a>\n          <a (click)=\"goToHome()\" class=\"brand-logo center hide-on-large-only\"><img\n            src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\"></a>\n\n          <a data-activates=\"side-nav\" class=\"button-collapse left\" [hidden]=\"!(isAuthenticated | async)\">\n            <i class=\"mdi-navigation-menu\"></i>\n          </a>\n\n          <ul class=\"right hide-on-med-and-down\">\n            <!--<li *ngIf=\"canDisplayListOfCoach()\"><a (click)=\"goToCoachs()\">Liste Des Coachs</a></li>-->\n\n            <div *ngIf=\"!(isAdminMode | async )\">\n              <li *ngIf=\"(isAuthenticated | async) && isUserACoach()\"\n                  [class.active]=\"router.url === '/available_meetings'\"><a (click)=\"goToAvailableSessions()\">\n                Demandes en attente</a></li>\n\n              <li *ngIf=\"(isAuthenticated | async)\" [class.active]=\"router.url === '/meetings'\"><a\n                (click)=\"goToMeetings()\">\n                Tableau de bord</a></li>\n\n              <!--<li *ngIf=\"(isAuthenticated | async) && isUserACoach()\"><a (click)=\"goToProfile()\">Profil</a></li>-->\n\n              <li [hidden]=\"!(isAuthenticated | async)\">\n                <a class=\"dropdown-button-notifs\" data-activates=\"notifs\"><i class=\"material-icons\">notifications</i></a>\n                <div class=\"notif-count\" *ngIf=\"(notifications | async) != null || (notifications | async)?.length > 0\">\n                  {{(notifications | async).length}}\n                </div>\n              </li>\n\n              <!--<li *ngIf=\"(isAuthenticated | async)\"><a (click)=\"onLogout()\">Déconnexion</a></li>-->\n\n              <li [hidden]=\"!(isAuthenticated | async)\"\n                  [class.active]=\"router.url === '/profile_coach' || router.url === '/profile_coachee' || router.url === '/profile_rh'\">\n                <a class=\"dropdown-button-profile\" data-activates=\"profil\">\n                  <img src=\"{{(user | async)?.avatar_url}}\" alt=\"profile image\"\n                       class=\"item-user-img circle responsive-img\">\n                  {{ (user | async)?.firstName}} {{ (user | async)?.lastName}}\n                </a>\n              </li>\n            </div>\n\n            <div *ngIf=\"(isAdminMode | async )\">\n              <li [class.active]=\"router.url === '/admin/coachs-list'\">\n                <a (click)=\"navigateToCoachsList()\">Nos Coachs</a></li>\n              <li [class.active]=\"router.url === '/admin/coachees-list'\">\n                <a (click)=\"navigateToCoacheesList()\">Nos Coachees</a></li>\n              <li [class.active]=\"router.url === '/admin/rhs-list'\">\n                <a (click)=\"navigateToRhsList()\">Nos Rhs</a></li>\n            </div>\n\n          </ul>\n\n\n          <!-- Side Nav -->\n          <ul class=\"side-nav\" id=\"side-nav\">\n\n            <div class=\"side-nav-header\" *ngIf=\"(isAuthenticated | async)\">\n              <div class=\"side-nav-header-container  z-depth-1\">\n                <div *ngIf=\"!(isAdminMode | async )\">\n                  <img src=\"{{(user | async)?.avatar_url}}\" alt=\"profile image\"\n                       class=\"side-nav-user-img circle responsive-img z-depth-2\">\n                  <div class=\"side-nav-user-info\">\n                    <h5>{{ (user | async)?.firstName}} {{ (user | async)?.lastName}}</h5>\n                    <span>{{(user | async)?.email}}</span>\n                  </div>\n                </div>\n\n                <div *ngIf=\"(isAdminMode | async )\">\n                  <h4>Admin</h4>\n                </div>\n              </div>\n            </div>\n\n            <!--<li *ngIf=\"canDisplayListOfCoach()\"><a (click)=\"goToCoachs()\">Liste Des Coachs</a></li>-->\n\n            <!--<li *ngIf=\"(isAuthenticated | async)\"><a (click)=\"goToMeetings()\">Vos meetings</a></li>-->\n            <div class=\"side-nav-items\" *ngIf=\"!(isAdminMode | async )\">\n              <li *ngIf=\"(isAuthenticated | async) && isUserACoach()\"\n                  [class.active]=\"router.url === '/available_meetings'\"><a (click)=\"goToAvailableSessions()\">Séances\n                disponibles</a></li>\n\n              <li *ngIf=\"(isAuthenticated | async)\" [class.active]=\"router.url === '/meetings'\"><a\n                (click)=\"goToMeetings()\">Tableau de bord</a></li>\n\n              <!--<li [hidden]=\"!(isAuthenticated | async)\">-->\n              <!--<a class=\"dropdown-button\" data-activates=\"notifs\"><i class=\"material-icons\">notifications</i></a>-->\n              <!--<div class=\"notif-count\">0</div>-->\n              <!--</li>-->\n\n              <li *ngIf=\"(isAuthenticated | async) && (isUserACoach() || isUserACoachee())\"\n                  [class.active]=\"router.url === '/profile_coach' || router.url === '/profile_coachee' || router.url === '/profile_rh'\">\n                <a (click)=\"goToProfile()\">Modifier mon profil</a></li>\n\n              <li *ngIf=\"(isAuthenticated | async)\"><a (click)=\"onLogout()\">Déconnexion</a></li>\n            </div>\n\n            <div class=\"side-nav-items\" *ngIf=\"(isAdminMode | async )\">\n              <li [class.active]=\"router.url === '/admin/coachs-list'\">\n                <a (click)=\"navigateToCoachsList()\">Nos Coachs</a></li>\n              <li [class.active]=\"router.url === '/admin/coachees-list'\">\n                <a (click)=\"navigateToCoacheesList()\">Nos Coachees</a></li>\n              <li [class.active]=\"router.url === '/admin/rhs-list'\">\n                <a (click)=\"navigateToRhsList()\">Nos Rhs</a></li>\n            </div>\n\n          </ul>\n\n        </div>\n      </div>\n    </nav>\n\n\n    <div class=\"welcome-header\" *ngIf=\"!(isAuthenticated | async)  && !(isAdminMode | async )\">\n      <div class=\"container\">\n        <h1 class=\"header-title\">Atteignez vos objectifs</h1>\n        <h3 class=\"header-subtitle ultra-light-grey-text\">Séances de coaching individuel avec un coach certifié</h3>\n\n        <div class=\"row hide-on-small-and-down\">\n          <div class=\"header-btn col-xs-12 col-sm-6\">\n            <a pageScroll href=\"#coach_section\" class=\"btn-basic right\">En savoir plus</a>\n          </div>\n          <div class=\"header-btn col-xs-12 col-sm-6\">\n            <button class=\"btn-basic btn-plain btn-connexion left\" (click)=\"activateLogin()\"><i class=\"material-icons\">perm_identity</i>\n              Connexion\n            </button>\n          </div>\n        </div>\n\n        <div class=\"row hide-on-med-and-up\">\n          <div class=\"header-btn col-xs-12 col-sm-6\">\n            <a pageScroll href=\"#coach_section\" class=\"btn-basic\">En savoir plus</a>\n          </div>\n          <div class=\"header-btn col-xs-12 col-sm-6\">\n            <button class=\"btn-basic btn-plain btn-connexion\" (click)=\"activateLogin()\"><i class=\"material-icons\">perm_identity</i>\n              Connexion\n            </button>\n          </div>\n        </div>\n\n        <rb-signin [hidden]=\"!loginActivated\"></rb-signin>\n\n        <a pageScroll href=\"#presentation\" class=\"header-arrow-bottom\"><i class=\"fa fa-angle-down\"\n                                                                          aria-hidden=\"true\"></i></a>\n      </div>\n    </div>\n\n\n  </div><!--end navbar-fixed-->\n\n  <!--<div class=\"header-user\" *ngIf=\"(isAuthenticated | async)\">-->\n  <!--<div class=\"container header-user-filter\">-->\n  <!--<img src=\"{{(user | async)?.avatar_url}}\" alt=\"profile image\" class=\"header-user-img circle responsive-img\">-->\n  <!--<div class=\"header-user-info\">-->\n  <!--<h5>{{(user | async)?.display_name}}</h5>-->\n  <!--<h6>{{(user | async)?.email}}</h6>-->\n  <!--</div>-->\n  <!--</div>-->\n  <!--</div>-->\n\n</header>\n\n<ul id=\"notifs\" class=\"dropdown-content dropdown-notifs collection\">\n  <li class=\"notif-item collection-item\" *ngIf=\"(notifications | async) == null\">Vous n'avez pas de notification</li>\n  <div *ngIf=\"(notifications | async) != null\">\n    <li class=\"notif-item collection-item notif-delete\"><a (click)=\"readAllNotifications()\">Marquer comme lues</a></li>\n    <li class=\"notif-item collection-item\" *ngFor=\"let notif of (notifications | async)\">\n      <p class=\"notif-date\">{{printDateString(notif.date)}}</p>\n      <p class=\"notif-messsage\">{{notif.message}}</p>\n    </li>\n  </div>\n</ul>\n\n<ul id=\"profil\" class=\"dropdown-content dropdown-profil collection\">\n  <li class=\"profil-item collection-item text-right\" (click)=\"goToProfile()\" *ngIf=\"isUserACoach() || isUserACoachee()\">\n    Modifier mon profil\n  </li>\n  <li class=\"profil-item collection-item text-right\" (click)=\"onLogout()\">Déconnexion</li>\n</ul>\n"

/***/ }),

/***/ 634:
/***/ (function(module, exports) {

module.exports = "<div id=\"main_container\">\n  <div class=\"section\">\n    <form [formGroup]=\"signInForm\" (ngSubmit)=\"onSignIn()\" class=\"center\">\n      <div class=\"text-left\">\n        <label for=\"email\">Email</label>\n        <input type=\"email\" id=\"email\" name=\"email\" formControlName=\"email\"/>\n        <small\n          *ngIf=\"!signInForm.controls['email'].pristine &&!signInForm.controls['email'].valid\"\n          class=\"text-danger\">\n          Email is required and format should be <i>john@doe.com</i>.\n        </small>\n      </div>\n\n      <div class=\"text-left\">\n        <label for=\"password\">Mot de passe</label>\n        <input type=\"password\" id=\"password\" name=\"password\" formControlName=\"password\">\n        <small class=\"text-danger\"\n               *ngIf=\"!signInForm.controls['password'].pristine && !signInForm.controls['password'].valid\">\n          Password must be at least 6 characters.\n        </small>\n      </div>\n\n      <div class=\"text-center\">\n        <button type=\"submit\" name=\"action\" [disabled]=\"!signInForm.valid\" *ngIf=\"!loginLoading\">Go</button>\n        <div class=\"preloader-wrapper active\" *ngIf=\"loginLoading\">\n          <div class=\"spinner-layer spinner-white\">\n            <div class=\"circle-clipper left\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"gap-patch\">\n              <div class=\"circle\"></div>\n            </div>\n            <div class=\"circle-clipper right\">\n              <div class=\"circle\"></div>\n            </div>\n          </div>\n        </div>\n\n      </div>\n\n      <!-- sign up error div-->\n      <div *ngIf=\"error && errorMessage != ''\">\n        <!-- add extra separator-->\n        <hr>\n        <small class=\"text-danger\">\n          {{errorMessage}}\n        </small>\n      </div>\n\n    </form>\n  </div><!--end section-->\n\n  <!--<button class=\"btn btn-success\" (click)=\"goToSignUp()\">First time ?</button>-->\n\n</div>\n"

/***/ }),

/***/ 635:
/***/ (function(module, exports) {

module.exports = "<h4 class=\"black-text\">Envoyer une invitation</h4>\n<div class=\"row\">\n  <form class=\"col s12\" [formGroup]=\"signUpForm\" (ngSubmit)=\"onSignUpSubmitted()\">\n    <div class=\"row\">\n      <div class=\"col s12\">\n        <label for=\"email\">Email</label>\n        <input id=\"email\" type=\"email\" formControlName=\"email\" placeholder=\"exemple@mail.com\">\n        <small\n          *ngIf=\"!signUpForm.controls['email'].pristine &&!signUpForm.controls['email'].valid\"\n          class=\"text-danger\">\n          Email is required and format should be <i>john@doe.com</i>.\n        </small>\n      </div>\n    </div>\n\n    <div>\n      <label for=\"signup_type_selector\">Type</label>\n      <select [(ngModel)]=\"signUpSelectedType\"\n              [ngModelOptions]=\"{standalone: true}\"\n              name=\"signup_type_selector\"\n              id=\"signup_type_selector\"\n              class=\"browser-default\">\n        <option value=\"{{signUpSelectedType}}\" disabled selected>Sélectionnez un Type</option>\n        <option *ngFor=\"let type of signUpTypes\" [ngValue]=\"type\">\n          {{ getSignUpTypeName(type) }}\n        </option>\n      </select>\n    </div>\n\n    <div *ngIf=\"signUpSelectedType == 1\">\n      <h4>Choisir un plan pour ce coaché</h4>\n      <div *ngFor=\"let plan of plans | async\" (click)=\"onSelectPlan(plan)\"\n           [class.contract_selected]=\"plan == mSelectedPlan\">\n        Plan id : {{plan.plan_id}}\n        Plan Name : {{plan.plan_name}}\n        Plan Sessions count : {{plan.sessions_count}}\n      </div>\n    </div>\n\n    <br>\n\n    <div class=\"row\">\n      <div class=\"input-field col s12\">\n        <button class=\"btn-basic btn-blue btn-small right\" type=\"submit\" name=\"action\"\n                [disabled]=\"!signUpForm.valid  || signUpSelectedType==null || (signUpSelectedType == 1 && !mSelectedPlan)\">\n          Valider\n        </button>\n\n      </div>\n    </div>\n\n    <!-- sign up error div-->\n    <div *ngIf=\"error && errorMessage != ''\">\n      <!-- add extra separator-->\n      <hr>\n      <small class=\"text-danger\">\n        {{errorMessage}}\n      </small>\n    </div>\n\n  </form>\n</div>\n\n<div class=\"row\">\n  <div class=\"card-panel col s12\">\n    <h4 class=\"black-text\">Conseils</h4>\n    <p>Un email sera envoyé à l'adresse mail entrée, assurez-vous de posséder cet email</p>\n    <br>\n\n    <h5>Email possibles</h5>\n    <div class=\"row\">\n      <div class=\"col-lg-4\">\n        <p>coach.1.eritis@gmail.com</p>\n        <p>pwd : passwordEritis</p>\n      </div>\n\n      <div class=\"col-lg-4\">\n        <p>coachee.1.eritis@gmail.com</p>\n        <p>pwd : passwordEritis</p>\n      </div>\n\n      <div class=\"col-lg-4\">\n        <p>rh.1.eritis@gmail.com</p>\n        <p>pwd : passwordEritis</p>\n      </div>\n    </div>\n\n  </div><!--end card-panel-->\n</div><!--end row-->\n"

/***/ }),

/***/ 636:
/***/ (function(module, exports) {

module.exports = "<div class=\"section\">\n  <div class=\"row\">\n    <div class=\"col s12 m12 l6\">\n      <div class=\"card-panel\">\n        <h4>Bienvenue chez Eritis</h4>\n        <div class=\"row\">\n          <form class=\"col s12\" [formGroup]=\"signUpForm\" (ngSubmit)=\"onSignUpSubmitted()\">\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <p>Votre email {{ (potentialCoachObs | async)?.email }}</p>\n              </div>\n            </div>\n\n            <p>Choississez un mot de passe pour finaliser votre inscription.</p>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <input id=\"password\" type=\"password\" formControlName=\"password\">\n                <label for=\"password\">Password</label>\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['password'].pristine && !signUpForm.controls['password'].valid\">\n                  Password must be at least 6 characters.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <input id=\"confirm_password\" type=\"password\" formControlName=\"confirmPassword\">\n                <label for=\"confirm_password\">Confirm Password</label>\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['confirmPassword'].pristine && signUpForm.controls['confirmPassword'].errors && signUpForm.controls['confirmPassword'].errors['passwordNoMatch']\">\n                  Confirm Password is incorrect\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <button class=\"btn-basic btn-blue right\" type=\"submit\" name=\"action\"\n                        [disabled]=\"!signUpForm.valid\">Valider\n                </button>\n              </div>\n            </div>\n\n\n            <!-- sign up error div-->\n\n            <div *ngIf=\"error && errorMessage != ''\">\n\n              <!-- add extra separator-->\n              <hr>\n\n              <small class=\"text-danger\">\n                {{errorMessage}}\n              </small>\n            </div>\n\n          </form>\n        </div>\n      </div><!--end card panel-->\n    </div>\n  </div><!--end row-->\n</div><!--end section-->\n"

/***/ }),

/***/ 637:
/***/ (function(module, exports) {

module.exports = "<div class=\"section\">\n  <div class=\"row\">\n    <div class=\"col s12 m12 l6\">\n      <div class=\"card-panel\">\n        <h4>Bonjour, vous bénéficiez de <span\n          class=\"blue-text\">{{ (potentialCoacheeObs | async)?.plan.sessions_count }}</span> séances !</h4>\n        <div class=\"row\">\n          <form class=\"col s12\" [formGroup]=\"signUpForm\" (ngSubmit)=\"onSignUpSubmitted()\">\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <p>Votre email {{ (potentialCoacheeObs | async)?.email }}</p>\n              </div>\n            </div>\n\n            <p>Choississez un mot de passe pour finaliser votre inscription.</p>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <input id=\"password\" type=\"password\" formControlName=\"password\">\n                <label for=\"password\">Password</label>\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['password'].pristine && !signUpForm.controls['password'].valid\">\n                  Password must be at least 6 characters.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <input id=\"confirm_password\" type=\"password\" formControlName=\"confirmPassword\">\n                <label for=\"confirm_password\">Confirm Password</label>\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['confirmPassword'].pristine && signUpForm.controls['confirmPassword'].errors && signUpForm.controls['confirmPassword'].errors['passwordNoMatch']\">\n                  Confirm Password is incorrect\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <button class=\"btn-basic btn-blue right\" type=\"submit\" name=\"action\"\n                        [disabled]=\"!signUpForm.valid\">Valider\n                </button>\n              </div>\n            </div>\n\n\n            <!-- sign up error div-->\n\n            <div *ngIf=\"error && errorMessage != ''\">\n\n              <!-- add extra separator-->\n              <hr>\n\n              <small class=\"text-danger\">\n                {{errorMessage}}\n              </small>\n            </div>\n\n          </form>\n        </div>\n      </div><!--end card panel-->\n    </div>\n  </div><!--end row-->\n</div><!--end section-->\n"

/***/ }),

/***/ 638:
/***/ (function(module, exports) {

module.exports = "<div class=\"section\">\n  <div class=\"row\">\n    <div class=\"col s12 m12 l6\">\n      <div class=\"card-panel\">\n        <h4>Bienvenue chez Eritis</h4>\n        <div class=\"row\">\n          <form class=\"col s12\" [formGroup]=\"signUpForm\" (ngSubmit)=\"onSignUpSubmitted()\">\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <p>Votre email {{ (potentialRhObs | async)?.email }}</p>\n              </div>\n            </div>\n\n            <p>Choississez un mot de passe pour finaliser votre inscription.</p>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <input id=\"password\" type=\"password\" formControlName=\"password\">\n                <label for=\"password\">Password</label>\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['password'].pristine && !signUpForm.controls['password'].valid\">\n                  Password must be at least 6 characters.\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <input id=\"confirm_password\" type=\"password\" formControlName=\"confirmPassword\">\n                <label for=\"confirm_password\">Confirm Password</label>\n                <small class=\"text-danger\"\n                       *ngIf=\"!signUpForm.controls['confirmPassword'].pristine && signUpForm.controls['confirmPassword'].errors && signUpForm.controls['confirmPassword'].errors['passwordNoMatch']\">\n                  Confirm Password is incorrect\n                </small>\n              </div>\n            </div>\n\n            <div class=\"row\">\n              <div class=\"input-field col s12\">\n                <button class=\"btn-basic btn-blue right\" type=\"submit\" name=\"action\"\n                        [disabled]=\"!signUpForm.valid\">Valider\n                </button>\n              </div>\n            </div>\n\n\n            <!-- sign up error div-->\n\n            <div *ngIf=\"error && errorMessage != ''\">\n\n              <!-- add extra separator-->\n              <hr>\n\n              <small class=\"text-danger\">\n                {{errorMessage}}\n              </small>\n            </div>\n\n          </form>\n        </div>\n      </div><!--end card panel-->\n    </div>\n  </div><!--end row-->\n</div><!--end section-->\n"

/***/ }),

/***/ 639:
/***/ (function(module, exports) {

module.exports = "<!--<rb-header></rb-header>-->\n<div class=\"container\">\n\n  <er-pre-meeting [meetingId]=\"meetingId\" (meetingGoal)=\"onGoalValueUpdated($event)\" (meetingContext)=\"onContextValueUpdated($event)\"></er-pre-meeting>\n\n  <h4 class=\"header-date-picker\">Indiquez vos disponiblités grâce au calendrier ci-dessous.\n  <br>Cliquez sur terminé lorsque vous avez validé toutes vos plages disponibles.</h4>\n\n  <!--<div class=\"section\" *ngIf=\"(connectedUser | async)?.status == 2\">-->\n\n  <!--Input Date Picker-->\n  <div id=\"input-date-picker\">\n    <div class=\"row text-center\">\n      <div class=\"col-sm-12 col-lg-5\">\n        <!--<input type=\"date\" class=\"datepicker\" placeholder=\"Cliquez ici\">-->\n        <div id=\"datepicker-container\" class=\"z-depth-2\">\n          <ngb-datepicker #dp [(ngModel)]=\"dateModel\"\n                          (navigate)=\"date = $event.next\"\n                          navigation=\"arrows\"\n                          minDate=\"{{ dateModel }}\"\n                          [dayTemplate]=\"customDay\"\n                          [markDisabled]=\"isDisabled\"\n                          [disabled]=\"isEditingPotentialDate\">\n          </ngb-datepicker>\n\n          <template #customDay let-date=\"date\" let-currentMonth=\"currentMonth\" let-selected=\"selected\" let-disabled=\"disabled\">\n            <span class=\"custom-day\"\n                  [class.has-potential-date]=\"hasPotentialDate(date)\"\n                  [class.bg-primary]=\"selected\"\n                  [class.hidden]=\"disabled\"\n                  [class.text-muted]=\"disabled\">\n              {{ date.day }}\n            </span>\n          </template>\n\n          <div id=\"potential-dates\" class=\"text-left\" *ngIf=\"dateModel && hasPotentialDate(dateModel)\">\n            <p>Disponibilités ajoutées</p>\n            <!-- list of potential dates -->\n            <div class=\"potential-date\" *ngFor=\"let date of potentialDates | async\">\n              <div class=\"potential-date-content\" *ngIf=\"compareDates(stringToDate(date.start_date), dateModel)\">\n                <div class=\"blue-point\"></div>\n                <p class=\"potential-date-timeslot\">{{ printTimeString(date.start_date) }} - {{ printTimeString(date.end_date) }}</p>\n                <a class=\"modify-timeslot\"\n                   (click)=\"modifyPotentialDate(date.id)\"><i\n                   class=\"material-icons\">create</i></a>\n                <a class=\"delete-timeslot\"\n                   (click)=\"unbookAdate(date.id)\"><i\n                   class=\"material-icons\">delete_sweep</i></a>\n              </div><!--end ngIf-->\n            </div><!--end potential-date-->\n          </div><!--end potential-dates-->\n        </div><!--end datepicker-container-->\n\n        <p>Vous pouvez modifier les plages validées ci-dessus</p>\n      </div>\n\n      <div class=\"col-sm-12 col-lg-7\">\n        <!--<ngb-timepicker #tp [(ngModel)]=\"timeModel\" [minuteStep]=\"15\"></ngb-timepicker>-->\n        <div>\n          <h5 *ngIf=\"dateModel\">{{ dateToString(dateModel) }}</h5>\n          <h2 class=\"plage-horaire\">{{ printTimeNumber(timeRange[0]) }} - {{ printTimeNumber(timeRange[1]) }}</h2>\n        </div>\n\n        <p-slider [(ngModel)]=\"timeRange\" [style]=\"{'width':'200px'}\" [range]=\"true\" [min]=\"8\" [max]=\"20\" ></p-slider>\n\n        <p>Faites glisser pour sélectionner votre plage disponible, puis validez</p>\n\n        <div class=\"row\">\n          <div class=\"col-lg-12\">\n            <button class=\"btn-basic btn-plain btn-blue btn-small\"\n                    (click)=\"bookOrUpdateADate()\" [disabled]=\"dateModel==null\"\n                    *ngIf=\"!isEditingPotentialDate\">Ajouter</button>\n            <button class=\"btn-basic btn-plain btn-blue btn-small\"\n                    (click)=\"bookOrUpdateADate()\"\n                    [disabled]=\"dateModel==null\"\n                    *ngIf=\"isEditingPotentialDate\">Modifier</button>\n          </div>\n          <div class=\"col-lg-12\" *ngIf=\"isEditingPotentialDate\">\n            <br>\n            <button class=\"btn-basic btn-blue btn-small\"\n                    (click)=\"resetValues()\"\n                    [disabled]=\"dateModel==null\">Annuler</button>\n          </div>\n        </div>\n      </div>\n    </div><!--end row-->\n  </div><!--end input-datepicker-->\n\n  <div class=\"row\">\n    <div class=\"col-lg-12 text-center\">\n      <button class=\"btn-basic btn-blue btn-small\" (click)=\"finish()\" [disabled]=\"!canFinish()\" *ngIf=\"!isEditingPotentialDate\">Terminer</button>\n    </div>\n  </div>\n\n</div>\n\n<!--<div id=\"card-alert_seance_book\" class=\"card red\" *ngIf=\"displayErrorBookingDate\">-->\n  <!--<div class=\"card-content white-text\">-->\n    <!--<p>Impossible de réserver votre séance</p>-->\n  <!--</div>-->\n<!--</div>-->\n"

/***/ }),

/***/ 640:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col s12\">\n\n      <div class=\"row\">\n        <h4 class=\"col-lg-12 black-text\">Demandes disponibles</h4>\n        <div class=\"card collection col-lg-12\">\n\n          <div *ngIf=\"hasAvailableMeetings\">\n            <div class=\"collection-item\" *ngFor=\"let meeting of availableMeetings | async\">\n              <rb-meeting-item-coach [meeting]=\"meeting\"\n                                     (onValidateDateBtnClick)=\"openCoachValidateMeetingModal($event)\">\n              </rb-meeting-item-coach>\n            </div>\n          </div>\n\n          <div *ngIf=\"!hasAvailableMeetings\" class=\"collection-item text-center\">\n            <h5 class=\"no-meeting\">Les demandes disponibles apparaîtront ici</h5>\n          </div>\n\n          <!--<button (click)=\"onSelectMeetingBtnClicked(meeting)\">Select</button>-->\n\n        </div><!--end card-->\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- Modal Coach Validate Meeting -->\n<div id=\"coach_cancel_meeting\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"daction-modal-message\">\n      <h5 class=\"black-text center\">Vous ne pourrez pas annuler ce meeting, êtes-vous sûr de vouloir valider ce créneau ?</h5>\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelCoachValidateMeeting()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-small\" (click)=\"onSubmitValidateMeeting()\">Valider</button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 641:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\" [class.closed]=\"!meeting.isOpen\" [class.unbooked]=\"!meeting.agreed_date\">\n  <!--<span class=\"card-title\">Vous avez choisi {{ coach.display_name }} pour être votre coach.</span>-->\n\n  <div class=\"preloader-wrapper active\" *ngIf=\"loading\">\n    <div class=\"spinner-layer spinner-blue-only\">\n      <div class=\"circle-clipper left\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"gap-patch\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"circle-clipper right\">\n        <div class=\"circle\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\" *ngIf=\"!loading\">\n\n    <!-- COACHEE -->\n    <div class=\"meeting-item-header col-md-12 col-lg-5\">\n      <div>\n        <!--<div class=\"meeting-item-coach\">-->\n        <!--<div>-->\n        <!--&lt;!&ndash; image coach&ndash;&gt;-->\n        <!--<img *ngIf=\"meeting.coachee\" class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coachee\"-->\n        <!--[src]=\"meeting.coachee.avatar_url\">-->\n        <!--<img *ngIf=\"!meeting.coachee\" class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coachee\"-->\n        <!--src=\"https://s-media-cache-ak0.pinimg.com/originals/af/25/49/af25490494d3338afef00869c59fdd37.png\">-->\n        <!--</div>-->\n\n        <!--<div>-->\n        <!--<p class=\"meeting-item-coach-name black-text bold\" *ngIf=\"meeting.coachee\">{{ meeting.coachee.display_name }}</p>-->\n        <!--<p class=\"italic\">Company name</p>-->\n        <!--</div>-->\n        <!--</div>&lt;!&ndash;end meeting-item-coach&ndash;&gt;-->\n\n        <div class=\"meeting-item-coach\" (click)=\"goToCoacheeProfile(meeting.coachee.id)\">\n          <div>\n            <!-- image coachee-->\n            <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coach\"\n                 [src]=\"meeting.coachee.avatar_url\">\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach-name black-text bold\">{{ meeting.coachee.firstName}} {{\n              meeting.coachee.lastName}}</p>\n            <p class=\"italic\">Company name</p>\n          </div>\n        </div>\n\n        <!-- DATE -->\n        <div class=\"meeting-item-date\" *ngIf=\"meeting.agreed_date\">\n          <span class=\"meeting-item-date-date\">{{ getDate(meeting.agreed_date.start_date) }}</span>\n          <span class=\"meeting-item-date-hour\">{{ printTimeString(meeting.agreed_date.start_date) }}</span>\n        </div>\n\n        <div class=\"meeting-item-date\" *ngIf=\"!meeting.agreed_date\">\n          <span class=\"meeting-item-date-date\">{{ getDate(meeting.created_date) }}</span>\n          <span class=\"meeting-item-date-hour\">{{ printTimeString(meeting.created_date) }}</span>\n        </div>\n      </div>\n    </div>\n\n    <!-- GOAL & REVIEW -->\n    <div class=\"meeting-item-body col-md-12 col-lg-7\">\n      <div class=\"meeting-item-body-content\">\n        <p>\n          <span class=\"black-text bold\">Objectif personnel: </span>\n          <span *ngIf=\"meeting.coachee.last_objective != null\">{{ meeting.coachee.last_objective.objective }}</span>\n          <span *ngIf=\"meeting.coachee.last_objective == null\">n/a</span>\n        </p>\n        <br>\n        <p class=\"meeting-item-goal\">\n          <span class=\"black-text bold\">Objectif de la séance: </span>\n          <span *ngIf=\"hasGoal\">{{(goal | async)}}</span>\n          <span *ngIf=\"!hasGoal\" class=\"red-text\">Pas encore défini...</span>\n        </p>\n        <br>\n        <p><span class=\"black-text bold\">Context :</span> {{ (context | async) }}</p>\n\n        <!--Complétées-->\n        <div *ngIf=\"!meeting.isOpen\" class=\"meeting-review\">\n          <div *ngIf=\"hasValue && hasNextStep\">\n            <br>\n            <p><span class=\"black-text bold\">Avec quoi êtes vous reparti ? </span>{{ reviewNextStep }}</p>\n            <br>\n            <p><span class=\"black-text bold\">En quoi la séance a-t-elle été utile ? </span>{{ reviewValue }}</p>\n\n          </div>\n        </div><!--end meeting-review-->\n\n        <!--Demandes disponibles-->\n        <div *ngIf=\"!meeting.agreed_date\" class=\"meeting-review\">\n          <div>\n            <br>\n            <p><span class=\"black-text bold\">Disponibilités :</span></p>\n            <div class=\"meeting-potential\" *ngFor=\"let potential of potentialDates | async\">\n              <span class=\"meeting-potential-date\">{{ getDate(potential.start_date) }}</span>\n              <span class=\"meeting-potential-hours\">{{ printTimeString(potential.start_date) }} - {{ printTimeString(potential.end_date) }}</span>\n            </div>\n            <br>\n            <form class=\"confirm-meeting-form\">\n              <!--<span class=\"black-text bold\">Réponse :</span>-->\n              <div class=\"input-field\">\n                <select [(ngModel)]=\"selectedDate\" name=\"meeting-date\" class=\"browser-default\"\n                        (change)=\"loadPotentialHours(selectedDate)\">\n                  <option value=\"0\" disabled selected>Date</option>\n                  <option *ngFor=\"let d of potentialDays | async\" [ngValue]=\" d \">\n                    {{ getDate(d) }}\n                  </option>\n                </select>\n              </div>\n              <div class=\"input-field\">\n                <select [(ngModel)]=\"selectedHour\" name=\"meeting-hour\" class=\"browser-default\"\n                        materialize=\"material_select\">\n                  <option value=\"0\" disabled selected>Heure</option>\n                  <option *ngFor=\"let h of potentialHours | async\" [ngValue]=\"h\">\n                    {{ printTimeNumber(h) }} - {{ printTimeNumber(h+1) }}\n                  </option>\n                </select>\n              </div>\n              <!--<div>-->\n              <!--<button type=\"submit\" class=\"btn-basic btn-blue btn-small\"-->\n              <!--[disabled]=\"!selectedDate || !selectedHour\"-->\n              <!--(click)=\"openCoachValidateMeetingModal()\">Devenir coach-->\n              <!--</button>-->\n              <!--</div>-->\n            </form>\n          </div>\n        </div><!--end meeting-review-->\n      </div>\n\n      <div class=\"meeting-item-body-buttons\" *ngIf=\"meeting.isOpen\">\n        <!--<button class=\"btn-basic btn-plain btn-blue btn-small\"-->\n        <!--(click)=\"toggleShowDetails()\">DETAIL-->\n        <!--</button>-->\n        <button type=\"submit\" class=\"btn-basic btn-blue btn-plain btn-small\"\n                *ngIf=\"!meeting.agreed_date\"\n                [disabled]=\"!selectedDate || !selectedHour\"\n                (click)=\"onValidateDateClick()\">Coacher\n        </button>\n\n        <button type=\"submit\" class=\"btn-basic btn-blue btn-plain btn-small\"\n                *ngIf=\"meeting.agreed_date\"\n                (click)=\"onCloseMeetingBtnClick()\">Clore\n        </button>\n        <!--<button class=\"btn-basic btn-cancel\"-->\n        <!--*ngIf=\"meeting.agreed_date\"-->\n        <!--(click)=\"openModal()\">-->\n        <!--<i class=\"material-icons\">clear</i>-->\n        <!--</button>-->\n      </div>\n    </div><!--end meeting-item-body-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n\n\n<!--\n<div class=\"card\">\n  <div class=\"card-content\">\n    <span class=\"card-title\">Vous avez été choisi par {{ coachee.display_name }} pour une séance.</span>\n\n\n    &lt;!&ndash; Meeting is closed&ndash;&gt;\n    <div *ngIf=\"!meeting.isOpen\">\n      <h4>Meeting is now closed</h4>\n    </div>\n\n    &lt;!&ndash; Meeting is open &ndash;&gt;\n    <div *ngIf=\"meeting.isOpen\">\n      <div class=\"col s12\" *ngIf=\"meeting.agreed_date == null\">\n\n        &lt;!&ndash; no potential dates selected&ndash;&gt;\n        <div class=\"section\" *ngIf=\"(potentialDates | async)== null\">\n          <h5>Votre coachee doit d'abord indiquer ses préférences horaires</h5>\n        </div>\n\n        &lt;!&ndash; some potential dates selected&ndash;&gt;\n        <div class=\"section\" *ngIf=\"(potentialDates | async)!= null\">\n          <h5>Votre coachee a indiqué ses préférences horaires</h5>\n\n          &lt;!&ndash; list of potential dates &ndash;&gt;\n          <div *ngFor=\"let date of potentialDates | async\">\n            <h6>Possible date</h6>\n            <p>Le : {{date.start_date | date}}</p>\n            <p>De : {{date.start_date | date:'shortTime'}}</p>\n            <p>A : {{date.end_date | date:'shortTime'}}</p>\n\n            <button class=\"btn cyan waves-effect waves-light right\" (click)=\"confirmPotentialDate(date)\">\n              Confirmer cette date\n              <i class=\"mdi-content-send right\"></i>\n            </button>\n\n          </div>\n        </div>\n\n      </div>\n\n      <div class=\"col s12\" *ngIf=\"meeting.agreed_date \">\n        <h5>Votre meeting est le : {{meeting.agreed_date.start_date | date}} à {{meeting.agreed_date.start_date | date:'shortTime'}} </h5>\n      </div>\n\n    </div>\n\n\n    &lt;!&ndash; check if you have some reviews&ndash;&gt;\n    <div class=\"container\" *ngIf=\"(hasSomeReviews | async)\">\n\n      <h4>Comments</h4>\n\n      &lt;!&ndash; list of reviews &ndash;&gt;\n      <div *ngFor=\"let review of reviews | async\">\n\n        <div class=\"card\">\n          <div class=\"card-content\">\n            <span class=\"card-title\">Meeting Review</span>\n            <div class=\"list-group-item-text\">at : {{review.date}}</div>\n            <div class=\"list-group-item-text\">comment : {{review.comment}}</div>\n            <div class=\"list-group-item-text\">score : {{review.score}}</div>\n          </div>\n        </div>\n      </div>\n\n    </div>\n    &lt;!&ndash; /reviews&ndash;&gt;\n\n    &lt;!&ndash; Display Close Form is the Meeting is still open &ndash;&gt;\n    <div *ngIf=\"meeting.isOpen\" class=\"card\">\n\n      <div class=\"card-content\">\n\n        <h5>Close this meeting</h5>\n\n        <form [formGroup]=\"closeMeetingForm\" (ngSubmit)=\"submitCloseMeetingForm()\">\n\n          <div class=\"form-group\">\n            <label for=\"recap\">Résumé du meeting</label>\n            <input\n              type=\"text\"\n              id=\"recap\"\n              class=\"form-control\"\n              formControlName=\"recap\">\n          </div>\n\n          &lt;!&ndash;<button type=\"submit\" class=\"btn btn-success\">Envoyer</button>&ndash;&gt;\n          &lt;!&ndash;<button type=\"submit\" class=\"btn btn-success\" [disabled]=\"!closeMeetingForm.valid\">Envoyer</button>&ndash;&gt;\n          <button class=\"btn cyan waves-effect waves-light right\" type=\"submit\" name=\"action\">\n            Fermer le meeting\n            <i class=\"mdi-content-send right\"></i>\n          </button>\n        </form>\n      </div>\n    </div>\n\n\n  </div>\n\n\n</div>\n-->\n"

/***/ }),

/***/ 642:
/***/ (function(module, exports) {

module.exports = "<h4 class=\"text-right\">Bonjour {{ (user | async)?.firstName}},\n  vous avez <span class=\"blue-text\">{{(meetingsOpened | async)?.length}}</span> séance\n  <span *ngIf=\"(meetingsOpened | async)?.length > 1\">s</span> cette semaine</h4>\n<p class=\"text-right\">\n  <span class=\"blue-text\">Cliquez</span> ici pour votre salon\n  <a class=\"btn-floating btn-large waves-effect waves-light add-meeting-btn\" (click)=\"onCoachStartRoomClicked()\">\n    <i class=\"material-icons\">videocam</i>\n  </a>\n</p>\n\n\n<!--<div class=\"row\">-->\n<!--<h4 class=\"col-lg-12 black-text\">Demandes disponibles</h4>-->\n<!--<div class=\"card collection col-lg-12\">-->\n\n<!--<div *ngIf=\"hasUnbookedMeeting\">-->\n<!--<div class=\"collection-item\" *ngFor=\"let meeting of meetingsUnbooked | async\">-->\n<!--<rb-meeting-item-coach [meeting]=\"meeting\"-->\n<!--(dateAgreed)=\"onRefreshRequested($event)\"-->\n<!--(cancelMeetingTimeEvent)=\"openCoachCancelMeetingModal($event)\">-->\n<!--</rb-meeting-item-coach>-->\n<!--</div>-->\n<!--</div>-->\n\n<!--<div *ngIf=\"!hasUnbookedMeeting\" class=\"collection-item text-center\">-->\n<!--<h5 class=\"no-meeting\">Les demandes disponibles apparaîtront ici</h5>-->\n<!--</div>-->\n\n<!--</div>&lt;!&ndash;end card&ndash;&gt;-->\n<!--</div>&lt;!&ndash;end row&ndash;&gt;-->\n\n<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">A venir</h4>\n  <div class=\"card collection col-lg-12\">\n\n    <div *ngIf=\"hasOpenedMeeting\">\n      <div class=\"collection-item\" *ngFor=\"let meeting of meetingsOpened | async\">\n        <rb-meeting-item-coach [meeting]=\"meeting\"\n                               (dateAgreed)=\"onRefreshRequested($event)\"\n                               (cancelMeetingTimeEvent)=\"openCoachCancelMeetingModal($event)\"\n                               (onCloseMeetingBtnClickEmitter)=\"starCloseSessionFlow($event)\">\n        </rb-meeting-item-coach>\n      </div>\n    </div>\n\n    <div *ngIf=\"!hasOpenedMeeting\" class=\"collection-item text-center\">\n      <h5 class=\"no-meeting\">Vos séances à venir apparaîtront ici</h5>\n    </div>\n\n  </div><!--end card-->\n</div><!--end row-->\n\n<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">Complétées</h4>\n  <div class=\"card collection col-lg-12\">\n\n    <div *ngIf=\"hasClosedMeeting\">\n      <div class=\"collection-item\" *ngFor=\"let meeting of meetingsClosed | async\">\n        <rb-meeting-item-coach [meeting]=\"meeting\"\n                               (dateAgreed)=\"onRefreshRequested($event)\"\n                               (cancelMeetingTimeEvent)=\"openCoachCancelMeetingModal($event)\">\n        </rb-meeting-item-coach>\n      </div>\n    </div>\n\n    <div *ngIf=\"!hasClosedMeeting\" class=\"collection-item text-center\">\n      <h5 class=\"no-meeting\">Vos séances complétées apparaîtront ici</h5>\n    </div>\n\n  </div><!--end card-->\n</div><!--end row-->\n\n\n<!-- Modal Coach to complete a session -->\n<div id=\"complete_session_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <label>Avec quoi êtes-vous repartis ?</label>\n      <textarea type=\"text\" placeholder=\"Commentaire...\" [(ngModel)]=\"sessionResult\"></textarea>\n    </div>\n\n    <div class=\"action-modal-message\">\n      <label>En quoi la séance a-t-elle été utile ?</label>\n      <textarea type=\"text\" placeholder=\"Commentaire...\" [(ngModel)]=\"sessionUtility\"></textarea>\n    </div>\n\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelCloseSessionModal()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateCloseSessionModal()\"\n              [disabled]=\"!sessionResult && !sessionUtility\">Conclure la séance\n      </button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 643:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\" [class.closed]=\"!meeting.isOpen\">\n  <!--<span class=\"card-title\">Vous avez choisi {{ coach.display_name }} pour être votre coach.</span>-->\n\n  <div class=\"preloader-wrapper active\" *ngIf=\"loading\">\n    <div class=\"spinner-layer spinner-blue-only\">\n      <div class=\"circle-clipper left\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"gap-patch\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"circle-clipper right\">\n        <div class=\"circle\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"row\" *ngIf=\"!loading\">\n\n    <!-- COACH -->\n    <div class=\"meeting-item-header col-md-12 col-lg-5\">\n      <div>\n        <div class=\"meeting-item-coach has-coach\" *ngIf=\"meeting.coach\"\n             (click)=\"goToCoachProfile(meeting.coach.id)\">\n          <div>\n            <!-- image coach-->\n            <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coach\"\n                 [src]=\"meeting.coach.avatar_url\">\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach-name black-text bold\">{{ meeting.coach.firstName}} {{\n              meeting.coach.lastName}}</p>\n          </div>\n        </div>\n\n        <div class=\"meeting-item-coach\" *ngIf=\"!meeting.coach\">\n          <div>\n            <!-- image coach-->\n            <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coach\"\n                 src=\"https://s-media-cache-ak0.pinimg.com/originals/af/25/49/af25490494d3338afef00869c59fdd37.png\">\n          </div>\n\n          <div *ngIf=\"(potentialDates | async) != null\">\n            <p class=\"meeting-item-coach-name\">Un coach vous sera bientôt attribué</p>\n          </div>\n\n          <div *ngIf=\"(potentialDates | async) == null\">\n            <p class=\"meeting-item-coach-name red-text\">Veuillez ajouter des disponibilités</p>\n          </div>\n        </div>\n\n        <!-- DATE -->\n        <div class=\"meeting-item-date\">\n          <div *ngIf=\"meeting.agreed_date\">\n            <span class=\"meeting-item-date-date\">{{ getDate(meeting.agreed_date.start_date) }}</span>\n            <span class=\"meeting-item-date-hour\">{{ printTimeString(meeting.agreed_date.start_date) }}</span>\n          </div>\n\n          <!--<button *ngIf=\"!meeting.agreed_date\" class=\"btn-basic btn-blue btn-small\" (click)=\"goToModifyDate(meeting.id)\">-->\n          <!--Modifier-->\n          <!--</button>-->\n        </div>\n      </div>\n    </div>\n\n    <!-- GOAL & REVIEW -->\n    <div class=\"meeting-item-body col-md-12 col-lg-7\">\n      <div class=\"meeting-item-body-content\">\n        <p>\n          <span class=\"black-text bold\">Objectif de la séance: </span>\n          <span *ngIf=\"hasGoal\">{{goal | async}}</span>\n          <span *ngIf=\"!hasGoal\" class=\"red-text\">Veuillez définir votre objectif.</span>\n        </p>\n\n        <br>\n\n        <p>\n          <span class=\"black-text bold\">Context de la séance: </span>\n          <span *ngIf=\"hasContext\">{{context | async}}</span>\n          <span *ngIf=\"!hasContext\" class=\"red-text\">Veuillez définir votre context.</span>\n        </p>\n\n        <div *ngIf=\"!meeting.isOpen\" class=\"meeting-review\">\n          <div *ngIf=\"hasSessionResult && hasSessionUtility\">\n            <br>\n            <p><span class=\"black-text bold\">Avec quoi êtes vous reparti ? </span>{{ sessionResult }}</p>\n            <br>\n            <p><span class=\"black-text bold\">En quoi la séance a-t-elle été utile ? </span>{{ sessionUtility }}</p>\n          </div>\n        </div><!--end meeting-review-->\n      </div>\n\n      <div class=\"meeting-item-body-buttons\" *ngIf=\"meeting.isOpen\">\n        <button class=\"btn-basic btn-plain btn-blue btn-small\" *ngIf=\"!meeting.agreed_date\"\n                (click)=\"goToModifyDate(meeting.id)\">\n          MODIFIER\n        </button>\n        <button class=\"btn-basic btn-plain btn-blue btn-small\" *ngIf=\"hasGoal && meeting.agreed_date\"\n                (click)=\"goToChatRoom()\">\n          LANCER\n        </button>\n        <button class=\"btn-basic btn-cancel\" (click)=\"openModal()\"><i class=\"material-icons\">clear</i></button>\n      </div>\n      <div class=\"meeting-item-body-buttons\" *ngIf=\"!meeting.isOpen && !hasRate\">\n        <button class=\"btn-basic btn-plain btn-blue btn-small\" (click)=\"rateSession()\">NOTER</button>\n      </div>\n    </div><!--end meeting-item-body-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 644:
/***/ (function(module, exports) {

module.exports = "<h4 class=\"text-right\">Bonjour {{ (user | async)?.firstName}},\n  il vous reste <span class=\"blue-text\">{{(user | async)?.availableSessionsCount || 0}}</span>\n  séance<span *ngIf=\"(user | async)?.availableSessionsCount > 1\">s</span>\n  pour ce mois\n  <h5 class=\"italic\" *ngIf=\"(user | async)?.last_objective != null\">\n    Objectif de votre RH: \"{{(user | async).last_objective.objective}}\"</h5>\n  <h5 class=\"italic\" *ngIf=\"(user | async)?.last_objective == null\">\n    Vous n'avez pas encore d'objectif personnel</h5>\n</h4>\n<p class=\"text-right\" *ngIf=\"(user | async)?.availableSessionsCount > 0\">\n  <span class=\"blue-text\">Cliquez</span> ici pour planifier une nouvelle séance\n  <a class=\"btn-floating btn-large waves-effect waves-light add-meeting-btn\" (click)=\"goToDate()\">\n    <i class=\"material-icons\">add</i>\n  </a>\n</p>\n\n\n<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">A venir</h4>\n  <div class=\"card collection col-lg-12\">\n\n    <div *ngIf=\"hasOpenedMeeting\">\n      <div class=\"collection-item\" *ngFor=\"let meeting of meetingsOpened | async\">\n        <rb-meeting-item-coachee [meeting]=\"meeting\"\n                                 (cancelMeetingTimeEvent)=\"openCoacheeDeleteMeetingModal($event)\">\n        </rb-meeting-item-coachee>\n      </div>\n    </div>\n\n    <div *ngIf=\"!hasOpenedMeeting\" class=\"collection-item text-center\">\n      <h5 class=\"no-meeting\">Vos séances à venir apparaîtront ici</h5>\n    </div>\n\n  </div><!--end card-->\n</div><!--end row-->\n\n<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">Complétées</h4>\n  <div class=\"card collection col-lg-12\">\n\n    <div *ngIf=\"hasClosedMeeting\">\n      <div class=\"collection-item\" *ngFor=\"let meeting of meetingsClosed | async\">\n        <rb-meeting-item-coachee [meeting]=\"meeting\"\n                                 (cancelMeetingTimeEvent)=\"openCoacheeDeleteMeetingModal($event)\"\n                                 (onRateSessionBtnClickedEmitter)=\"openRateSessionModal($event)\">\n        </rb-meeting-item-coachee>\n      </div>\n    </div>\n\n    <div *ngIf=\"!hasClosedMeeting\" class=\"collection-item text-center\">\n      <h5 class=\"no-meeting\">Vos séances complétées apparaîtront ici</h5>\n    </div>\n\n  </div><!--end card-->\n</div><!--end row-->\n\n\n<!-- Modal Coachee Delete Meeting -->\n<div id=\"coachee_delete_meeting_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <h5 class=\"black-text center\">Ce meeting sera supprimé définitivement.</h5>\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelCoacheeDeleteMeeting()\">Annuler</button>\n      <button class=\"btn-basic btn-red btn-plain btn-small\" (click)=\"validateCoacheeDeleteMeeting()\">Supprimer</button>\n    </div>\n  </div>\n</div>\n\n<!-- Modal Coachee Delete Meeting -->\n<div id=\"rate_session_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <h5 class=\"black-text center\">Notez votre séance</h5>\n    </div>\n\n    <div class=\"action-modal-message\">\n      <div class=\"ratebar center\">\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 0\" [class.pre-selected]=\"sessionPreRate > 0\" (click)=\"setSessionRate(1)\" (mouseenter)=\"setSessionPreRate(1)\" (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 1\" [class.pre-selected]=\"sessionPreRate > 1\" (click)=\"setSessionRate(2)\" (mouseenter)=\"setSessionPreRate(2)\" (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 2\" [class.pre-selected]=\"sessionPreRate > 2\" (click)=\"setSessionRate(3)\" (mouseenter)=\"setSessionPreRate(3)\" (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 3\" [class.pre-selected]=\"sessionPreRate > 3\" (click)=\"setSessionRate(4)\" (mouseenter)=\"setSessionPreRate(4)\" (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n        <div class=\"rate-star\" [class.selected]=\"sessionRate > 4\" [class.pre-selected]=\"sessionPreRate > 4\" (click)=\"setSessionRate(5)\" (mouseenter)=\"setSessionPreRate(5)\" (mouseleave)=\"setSessionPreRate(sessionRate)\">\n          <i class=\"material-icons star\">star</i>\n        </div>\n      </div>\n    </div>\n\n\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelRateSessionModal()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateRateSessionModal()\">Noter</button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 645:
/***/ (function(module, exports) {

module.exports = "<!--<rb-header></rb-header>-->\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col s12\">\n\n      <!-- welcome message for coachee -->\n      <div *ngIf=\"isUserACoachee((user | async))\">\n        <rb-meeting-list-coachee></rb-meeting-list-coachee>\n      </div>\n\n      <!-- welcome message for coach -->\n      <div *ngIf=\"isUserACoach((user | async))\">\n        <rb-meeting-list-coach></rb-meeting-list-coach>\n      </div>\n\n      <!-- welcome message for rh -->\n      <div *ngIf=\"isUserARh((user | async))\">\n        <rb-meeting-list-rh></rb-meeting-list-rh>\n      </div>\n\n    </div><!--end row-->\n  </div><!--end container-->\n</div>\n"

/***/ }),

/***/ 646:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\" (click)=\"toggleShowDetails()\">\n\n  <div class=\"preloader-wrapper active\" *ngIf=\"loading\">\n    <div class=\"spinner-layer spinner-blue-only\">\n      <div class=\"circle-clipper left\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"gap-patch\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"circle-clipper right\">\n        <div class=\"circle\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div *ngIf=\"!loading\">\n\n    <!-- COACHEE -->\n    <div *ngIf=\"coachee != null\" class=\"row\">\n      <div class=\"meeting-item-header col-md-12 col-lg-5\">\n        <div>\n          <div class=\"meeting-item-coach\">\n            <div>\n              <!-- image coachee -->\n              <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coachee\" [src]=\"coachee.avatar_url\">\n            </div>\n\n            <div>\n              <p class=\"meeting-item-coach black-text bold\">{{ coachee.firstName}} {{ coachee.lastName}}</p>\n              <p class=\"italic\">Inscrit le {{ printDateString(coachee.start_date) }}</p>\n            </div>\n          </div>\n\n          <!--USAGE-->\n          <div class=\"meeting-item-date\">\n            <div class=\"meeting-item-date-date\">\n              <span class=\"usage-title\">Utilisation: </span>\n              <span class=\"blue-text\">{{ (coacheeUsageRate | async)?.usage_rate}}%</span>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <!-- GOAL -->\n      <div class=\"meeting-item-body col-md-12 col-lg-7\">\n        <div class=\"meeting-item-body-content\">\n          <p class=\"meeting-item-goal\">\n            <span class=\"black-text bold\">Objectif personnel: </span>\n            <span *ngIf=\"coachee.last_objective\">{{ coachee.last_objective.objective }}</span>\n            <span *ngIf=\"!coachee.last_objective\">n/a</span>\n          </p>\n        </div>\n\n        <div class=\"meeting-item-body-buttons\">\n          <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"onClickAddObjectiveBtn()\"\n                  *ngIf=\"!coachee.last_objective\">\n            Ajouter un objectif\n          </button>\n          <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"onClickAddObjectiveBtn()\"\n                  *ngIf=\"coachee.last_objective\">\n            Modifier l'objectif\n          </button>\n        </div>\n      </div><!--end meeting-item-body-->\n\n      <div *ngIf=\"showDetails\" class=\"meeting-review\">\n        <div>\n          <h5><span class=\"blue-text\">{{ coachee.plan.sessions_count }}</span> séances/mois</h5>\n          <br>\n          <div *ngIf=\"!hasBookedMeeting\"><p>Pas encore de séance réalisée</p><br></div>\n          <div *ngIf=\"hasBookedMeeting\">\n            <div *ngFor=\"let meeting of (meetings | async)\">\n              <div class=\"row\">\n                <div class=\" col-md-3\">\n                  <span class=\"meeting-list-date\">{{ printDateString(meeting.agreed_date.start_date) }}</span>\n                </div>\n                <div class=\"col-md-9\">\n                  <span class=\"black-text bold\">Objectif de la séance: </span>\n                  <span>{{ goals[meeting.id] }}</span>\n                </div>\n              </div>\n              <br>\n            </div>\n          </div>\n        </div>\n      </div><!--end meeting-review-->\n\n    </div><!--end coachee-->\n\n    <!-- POTENTIAL COACHEE -->\n    <div *ngIf=\"potentialCoachee != null\" class=\"row\">\n      <div class=\"meeting-item-header col-lg-12\">\n        <div class=\"meeting-item-coach\">\n          <div>\n            <!-- image coachee -->\n            <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"potentialCoachee\"\n                 src=\"https://s-media-cache-ak0.pinimg.com/originals/af/25/49/af25490494d3338afef00869c59fdd37.png\">\n          </div>\n\n          <div>\n            <p class=\"meeting-item-coach\">{{ potentialCoachee.email }}</p>\n          </div>\n        </div>\n\n        <!-- PLAN -->\n        <div class=\"meeting-item-date\">\n          <span class=\"meeting-item-date-date\"><span class=\"blue-text\">{{ potentialCoachee.plan.sessions_count }}</span> séances</span>\n        </div>\n      </div>\n    </div><!--end potentialCoachee-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 647:
/***/ (function(module, exports) {

module.exports = "<h4 class=\"text-right welcome-message\">Bonjour {{ (user | async)?.firstName}},<br>\n  Le taux total d'utilisation de vos collaborateurs est de <span class=\"blue-text\">{{(rhUsageRate | async)?.usage_rate}}%</span>\n</h4>\n<p class=\"text-right\">\n  <span class=\"blue-text\">Cliquez</span> ici pour ajouter un collaborateur\n  <a class=\"btn-floating btn-large waves-effect waves-light add-meeting-btn\"\n     (click)=\"addPotentialCoacheeModalVisibility(true)\">\n    <i class=\"material-icons\">add</i>\n  </a>\n</p>\n\n\n<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">Collaborateurs</h4>\n  <div class=\"card collection col-lg-12\">\n\n    <div *ngIf=\"hasCollaborators\">\n      <div class=\"collection-item\" *ngFor=\"let coachee of coachees | async\">\n        <rb-meeting-item-rh [coachee]=\"coachee\"\n                            [potentialCoachee]=\"null\"\n                            (onUpdateObjectiveBtnClick)=\"startAddNewObjectiveFlow($event)\">\n        </rb-meeting-item-rh>\n      </div>\n    </div>\n\n    <div *ngIf=\"!hasCollaborators\" class=\"collection-item text-center\">\n      <h5 class=\"no-meeting\">Vos collaborateurs apparaîtront ici</h5>\n    </div>\n\n  </div><!--end card-->\n</div><!--end row-->\n\n<div class=\"row\">\n  <h4 class=\"col-lg-12 black-text\">Collaborateurs invités en attente</h4>\n  <div class=\"card collection col-lg-12\">\n\n    <div *ngIf=\"hasPotentialCollaborators\">\n      <div class=\"collection-item\" *ngFor=\"let potentialCoachee of potentialCoachees | async\">\n        <rb-meeting-item-rh [potentialCoachee]=\"potentialCoachee\"\n                            [coachee]=\"null\">\n        </rb-meeting-item-rh>\n      </div>\n    </div>\n\n    <div *ngIf=\"!hasPotentialCollaborators\" class=\"collection-item text-center\">\n      <h5 class=\"no-meeting\">Vos collaborateurs en attente de validation apparaîtront ici</h5>\n    </div>\n\n  </div><!--end card-->\n</div><!--end row-->\n\n<!-- Modal RH add Coachee -->\n<div id=\"add_potential_coachee_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <label>Veuillez saisir l'adresse mail du collaborateur. Un mail lui sera envoyé pour finaliser son\n        inscription.</label>\n      <input type=\"email\" placeholder=\"Email\" id=\"potential_mail\" [(ngModel)]=\"potentialCoacheeEmail\">\n      <select [(ngModel)]=\"selectedPlan\"\n              [ngModelOptions]=\"{standalone: true}\"\n              name=\"plan_selector\"\n              class=\"browser-default\">\n        <option value=\"{{selectedPlan}}\" disabled selected>Sélectionnez un plan</option>\n        <option *ngFor=\"let plan of plans | async\" [ngValue]=\"plan\">\n          {{ plan.sessions_count }} séances\n        </option>\n      </select>\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelAddPotentialCoachee()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateAddPotentialCoachee()\"\n              [disabled]=\"!potentialCoacheeEmail\">Ajouter\n      </button>\n    </div>\n  </div>\n</div>\n\n<!-- Modal RH add new objective to Coachee -->\n<div id=\"add_new_objective_modal\" class=\"modal\">\n  <div class=\"action-modal-content\">\n    <div class=\"action-modal-message\">\n      <label>Définissez un objectif</label>\n      <input type=\"text\" placeholder=\"Objectif\" id=\"\" [(ngModel)]=\"coacheeNewObjective\">\n    </div>\n    <div class=\"action-modal-footer\">\n      <button class=\"btn-basic btn-plain btn-small\" (click)=\"cancelAddNewObjectiveModal()\">Annuler</button>\n      <button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"validateAddNewObjectiveModal()\"\n              [disabled]=\"!coacheeNewObjective\">Ajouter\n      </button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 648:
/***/ (function(module, exports) {

module.exports = "<h4>Veuillez renseigner les éléments de votre demande</h4>\n\n<div class=\"row\">\n  <div class=\"col s12\">\n    <label for=\"objectif\">Quel est votre objectif ?</label>\n    <input id=\"objectif\" type=\"text\" [ngModel]=\"uiMeetingGoal\" (change)=\"onGoalValueChanged($event)\" placeholder=\"Objectif...\">\n  </div>\n</div>\n\n\n<div class=\"row\">\n  <div class=\"col s12\">\n    <label for=\"context\">Quel est le context ?</label>\n    <input id=\"context\" type=\"text\" [ngModel]=\"uiMeetingContext\" (change)=\"onContextValueChanged($event)\" placeholder=\"Context...\">\n  </div>\n</div>\n"

/***/ }),

/***/ 649:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\">\n\n  <div class=\"preloader-wrapper active\" *ngIf=\"loading\">\n    <div class=\"spinner-layer spinner-blue-only\">\n      <div class=\"circle-clipper left\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"gap-patch\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"circle-clipper right\">\n        <div class=\"circle\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div *ngIf=\"!loading\">\n\n    <!-- Coach -->\n    <div class=\"row\">\n      <div class=\"meeting-item-header col-md-12 col-lg-4\">\n        <div>\n          <div class=\"meeting-item-coach\" (click)=\"goToCoachProfile(coach.id)\">\n            <div>\n              <!-- image coach -->\n              <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coach\" [src]=\"coach.avatar_url\">\n            </div>\n\n            <div>\n              <p class=\"meeting-item-coach-name black-text bold\">{{ coach.firstName}} {{ coach.lastName}}</p>\n              <p class=\"italic\">{{ coach.email }}</p>\n            </div>\n          </div>\n\n          <!-- PLAN -->\n          <!--<div class=\"meeting-item-date\">-->\n            <!--<span class=\"meeting-item-date-date\"><span class=\"blue-text\">{{ coach.plan.sessions_count }}</span> séances</span>-->\n          <!--</div>-->\n\n        </div>\n      </div>\n\n      <!-- GOAL -->\n      <div class=\"meeting-item-body col-md-12 col-lg-8\">\n        <div class=\"meeting-item-body-content\">\n          <span>Inscrit le {{ printDateString(coach.start_date) }}</span>\n        </div>\n      </div><!--end meeting-item-body-->\n\n    </div><!--end coach-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n\n\n\n<!--<div class=\"container\">-->\n  <!--<div class=\"row coach_card\">-->\n\n    <!--<div class=\"col s12\" style=\"padding: 16px\">-->\n\n      <!--<span>{{ coach.firstName}} {{ coach.lastName}}</span>-->\n      <!--<img style=\"width: 30px;height: 30px\" src=\"{{coach.avatar_url}}\" alt=\"\">-->\n\n    <!--</div>-->\n\n  <!--</div>-->\n\n<!--</div>-->\n"

/***/ }),

/***/ 650:
/***/ (function(module, exports) {

module.exports = "<!--<rb-header></rb-header>-->\n<div class=\"container\">\n\n  <div *ngIf=\"(coachee | async)?.selectedCoach\">\n    <!-- Coachee has selected a coach -->\n\n    <h4>Vous avez sélectionné un coach </h4>\n\n    <p>{{ (coachee | async)?.selectedCoach.firstName}} {{ (coachee | async)?.selectedCoach.lastName}}</p>\n\n    <!--<rb-coach-details class=\"col s4\" [iCoach]=\"(coachee | async)?.selectedCoach\"></rb-coach-details>-->\n\n  </div>\n\n  <div *ngIf=\"(coachee | async)?.selectedCoach == null\">\n\n    <h4>Nous avons sélectionné des coachs pour vous</h4>\n\n    <div class=\"row\">\n      <rb-coach-item class=\"col s4\" *ngFor=\"let coach of coachs | async\" [coach]=\"coach\"\n                     (click)=\"onPotentialCoachSelected(coach)\"></rb-coach-item>\n    </div>\n  </div>\n\n  <div *ngIf=\"potSelectedCoach\">\n    <button class=\"btn cyan waves-effect waves-light right\" (click)=\"onFinalCoachSelected(potSelectedCoach)\">\n      Sélectionner ce coach<i\n      class=\"mdi-content-send right\"></i></button>\n\n    <rb-profile-coach-summary class=\"col s4\"\n                              [coach]=\"potSelectedCoach\"></rb-profile-coach-summary>\n\n    <button class=\"btn cyan waves-effect waves-light right\" (click)=\"onFinalCoachSelected(potSelectedCoach)\">\n      Sélectionner ce coach<i\n      class=\"mdi-content-send right\"></i></button>\n  </div>\n\n\n</div>\n\n"

/***/ }),

/***/ 651:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\">\n\n  <div class=\"preloader-wrapper active\" *ngIf=\"loading\">\n    <div class=\"spinner-layer spinner-blue-only\">\n      <div class=\"circle-clipper left\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"gap-patch\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"circle-clipper right\">\n        <div class=\"circle\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div *ngIf=\"!loading\">\n\n    <!-- COACHEE -->\n    <div class=\"row\">\n      <div class=\"meeting-item-header col-md-12 col-lg-6\">\n        <div>\n          <div class=\"meeting-item-coach\" (click)=\"goToCoacheeProfile(coachee.id)\">\n            <div>\n              <!-- image coachee -->\n              <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coachee\" [src]=\"coachee.avatar_url\">\n            </div>\n\n            <div>\n              <p class=\"meeting-item-coach-name black-text bold\">{{ coachee.firstName}} {{ coachee.lastName}}</p>\n              <p class=\"italic\">{{ coachee.email }}</p>\n            </div>\n          </div>\n\n          <!-- PLAN -->\n          <div class=\"meeting-item-date\">\n            <span class=\"meeting-item-date-date\"><span class=\"blue-text\">{{ coachee.plan.sessions_count }}</span> séances</span>\n          </div>\n          <!--USAGE-->\n          <!--<div class=\"meeting-item-date\">-->\n            <!--<div class=\"meeting-item-date-date\">-->\n              <!--<p class=\"italic\">Inscrit le {{ printDateString(coachee.start_date) }}</p>-->\n            <!--</div>-->\n          <!--</div>-->\n        </div>\n      </div>\n\n      <!-- GOAL -->\n      <div class=\"meeting-item-body col-md-12 col-lg-6\">\n        <div class=\"meeting-item-body-content\">\n          <span>Inscrit le {{ printDateString(coachee.start_date) }}</span>\n        </div>\n\n        <!--<div class=\"meeting-item-body-buttons\">-->\n          <!--<button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"onClickAddObjectiveBtn()\"-->\n                  <!--*ngIf=\"!coachee.last_objective\">-->\n            <!--Ajouter un objectif-->\n          <!--</button>-->\n          <!--<button class=\"btn-basic btn-blue btn-plain btn-small\" (click)=\"onClickAddObjectiveBtn()\"-->\n                  <!--*ngIf=\"coachee.last_objective\">-->\n            <!--Modifier l'objectif-->\n          <!--</button>-->\n        <!--</div>-->\n      </div><!--end meeting-item-body-->\n\n      <!--<div *ngIf=\"showDetails\" class=\"meeting-review\">-->\n        <!--<div>-->\n          <!--<h5><span class=\"blue-text\">{{ coachee.plan.sessions_count }}</span> séances/mois</h5>-->\n          <!--<br>-->\n          <!--<div *ngIf=\"!hasBookedMeeting\"><p>Pas encore de séance réalisée</p><br></div>-->\n          <!--<div *ngIf=\"hasBookedMeeting\">-->\n            <!--<div *ngFor=\"let meeting of (meetings | async)\">-->\n              <!--<div class=\"row\">-->\n                <!--<div class=\" col-md-3\">-->\n                  <!--<span class=\"meeting-list-date\">{{ printDateString(meeting.agreed_date.start_date) }}</span>-->\n                <!--</div>-->\n                <!--<div class=\"col-md-9\">-->\n                  <!--<span class=\"black-text bold\">Objectif de la séance: </span>-->\n                  <!--<span>{{ goals[meeting.id] }}</span>-->\n                <!--</div>-->\n              <!--</div>-->\n              <!--<br>-->\n            <!--</div>-->\n          <!--</div>-->\n        <!--</div>-->\n      <!--</div>&lt;!&ndash;end meeting-review&ndash;&gt;-->\n\n    </div><!--end coachee-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 652:
/***/ (function(module, exports) {

module.exports = "<!--start container-->\n<div class=\"container\">\n\n  <div id=\"profile-page\" class=\"section\">\n    <!-- profile-page-header -->\n    <div id=\"profile-page-header\" class=\"card\">\n      <div class=\"card-image waves-effect waves-block waves-light\">\n        <img class=\"activator\" src=\"images/user-profile-bg.jpg\" alt=\"user background\">\n      </div>\n      <figure class=\"card-profile-image\">\n        <img src=\"{{coach.avatar_url}}\" alt=\"profile image\"\n             class=\"circle z-depth-2 responsive-img activator\">\n      </figure>\n      <div class=\"card-content\">\n        <div class=\"row\">\n          <div class=\"col s3 offset-s2\">\n            <h4 class=\"card-title grey-text text-darken-4\">{{ coach.firstName}} {{ coach.lastName}}</h4>\n            <p class=\"medium-small grey-text\">Coach</p>\n          </div>\n          <div class=\"col s2 center-align\">\n            <h4 class=\"card-title grey-text text-darken-4\">10+</h4>\n            <p class=\"medium-small grey-text\">Work Experience</p>\n          </div>\n          <div class=\"col s2 center-align\">\n            <h4 class=\"card-title grey-text text-darken-4\">6</h4>\n            <p class=\"medium-small grey-text\">Completed Sessions</p>\n          </div>\n          <div class=\"col s2 center-align\">\n            <h4 class=\"card-title grey-text text-darken-4\">$ 1,253,000</h4>\n            <p class=\"medium-small grey-text\">Business Profit</p>\n          </div>\n          <div class=\"col s1 right-align\">\n            <a class=\"btn-floating activator waves-effect waves-light darken-2 right\">\n              <i class=\"mdi-action-perm-identity\"></i>\n            </a>\n          </div>\n        </div>\n      </div>\n      <div class=\"card-reveal\">\n        <p>\n            <span class=\"card-title grey-text text-darken-4\">{{ coach.firstName}} {{ coach.lastName}}<i\n              class=\"mdi-navigation-close right\"></i></span>\n          <span><i class=\"mdi-action-perm-identity cyan-text text-darken-2\"></i>Coach</span>\n        </p>\n\n        <p>Coach description</p>\n\n        <p><i class=\"mdi-action-perm-phone-msg cyan-text text-darken-2\"></i> +1 (612) 222 8989</p>\n        <p><i class=\"mdi-communication-email cyan-text text-darken-2\"></i> {{ coach.email }}</p>\n        <p><i class=\"mdi-social-cake cyan-text text-darken-2\"></i> Start Date : {{ coach.start_date }}</p>\n        <p><i class=\"mdi-device-airplanemode-on cyan-text text-darken-2\"></i> BAR - AUS</p>\n        <p><i class=\"mdi-social-cake cyan-text text-darken-2\"></i> eritis id : {{ coach.id }}</p>\n\n      </div>\n    </div>\n    <!--/ profile-page-header -->\n\n    <!-- profile-page-content -->\n    <div id=\"profile-page-content\" class=\"row\">\n      <!-- profile-page-sidebar-->\n      <div id=\"profile-page-sidebar\" class=\"col s12 m4\">\n        <!-- Profile About  -->\n        <div class=\"card light-blue\">\n          <div class=\"card-content white-text\">\n            <span class=\"card-title\">A propos</span>\n            <p> {{ coach.description }}</p>\n          </div>\n        </div>\n        <!-- Profile About  -->\n\n        <!-- Profile About Details  -->\n        <ul id=\"profile-page-about-details\" class=\"collection z-depth-1\">\n          <li class=\"collection-item\">\n            <div class=\"row\">\n              <div class=\"col s5 grey-text darken-1\"><i class=\"mdi-action-wallet-travel\"></i> Project</div>\n              <div class=\"col s7 grey-text text-darken-4 right-align\">ABC Name</div>\n            </div>\n          </li>\n          <li class=\"collection-item\">\n            <div class=\"row\">\n              <div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-poll\"></i> Skills</div>\n              <div class=\"col s7 grey-text text-darken-4 right-align\">HTML, CSS</div>\n            </div>\n          </li>\n          <li class=\"collection-item\">\n            <div class=\"row\">\n              <div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-domain\"></i> Lives in</div>\n              <div class=\"col s7 grey-text text-darken-4 right-align\">NY, USA</div>\n            </div>\n          </li>\n          <li class=\"collection-item\">\n            <div class=\"row\">\n              <div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-cake\"></i> Birth date</div>\n              <div class=\"col s7 grey-text text-darken-4 right-align\">18th June, 1991</div>\n            </div>\n          </li>\n        </ul>\n        <!--/ Profile About Details  -->\n\n        <!-- / Profile About  -->\n\n      </div>\n    </div>\n  </div>\n</div>\n\n\n"

/***/ }),

/***/ 653:
/***/ (function(module, exports) {

module.exports = "<div class=\"header-user\">\n  <div class=\"header-user-filter\">\n    <div class=\"container row\">\n\n      <div class=\"user col-lg-5\">\n        <img src=\"{{(coach | async)?.avatar_url}}\" alt=\"profile image\" class=\"user-img circle responsive-img z-depth-2\">\n        <div class=\"user-info\">\n          <h5>{{(coach | async)?.firstName}} {{(coach | async)?.lastName}}</h5>\n          <h6>{{(coach | async)?.email}}</h6>\n        </div>\n      </div>\n\n      <div class=\"col-sm-12 hide-on-large-only gap\"></div>\n\n      <div class=\"header-stats col-lg-7\">\n        <div class=\"row\">\n          <div class=\"header-item col-sm-3\">\n            <div class=\"header-item-number\"><span>{{(coach | async)?.score}}</span><span class=\"indice\"> / 5</span></div>\n            <p class=\"header-item-title\">Moyenne</p>\n          </div>\n\n          <div class=\"header-item col-sm-3\">\n            <div class=\"header-item-number\"><span>10</span><span class=\"indice\">mois</span></div>\n            <p class=\"header-item-title\">Expérience</p>\n          </div>\n\n          <div class=\"header-item col-sm-3\">\n            <div class=\"header-item-number\"><span>6</span></div>\n            <p class=\"header-item-title\">Séances réalisées</p>\n          </div>\n\n          <div class=\"header-item col-sm-3\">\n            <div class=\"header-item-number\"><span>3</span></div>\n            <p class=\"header-item-title\">Personnes coachées</p>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n</div>\n\n<div class=\"container\">\n  <h4 class=\"text-right italic\">\"{{ (coach | async)?.description }}\"</h4>\n  <br>\n\n  <div *ngIf=\"status === 'visiter' || status === 'admin'\">\n    <div class=\"center\" *ngIf=\"status === 'visiter'\">\n      <button class=\"btn-basic btn-plain btn-blue btn-small center\" (click)=\"goToMeetings()\">Retourner au tableau de bord</button>\n    </div>\n    <div class=\"center\" *ngIf=\"status === 'admin'\">\n      <button class=\"btn-basic btn-plain btn-blue btn-small center\" (click)=\"goToCoachsAdmin()\">Retourner aux coachs</button>\n    </div>\n    <br>\n\n    <!--<form>-->\n    <!--<div class=\"row\">-->\n    <!--<div class=\"col s12\">-->\n    <!--<label for=\"message\">Envoyer un message à {{(coach | async)?.display_name}}</label>-->\n    <!--<textarea name=\"message\" id=\"message\" class=\"message-field\"></textarea>-->\n    <!--</div>-->\n    <!--</div>-->\n    <!--<div class=\"input-field\">-->\n    <!--<button class=\"btn-basic btn-plain btn-blue right\">Envoyer</button>-->\n    <!--</div>-->\n    <!--</form>-->\n  </div>\n\n  <div *ngIf=\"status === 'owner'\">\n    <h4 class=\"black-text\">Mettre à jour votre profil</h4>\n\n    <form [formGroup]=\"formCoach\" (ngSubmit)=\"submitCoachProfilUpdate()\">\n      <div class=\"row\">\n        <div class=\"col-xs-12 col-sm-6\">\n          <label for=\"edit_name\">Prénom</label>\n          <input id=\"edit_name\" type=\"text\" class=\"validate\"\n                 formControlName=\"firstName\"\n                 placeholder=\"Prénom\">\n        </div>\n\n        <div class=\"col-xs-12 col-sm-6\">\n          <label for=\"edit_surname\">Nom</label>\n          <input id=\"edit_surname\" type=\"text\" class=\"validate\"\n                 formControlName=\"lastName\"\n                 placeholder=\"Nom\">\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <label for=\"edit_avatar_url\">Photo de profil</label>\n          <input id=\"edit_avatar_url\" type=\"text\" class=\"validate\"\n                 formControlName=\"avatar\"\n                 placeholder=\"http://...\">\n        </div>\n\n        <div class=\"col-sm-12 center\">\n          <img src=\"{{formCoach.get('avatar').value}}\" alt=\"profile image\" class=\"user-img circle responsive-img z-depth-2\">\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col s12\">\n          <label for=\"edit_description\">Description</label>\n          <textarea id=\"edit_description\" class=\"description-field validate\"\n                    formControlName=\"description\"\n                    placeholder=\"Description...\">\n          </textarea>\n        </div>\n      </div>\n\n      <button type=\"submit\" class=\"btn-basic btn-plain btn-blue btn-small right\" [disabled]=\"!formCoach.valid\">Enregistrer</button>\n    </form>\n  </div>\n\n</div>\n"

/***/ }),

/***/ 654:
/***/ (function(module, exports) {

module.exports = "<div class=\"header-user\">\n  <div class=\"header-user-filter\">\n    <div class=\"container row\">\n\n      <div class=\"user col-lg-5\">\n        <img src=\"{{(coachee | async)?.avatar_url}}\" alt=\"profile image\"\n             class=\"user-img circle responsive-img z-depth-2\">\n        <div class=\"user-info\">\n          <h5>{{(coachee | async)?.firstName}} {{(coachee | async)?.lastName}}</h5>\n          <h6>{{(coachee | async)?.email}}</h6>\n        </div>\n      </div>\n\n      <div class=\"col-sm-12 hide-on-large-only gap\"></div>\n\n      <div class=\"header-stats col-lg-7\">\n        <div class=\"row\">\n          <div class=\"header-item col-sm-6\">\n            <div class=\"header-item-number\"><span>10</span><span class=\"indice\">mois</span></div>\n            <p class=\"header-item-title\">Expérience</p>\n          </div>\n\n          <div class=\"header-item col-sm-6\">\n            <div class=\"header-item-number\"><span>6</span></div>\n            <p class=\"header-item-title\">Séances réalisées</p>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n</div>\n\n<div class=\"container\">\n  <h4 class=\"text-right\"><span class=\"blue-text\">{{(coachee | async)?.plan.sessions_count}}</span> séances par mois</h4>\n  <h5 class=\"text-right italic\" *ngIf=\"(coachee | async)?.last_objective == null\">Aucun objectif personnel défini</h5>\n  <h5 class=\"text-right italic\" *ngIf=\"(coachee | async)?.last_objective != null\">\n    \"{{ (coachee | async)?.last_objective.objective }}\"\n  </h5>\n  <br>\n\n  <div *ngIf=\"status === 'visiter' || status === 'admin'\">\n    <div class=\"center\" *ngIf=\"status === 'visiter'\">\n      <button class=\"btn-basic btn-plain btn-blue btn-small center\" (click)=\"goToMeetings()\">Retourner au tableau de bord</button>\n    </div>\n    <div class=\"center\" *ngIf=\"status === 'admin'\">\n      <button class=\"btn-basic btn-plain btn-blue btn-small center\" (click)=\"goToCoacheesAdmin()\">Retourner aux coachees</button>\n    </div>\n    <br>\n\n    <!--<form>-->\n    <!--<div class=\"row\">-->\n    <!--<div class=\"col s12\">-->\n    <!--<label for=\"message\">Envoyer un message à {{(coach | async)?.display_name}}</label>-->\n    <!--<textarea name=\"message\" id=\"message\" class=\"message-field\"></textarea>-->\n    <!--</div>-->\n    <!--</div>-->\n    <!--<div class=\"input-field\">-->\n    <!--<button class=\"btn-basic btn-plain btn-blue right\">Envoyer</button>-->\n    <!--</div>-->\n    <!--</form>-->\n  </div>\n\n  <div *ngIf=\"status === 'owner'\">\n    <h4 class=\"black-text\">Mettre à jour votre profil</h4>\n\n    <form [formGroup]=\"formCoachee\" (ngSubmit)=\"submitCoacheeProfilUpdate()\">\n      <div class=\"row\">\n        <div class=\"col-xs-12 col-sm-6\">\n          <label for=\"edit_name\">Prénom</label>\n          <input id=\"edit_name\" type=\"text\" class=\"validate\"\n                 formControlName=\"firstName\"\n                 placeholder=\"Prénom\">\n        </div>\n\n        <div class=\"col-xs-12 col-sm-6\">\n          <label for=\"edit_surname\">Nom</label>\n          <input id=\"edit_surname\" type=\"text\" class=\"validate\"\n                 formControlName=\"lastName\"\n                 placeholder=\"Nom\">\n        </div>\n      </div>\n\n      <div class=\"row\">\n        <div class=\"col-sm-12\">\n          <label for=\"edit_avatar_url\">Photo de profil</label>\n          <input id=\"edit_avatar_url\" type=\"text\" class=\"validate\"\n                 formControlName=\"avatar\"\n                 placeholder=\"http://...\">\n        </div>\n\n        <div class=\"col-sm-12 center\">\n          <img src=\"{{formCoachee.get('avatar').value}}\" alt=\"profile image\"\n               class=\"user-img circle responsive-img z-depth-2\">\n        </div>\n      </div>\n\n      <button type=\"submit\" class=\"btn-basic btn-plain btn-blue btn-small right\" [disabled]=\"!formCoachee.valid\">\n        Enregistrer\n      </button>\n    </form>\n  </div>\n\n</div>\n\n\n<!--&lt;!&ndash;<rb-header></rb-header>&ndash;&gt;-->\n<!--&lt;!&ndash;start container&ndash;&gt;-->\n<!--<div class=\"container\">-->\n\n<!--<div id=\"profile-page\" class=\"section\">-->\n<!--&lt;!&ndash; profile-page-header &ndash;&gt;-->\n<!--<div id=\"profile-page-header\" class=\"card\">-->\n<!--<div class=\"card-image waves-effect waves-block waves-light\">-->\n<!--<img class=\"activator\" src=\"images/user-profile-bg.jpg\" alt=\"user background\">-->\n<!--</div>-->\n<!--<figure class=\"card-profile-image\">-->\n<!--<img src=\"{{ ( coachee | async)?.avatar_url}}\" alt=\"profile image\"-->\n<!--class=\"circle z-depth-2 responsive-img activator\">-->\n<!--</figure>-->\n<!--<div class=\"card-content\">-->\n<!--<div class=\"row\">-->\n<!--<div class=\"col s3 offset-s2\">-->\n<!--<h4 class=\"card-title grey-text text-darken-4\">{{ (coachee | async)?.display_name }}</h4>-->\n<!--<p class=\"medium-small grey-text\">Coachee</p>-->\n<!--</div>-->\n<!--<div class=\"col s2 center-align\">-->\n<!--<h4 class=\"card-title grey-text text-darken-4\">10+</h4>-->\n<!--<p class=\"medium-small grey-text\">Work Experience</p>-->\n<!--</div>-->\n<!--<div class=\"col s2 center-align\">-->\n<!--<h4 class=\"card-title grey-text text-darken-4\">6</h4>-->\n<!--<p class=\"medium-small grey-text\">Completed Sessions</p>-->\n<!--</div>-->\n<!--<div class=\"col s2 center-align\">-->\n<!--<h4 class=\"card-title grey-text text-darken-4\">$ 1,253,000</h4>-->\n<!--<p class=\"medium-small grey-text\">Business Profit</p>-->\n<!--</div>-->\n<!--<div class=\"col s1 right-align\">-->\n<!--<a class=\"btn-floating activator waves-effect waves-light darken-2 right\">-->\n<!--<i class=\"mdi-action-perm-identity\"></i>-->\n<!--</a>-->\n<!--</div>-->\n<!--</div>-->\n<!--</div>-->\n<!--<div class=\"card-reveal\">-->\n<!--<p>-->\n<!--<span class=\"card-title grey-text text-darken-4\">{{ (coachee | async)?.display_name }} <i-->\n<!--class=\"mdi-navigation-close right\"></i></span>-->\n<!--<span><i class=\"mdi-action-perm-identity cyan-text text-darken-2\"></i>Coach</span>-->\n<!--</p>-->\n\n<!--<p>Coachee description</p>-->\n\n<!--<p><i class=\"mdi-action-perm-phone-msg cyan-text text-darken-2\"></i> +1 (612) 222 8989</p>-->\n<!--<p><i class=\"mdi-communication-email cyan-text text-darken-2\"></i> {{ (coachee | async)?.email }}</p>-->\n<!--<p><i class=\"mdi-social-cake cyan-text text-darken-2\"></i> Start Date : {{ (coachee | async)?.start_date }}-->\n<!--</p>-->\n<!--<p><i class=\"mdi-device-airplanemode-on cyan-text text-darken-2\"></i> BAR - AUS</p>-->\n<!--<p><i class=\"mdi-social-cake cyan-text text-darken-2\"></i> eritis id : {{ (coachee | async)?.id }}</p>-->\n\n<!--</div>-->\n<!--</div>-->\n<!--&lt;!&ndash;/ profile-page-header &ndash;&gt;-->\n\n<!--&lt;!&ndash; profile-page-content &ndash;&gt;-->\n<!--<div id=\"profile-page-content\" class=\"row\">-->\n<!--&lt;!&ndash; profile-page-sidebar&ndash;&gt;-->\n<!--<div id=\"profile-page-sidebar\" class=\"col s12 m4\">-->\n<!--&lt;!&ndash; Profile About  &ndash;&gt;-->\n<!--<div class=\"card light-blue\">-->\n<!--<div class=\"card-content white-text\">-->\n<!--<span class=\"card-title\">About Me!</span>-->\n<!--<p>Coachee description</p>-->\n\n<!--</div>-->\n<!--</div>-->\n<!--&lt;!&ndash; Profile About  &ndash;&gt;-->\n\n<!--&lt;!&ndash; Profile About Details  &ndash;&gt;-->\n<!--<ul id=\"profile-page-about-details\" class=\"collection z-depth-1\">-->\n<!--<li class=\"collection-item\">-->\n<!--<div class=\"row\">-->\n<!--<div class=\"col s5 grey-text darken-1\"><i class=\"mdi-action-wallet-travel\"></i> Project</div>-->\n<!--<div class=\"col s7 grey-text text-darken-4 right-align\">ABC Name</div>-->\n<!--</div>-->\n<!--</li>-->\n<!--<li class=\"collection-item\">-->\n<!--<div class=\"row\">-->\n<!--<div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-poll\"></i> Skills</div>-->\n<!--<div class=\"col s7 grey-text text-darken-4 right-align\">HTML, CSS</div>-->\n<!--</div>-->\n<!--</li>-->\n<!--<li class=\"collection-item\">-->\n<!--<div class=\"row\">-->\n<!--<div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-domain\"></i> Lives in</div>-->\n<!--<div class=\"col s7 grey-text text-darken-4 right-align\">NY, USA</div>-->\n<!--</div>-->\n<!--</li>-->\n<!--<li class=\"collection-item\">-->\n<!--<div class=\"row\">-->\n<!--<div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-cake\"></i> Birth date</div>-->\n<!--<div class=\"col s7 grey-text text-darken-4 right-align\">18th June, 1991</div>-->\n<!--</div>-->\n<!--</li>-->\n<!--</ul>-->\n<!--&lt;!&ndash;/ Profile About Details  &ndash;&gt;-->\n\n<!--&lt;!&ndash; Profile About  &ndash;&gt;-->\n\n<!--&lt;!&ndash; Profile Edit  &ndash;&gt;-->\n<!--<div class=\"card\">-->\n<!--<div class=\"card-content\">-->\n<!--<span class=\"card-title\">Modifier votre profile</span>-->\n\n<!--<form [formGroup]=\"formCoachee\" (ngSubmit)=\"submitCoacheeProfileUpdate()\">-->\n\n<!--<div class=\"row\">-->\n<!--<div class=\"input-field col s10\">-->\n<!--<input id=\"edit_username\" type=\"text\" formControlName=\"pseudo\" class=\"validate\"-->\n<!--placeholder=\"{{ (coachee | async)?.display_name }}\">-->\n<!--<label for=\"edit_username\">Username</label>-->\n<!--</div>-->\n<!--</div>-->\n\n\n<!--<div class=\"row\">-->\n<!--<div class=\"input-field col s10\">-->\n<!--<textarea id=\"edit_description\" row=\"2\" class=\"materialize-textarea\"-->\n<!--placeholder=\"Décrivez-vous\"></textarea>-->\n<!--<label for=\"edit_description\">Description</label>-->\n<!--</div>-->\n<!--</div>-->\n\n<!--<div class=\"row\">-->\n<!--<div class=\"input-field col s10\">-->\n<!--<input id=\"edit_avatar_url\" type=\"text\" formControlName=\"avatar\"-->\n<!--placeholder=\"{{ (coachee | async)?.avatar_url }}\">-->\n<!--<label for=\"edit_avatar_url\">Avatar url</label>-->\n<!--</div>-->\n<!--</div>-->\n\n<!--<button type=\"submit\" class=\"btn btn-success\" [disabled]=\"!formCoachee.valid\">Mettre à jour</button>-->\n\n<!--</form>-->\n\n<!--</div>-->\n<!--</div>-->\n<!--&lt;!&ndash; / Profile Edit  &ndash;&gt;-->\n<!--</div>-->\n<!--</div>-->\n<!--</div>-->\n<!--</div>-->\n\n\n"

/***/ }),

/***/ 655:
/***/ (function(module, exports) {

module.exports = "<!--<rb-header></rb-header>-->\n<!--start container-->\n<div class=\"container\">\n\n  <div id=\"profile-page\" class=\"section\">\n    <!-- profile-page-header -->\n    <div id=\"profile-page-header\" class=\"card\">\n      <div class=\"card-image waves-effect waves-block waves-light\">\n        <img class=\"activator\" src=\"images/user-profile-bg.jpg\" alt=\"user background\">\n      </div>\n      <figure class=\"card-profile-image\">\n        <img src=\"{{ ( rh | async)?.avatar_url}}\" alt=\"profile image\"\n             class=\"circle z-depth-2 responsive-img activator\">\n      </figure>\n      <div class=\"card-content\">\n        <div class=\"row\">\n          <div class=\"col s3 offset-s2\">\n            <h4 class=\"card-title grey-text text-darken-4\">{{ (rh | async)?.firstName}} {{ (rh | async)?.lastName}}</h4>\n            <p class=\"medium-small grey-text\">Coachee</p>\n          </div>\n          <div class=\"col s2 center-align\">\n            <h4 class=\"card-title grey-text text-darken-4\">10+</h4>\n            <p class=\"medium-small grey-text\">Work Experience</p>\n          </div>\n          <div class=\"col s2 center-align\">\n            <h4 class=\"card-title grey-text text-darken-4\">6</h4>\n            <p class=\"medium-small grey-text\">Completed Sessions</p>\n          </div>\n          <div class=\"col s2 center-align\">\n            <h4 class=\"card-title grey-text text-darken-4\">$ 1,253,000</h4>\n            <p class=\"medium-small grey-text\">Business Profit</p>\n          </div>\n          <div class=\"col s1 right-align\">\n            <a class=\"btn-floating activator waves-effect waves-light darken-2 right\">\n              <i class=\"mdi-action-perm-identity\"></i>\n            </a>\n          </div>\n        </div>\n      </div>\n      <div class=\"card-reveal\">\n        <p>\n            <span class=\"card-title grey-text text-darken-4\">{{ (rh | async)?.firstName}} {{ (rh | async)?.lastName}} <i\n              class=\"mdi-navigation-close right\"></i></span>\n          <span><i class=\"mdi-action-perm-identity cyan-text text-darken-2\"></i>Coach</span>\n        </p>\n\n        <p>Coachee description</p>\n\n        <p><i class=\"mdi-action-perm-phone-msg cyan-text text-darken-2\"></i> +1 (612) 222 8989</p>\n        <p><i class=\"mdi-communication-email cyan-text text-darken-2\"></i> {{ (rh | async)?.email }}</p>\n        <p><i class=\"mdi-social-cake cyan-text text-darken-2\"></i> Start Date : {{ (rh | async)?.start_date }}\n        </p>\n        <p><i class=\"mdi-device-airplanemode-on cyan-text text-darken-2\"></i> BAR - AUS</p>\n        <p><i class=\"mdi-social-cake cyan-text text-darken-2\"></i> eritis id : {{ (rh | async)?.id }}</p>\n\n      </div>\n    </div>\n    <!--/ profile-page-header -->\n\n    <!-- profile-page-content -->\n    <div id=\"profile-page-content\" class=\"row\">\n      <!-- profile-page-sidebar-->\n      <div id=\"profile-page-sidebar\" class=\"col s12 m4\">\n        <!-- Profile About  -->\n        <div class=\"card light-blue\">\n          <div class=\"card-content white-text\">\n            <span class=\"card-title\">About Me!</span>\n            <p>Coachee description</p>\n\n          </div>\n        </div>\n        <!-- Profile About  -->\n\n        <!-- Profile About Details  -->\n        <ul id=\"profile-page-about-details\" class=\"collection z-depth-1\">\n          <li class=\"collection-item\">\n            <div class=\"row\">\n              <div class=\"col s5 grey-text darken-1\"><i class=\"mdi-action-wallet-travel\"></i> Project</div>\n              <div class=\"col s7 grey-text text-darken-4 right-align\">ABC Name</div>\n            </div>\n          </li>\n          <li class=\"collection-item\">\n            <div class=\"row\">\n              <div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-poll\"></i> Skills</div>\n              <div class=\"col s7 grey-text text-darken-4 right-align\">HTML, CSS</div>\n            </div>\n          </li>\n          <li class=\"collection-item\">\n            <div class=\"row\">\n              <div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-domain\"></i> Lives in</div>\n              <div class=\"col s7 grey-text text-darken-4 right-align\">NY, USA</div>\n            </div>\n          </li>\n          <li class=\"collection-item\">\n            <div class=\"row\">\n              <div class=\"col s5 grey-text darken-1\"><i class=\"mdi-social-cake\"></i> Birth date</div>\n              <div class=\"col s7 grey-text text-darken-4 right-align\">18th June, 1991</div>\n            </div>\n          </li>\n        </ul>\n        <!--/ Profile About Details  -->\n\n        <!-- Profile About  -->\n\n        <!-- Profile Edit  -->\n        <div class=\"card\">\n          <div class=\"card-content\">\n            <span class=\"card-title\">Modifier votre profile</span>\n\n            <form [formGroup]=\"formRh\" (ngSubmit)=\"submitRhProfileUpdate()\">\n\n              <div class=\"row\">\n                <div class=\"input-field col s10\">\n                  <input id=\"edit_firstName\" type=\"text\" formControlName=\"firstName\" class=\"validate\"\n                         placeholder=\"{{ (rh | async)?.display_name }}\">\n                  <label for=\"edit_firstName\">Prénom</label>\n                </div>\n              </div>\n\n              <div class=\"row\">\n                <div class=\"input-field col s10\">\n                  <input id=\"edit_lastName\" type=\"text\" formControlName=\"lastName\" class=\"validate\"\n                         placeholder=\"{{ (rh | async)?.display_name }}\">\n                  <label for=\"edit_lastName\">Nom</label>\n                </div>\n              </div>\n\n\n              <div class=\"row\">\n                <div class=\"input-field col s10\">\n                    <textarea id=\"edit_description\" row=\"2\" class=\"materialize-textarea\"\n                              placeholder=\"Décrivez-vous\"></textarea>\n                  <label for=\"edit_description\">Description</label>\n                </div>\n              </div>\n\n              <div class=\"row\">\n                <div class=\"input-field col s10\">\n                  <input id=\"edit_avatar_url\" type=\"text\" formControlName=\"avatar\"\n                         placeholder=\"{{ (rh | async)?.avatar_url }}\">\n                  <label for=\"edit_avatar_url\">Avatar url</label>\n                </div>\n              </div>\n\n              <button type=\"submit\" class=\"btn btn-success\" [disabled]=\"!formRh.valid\">Mettre à jour</button>\n\n            </form>\n\n          </div>\n        </div>\n        <!-- / Profile Edit  -->\n      </div>\n    </div>\n  </div>\n</div>\n\n\n"

/***/ }),

/***/ 656:
/***/ (function(module, exports) {

module.exports = "<div class=\"meeting-item col-lg-12\">\n\n  <div class=\"preloader-wrapper active\" *ngIf=\"loading\">\n    <div class=\"spinner-layer spinner-blue-only\">\n      <div class=\"circle-clipper left\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"gap-patch\">\n        <div class=\"circle\"></div>\n      </div>\n      <div class=\"circle-clipper right\">\n        <div class=\"circle\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div *ngIf=\"!loading\">\n\n    <!-- RH -->\n    <div class=\"row\">\n      <div class=\"meeting-item-header col-md-12 col-lg-4\">\n        <div>\n          <div class=\"meeting-item-coach\">\n            <div>\n              <!-- image rh -->\n              <img class=\"meeting-item-coach-avatar circle img-responsive\" alt=\"coach\" [src]=\"rh.avatar_url\">\n            </div>\n\n            <div>\n              <p class=\"meeting-item-coach-name black-text bold\">{{ rh.firstName}} {{ rh.lastName}}</p>\n              <p class=\"italic\">{{ rh.email }}</p>\n            </div>\n          </div>\n\n          <!-- PLAN -->\n          <!--<div class=\"meeting-item-date\">-->\n          <!--<span class=\"meeting-item-date-date\"><span class=\"blue-text\">{{ coach.plan.sessions_count }}</span> séances</span>-->\n          <!--</div>-->\n\n        </div>\n      </div>\n\n      <!-- GOAL -->\n      <div class=\"meeting-item-body col-md-12 col-lg-8\">\n        <div class=\"meeting-item-body-content\">\n          <span>Inscrit le {{ printDateString(rh.start_date) }}</span>\n        </div>\n      </div><!--end meeting-item-body-->\n\n    </div><!--end coach-->\n\n  </div><!--end row-->\n\n</div><!--end meeting-item-->\n"

/***/ }),

/***/ 657:
/***/ (function(module, exports) {

module.exports = "<main>\n\n  <div class=\"bg-top-image\"></div>\n  <div class=\"bg-top-filter\"></div>\n\n  <header class=\"section\">\n    <!--<div class=\"navbar\">-->\n      <!--<nav>-->\n        <!--<div class=\"navbar-color\">-->\n          <!--<div class=\"col s12\">-->\n            <!--<a [routerLink]=\"['/']\" class=\"logo-text\"><img src=\"assets/img/logo-eritis-new.png\" alt=\"Eritis\"></a>-->\n          <!--</div>-->\n        <!--</div>&lt;!&ndash;end navbar-color&ndash;&gt;-->\n      <!--</nav>-->\n    <!--</div>&lt;!&ndash;end navbar&ndash;&gt;-->\n\n    <!--<div class=\"container\">-->\n      <!--<h1 class=\"header-title\">Atteignez vos objectifs</h1>-->\n      <!--<h3 class=\"header-subtitle\">Séances de coaching individuel avec un coach certifié</h3>-->\n\n      <!--<div class=\"row\">-->\n        <!--<div class=\"header-btn col-xs-12 col-sm-6\">-->\n          <!--<a pageScroll href=\"#coach_section\" class=\"btn-basic\">En savoir plus</a>-->\n        <!--</div>-->\n        <!--<div class=\"header-btn col-xs-12 col-sm-6\">-->\n          <!--<button class=\"btn-basic btn-plain btn-connexion\" (click)=\"activateLogin()\"><i class=\"material-icons\">perm_identity</i>-->\n            <!--Connexion-->\n          <!--</button>-->\n        <!--</div>-->\n      <!--</div>-->\n\n      <!--<rb-signin *ngIf=\"loginActivated\"></rb-signin>-->\n\n      <!--<a pageScroll href=\"#presentation\" class=\"header-arrow-bottom\"><i class=\"fa fa-angle-down\" aria-hidden=\"true\"></i></a>-->\n\n    <!--</div>-->\n  </header> <!--end header-->\n\n  <div class=\"content\">\n\n    <section id=\"presentation\" class=\"section\">\n      <div class=\"container\">\n        <h2 class=\"text-center section_title presentation_title\">Construisez le coaching qui correspond à vos\n          besoins</h2>\n        <div class=\"row\">\n          <div class=\"col-sm-12 col-lg-4\">\n            <div class=\"presentation_item text-center\">\n              <img src=\"assets/img/todos.svg\" class=\"desc_icon\"/>\n              <h3 class=\"presentation_item_title\">Définissez votre besoin​</h3>\n              <p class=\"presentation_item_text\">Utilisez l'outil de réservation et organisez votre séance de\n                coaching.</p>\n            </div>\n          </div>\n\n          <div class=\"col-sm-12 col-lg-4\">\n            <div class=\"presentation_item text-center\">\n              <img src=\"assets/img/confirm-user.svg\" class=\"desc_icon\"/>\n              <h3 class=\"presentation_item_title\">Trouvez votre coach</h3>\n              <p class=\"presentation_item_text\">Connectez-vous sur votre plateforme pour votre séance de 45 min.</p>\n            </div>\n          </div>\n\n          <div class=\"col-sm-12 col-lg-4\">\n            <div class=\"presentation_item text-center\">\n              <img src=\"assets/img/presentation.svg\" class=\"desc_icon\"/>\n              <h3 class=\"presentation_item_title\">Suivez votre progression</h3>\n              <p class=\"presentation_item_text\">Chaque séance se conclut par un compte rendu avec un plan d'action.</p>\n            </div>\n          </div>\n        </div> <!--end row-->\n      </div> <!--end container-->\n    </section> <!--end section-->\n\n\n    <section id=\"coach_section\" class=\"section\">\n      <div class=\"container\">\n        <h2 class=\"text-center section_title coach_section_title\">Conçu par une équipe de coachs certifiés</h2>\n        <h5 class=\"text-center coach_section_subtitle\">\n          Notre équipe de coachs expérimentés constitue un label de qualité\n          sans équivalent sur le marché du coaching professionnel.\n        </h5>\n\n        <div class=\"small-line-container\">\n          <div class=\"small-line\"></div>\n        </div>\n\n        <div class=\"row\">\n          <div class=\"col-sm-12 col-lg-4 coach_description\">\n            <img class=\"coach_img\"\n                 src=\"https://static.wixstatic.com/media/04261a_d639816d3928429d8a34a774be2c77c2~mv2.png/v1/fill/w_298,h_298,al_c,usm_0.66_1.00_0.01/04261a_d639816d3928429d8a34a774be2c77c2~mv2.png\">\n            <h4>Etienne Roy</h4>\n            <p>\n              20 ans d'expérience en accompagnement d'équipes, de cadres dirigeants et d'organisation\n              dans des phases de changement.\n            </p>\n          </div>\n\n          <div class=\"col-sm-12 col-lg-4 coach_description\">\n            <img class=\"coach_img\"\n                 src=\"https://static.wixstatic.com/media/04261a_992204f8b935467e90154abc73a30105~mv2.png/v1/fill/w_298,h_298,al_c,lg_1/04261a_992204f8b935467e90154abc73a30105~mv2.png\">\n            <h4>Elaine Lecoeur</h4>\n            <p>\n              Canadienne, installée en France depuis 1995 et forte de 20 ans d'expérience\n              en entreprise, c'est sur ce terrain que j'avance avec vous pour construire les\n              environnements apprenants adaptés à ces nouveaux enjeux.\n            </p>\n          </div>\n\n          <div class=\"col-xs-12 col-lg-4 coach_description\">\n            <img class=\"coach_img\"\n                 src=\"https://static.wixstatic.com/media/04261a_c405cc6001b041b997493ad886d4781b~mv2.png/v1/fill/w_298,h_298,al_c,lg_1/04261a_c405cc6001b041b997493ad886d4781b~mv2.png\">\n            <h4>Annette Leclerc Vanel</h4>\n            <p>\n              Directrice d'agences opérationnelles et directrice de secteur dans les métiers\n              des services pendant 20 ans, Annette est coach depuis 18 ans.\n            </p>\n          </div>\n        </div><!--end row-->\n\n        <a pageScroll href=\"#contact\" class=\"btn-basic\">Contactez-nous</a>\n\n      </div><!--end container-->\n    </section><!--end section-->\n\n  </div><!--end content-->\n\n\n  <footer class=\"footer section\" id=\"contact\">\n    <div class=\"container\">\n      <div class=\"row\">\n        <div class=\"col-sm-12 col-lg-5\">\n          <div class=\"address\">\n            <h4>Eritis</h4>\n            <p>\n              78 Avenue de Saint-Mandé\n              <br>75012 Paris, France\n            </p>\n          </div>\n        </div>\n        <div class=\"col-sm-12 col-lg-7\">\n          <form [formGroup]=\"contactForm\" (ngSubmit)=\"onContactSubmit()\">\n            <div class=\"input_field\">\n              <label for=\"name\">Nom</label>\n              <input type=\"text\" name=\"name\" id=\"name\" formControlName=\"name\" placeholder=\"Nom\">\n            </div>\n            <br>\n            <div class=\"input_field\">\n              <label for=\"mail\">Adresse Mail</label>\n              <input type=\"text\" name=\"mail\" id=\"mail\" formControlName=\"mail\" placeholder=\"exemple@mail.com\">\n            </div>\n            <br>\n            <div class=\"input_field\">\n              <label for=\"message\">Message</label>\n              <textarea name=\"message\" class=\"materialize-textarea\" id=\"message\" formControlName=\"message\" placeholder=\"Message...\"></textarea>\n            </div>\n            <div class=\"input_field text-right\">\n              <button type=\"submit\" name=\"submit\" class=\"btn-basic btn-small btn-submit\" [disabled]=\"!contactForm.valid\">Envoyer\n              </button>\n            </div>\n          </form>\n\n        </div>\n      </div><!--end row-->\n    </div><!--end container-->\n  </footer>\n\n\n</main>\n\n<script type=\"text/javascript\">\n  $('.navbar-fixed').hide();\n</script>\n"

/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "eritis-mountain-bg-2.cbc21344ba5faf2ce1c2.jpg";

/***/ }),

/***/ 85:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__environments_environment__ = __webpack_require__(61);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FirebaseService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FirebaseService = (function () {
    function FirebaseService() {
        console.log("FirebaseService ctr");
    }
    FirebaseService.prototype.init = function () {
        console.log("AppComponent init");
        // Initialize Firebase
        var config = {
            apiKey: __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].firebase_apiKey,
            authDomain: __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].firebase_authDomain,
            databaseURL: __WEBPACK_IMPORTED_MODULE_1__environments_environment__["a" /* environment */].firebase_databaseURL,
        };
        console.log("AppComponent init config", config);
        firebase.initializeApp(config);
    };
    FirebaseService.prototype.getInstance = function () {
        return firebase;
    };
    FirebaseService.prototype.auth = function () {
        return firebase.auth();
    };
    return FirebaseService;
}());
FirebaseService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [])
], FirebaseService);

//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/firebase.service.js.map

/***/ }),

/***/ 916:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(341);


/***/ })

},[916]);
//# sourceMappingURL=main.bundle.js.map