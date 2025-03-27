import { Devvit, useState } from '@devvit/public-api';
import Cell from "./Cell.js";

interface BoardProps {
    onSelectionComplete: (selectedCells: CellState[], firstCell: [number, number] | null) => void,
    setView: (view: 'board' | 'shape' | 'instructions' | null) => void;
}

type CellState = {
    row: number,
    col: number,
    color: string,
    selected: boolean,
    firstCell: boolean
};

const NUMBER_OF_CELLS = 8;

const renderBoard = (cells: CellState[][], handleClick: (row: number, col: number) => void): JSX.Element[] => (
    cells.map((rowCells, row) => (
        <hstack key={row}>
            {rowCells.map((cell, col) => (
                <Cell
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    backgroundColor={cell.color}
                    onPress={() => handleClick(row, col)}
                    borderColor="#2c3b50"
                    borderWidth="thick"
                    disabled={false}
                />
            ))}
        </hstack>
    ))
);

const Board = ({ onSelectionComplete, setView }: BoardProps): JSX.Element => {
    const initialCells: CellState[][] = Array.from({ length: NUMBER_OF_CELLS }, (_, row) =>
        Array.from({ length: NUMBER_OF_CELLS }, (_, col) => ({
            row,
            col,
            color: "#242738",
            selected: false,
            firstCell: false
        }))
    );

    const [cells, setCells] = useState(initialCells);
    const [selectedCells, setSelectedCells] = useState<CellState[]>([]);
    const [firstCellPos, setFirstCellPos] = useState<[number, number] | null>(null);

    const handleClick = (row: number, col: number) => {
        const cellIndex = selectedCells.findIndex(c => c.row === row && c.col === col);
        const isFirstSelection = selectedCells.length === 0;

        let newSelectedCells = [...selectedCells];
        let newFirstCellPos = firstCellPos;

        const newCells = cells.map(rowCells => rowCells.map(cell => ({
            ...cell,
            color: cell.color,
            selected: cell.selected,
            firstCell: cell.firstCell
        })));

        if (cellIndex === -1) {
            // Cell is not selected, so select it
            const newColor = isFirstSelection ? "KiwiGreen-200" : "AlienBlue-300";
            newCells[row][col].color = newColor;
            newCells[row][col].selected = true;
            newSelectedCells.push(newCells[row][col]);

            if (isFirstSelection) {
                newFirstCellPos = [row, col];
                newCells[row][col].firstCell = true;
            }
        } else {
            // Cell is already selected, so deselect it
            if (newFirstCellPos && newFirstCellPos[0] === row && newFirstCellPos[1] === col && newSelectedCells.length > 1) {
                // If it's the first cell and there are other selected cells, don't deselect it
                return;
            }
            newCells[row][col].color = "#242738";
            newCells[row][col].selected = false;
            newCells[row][col].firstCell = false;
            newSelectedCells = newSelectedCells.filter(c => !(c.row === row && c.col === col));
            if(newSelectedCells.length === 0){
                newFirstCellPos = null;
            }
        }

        setSelectedCells(newSelectedCells);
        setCells(newCells);
        setFirstCellPos(newFirstCellPos);
    };

    return (
        <>
            <vstack width="100%" alignment='middle center'>
                {renderBoard(cells, handleClick)}
            </vstack>
            <hstack width="100%" gap="medium" padding="medium" alignment='middle center'>
                <hstack width="130px" height="40px" alignment='middle center' backgroundColor="#242738" cornerRadius="medium" onPress={() => setView(null)}><text weight='bold' size='medium' color='#ffffff'>Back</text></hstack>
                <hstack width="130px" height="40px" alignment='middle center' backgroundColor="#9d7aff" cornerRadius="medium" onPress={() => onSelectionComplete(selectedCells, firstCellPos)}><text weight='bold' size='medium' color='#ffffff'>Done</text></hstack>
            </hstack>
        </>
    );
}

export default Board;
