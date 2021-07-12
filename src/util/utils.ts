import { check } from "express-validator";

export function validateTrade() {
    return [
        check('price').isInt({min: 0}).withMessage("Invalid 'price' : Price should be greater than or equal to 0"),
        check('quantity').notEmpty().isInt({min: 1}).withMessage("Invalid 'quantity': Quantity should be greater than 0"),
        check('tickerSymbol').notEmpty().withMessage("Invalid 'tickerSymbol': TickerSymbol cannot be empty"),
        check('action').notEmpty().isIn(['BUY', 'SELL']).withMessage("Invalid 'action': Action should be 'BUY' or 'SELL'")
    ];
}

export function getErrorResponse(errors: any) {
    let messages: string[] = [];
    let response = {
        "message": messages,
        "type": "InputException"
    }
    for(let error of errors) {
        messages.push(error.msg);
    }
    response.message = messages;
    return response;
}

export function getSuccessResponse(data: any) {
    return {
        "status": "success",
        "data": data
    }
}