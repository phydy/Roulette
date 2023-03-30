# Roulette Table

An onchain casino roulette powered by chainlink vrf for randomness and superfluid instant distributions

## How to deploy

clone the repo

```
$ git clone https://github.com/phydy/Roulette.git
```

in your terminal run

```
$ npm i
```

```
$ npx hardhat run scripts/deploy.js
```

it will deploy the roulette contract, vrf and distributor

add the vrf to the vrf registry
add the roullet to the keeper registry

## Test

Test are done in foundry

in your terminal

```
$ cd foundry-con/
```

run

```
forge test
```
