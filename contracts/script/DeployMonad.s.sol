// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {OffchainAttestationRegistry} from "../src/OffchainAttestationRegistry.sol";
import {CreditOracle} from "../src/CreditOracle.sol";
import {LendingPool} from "../src/LendingPool.sol";

/**
 * @title DeployMonad — deploys all three Credence Protocol contracts on Monad Testnet
 *                      and wires them up.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEPLOY (no verification):
 *   forge script script/DeployMonad.s.sol:DeployMonad \
 *     --rpc-url monad_testnet \
 *     --broadcast \
 *     -vvvv
 *
 * DEPLOY + VERIFY (Blockscout / MonadExplorer):
 *   forge script script/DeployMonad.s.sol:DeployMonad \
 *     --rpc-url monad_testnet \
 *     --broadcast \
 *     --verify \
 *     --verifier blockscout \
 *     --verifier-url https://testnet.monadexplorer.com/api \
 *     -vvvv
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Requires in .env:
 *   MONAD_TESTNET_RPC=https://testnet-rpc.monad.xyz
 *   MONAD_TESTNET_PRIVATE_KEY=<your funded testnet wallet private key>
 *   (Get MON from faucet: https://faucet.monad.xyz)
 *
 * After deploy, copy the three addresses logged at the bottom into .env as:
 *   ATTESTATION_REGISTRY_ADDRESS=<address>
 *   CREDIT_ORACLE_ADDRESS=<address>
 *   LENDING_POOL_ADDRESS=<address>
 *
 * Also update frontend/.env (or set VITE_ vars):
 *   VITE_REGISTRY_ADDRESS=<address>
 *   VITE_ORACLE_ADDRESS=<address>
 *   VITE_POOL_ADDRESS=<address>
 */
contract DeployMonad is Script {
    function run() external {
        uint256 deployerPk = vm.envUint("MONAD_TESTNET_PRIVATE_KEY");
        address deployer = vm.addr(deployerPk);

        console.log("============================================");
        console.log("  Credence Protocol - Monad Testnet Deploy");
        console.log("============================================");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        require(deployer.balance > 0.05 ether, "Deployer needs >= 0.05 MON. Get MON at https://faucet.monad.xyz");

        vm.startBroadcast(deployerPk);

        // 1. OffchainAttestationRegistry — no dependencies
        OffchainAttestationRegistry registry = new OffchainAttestationRegistry(deployer);
        console.log("OffchainAttestationRegistry:", address(registry));

        // 2. CreditOracle — reads from registry
        CreditOracle oracle = new CreditOracle(deployer, registry);
        console.log("CreditOracle:             ", address(oracle));

        // 3. Wire oracle authorization (one-shot, irreversible)
        registry.setCreditOracle(address(oracle));
        console.log("Registry authorized Oracle for updateHistoricalScore");

        // 4. LendingPool — reads composite score from oracle
        LendingPool pool = new LendingPool(deployer, oracle);
        console.log("LendingPool:              ", address(pool));

        vm.stopBroadcast();

        console.log("");
        console.log("=== DEPLOYMENT COMPLETE ===");
        console.log("");
        console.log(">> Copy these into .env:");
        console.log("ATTESTATION_REGISTRY_ADDRESS=", address(registry));
        console.log("CREDIT_ORACLE_ADDRESS=       ", address(oracle));
        console.log("LENDING_POOL_ADDRESS=        ", address(pool));
        console.log("");
        console.log(">> Copy these into frontend/.env:");
        console.log("VITE_REGISTRY_ADDRESS=", address(registry));
        console.log("VITE_ORACLE_ADDRESS=  ", address(oracle));
        console.log("VITE_POOL_ADDRESS=    ", address(pool));
        console.log("");
        console.log(">> Verify on MonadScan:");
        console.log(string.concat("  https://testnet.monadexplorer.com/address/", vm.toString(address(registry))));
        console.log(string.concat("  https://testnet.monadexplorer.com/address/", vm.toString(address(oracle))));
        console.log(string.concat("  https://testnet.monadexplorer.com/address/", vm.toString(address(pool))));
    }
}
