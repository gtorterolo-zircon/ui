import Web3 from 'web3';
import truffleContract from 'truffle-contract';
import SampleERC20Contract from '../contracts/SampleERC20.json';
import MIXRContract from '../contracts/MIXR.json';
import FixidityLibMockContract from '../contracts/FixidityLibMock.json';

const BigNumber = require('bignumber.js');

// eslint-disable-next-line no-unused-vars
const getWeb3 = () => new Promise((resolve, reject) => {
    const provider = new Web3.providers.HttpProvider(
        'http://127.0.0.1:9545',
    );
    const web3 = new Web3(provider);
    console.log('No web3 instance injected, using Local web3.');
    resolve(web3);
});

const tokenNumber = (decimals, tokens) => new BigNumber(10)
    .pow(decimals)
    .multipliedBy(tokens)
    .toString(10);

const loadCenas = () => new Promise(async (resolve, reject) => {
    // load web3 and the usar account
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    // set accounts
    const owner = accounts[0];
    const governor = accounts[1];
    const user = accounts[2];
    const walletFees = accounts[3];

    // set some variables
    // const mixrDecimals = 24;
    const someERC20Decimals = 18;

    // verify web3
    if (web3 === undefined) {
        return;
    }

    // load MIXR contract
    const ContractMIXR = truffleContract(MIXRContract);
    ContractMIXR.setProvider(web3.currentProvider);
    const mixr = await ContractMIXR.deployed();

    // load the ERC20 sample
    const ContractSampleERC20 = truffleContract(SampleERC20Contract);
    ContractSampleERC20.setProvider(web3.currentProvider);
    const someERC20 = await ContractSampleERC20.deployed();

    // load fixidity
    const ContractFixidityLibMock = truffleContract(FixidityLibMockContract);
    ContractFixidityLibMock.setProvider(web3.currentProvider);
    const fixidityLibMock = await ContractFixidityLibMock.deployed();

    // load variables
    const fixed1 = new BigNumber(await fixidityLibMock.fixed1());
    const DEPOSIT = await mixr.DEPOSIT();
    const REDEMPTION = await mixr.REDEMPTION();

    // deploy mixr and sample erc20
    await mixr.addGovernor(governor, {
        from: owner,
    });

    // approve tokens
    await mixr.approveToken(someERC20.address, {
        from: governor,
    });
    await mixr.setTokensTargetProportion(
        [someERC20.address],
        [fixed1.toString(10)],
        {
            from: governor,
        },
    );

    // set base fee
    const baseFee = new BigNumber(10).pow(23).toString(10);
    await mixr.setTransactionFee(
        someERC20.address,
        baseFee,
        DEPOSIT,
        {
            from: governor,
        },
    );
    await mixr.setTransactionFee(
        someERC20.address,
        baseFee,
        REDEMPTION,
        {
            from: governor,
        },
    );

    // send tokens to user to use in tests
    await someERC20.transfer(
        user,
        tokenNumber(someERC20Decimals, 100),
        { from: governor },
    );

    // set account to receive fees
    await mixr.setAccountForFees(walletFees, { from: governor });
    resolve('done!!');
});

loadCenas().then((result) => {
    console.log(result);
});
