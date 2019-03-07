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
    const ERC20Complex = await ContractSampleERC20.new(
        accounts[1],
        new BigNumber(10).pow(18).multipliedBy(525).toString(10),
        18,
        'COMPLEX',
        'CLP',
        { from: governor },
    );
    const ERC20Rare = await ContractSampleERC20.new(
        accounts[1],
        new BigNumber(10).pow(18).multipliedBy(525).toString(10),
        18,
        'RARE',
        'RR',
        { from: governor },
    );
    const ERC20Cosmic = await ContractSampleERC20.new(
        accounts[1],
        new BigNumber(10).pow(18).multipliedBy(525).toString(10),
        18,
        'COSMIC',
        'CC',
        { from: governor },
    );
    const ERC20Galactic = await ContractSampleERC20.new(
        accounts[1],
        new BigNumber(10).pow(18).multipliedBy(525).toString(10),
        18,
        'GALACTIC',
        'GLC',
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


    // add second token
    await mixr.registerStandardToken(ERC20Complex.address, web3.utils.utf8ToHex('COMPLEX'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Sample.address,
            ERC20Complex.address,
        ],
        [
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 2)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 2)).toString(10),
        ],
        { from: governor },
    );
    //
    await mixr.setTransactionFee(ERC20Complex.address, baseFee, DEPOSIT, { from: governor });
    await mixr.setTransactionFee(ERC20Complex.address, baseFee, REDEMPTION, { from: governor });
    //
    await ERC20Complex.transfer(user, tokenNumber(defaultERC20Decimals, 100), { from: governor });
    // approve and deposit
    await mixr.approve(mixr.address, MIXToMint.toString(10), { from: user });
    await ERC20Complex.approve(mixr.address, tokensToDeposit.toString(10), { from: user });
    await mixr.depositToken(ERC20Complex.address, tokensToDeposit.toString(10), { from: user });


    // add second token
    await mixr.registerStandardToken(ERC20Rare.address, web3.utils.utf8ToHex('RARE'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Sample.address,
            ERC20Complex.address,
            ERC20Rare.address,
        ],
        [
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 4)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(1, 4)).toString(10),
            new BigNumber(await fixidityLibMock.newFixedFraction(2, 4)).toString(10),
        ],
        { from: governor },
    );
    //
    await mixr.setTransactionFee(ERC20Rare.address, baseFee, DEPOSIT, { from: governor });
    await mixr.setTransactionFee(ERC20Rare.address, baseFee, REDEMPTION, { from: governor });
    //
    await ERC20Rare.transfer(user, tokenNumber(defaultERC20Decimals, 100), { from: governor });
    // approve and deposit
    await mixr.approve(mixr.address, MIXToMint.toString(10), { from: user });
    await ERC20Rare.approve(mixr.address, tokensToDeposit.toString(10), { from: user });
    await mixr.depositToken(ERC20Rare.address, tokensToDeposit.toString(10), { from: user });


    // add second token
    await mixr.registerStandardToken(ERC20Cosmic.address, web3.utils.utf8ToHex('COSMIC'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Sample.address,
            ERC20Complex.address,
            ERC20Rare.address,
            ERC20Cosmic.address,
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
    await mixr.setTransactionFee(ERC20Cosmic.address, baseFee, DEPOSIT, { from: governor });
    await mixr.setTransactionFee(ERC20Cosmic.address, baseFee, REDEMPTION, { from: governor });
    //
    await ERC20Cosmic.transfer(user, tokenNumber(defaultERC20Decimals, 100), { from: governor });
    // approve and deposit
    await mixr.approve(mixr.address, MIXToMint.toString(10), { from: user });
    await ERC20Cosmic.approve(mixr.address, tokensToDeposit.toString(10), { from: user });
    await mixr.depositToken(ERC20Cosmic.address, tokensToDeposit.toString(10), { from: user });


    // add second token
    await mixr.registerStandardToken(ERC20Galactic.address, web3.utils.utf8ToHex('GALACTIC'), 18, { from: governor });
    await mixr.setTokensTargetProportion(
        [
            ERC20Sample.address,
            ERC20Complex.address,
            ERC20Rare.address,
            ERC20Cosmic.address,
            ERC20Galactic.address,
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
    await mixr.setTransactionFee(ERC20Galactic.address, baseFee, DEPOSIT, { from: governor });
    await mixr.setTransactionFee(ERC20Galactic.address, baseFee, REDEMPTION, { from: governor });
    //
    await ERC20Galactic.transfer(user, tokenNumber(defaultERC20Decimals, 100), { from: governor });
    // approve and deposit
    await mixr.approve(mixr.address, MIXToMint.toString(10), { from: user });
    await ERC20Galactic.approve(mixr.address, tokensToDeposit.toString(10), { from: user });
    await mixr.depositToken(ERC20Galactic.address, tokensToDeposit.toString(10), { from: user });
};

configContracts().then(() => {
    console.log('Success!');
});
