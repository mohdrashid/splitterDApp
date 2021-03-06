// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import splitter_artifacts from '../../build/contracts/Splitter.json'

// Splitter is our usable abstraction, which we'll use through the code below.
var Splitter = contract(splitter_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var alice;

window.App = {
  setBalance:function(address,divID){
    var balanceDiv = document.getElementById(divID);
    const balance=web3.fromWei(web3.eth.getBalance(address),"ether");
    balanceDiv.innerHTML=balance;
  },
  start: function () {
    var self = this;

    // Bootstrap the Splitter abstraction for Use.
    Splitter.setProvider(web3.currentProvider)

    // Get the initial alice balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }
      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
      accounts = accs
      alice = accounts[0]
      self.refreshBalance()
    })
  },

  setStatus: function (message) {
    var status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshBalance: function () {

    var self = this;
    //Setting Addresses
    this.setBalance(alice,'alice');
    this.setBalance(accounts[1],'bob');
    this.setBalance(accounts[2],'carol');

    var meta;

    Splitter.deployed().then(function (instance) {
      meta = instance;
      return meta.getBalance.call(alice, { from: alice })
    }).then(function (value) {
      var balance_element = document.getElementById('balance')
      balance_element.innerHTML = web3.fromWei(value,"ether");
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    });
  },

  split: function () {
    var self = this

    var amount = parseInt(document.getElementById('amount').value)
    var selectedAccount = parseInt(document.getElementById('selectedAccount').value)||0;
    var receiver1=parseInt(document.getElementById('receiver1').value)||0;
    var receiver2=parseInt(document.getElementById('receiver2').value)||0;

    this.setStatus('Initiating transaction... (please wait)')

    var meta;
    Splitter.deployed().then(function (instance) {
      meta = instance;
      return meta.split(accounts[receiver1],accounts[receiver2],{ from: accounts[selectedAccount], value: web3.toWei(amount)});
    }).then(function (state) {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  },
  kill:function () {
    var meta;
    var self=this;
    Splitter.deployed().then(function (instance) {
      meta = instance
      return meta.kill({ from: alice });
    }).then(function (state) {
      console.log(state);
      self.setStatus('Transaction destroyed!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 Splitter, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  App.start()
})
