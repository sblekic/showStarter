//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "./IEventImplementation.sol";

contract EventImplementation is
    Initializable,
    OwnableUpgradeable,
    ERC721URIStorageUpgradeable,
    IEventImplementation
{
    function initialize(string memory _eventName, string memory _eventSymbol)
        external
        payable
        initializer
    {
        __Ownable_init();
        __ERC721_init(_eventName, _eventSymbol);
        console.log(
            "%s name service deployed. Symbol: %s",
            _eventName,
            _eventSymbol
        );
    }

    EventData public eventData;

    function setEventData(EventData calldata _eventData) external {
        // ocito mogu samo assign struct na struct jer su istog tipa?
        eventData = _eventData;
    }
}
