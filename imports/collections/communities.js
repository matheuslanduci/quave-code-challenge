import { Mongo } from 'meteor/mongo';

export const Communities = new Mongo.Collection('communities');

// If the instance of Meteor is a server, publish a function to subscription.
if (Meteor.isServer) {
  Meteor.publish('communities', function communitiesPublication() {
    return Communities.find();
  });
}
