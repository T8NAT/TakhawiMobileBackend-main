-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "birth_date" TIMESTAMP(3),
    "bio" TEXT,
    "national_id" TEXT,
    "gender" TEXT NOT NULL,
    "online_status" TEXT NOT NULL DEFAULT 'OFFLINE',
    "user_wallet_balance" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "driver_wallet_balance" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "profile_complted" INTEGER NOT NULL DEFAULT 50,
    "passenger_cancel_count" INTEGER NOT NULL DEFAULT 0,
    "driver_cancel_count" INTEGER NOT NULL DEFAULT 0,
    "location" JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}',
    "prefered_language" TEXT NOT NULL DEFAULT 'en',
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "driver_status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "passenger_status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "wasl_registration_status" TEXT NOT NULL DEFAULT 'NOT_REGISTERED',
    "switch_to_driver" BOOLEAN NOT NULL DEFAULT false,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "discount_app_share_count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "passenger_rate" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "driver_rate" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "cityId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NafathRequest" (
    "id" SERIAL NOT NULL,
    "nationalId" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "transId" TEXT,
    "random" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NafathRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_FCM_Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_FCM_Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite_Driver" (
    "userId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_Driver_pkey" PRIMARY KEY ("userId","driverId")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "note" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "reviewer_id" INTEGER NOT NULL,
    "target_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Code" (
    "id" SERIAL NOT NULL,
    "email_expire_date" TIMESTAMP(3),
    "email_verify_code" TEXT,
    "phone_expire_date" TIMESTAMP(3),
    "phone_verify_code" TEXT,
    "reset_password_code" TEXT,
    "reset_password_expire_date" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "User_Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "ar_name" TEXT NOT NULL,
    "en_name" TEXT NOT NULL,
    "postcode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" SERIAL NOT NULL,
    "category" TEXT,
    "note" TEXT NOT NULL,
    "is_complaint" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting_Location" (
    "id" SERIAL NOT NULL,
    "ar_name" TEXT NOT NULL,
    "en_name" TEXT NOT NULL,
    "location" JSONB NOT NULL DEFAULT '{"lat": 0, "lng": 0}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "cityId" INTEGER NOT NULL,

    CONSTRAINT "Meeting_Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "alias" TEXT NOT NULL,
    "description" TEXT,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recent_Address" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "alias" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Recent_Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hobbies" (
    "id" SERIAL NOT NULL,
    "ar_name" TEXT NOT NULL,
    "en_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promo_Code" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "amount" DOUBLE PRECISION NOT NULL,
    "max_discount" INTEGER,
    "limit" INTEGER NOT NULL,
    "time_used" INTEGER NOT NULL DEFAULT 0,
    "limit_per_user" INTEGER NOT NULL DEFAULT 1,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Promo_Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "serial_no" TEXT NOT NULL,
    "plate_alphabet" TEXT NOT NULL,
    "plate_alphabet_ar" TEXT NOT NULL DEFAULT '',
    "plate_number" TEXT NOT NULL,
    "seats_no" INTEGER NOT NULL,
    "production_year" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "vehicle_color_id" INTEGER NOT NULL,
    "vehicle_class_id" INTEGER NOT NULL,
    "vehicle_type_id" INTEGER NOT NULL,
    "vehicle_name_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Production_Start_Year" (
    "start_year" INTEGER NOT NULL DEFAULT 2000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Vehicle_Color" (
    "id" SERIAL NOT NULL,
    "ar_name" TEXT NOT NULL,
    "en_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Class" (
    "id" SERIAL NOT NULL,
    "ar_name" TEXT NOT NULL,
    "en_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Type" (
    "id" SERIAL NOT NULL,
    "ar_name" TEXT NOT NULL,
    "en_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Name" (
    "id" SERIAL NOT NULL,
    "ar_name" TEXT NOT NULL,
    "en_name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Image" (
    "id" SERIAL NOT NULL,
    "file_path" TEXT NOT NULL,
    "vehicle_id" INTEGER,
    "temp_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Licence" (
    "id" SERIAL NOT NULL,
    "file_path" TEXT NOT NULL,
    "vehicle_id" INTEGER,
    "temp_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Licence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle_Insurance" (
    "id" SERIAL NOT NULL,
    "file_path" TEXT NOT NULL,
    "vehicle_id" INTEGER,
    "temp_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_Insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Documents" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "file_path" TEXT,
    "is_exist" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "User_Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Used_Promo_Code" (
    "userId" INTEGER NOT NULL,
    "promo_code_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Used_Promo_Code_pkey" PRIMARY KEY ("userId","promo_code_id")
);

-- CreateTable
CREATE TABLE "Reason" (
    "id" SERIAL NOT NULL,
    "ar_reason" TEXT NOT NULL,
    "en_reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Reason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "tripId" INTEGER NOT NULL,
    "reasonId" INTEGER NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wasl_trip_log" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "result_code" TEXT NOT NULL,
    "result_msg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wasl_trip_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "pickup_time" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driver_app_share" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_app_share" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_debt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driver_tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gender" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "features" TEXT[],
    "driver_id" INTEGER,
    "vehicle_id" INTEGER,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Basic_Trip_Cancellation" (
    "trip_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "VIP_Trip" (
    "pickup_location_lat" DOUBLE PRECISION NOT NULL,
    "pickup_location_lng" DOUBLE PRECISION NOT NULL,
    "pickup_description" TEXT NOT NULL,
    "destination_location_lat" DOUBLE PRECISION NOT NULL,
    "destination_location_lng" DOUBLE PRECISION NOT NULL,
    "destination_description" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "app_share_discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_app_share" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_debt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payment_status" TEXT,
    "payment_method" TEXT,
    "promoCodeId" INTEGER,
    "passnger_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Vip_Trip_Cancelation" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "canceled_by" TEXT NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trip_id" INTEGER NOT NULL,

    CONSTRAINT "Vip_Trip_Cancelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Basic_Trip" (
    "trip_id" INTEGER NOT NULL,
    "seats_no" INTEGER NOT NULL,
    "available_seats_no" INTEGER NOT NULL,
    "price_per_seat" DOUBLE PRECISION NOT NULL,
    "pickup_location_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "Passenger_Trip" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "payment_status" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "app_share_discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_app_share" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_debt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driver_app_share" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'JOINED',
    "promo_code_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transactionId" TEXT,

    CONSTRAINT "Passenger_Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passenger_Trip_Cancellation" (
    "id" SERIAL NOT NULL,
    "passenger_trip_id" INTEGER NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Passenger_Trip_Cancellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offers" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "app_share_discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_app_share" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "features" TEXT[],
    "driver_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passenger_Wallet_Transaction" (
    "id" SERIAL NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "current_balance" DOUBLE PRECISION NOT NULL,
    "previous_balance" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "trip_id" INTEGER,
    "passenger_id" INTEGER NOT NULL,

    CONSTRAINT "Passenger_Wallet_Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver_Wallet_Transaction" (
    "id" SERIAL NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "previous_balance" DOUBLE PRECISION NOT NULL,
    "current_balance" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "driver_id" INTEGER NOT NULL,
    "trip_id" INTEGER,

    CONSTRAINT "Driver_Wallet_Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "ar_title" TEXT NOT NULL,
    "ar_body" TEXT NOT NULL,
    "en_title" TEXT NOT NULL,
    "en_body" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terms_And_Conditions" (
    "id" SERIAL NOT NULL,
    "ar_content" TEXT NOT NULL,
    "en_content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Terms_And_Conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Privacy_Policy" (
    "id" SERIAL NOT NULL,
    "ar_content" TEXT NOT NULL,
    "en_content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Privacy_Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "tripId" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "userId" INTEGER NOT NULL,
    "socketId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "senderId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saved_Card" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "card_exp_month" TEXT NOT NULL,
    "card_exp_year" TEXT NOT NULL,
    "card_holder" TEXT NOT NULL,
    "payment_brand" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recurringAgreementId" TEXT NOT NULL,
    "initialTransactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Saved_Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Billing_Info" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "User_Billing_Info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit_Card_Transaction" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "merchantTransactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "card_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Credit_Card_Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement_Request" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "holder_name" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "bank_account_number" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settlement_Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warning" (
    "id" SERIAL NOT NULL,
    "location" JSONB NOT NULL,
    "en_type" TEXT NOT NULL,
    "ar_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_date" TIMESTAMP(3),

    CONSTRAINT "Warning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App_Config" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "App_Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HobbiesToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_HobbiesToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NafathRequest_requestId_key" ON "NafathRequest"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "User_FCM_Token_token_key" ON "User_FCM_Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_Code_userId_key" ON "User_Code"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_lat_lng_key" ON "Address"("userId", "lat", "lng");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Production_Start_Year_start_year_key" ON "Vehicle_Production_Start_Year"("start_year");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Color_ar_name_key" ON "Vehicle_Color"("ar_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Color_en_name_key" ON "Vehicle_Color"("en_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Class_ar_name_key" ON "Vehicle_Class"("ar_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Class_en_name_key" ON "Vehicle_Class"("en_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Type_ar_name_key" ON "Vehicle_Type"("ar_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Type_en_name_key" ON "Vehicle_Type"("en_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Name_ar_name_key" ON "Vehicle_Name"("ar_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Name_en_name_key" ON "Vehicle_Name"("en_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_Insurance_vehicle_id_key" ON "Vehicle_Insurance"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Documents_userId_type_key" ON "User_Documents"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Basic_Trip_Cancellation_trip_id_key" ON "Basic_Trip_Cancellation"("trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "VIP_Trip_trip_id_key" ON "VIP_Trip"("trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vip_Trip_Cancelation_trip_id_key" ON "Vip_Trip_Cancelation"("trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "Basic_Trip_trip_id_key" ON "Basic_Trip"("trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userId_driverId_tripId_key" ON "Chat"("userId", "driverId", "tripId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_userId_chatId_socketId_key" ON "ChatRoom"("userId", "chatId", "socketId");

-- CreateIndex
CREATE UNIQUE INDEX "Saved_Card_card_number_card_exp_month_card_exp_year_payment_key" ON "Saved_Card"("card_number", "card_exp_month", "card_exp_year", "payment_brand", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Billing_Info_userId_key" ON "User_Billing_Info"("userId");

-- CreateIndex
CREATE INDEX "_HobbiesToUser_B_index" ON "_HobbiesToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_FCM_Token" ADD CONSTRAINT "User_FCM_Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite_Driver" ADD CONSTRAINT "Favorite_Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite_Driver" ADD CONSTRAINT "Favorite_Driver_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Code" ADD CONSTRAINT "User_Code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting_Location" ADD CONSTRAINT "Meeting_Location_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recent_Address" ADD CONSTRAINT "Recent_Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promo_Code" ADD CONSTRAINT "Promo_Code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicle_color_id_fkey" FOREIGN KEY ("vehicle_color_id") REFERENCES "Vehicle_Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicle_class_id_fkey" FOREIGN KEY ("vehicle_class_id") REFERENCES "Vehicle_Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicle_type_id_fkey" FOREIGN KEY ("vehicle_type_id") REFERENCES "Vehicle_Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_vehicle_name_id_fkey" FOREIGN KEY ("vehicle_name_id") REFERENCES "Vehicle_Name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_Image" ADD CONSTRAINT "Vehicle_Image_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_Licence" ADD CONSTRAINT "Vehicle_Licence_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle_Insurance" ADD CONSTRAINT "Vehicle_Insurance_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Documents" ADD CONSTRAINT "User_Documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Used_Promo_Code" ADD CONSTRAINT "Used_Promo_Code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Used_Promo_Code" ADD CONSTRAINT "Used_Promo_Code_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "Promo_Code"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "Reason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wasl_trip_log" ADD CONSTRAINT "Wasl_trip_log_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basic_Trip_Cancellation" ADD CONSTRAINT "Basic_Trip_Cancellation_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Basic_Trip"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basic_Trip_Cancellation" ADD CONSTRAINT "Basic_Trip_Cancellation_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIP_Trip" ADD CONSTRAINT "VIP_Trip_passnger_id_fkey" FOREIGN KEY ("passnger_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIP_Trip" ADD CONSTRAINT "VIP_Trip_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VIP_Trip" ADD CONSTRAINT "VIP_Trip_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "Promo_Code"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vip_Trip_Cancelation" ADD CONSTRAINT "Vip_Trip_Cancelation_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vip_Trip_Cancelation" ADD CONSTRAINT "Vip_Trip_Cancelation_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vip_Trip_Cancelation" ADD CONSTRAINT "Vip_Trip_Cancelation_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "VIP_Trip"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basic_Trip" ADD CONSTRAINT "Basic_Trip_pickup_location_id_fkey" FOREIGN KEY ("pickup_location_id") REFERENCES "Meeting_Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basic_Trip" ADD CONSTRAINT "Basic_Trip_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "Meeting_Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Basic_Trip" ADD CONSTRAINT "Basic_Trip_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger_Trip" ADD CONSTRAINT "Passenger_Trip_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Basic_Trip"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger_Trip" ADD CONSTRAINT "Passenger_Trip_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger_Trip" ADD CONSTRAINT "Passenger_Trip_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "Promo_Code"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger_Trip_Cancellation" ADD CONSTRAINT "Passenger_Trip_Cancellation_passenger_trip_id_fkey" FOREIGN KEY ("passenger_trip_id") REFERENCES "Passenger_Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger_Trip_Cancellation" ADD CONSTRAINT "Passenger_Trip_Cancellation_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger_Trip_Cancellation" ADD CONSTRAINT "Passenger_Trip_Cancellation_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "VIP_Trip"("trip_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offers" ADD CONSTRAINT "Offers_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger_Wallet_Transaction" ADD CONSTRAINT "Passenger_Wallet_Transaction_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passenger_Wallet_Transaction" ADD CONSTRAINT "Passenger_Wallet_Transaction_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver_Wallet_Transaction" ADD CONSTRAINT "Driver_Wallet_Transaction_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver_Wallet_Transaction" ADD CONSTRAINT "Driver_Wallet_Transaction_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Saved_Card" ADD CONSTRAINT "Saved_Card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Billing_Info" ADD CONSTRAINT "User_Billing_Info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_Card_Transaction" ADD CONSTRAINT "Credit_Card_Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit_Card_Transaction" ADD CONSTRAINT "Credit_Card_Transaction_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Saved_Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement_Request" ADD CONSTRAINT "Settlement_Request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HobbiesToUser" ADD CONSTRAINT "_HobbiesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Hobbies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HobbiesToUser" ADD CONSTRAINT "_HobbiesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
