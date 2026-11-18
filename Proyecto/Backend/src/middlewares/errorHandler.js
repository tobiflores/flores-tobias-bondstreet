import AppError from "../exceptions/AppError.js";
import ApiResponse from "../responses/ApiResponse.js";
import { Messages } from "../enums/Messages.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return ApiResponse.error(res, err.message, err.statusCode);
    }

    // Body JSON malformado (lanzado por express.json())
    if (err.type === "entity.parse.failed") {
        return ApiResponse.error(res, Messages.INVALID_DATA, 400);
    }

    console.error(err);
    return ApiResponse.error(res, Messages.INTERNAL_ERROR, 500);
};

export default errorHandler;
