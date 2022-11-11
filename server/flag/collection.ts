import type {HydratedDocument, Types} from 'mongoose';
import type {Flag} from './model';
import FlagModel from './model';
import UserCollection from "../user/collection";

/**
 * This file contains a class with functionality to interact with freets that users flag.
 * They can flag a freet which will add it to a flagged folder,
 * or unflag a freet by id, and they can get all flagged freets.
 * Flagging a freet will remove it from the "View all freets" call.
 *
 */
class FlagCollection {
  /**
   * Flag a freet which will be added to the flagged collection
   *
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Flag>>} - Success message
   */
  static async addOne(content: string, authorId: Types.ObjectId | string): Promise<HydratedDocument<Flag>> {
    const date = new Date();
    const flag = new FlagModel({
      content,
      authorId,
      dateModified: date
    });
    await flag.save(); // Saves freet to MongoDB
    return flag;
  }
  /**
   * Get all the flagged freets
   *
   * @return {Promise<HydratedDocument<Flag>[]>} - An array of all of the flagged freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Flag>>> {
    // Retrieves freets and sorts them from most to least recent
    return FlagModel.find({}).sort({dateModified: -1});
  }
  /**
   * Get all the flagged freets by given authorId
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Flag>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FlagModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }
  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Flag>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: string): Promise<HydratedDocument<Flag>> {
    return FlagModel.findOne({content: freetId});
  }

  /**
   * Unflag a freet which will remove it from the flagged collection
   *
   * @param {string} freetId - The freetId of freet to delete (unflag)
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: string): Promise<boolean> {
    const freet = await FlagModel.deleteOne({content: freetId});
    return freet !== null;
  }
}

export default FlagCollection;
