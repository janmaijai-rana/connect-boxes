import { Devvit } from '@devvit/public-api';

interface CellProps {
    row: number;
    col: number;
    borderColor: string;
    backgroundColor: string;
    onPress: () => void;
    disabled: boolean;
    isSelected: boolean; 
    order?:number;
}


const Cell = ({ row, col, borderColor, backgroundColor, onPress, disabled, isSelected, order }: CellProps): JSX.Element => {
    const cellSize = "34px";
    return (
        <vstack 
            height= {cellSize}
            width= {cellSize}
            borderColor={borderColor}
            cornerRadius='small'
            backgroundColor={backgroundColor}
            alignment='middle center'
            onPress={disabled ? undefined : onPress}
        >
            {isSelected && order &&  (
                    <text alignment='middle center' color="#333333" weight="bold" size="small">
                        {order}
                    </text>
            )}
        </vstack>
    );    
}

export default Cell;