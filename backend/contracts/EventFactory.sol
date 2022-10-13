//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/*
    varijable koje počinju sa donjom crtom "_" su private, to jest dostupne samo u ovom ugovoru ili
    se koriste za parametre da bi se izbjeglo name collision
*/

contract EventFactory {
    using Counters for Counters.Counter;
    // varijable sa
    Counters.Counter private eventId;

    UpgradeableBeacon immutable beacon;

    // nekako cu morati pratiti kreirane erc721Evente
    mapping(uint256 => address) events;

    constructor(address _eventLogic) {
        //beacon = new ShipBeacon(_initBlueprint);
        beacon = new UpgradeableBeacon(_eventLogic);
        // moram prebaciti ownership na sebe kako bih mogao promijeniti adresu beacona (impl contract v2)
        // ako ovo ne napravim ugovor će biti vlasnik pa neću moći pozvati određene funkcije
        beacon.transferOwnership(msg.sender);
    }

    function createEvent(
        string calldata _eventName,
        string calldata _eventSymbol
    ) external returns (address) {
        bytes memory eventCalldata = abi.encodeWithSignature(
            "initialize(string,string)",
            _eventName,
            _eventSymbol
        );
        BeaconProxy eventProxy = new BeaconProxy(
            address(beacon),
            eventCalldata
        );
        events[eventId.current()] = address(eventProxy);
        return address(eventProxy);
    }

    function getEventBeacon() external view returns (address) {
        return address(beacon);
    }

    function getEventAddress(uint32 _eventId) external view returns (address) {
        //vrati adresu shipa
        return events[_eventId];
    }
}
