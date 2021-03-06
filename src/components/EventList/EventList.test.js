import React from 'react'
// https://stackoverflow.com/a/51571404/315385
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'
import should from 'should'

import EventList from './EventList'
import {framePath2, event2, event1, eventsWithInstanceAndSource, source, streamHost, instanceName} from '../../test/fixtures'

Enzyme.configure({adapter: new Adapter()});

describe ("<EventList/>", () => {
    it("should render info msg when there are no events", () => {
        const list = shallow(<EventList />);
        list.find('span').should.have.length(1)
        list.find('span').text().should.equal("No events available")
    });

    it("should render the last image on the event list when event list is supplied", () => {
        // both events belong to same instance, source
        const events = eventsWithInstanceAndSource();
        const list = shallow(<EventList events={events} streamHost={streamHost}/>);
        list.exists(`div img[src='${streamHost}${framePath2}']`).should.be.true()
        list.find('div span').at(0).text().should.not.be.empty(`${instanceName} - ${source}`)
    })

    it("should show the number of unseen messages with a 'danger' background", () => {
        const event01 = {seen:false, stringMap:{frame_path: 'framePath01'}};
        // mark these events as seen
        const seen = true;
        const events = [event1, event2].map(event => ({...event, seen}))
        const list = shallow(<EventList events={[...events, event01]}/>);
        list.find('div span').at(1).text().should.equal('1')
        list.find('div span').at(1).prop('className').startsWith('col bg-danger').should.be.true();
    })

    it("should show '0' for unseen messages if none found, with 'info' background", () => {
        const event01 = {seen:true, stringMap:{frame_path: 'framePath01'}};
        // mark these events as seen
        const seen = true;
        const events = [event1, event2].map(event => ({...event, seen}))
        const list = shallow(<EventList events={[...events, event01]}/>);
        list.find('div span').at(1).text().should.equal('0');
        list.find('div span').at(1).prop('className').startsWith('col bg-info').should.be.true();
    })
})