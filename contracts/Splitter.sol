//Splitter contract

pragma solidity ^0.4.6;

contract Splitter{
    address public owner;
    mapping(address=>uint) balances;

    function Splitter(){
        owner=msg.sender;
    }

    function split(address receiver1,address receiver2) public payable returns (bool){
        require(msg.value>0&&receiver1!=0&&receiver2!=0);
        uint half=msg.value/2;
        uint leftover = msg.value - (2*half);
        if(receiver1.balance+half<receiver1.balance) revert();
        if(receiver2.balance+half<receiver2.balance) revert();
        if((msg.sender.balance+leftover)<msg.sender.balance) revert();
        balances[receiver1]+=half;
        balances[receiver2]+=half;
        balances[msg.sender]+=leftover;
        return true;
    }

    function getBalance(address account) public constant returns(uint){
        return balances[account];
    }

    function withdrawBalance() public returns(bool success) {
        if(msg.sender==0||balances[msg.sender]<=0) revert();
        if((msg.sender.balance+balances[msg.sender])<msg.sender.balance) revert();
        msg.sender.transfer(balances[msg.sender]);
        success=true;
    }

    function kill() returns (bool success) {
        require(msg.sender == owner);
        owner.transfer(this.balance);
        selfdestruct(owner);
        success=true;
    }
}