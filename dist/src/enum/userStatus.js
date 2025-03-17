"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivityStatus = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["REGISTERED"] = "REGISTERED";
    UserStatus["PENDING"] = "PENDING";
    UserStatus["REJECTED"] = "REJECTED";
    UserStatus["APPROVED"] = "APPROVED";
    UserStatus["SUSPENDED"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserActivityStatus;
(function (UserActivityStatus) {
    UserActivityStatus["ACTIVE"] = "ACTIVE";
    UserActivityStatus["DELETED"] = "DELETED";
    UserActivityStatus["ALL"] = "ALL";
})(UserActivityStatus || (exports.UserActivityStatus = UserActivityStatus = {}));
