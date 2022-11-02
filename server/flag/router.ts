import type {Request, Response} from 'express';
import express, {NextFunction} from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as flagValidator from './middleware';
import * as util from './util';
import FlagCollection from "./collection";

const router = express.Router();

/**
 * Get all the flagged freets
 *
 * @name GET /api/flagged
 *
 * @return {FlagResponse[]} - A list of all the flagged freets sorted in descending
 *                      order by date modified
 */
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if freetId query parameter was supplied
        if (req.query.freetId !== undefined) {
            next();
            return;
        }

        const allFlaggedFreets = await FlagCollection.findAll();
        const response = allFlaggedFreets.map(util.constructFlagResponse);
        res.status(200).json(response);
    },
);


/**
 * Flag a new freet.
 *
 * @name POST /api/flagged
 *
 * @param {string} content - The content of the freet
 * @return {FlagResponse} - The flagged freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
    '/:freetId?',
    [
        userValidator.isUserLoggedIn,
        freetValidator.isFreetExists,
        flagValidator.isUserAbleToFlagFreet,
    ],
    async (req: Request, res: Response) => {
        const freet = await FlagCollection.addOne(req.params.freetId);

        res.status(201).json({
            message: `You successfully flagged freet ${req.params.freetId}.`,
            freet: util.constructFlagResponse(freet)
        });
    }
);

/**
 * Unflag a freet
 *
 * @name DELETE /api/flagged/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
    '/:freetId?',
    [
        userValidator.isUserLoggedIn,
        freetValidator.isFreetExists,
        flagValidator.isUserAbleToUnflagFreet,
    ],
    async (req: Request, res: Response) => {
        await FlagCollection.deleteOne(req.params.freetId);
        res.status(200).json({
            message: `You successfully unflagged freet ${req.params.freetId}.`
        });
    }
);

export {router as flagRouter};
