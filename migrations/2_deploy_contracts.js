// var ERC20Interface = artifacts.require("./ERC20Interface.sol");
var CrowdSale = artifacts.require("./CrowdSale.sol");

module.exports = function(deployer) {
  // deployer.deploy(ERC20Interface);
  deployer.deploy(CrowdSale);
};
