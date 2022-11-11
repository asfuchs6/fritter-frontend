import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import {User} from "../user/model";

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for flag on the backend
export type Pin = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateModified: Date;
  content: string;
  authorId: Types.ObjectId;
};

export type PopulatedPin = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  dateModified: Date;
  content: string;
  authorId: User;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PinSchema = new Schema({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  }
});

const PinModel = model<Pin>('Pin', PinSchema);
export default PinModel;
