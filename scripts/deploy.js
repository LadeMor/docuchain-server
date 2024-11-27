const hre = require("hardhat");

async function main(){
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contract with account", deployer.address);

    const DocumentRegistry = await hre.ethers.getContractFactory("DocumentRegistry");
    const documentRegistry = await DocumentRegistry.deploy();

    console.log("Contract deployed to: ", documentRegistry.runner.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})