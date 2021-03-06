var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { Coach } from "../../../model/Coach";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Observable";
var ProfileHeaderComponent = (function () {
    function ProfileHeaderComponent(location) {
        this.location = location;
    }
    ProfileHeaderComponent.prototype.ngOnInit = function () {
    };
    ProfileHeaderComponent.prototype.goBack = function () {
        this.location.back();
    };
    ProfileHeaderComponent.prototype.isCoach = function (user) {
        return user instanceof Coach;
    };
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], ProfileHeaderComponent.prototype, "user", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], ProfileHeaderComponent.prototype, "isOwner", void 0);
    ProfileHeaderComponent = __decorate([
        Component({
            selector: 'er-profile-header',
            templateUrl: './profile-header.component.html',
            styleUrls: ['./profile-header.component.scss']
        }),
        __metadata("design:paramtypes", [Location])
    ], ProfileHeaderComponent);
    return ProfileHeaderComponent;
}());
export { ProfileHeaderComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/profile-header/profile-header.component.js.map