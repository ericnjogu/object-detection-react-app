import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import should from "should";

describe("<App/> ", () => {
    it ('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it ('addEvent when state does not contain any events', () => {
        const app = new App();
        // streamStatus should be initialized to empty object
        const oldState = {events:{}};
        const instanceName = 'test';
        const source = 'https://streamX';
        const data = {some:'data'};
        // 'events' keys will be instance ids/names then have nested source:frame-count objects
        const eventData = {instanceName, source, frameCount: 1109}; // left out other data fields
        const expectedEvents = {[instanceName]: {[source]: [eventData]}};
        const newState = app.addEvent(oldState, eventData);

        should.exist(newState);
        newState.events.should.deepEqual(expectedEvents)
    });

    it ('addEvent when state contains similar instance & source events', () => {
        const app = new App();
        const instanceName = 'test';
        const source = 'https://streamX';
        const frameCount = 11;
        const initialData = {some:'initial-data'};
        const oldState = {
          events: {[instanceName]: {[source]: [initialData]}}
        };
        const newFrameCount = 45;
        // 'events' keys will be instance ids/names then have nested source:frame-count objects
        const eventData = {instanceName, source, frameCount:newFrameCount}; // left out other data fields
        const expectedEvents = {[instanceName]: {[source]: [initialData, eventData]}};
        const newState = app.addEvent(oldState, eventData);

        should.exist(newState);
        newState.events.should.deepEqual(expectedEvents)
    });

    it ('addEvent when state contains similar instance, but different source events', () => {
        const app = new App();
        const instanceName = 'test';
        const source = 'https://streamX';
        const frameCount = 11;
        const initialData = {some:'initial-data'};
        const oldState = {
          events: {[instanceName]: {[source]: [initialData]}}
        };
        const newFrameCount = 51;
        const newSource = "file://here/there";
        // 'events' keys will be instance ids/names then have nested source:frame-count objects
        const eventData = {instanceName, source:newSource, frameCount:newFrameCount}; // left out other data fields
        const expectedEvents = {[instanceName]: {[source]: [initialData], [newSource]: [eventData]}};
        const newState = app.addEvent(oldState, eventData);

        should.exist(newState);
        newState.events.should.deepEqual(expectedEvents)
    });

   it ('addEvent when state contains different instance & source events', () => {
        const app = new App();
        const instanceName = 'test';
        const source = 'https://streamX';
        const frameCount = 11;
        const initialData = {some:'initial-data'};
        const oldState = {
          events: {[instanceName]: {[source]: [initialData]}}
        };
        const newFrameCount = 51;
        const newSource = "file://here/there";
        const newInstance = "area 51";
        // 'events' keys will be instance ids/names then have nested source:frame-count objects\
        const eventData = {instanceName: newInstance, source:newSource, frameCount:newFrameCount}; // left out other data fields
        const expectedStreamStatus = {[instanceName]: {[source]: [initialData]}, [newInstance]: {[newSource]: [eventData]}};
        const newState = app.addEvent(oldState, eventData);

        should.exist(newState);
        newState.events.should.deepEqual(expectedStreamStatus)
  });

   it ('getEventLists returns each unique instance & source event list', () => {
        const app = new App();
        const instanceName = 'test';
        const source = 'https://streamX';
        const initialData = {some:'initial-data'};

        const newFrameCount = 51;
        const newSource = "file://here/there";
        const newInstance = "area 51";
        // 'events' keys will be instance ids/names then have nested source:frame-count objects\
        const eventData = {instanceName: newInstance, source:newSource, frameCount:newFrameCount}; // left out other data fields
        const eventsState = {[instanceName]: {[source]: [initialData]}, [newInstance]: {[newSource]: [eventData]}};

       const eventLists = app.getEventLists(eventsState);
       should.exist((eventLists))
       eventLists.should.deepEqual([[initialData], [eventData]])
  });

})

