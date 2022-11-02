import type {HydratedDocument, Types} from 'mongoose';
import type {Pin} from './model';
import PinModel from './model';
import {Freet} from "../freet/model";

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
  static async addOne(freet: Freet): Promise<HydratedDocument<Pin>> {

    const {authorId, _id, content} = freet;
    const date = new Date();
    const pin = new PinModel({
      authorId: authorId,
      freetId: _id,
      dateCreated: date,
      content: content
    });
    await pin.save(); // Saves freet to MongoDB
    return pin;
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
  static async deleteOne(): Promise<boolean> {
    const freet = await PinModel.deleteOne({});
    return freet !== null;
  }
}

export default PinCollection;
