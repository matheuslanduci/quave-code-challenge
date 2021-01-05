import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const People = new Mongo.Collection('people');

// If the instance of Meteor is a server, publish a function to subscription.
if (Meteor.isServer) {
  Meteor.publish('peopleByCommunity', function peopleInCommunity(id) {
    // Returns the people with the same community ID.
    return People.find({ communityId: id });
  });
}

// Creating methods to call inside the client-side.
Meteor.methods({
  // Check-in the person with it's id.
  'people.checkIn'(id) {
    // Check if id is a string.
    check(id, String);

    // Retrieve the data of actual person to update.
    const actualPerson = People.findOne({ _id: id });

    // If there's no such a person with this ID the code throw an error.
    if (!actualPerson) {
      throw new Meteor.Error('Not an actual person.');
    }

    // Update the person with id that was passed in args.
    // Notes:
    // - new Date() will save the date when method was fired.
    // - If the actualPerson isn't present on update, will remove all data of this person (except ID).
    People.update(
      { _id: id },
      {
        ...actualPerson,
        checkIn: new Date(),
      }
    );
  },

  // Check-out person with it's id.
  'people.checkOut'(id) {
    // Check if id is a string.
    check(id, String);

    // Retrieve the data of actual person to update.
    const actualPerson = People.findOne({ _id: id });

    // If there's no such a person with this ID, the code throw an error.
    if (!actualPerson) {
      throw new Meteor.Error('Not an actual person.');
    }

    // If the person didn't checked in, the code throw an error.
    if (!actualPerson.checkIn) {
      throw new Meteor.Error("This person didn't checked in.");
    }

    // Update the person with id that was passed in args.
    // Notes:
    // - new Date() will save the date when method was fired.
    // - If the actualPerson isn't present on update, will remove all data of this person (except ID).
    People.update(
      { _id: id },
      {
        ...actualPerson,
        checkOut: new Date(),
      }
    );
  },
});
