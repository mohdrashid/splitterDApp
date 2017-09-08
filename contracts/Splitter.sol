//Splitter contract

pragma solidity ^0.4.6;

contract Splitter{
    address public bob;
    address public carol;
    address public owner;
    uint public result;

    function Splitter(address _bob,address _carol){
        owner=msg.sender;
        bob=_bob;
        carol=_carol;
    }

    function split() public payable returns (bool){
        require(msg.value>0);
        if(msg.sender==owner){
            uint half=msg.value/2;
            if(bob.balance+half<bob.balance) revert();
            if(carol.balance+half<carol.balance) revert();
            bob.transfer(half);
            carol.transfer(half);
            return true;
        }
        return false;
    }

    function getBalance() public constant returns(uint){
        return this.balance;
    }

    function kill() returns (bool success) {
        require(msg.sender == owner);
        owner.transfer(this.balance);
        selfdestruct(owner);
        success=true;
    }
}