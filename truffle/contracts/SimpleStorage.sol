// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SimpleStorage {
  string value;

  function read() public view returns (string memory) {
    return value;
  }

  function write(string memory newValue) public {
    value = newValue;
  }
}
