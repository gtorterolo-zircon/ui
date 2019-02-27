#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

ganache_port=8545

ganache_running() {
    docker ps | grep ganache_port
}

start_ganache() {
    # We define 10 accounts with balance 1M ether, needed for high-value tests.
    local accounts=(
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501206,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501207,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501208,1000000000000000000000000"
        --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209,1000000000000000000000000"
    )
    # start an instance docker container with ganache-cli
    docker run --rm -d -p 8545:8545 --name cementdao-local-ganache trufflesuite/ganache-cli:v6.3.0 -a 10 "${accounts[@]}"
    # if there's a link file for contracts, remove to create a new one, clean
    if [[ -e ./src/contracts ]]; then
        rm -f ./src/contracts
    fi
    # create the new link
    npm run link-contracts
    # wait for 10 seconds, so ganache can fully start
    sleep 10
    # move to contracts folder (the folders follow a structure, see documentation fro more info)
    cd ../Contracts
    # remove a ./build folder if it exists
    if [[ -e ./build ]]; then
        rm -rf ./build
    fi
    #deploy the contracts
    npx truffle deploy --network development
}

if ganache_running; then
    echo "There is a ganache instance running"
else
    echo "Starting our own ganache instance"
    start_ganache
fi
