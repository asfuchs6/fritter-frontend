import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FlagCollection from "./collection";


/**
 * Checks if a freet is flagged. If so a user cannot reflag it.
 */
const isUserAbleToFlagFreet = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FlagCollection.findOne(req.params.freetId) : '';
  if (freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} is already flagged.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet is flagged. If so a user can unflag it.
 */
const isUserAbleToUnflagFreet = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FlagCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist in flagged. Make sure you are entering the freet ID and not the id for the flag.`
      }
    });
    return;
  }

  next();
};

export {
  isUserAbleToFlagFreet,
  isUserAbleToUnflagFreet,
};
