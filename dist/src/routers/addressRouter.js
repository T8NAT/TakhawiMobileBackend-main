"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = __importDefault(require("../controllers/addressController"));
const addressValidations_1 = require("../validations/addressValidations");
const joiMiddleware_1 = __importDefault(require("../middlewares/joiMiddleware"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const authorization_1 = __importDefault(require("../middlewares/authorization"));
const roles_1 = require("../enum/roles");
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.route('/')
    .post((0, joiMiddleware_1.default)(addressValidations_1.createAddressValidation), addressController_1.default.create)
    .get(addressController_1.default.getAll);
router.route('/all')
    .get((0, authorization_1.default)(roles_1.Roles.SUPER_ADMIN, roles_1.Roles.ADMIN), addressController_1.default.getAllAddresses);
router.route('/:id')
    .get(addressController_1.default.getOne)
    .put((0, joiMiddleware_1.default)(addressValidations_1.updateAddressValidation), addressController_1.default.update)
    .delete(addressController_1.default.delete);
exports.default = router;
