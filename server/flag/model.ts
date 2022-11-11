import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import {User} from "../user/model";

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for flag on the backend
export type Flag = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateModified: Date;
  content: string;
  authorId: Types.ObjectId;
};

export type PopulatedFlag = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateModified: Date;
  content: string;
  authorId: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FlagSchema = new Schema({
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // freetId
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const FlagModel = model<Flag>('Flag', FlagSchema);
export default FlagModel;
