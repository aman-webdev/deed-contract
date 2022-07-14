// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

contract Deed {
    address public lawyer;
    address payable public beneficiary;
    uint public amount;
    uint public earliest;

    constructor(
        address _lawyer,
        address payable _beneficiary,
        uint _amount,
        uint _fromNow
    ) payable {
        require(
            msg.value == _amount,
            "The amount sent should be equal to the deed amount"
        );
        lawyer = _lawyer;
        beneficiary = _beneficiary;
        amount = _amount;
        earliest = _fromNow + block.timestamp;
    }

    function withdraw() public onlyLawyer {
        require(block.timestamp >= earliest, "Withdrawn too early :(");
        (bool callSuccess, ) = beneficiary.call{value: amount}("");
        require(callSuccess, "Transaction did not succeed");
    }

    modifier onlyLawyer() {
        require(msg.sender == lawyer, "Only lawyer allowed!");
        _;
    }
}
