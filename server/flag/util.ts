import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Flag} from './model';

// Update this if you add a property to the Freet type!
type FlagResponse = {
  _id: string;
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
 * @param {HydratedDocument<Flag>} freet - A freet
 * @returns {FlagResponse} - The freet object formatted for the frontend
 */
const constructFlagResponse = (flag: HydratedDocument<Flag>): FlagResponse => {
  const flagCopy: Flag = {
    ...flag.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...flagCopy,
    _id: flagCopy._id.toString(),
    dateModified: formatDate(flag.dateModified)
  };
};

export {
    constructFlagResponse
};
