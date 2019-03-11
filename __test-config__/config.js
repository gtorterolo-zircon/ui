const Web3 = require('web3');
const truffleContract = require('truffle-contract');
const BigNumber = require('bignumber.js');
// eslint-disable-next-line import/no-extraneous-dependencies
const portscanner = require('portscanner');

const SampleERC20Contract = require('../src/contracts/SampleDetailedERC20.json');
const MIXRContract = require('../src/contracts/MIXR.json');
const FixidityLibMockContract = require('../src/contracts/FixidityLibMock.json');
const FeesbMockContract = require('../src/contracts/FeesMock.json');


// eslint-disable-next-line no-unused-vars
const getWeb3 = () => new Promise((resolve, reject) => {
    let port;
    // we should have a standard port but meeh.
    portscanner.checkPortStatus(8545, '127.0.0.1', (error, status) => {
        // Status is 'open' if currently in use or 'closed' if available
        port = (status === 'open') ? 8545 : 9545;
        const provider = new Web3.providers.HttpProvider(
            `http://127.0.0.1:${port}`,
        );
        const web3 = new Web3(provider);
        // eslint-disable-next-line no-console
        console.log('No web3 instance injected, using Local web3.');
        resolve(web3);
    });
});

const tokenNumber = (decimals, tokens) => new BigNumber(10)
    .pow(decimals)
    .multipliedBy(tokens)
    .toString(10);

// eslint-disable-next-line no-unused-vars
const configContracts = async () => {
    console.log('Starting ...');
    // load web3 and the usar account
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    // set accounts
    const owner = accounts[0];
    const governor = accounts[1];
    const user = accounts[2];
    const walletFees = accounts[3];

    // set some variables
    const mixrDecimals = 24;
    const defaultERC20Decimals = 18;
    const tokensDeposit = 2;

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
    const ERC20Sample = await ContractSampleERC20.deployed();

    // load fixidity
    const ContractFixidityLibMock = truffleContract(FixidityLibMockContract);
    ContractFixidityLibMock.setProvider(web3.currentProvider);
    const fixidityLibMock = await ContractFixidityLibMock.deployed();

    // load fixidity
    const ContractFeesbMock = truffleContract(FeesbMockContract);
    ContractFeesbMock.setProvider(web3.currentProvider);
    const feesbMock = await ContractFeesbMock.deployed();

    // load variables
    const fixed1 = new BigNumber(await fixidityLibMock.fixed1());
    const DEPOSIT = await feesbMock.DEPOSIT();
    const REDEMPTION = await feesbMock.REDEMPTION();

    console.log('Setting permitions ...');
    // deploy mixr and sample erc20
    await mixr.addGovernor(governor, {
        from: owner,
    });

    console.log('Setting proportion ...');
    console.log(`Sending some tokens to ${user} ...`);
    // set base fee
    const baseFee = new BigNumber(10).pow(23).toString(10);
    // set account to receive fees
    await mixr.setStakeholderAccount(walletFees, { from: governor });
    // define amounts
    const tokensToDeposit = tokenNumber(defaultERC20Decimals, tokensDeposit);
    const MIXToMint = new BigNumber(10).pow(mixrDecimals).multipliedBy(tokensDeposit);


    // add first token
    await mixr.registerStandardToken(ERC20Sample.address, web3.utils.utf8ToHex('SAMPLE'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Sample.address,
        ],
        [
            fixed1.toString(10),
        ],
        { from: governor },
    );
    //
    await mixr.setTransactionFee(ERC20Sample.address, baseFee, DEPOSIT, { from: governor });
    await mixr.setTransactionFee(ERC20Sample.address, baseFee, REDEMPTION, { from: governor });
    //
    await ERC20Sample.transfer(user, tokenNumber(defaultERC20Decimals, 100), { from: governor });
    // approve and deposit
    await mixr.approve(mixr.address, MIXToMint.toString(10), { from: user });
    await ERC20Sample.approve(mixr.address, tokensToDeposit.toString(10), { from: user });
    await mixr.depositToken(ERC20Sample.address, tokensToDeposit.toString(10), { from: user });
};

configContracts().then(() => {
    console.log('Success!');
});
