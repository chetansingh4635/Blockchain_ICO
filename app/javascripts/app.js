// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import CrowdSale_artifacts from '../../build/contracts/CrowdSale.json'

// CrowdSale is our usable abstraction, which we'll use through the code below.
var CrowdSale = contract(CrowdSale_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var tokenInstance;
window.App = {
  start: function () {
    var self = this;

    // setting the provider to access the contract information
    CrowdSale.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
    });
  },

  setStatus: function (message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

//to refresh the wallet information each time page reloads
 
  refreshBalance: function () {
    var self = this;
    var bal = web3.eth.getBalance(accounts[1]).toString();
    bal = bal.slice(0, bal.length - 18);
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = parseInt(bal);
     CrowdSale.deployed().then(function (instance) {
    var balance_element = document.getElementById("address");
    balance_element.innerHTML = instance.address;
        var funds = web3.eth.getBalance(instance.address).toString();
        if(funds == ""){
          var fund_element = document.getElementById("fund_received");
          fund_element.innerHTML = 0;
        }
        else{
          funds = funds.slice(0, funds.length - 18);
          var fund_element = document.getElementById("fund_received");
          fund_element.innerHTML = parseInt(funds);
        }

  });




    CrowdSale.deployed().then(function (instance) {
      var res = instance.tokens.call(accounts[1]).then(function (res, err) {
        document.getElementById('token_received').innerText = res;
      });

      self.setStatus("Transaction complete!");
    });
    CrowdSale.deployed().then(function (instance) {
      tokenInstance = instance;
      return instance.balanceOf(receiver);
    }).then(function (data) {
      
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function (e) {
      console.log(e);
      self.setStatus("Error sending coin see log.");
    });
  },


// Buy Token Method
  sendCoin: function () {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    CrowdSale.deployed().then(function (instance) {
      tokenInstance = instance;
      return instance.transfer(receiver,amount,{from: accounts[1], to: receiver, value: web3.toWei(amount, "ether")});
    }).then(function (data) {
      console.log(data);
      var res = tokenInstance.tokens.call(accounts[1]).then(function (res, err) {
        document.getElementById('token_received').innerText = res;
      });

      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function (e) {
      console.log(e);
      self.setStatus("Error sending coin see log.");
    });
    
  }
};

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 CrowdSale, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
