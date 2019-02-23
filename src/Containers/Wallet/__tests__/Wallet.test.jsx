/* globals describe test jest expect */
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import getWeb3 from '../../../utils/getWeb3';
import Wallet from '../Wallet.tsx';


configure({ adapter: new Adapter() });
// the following line will instruct Jest
// to use the mock class instead of the real one
jest.mock('../../../utils/getWeb3');

describe('Basic tests to Wallet Container', () => {
    test('Should mount Wallet with success', async (done) => {
        // Render wallet and all information associated
        const wrapper = mount(<Wallet />);
        // wait until component did load finishes
        await wrapper.instance().componentDidMount();
        // tell the test that it's done
        done();
    });
    test('Should be fully rendered', async (done) => {
        // define an expected value
        const expectedWalletInfo = [
            {
                name: 'MIX',
                priceUSD: 0,
                value: 0,
            },
        ];
        // Render wallet and all information associated
        const wrapper = mount(<Wallet />);
        // wait until component did load finishes
        await wrapper.instance().componentDidMount();
        // wait for one more second, might be rendering
        setTimeout(() => {
            // update the wrapper to get new changes
            wrapper.update();
            // compare the actual value with the expected
            expect(JSON.stringify(wrapper.instance().state.walletInfo))
                .toBe(JSON.stringify(expectedWalletInfo));
            // tell the test that it's done
            done();
        }, 1000);
    });
});
