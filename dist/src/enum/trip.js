"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripSorting = exports.TripCancelationReason = exports.CanceledBy = exports.OfferStatus = exports.PassengerTripStatus = exports.TripType = exports.TripStatus = void 0;
var TripStatus;
(function (TripStatus) {
    TripStatus["PENDING"] = "PENDING";
    TripStatus["ACCEPTED"] = "ACCEPTED";
    TripStatus["ARRIVED"] = "ARRIVED";
    TripStatus["UPCOMING"] = "UPCOMING";
    TripStatus["INPROGRESS"] = "INPROGRESS";
    TripStatus["COMPLETED"] = "COMPLETED";
    TripStatus["CANCELLED"] = "CANCELLED";
    TripStatus["ON_HOLD"] = "ON_HOLD";
    TripStatus["ON_WAY"] = "ON_WAY";
})(TripStatus || (exports.TripStatus = TripStatus = {}));
var TripType;
(function (TripType) {
    TripType["BASICTRIP"] = "BASIC";
    TripType["VIPTRIP"] = "VIP";
})(TripType || (exports.TripType = TripType = {}));
var PassengerTripStatus;
(function (PassengerTripStatus) {
    PassengerTripStatus["JOINED"] = "JOINED";
    PassengerTripStatus["ARRIVED"] = "ARRIVED";
    PassengerTripStatus["CANCELLED_BY_PASSENGER"] = "CANCELLED_BY_PASSENGER";
    PassengerTripStatus["CANCELLED_BY_DRIVER"] = "CANCELLED_BY_DRIVER";
    PassengerTripStatus["ON_HOLD"] = "ON_HOLD";
    PassengerTripStatus["COMPLETED"] = "COMPLETED";
    PassengerTripStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
})(PassengerTripStatus || (exports.PassengerTripStatus = PassengerTripStatus = {}));
var OfferStatus;
(function (OfferStatus) {
    OfferStatus["PENDING"] = "PENDING";
    OfferStatus["ACCEPTED"] = "ACCEPTED";
    OfferStatus["REJECTED"] = "REJECTED";
    OfferStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
})(OfferStatus || (exports.OfferStatus = OfferStatus = {}));
var CanceledBy;
(function (CanceledBy) {
    CanceledBy["DRIVER"] = "DRIVER";
    CanceledBy["PASSENGER"] = "PASSENGER";
})(CanceledBy || (exports.CanceledBy = CanceledBy = {}));
var TripCancelationReason;
(function (TripCancelationReason) {
    TripCancelationReason["WAITING"] = "Waiting for long time";
    TripCancelationReason["DENIED_DESTINATION"] = "Driver denied to go to destination";
    TripCancelationReason["UNABLE_TO_CONTACT_DRIVER"] = "Unable to contact driver";
    TripCancelationReason["DENIED_PICKUP"] = "Driver denied to come to pick up";
    TripCancelationReason["WRONG_ADDRESS"] = "Wrong address shown";
    TripCancelationReason["PRICE_ISSUE"] = "The price is not reasonable";
    TripCancelationReason["PICK_UP_OTHERS"] = "Pick up other passengers";
    TripCancelationReason["OTHERS"] = "Others";
})(TripCancelationReason || (exports.TripCancelationReason = TripCancelationReason = {}));
var TripSorting;
(function (TripSorting) {
    TripSorting["HIGHEST_PRICE"] = "highestPrice";
    TripSorting["LOWEST_PRICE"] = "lowestPrice";
    TripSorting["DRIVER_RATE"] = "driverRate";
    TripSorting["RELEVANCE"] = "relevance";
})(TripSorting || (exports.TripSorting = TripSorting = {}));
