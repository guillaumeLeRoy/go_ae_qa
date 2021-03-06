var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { PromiseObservable } from "rxjs/observable/PromiseObservable";
import { Headers, Http } from "@angular/http";
import { environment } from "../../environments/environment";
import { FirebaseService } from "./firebase.service";
import { Coach } from "../model/Coach";
import { Coachee } from "../model/Coachee";
import { HR } from "../model/HR";
import { PotentialCoachee } from "../model/PotentialCoachee";
import { PotentialRh } from "../model/PotentialRh";
import { SessionService } from "./session.service";
var AuthService = (function () {
    function AuthService(firebase, router, httpService, sessionService) {
        this.firebase = firebase;
        this.router = router;
        this.httpService = httpService;
        this.sessionService = sessionService;
        this.onAuthStateChangedCalled = false;
        // private user: User
        this.isUserAuth = new BehaviorSubject(false); //NOT auth by default
        this.ApiUserSubject = new BehaviorSubject(null); //NOT auth by default
        // private ApiUserSubject = new Subject<ApiUser>();//NOT auth by default
        /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
        this.isSignInOrUp = false;
        this.ApiUser = null;
        firebase.auth().onAuthStateChanged(function (user) {
            console.log("onAuthStateChanged, user : " + user);
            this.onAuthStateChangedCalled = true;
            this.updateAuthStatus(user);
        }.bind(this));
        console.log("ctr done");
        console.log("ctr done");
        // let date = (new Date());
        // date.setHours(date.getHours() + 1);
        // console.log('COOKIE', date);
        // if (this.cookieService.get('ACTIVE_SESSION') === undefined)
        //   if (this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
        //     this.cookieService.put('ACTIVE_SESSION', 'true', {expires: date.toDateString()});
    }
    AuthService_1 = AuthService;
    /*
     * Get connected user from backend
     */
    AuthService.prototype.refreshConnectedUser = function () {
        console.log("refreshConnectedUser");
        var obs = this.refreshConnectedUserAsObservable();
        if (obs != null) {
            obs.subscribe();
        }
    };
    /*
     * Get connected user from backend
     */
    AuthService.prototype.refreshConnectedUserAsObservable = function () {
        console.log("refreshConnectedUser");
        if (this.ApiUser != null) {
            if (this.ApiUser instanceof Coach) {
                return this.fetchCoach(this.ApiUser.id);
            }
            else if (this.ApiUser instanceof Coachee) {
                return this.fetchCoachee(this.ApiUser.id);
            }
            else if (this.ApiUser instanceof HR) {
                return this.fetchRh(this.ApiUser.id);
            }
        }
        else {
            console.log("refreshConnectedUser, no connected user");
        }
        return null;
    };
    AuthService.prototype.fetchCoach = function (userId) {
        var _this = this;
        var param = [userId];
        var obs = this.get(AuthService_1.GET_COACH_FOR_ID, param);
        return obs.map(function (res) {
            console.log("fetchCoach, obtained from API : ", res);
            var coach = Coach.parseCoach(res.json());
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
            var coachee = Coachee.parseCoachee(res.json());
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
            var rh = HR.parseRh(res.json());
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
    /*
     *
     * define POST methods
     * */
    AuthService.prototype.post = function (path, params, body, options, isAdmin) {
        var _this = this;
        if (isAdmin) {
            return this.internal_post(path, params, body, options, true);
        }
        else {
            return this.getConnectedApiUser().flatMap(function (firebaseUser) {
                return _this.getHeader(firebaseUser).flatMap(function (headers) {
                    //todo to change
                    if (options != undefined) {
                        for (var _i = 0, _a = options.headers.keys(); _i < _a.length; _i++) {
                            var headerKey = _a[_i];
                            headers.append(headerKey, options.headers.get(headerKey));
                        }
                    }
                    return _this.internal_post(path, params, body, { headers: headers });
                });
            });
        }
    };
    AuthService.prototype.postNotAuth = function (path, params, body) {
        return this.internal_post(path, params, body);
    };
    AuthService.prototype.internal_post = function (path, params, body, options, isAdmin) {
        return this.httpService.post(this.generatePath(path, params, isAdmin), body, options);
    };
    /*
     *
     * define PUT
     * */
    AuthService.prototype.put = function (path, params, body, options, isAdmin) {
        var _this = this;
        if (isAdmin) {
            return this.internal_put(path, params, body, options, true);
        }
        else {
            return this.getConnectedApiUser().flatMap(function (firebaseUser) {
                return _this.getHeader(firebaseUser).flatMap(function (headers) {
                    // add params headers to received ones
                    if (options != null) {
                        for (var _i = 0, _a = headers.keys(); _i < _a.length; _i++) {
                            var headerKey = _a[_i];
                            options.headers.append(headerKey, headers.get(headerKey));
                        }
                    }
                    else {
                        options = { headers: headers };
                    }
                    // for (let headerKey of options.headers.keys()) {
                    //   headers.append(headerKey, options.headers.get(headerKey));
                    // }
                    // return this.httpService.put(this.generatePath(path, params), body, {headers: headers})
                    return _this.internal_put(path, params, body, options);
                });
            });
        }
    };
    AuthService.prototype.putNotAuth = function (path, params, body, options) {
        // let headers = new Headers();
        // if (options != null)
        //   for (let headerKey of options.headers.keys()) {
        //     headers.append(headerKey, options.headers.get(headerKey));
        //   }
        // return this.httpService.put(this.generatePath(path, params), body, {headers: headers})
        return this.internal_put(path, params, body, options);
    };
    AuthService.prototype.internal_put = function (path, params, body, options, isAdmin) {
        // let headers = new Headers();
        // if (options != null)
        //   for (let headerKey of options.headers.keys()) {
        //     headers.append(headerKey, options.headers.get(headerKey));
        //   }
        return this.httpService.put(this.generatePath(path, params, isAdmin), body, options);
    };
    /*
     *
     * define GET
     * */
    AuthService.prototype.get = function (path, params, isAdmin) {
        return this.getWithSearchParams(path, params, null, isAdmin);
    };
    AuthService.prototype.getWithSearchParams = function (path, params, searchParams, isAdmin) {
        var _this = this;
        if (isAdmin) {
            return this.internal_get(path, params, { search: searchParams }, true);
        }
        else {
            return this.getConnectedApiUser().flatMap(function (firebaseUser) {
                return _this.getHeader(firebaseUser).flatMap(function (headers) {
                    return _this.internal_get(path, params, { headers: headers, search: searchParams });
                });
            });
        }
    };
    AuthService.prototype.getNotAuth = function (path, params) {
        return this.internal_get(path, params).map(function (res) {
            return res;
        }, function (error) {
            console.log("getNotAuth, error", error);
        });
    };
    AuthService.prototype.internal_get = function (path, params, options, isAdmin) {
        return this.httpService.get(this.generatePath(path, params, isAdmin), options);
    };
    /*
     *
     * define DELETE
     * */
    AuthService.prototype.delete = function (path, params, isAdmin) {
        var _this = this;
        var method = this.getConnectedApiUser().flatMap(function (firebaseUser) {
            return _this.getHeader(firebaseUser).flatMap(function (headers) {
                console.log("4. start request");
                return _this.httpService.delete(_this.generatePath(path, params, isAdmin), { headers: headers });
            });
        });
        return method;
    };
    /*
     *
     * OPEN api
     * */
    AuthService.prototype.getPotentialCoachee = function (path, params) {
        return this.httpService.get(this.generatePath(path, params)).map(function (res) {
            return PotentialCoachee.parsePotentialCoachee(res.json());
        });
    };
    AuthService.prototype.getPotentialRh = function (path, params) {
        return this.httpService.get(this.generatePath(path, params)).map(function (res) {
            return PotentialRh.parsePotentialRh(res.json());
        });
    };
    AuthService.prototype.getConnectedApiUser = function () {
        console.log("2. getConnectedApiUser");
        if (this.ApiUser) {
            console.log("getConnectedApiUser, user OK");
            return Observable.of(this.ApiUser);
        }
        else {
            console.log("getConnectedApiUser, NO user");
            //check if onAuthStateChanged was called
            if (this.onAuthStateChangedCalled) {
                console.log("getConnectedApiUser, user state changed already call");
                //now we know we really don't have a user
                return Observable.throw('No current user');
            }
            else {
                console.log("getConnectedApiUser, wait for change state");
                return this.ApiUserSubject.asObservable();
                // .map(
                //   (apiUser: ApiUser) => {
                //     if (apiUser) {
                //       console.log("getConnectedApiUser, got event, with user");
                //       return apiUser;
                //     } else {
                //       console.log("getConnectedApiUser, got event, no user after state change");
                //       return Observable.throw('No user after state changed');
                //     }
                //   }
                // );
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
                var headers = new Headers();
                headers.append('Authorization', 'Bearer ' + token);
                return Observable.of(headers);
            }
            else {
                return Observable.throw('No token');
            }
        }
        else {
            console.log("getHeader, NO user");
            return Observable.throw('No current user');
        }
    };
    AuthService.prototype.generatePath = function (path, params, isAdmin) {
        // console.log("generatePath, path : ", path);
        // console.log("generatePath, params : ", params);
        var completedPath = "";
        //add a "admin" if necessary
        if (isAdmin) {
            completedPath += "/admins";
        }
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
        var finalUrl = environment.BACKEND_BASE_URL + completedPath;
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
                var firebaseObs = PromiseObservable.create(fbUser.getToken());
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
        var headers = new Headers();
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
        var firebaseObs = PromiseObservable.create(firebasePromise);
        return firebaseObs.flatMap(function (token) {
            //user should be ok just after a sign up
            var fbUser = _this.firebase.auth().currentUser;
            var body = {
                email: fbUser.email,
                uid: fbUser.uid,
                plan_id: user.contractPlanId
            };
            var params = [fbUser.uid];
            var headers = new Headers();
            headers.append('Authorization', 'Bearer ' + token);
            // start sign up request
            return _this.internal_post(path, params, body, { headers: headers })
                .map(function (response) {
                var loginResponse = response.json();
                console.log("signUp, loginResponse : ", loginResponse);
                _this.sessionService.saveSessionTTL();
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
            return Coach.parseCoach(coach);
        }
        else if (response.coachee) {
            var coachee = response.coachee;
            //coachee
            return Coachee.parseCoachee(coachee);
        }
        else if (response.rh) {
            var rh = response.rh;
            return HR.parseRh(rh);
        }
        return null;
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
        var firebaseObs = PromiseObservable.create(firebasePromise);
        return firebaseObs.flatMap(function (token) {
            //user should be ok just after a sign up
            var fbUser = _this.firebase.auth().currentUser;
            _this.sessionService.saveSessionTTL();
            //now sign up in AppEngine
            _this.isSignInOrUp = false;
            return _this.getUserForFirebaseId(fbUser.uid, token);
        });
    };
    AuthService.prototype.loginOut = function () {
        console.log("user loginOut");
        this.firebase.auth().signOut();
        this.updateAuthStatus(null);
        this.sessionService.clearSession();
        this.router.navigate(['/']);
        Materialize.toast('Vous avez été déconnecté', 3000, 'rounded');
    };
    AuthService.prototype.updateCoacheeForId = function (id, first_name, last_name, avatarUrl) {
        console.log("updateCoacheeForId, id", id);
        var body = {
            first_name: first_name,
            last_name: last_name,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_COACHEE, params, body).map(function (response) {
            return Coachee.parseCoachee(response.json());
        });
    };
    AuthService.prototype.updateCoachForId = function (id, firstName, lastName, description, avatarUrl) {
        console.log("updateCoachForId, id", id);
        var body = {
            first_name: firstName,
            last_name: lastName,
            description: description,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_COACH, params, body).map(function (response) {
            //convert to coach
            return Coach.parseCoach(response.json());
        });
    };
    AuthService.prototype.updateRhForId = function (id, firstName, lastName, description, avatarUrl) {
        console.log("updateRhForId, id", id);
        var body = {
            first_name: firstName,
            last_name: lastName,
            description: description,
            avatar_url: avatarUrl,
        };
        var params = [id];
        return this.put(AuthService_1.UPDATE_RH, params, body).map(function (response) {
            //convert to HR
            return HR.parseRh(response.json());
        });
    };
    /* contract plan*/
    AuthService.GET_CONTRACT_PLANS = "/v1/plans/";
    AuthService.LOGIN = "/v1/login/:firebaseId";
    AuthService.POST_POTENTIAL_COACHEE = "/v1/potentials/coachees";
    AuthService.POST_POTENTIAL_COACH = "/v1/potentials/coachs";
    AuthService.POST_POTENTIAL_RH = "/v1/potentials/rhs";
    AuthService.GET_POTENTIAL_COACHEE_FOR_TOKEN = "/v1/potentials/coachees/:token";
    AuthService.GET_POTENTIAL_COACH_FOR_TOKEN = "/v1/potentials/coachs/:token";
    AuthService.GET_POTENTIAL_RH_FOR_TOKEN = "/v1/potentials/rhs/:token";
    /* Possible coach */
    AuthService.UPDATE_POSSIBLE_COACH = "/v1/possible_coachs";
    AuthService.UPDATE_POSSIBLE_COACH_PICTURE = "/v1/possible_coachs/profile_picture";
    AuthService.UPDATE_POSSIBLE_COACH_INSURANCE_DOC = "/v1/possible_coachs/insurance";
    /* coachee */
    AuthService.UPDATE_COACHEE = "/v1/coachees/:id";
    AuthService.POST_SIGN_UP_COACHEE = "/v1/coachees";
    AuthService.GET_COACHEES = "/v1/coachees";
    AuthService.GET_COACHEE_FOR_ID = "/v1/coachees/:id";
    AuthService.GET_COACHEE_NOTIFICATIONS = "/v1/coachees/:id/notifications";
    AuthService.PUT_COACHEE_NOTIFICATIONS_READ = "/v1/coachees/:id/notifications/read";
    AuthService.PUT_COACHEE_PROFILE_PICT = "/v1/coachees/:id/profile_picture";
    /* coach */
    AuthService.UPDATE_COACH = "/v1/coachs/:id";
    AuthService.POST_SIGN_UP_COACH = "/v1/coachs";
    AuthService.GET_COACHS = "/v1/coachs";
    AuthService.GET_COACH_FOR_ID = "/v1/coachs/:id";
    AuthService.GET_COACH_NOTIFICATIONS = "/v1/coachs/:id/notifications";
    AuthService.PUT_COACH_NOTIFICATIONS_READ = "/v1/coachs/:id/notifications/read";
    AuthService.PUT_COACH_PROFILE_PICT = "/v1/coachs/:id/profile_picture";
    /* HR */
    AuthService.GET_RHS = "/v1/rhs";
    AuthService.UPDATE_RH = "/v1/rhs/:id";
    AuthService.POST_SIGN_UP_RH = "/v1/rhs";
    AuthService.GET_COACHEES_FOR_RH = "/v1/rhs/:uid/coachees";
    AuthService.GET_POTENTIAL_COACHEES_FOR_RH = "/v1/rhs/:uid/potentials";
    AuthService.GET_RH_FOR_ID = "/v1/rhs/:id";
    AuthService.GET_USAGE_RATE_FOR_RH = "/v1/rhs/:id/usage";
    AuthService.GET_RH_NOTIFICATIONS = "/v1/rhs/:id/notifications";
    AuthService.PUT_RH_NOTIFICATIONS_READ = "/v1/rhs/:id/notifications/read";
    AuthService.POST_COACHEE_OBJECTIVE = "/v1/rhs/:uidRH/coachees/:uidCoachee/objective"; //create new objective for this coachee
    AuthService.PUT_RH_PROFILE_PICT = "/v1/rhs/:id/profile_picture";
    /* admin */
    AuthService.GET_ADMIN = "/v1/user";
    AuthService.ADMIN_GET_POSSIBLE_COACHS = "/v1/possible_coachs";
    AuthService.ADMIN_GET_POSSIBLE_COACH = "/v1/possible_coachs/:id";
    /* Meeting */
    AuthService.POST_MEETING = "/v1/meetings";
    AuthService.PUT_MEETING = "/v1/meetings/:meetingId";
    AuthService.DELETE_MEETING = "/v1/meetings/:meetingId";
    AuthService.GET_MEETING_REVIEWS = "/v1/meetings/:meetingId/reviews";
    AuthService.PUT_MEETING_REVIEW = "/v1/meetings/:meetingId/reviews"; //add or replace meeting review
    AuthService.CLOSE_MEETING = "/v1/meetings/:meetingId/close"; // close meeting
    AuthService.GET_MEETINGS_FOR_COACHEE_ID = "/v1/meetings/coachees/:coacheeId";
    AuthService.GET_MEETINGS_FOR_COACH_ID = "/v1/meetings/coachs/:coachId";
    AuthService.POST_MEETING_POTENTIAL_DATE = "/v1/meetings/:meetingId/potentials";
    AuthService.GET_MEETING_POTENTIAL_DATES = "/v1/meetings/:meetingId/potentials";
    AuthService.PUT_FINAL_DATE_TO_MEETING = "/v1/meetings/:meetingId/dates/:potentialId"; //set the potential date as the meeting selected date
    AuthService.GET_AVAILABLE_MEETINGS = "/v1/meetings"; //get available meetings ( meetings with NO coach associated )
    AuthService.PUT_COACH_TO_MEETING = "/v1/meetings/:meetingId/coachs/:coachId"; //associate coach with meeting
    AuthService = AuthService_1 = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [FirebaseService, Router, Http, SessionService])
    ], AuthService);
    return AuthService;
    var AuthService_1;
}());
export { AuthService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/auth.service.js.map