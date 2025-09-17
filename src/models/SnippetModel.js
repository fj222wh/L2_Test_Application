/**
 * @module SnippetModel
 * @author Filippa Johansson
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const schema = new mongoose.Schema({
  snippet: {
    type: String,
    minlength: [1, 'Can not save an empty snippet.'],
    trim: true
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  authorID: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
})

// Add the base schema to this schema
schema.add(BASE_SCHEMA)

export const SnippetModel = mongoose.model('Snippet', schema)
