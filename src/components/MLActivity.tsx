import React, { useEffect, useState } from 'react'
import '../assets/css/styles.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Alert, CircularProgress, Collapse, List, ListItem, ListItemButton, ListItemText, ListSubheader, Menu, MenuList, Typography } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import AlertModal from './AlertModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { TablePagination } from '@mui/material';
import { getHeadDataForTable, getTailDataForTable, getPreprocessingMethodList, getColumnOrderForTable, getPresentNullValuesForTable, getDataFrameShapeForTable, getDataFrameSizeForTable, getDataTypesForTable, getNumericDataDescriptionForTable, getAllDataDescriptionForTable, dragColumnForTable, deleteAColumn, createACopyDataframe, createAColumn, deleteDataframe, getUniqueValuesForTable, dropAllRowsContainingNULLValues, dropAllRowsContainingNULLValuesofColumn, dropDuplicateRowsFromTable, getDataInfoForTable, getTotalCopyListDataframeForTable, getSelectedCopyDataframeForTable, addRowForTable, identifyDateAndTimeForTable } from '../AllAssets';
import SavedProgressTop from './SavedProgressTop';
import "@silevis/reactgrid/styles.css";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Tooltip from '@mui/material/Tooltip';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import ListIcon from '@mui/icons-material/List';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShareIcon from '@mui/icons-material/Share';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import Popover from '@mui/material/Popover';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import { AxiosResponse } from 'axios';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListDropDown from './ListDropDown';
import DownloadIcon from '@mui/icons-material/Download';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


// REQUIRED FOR TABS VIEW DATASOURCE HEAD AND TAIL
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

interface TabPanelInsideProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


// REQUIRED FOR TABS VIEW DATASOURCE HEAD AND TAIL
const TabPanelInside: React.FC<TabPanelInsideProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
};

const MLActivity = () => {

    const [userInputsForAddRow, setUserInputsForAddRow] = useState<{ [key: string]: Number }>({});
    const [openAddRowDialog, setOpenAddRowDialog] = useState(false);
    const [addColumnDialog, setAddColumnDialog] = useState(false);
    const [newColumnNameCalculatedColumn, setNewColumnNameCalculatedColumn] = useState<any>();

    const handleChangeNewColumnName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewColumnNameCalculatedColumn(event.target.value);
    };


    const handleOpenAddRowDialog = () => {
        setOpenAddRowDialog(true);
    };

    const handleOpenAddColumn = () => {
        setAddColumnDialog(true);
    };

    const handleDeleteColumn = () => {
        if (checkedItemsOfTable.length <= 0) {
            toastMessage('error', 'Kindly select a column to be deleted!')
        }
        else {
            if (checkedItemsOfTable.length > 1) {
                setAlertMessageContent("Are you sure? You are about to delete multiple columns!");
                handleClickOpenDialog('Delete Column');
            }
            else {
                setAlertMessageContent("Are you sure? You are about to delete a selected column!");
                handleClickOpenDialog('Delete Column');
            }
        }
    }

    const handleCloseAddRowDialog = () => {
        setOpenAddRowDialog(false);
    };

    const handleCloseAddColumnDialog = () => {
        setAddColumnDialog(false);
    };


    const StyledSpeedDialIcon = styled(SpeedDialIcon)(({ theme }) => ({
        // [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'transparent',
        color: 'black',
        position: 'absolute'
    }));

    const navigate = useNavigate();

    // TO NAVIGATE BETWEEN DIFFERENT PAGES
    const navigateTo = (route: any) => {
        navigate(route);
    }

    const toastMessage = (value: string, message: string) => {
        // success
        // error
        // warning
        // info
        try {
            increaseContainerIDToast();
            if (value == "success") {
                toast.success(message, {
                    toastId: containerIDToast,
                });
            }
            else if (value == "error") {
                toast.error(message, {
                    toastId: containerIDToast,
                });
            }
            else if (value == "warning") {
                toast.warning(message, {
                    toastId: containerIDToast,
                });
            }
            else if (value == "info") {
                toast.info(message, {
                    toastId: containerIDToast,
                });
            }
        } catch (error: any) {
            console.log("error");
        }
    };

    const savedProgressValue = '75%';

    // CURRENTLY AT WHICH TAB INDEX
    const [value, setValue] = React.useState(0);
    const [valueBottom, setValueBottom] = React.useState(0);
    const [copyList, setCopyList] = React.useState<any>([]);
    const [valueInside, setValueInside] = React.useState(0);
    const [nullValues, setNullValues] = React.useState<any>({});
    const [uniqueValues, setUniqueValues] = React.useState<any>({});
    const [columnTypes, setColumnTypes] = React.useState<any>({});
    const [dataShape, setDataShape] = React.useState<any[]>([]);
    const [dataSize, setDataSize] = React.useState<any>(0);
    const [capturedMemory, setCapturedMemory] = React.useState<any>({});

    // HANDLE CHANGE FOR TAB
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeInside = (event: React.SyntheticEvent, newValue: number) => {
        setValueInside(newValue);
    };

    const handleChangeForBottomNavigation = async (event: React.ChangeEvent<{}>, newValue: number) => {
        try {
            const pickCopyResposne = await getSelectedCopyDataframeForTable(copyList[newValue]['id']);
            if (responseChecker(pickCopyResposne)) {
                loadHeadTailDataDescription();
                // setNullValues(JSON.parse(pickCopyResposne.data.data));
            }
            setValueBottom(newValue);

        } catch (error: any) {
            toastMessage('error', "Error picking copy!");
            console.error(error);
        }
    };


    const changeCurrProgressState = () => {
        let tempCurrProgress: any = localStorage.getItem('currentProgress');
        if (tempCurrProgress) {
            if (tempCurrProgress == 'Not Performed pre-processing')
                localStorage.setItem('currentProgress', 'Performed pre-processing');
        }
    }


    // TABLE STARTS HERE

    const [dataForHead, setDataForHead] = useState<any[]>([]);
    const [dataHeadLoading, setDataHeadLoading] = useState<Boolean>(true);
    const [allDataDescription, setAllDataDescription] = useState<any[]>([]);
    const [dataInfo, setDataInfo] = useState<any>();
    const [numericDataDescription, setNumericDataDescription] = useState<any[]>([]);
    const [dataDescriptionLoading, setDataDescriptionLoading] = useState<Boolean>(true);
    const [dataInfoLoading, setDataInfoLoading] = useState<Boolean>(true);
    const [headersForDescription, setHeadersForDescription] = useState<any[]>([]);
    const [firstColumnKeysNumericDescription, setFirstColumnKeysNumericDescription] = useState<any[]>([]);
    const [firstColumnKeysAllDescription, setFirstColumnKeysAllDescription] = useState<any[]>([]);
    // const firstColumnKeysDescription = ["25%", "50%", "75%", "count", "freq", "max", "mean", "min", "std", "top", "unique"];
    const [dataForTail, setDataForTail] = useState<any[]>([]);
    const [dataTailLoading, setDataTailLoading] = useState<Boolean>(true);
    const [columnsForTable, setColumnsForTable] = useState<any[]>([]);
    const [columnOrd, setColumnOrd] = useState<any[]>([]);


    useEffect(() => {
        // Function to run once when component mounts
        loadHeadTailDataDescription();

        const getPreprocessingMethods = async () => {
            try {
                const response = await getPreprocessingMethodList();
                if (response.status == 200) {
                    const responseData = response.data.data;
                    // setOptionsForProcessColumns(responseData);
                }
                else {
                    toastMessage('error', "Error fetching pre-processing methods!");
                }

            } catch (error: any) {
                toastMessage('error', "Error fetching pre-processing methods!");
                console.error(error);
            }
        };
        // getPreprocessingMethods();
    }, []);

    const getColumnOrder = async () => {
        try {
            const columnOrderResponse = await getColumnOrderForTable();
            if (responseChecker(columnOrderResponse)) {
                setColumnOrd(JSON.parse(columnOrderResponse.data.data));
                setColumnsForTable(Object.values(JSON.parse(columnOrderResponse.data.data)).sort((a: any, b: any) => parseInt(a) - parseInt(b)));
            }
        } catch (error: any) {
            toastMessage('error', 'Error fetching column order!');
            console.error(error);
        }
    }

    const responseChecker = (response: AxiosResponse<any, any>) => {
        if (response.status == 400) {
            toastMessage('error', 'Invalid Request!');
            return false;
        }
        else if (response.status == 500) {
            toastMessage('error', "Server Issue");
            return false;
        }
        else if (response.status == 200 || response.status == 201) {
            if (response.data['status'] == "success") {
                return true;
            }
            else if (response.data['status'] == "failure") {
                toastMessage('error', response.data['message']);
                return false;
            }
        }
    }

    const getCopyListData_Frame = async () => {
        try {
            const copyListResponse = await getTotalCopyListDataframeForTable();
            if (responseChecker(copyListResponse)) {
                setCopyList(copyListResponse.data.data);
            }
        } catch (error: any) {
            toastMessage('error', 'Error fetching copies list!');
            console.error(error);
        }
    }

    const getNullValues = async () => {
        try {
            const nullValuesResponse = await getPresentNullValuesForTable();
            if (responseChecker(nullValuesResponse)) {
                setNullValues(nullValuesResponse.data.data);
            }

        } catch (error: any) {
            toastMessage('error', "Error fetching NULL Values!");
            console.error(error);
        }
    }
    const getUniqueValues = async () => {
        try {
            const uniqueValuesResponse = await getUniqueValuesForTable();
            if (responseChecker(uniqueValuesResponse)) {
                setUniqueValues(JSON.parse(uniqueValuesResponse.data.data));
            }

        } catch (error: any) {
            toastMessage('error', "Error fetching Unique Values!");
            console.error(error);
        }
    }
    const getDataFrameShape = async () => {
        try {
            const dataFrameShapeResponse = await getDataFrameShapeForTable();
            if (responseChecker(dataFrameShapeResponse)) {
                setDataShape(dataFrameShapeResponse.data.data);
            }

        } catch (error: any) {
            toastMessage('error', "Error fetching dataframe shape!");
            console.error(error);
        }
    }
    const getDataFrameSize = async () => {
        try {
            const dataFrameSizeResponse = await getDataFrameSizeForTable();
            if (responseChecker(dataFrameSizeResponse)) {
                setDataSize(dataFrameSizeResponse.data.data);
            }

        } catch (error: any) {
            toastMessage('error', "Error fetching dataframe size!");
            console.error(error);
        }
    }
    const getColumnDataType = async () => {
        try {
            const dataTypeResponse = await getDataTypesForTable(localStorage.getItem("userID"), localStorage.getItem("fileName"));
            setColumnTypes(JSON.parse(dataTypeResponse.data));

        } catch (error: any) {
            toastMessage('error', "Error fetching data types!");
            console.error(error);
        }
    }




    const loadHeadTailDataDescription = () => {
        const getHead_data = async () => {
            try {
                setDataHeadLoading(true);
                const response = await getHeadDataForTable(localStorage.getItem("userID"), localStorage.getItem("fileName"), rowsPerPage);
                if (responseChecker(response)) {
                    if (response.data.data.head) {
                        const responseData = response.data.data.head;
                        setDataForHead(responseData);
                        getColumnOrder();
                        getNullValues();
                        getUniqueValues();
                        getDataFrameShape();
                        getDataFrameSize();
                        getColumnDataType();
                        getCopyListData_Frame();
                        setDataHeadLoading(false);
                    }
                    else {
                        toastMessage('error', 'Error loading your data!');
                    }
                }


            } catch (error: any) {
                toastMessage('error', error);
                console.error(error);
                setDataHeadLoading(false);
            }
        };

        getHead_data();

        const getTail_data = async () => {
            try {
                setDataTailLoading(true);
                const response = await getTailDataForTable(localStorage.getItem("userID"), localStorage.getItem("fileName"), rowsPerPage);
                if (responseChecker(response)) {
                    if (response.data) {
                        setDataTailLoading(true);
                        setDataForTail(response.data.data.tail);
                        setDataTailLoading(false);
                    }
                }

            } catch (error: any) {
                toastMessage('error', 'Error fetching tail data!');
                console.error(error);
                setDataTailLoading(false);
            }
        };

        getTail_data();

        const getAllData_Description = async () => {
            try {
                setDataDescriptionLoading(true);
                const response = await getAllDataDescriptionForTable();
                // if (responseChecker(response)) {
                if (response.data) {
                    setDataDescriptionLoading(true);
                    let dataDescStr = response.data;
                    const sanitizedString = dataDescStr.replace(/NaN/g, '"NaN"');
                    const jsonResponseData = JSON.parse(sanitizedString);
                    setAllDataDescription(JSON.parse(sanitizedString));
                    const firstKeyAllDescription: any = Object.keys(jsonResponseData)[0];
                    const innerKeysAllDescription = Object.keys(jsonResponseData[firstKeyAllDescription]);
                    setFirstColumnKeysAllDescription(innerKeysAllDescription);
                    // setHeadersForDescription(Object.keys(response.data));
                    setDataDescriptionLoading(false);
                }
                // }
            } catch (error: any) {
                toastMessage('error', 'Error fetching data description!');
                console.error(error);
                setDataDescriptionLoading(false);
            }
        };
        getAllData_Description();

        const getNumeric_Description = async () => {
            try {
                setDataDescriptionLoading(true);
                const response: any = await getNumericDataDescriptionForTable();
                // if (responseChecker(response, false)) {
                if (response.data) {
                    setDataDescriptionLoading(true);
                    // let dataDescStr = response.data;
                    // const sanitizedString = dataDescStr.replace(/NaN/g, '"NaN"');
                    setNumericDataDescription(response.data);
                    const firstKeyNumericDescription = Object.keys(response.data)[0];
                    const innerKeysNumericDescription = Object.keys(response.data[firstKeyNumericDescription]);
                    setFirstColumnKeysNumericDescription(innerKeysNumericDescription);
                    setHeadersForDescription(Object.keys(response.data));
                    setDataDescriptionLoading(false);
                }
                // }
            } catch (error: any) {
                toastMessage('error', 'Error fetching numeric description!');
                console.error(error);
                setDataTailLoading(false);
            }
        };
        getNumeric_Description();

        const getData_Info = async () => {
            try {
                setDataInfoLoading(true);
                const response: any = await getDataInfoForTable();
                // if (responseChecker(response, false)) {
                if (response.data) {
                    setDataInfoLoading(true);
                    let dataInfoStr = response.data;
                    const sanitizedString = dataInfoStr.replace(/NaN/g, '"NaN"');
                    const jsonResponseData = JSON.parse(sanitizedString);
                    setDataInfo(jsonResponseData);
                    setDataInfoLoading(false);
                }
                // }
            } catch (error: any) {
                toastMessage('error', 'Error fetching data info!');
                console.error(error);
                setDataTailLoading(false);
            }
        };
        getData_Info();

    }

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuColumnOpen = Boolean(anchorEl);
    const idPopover = menuColumnOpen ? 'simple-popover' : undefined;
    const onNULLValueClicked: any = (event: React.MouseEvent<HTMLDivElement>, columnName: string) => {
        setAnchorEl(event.currentTarget);
    }



    const handleCloseMenuColumn = () => {
        setAnchorEl(null);
    };


    // TO STYLE TABLE FIRST ROW AND BODY SEPERATE
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            // backgroundColor: '#0C7BB3',
            // color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const [allColumnsChecked, setAllColumnsChecked] = useState(false);

    // TABLE ENDS HERE





    // SELECT DROPDOWN FOR PROCESSING MULTIPLE COLUMNS STARTS HERE

    // const [optionsForProcessColumns, setOptionsForProcessColumns] = React.useState<any[]>([]);
    const [optionsForProcessColumns, setOptionsForProcessColumns] = React.useState<any[]>([
        {
            id: 1, name: "Drop NULL Values", subOptions: [
                { id: 1, name: "Drop All NULL Value Rows" },
                { id: 2, name: "Drop NULL Values from a column" },
            ]
        },
        { id: 2, name: "Drop duplicate Rows" },
        // { id: 3, name: "Identify Date and Time" },
        {
            id: 4, name: "Fill NULL Values", subOptions: [
                { id: 1, name: "Fill NULL with Attributes" },
                { id: 2, name: "Fill NULL with Statistics" },
            ]
        }
    ]);

    const [subOptionsProcessingOptions, setSubOptionsProcessingOptions] = useState<any | null>(null);

    const handleHoverProcessingOptions = (options: any | null) => {
        setSubOptionsProcessingOptions(options);
    };

    const preprocessingItemClicked = (options: any) => {

    };


    const [selectedOptionsForProcessing, setSelectedOptionsForProcessing] = React.useState<string[]>([]);

    const handleChangeForSelectProcessing: any = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedOptionsForProcessing(event.target.value as string[]);
    };

    const selectProcessColumns: any = (selectOption: any) => {
        if (selectOption == 'all') {
            setSelectedOptionsForProcessing(optionsForProcessColumns);
        }
        else if (selectOption == 'none') {
            setSelectedOptionsForProcessing([])
        }
    }

    const renderOption: any = (option: string, { selected }: { selected: boolean }) => (
        <React.Fragment>
            <div className='d-flex'>
                <Checkbox checked={selected} />
                <ListItemText primary={option} />
            </div>
        </React.Fragment>
    );
    // SELECT DROPDOWN FOR PROCESSING MULTIPLE COLUMNS ENDS HERE

    const [checkedItemsOfTable, setcheckedItemsOfTable] = useState<string[]>([]);

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



    // ALERT DIALOG BOX 
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [alertDialogType, setAlertDialogType] = useState<string>();
    const [alertMessageContent, setAlertMessageContent] = useState<string>("");

    const handleClickOpenDialog = (dialogType: any) => {
        if (dialogType == 'Pre-processing') {
            if (!selectedProcessMethod) {
                toastMessage('error', 'Please select a pre-processing method first!');
            }
            // else if (checkedItemsOfTable.length <= 0) {
            //     toastMessage('error', 'Please select columns for performing method!');
            // }
            else {
                setAlertDialogType(dialogType);
                setOpenDialog(true);
            }
        }
        else if (dialogType == 'Add Row') {
            setAlertDialogType(dialogType);
            setOpenDialog(true);
        }
        else if (dialogType == 'Delete Dataframe') {
            setAlertDialogType(dialogType);
            setOpenDialog(true);
        }
        else if (dialogType == 'Delete Column') {
            setAlertDialogType(dialogType);
            setOpenDialog(true);
        }
        else if (dialogType == 'Add Column') {
            if (!newColumnNameCalculatedColumn) {
                toastMessage('error', "Kindly enter a valid column name!");
            }
            else if (!inputValueForCalculateColumn) {
                toastMessage('error', "Kindly enter the column value!");
            }
            else {
                setAlertDialogType(dialogType);
                setOpenDialog(true);
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const onProcessBtnClicked: any = () => {
        if (!selectedProcessMethod) {
            toastMessage('error', 'Please select a pre-processing method first!');
        }
        else {
            setAlertMessageContent("Are you sure you want to " + selectedProcessMethod + "?");
            handleClickOpenDialog('Pre-processing');
        }
        // if (checkedItemsOfTable.length <= 0)
        //     setAlertMessageContent("Are you sure you want to perform the following operations:" + selectedOptionsForProcessing + "?");
        // else
        //     setAlertMessageContent("Are you sure you want to perform the following operations: '" + selectedOptionsForProcessing + "' on the following columns '" + checkedItemsOfTable + "'");
    };

    const dropRowsNULL = async () => {
        try {
            const response = await dropAllRowsContainingNULLValues();
            if (responseChecker(response)) {
                toastMessage('info', 'Rows dropped successfully!');
            }
            else {
                toastMessage('error', 'Error dropping rows!');
            }

        } catch (error: any) {
            toastMessage('error', 'Error dropping rows!');
        }
    }

    const dropDuplicate = async () => {
        try {
            const response = await dropDuplicateRowsFromTable();
            if (responseChecker(response)) {
                toastMessage('info', 'Duplicate rows dropped successfully!');
                loadHeadTailDataDescription();
            }
            else {
                toastMessage('error', 'Error dropping duplicate rows!');
            }

        } catch (error: any) {
            toastMessage('error', 'Error dropping duplicate rows!');
        }
    }

    const addNew_Row = async () => {
        try {
            const response = await addRowForTable(userInputsForAddRow);
            if (responseChecker(response)) {
                toastMessage('info', 'Row added successfully!');
                loadHeadTailDataDescription();
                changeCurrProgressState();
            }
            else {
                toastMessage('error', 'Error adding row!');
            }

        } catch (error: any) {
            toastMessage('error', 'Error adding row!');
        }
    }

    const dropNULLFromColumn = async () => {
        try {
            for (let j = 0; j < checkedItemsOfTable.length; j++) {
                const response = await dropAllRowsContainingNULLValuesofColumn(checkedItemsOfTable[j]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Rows having NULL values of column dropped successfully!');
                }
                else {
                    toastMessage('error', 'Error dropping rows having NULL values of column!');
                }
            }
        } catch (error: any) {
            toastMessage('error', 'Error dropping rows having NULL values of column!');
        }
    }

    const delete_column = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await deleteAColumn(checkedItemsOfTable[i]);
                if (response.status == 200) {
                    loadHeadTailDataDescription();
                    toastMessage('info', 'Deleted!');
                    const updatedList = checkedItemsOfTable.filter(item => item !== checkedItemsOfTable[i]);
                    setcheckedItemsOfTable(updatedList);
                    changeCurrProgressState();
                }
            } catch (error: any) {
                toastMessage('error', 'Error deleting column(s)!');
                console.error(error);
            }
        }
    }

    const handleYesDialog = () => {
        if (alertDialogType == "Pre-processing") {
            if (selectedProcessMethod == "Drop NULL Values from a column") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else
                    dropNULLFromColumn();
            }
            else if (selectedProcessMethod == "Drop All NULL Value Rows") {
                dropRowsNULL();
            }
            else if (selectedProcessMethod == "Drop duplicate Rows") {
                dropDuplicate();
            }
            // toastMessage('info', 'You selected yes!');
        }
        else if (alertDialogType == "Add Row") {
            addNew_Row();
            handleCloseAddRowDialog();
        }
        else if (alertDialogType == "Delete Dataframe") {
            const deleteADataFrame = async () => {
                try {
                    const response = await deleteDataframe();
                    if (response.status == 200) {
                        toastMessage('info', 'Copy deleted successfully!');
                    }
                    else {
                        toastMessage('error', 'Error deleting dataframe');
                    }

                } catch (error: any) {
                    toastMessage('error', 'Error deleting dataframe copy');
                }
            };
            deleteADataFrame();
        }
        else if (alertDialogType == "Add Column") {
            const createColumn = async () => {
                try {
                    const response = await createAColumn(newColumnNameCalculatedColumn, inputValueForCalculateColumn);
                    if (responseChecker(response)) {
                        toastMessage('info', 'Column created successfully!');
                        loadHeadTailDataDescription();
                        changeCurrProgressState();
                    }
                    else {
                        toastMessage('error', "Error creating column");
                    }
                } catch (error: any) {
                    toastMessage('error', "Error creating column");
                }
            };
            createColumn();
            handleCloseAddColumnDialog();
        }
        else if (alertDialogType == "Delete Column") {
            delete_column();
        }
        handleCloseDialog();
    };

    const [inputValueForCalculateColumn, setInputValueForCalculateColumn] = useState('');
    const showMenuForCalculateColumn = Boolean(anchorEl);
    // const [showMenuForCalculateColumn, setShowMenuForCalculateColumn] = useState(false);
    const handleInputChangeCalculateColumn = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValueForCalculateColumn(e.target.value);
        const lastChar = e.target.value.charAt(e.target.value.length - 1);
        if (lastChar === '@') {
            setAnchorEl(e.currentTarget);
        } else {
            setAnchorEl(null);
        }
    };
    const handleMenuItemClickColumnName = (item: string) => {
        // const atIndex = inputValueForCalculateColumn.lastIndexOf('@');
        // const newValue = inputValueForCalculateColumn.slice(0, atIndex + 1);
        const indexToRemove = inputValueForCalculateColumn.indexOf('@');
        if (indexToRemove != -1)
            setInputValueForCalculateColumn(prevValue => prevValue.substring(0, indexToRemove) + prevValue.substring(indexToRemove + 1));
        setInputValueForCalculateColumn(prevValue => prevValue + item);
        setAnchorEl(null);
        // setShowMenuForCalculateColumn(false);
    };

    const handleNoDialog = () => {
        if (alertDialogType == "Pre-processing") {
            toastMessage('warning', 'No changes made!');
        }
        else if (alertDialogType == "Add Row") {
            toastMessage('warning', 'No changes made!');
            handleCloseAddRowDialog();
        }
        else if (alertDialogType == "Add Column") {
            toastMessage('warning', 'No changes made!');
            handleCloseAddColumnDialog();
        }
        else if (alertDialogType == "Delete Dataframe") {
            toastMessage('warning', 'No changes made!');
        }
        handleCloseDialog();
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        const getHead_data = async () => {
            try {
                setDataHeadLoading(true);
                const response = await getHeadDataForTable(localStorage.getItem("userID"), localStorage.getItem("fileName"), parseInt(event.target.value, 10));
                if (responseChecker(response)) {
                    if (response.data.data.head) {
                        const responseData = response.data.data.head;
                        setDataForHead(responseData);
                        getColumnOrder();
                        getNullValues();
                        getUniqueValues();
                        getDataFrameShape();
                        getDataFrameSize();
                        getColumnDataType();
                        getCopyListData_Frame();
                        setDataHeadLoading(false);
                    }
                    else {
                        toastMessage('error', 'Error loading your data!');
                    }
                }


            } catch (error: any) {
                toastMessage('error', error);
                console.error(error);
                setDataHeadLoading(false);
            }
        };

        getHead_data();

        const getTail_data = async () => {
            try {
                setDataTailLoading(true);
                const response = await getTailDataForTable(localStorage.getItem("userID"), localStorage.getItem("fileName"), parseInt(event.target.value, 10));
                if (responseChecker(response)) {
                    if (response.data) {
                        setDataTailLoading(true);
                        setDataForTail(response.data.data.tail);
                        setDataTailLoading(false);
                    }
                }

            } catch (error: any) {
                toastMessage('error', 'Error fetching tail data!');
                console.error(error);
                setDataTailLoading(false);
            }
        };

        getTail_data();
        setPage(0);
    };

    //Drag and Drop columns and change order
    const handleDragEnd = async (event: React.DragEvent<HTMLTableCellElement>, newIndex: number) => {
        event.preventDefault();
        const draggedColumnName = event.dataTransfer.getData("text/plain");
        const draggedColumnIndex = Object.keys(columnOrd).find((key) => columnOrd[parseInt(key)] === draggedColumnName);
        try {
            const dragResponse = await dragColumnForTable(draggedColumnIndex, newIndex + 1);
            if (responseChecker(dragResponse)) {
                getColumnOrder();
            }
        } catch (error: any) {
            toastMessage('error', 'Error dragging column!');
            console.error(error);
        }
    }

    const handleInputChangeAddRow = (label: string, value: string) => {
        setUserInputsForAddRow((prevState: any) => ({
            ...prevState,
            [label]: value
        }));
    };

    const updateTableData = (recievedMemory: any) => {
        if (recievedMemory['columnOrder'] && recievedMemory['dataForHead']) {
            setDataHeadLoading(true);
            setColumnOrd([]);
            setColumnOrd(recievedMemory['columnOrder']);
            setDataForHead([]);
            setDataForHead(recievedMemory['dataForHead']);
            setDataHeadLoading(false);
            toastMessage('success', "Temporary progress restored!")
        }
        else {
            toastMessage('error', "Kindly save your progress first (Capture Memory)!");
        }
    };

    const [expandedDescription, setExpandedDescription] = React.useState<string | false>(false);
    const handleChangeDescription =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpandedDescription(isExpanded ? panel : false);
        };

    const [openSubOptions, setOpenSubOptions] = React.useState(true);
    const [selectedProcessMethod, setSelectedProcessMethod] = React.useState("");

    const [openItems, setOpenItems] = React.useState<number[]>([]);

    const handleClickProcessSelectedColumns = (id: number, item: any) => {
        if (openItems.includes(id)) {
            setOpenItems(openItems.filter(itemId => itemId !== id));
        } else {
            setOpenItems([...openItems, id]);
        }
        if (!item.subOptions) {
            setSelectedProcessMethod(item.name);
        }
    }


    const renderListItem = (item: any) => {
        const hasChildren = item.subOptions && item.subOptions.length > 0;
        return (
            <React.Fragment key={item.id}>
                <ListItem button onClick={() => handleClickProcessSelectedColumns(item.id, item)}>
                    <ListItemText primary={item.name} />
                    {hasChildren && (openItems.includes(item.id) ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
                {hasChildren && (
                    <Collapse in={openItems.includes(item.id)} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.subOptions?.map((subOption: any) => (
                                <ListItem key={subOption.id} button sx={{ pl: 4 }} onClick={() => {
                                    setSelectedProcessMethod(subOption.name);
                                }}>
                                    <ListItemText primary={subOption.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    }


    const getStatusClassNameForTableHeader = (column: any) => {
        if (columnTypes[column] == "datetime") {
            return 'datetime-table-header-and-row';
        }
        else if (columnTypes[column] != "float64" && columnTypes[column] != "int64" && columnTypes[column] != "int32") {
            return 'object-table-header-and-row';
        } else {
            return 'integer-table-header-and-row';
        }
    };

    const onCaptureMemoryClicked = async () => {
        try {
            const response = await createACopyDataframe();
            if (responseChecker(response)) {
                toastMessage('info', 'Memory captured successfully!');
                getCopyListData_Frame();
                let capture_temp_data = {
                    // data: response.data.data,
                    valueBottom: copyList.length - 1
                }
                setCapturedMemory(capture_temp_data);
                try {
                    const pickCopyResposne = await getSelectedCopyDataframeForTable(response.data.data['id']);
                    if (responseChecker(pickCopyResposne)) {
                        loadHeadTailDataDescription();
                    }
                    setValueBottom(copyList.length);

                } catch (error: any) {
                    toastMessage('error', "Error picking copy!");
                    console.error(error);
                }


            }
        } catch (error: any) {
            toastMessage('error', 'Error capturing memory!');
        }
    }

    const [containerIDToast, setContainerIDToast] = React.useState<number>(0);

    const increaseContainerIDToast = () => {
        setContainerIDToast(prevCount => prevCount + 1);
    }

    const onResetCapturedState = async () => {
        try {
            const pickCopyResposne = await getSelectedCopyDataframeForTable(copyList[capturedMemory['valueBottom']]['id']);
            if (responseChecker(pickCopyResposne)) {
                loadHeadTailDataDescription();
            }
            setValueBottom(capturedMemory['valueBottom']);
            toastMessage('info', "Captured memory reset successfully!");

            // for (let i = capturedMemory['valueBottom'] + 1; i < copyList.length; i++) {
            //     if (await onlyPickCopy(i)) {
            //         try {
            //             const response = await deleteDataframe();
            //             if (response.status == 200) {
            //                 // toastMessage('info', 'Copy deleted successfully!');
            //             }
            //             else {
            //                 // toastMessage('error', 'Error deleting dataframe');
            //             }

            //         } catch (error: any) {
            //             // toastMessage('error', 'Error deleting dataframe copy');
            //         }
            //     }
            //     console.log(copyList);
            // }
            // if (await onlyPickCopy(capturedMemory['valueBottom'])) {
            //     loadHeadTailDataDescription();
            //     setValueBottom(capturedMemory['valueBottom']);
            //     toastMessage('info', "Captured memory reset successfully!");
            //     console.log(copyList);
            // }

        } catch (error: any) {
            toastMessage('error', "Error resetting captured memory!");
            console.error(error);
        }
    }

    const rowsPerPageList = [5, 10, 25, 75]

    return (
        <div>
            {/* <ToastContainer
                position="top-right"
                theme="light"
                autoClose={5000}
                closeOnClick
                style={{ width: '30em' }}
                // containerId={containerIDToast}
            /> */}
            <SavedProgressTop />
            <AlertModal open={openDialog} message={alertMessageContent} handleClose={handleCloseDialog} handleYes={handleYesDialog} handleNo={handleNoDialog} />
            <Dialog fullWidth open={openAddRowDialog} onClose={handleCloseAddRowDialog}>
                {/* Content of the dialog */}
                <div className='p-4'>
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Add a new row</DialogTitle>
                    <DialogContent dividers>
                        <div className='row'>
                            {columnsForTable.map((label, index) => (
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
            <Dialog fullWidth open={addColumnDialog} onClose={handleCloseAddColumnDialog}>
                {/* Content of the dialog */}
                <div className='p-4'>
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        <div className='d-flex' style={{ alignItems: 'flex-end' }}>
                            <div>Add a new column:&nbsp;&nbsp;&nbsp;&nbsp;</div>
                            <TextField
                                label="Column Name"
                                variant="standard"
                                value={newColumnNameCalculatedColumn}
                                onChange={handleChangeNewColumnName}
                            />
                        </div>
                    </DialogTitle>
                    <DialogContent dividers>
                        <div>
                            <Alert severity="info" className='mt-2'>Type <b>@</b> to mention column names from file</Alert>
                            <TextField className='w-100 mt-3'
                                type="text"
                                value={inputValueForCalculateColumn}
                                onChange={handleInputChangeCalculateColumn}
                                label="New Column Value"
                                variant='outlined'
                            />
                            {/* {showMenuForCalculateColumn && ( */}
                            <Popover
                                open={showMenuForCalculateColumn}
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                PaperProps={{
                                    style: {
                                        width: anchorEl?.clientWidth || 'auto'
                                    },
                                }}
                            >
                                {columnsForTable.map(item => (
                                    <MenuItem onClick={() => handleMenuItemClickColumnName(item)}>
                                        {item}</MenuItem>
                                ))}
                            </Popover>
                            {/* )} */}
                            <Alert severity="warning" className='mt-4'>Kindly enter the value that you want to fill your new column with. Eg: 100</Alert>
                        </div>
                        {/* <div className='row'>
                            <div className='col-md-4 mb-2 mt-2'>
                                <TextField
                                    // id={`filled-basic-${index}`}
                                    label=""
                                    variant="outlined"
                                    // value={userInputsForAddRow[label] || ''}
                                    // onChange={(e) => handleInputChangeAddRow(label, e.target.value)}
                                />
                            </div>
                        </div> */}
                    </DialogContent>
                    <DialogActions>
                        <div>
                            <Button onClick={() => {
                                setAlertMessageContent("Are you sure? You are about to add a new column!")
                                handleClickOpenDialog('Add Column');
                            }}
                            // disabled={inputValueForCalculateColumn.length <= 0 || newColumnNameCalculatedColumn.length <= 0}
                            >
                                <ControlPointDuplicateIcon />&nbsp;
                                Add Column</Button>
                            &nbsp;&nbsp;
                        </div>
                    </DialogActions>
                </div>
            </Dialog >
            <div>

                <div className='p-3' id='1'>


                    <div className='row'>
                        <div className='col-md-4'>
                            <p className='section-heading wow fadeIn'>Data pre-processing</p>
                        </div>
                        <div className='col-md-6 mt-2'>
                            <div className='row'>
                                <div className='col-md-5'>
                                    <Tooltip title="This action will save your changes temporarily. However, your changes will not be saved when you refresh or log out">
                                        <span>
                                            <div className='btn w-100' style={{ borderRadius: '5px', cursor: 'pointer', color: '#007164', border: '1px #007164 solid' }} onClick={() => { onCaptureMemoryClicked() }}><BeenhereIcon />&nbsp; Capture Memory</div>
                                        </span>
                                    </Tooltip>
                                </div>
                                <div className='col-md-7'>
                                    <Tooltip title="This action will revert your changes to the last captured state!">
                                        <span>
                                            <div className='btn w-100' style={{ borderRadius: '5px', cursor: 'pointer', color: '#CB4357', border: '1px #CB4357 solid' }} onClick={() => { onResetCapturedState() }}><ManageHistoryIcon />&nbsp; Reset to last captured state</div>
                                        </span>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        {/* <div className='col-md-3 mt-2 d-flex'>
                            
                        </div> */}

                        <div className='col-md-2 mt-2'>
                            <button className='btn visualize-btn w-100' onClick={() => { navigateTo('../explore-data') }}><DataThresholdingIcon />&nbsp; Explore Data</button>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div>
                            <div className='row'>
                                <div className='col-md-8'>
                                    <Tabs value={value} onChange={handleChange} aria-label="tabs">
                                        <Tab label="View Datasource (Head)" id={`tab-0`} />
                                        <Tab label="View Datasource (Tail)" id={`tab-1`} />
                                        <Tab label="Data DESCRIPTION" id={`tab-2`} />
                                        <Tab label="Data Info" id={`tab-3`} />
                                    </Tabs>
                                </div>
                                {/* <div className='col-md-1' style={{display:'flex',alignContent:'baseline'}}><DownloadIcon /></div> */}
                                <div className='col-md-4'>
                                    {/* <NestedMenu /> */}
                                    <FormControl style={{ overflow: 'auto', width: '100%', color: 'black' }}>
                                        <Select
                                            displayEmpty
                                            id="multiple-select-scrollable"
                                            multiple
                                            value={selectedOptionsForProcessing}
                                            onChange={handleChangeForSelectProcessing}
                                            input={<OutlinedInput />}
                                            // label="Process Selected Columns"
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>Process Selected Columns</em>;
                                                }

                                                // return selected.join();
                                                return <em>{selectedProcessMethod}</em>
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 225,
                                                        width: 250,
                                                    },
                                                },
                                            }}
                                        >
                                            {/* {optionsForProcessColumns.map((key: any, option: any) => ( */}
                                            <ListDropDown checkedItemsOfTable={checkedItemsOfTable} onButtonClick={() => {
                                                changeCurrProgressState();
                                                loadHeadTailDataDescription();
                                            }}
                                                onDateAndTimeClick={async () => {
                                                    try {
                                                        const identifyResponse = await identifyDateAndTimeForTable();
                                                        if (responseChecker(identifyResponse)) {
                                                            for (const key in identifyResponse.data.data) {
                                                                if (key in columnTypes) {
                                                                    columnTypes[key] = identifyResponse.data.data[key];
                                                                }
                                                            }
                                                            console.log(columnTypes);
                                                            toastMessage('info', 'Datetime columns have been marked as blue in the table!');
                                                            const getHead_data = async () => {
                                                                try {
                                                                    setDataHeadLoading(true);
                                                                    const response = await getHeadDataForTable(localStorage.getItem("userID"), localStorage.getItem("fileName"), rowsPerPage);
                                                                    if (responseChecker(response)) {
                                                                        if (response.data.data.head) {
                                                                            const responseData = response.data.data.head;
                                                                            setDataForHead(responseData);
                                                                            getColumnOrder();
                                                                            getNullValues();
                                                                            getUniqueValues();
                                                                            getDataFrameShape();
                                                                            getDataFrameSize();
                                                                            getCopyListData_Frame();
                                                                            setDataHeadLoading(false);
                                                                        }
                                                                        else {
                                                                            toastMessage('error', 'Error loading your data!');
                                                                        }
                                                                    }


                                                                } catch (error: any) {
                                                                    toastMessage('error', error);
                                                                    console.error(error);
                                                                    setDataHeadLoading(false);
                                                                }
                                                            };

                                                            getHead_data();

                                                            const getTail_data = async () => {
                                                                try {
                                                                    setDataTailLoading(true);
                                                                    const response = await getTailDataForTable(localStorage.getItem("userID"), localStorage.getItem("fileName"), rowsPerPage);
                                                                    if (responseChecker(response)) {
                                                                        if (response.data) {
                                                                            setDataTailLoading(true);
                                                                            setDataForTail(response.data.data.tail);
                                                                            setDataTailLoading(false);
                                                                        }
                                                                    }

                                                                } catch (error: any) {
                                                                    toastMessage('error', 'Error fetching tail data!');
                                                                    console.error(error);
                                                                    setDataTailLoading(false);
                                                                }
                                                            };
                                                            getTail_data();
                                                        }
                                                    } catch (err: any) {
                                                        toastMessage('error', 'Error identifying date and time!');
                                                    }
                                                }}
                                            />
                                            {/* <List
                                                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                                component="nav"
                                                aria-labelledby="nested-list-subheader"
                                                subheader={
                                                    <ListSubheader component="div" id="nested-list-subheader">
                                                        Pick options for pre-processing your data
                                                    </ListSubheader>
                                                }
                                            >
                                                {optionsForProcessColumns.map(option => (
                                                    <div>
                                                        {option.subOptions ? (
                                                            <ListItemButton onClick={handleClickSubOptions}>
                                                                <ListItemText>{option.name}</ListItemText>
                                                                {openSubOptions ? <ExpandLess /> : <ExpandMore />}
                                                            </ListItemButton>
                                                        ) : (
                                                            <div>
                                                                <ListItemButton>
                                                                    <ListItemText >
                                                                        {renderOption(option.name, { selected: selectedOptionsForProcessing.indexOf(option.name) > -1 })}
                                                                    </ListItemText>
                                                                </ListItemButton>
                                                                <Collapse in={openSubOptions} timeout="auto" unmountOnExit>
                                                                    <List>
                                                                        <ListItemButton>
                                                                            <ListItemText primary="Starred" />
                                                                        </ListItemButton>
                                                                    </List>
                                                                </Collapse>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                            </List> */}


                                            {/* <div style={{ position: 'sticky', bottom: '0', display: 'relative', backgroundColor: 'white' }}>
                                                <div className='col-12 p-2 text-center'>
                                                    <div className='p-1' style={{ fontSize: '10px', cursor: 'pointer', color: 'white', backgroundColor: 'grey', borderRadius: '5px' }} onClick={() => { onProcessBtnClicked() }}>Current selected Method: {selectedProcessMethod}. <br />Click here to proceed</div>
                                                </div>
                                            </div> */}
                                        </Select>

                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        <TabPanel value={value} index={0}>
                            <Paper className='mt-3' sx={{ width: '100%', overflow: 'hidden' }}>
                                {dataHeadLoading === true ? (
                                    <div className='text-center'>
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <div>
                                        <TableContainer // sx={{ maxHeight: 440 }}
                                        >
                                            {/* {columnTypes} */}
                                            <Table style={{ position: 'relative' }} stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ backgroundColor: '#9eadbd51' }}>
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
                                                            <TableCell
                                                                className={`${getStatusClassNameForTableHeader(column)}`}
                                                                style={{ backgroundColor: '#9eadbd51' }}
                                                                key={index} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", column)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDragEnd(e, index)}>

                                                                <div className="badge" aria-describedby={idPopover} onClick={(event) => { onNULLValueClicked(event, column) }}>
                                                                    <Tooltip title={
                                                                        <React.Fragment>
                                                                            NULL Count: {nullValues[column]}
                                                                            <br />
                                                                            Unique Count:  {uniqueValues[column]}
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
                                                                {/* <Popover
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
                                                                </Popover> */}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataForHead.map((row, index) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                            <TableCell>
                                                                {index}
                                                            </TableCell>
                                                            {Object.values(columnOrd).map((column, colIndex) => (
                                                                <TableCell key={colIndex}
                                                                    className={`${getStatusClassNameForTableHeader(column)}`}
                                                                >{row[column]}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <div className='row'>
                                            <div className='col-md-1'>
                                                <SpeedDial
                                                    ariaLabel="SpeedDial openIcon example"
                                                    sx={{ position: 'absolute', left: '2%' }}
                                                    // sx={{ position: 'absolute', bottom: '0%', left: '1%', backgroundColor: 'transparent' }}
                                                    // icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                                                    icon={<ListIcon />}
                                                    openIcon={<MoreVertIcon />}
                                                    direction="right"
                                                >
                                                    <SpeedDialAction
                                                        key='Delete Selected Column'
                                                        icon={<DeleteSweepIcon />}
                                                        tooltipTitle='Delete Selected Column'
                                                        onClick={() => { handleDeleteColumn() }}
                                                    />
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
                                                        onClick={() => { handleOpenAddColumn() }}
                                                    />
                                                    <SpeedDialAction
                                                        key='Delete this copy of file'
                                                        icon={<DeleteForeverIcon />}
                                                        tooltipTitle='Delete this copy of file'
                                                        onClick={() => {
                                                            setAlertMessageContent('Are you sure you want to delete this copy of file? Please note this is an irreversible action!');
                                                            handleClickOpenDialog('Delete Dataframe');
                                                        }}
                                                    />
                                                    <SpeedDialAction
                                                        key='Create A Copy'
                                                        icon={<FileCopyIcon />}
                                                        tooltipTitle='Create A Copy'
                                                        onClick={() => {
                                                            const createCopy = async () => {
                                                                try {
                                                                    const response = await createACopyDataframe();
                                                                    if (responseChecker(response)) {
                                                                        toastMessage('info', 'Copy created successfully!');
                                                                        getCopyListData_Frame();
                                                                    }
                                                                } catch (error: any) {
                                                                    toastMessage('error', 'Error creating copy!');
                                                                }
                                                            };
                                                            createCopy();
                                                        }}
                                                    />
                                                </SpeedDial>
                                            </div>
                                            <div className='col-md-9'>
                                                <BottomNavigation
                                                    showLabels
                                                    value={valueBottom}
                                                    onChange={handleChangeForBottomNavigation}
                                                // className='col-md-11'
                                                >
                                                    {copyList.map((copyListItem: any, index: any) => (
                                                        <BottomNavigationAction key={copyListItem.id} label={copyListItem.name} />
                                                    ))}
                                                </BottomNavigation>
                                            </div>
                                            <div className='col-md-2 mt-1 text-right'>
                                                <span style={{ fontSize: '0.8em' }}>Data Shape: {dataShape[0]}, {dataShape[1]}&nbsp;</span>
                                            </div>
                                        </div>
                                        <TablePagination
                                            rowsPerPageOptions={rowsPerPageList}
                                            component="div"
                                            count={dataForHead.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </div>

                                )}
                            </Paper>
                        </TabPanel>

                        <TabPanel value={value} index={1}>
                            <Paper className='mt-3' sx={{ width: '100%', overflow: 'hidden' }}>
                                {dataTailLoading === true ? (
                                    <div className='text-center'>
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <div>
                                        <TableContainer // sx={{ maxHeight: 440 }}
                                        >
                                            <Table style={{ position: 'relative' }} stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ backgroundColor: '#9eadbd51' }}>
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
                                                            <TableCell
                                                                className={`${getStatusClassNameForTableHeader(column)}`}
                                                                style={{ backgroundColor: '#9eadbd51' }}
                                                                key={index} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", column)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDragEnd(e, index)}>

                                                                <div className="badge" aria-describedby={idPopover} onClick={(event) => { onNULLValueClicked(event, column) }}>
                                                                    <Tooltip title={
                                                                        <React.Fragment>
                                                                            NULL Count: {nullValues[column]}
                                                                            <br />
                                                                            Unique Count:  {uniqueValues[column]}
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
                                                                {/* <Popover
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
                                                                </Popover> */}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {dataForTail.map((row, index) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                            <TableCell>
                                                                {dataShape[0] - 5 + index}
                                                            </TableCell>
                                                            {Object.values(columnOrd).map((column, colIndex) => (
                                                                <TableCell key={colIndex}
                                                                    className={`${getStatusClassNameForTableHeader(column)}`}
                                                                >{row[column]}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <div className='row'>
                                            <div className='col-md-1'>
                                                <SpeedDial
                                                    ariaLabel="SpeedDial openIcon example"
                                                    sx={{ position: 'absolute', left: '2%' }}
                                                    // sx={{ position: 'absolute', bottom: '0%', left: '1%', backgroundColor: 'transparent' }}
                                                    // icon={<SpeedDialIcon openIcon={<EditIcon />} />}
                                                    icon={<ListIcon />}
                                                    openIcon={<MoreVertIcon />}
                                                    direction="right"
                                                >
                                                    {/* <SpeedDialAction
                                                        key='Add Row'
                                                        icon={<SplitscreenIcon />}
                                                        tooltipTitle='Add Row'
                                                        onClick={() => { handleOpenAddRowDialog() }}
                                                    /> */}
                                                    <SpeedDialAction
                                                        key='Delete Selected Column'
                                                        icon={<DeleteSweepIcon />}
                                                        tooltipTitle='Delete Selected Column'
                                                        onClick={() => { handleDeleteColumn() }}
                                                    />
                                                    <SpeedDialAction
                                                        key='Add A New Column'
                                                        icon={<ViewWeekIcon />}
                                                        tooltipTitle='Add A New Column'
                                                        onClick={() => { handleOpenAddColumn() }}
                                                    />
                                                    <SpeedDialAction
                                                        key='Delete this copy of file'
                                                        icon={<DeleteForeverIcon />}
                                                        tooltipTitle='Delete this copy of file'
                                                        onClick={() => {
                                                            setAlertMessageContent('Are you sure you want to delete this copy of file? Please note this is an irreversible action!');
                                                            handleClickOpenDialog('Delete Dataframe');
                                                        }}
                                                    />
                                                    <SpeedDialAction
                                                        key='Create A Copy'
                                                        icon={<FileCopyIcon />}
                                                        tooltipTitle='Create A Copy'
                                                        onClick={() => {
                                                            const createCopy = async () => {
                                                                try {
                                                                    const response = await createACopyDataframe();
                                                                    if (responseChecker(response)) {
                                                                        toastMessage('info', 'Copy created successfully!');
                                                                    }
                                                                } catch (error: any) {
                                                                    toastMessage('error', 'Error creating copy!');
                                                                }
                                                            };
                                                            createCopy();
                                                        }}
                                                    />
                                                </SpeedDial>
                                            </div>
                                            <div className='col-md-9'>
                                                <BottomNavigation
                                                    showLabels
                                                    value={valueBottom}
                                                    onChange={handleChangeForBottomNavigation}
                                                // onChange={(event, newValue) => {
                                                //     setValueBottom(newValue);
                                                // }}
                                                // className='col-md-11'
                                                >
                                                    {copyList.map((copyListItem: any, index: any) => (
                                                        <BottomNavigationAction key={copyListItem.id} label={copyListItem.name} />
                                                    ))}
                                                </BottomNavigation>
                                            </div>
                                            <div className='col-md-2 mt-1 text-right'>
                                                <span style={{ fontSize: '0.8em' }}>Data Shape: {dataShape[0]}, {dataShape[1]}&nbsp;</span>
                                            </div>
                                        </div>
                                        <TablePagination
                                            rowsPerPageOptions={rowsPerPageList}
                                            component="div"
                                            count={dataForHead.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </div>

                                )}
                            </Paper>
                        </TabPanel>

                        <TabPanel value={value} index={2}>
                            <Paper className='mt-3' sx={{ width: '100%', overflow: 'hidden' }}>
                                {dataDescriptionLoading === true ? (
                                    <div className='text-center'>
                                        <CircularProgress />
                                    </div>
                                ) : (
                                    <div>
                                        <Accordion expanded={expandedDescription === 'panel1'} onChange={handleChangeDescription('panel1')}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                    Numeric Columns
                                                </Typography>
                                                {expandedDescription === 'panel1' ? (
                                                    <Typography sx={{ color: 'text.secondary' }}>
                                                        Click to close data description for numeric columns
                                                    </Typography>
                                                ) : (
                                                    <Typography sx={{ color: 'text.secondary' }}>
                                                        Click to view data description for numeric columns
                                                    </Typography>
                                                )}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <TableContainer // sx={{ maxHeight: 440 }}
                                                >
                                                    <Table style={{ position: 'relative' }} stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{ backgroundColor: '#9eadbd51' }}>
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
                                                                {Object.values(Object.keys(numericDataDescription)).map((column, index) => (
                                                                    <TableCell style={columnTypes[column] != "float64" && columnTypes[column] != "int64" && columnTypes[column] != "int32" ? { color: '#CB4357', cursor: 'move', backgroundColor: '#9eadbd51' } : { cursor: 'move', backgroundColor: '#9eadbd51' }} key={index} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", column)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDragEnd(e, index)}>
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
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {firstColumnKeysNumericDescription.map((key) => (
                                                                <TableRow key={key}>
                                                                    <TableCell>{key}</TableCell> {/* First column values */}
                                                                    {Object.values(Object.keys(numericDataDescription)).map((column: any, index) => (
                                                                        // {columnTypes[column] != "float64" ? (<div></div>):(<div></div>)}
                                                                        // {columnTypes[column] != "float64" && columnTypes[column] != "int64" ? (<div></div>) : (<div></div>)}
                                                                        <TableCell key={`${key}-${column}`}>
                                                                            {isNaN(parseFloat(numericDataDescription[column][key])) || !isFinite(numericDataDescription[column][key])
                                                                                ? numericDataDescription[column][key]
                                                                                : parseFloat(numericDataDescription[column][key]).toFixed(2)}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </AccordionDetails>
                                        </Accordion>
                                        <Accordion expanded={expandedDescription === 'panel2'} onChange={handleChangeDescription('panel2')}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel2bh-content"
                                                id="panel2bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>All Columns</Typography>
                                                {expandedDescription === 'panel2' ? (
                                                    <Typography sx={{ color: 'text.secondary' }}>
                                                        Click to close data description for all existing columns
                                                    </Typography>
                                                ) : (
                                                    <Typography sx={{ color: 'text.secondary' }}>
                                                        Click to view data description for all existing columns
                                                    </Typography>
                                                )}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <TableContainer // sx={{ maxHeight: 440 }}
                                                >
                                                    <Table style={{ position: 'relative' }} stickyHeader aria-label="sticky table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{ backgroundColor: '#9eadbd51' }}>
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
                                                                {Object.values(Object.keys(allDataDescription)).map((column, index) => (
                                                                    <TableCell style={columnTypes[column] != "float64" && columnTypes[column] != "int64" && columnTypes[column] != "int32" ? { color: '#CB4357', cursor: 'move', backgroundColor: '#9eadbd51' } : { cursor: 'move', backgroundColor: '#9eadbd51' }} key={index} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", column)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDragEnd(e, index)}>
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
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {firstColumnKeysAllDescription.map((key) => (
                                                                <TableRow key={key}>
                                                                    <TableCell>{key}</TableCell> {/* First column values */}
                                                                    {Object.values(Object.keys(allDataDescription)).map((column: any, index) => (
                                                                        <TableCell style={columnTypes[column] != "float64" && columnTypes[column] != "int64" && columnTypes[column] != "int32" ? { color: '#CB4357' } : {}} key={`${key}-${column}`}>
                                                                            {isNaN(parseFloat(allDataDescription[column][key])) || !isFinite(allDataDescription[column][key])
                                                                                ? allDataDescription[column][key]
                                                                                : parseFloat(allDataDescription[column][key]).toFixed(2)}
                                                                        </TableCell>
                                                                    ))}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </AccordionDetails>
                                        </Accordion>


                                    </div>)}
                            </Paper>
                        </TabPanel>

                        <TabPanel value={value} index={3}>
                            {dataInfoLoading === true ? (
                                <div className='text-center'>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <Paper className='mt-3'>
                                    <pre className='text-center'>{dataInfo['info_summary']}</pre>
                                </Paper>
                            )
                            }

                        </TabPanel>
                    </div>
                </div >
            </div >


            {/* <div className="wrapper">
                <div id='slide'> */}
            {/* <div className='previous-next-btn-bottom'> */}
            <div style={{ textAlign: 'right' }} className='m-2 mt-4'>
                <span className='cursor-pointer' onClick={() => { navigateTo('/home') }}
                ><NavigateBeforeIcon /> Prev</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className='cursor-pointer'
                    onClick={() => { navigateTo('/selectModel') }}
                >Next <NavigateNextIcon /></span>
            </div>
            {/* </div> */}
            {/* <PublishedWithChangesIcon />&nbsp;&nbsp;View your complete history */}
            {/* </div>
            </div> */}


        </div >



    )
}

export default MLActivity
