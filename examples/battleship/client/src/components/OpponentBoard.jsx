import { EMPTY, COORDS, BOARD_WIDTH, coordFromIndex } from './Game'

import '../styles/board.css'

export const OpponentBoard = ({squares, targeting, targetSquare}) => {

    let boardSquares = squares.map((type, index) => {
        return (
            <div 
                className={type} 
                key={index}
                onClick={targeting && squares[index] === EMPTY ? () => targetSquare(index) : () => {}}
            >
                {coordFromIndex(index)}
            </div>
        )
    })
    
    return (
        <div 
            className={`board opponent ${targeting ? 'targeting' : ''}`}
        >
            {boardSquares}
        </div>
    )
}