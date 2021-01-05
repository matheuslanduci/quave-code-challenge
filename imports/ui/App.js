import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Communities } from '../collections/communities';
import { People } from '../collections/people';

import { TEXTS } from '../infra/constants';

import { formatNumberTwoDigits } from './utils';

// Function to handle the check-in click from table.
// Note: If this function is inside the React component, will not work.
const handleCheckIn = id => {
  // Calling the method.
  Meteor.call('people.checkIn', id);
  // Disabling the button.
  document.querySelector(`#button_${id}`).setAttribute('disabled', 'true');
  // Then, 5 seconds to enabling again.
  setTimeout(() => {
    document.querySelector(`#button_${id}`).removeAttribute('disabled');
  }, 5000);
};

// Function to handle the check-out click from table.
// Note: If this function is inside the React component, will not work.
const handleCheckOut = id => {
  // Calling the method.
  Meteor.call('people.checkOut', id);
};

export const App = () => {
  // Store the actual value of selected community (event).
  const [community, setCommunity] = useState('none');
  // Store the available events.
  const [communities, setCommunities] = useState([]);
  // Store the people that will display at list (table).
  const [people, setPeople] = useState([]);

  // Loading communities from subscribe/publish and setting into state.
  useTracker(
    () => {
      // Subscribing into communities publish.
      Meteor.subscribe('communities');

      // Getting the results.
      const results = Communities.find().fetch();

      // Store the results into state.
      setCommunities(results);
    },
    /* Run once - when app render */ []
  );

  // Loading people by community from subscribe/publish and setting into state.
  useTracker(
    () => {
      // Subscribing into peopleByCommunity publish.
      Meteor.subscribe('peopleByCommunity', community);

      // Getting the results.
      const results = People.find({ communityId: community }).fetch();

      // Store results into state.
      setPeople(results);
    },
    /* Run when community's state change */ [community]
  );

  // Function to handle change of select's value.
  const handleChange = value => {
    setCommunity(value);
  };

  return (
    <div className="container">
      <div className="title">
        <h1>{TEXTS.HOME_TITLE}</h1>
        <h2>{TEXTS.HOME_CAPTION}</h2>
      </div>
      <div className="select-container">
        <select
          name="communities"
          id="select-community"
          value={community}
          onChange={e => handleChange(e.target.value)}
        >
          {
            // Creating a default option.
          }
          <option value="none" disabled>
            Select an event
          </option>
          {// Mapping communities to create an 'option' element to every community (event) available.
          communities.map(community => (
            <option key={community._id} value={community._id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>
      {/* Only display if community is different than none */ community !==
      'none' ? (
        <>
          <div className="summary-container">
            <div className="summary-box">
              <div className="summary-item" style={{ background: '#47cf73' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="64"
                  viewBox="0 0 24 64"
                >
                  <path
                    id="Icon_awesome-male"
                    data-name="Icon awesome-male"
                    d="M12,0A8,8,0,1,1,4,8a8,8,0,0,1,8-8m6,18H16.58a10.986,10.986,0,0,1-9.16,0H6a6,6,0,0,0-6,6V41a3,3,0,0,0,3,3H5V61a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V44h2a3,3,0,0,0,3-3V24A6,6,0,0,0,18,18Z"
                    fill="#fff"
                  />
                </svg>
                <span>
                  {TEXTS.SUMMARY_CHECKED_IN}
                  {
                    /* Show the count of people is in the event right now - filter who checked-in and don't checked out. */
                    people.filter(person => person.checkIn && !person.checkOut)
                      .length
                  }
                </span>
              </div>
              <div className="summary-item" style={{ background: '#d85e5e' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="64"
                  viewBox="0 0 24 64"
                >
                  <path
                    id="Icon_awesome-male"
                    data-name="Icon awesome-male"
                    d="M12,0A8,8,0,1,1,4,8a8,8,0,0,1,8-8m6,18H16.58a10.986,10.986,0,0,1-9.16,0H6a6,6,0,0,0-6,6V41a3,3,0,0,0,3,3H5V61a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V44h2a3,3,0,0,0,3-3V24A6,6,0,0,0,18,18Z"
                    fill="#fff"
                  />
                </svg>
                <span>
                  {TEXTS.SUMMARY_CHECKED_NOT}
                  {
                    /* Show the count of people who didn't checked-in - filter who didn't checked in. */
                    people.filter(person => !person.checkIn).length
                  }
                </span>
              </div>
              <div className="summary-item" style={{ background: '#5b88cc' }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="64"
                  viewBox="0 0 24 64"
                >
                  <path
                    id="Icon_awesome-male"
                    data-name="Icon awesome-male"
                    d="M12,0A8,8,0,1,1,4,8a8,8,0,0,1,8-8m6,18H16.58a10.986,10.986,0,0,1-9.16,0H6a6,6,0,0,0-6,6V41a3,3,0,0,0,3,3H5V61a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V44h2a3,3,0,0,0,3-3V24A6,6,0,0,0,18,18Z"
                    fill="#fff"
                  />
                </svg>
                <span>
                  {TEXTS.SUMMARY_ATTENDED}
                  {/* Show the count of people who attended the event - filter who checked in and checked-out plus who only checked-in. */
                  people.filter(person => person.checkIn && person.checkOut)
                    .length +
                    people.filter(person => person.checkIn && !person.checkOut)
                      .length}
                </span>
              </div>
            </div>
          </div>
          <div className="table-container">
            <table className="table-box">
              <thead>
                <tr>
                  <th className="table-content" id="table__full-name">
                    {TEXTS.TABLE_FULLNAME}
                  </th>
                  <th className="table-content" id="table__company">
                    {TEXTS.TABLE_COMPANY}
                  </th>
                  <th className="table-content" id="table__job-title">
                    {TEXTS.TABLE_TITLE}
                  </th>
                  <th className="table-content" id="table__date">
                    {TEXTS.TABLE_CHECKIN_DATE}
                  </th>
                  <th className="table-content" id="table__date">
                    {TEXTS.TABLE_CHECKOUT_DATE}
                  </th>
                  <th className="table-content" id="table__action">
                    {TEXTS.TABLE_ACTION}
                  </th>
                </tr>
              </thead>
              <tbody>
                {people.length > 0 ? (
                  // Mapping people to create a 'tr' element to every person.
                  people.map(person => (
                    <tr className="table-content" key={person._id}>
                      <td id="table__full-name">
                        {person.firstName} {person.lastName}
                      </td>
                      <td id="table__company">
                        {// If the person is not in a company will display N/A
                        person.companyName ? person.companyName : 'N/A'}
                      </td>
                      <td id="table__job-title">
                        {// If the person doesn't have a job will display N/A
                        person.title ? person.title : 'N/A'}
                      </td>
                      <td id="table__date">
                        {/* 
                          Formatting the date to MM/DD/YYYY HH:mm - 
                          Notes: 
                            - formatNumberTwoDigits() because if number less than 10, 
                              this number will display single digit.
                            - getMonth() + 1 because getMonth returns an index from an array. 
                        */
                        person.checkIn
                          ? `${formatNumberTwoDigits(
                              person.checkIn.getDate()
                            )}/${person.checkIn.getMonth() +
                              1}/${person.checkIn.getFullYear()}
                     ${formatNumberTwoDigits(
                       person.checkIn.getHours()
                     )}:${formatNumberTwoDigits(person.checkIn.getMinutes())}`
                          : 'N/A'}
                      </td>
                      <td id="table__date">
                        {/* 
                          Formatting the date to MM/DD/YYYY HH:mm - 
                          Notes: 
                            - formatNumberTwoDigits() because if number less than 10, 
                              this number will display single digit.
                            - getMonth() + 1 because getMonth returns an index from an array. 
                        */
                        person.checkOut
                          ? `${formatNumberTwoDigits(
                              person.checkOut.getDate()
                            )}/${person.checkOut.getMonth() +
                              1}/${person.checkOut.getFullYear()}
                     ${formatNumberTwoDigits(
                       person.checkOut.getHours()
                     )}:${formatNumberTwoDigits(person.checkOut.getMinutes())}`
                          : 'N/A'}
                      </td>
                      <td id="table__action">
                        {// If the person already checked-out, will display an unavailable text.
                        person.checkOut ? (
                          <span className="unavailable">Unavailable</span>
                        ) : (
                          // If not, will display an action button.
                          <button
                            id={`button_${person._id}`}
                            className={
                              // If the person already checked-in, will style to check-out style button.
                              // If not, will style to check-in style button.
                              person.checkIn ? 'check-out' : 'check-in'
                            }
                            onClick={() =>
                              // If the person already checked-in, will check-out on button click.
                              // If not, will check-in on button click.
                              person.checkIn
                                ? handleCheckOut(person._id)
                                : handleCheckIn(person._id)
                            }
                          >
                            {// If the person already checked-in, will display 'Check-out full name of person'
                            // If not, will display 'Check-in full name of person'
                            person.checkIn
                              ? `Check-out ${person.firstName} 
                                  ${person.lastName}`
                              : `Check-in ${person.firstName}
                                  ${person.lastName}`}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
