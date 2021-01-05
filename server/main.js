import { Meteor } from 'meteor/meteor';
import { loadInitialData } from '../imports/infra/initial-data';

import '../imports/collections/communities';
import '../imports/collections/people';

Meteor.startup(() => {
  // DON'T CHANGE THE NEXT LINE
  loadInitialData();
});
