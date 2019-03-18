const Web3 = require('web3');
const truffleContract = require('truffle-contract');
const BigNumber = require('bignumber.js');
// eslint-disable-next-line import/no-extraneous-dependencies
const portscanner = require('portscanner');

const SampleERC20Contract = require('../src/contracts/SampleDetailedERC20.json');
const MIXRContract = require('../src/contracts/MIXR.json');
const WhitelistContract = require('../src/contracts/Whitelist.json');
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
    // const mixrDecimals = 24;
    const defaultERC20Decimals = 18;
    const tokensToDeploy = 525000;
    const tokensToUser = 50;
    const tokensToDeposit = tokensToDeploy - tokensToUser;

    // verify web3
    if (web3 === undefined) {
        return;
    }

    // load MIXR contract
    const ContractMIXR = truffleContract(MIXRContract);
    ContractMIXR.setProvider(web3.currentProvider);
    const mixr = await ContractMIXR.deployed();

    // load MIXR contract
    const ContractWhitelist = truffleContract(WhitelistContract);
    ContractWhitelist.setProvider(web3.currentProvider);
    const whitelist = await ContractWhitelist.deployed();

    // load the ERC20 sample
    const ContractSampleERC20 = truffleContract(SampleERC20Contract);
    ContractSampleERC20.setProvider(web3.currentProvider);
    const ERC20Gemini = await ContractSampleERC20.new(
        governor,
        tokenNumber(defaultERC20Decimals, tokensToDeploy),
        defaultERC20Decimals,
        'Gemini Dollar',
        'GUSD',
        { from: governor },
    );
    const ERC20Tether = await ContractSampleERC20.new(
        governor,
        tokenNumber(defaultERC20Decimals, tokensToDeploy),
        defaultERC20Decimals,
        'Tether',
        'USDT',
        { from: governor },
    );
    const ERC20True = await ContractSampleERC20.new(
        governor,
        tokenNumber(defaultERC20Decimals, tokensToDeploy),
        defaultERC20Decimals,
        'True USD',
        'TUSD',
        { from: governor },
    );
    const ERC20USD = await ContractSampleERC20.new(
        governor,
        tokenNumber(defaultERC20Decimals, tokensToDeploy),
        defaultERC20Decimals,
        'USD Coin',
        'USDC',
        { from: governor },
    );
    const ERC20Paxos = await ContractSampleERC20.new(
        governor,
        tokenNumber(defaultERC20Decimals, tokensToDeploy),
        defaultERC20Decimals,
        'Paxos Coin',
        'PAX',
        { from: governor },
    );

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
    await whitelist.addGovernor(governor, {
        from: owner,
    });

    console.log('Setting proportion ...');
    console.log(`Sending some tokens to ${user} ...`);
    // set base fee
    const baseFee = new BigNumber(10).pow(23).toString(10);
    // set account to receive fees
    await mixr.setBILDContract(walletFees, { from: owner });
    // define amounts
    const tokensInDeposit = tokenNumber(defaultERC20Decimals, tokensToDeposit - tokensToUser);


    // add first token
    await mixr.registerStandardToken(ERC20Gemini.address, web3.utils.utf8ToHex('GUSD'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Gemini.address,
        ],
        [
            fixed1.toString(10),
        ],
        { from: governor },
    );
    //
    await mixr.setBaseFee(baseFee, DEPOSIT, { from: governor });
    await mixr.setBaseFee(baseFee, REDEMPTION, { from: governor });
    //
    await ERC20Gemini.transfer(user, tokenNumber(defaultERC20Decimals, tokensToUser), { from: governor });
    // approve and deposit
    await ERC20Gemini.approve(mixr.address, tokensInDeposit, { from: governor });
    await mixr.depositToken(ERC20Gemini.address, tokensInDeposit, { from: governor });


    // add second token
    await mixr.registerStandardToken(ERC20Tether.address, web3.utils.utf8ToHex('USDT'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Gemini.address,
            ERC20Tether.address,
        ],
        [
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 2)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 2)).toString(10),
        ],
        { from: governor },
    );
    //
    await ERC20Tether.transfer(user, tokenNumber(defaultERC20Decimals, tokensToUser), { from: governor });
    // approve and deposit
    await ERC20Tether.approve(mixr.address, tokensInDeposit, { from: governor });
    await mixr.depositToken(ERC20Tether.address, tokensInDeposit, { from: governor });


    // add third token
    await mixr.registerStandardToken(ERC20True.address, web3.utils.utf8ToHex('TUSD'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Gemini.address,
            ERC20Tether.address,
            ERC20True.address,
        ],
        [
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 4)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 4)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(2, 4)).toString(10),
        ],
        { from: governor },
    );
    //
    await ERC20True.transfer(user, tokenNumber(defaultERC20Decimals, tokensToUser), { from: governor });
    // approve and deposit
    await ERC20True.approve(mixr.address, tokensInDeposit, { from: governor });
    await mixr.depositToken(ERC20True.address, tokensInDeposit, { from: governor });


    // add fourth token
    await mixr.registerStandardToken(ERC20USD.address, web3.utils.utf8ToHex('USDC'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Gemini.address,
            ERC20Tether.address,
            ERC20True.address,
            ERC20USD.address,
        ],
        [
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 4)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 4)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 4)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 4)).toString(10),
        ],
        { from: governor },
    );
    //
    await ERC20USD.transfer(user, tokenNumber(defaultERC20Decimals, tokensToUser), { from: governor });
    // approve and deposit
    await ERC20USD.approve(mixr.address, tokensInDeposit, { from: governor });
    await mixr.depositToken(ERC20USD.address, tokensInDeposit, { from: governor });


    // add fifth token
    await mixr.registerStandardToken(ERC20Paxos.address, web3.utils.utf8ToHex('PAX'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Gemini.address,
            ERC20Tether.address,
            ERC20True.address,
            ERC20USD.address,
            ERC20Paxos.address,
        ],
        [
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 5)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 5)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 5)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 5)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 5)).toString(10),
        ],
        { from: governor },
    );
    //
    await ERC20Paxos.transfer(user, tokenNumber(defaultERC20Decimals, tokensToUser), { from: governor });
    // approve and deposit
    await ERC20Paxos.approve(mixr.address, tokensInDeposit, { from: governor });
    await mixr.depositToken(ERC20Paxos.address, tokensInDeposit, { from: governor });
};

configContracts().then(() => {
    console.log('Success!');
});
