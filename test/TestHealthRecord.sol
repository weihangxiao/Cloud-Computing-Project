pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/healthRecord.sol";


contract TestHealthRecord {
    // The address of the healthRecord contract to be tested
    HealthRecord record = HealthRecord(DeployedAddresses.HealthRecord());

    // Testing the addUser() function
    function testAddUser() public {
        bool userExist = record.userExist();
        Assert.equal(
            userExist,
            false,
            "Before addUser it shouldn't have record."
        );

        record.addUser("name");
        record.addRecord(37, true, 200);
        userExist = record.userExist();

        Assert.equal(
            userExist,
            true,
            "After addUser it should have record."
        );
    }

    // Testing retrieval of a single pet's owner
    // function testHealthCode() public {
    //     uint256 code = record.getUserCode();

    //     Assert.equal(code, 1, "code should be 1.");
    // }

    // The id of the pet that will be used for testing
    // uint256 expectedPetId = 8;

    //The expected owner of adopted pet is this contract
    // address expectedAdopter = address(this);
}
