import type {Request, Response} from 'express';
import express, {NextFunction} from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as pinValidator from './middleware';
import * as util from './util';
import PinCollection from "./collection";
import FreetCollection from "../freet/collection";

const router = express.Router();

/**
 * Get the pinned freet
 *
 * @name GET /api/pin
 *
 * @return {FlagResponse[]} - A list of all the flagged freets sorted in descending
 *                      order by date modified
 */
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        const pinnedFreet = await PinCollection.findOne();
        res.status(200).json(pinnedFreet);
    },
);


/**
 * Pin a new freet.
 *
 * @name POST /api/pin
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
    ],
    async (req: Request, res: Response) => {
        const freetToPin = await FreetCollection.findOne(req.params.freetId);
        const existingPin = await PinCollection.findOne();
        if (existingPin){
            await PinCollection.deleteOne();
        }
        const response = await PinCollection.addOne(freetToPin);
        res.status(201).json({
            message: `You successfully pinned freet ${req.params.freetId}.`,
            freet: util.constructPinResponse(response)
        });
    }
);

/**
 * Unpin the pinned freet
 *
 * @name DELETE /api/pin
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
    '/',
    [
        userValidator.isUserLoggedIn,
        pinValidator.isUserAbleToUnpinFreet,
    ],
    async (req: Request, res: Response) => {
        await PinCollection.deleteOne();
        res.status(200).json({
            message: `You successfully unpinned freet.`
        });
    }
);

export {router as pinRouter};
