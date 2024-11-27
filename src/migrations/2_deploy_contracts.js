// eslint-disable-next-line no-undef
const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
    const ballotOfficialName = "Official Name"; // Replace with actual value
    const proposal = "Proposal Title"; // Replace with actual proposal text

    // Deploy the Voting contract with the constructor parameters
    await deployer.deploy(Voting, ballotOfficialName, proposal);
};
