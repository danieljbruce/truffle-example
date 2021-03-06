// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'
import piggybank_artifacts from '../../build/contracts/PiggyBank.json'
import charity_merchant_user_artifacts from '../../build/contracts/CharityMerchantUser.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);
var PiggyBank = contract(piggybank_artifacts);
var CharityMerchantUser = contract(charity_merchant_user_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var piggyBankAddress;
var charityMerchantUserContractAddress = '0x6e011ab720db6ae432497c4a865d55b6f877c9f3';
var userAddress = '';
var escrowAddress = charityMerchantUserContractAddress;
var merchantAddress = '';
var charityAddress = '';
var userBalance = 0;
var escrowBalance = 0;
var merchantBalance = 0;
var charityBalance = 0;

window.App = {
  updateBalances : function(){
    userAddress = window.web3.eth.accounts[1];
    escrowAddress = charityMerchantUserContractAddress;
    merchantAddress = window.web3.eth.accounts[2];
    charityAddress = window.web3.eth.accounts[3];
    window.web3.eth.getBalance(userAddress, function (error, result) {
      if (!error) {
        // window.web3.toEther(amount, "wei")}
        console.log(result.toNumber());
        var amount = result.toNumber();
        userBalance = window.web3.fromWei(amount, 'ether');
        document.getElementById('balanceUser').innerHTML = userBalance + ' ETH';
      } else {
        console.error(error);
      }
    });
    window.web3.eth.getBalance(escrowAddress, function (error, result) {
      if (!error) {
        // window.web3.toEther(amount, "wei")}
        console.log(result.toNumber());
        var amount = result.toNumber();
        escrowBalance = window.web3.fromWei(amount, 'ether');
        document.getElementById('balanceEscrow').innerHTML = escrowBalance + ' ETH';
      } else {
        console.error(error);
      }
    });
    window.web3.eth.getBalance(merchantAddress, function (error, result) {
      if (!error) {
        // window.web3.toEther(amount, "wei")}
        console.log(result.toNumber());
        var amount = result.toNumber();
        merchantBalance = window.web3.fromWei(amount, 'ether');
        document.getElementById('balanceMerchant').innerHTML = merchantBalance + ' ETH';
      } else {
        console.error(error);
      }
    });
    window.web3.eth.getBalance(charityAddress, function (error, result) {
      if (!error) {
        // window.web3.toEther(amount, "wei")}
        console.log(result.toNumber());
        var amount = result.toNumber();
        charityBalance = window.web3.fromWei(amount, 'ether');
        document.getElementById('balanceCharity').innerHTML = charityBalance + ' ETH';
      } else {
        console.error(error);
      }
    });
  },

  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);
    PiggyBank.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
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

    this.updateBalances();
    //
    // escrowBalance = window.web3.eth.getBalance(escrowAddress, function (error, result) {
    //   if (!error) {
    //     console.log(result.toNumber());
    //   } else {
    //     console.error(error);
    //   }
    // });
    // merchantBalance = window.web3.eth.getBalance(merchantAddress, function (error, result) {
    //   if (!error) {
    //     console.log(result.toNumber());
    //   } else {
    //     console.error(error);
    //   }
    // });
    // charityBalance = window.web3.eth.getBalance(charityAddress, function (error, result) {
    //   if (!error) {
    //     console.log(result.toNumber());
    //   } else {
    //     console.error(error);
    //   }
    // });
    //
    //
    // document.getElementById('balanceEscrow').innerHTML =escrowBalance;
    // document.getElementById('balanceMerchant').innerHTML = merchantBalance;
    // document.getElementById('balanceCharity').innerHTML = charityBalance;
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });

    //this.updatePiggyBalanceAndAddress();
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  },

  sendEtherToEscrow: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amountEscrow").value);
    var eth = window.web3.eth;
    console.log("Merchant Address:", merchantAddress);
    eth.sendTransaction({from:merchantAddress, to:escrowAddress, value: window.web3.toWei(amount, "ether")});
    this.updateBalances();

    // var meta;
    // MetaCoin.deployed().then(function(instance) {
    //   meta = instance;
    //   return meta.sendCoin(receiver, amount, {from: account});
    // }).then(function() {
    //   self.setStatus("Transaction complete!");
    //   self.refreshBalance();
    // }).catch(function(e) {
    //   console.log(e);
    //   self.setStatus("Error sending coin; see log.");
    // });
  },

  printEvents: function(){
    var self = this;
    var contract;
    CharityMerchantUser.deployed().then(function(instance) {
      contract = instance;
      console.log('Obtained contract instance');
      var events = contract.allEvents();
      console.log("Events:");
      console.log(events);
    }).catch(function(e) {
      console.log("Error printing events");
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }

  // piggyDeposit: function(){
  //   var value = document.getElementById("piggyAmount").value;
  //   web3.eth.sendTransaction({from:web3.eth.accounts[0], to: piggyBankAddress, value:value});
  //   this.updatePiggyBalanceAndAddress();
  // },
  // piggyWithdraw: function(){
  //   PiggyBank.deployed().then(function(instance){
  //     instance.get({from: account});
  //   });
  //   this.updatePiggyBalanceAndAddress();
  // },
  // updatePiggyBalanceAndAddress: function(){
  //   PiggyBank.deployed().then(function(instance) {
  //     piggyBankAddress = instance.address;
  //     var address_element = document.getElementById("piggyAddress");
  //     address_element.innerHTML = piggyBankAddress;
  //     return instance.getBalance.call(account, {from: account});
  //   }).then(function(value) {
  //     var balance_element = document.getElementById("piggyBalance");
  //     balance_element.innerHTML = value.toString();
  //   }).catch(function(e) {
  //     console.log(e);
  //     self.setStatus("Error getting balance; see log.");
  //   });
  // }
};

// function tryThis(web3) {
//   // console.log(web3.utils.toBigNumber(7));
//   var a = 159340662;
//   var a_hex = web3.toHex(a); //  result : a_hex = '0x97f5876' but the correct one is '0x097f5876'
//   console.log("Bear");
//   console.log(a_hex);
//     // Checking if Web3 has been injected by the browser (Mist/MetaMask)
//   // Javascript Console
// //   console.log("Bear");
// //   web3.eth.Contract(abi,address).methods['returnsTwoNamed(uint256,uint256)'].call(console.log);
// // //  {0: "23", 1: "This is a test", someUint: "23", someString: "This is a test"}
// //   console.log("Dog");
// //   web3.eth.Contract(abi,address).methods['returnsTwoUnnamed(uint256,uint256)'].call(console.log);
//
// }

window.addEventListener('load', function() {

//  {0: "0", 1: "ERROR: Strings are not yet supported as return values"}

  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {

      console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    //tryThis(window.web3);
  }

  App.start();
});
