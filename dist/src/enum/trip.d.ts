export declare enum TripStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    ARRIVED = "ARRIVED",
    UPCOMING = "UPCOMING",
    INPROGRESS = "INPROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    ON_HOLD = "ON_HOLD",
    ON_WAY = "ON_WAY"
}
export declare enum TripType {
    BASICTRIP = "BASIC",
    VIPTRIP = "VIP"
}
export declare enum PassengerTripStatus {
    JOINED = "JOINED",
    ARRIVED = "ARRIVED",
    CANCELLED_BY_PASSENGER = "CANCELLED_BY_PASSENGER",
    CANCELLED_BY_DRIVER = "CANCELLED_BY_DRIVER",
    ON_HOLD = "ON_HOLD",
    COMPLETED = "COMPLETED",
    PENDING_PAYMENT = "PENDING_PAYMENT"
}
export declare enum OfferStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    PENDING_PAYMENT = "PENDING_PAYMENT"
}
export declare enum CanceledBy {
    DRIVER = "DRIVER",
    PASSENGER = "PASSENGER"
}
export declare enum TripCancelationReason {
    WAITING = "Waiting for long time",
    DENIED_DESTINATION = "Driver denied to go to destination",
    UNABLE_TO_CONTACT_DRIVER = "Unable to contact driver",
    DENIED_PICKUP = "Driver denied to come to pick up",
    WRONG_ADDRESS = "Wrong address shown",
    PRICE_ISSUE = "The price is not reasonable",
    PICK_UP_OTHERS = "Pick up other passengers",
    OTHERS = "Others"
}
export declare enum TripSorting {
    HIGHEST_PRICE = "highestPrice",
    LOWEST_PRICE = "lowestPrice",
    DRIVER_RATE = "driverRate",
    RELEVANCE = "relevance"
}
