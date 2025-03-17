"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waslRegistrationStatus = exports.WaslResultCode = void 0;
var WaslResultCode;
(function (WaslResultCode) {
    WaslResultCode["SUCCESS"] = "success";
    WaslResultCode["BAD_REQUEST"] = "bad_request";
    WaslResultCode["DRIVER_VEHICLE_DUPLICATE"] = "DRIVER_VEHICLE_DUPLICATE";
    WaslResultCode["DRIVER_NOT_ALLOWED"] = "DRIVER_NOT_ALLOWED";
    WaslResultCode["DRIVER_NOT_FOUND"] = "DRIVER_NOT_FOUND";
    WaslResultCode["VEHICLE_NOT_FOUND"] = "VEHICLE_NOT_FOUND";
    WaslResultCode["VEHICLE_NOT_OWNED_BY_FINANCIER"] = "VEHICLE_NOT_OWNED_BY_FINANCIER";
    WaslResultCode["DRIVER_NOT_AUTHORIZED_TO_DRIVE_VEHICLE"] = "DRIVER_NOT_AUTHORIZED_TO_DRIVE_VEHICLE";
    WaslResultCode["NO_VALID_OPERATION_CARD"] = "NO_VALID_OPERATION_CARD";
    WaslResultCode["CONTACT_WASL_SUPPORT"] = "CONTACT_WASL_SUPPORT";
    WaslResultCode["NO_OPERATIONAL_CARD_FOUND"] = "NO operational Card found";
})(WaslResultCode || (exports.WaslResultCode = WaslResultCode = {}));
var waslRegistrationStatus;
(function (waslRegistrationStatus) {
    waslRegistrationStatus["VALID"] = "VALID";
    waslRegistrationStatus["INVALID"] = "INVALID";
    waslRegistrationStatus["PENDING"] = "PENDING";
    waslRegistrationStatus["NOT_REGISTERED"] = "NOT_REGISTERED";
})(waslRegistrationStatus || (exports.waslRegistrationStatus = waslRegistrationStatus = {}));
