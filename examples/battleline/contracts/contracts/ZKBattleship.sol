// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./IZKBattleship.sol";

contract ZKBattleship is IZKBattleship {
    /// MUTABLE FUNCTIONS ///

    function createGame(bytes memory _board, bytes memory _proof)
        public
        override
        inactive
        returns (uint256)
    {
        gameNonce++;
        Game storage game = games[gameNonce];
        gameLock[msg.sender] = gameNonce; // prevent address from multiple games
        game.participants[0] = msg.sender;
        uuids[msg.sender][gameNonce] = 1; // encode game creator role
        game.phase = Phase.Lobby;
        emit GameCreated(gameNonce);
        place(gameNonce, _board, _proof);
        return gameNonce;
    }

    function joinGame(
        uint256 _room,
        bytes memory _board,
        bytes memory _proof
    ) public override inactive phaseRestrict(_room, Phase.Lobby) {
        Game storage game = games[_room];
        gameLock[msg.sender] = gameNonce;
        game.participants[1] = msg.sender;
        uuids[msg.sender][_room] = 2;
        place(_room, _board, _proof);
        game.phase = Phase.Shooting;
    }

    function shoot(
        uint256 _room,
        uint8 _x,
        uint8 _y,
        bytes memory _prevRound
    )
        public
        override
        phaseRestrict(_room, Phase.Shooting)
        validCoordinate(_x)
        validCoordinate(_y)
        turn(_room)
    {
        Game storage game = games[_room];
        if (game.firefight) {
            // verify previous shot's hit/miss (if not first round of shooting)
            (uint8 prevX, uint8 prevY, bool hit, bytes memory proof) = abi
                .decode(_prevRound, (uint8, uint8, bool, bytes));
            //uint8 by = uuids[msg.sender][_room] == 1 ? 0 : 1; // 0 or 1 creator/ joiner encoding
            uint8 by = 1; //test
            bool proofEval = shotProof(
                game.boards[by],
                prevX,
                prevY,
                hit,
                proof
            );
            require(proofEval, "Invalid shot proof");
            game.hits[by] += 1;
            //emit ShotLanded(_room, prevX, prevY, proof);
            // check if game is over
            // if (isGameOver(_room)) {
            //     // end game and exit if exit condition
            //     gameOver(_room);
            //     return;
            // }
        } else game.firefight = true;
        // fire a shot
        game.turn = !game.turn;
        emit ShotFired(_room, _x, _y, msg.sender);
    }
}
