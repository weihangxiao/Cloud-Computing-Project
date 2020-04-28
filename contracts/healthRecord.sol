pragma solidity ^0.4.18;

contract healthRecord {
    mapping (address => User) internal users;
 
    struct Record{
        uint temp;   
        bool hasSymp;
        uint total; // total quarantine days required
        uint counter; // number of quarantine days
        uint code;  //0: green; 1:yellow; 2:red
    }
    
    struct User {
        string name;
        address id;
        Record record;
    }
    
    // exist or not
    modifier checkUser(address id) {
        User u = users[id];
        require(u.id > 0x0);
        _;
    }
    
    //initial record
    function addUser(string _name, uint _temp, bool _hasSymp) public {
        User u = users[msg.sender];
        require(keccak256(_name) != keccak256(""));
        require(!(u.id > 0x0));
        u.record.temp = _temp;
        u.record.hasSymp = _hasSymp;
        //initial state
        if(_temp <= 37 && !_hasSymp){ //green
            u.record.total = 0;
            u.record.code = 0;
        }else if(_temp <= 37 && _hasSymp){ //yellow
            u.record.total = 7;
            u.record.code = 1;
        }else{ //red
            u.record.total = 14;
            u.record.code = 2;
        }
        
        users[msg.sender] = User({name:_name,id:msg.sender,record:u.record});
    }
    
    function updateRecord(uint _temp, bool _hasSymp) public{
        User u = users[msg.sender];
        if(_temp <= 37 && !_hasSymp){
            u.record.counter ++;
            if(u.record.counter >= u.record.total){
                u.record.code = 0;  //change into green code
            }
        }else{
            if(u.record.code == 0){
                if(_temp > 37){  //green to red
                    u.record.code = 2;
                    u.record.total = 14;
                }else if(_hasSymp){ // green to yellow
                    u.record.code = 1;
                    u.record.total = 7;
                }
            }
            if(u.record.code == 1 && _temp > 37){ //yellow to red
                u.record.code = 2;
                u.record.total = 14;
            }
            u.record.counter = 0; //resume when unhealthy
        }
    }
    
    function getUserCode() public view checkUser(msg.sender) returns(uint) {
        User u = users[msg.sender];
        return u.record.code;
    }
     

}