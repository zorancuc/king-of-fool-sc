pragma solidity ^0.7.6;

import "./utils/SafeMath.sol";
import "./utils/Ownable.sol";

// NOTE: This is just a test contract, please delete me

contract KingOfFool is Ownable {
  using SafeMath for uint256;

  address public team;
  address[] public users;

  address public addrOfFool;
  uint256 public amountOfFool;
  
  event DepositETH(address indexed depositor, address indexed receiver, uint256 amount);

  constructor () {
  }

  function depositETH() external payable {
    require(msg.value >= amountOfFool * 15 / 10, 'KingOfFool: INSUFFICIENT AMOUNT');
    if (amountOfFool != 0) {

      (bool success, ) = addrOfFool.call{ value: msg.value}("");
      require(success, 'Address: unable to send value, recipient may have reverted');
    }

    address receiver = addrOfFool;
    addrOfFool = msg.sender;
    amountOfFool = msg.value;

    emit DepositETH(msg.sender, receiver, msg.value);
  }
}
