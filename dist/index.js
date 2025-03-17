"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const node_path_1 = __importDefault(require("node:path"));
const routers_1 = __importDefault(require("./src/routers"));
const errorMiddleware_1 = __importDefault(require("./src/middlewares/errorMiddleware"));
const seeding_1 = __importDefault(require("./prisma/seeding"));
const set_language_1 = __importDefault(require("./src/middlewares/set-language"));
const socket_1 = require("./src/utils/socket");
const cron_jobs_1 = __importDefault(require("./src/cron-jobs"));
(0, dotenv_1.config)();
(0, seeding_1.default)();
(0, cron_jobs_1.default)();
socket_1.app.use((0, cors_1.default)());
socket_1.app.use(express_1.default.json());
socket_1.app.use(express_1.default.urlencoded({ extended: true }));
socket_1.app.use('/uploads', express_1.default.static('uploads'));
socket_1.app.use('/assets', express_1.default.static('assets'));
// Initialize Localization
socket_1.app.use(socket_1.i18nInit);
// Set Localized Language
socket_1.app.use(set_language_1.default);
socket_1.app.use((0, morgan_1.default)('dev'));
socket_1.app.get('/.well-known/apple-developer-merchantid-domain-association.txt', (req, res) => {
    res.sendFile(`${node_path_1.default.join(__dirname, '../')}/apple-developer-merchantid-domain-association.txt`);
});
socket_1.app.get('/apple-pay', async (req, res, next) => {
    try {
        // const amount = req.query && req.query.amount ? Number(req.query.amount).toFixed(2) : '1.00';
        // const checkOut = await paymentGatewayService.prepareCheckout({
        //   amount,
        // });
        // const html = pug.renderFile('./src/templates/applePay.pug', {
        //   checkoutId: checkOut.id,
        //   amount,
        //   merchantIdentifier: process.env.APPLEPAY_ENTITY_ID,
        // });
        // res.send(html);
        res.sendFile(`${__dirname}/index.html`);
    }
    catch (error) {
        next(error);
    }
});
socket_1.app.post('/apple-pay', (req, res) => {
    res.send({
        message: 'Apple Pay Payment Success',
        body: req.body,
    });
});
socket_1.app.get('/', (req, res) => {
    console.log(`Environment: ${process.env.NODE_ENV}`);
    res.send('Hello World!');
});
socket_1.app.use('/api', routers_1.default);
socket_1.app.all('*', (req, res) => {
    res.status(404).json({
        status: false,
        message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    });
});
socket_1.app.use(errorMiddleware_1.default);
socket_1.server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
