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

## Project Info

### Mubai

Contract(keeper compatible): 0x86178273A8FC5069d03A117AD67B504FBc4B9b16

VRF id: 636

IDA contract: 0xF17fA5ff48E041dB8db66956D2AfC83d0ad3E9Fd
