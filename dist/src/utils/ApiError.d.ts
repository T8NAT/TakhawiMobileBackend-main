export default class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
