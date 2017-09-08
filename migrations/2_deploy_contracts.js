const Splitter = artifacts.require("./Splitter.sol");
module.exports = function(deployer) {
  web3.eth.getAccounts(function (err, accs) {
    deployer.deploy(Splitter,accs[1],accs[2]);
  });
};
