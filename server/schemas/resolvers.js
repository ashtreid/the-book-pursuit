const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        user: async (parent, { username }) => {
            return User.findOne({ username }).populate('savedBooks');
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user.id }).populate('savedBooks');
            }
            throw new AuthenticationError('Log in first!')
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user }
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Cannot find user associated with this email address');
            }

            const correctPass = await user.isCorrectPassword(password);

            if (!correctPass) {
                throw new AuthenticationError('Credentials are invalid');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, input, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    {_id: context.user._id},
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                )
                // .populate('savedBooks');
            }
            throw new AuthenticationError('But first, log in.')
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: bookId } },
                    { new: true }
                );
            }
            throw new AuthenticationError('Gotta login')
        },
    },
};

module.exports = resolvers;