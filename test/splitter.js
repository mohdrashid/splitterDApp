/**
 * Created by rashid on 9/7/17.
 */
const Splitter=artifacts.require('./Splitter.sol');
const Web3 = require("web3");
let web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
contract("Splitter",(accounts)=>{

    let contract;
    const alice=accounts[0];
    const bob=accounts[1];
    const carol=accounts[2];

    beforeEach(()=>{
        return Splitter.new(bob,carol,{from:alice}).then(instance=>{
            contract=instance;
        });
    });

    it("should send 1/2 coins each to bob and carol", function() {
        const amount=web3.toWei(1);
        let bobBalance=web3.eth.getBalance(bob);
        let carolBalance=web3.eth.getBalance(carol);
        return contract.split({from:alice,value:amount}).then(()=>{
            let bobBalanceAfter=web3.eth.getBalance(bob);
            let carolBalanceAfter=web3.eth.getBalance(carol);
            assert.strictEqual(bobBalanceAfter.equals(bobBalance.plus(amount/2)),true,"Split function did not work for bob");
            assert.strictEqual(carolBalanceAfter.equals(carolBalance.plus(amount/2)),true,"Split function did not work for Carol");
        })
    });
});