//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IEventImplementation.sol";

/*
    varijable koje počinju sa donjom crtom "_" su private, to jest dostupne samo u ovom ugovoru ili
    se koriste za parametre da bi se izbjeglo name collision
*/

contract EventFactory {
    using Counters for Counters.Counter;
    Counters.Counter private eventId;

    UpgradeableBeacon immutable beacon;

    struct RegisteredEvent {
        address proxyAddress;
        string Eventname;
        // eventDate
        // eventLocation
    }

    mapping(uint256 => RegisteredEvent) events;

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
    function createEvent(IEventImplementation.EventData memory _eventData)
        external
        returns (address)
    {
        eventId.increment();
        string memory tokenName = string.concat(
            "Showstarter Event ",
            Strings.toString(eventId.current())
        );
        // !!! testiraj ako parametri funkcioniraju
        bytes memory eventCalldata = abi.encodeWithSignature(
            "initialize(string,string)",
            tokenName,
            "SHOW"
        );
        // deploy novog ugovora za event
        BeaconProxy eventProxy = new BeaconProxy(
            address(beacon),
            eventCalldata
        );

        IEventImplementation(address(eventProxy)).setEventData(_eventData);
        //adaptirati za struct RegisteredEvent koji sam napisao
        events[eventId.current()] = RegisteredEvent(
            address(eventProxy),
            _eventData.name
        );
        // da li uopce mora ista vracati? ili ako treba da emitam event?
        return address(eventProxy);
    }

    function getEventBeacon() external view returns (address) {
        return address(beacon);
    }

    function getEventById(uint32 _eventId)
        external
        view
        returns (RegisteredEvent memory)
    {
        //vrati adresu shipa
        return events[_eventId];
    }
}
