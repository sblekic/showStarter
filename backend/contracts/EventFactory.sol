//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IEventImplementation.sol";

/*
    varijable koje počinju sa donjom crtom "_" su private, to jest dostupne samo u ovom ugovoru ili
    se koriste za parametre da bi se izbjeglo name collision
*/

contract EventFactory {
    using Counters for Counters.Counter;
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

    //vjerojatno dohvacati u fn adresu eventOrganizera tako da ga se moze
    //postaviti kao owner eventa u eventImplementation ugovor putem transferOwnership
    //ovo mi je bitno tako da mogu dohvatiti svi eventi registrirani sa strane organizatora (nekakav dash)
    //tehnički ovaj ugovor kreira proxy i po ownableUpgradeable docs on postaje po defaultu owner (testirano i tocno)
    function createEvent(
        string calldata _eventName,
        string calldata _eventSymbol,
        IEventImplementation.EventData memory _eventData
    ) external returns (address) {
        bytes memory eventCalldata = abi.encodeWithSignature(
            "initialize(string,string)",
            _eventName,
            _eventSymbol
        );
        // deploy novog ugovora za event
        BeaconProxy eventProxy = new BeaconProxy(
            address(beacon),
            eventCalldata
        );

        IEventImplementation(address(eventProxy)).setEventData(_eventData);
        events[eventId.current()] = address(eventProxy);
        eventId.increment();
        // da li uopce mora ista vracati? ili ako treba da emitam event?
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
