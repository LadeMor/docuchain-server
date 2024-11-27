// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentRegistry{
    struct DocumentMeta{
        string hash;
        uint256 timestamp;
        uint256 userId;
    }

    mapping(string => DocumentMeta) public documents;

    event DocumentStored(string hash, uint256 timestamp, uint256 userId);

    function storeDocumentMeta(string memory hash, uint256 timestamp, uint256 userId) public {
        
        require(bytes(documents[hash].hash).length == 0, "Document already exists");

        documents[hash] = DocumentMeta(hash, timestamp, userId);
        emit DocumentStored(hash, timestamp, userId);
    }
}