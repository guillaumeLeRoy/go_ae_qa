var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { CoachCoacheeService } from "../../service/coach_coachee.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var AdminCoachsListComponent = (function () {
    function AdminCoachsListComponent(apiService) {
        this.apiService = apiService;
        this.loading = true;
        this.coachs = new BehaviorSubject(null);
    }
    AdminCoachsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
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
        this.loading = true;
        this.getAllCoachsSub = this.apiService.getAllCoachs(true).subscribe(function (coachs) {
            console.log('getAllCoachs subscribe, coachs : ', coachs);
            _this.loading = false;
            _this.coachs.next(coachs);
        });
    };
    AdminCoachsListComponent = __decorate([
        Component({
            selector: 'er-admin-coachs-list',
            templateUrl: './admin-coachs-list.component.html',
            styleUrls: ['./admin-coachs-list.component.scss'],
        }),
        __metadata("design:paramtypes", [CoachCoacheeService])
    ], AdminCoachsListComponent);
    return AdminCoachsListComponent;
}());
export { AdminCoachsListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/coachs-list/admin-coachs-list.component.js.map