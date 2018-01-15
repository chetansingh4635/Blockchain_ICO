pragma solidity ^0.4.2;

import "./ERC20Interface.sol";
   
  contract CrowdSale is ERC20Interface {
      string public constant symbol = "~~Test~~";
      string public constant name = "TestToken";
      uint8 public constant decimals = 18;
	  uint256 public constant max_bid_amount = 100;
      uint256 public  total_supply;
	  uint256 public  total_funding;
      uint256 public constant min_cap = 100;
      uint256 public constant max_cap= 100000000000;
      
      // Owner of this contract
      address public owner;
   
      // Balances for each account
      mapping(address => uint256) public balances;
   
      // Token for Each Account

      mapping(address => uint256) public tokens;

      // Owner of account approves the transfer of an amount to another account
      mapping(address => mapping (address => uint256)) allowed;
   
      // Functions with this modifier can only be executed by the owner
      modifier onlyOwner() {
          if (msg.sender != owner) {
              throw;
          }
          _;
     }
   
      // Constructor defining the owner of contract while deploying it
      function CrowdSale() {
          owner = msg.sender;
      }
   
      function totalSupply(uint256 _totalSupply)public constant  returns (uint256) {
        total_supply=_totalSupply;
      }

      // What is the balance of a particular account?
      function balanceOf(address _owner) public constant returns (uint256 balance) {
         return balances[_owner];
     }
   
     // Transfer the balance from owner's account to another account and defining the value of each token
      function sendTransaction()payable  {
      transfer(msg.sender,msg.value);
      }

      //storing the transferred token detalis
      function transfer(address _to, uint256 _amount) public payable returns  (bool success) {
         if(_amount <= max_bid_amount) {
             tokens[msg.sender] +=_amount/2;
			 allowed[msg.sender][msg.sender]=_amount;
			 total_funding +=_amount;
             return true;
         }
         else 
         return false;
      }
   
     // Withdraw spended ether to user account
      function transferFrom(address _to,uint256 _amount) public returns (bool success) {
		 if(approve(_to,_amount)){
           _to.transfer(_amount);
           tokens[_to] -=_amount/2;
		   total_funding -=_amount;
           return true;
         } 
         else
         return false;
         
     }
  
     // Allow _spender to withdraw from your account, multiple times, up to the _value amount.
     // If this function is called again it overwrites the current allowance with _value.
     function approve(address _spender, uint256 _amount)  internal constant  returns (bool success) {
         uint256 amount=allowance(msg.sender,_spender);
		 if(_amount<=amount)
		 return true;
		 else
		 return false;

     }
  

  // Biding
     function allowance(address _owner, address _spender) internal  constant returns (uint256 remaining) {
         return allowed[_owner][_spender];
     }
 }