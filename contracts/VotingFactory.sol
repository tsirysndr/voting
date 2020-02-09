pragma solidity >=0.4.21 <0.7.0;

import './Voting.sol';

contract VotingFactory {
  struct voting {
    address creator;
    address instance;
    string name;
    uint timestamp;
    bool instanceExists;
    uint start;
    uint end;
  }
  mapping(address => mapping(bytes32 => voting)) public votingContracts;
  voting[] public allVotings;
  uint public contractsCreated;

  function newVotingInstance(string memory _name, bytes32[] memory proposalNames, uint _startDate, uint _endDate) public returns(address) {
    require(proposalNames.length > 2, "");
    bytes32 _id = keccak256(abi.encodePacked(msg.sender, _name));
    require(votingContracts[msg.sender][_id].instanceExists == false, "There is already a Voting with this name");
    Voting newVotingContract = new Voting(msg.sender, proposalNames, _startDate, _endDate);
    address deployedAddress = address(newVotingContract);

    voting memory newVoting = voting(msg.sender, deployedAddress, _name, block.timestamp, true, _startDate, _endDate);
    allVotings.push(newVoting);

    votingContracts[msg.sender][_id] = newVoting;
    contractsCreated++;
    return deployedAddress;
  }
  
}
