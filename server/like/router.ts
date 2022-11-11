import type {Request, Response} from 'express';
import express, {NextFunction} from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';
import LikeCollection from "./collection";

const router = express.Router();

// /**
//  * Get all the liked freets
//  *
//  * @name GET /api/liked
//  *
//  * @return {LikeResponse[]} - A list of all the liked freets sorted in descending
//  *                      order by date modified
//  */
// router.get(
//     '/',
//     async (req: Request, res: Response, next: NextFunction) => {
//         // Check if freetId query parameter was supplied
//         if (req.query.freetId !== undefined) {
//             next();
//             return;
//         }
//
//         const allLikedFreets = await LikeCollection.findAll();
//         const response = allLikedFreets.map(util.constructLikeResponse);
//         res.status(200).json(response);
//     },
// );

/**
 * Get all liked freets by an author
 *
 * @name GET /api/liked?author=username
 *
 * @return {LikeResponse[]} - A list of all the liked freets sorted in descending
 *                      order by date modified
 */
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if freetId query parameter was supplied
        if (req.query.author !== undefined) {
            const allLikedFreets = await LikeCollection.findAllByUsername(req.query.author as string);
            const response = allLikedFreets.map(util.constructLikeResponse);
            res.status(200).json(response);
            return;
        }
    },
);


/**
 * Create a new liked freet.
 *
 * @name POST /api/liked
 *
 * @param {string} content - The content of the freet
 * @return {LikeResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
    '/:freetId?',
    [
        userValidator.isUserLoggedIn,
        freetValidator.isFreetExists,
        likeValidator.isUserAbleToLikeFreet,
    ],
    async (req: Request, res: Response) => {
        const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
        const freet = await LikeCollection.addOne(req.params.freetId, userId);

        res.status(201).json({
            message: `You successfully liked freet ${req.params.freetId}.`,
            freet: util.constructLikeResponse(freet)
        });
    }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/liked/:id
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
        likeValidator.isUserAbleToUnlikeFreet,
    ],
    async (req: Request, res: Response) => {
        await LikeCollection.deleteOne(req.params.freetId);
        res.status(200).json({
            message: `You successfully unliked freet ${req.params.freetId}.`
        });
    }
);

export {router as likeRouter};
