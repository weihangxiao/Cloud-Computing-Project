pragma solidity ^0.4.18;


contract healthRecord {
    mapping(address => User) internal users;

    struct Record {
        uint256 temp;
        bool hasSymp;
        uint256 total; // total quarantine days required
        uint256 counter; // number of quarantine days
        uint256 code; //0: green; 1:yellow; 2:red
    }

    struct User {
        string name;
        address id;
        Record record;
        bool hasRecord;
    }

    // exist or not
    modifier checkUser(address id) {
        User u = users[id];
        require(u.id > 0x0);
        _;
    }

    //initial record
    function addUser(string _name, uint256 _temp, bool _hasSymp) public {
        User u = users[msg.sender];
        require(keccak256(_name) != keccak256(""));
        require(!(u.id > 0x0));
        u.record.temp = _temp;
        u.record.hasSymp = _hasSymp;
        //initial state
        if (_temp <= 37 && !_hasSymp) {
            //green
            u.record.total = 0;
            u.record.code = 0;
        } else if (_temp <= 37 && _hasSymp) {
            //yellow
            u.record.total = 7;
            u.record.code = 1;
        } else {
            //red
            u.record.total = 14;
            u.record.code = 2;
        }

        users[msg.sender] = User({
            name: _name,
            id: msg.sender,
            record: u.record,
            hasRecord: true
        });
    }

    function updateRecord(uint256 _temp, bool _hasSymp)
        public
        checkUser(msg.sender)
    {
        User u = users[msg.sender];
        if (_temp <= 37 && !_hasSymp) {
            u.record.counter++;
            if (u.record.counter >= u.record.total) {
                u.record.code = 0; //change into green code
            }
        } else {
            if (u.record.code == 0) {
                if (_temp > 37) {
                    //green to red
                    u.record.code = 2;
                    u.record.total = 14;
                } else if (_hasSymp) {
                    // green to yellow
                    u.record.code = 1;
                    u.record.total = 7;
                }
            }
            if (u.record.code == 1 && _temp > 37) {
                //yellow to red
                u.record.code = 2;
                u.record.total = 14;
            }
            u.record.counter = 0; //resume when unhealthy
        }
    }

    function getUserCode() public view checkUser(msg.sender) returns (uint256) {
        User u = users[msg.sender];
        return u.record.code;
    }

    function hasRecord() public view returns (bool) {
        User u = users[msg.sender];
        return u.hasRecord;
    }
}
