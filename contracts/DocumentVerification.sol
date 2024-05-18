// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract DocumentRegistry {
    mapping(bytes32 => bool) public documents;
    
    event DocumentAdded(bytes32 docHash, address indexed by);
    
    function addDocument(bytes32 docHash) public {
        require(!documents[docHash], "Document already exists");
        
        documents[docHash] = true;
        emit DocumentAdded(docHash, msg.sender);
    }
    
    function isDocumentRegistered(bytes32 docHash) public view returns (bool) {
        return documents[docHash];
    }
}
