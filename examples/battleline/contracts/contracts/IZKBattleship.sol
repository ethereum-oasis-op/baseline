// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

abstract contract IZKBattleship {
    
    /// MODIFIERS ///
    
    /**
     * Restrict logic for address already engaged in a game
     **/
    modifier inactive() {
        require(gameLock[msg.sender] == 0, "Address in game");
        _;
    }
    
    /**
     * Prevent logic while a game is not in a specific phase
     * 
     * @param _room uint256 - the game room identifier
     * @param _phase Phase - the phase to expect the game to be in
     **/
    modifier phaseRestrict(uint256 _room, Phase _phase) {
        require(games[_room].phase == _phase, "! correct phase");
        _;
    }
    
    /**
     * Restrict logic if not sender's turn in GameCreated
     * @notice expects participant modifier run before and cannot handle uuid of 0
     * 
     * @param _room uint256 - the game room being queried for player turn status
     **/
    modifier turn(uint256 _room) {
        require(uuids[msg.sender][_room] != 0, "! participant");
        uint256 uuid = uuids[msg.sender][_room];
        bool restriction = uuid == 2
            ? games[_room].turn
            : !games[_room].turn;  // see Game struct for more info
        require(!restriction, "! turn");
        _;
    }
    
    /**
     * Prevent out-of-bounds coordinates for shots
     **/
    modifier validCoordinate(uint8 _coordinate) {
        require(_coordinate < WIDTH, "Bad coordinate");
        _;
    }
    
    /// EVENTS ///
    
    event GameCreated(uint256 indexed _room);
    event GameStarted(uint256 indexed _room);
    event Placed(uint256 indexed _room, bytes _proof);
    event ShotFired(uint256 indexed _room, uint8 _x, uint8 _y, address _by); //emitted on shot
    event ShotLanded(uint256 indexed _room, uint8 _x, uint8 _y, bytes _proof); //emitted on verify
    event Won(uint256 indexed _room, address _winner);
    
    /// DATA STUCTS ///
    
    struct Game {
        bool firefight; // true if the game has started and shot are being exchanged, and false otherwise
        Phase phase; // current phase of game
        address[2] participants; // opposing players' addresses
        bytes[2] boards; // game creator stored in 0, game joiner stored in 1
        uint8[2] hits; // hits scored by creator in 0, hits by joiner in 1 (todo: logic around sinking separate ships)
        bool turn; // false for game creator's turn, true for game joiner's turn
    }

    /// ENUMERATIONS ///
    
    enum Phase { None, Lobby, Placement, Shooting, Complete }
    
    /// CONSTANTS ///
    uint8 public constant WIDTH = 6; // the width/ heigth of the game matrix (hardcoded for demo)
    uint256 public constant WIN_HITS = 3; // the number of hits required to win the game (no separate ships, low # for demo)
    
    /// VARIABLES ///
    
    uint256 public gameNonce;
    mapping(uint256 => Game) public games;
    mapping(address => mapping(uint256 => uint8)) public uuids; // player id of 1 (creator) or 2 (joiner) for each game
    mapping(address => uint256) public gameLock; // map to game id if address is in a game, or 0
   
    
    /// MUTABLE FUNCTIONS ///
    
    /**
     * Create a new game of Battleship and place board as game creator
     * @dev modifier inactive
     * 
     * @param _board bytes - sha3 hash of encoded board state
     * @param _proof bytes - cryptographic proof that ships were placed in a valid manner
     * @return uint256 - the id of the created game
     **/
    function createGame(bytes memory _board, bytes memory _proof) public virtual returns (uint256);
    
    /**
     * Join an existing game and place board as game joiner
     * @dev modifier inactive, phaseRestrict
     * 
     * @param _room uint256 - the room of the game being joined
     * @param _board bytes - sha3 hash of encoded board state
     * @param _proof bytes - cryptographic proof that ships were placed in a valid manner
     **/
    function joinGame(uint256 _room, bytes memory _board, bytes memory _proof) public virtual;
    
    /**
     * Fire a shot at the opponent
     * @dev modifier participant, turn, phaseRestrict, validCoordiante
     *
     * @param _room uint256 - the room of the game being played
     * @param _x uint8 - the x coordinate on the game matrix for the shot
     * @param _y uint8 - the y coordinate on the game matrix for the shot
     * @param _prevRound bytes - rlp encoded data on the previous round (ignored if !game.firefight)
     *   - [uint8, uint8, bool, bytes] : [x, y, hit, proof]
     *   - [0]: the x coord of prev shot, [1]: y coord of prev shot, [2]: hit status of prev shot, [3]: proof of shot
     **/
    function shoot(uint256 _room, uint8 _x, uint8 _y, bytes memory _prevRound) public virtual;
    
    /// INTERNAL FUNCTIONS ///
    
    /**
     * Place pieces on the board and provide cryptographic proof of compliance
     * 
     * @param _room uint256 - the room of the game where the board is being set
     * @param _board bytes - the sha3 hash of the encoded board
     * @param _proof bytes - cryptographic proof of board valididty
     * @param _creator bool - if true use index 0 otherwise index 1 for storage in game
     **/
    function place(uint256 _room, bytes memory _board, bytes memory _proof, bool _creator) internal {
        Game storage game = games[_room];
        uint8 by = _creator ? 0 : 1;
        // prevent reuse of place function
        //require(game.boards[by] == bytes(0x00), "Board placed");
        // proof of rule compliance
        require(boardProof(_board, _proof), "Board invalid");
        game.boards[by] = _board;
        emit Placed(_room, _proof);
    }
    
    /**
     * End a game and unlock addresses to play new games
     * @notice expects to be called only after isGameOver returns true
     * 
     * @param _room uint256 - the room of the game being ended
     **/
    function gameOver(uint256 _room) internal {
        Game storage game = games[_room];
        game.phase = Phase.Complete;
        gameLock[game.participants[0]] = 0;
        gameLock[game.participants[1]] = 0;
        address winner = game.turn == true
            ? game.participants[0]
            : game.participants[1];
        emit Won(_room, winner);
    }
    
    /**
     * When verifying a shot, determine if the state change ended the game
     * @notice expected to be run AFTER verifyShot updates game state
     * @notice expects particpant modifer earlier in call, cannot handle non-participant
     * @notice todo: introduce logic around sinking separate ships
     * 
     * @param _room uint256 - the room of the game being queried for exit condition
     * @return bool - true if game is over, and false otherwise
     **/
    function isGameOver(uint256 _room) internal view returns (bool) {
        return uuids[msg.sender][_room] == 2
            ? games[_room].hits[0] == WIN_HITS
            : games[_room].hits[1] == WIN_HITS;
    }
    
    function place(uint256 _room, bytes memory _board, bytes memory _proof) internal {

    } 
    
    /**
     * Authenticate a signed proof of board validity
     * @notice todo
     * 
     * @param _board bytes - the sha3 hash of the encoded board matrix
     * @param _proof bytes - cryptographic proof of board placement validity
     **/
    function boardProof(bytes memory _board, bytes memory _proof) internal view returns (bool) {
        return true;
    }
    
    /**
     * Authenticate a signed proof of shot validity
     * @notice todo
     * 
     * @param _board bytes - the sha3 hash of the encoded board matrix
     * @param _x uint8 - the x coordinate of the shot being proved
     * @param _y uint8 - the y coordinate of the shot being proved
     * @param _hit bool - the reported status of the shot
     * @param _proof bytes - cryptographic proof of reported hit status
     **/
    function shotProof(bytes memory _board, uint8 _x, uint8 _y, bool _hit, bytes memory _proof) internal view returns (bool) {
        return true;
    }
    
}