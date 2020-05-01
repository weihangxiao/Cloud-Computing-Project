pragma solidity ^0.4.18;


contract healthRecord {
    mapping(address => User) internal users;

    struct Record {
        uint256 id;
        uint256 temp;
        bool hasSymp;
        string date;
        uint256 total; // total quarantine days required
        uint256 counter; // number of quarantine days
        uint256 code; //0: green; 1:yellow; 2:red
    }

    struct User {
        string name;
        address id;
        Record[] records;
        bool exist;
    }

    // exist or not
    modifier checkUser(address id) {
        User u = users[id];
        require(u.exist == true);
        _;
    }

    function userExist() public constant returns (bool) {
        User u = users[msg.sender];
        return u.exist == true;
    }

    //add user
    function addUser(string _name) public {
        require(keccak256(_name) != keccak256(""));
        require(!(msg.sender > 0x0));
        User u;
        u.name = _name;
        u.id = msg.sender;
        u.exist = true;
        users[msg.sender] = u;
    }

    function addRecord(uint256 _temp, bool _hasSymp, string date) public {
        User u = users[msg.sender];
        uint256 record_len = u.records.length;
        Record memory rec;
        if (record_len == 0) {
            rec.temp = _temp;
            rec.hasSymp = _hasSymp;
            rec.date = date;
            //initial state
            if (_temp <= 37 && !_hasSymp) {
                //green
                rec.total = 0;
                rec.code = 0;
            } else if (_temp <= 37 && _hasSymp) {
                //yellow
                rec.total = 7;
                rec.code = 1;
            } else {
                //red
                rec.total = 14;
                rec.code = 2;
            }
        } else {
            Record last_record = u.records[record_len-1];
            if (_temp <= 37 && !_hasSymp) {
                rec.counter++;
                if (last_record.counter >= last_record.total) {
                    rec.code = 0; //change into green code
                }
            } else {
                if (last_record.code == 0) {
                    if (_temp > 37) {
                        //green to red
                        rec.code = 2;
                        rec.total = 14;
                    } else if (_hasSymp) {
                        // green to yellow
                        rec.code = 1;
                        rec.total = 7;
                    }
                }
                if (last_record.code == 1 && _temp > 37) {
                    //yellow to red
                    rec.code = 2;
                    rec.total = 14;
                }
                rec.counter = 0; //resume when unhealthy
                rec.date = date;
            }
        }
        rec.id = record_len + 1;
        u.records.push(rec);
    }

    function getUserCode() public view checkUser(msg.sender) returns (uint256) {
        User u = users[msg.sender];
        return u.records[u.records.length-1].code;
    }

    function getUserRecord()
        public
        view
        checkUser(msg.sender)
        returns (address, uint256, string, uint256, bool)
    {
        User u = users[msg.sender];
        Record rec = u.records[u.records.length-1];
        return (msg.sender, rec.id, rec.date, rec.temp, rec.hasSymp);
    }
}
