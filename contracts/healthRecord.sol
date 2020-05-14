pragma solidity ^0.5.0;


contract HealthRecord {
    mapping(address => User) internal users;
    uint256 day_as_int = 24 * 60 * 60 * 1000;

    struct Record {
        uint256 temp;
        bool hasSymp;
        uint256 date;
    }

    struct User {
        string name;
        address id;
        uint256 record_size;
        mapping(uint256 => Record) records;
        uint256 code; //0: green; 1:yellow; 2:red
        uint256 total; // total quarantine days required
        uint256 counter; // number of quarantine days
        bool hasRecord;
    }

    // exist or not
    modifier checkUser(address id) {
        User storage u = users[id];
        require(u.hasRecord);
        // require(u.record_size > 0);
        _;
    }

    //add user
    function addUser(
        string memory _name,
        uint256 _temp,
        bool _hasSymp,
        uint256 _date
    ) public {
        User storage u = users[msg.sender];
        Record memory rec;
        require(u.record_size == 0);
        rec.temp = _temp;
        rec.hasSymp = _hasSymp;
        rec.date = _date;
        uint256 total_;
        uint256 code_;
        //initial state
        if (_temp <= 37 && !_hasSymp) {
            //green
            total_ = 0;
            code_ = 0;
        } else if (_temp <= 37 && _hasSymp) {
            //yellow
            total_ = 7;
            code_ = 1;
        } else {
            //red
            total_ = 14;
            code_ = 2;
        }

        users[msg.sender] = User({
            name: _name,
            id: msg.sender,
            record_size: 1,
            code: code_,
            total: total_,
            counter: 0,
            hasRecord: true
        });
        users[msg.sender].records[0] = rec;
    }

    function addRecord(uint256 _temp, bool _hasSymp, uint256 _date)
        public
        checkUser(msg.sender)
    {
        User storage u = users[msg.sender];
        Record storage last_rec = u.records[u.record_size - 1];
        Record memory new_rec = Record(_temp, _hasSymp, _date);
        if (new_rec.date - last_rec.date > day_as_int) {
            u.code = 2;
            u.total = 14;
            u.counter = 0;
        } else {
            if (_temp <= 37 && !_hasSymp) {
                u.counter = u.counter + 1;
                if (u.counter >= u.total) {
                    u.code = 0; //change into green code
                }
            } else {
                if (u.code == 0) {
                    if (_temp > 37) {
                        //green to red
                        u.code = 2;
                        u.total = 14;
                    } else if (_hasSymp) {
                        // green to yellow
                        u.code = 1;
                        u.total = 7;
                    }
                }
                if (u.code == 1 && _temp > 37) {
                    //yellow to red
                    u.code = 2;
                    u.total = 14;
                }
                u.counter = 0; //resume when unhealthy
            }
        }
        u.records[u.record_size] = new_rec;
        u.record_size = u.record_size + 1;
    }

    function hasRecord() public view returns (bool) {
        User storage u = users[msg.sender];
        return u.hasRecord;
    }

    function getUserCode() public view checkUser(msg.sender) returns (uint256) {
        User storage u = users[msg.sender];
        return u.code;
    }

    function getsRecord(uint256 today, uint256 gap)
        public
        view
        checkUser(msg.sender)
        returns (uint256, uint256, bool)
    {
        uint256 i;
        User storage u = users[msg.sender];
        for(i = 0; i < u.record_size; i++)
        {
            Record storage rec = u.records[i];
            if ((today - rec.date)/day_as_int == gap) {
                return (rec.date, rec.temp, rec.hasSymp);
            }
        }
    }
}
