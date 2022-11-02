import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import FreetModel, {Freet} from "../freet/model";

/**
 * This file contains a class with functionality to interact with freets that users like.
 * They can add a new like to a freet which will add it to a liked folder,
 * or delete a freet by id, and they can get all liked freets
 *
 */
class LikeCollection {
  /**
   * Add a like to a freet which will be added to the liked collection
   *
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created freet
   */
  static async addOne(content: string): Promise<HydratedDocument<Like>> {
    const date = new Date();
    const like = new LikeModel({
      content,
      dateModified: date
    });
    await like.save(); // Saves freet to MongoDB
    return like;
  }
  /**
   * Get all the liked freets
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the liked freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves freets and sorts them from most to least recent
    return LikeModel.find({}).sort({dateModified: -1});
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({content: freetId});
  }

  /**
   * Remove a like from a liked freet which will remove it from the liked collection
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: string): Promise<boolean> {
    const freet = await LikeModel.deleteOne({content: freetId});
    return freet !== null;
  }
}

export default LikeCollection;
