import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Pin, PopulatedPin} from './model';
import {Types} from "mongoose";

// Update this if you add a property to the Freet type!
type PinResponse = {
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
 * @param {HydratedDocument<Flag>} freet - A freet
 * @returns {FlagResponse} - The freet object formatted for the frontend
 */
const constructPinResponse = (pin: HydratedDocument<Pin>): PinResponse => {
  const pinCopy: PopulatedPin = {
    ...pin.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = pinCopy.authorId;
  return {
    ...pinCopy,
    _id: pinCopy._id.toString(),
    dateModified: formatDate(pin.dateModified),
    author: username,
  };
};

export {
    constructPinResponse
};
