import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Like, PopulatedLike} from '../like/model';

// Update this if you add a property to the Freet type!
type LikeResponse = {
  _id: string;
  author: string;
  content: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: PopulatedLike = {
    ...like.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = likeCopy.authorId;
  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    dateModified: formatDate(like.dateModified),
    author: username,
  };
};

export {
    constructLikeResponse
};
