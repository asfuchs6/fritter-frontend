import type {HydratedDocument, Types} from 'mongoose';
import type {Pin} from './model';
import PinModel from './model';
import {Freet} from "../freet/model";
import UserCollection from "../user/collection";

/**
 * This file contains a class with functionality to interact with freets that users pin.
 * They can pin a freet, replace it, or unpin.
 *
 */
class PinCollection {
  /**
   * Pin a freet which will be at the top of the feed
   *
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Pin>>} - Success message
   */
  static async addOne(content: string, authorId: Types.ObjectId | string): Promise<HydratedDocument<Pin>> {
    const date = new Date();
    const pin = new PinModel({
      content,
      authorId,
      dateModified: date
    });
    await pin.save(); // Saves freet to MongoDB
    return pin;
  }
  /**
   * Get the pinned freet by given authorId
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findOneByUsername(userId: Types.ObjectId| string): Promise<Array<HydratedDocument<Pin>>> {
    // const author = await UserCollection.findOneByUsername(username);
    return PinModel.find({authorId: userId});
  }
  /**
   * Get the pinned freet
   *
   * @return {Promise<HydratedDocument<Pinned>> | Promise<null> } - The pinned freet
   */
  static async findOne(): Promise<HydratedDocument<Pin>> {
    return PinModel.findOne({});
  }

  /**
   * Unpin a freet
   *
   * @return {Promise<Boolean>} - true if the freet has been unpinned, false otherwise
   */
  static async deleteOne(freetId: string): Promise<boolean> {
    const freet = await PinModel.deleteOne({});
    return freet !== null;
  }
}

export default PinCollection;
