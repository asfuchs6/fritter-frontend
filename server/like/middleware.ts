import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from "../like/collection";


/**
 * Checks if a freet with freetId is liked. If so a user can remove it.
 */
const isUserAbleToLikeFreet = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await LikeCollection.findOne(req.params.freetId) : '';
  if (freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} is already liked.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is liked. If so a user can remove it.
 */
const isUserAbleToUnlikeFreet = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await LikeCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist in liked. Make sure you are entering the freet ID and not the id for the like.`
      }
    });
    return;
  }

  next();
};

export {
  isUserAbleToLikeFreet,
  isUserAbleToUnlikeFreet
};
