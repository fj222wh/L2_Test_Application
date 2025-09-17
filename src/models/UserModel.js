/**
 * @module SnippetModel
 * @author Filippa Johansson
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'
import bcrypt from 'bcrypt'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [4, 'The username has to be at least 4 characters.'],
    unique: [true, 'The username is already taken.'],
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'The password needs to contain at least 6 characters.']
  },
  fname: {
    type: String,
    required: true,
    minlength: [1, 'You have to enter your name.'],
    trim: true
  },
  lname: {
    type: String,
    required: true,
    minlength: [1, 'You have to enter your name.'],
    trim: true
  }
})

// Add the base schema to this schema
schema.add(BASE_SCHEMA)

/**
 * Before saving the data to the collection we salt and hash the password.
 */
schema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  } catch (error) {
    console.error(error)
    throw new Error('Sorry, something went wrong when trying to create this user!')
  }
})

/**
 * Check authentication.
 *
 * @param {string} username The username.
 * @param {string} password The password.
 * @returns {object} Returns the user.
 */
schema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invaild login attempt.')
  }

  return user
}

export const UserModel = mongoose.model('User', schema)
