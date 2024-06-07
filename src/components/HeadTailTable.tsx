import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Popover from '@mui/material/Popover';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { ToastContainer, toast } from 'react-toastify';
import AlertModal from './AlertModal';

interface HeadTailTableProps {
    dataSource: any[];
    columnOrder: any[];
    columnTypes: any;
    dataType: string;
    columnsForTable: any;
    nullValues: any;
}

const HeadTailTable: React.FC<HeadTailTableProps> = ({ dataSource, columnOrder, columnTypes, nullValues, columnsForTable, dataType }) => {
    const [columnOrd, setColumnOrd] = useState<any[]>(columnOrder);
    const [allColumnsChecked, setAllColumnsChecked] = useState(false);
    const [checkedItemsOfTable, setcheckedItemsOfTable] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openAddRowDialog, setOpenAddRowDialog] = useState(false);
    const [userInputsForAddRow, setUserInputsForAddRow] = useState<{ [key: string]: string }>({});
    const menuColumnOpen = Boolean(anchorEl);
    const idPopover = menuColumnOpen ? 'simple-popover' : undefined;
    const onNULLValueClicked: any = (event: React.MouseEvent<HTMLDivElement>, columnName: string) => {
        console.log(columnName + " clicked!");
        setAnchorEl(event.currentTarget);
    }
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [alertMessageContent, setAlertMessageContent] = useState<string>("");
    const handleCloseMenuColumn = () => {
        setAnchorEl(null);
    };

    const handleOpenAddRowDialog = () => {
        setOpenAddRowDialog(true);
    };

    const handleCloseAddRowDialog = () => {
        setOpenAddRowDialog(false);
    };

    const handleInputChangeAddRow = (label: string, value: string) => {
        setUserInputsForAddRow((prevState: any) => ({
            ...prevState,
            [label]: value
        }));
    };

    const handleCheckboxChangeTableColumn = (value: string) => {
        const currentIndex = checkedItemsOfTable.indexOf(value);
        const newcheckedItemsOfTable = [...checkedItemsOfTable];

        if (currentIndex === -1) {
            newcheckedItemsOfTable.push(value);
        } else {
            newcheckedItemsOfTable.splice(currentIndex, 1);
        }

        setcheckedItemsOfTable(newcheckedItemsOfTable);
    };

    const toastMessage = (value: string, message: string) => {
        // success
        // error
        // warning
        // info
        if (value == "success") {
            toast.success(message);
        }
        else if (value == "error") {
            toast.error(message);
        }
        else if (value == "warning") {
            toast.warning(message);
        }
        else if (value == "info") {
            toast.info(message);
        }
    };

    const [selectedOptionsForProcessing, setSelectedOptionsForProcessing] = React.useState<string[]>([]);

    const handleClickOpenDialog = (dialogType: any) => {
        if (dialogType == 'Process Selected Columns') {
            if (selectedOptionsForProcessing.length <= 0) {
                toastMessage('error', 'Please select a pre-processing method first!');
            }
            else if (checkedItemsOfTable.length <= 0) {
                toastMessage('error', 'Please select columns for performing method!');
            }
            else {
                setOpenDialog(true);
            }
        }
        else if (dialogType == 'Add Row') {
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleYesDialog = () => {
        toastMessage('info', 'You selected yes!');
        handleCloseDialog();
    };

    const handleNoDialog = () => {
        toastMessage('warning', 'No changes made!');
        handleCloseDialog();
    };

    //Drag and Drop columns and change order
    const handleDragEnd = (event: React.DragEvent<HTMLTableCellElement>, newIndex: number) => {
        event.preventDefault();
        const draggedColumnName = event.dataTransfer.getData("text/plain");
        const draggedColumnIndex = Object.keys(columnOrd).find((key) => columnOrd[parseInt(key)] === draggedColumnName);
        if (draggedColumnIndex !== undefined) {
            const newColumnOrder = { ...columnOrd };
            const draggedColumnKey = parseInt(draggedColumnIndex);
            const keys = Object.keys(newColumnOrder);
            const insertIndex = newIndex < keys.length ? parseInt(keys[newIndex]) : parseInt(keys[keys.length - 1]) + 1;

            // Determine the direction of the drag
            const direction = insertIndex > draggedColumnKey ? 1 : -1;
            const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));

            // Adjust the column order
            sortedKeys.forEach((key) => {
                const index = parseInt(key);
                if ((direction === 1 && index > draggedColumnKey && index <= insertIndex) ||
                    (direction === -1 && index >= insertIndex && index < draggedColumnKey)) {
                    newColumnOrder[index - direction] = newColumnOrder[index];
                }
            });

            newColumnOrder[insertIndex] = draggedColumnName;
            setColumnOrd(newColumnOrder);
        }
    }

    // You can implement rendering logic here based on the provided data

    return (
        <div>
            {/* <ToastContainer
                position="top-right"
                theme="light"
                autoClose={5000}
                closeOnClick
                style={{ width: '30em' }}
            /> */}
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table style={{ position: 'relative' }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Tooltip title={"Change the first row to header"}>
                                    <div className="badge" onClick={() => { }}>
                                        {/* <MoveDownIcon /> */}
                                        <MoreHorizIcon />
                                        {/* {nullValues[column]} */}
                                    </div>
                                </Tooltip>
                                <FormControlLabel
                                    control={<Checkbox checked={allColumnsChecked} onChange={() => {
                                        if (allColumnsChecked) {
                                            setAllColumnsChecked(false);
                                            setcheckedItemsOfTable([]);
                                        } else {
                                            setAllColumnsChecked(true);
                                            setcheckedItemsOfTable([...columnsForTable]);
                                        }
                                    }} />}
                                    label=""
                                    labelPlacement='end'
                                />
                            </TableCell>
                            {Object.values(columnOrd).map((column, index) => (
                                <TableCell style={columnTypes[column] != "float64" ? { color: '#CB4357', cursor: 'move' } : { cursor: 'move' }} key={index} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", column)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDragEnd(e, index)}>

                                    <div className="badge" aria-describedby={idPopover} onClick={(event) => { onNULLValueClicked(event, column) }}>
                                        <Tooltip title={
                                            <React.Fragment>
                                                NULL Count: {nullValues[column]}
                                                <br />
                                                Unique Count: {nullValues[column]}
                                            </React.Fragment>
                                        }>
                                            <span>
                                                <MoreHorizIcon />
                                                {/* {nullValues[column]} */}
                                            </span></Tooltip>
                                    </div>
                                    <Tooltip title={`Column Type: ${columnTypes[column]}`}>
                                        <span>
                                            <FormControlLabel
                                                value="end"
                                                control={<Checkbox checked={checkedItemsOfTable.includes(column)}
                                                    onChange={() => handleCheckboxChangeTableColumn(column)} />}
                                                label={column}
                                                labelPlacement="end"
                                            />
                                        </span>
                                    </Tooltip>
                                    <Popover
                                        id={idPopover}
                                        open={menuColumnOpen}
                                        anchorEl={anchorEl}
                                        onClose={handleCloseMenuColumn}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <Typography sx={{ p: 2 }}>
                                            NULL Count: {nullValues[column]}
                                        </Typography>
                                        <Typography sx={{ p: 2 }}>
                                            Unique Count: {nullValues[column]}
                                        </Typography>
                                    </Popover>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataSource.map((row, index) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                <TableCell>
                                    {index}
                                </TableCell>
                                {Object.values(columnOrd).map((column, colIndex) => (
                                    <TableCell key={colIndex}
                                        style={columnTypes[column] != "float64" ? { color: '#CB4357' } : {}}
                                    >{row[column]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                    <SpeedDial
                        ariaLabel="SpeedDial openIcon example"
                        sx={{ position: 'absolute', bottom: '2%', left: '0%', backgroundColor: 'transparent' }}
                        // icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                        icon={<ListIcon />}
                        openIcon={<MoreVertIcon />}
                        direction="up"
                    >
                        <SpeedDialAction
                            key='Add Row'
                            icon={<SplitscreenIcon />}
                            tooltipTitle='Add Row'
                            onClick={() => { handleOpenAddRowDialog() }}
                        />
                        <SpeedDialAction
                            key='Add A New Column'
                            icon={<ViewWeekIcon />}
                            tooltipTitle='Add A New Column'
                        />
                        <SpeedDialAction
                            key='Create A Copy'
                            icon={<FileCopyIcon />}
                            tooltipTitle='Create A Copy'
                        />
                    </SpeedDial>
                </Table>
            </TableContainer>
            <Dialog fullWidth open={openAddRowDialog} onClose={handleCloseAddRowDialog}>
                {/* Content of the dialog */}
                <div className='p-4'>
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Add a new row</DialogTitle>
                    <DialogContent dividers>
                        <div className='row'>
                            {columnsForTable.map((label: any, index: any) => (
                                <div className='col-md-4 mb-2 mt-2'>
                                    <TextField
                                        id={`filled-basic-${index}`}
                                        label={label}
                                        variant="outlined"
                                        value={userInputsForAddRow[label] || ''}
                                        onChange={(e) => handleInputChangeAddRow(label, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div>
                            <button className='btn' onClick={() => {
                                setAlertMessageContent("Are you sure? You are about to add a new row!")
                                handleClickOpenDialog('Add Row');
                            }}>
                                <PlaylistAddIcon />
                                Add Row</button>
                            &nbsp;&nbsp;
                            <button className='btn' onClick={handleCloseAddRowDialog}>
                                <CloseIcon />
                                Close</button>
                        </div>
                    </DialogActions>
                </div>
            </Dialog>
            <AlertModal open={openDialog} message={alertMessageContent} handleClose={handleCloseDialog} handleYes={handleYesDialog} handleNo={handleNoDialog} />
        </div>
    );
}

export default HeadTailTable;
