//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IEventImplementation {
    struct EventData {
        uint16 price;
        string name;
    }

    function setEventData(EventData memory _eventData) external;
}
