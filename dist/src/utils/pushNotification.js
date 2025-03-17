"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
try {
    const serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: '109814690939830010383',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-45mqv%40takhawe-5d516.iam.gserviceaccount.com',
        universe_domain: 'googleapis.com',
    };
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
catch (error) {
    console.log('Error initializing Firebase Admin SDK:', error);
}
const sendPushNotification = async (data) => {
    const { title, body, tokens, imageUrl, } = data;
    const message = {
        notification: {
            title,
            body,
            imageUrl: imageUrl || undefined,
        },
        tokens,
    };
    await firebase_admin_1.default
        .messaging()
        .sendEachForMulticast(message)
        .then((response) => {
        response.responses.forEach((resp) => {
            if (resp.error)
                console.log(resp.error);
        });
        console.log(`${response.successCount} messages were sent successfully`);
    })
        .catch((error) => {
        console.log('Error sending message:', error);
    });
};
exports.default = sendPushNotification;
