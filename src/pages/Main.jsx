import React, { Component } from 'react';
import truffleContract from 'truffle-contract';
import MIXRContract from '../contracts/MIXR.json';
import SampleERC20Contract from '../contracts/SampleERC20.json';
import getWeb3 from '../utils/getWeb3';


/**
 * This is Main Component.
 */
class Main extends Component {
    /**
     * @ignore
     */
    constructor() {
        super();
        /**
         * @type {Object}
         * @property {object} state.web3 - this is the web3 object
         * @property {object} state.mixrContract - this is the contract object
         * @property {object} state.sampleERC20 - this is the contract object
         */
        this.state = {
            web3: null,
            userAccount: null,
            mixrContract: null,
            sampleERC20: null,
            sampleBalance: 0,
            mixrBalance: 0,
        };
    }

    /**
     * @ignore
     */
    async componentDidMount() {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();

            const ContractMIXR = truffleContract(MIXRContract);
            ContractMIXR.setProvider(web3.currentProvider);
            const instanceMIXR = await ContractMIXR.deployed();

            const ContractSampleERC20 = truffleContract(SampleERC20Contract);
            ContractSampleERC20.setProvider(web3.currentProvider);
            const instanceSampleERC20 = await ContractSampleERC20.deployed();

            this.setState({
                web3,
                userAccount: accounts[0],
                mixrContract: instanceMIXR,
                sampleERC20: instanceSampleERC20,
            }, this.runInit);
        } catch (error) {
            console.log('Failed to load web3, accounts, or contract. Check console for details.');
            console.log(error);
        }
    }

    /**
     * this is an entry method to load info.
     */
    async runInit() {
        const {
            web3,
            userAccount,
            mixrContract,
            sampleERC20,
        } = this.state;
        //
        const sampleBalance = web3.utils.fromWei(
            await sampleERC20.balanceOf(userAccount), 'ether',
        );
        const mixrBalance = web3.utils.fromWei(
            await mixrContract.balanceOf(userAccount), 'ether',
        );

        this.setState({ sampleBalance, mixrBalance });
    }

    /**
     * @ignore
     */
    render() {
        const {
            web3,
            sampleBalance,
            mixrBalance,
        } = this.state;
        if (!web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <p>
                    SAMPLE:
                    {' '}
                    {sampleBalance}
                </p>
                <p>
                    MIXR:
                    {' '}
                    {mixrBalance}
                </p>
            </div>
        );
    }
}

export default Main;
