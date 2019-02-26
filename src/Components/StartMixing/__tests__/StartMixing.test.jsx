/* globals describe test jest expect */
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import StartMixing from '../StartMixing.tsx';


// setup the adapter
configure({ adapter: new Adapter() });
// some basic tests
describe('Basic tests to StartMixing Component', () => {
    test('Should mount StartMixing with success', () => {
        // mock a callback
        const mockCallBack = jest.fn();
        // instantiate component
        shallow((<StartMixing click={mockCallBack} />));
    });
    test('Click with success if props are correct', () => {
        // mock a callback
        const mockCallBack = jest.fn();
        // instantiate component
        const wrapper = shallow((<StartMixing click={mockCallBack} />));
        // find the element and simulate a click
        wrapper.find('button').simulate('click');
        // verify is the method was called only once
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
    test('Click with no success if props are wrong', () => {
        // mock a callback
        const mockCallBack = jest.fn();
        // instantiate component with wrong props
        const wrapper = shallow((<StartMixing onClick={mockCallBack} />));
        // find the element and simulate a click
        wrapper.find('button').simulate('click');
        // verify is the method was not called
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
});
