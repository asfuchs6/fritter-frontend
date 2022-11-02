import type {Request, Response, NextFunction} from 'express';
import PinCollection from "./collection";



/**
 * Checks if a freet is already pinned. If so can unpin it.
 */
const isUserAbleToUnpinFreet = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await PinCollection.findOne();
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `No pinned freets to unpin.`
      }
    });
    return;
  }
  next();
};

export {
  isUserAbleToUnpinFreet,
};
