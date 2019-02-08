#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Allow to use profiles, then I can use fg
set -m

ganache_port=8545

ganache_running() {
    nc -z localhost "$ganache_port"
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

    cd ../Contracts
    ganache-cli --host 0.0.0.0 --port "$ganache_port" "${accounts[@]}" &
    sleep 10
    truffle deploy --network development
}

if ganache_running; then
    echo "Using existing ganache instance"
else
    echo "Starting our own ganache instance"
    start_ganache
fi
