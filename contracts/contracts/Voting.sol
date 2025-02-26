// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    Candidate[] public candidates; // Use an array instead of a mapping for candidates
    mapping(address => bool) public voters;
    uint public candidatesCount;

    event Voted(uint indexed _candidateId);

    constructor() {
        addCandidate("Alice");
        addCandidate("Bob");
    }

    function addCandidate(string memory _name) private {
        candidates.push(Candidate(candidatesCount + 1, _name, 0));
        candidatesCount++;
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        voters[msg.sender] = true;
        candidates[_candidateId - 1].voteCount++; // Adjust index for array

        emit Voted(_candidateId);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}