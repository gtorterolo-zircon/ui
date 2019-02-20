import { expect } from 'chai';
import { mount, configure } from 'enzyme';
import { waitForState } from 'enzyme-async-helpers';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import getWeb3 from '../../../utils/getWeb3';
import Wallet from '../Wallet.tsx';


configure({ adapter: new Adapter() });
// the following line will instruct Jest
// to use the mock class instead of the real one
// eslint-disable-next-line no-undef
jest.mock('../../../utils/getWeb3');
// eslint-disable-next-line no-undef
test('Should mount Wallet with success', async () => {
    // Render wallet and all information associated
    const wrapper = mount(<Wallet />);
    // wait until it's fully loaded
    await waitForState(wrapper, state => state.ready === true);
    // expects the state 'ready' to be true, which means, it's loaded
    expect(wrapper.instance().state.ready).to.be.equal(true);
});
