import { useState } from 'react'

import { BOARD_WIDTH, SHIP_LENGTH, SHIP, COORDS, coordFromIndex } from './Game'

import '../styles/board.css'

export const PlayerBoard = ({squares, shipPlaced, placeShip}) => {
    const [hoverIndex, setHoverIndex] = useState(0)
    const [orientation, setOrientation] = useState(false)
    
    const updateHoverIndex = (index) => {
        if (!orientation && index % BOARD_WIDTH < SHIP_LENGTH) setHoverIndex(index) 
        else if (orientation && index < BOARD_WIDTH * SHIP_LENGTH) setHoverIndex(index)
    }

    const indexInRange = (index) => {
        if (!orientation) {
            return hoverIndex <= index && index < hoverIndex + SHIP_LENGTH
        }
        else {
            return index === hoverIndex 
            || index === hoverIndex + BOARD_WIDTH
            || index === hoverIndex + 2 * BOARD_WIDTH
        }
    }

    let boardSquares = squares.map((type, index) => {
        return (
            <div 
                className={!shipPlaced && indexInRange(index) ? SHIP : type} 
                key={index}
                onMouseEnter={() => updateHoverIndex(index)}
            >
                {coordFromIndex(index)}
            </div>
        )
    })
    
    return (
        <div 
            className={'board player'}
            onContextMenu={(e) => {
                e.preventDefault()
                setOrientation(!orientation)
            }}
            onClick={() => placeShip(hoverIndex, orientation)}
        >
            {boardSquares}
        </div>
    )
}