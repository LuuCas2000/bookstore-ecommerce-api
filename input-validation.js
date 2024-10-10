import { validationResult } from 'express-validator';

const validateInput = validations => {
    return async (req, res, next) => {
        // sequential processing, stops running validations chain if one fails.
        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }
        }

        next();
    }
};

export default validateInput;