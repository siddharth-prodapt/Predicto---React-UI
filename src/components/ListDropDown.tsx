import React, { useEffect, useState } from 'react';
import { Autocomplete, List, ListItem, ListItemText, Collapse, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, FormControlLabel, Radio, RadioGroup, Select, MenuItem, TextField, FormControl, OutlinedInput } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ToastContainer, toast } from 'react-toastify';
import AlertModal from './AlertModal';
import { convertAllToNumeric, convertColumnToNumeric, dropAllRowsContainingNULLValues, dropAllRowsContainingNULLValuesofColumn, dropDuplicateRowsFromTable, fillNULLWithAttribute, fillNULLWithStats, getUniqueValuesByColumn, labelEnocdeColumn, labelEnocdeColumnInverse, meanNormalization, meanNormalizationColumn, minMaxScaling, minMaxScalingColumn, robustScaling, robustScalingColumn, unitVectorScaling, unitVectorScalingColumn, zScoreNorm, zScoreNormColumn } from '../AllAssets';
import { AxiosResponse } from 'axios';
import InputLabel from '@mui/material/InputLabel';
import { SelectChangeEvent } from '@mui/material/Select';

// interface Option {
//     id: number;
//     name: string;
//     subOptions?: Option[];
// }

const optionsForProcessColumns: any[] = [
    {
        id: 1, name: "Drop NULL Values", subOptions: [
            { id: 1, name: "Drop All NULL Value Rows" },
            { id: 2, name: "Drop NULL Values from a column" },
        ]
    },
    { id: 2, name: "Drop duplicate Rows" },
    {
        id: 10, name: "Label Encode", subOptions: [
            { id: 1, name: "Label Encode Selected Columns" },
            { id: 2, name: "Label Encode Inverse Selected Columns" },
        ]
    },
    { id: 3, name: "Identify Date and Time" },
    {
        id: 4, name: "Convert Numeric Column", subOptions: [
            { id: 1, name: "Convert All Rows to Numeric" },
            { id: 2, name: "Convert Columns to Numeric Values" },
        ]
    },
    {
        id: 5, name: "Fill NULL Values", subOptions: [
            {
                id: 1, name: "Fill Selected column NULL values with Statistics", subOptions: [
                    { id: 1, name: "Mean" },
                    { id: 2, name: "Median" },
                    { id: 3, name: "Mode" },
                ]
            },
            { id: 2, name: "Fill NULL with Attributes" },
        ]
    },
    {
        id: 6, name: "Mean Normalization", subOptions: [
            { id: 1, name: "Mean Normalization For All Columns" },
            { id: 2, name: "Mean Normalization for selected column" },
        ]
    },
    {
        id: 7, name: "Min max scaling", subOptions: [
            { id: 1, name: "Min max scaling For All Columns" },
            { id: 2, name: "Min max scaling for selected column" },
        ]
    },
    {
        id: 8, name: "Robust Scaling", subOptions: [
            { id: 1, name: "Robust Scaling For All Columns" },
            { id: 2, name: "Robust Scaling for selected column" },
        ]
    },
    {
        id: 9, name: "Unit Vector Scaling", subOptions: [
            { id: 1, name: "Unit Vector Scaling For All Columns" },
            { id: 2, name: "Unit Vector Scaling for selected column" },
        ]
    },
    {
        id: 10, name: "Z Score Normalization", subOptions: [
            { id: 1, name: "Z Score Normalization For All Columns" },
            { id: 2, name: "Z Score Normalization for selected column" },
        ]
    },
];

interface ListItemWithSubOptionsProps {
    item: any;
    handleClick: (item: any) => void;
    openItems: number[];
    selectedValue: any;
}

const ListItemWithSubOptions: React.FC<ListItemWithSubOptionsProps> = ({ item, handleClick, openItems, selectedValue }) => {
    const hasChildren = item.subOptions && item.subOptions.length > 0;
    const [open, setOpen] = useState(false);




    const handleClickToggle = () => {
        setOpen(!open);
    };

    return (
        <React.Fragment key={item.id}>
            <ListItem button onClick={hasChildren ? handleClickToggle : () => handleClick(item)}
                style={{
                    backgroundColor: selectedValue == item.name ? '#00000019' : 'white',
                }}
            >
                <ListItemText primary={item.name} />
                {hasChildren && (open || openItems.includes(item.id) ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {hasChildren && (
                <Collapse in={open || openItems.includes(item.id)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.subOptions?.map((subOption: any) => (
                            <ListItemWithSubOptions
                                key={subOption.id}
                                item={subOption}
                                handleClick={handleClick}
                                openItems={openItems}
                                selectedValue={selectedValue}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </React.Fragment>
    );
};

interface ListDropDownProps {
    checkedItemsOfTable: any; // Define the type of data you want to pass
    onButtonClick: any;
    onDateAndTimeClick: any;
}

const ListDropDown: React.FC<ListDropDownProps> = ({ checkedItemsOfTable, onButtonClick, onDateAndTimeClick }) => {
    const [selectedValue, setSelectedValue] = useState("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [alertDialogType, setAlertDialogType] = useState<string>();
    const [alertMessageContent, setAlertMessageContent] = useState<string>("");

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClickOpenDialog = (dialogType: any) => {
        if (dialogType == 'Pre-processing') {
            if (!selectedValue) {
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

    const [openItems, setOpenItems] = useState<number[]>([]);


    const [radioStates, setRadioStates] = useState<{ [key: string]: string }>({});

    const [uniqueValueList, setUniqueValueList] = useState<{ [key: string]: any }>({});

    const [enteredExistingValueList, setEnteredExistingValueList] = useState<{ [key: string]: any }>({});
    const [customValuesNullList, setCustomValuesNullList] = useState<{ [key: string]: any }>({});

    const [uniqueLoading, setUniqueLoading] = useState<Boolean>(true);

    const handleSelectChangeForUnique = (event: any, item: any) => {
        const value = event.target.value;
        setEnteredExistingValueList(prevState => ({
            ...prevState,
            [item]: value
        }));
    };

    const handleCustomInputChange = (event: any, item: any) => {
        const value = event.target.value;
        setCustomValuesNullList(prevState => ({
            ...prevState,
            [item]: value
        }));
    };

    useEffect(() => {
        // Function to run once when component mounts
        setUniqueLoading(true);
        setUnique();
    }, []);

    const setUnique = async () => {
        if (checkedItemsOfTable.length >= 1) {
            const newData: { [key: string]: string } = {};
            checkedItemsOfTable.forEach(async (item: any, index: any) => {
                try {
                    const uniqueResponse = await getUniqueValuesByColumn(item);
                    if (responseChecker(uniqueResponse)) {
                        // const sanitizedString = uniqueResponse.data.data.replace(/NaN/g, '"NaN"');
                        // const jsonResponseData = JSON.parse(sanitizedString);
                        console.log("newData", newData);
                        newData[item] = uniqueResponse.data.data;
                        setUniqueValueList(newData);
                    }
                    else {
                        toastMessage('error', 'Error getting unique values for column - ' + item + '!');
                    }

                } catch (error: any) {
                    toastMessage('error', 'Error getting unique values for column - ' + item + '!');
                    console.log(error);
                }
            });
            setUniqueValueList(newData);
            setUniqueLoading(false);
        }
    }

    const handleRadioChange = (item: string, value: string) => {
        setRadioStates(prevState => ({
            ...prevState,
            [item]: value
        }));
    };



    const handleClickProcessSelectedColumns = (item: any) => {
        setSelectedValue(item.name);
        setOpenItems(prevOpenItems => {
            if (prevOpenItems.includes(item.id)) {
                return prevOpenItems.filter(openId => openId !== item.id);
            } else {
                return [...prevOpenItems, item.id];
            }
        });
    };


    const handleSubOptionClick = (item: any) => {
        console.log("Selected Process Method:", item.name);
    };

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
            console.log(error);
            toastMessage('error', 'Error dropping rows!');
        }
    }

    const convertAllRows_ToNumeric = async () => {
        try {
            const response = await convertAllToNumeric();
            if (responseChecker(response)) {
                toastMessage('info', 'All values converted to numeric!');
            }
            else {
                toastMessage('error', "Error converting values to numeric!");
            }

        } catch (error: any) {
            console.log(error);
            toastMessage('error', "Error converting values to numeric!");
        }
    }

    const convertSelectedColumns_ToNumeric = async () => {
        if (checkedItemsOfTable.length >= 0)
            for (let i = 0; i < checkedItemsOfTable.length; i++) {
                try {
                    const response = await convertColumnToNumeric(checkedItemsOfTable[i]);
                    console.log("convertColumnToNumeric", response);
                    if (responseChecker(response)) {
                        console.log(response);
                        toastMessage('info', checkedItemsOfTable[i] + ' values converted to numeric!');
                    }
                    else {
                        toastMessage('error', "Error converting values to numeric at " + checkedItemsOfTable[i] + '!');
                    }

                } catch (error: any) {
                    console.log(error);
                    toastMessage('error', "Error converting values to numeric at " + checkedItemsOfTable[i] + '!');
                }
            }

    }

    const mean_normalization = async () => {
        try {
            const response = await meanNormalization();
            console.log("meanNormalization", response);
            if (responseChecker(response)) {
                toastMessage('info', 'Mean normalization performed successfully!');
            }
            else {
                toastMessage('error', 'Error performing Mean normalization!');
            }

        } catch (error: any) {
            console.log(error);
            toastMessage('error', 'Error performing Mean normalization!');
        }
    }

    const mean_normalization_for_column = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await meanNormalizationColumn(checkedItemsOfTable[i]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Mean normalization performed successfully on ' + checkedItemsOfTable[i] + '!');
                }
                else {
                    toastMessage('error', 'Error performing Mean normalization on ' + checkedItemsOfTable[i] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error performing Mean normalization on ' + checkedItemsOfTable[i] + '!');
            }
        }
    }

    const label_encode_column = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await labelEnocdeColumn(checkedItemsOfTable[i]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Label Enocde performed successfully on ' + checkedItemsOfTable[i] + '!');
                }
                else {
                    toastMessage('error', 'Error performing label Enocde on ' + checkedItemsOfTable[i] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error performing label Enocde on ' + checkedItemsOfTable[i] + '!');
            }
        }
    }

    const label_encode_inverse_column = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await labelEnocdeColumnInverse(checkedItemsOfTable[i]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Label Enocde inverse performed successfully on ' + checkedItemsOfTable[i] + '!');
                }
                else {
                    toastMessage('error', 'Error performing label Enocde inverse on ' + checkedItemsOfTable[i] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error performing label Enocde inverse on ' + checkedItemsOfTable[i] + '!');
            }
        }
    }

    const fill_null_with_stats = async (type: any) => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await fillNULLWithStats(checkedItemsOfTable[i], type);
                if (responseChecker(response)) {
                    toastMessage('info', 'NULL Values for column ' + checkedItemsOfTable[i] + ' filled with ' + type + ' successfully!');
                }
                else {
                    toastMessage('error', 'Error filling NULL with ' + type + ' on ' + checkedItemsOfTable[i] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error filling NULL with ' + type + ' on ' + checkedItemsOfTable[i] + '!');
            }
        }
    }

    const fill_null_with_attribute = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            if (radioStates[checkedItemsOfTable[i]] == 'existing') {
                try {
                    const response = await fillNULLWithAttribute(checkedItemsOfTable[i], enteredExistingValueList[checkedItemsOfTable[i]]);
                    if (responseChecker(response)) {
                        toastMessage('info', 'NULL Values for column ' + checkedItemsOfTable[i] + 'filled with ' + enteredExistingValueList[checkedItemsOfTable[i]] + ' successfully!');
                    }
                    else {
                        toastMessage('error', 'Error filling null values of column ' + checkedItemsOfTable[i] + '!');
                    }

                } catch (error: any) {
                    console.log(error);
                    toastMessage('error', 'Error filling null values of column ' + checkedItemsOfTable[i] + '!');
                }
            }
            else if (radioStates[checkedItemsOfTable[i]] == 'custom') {
                try {
                    const response = await fillNULLWithAttribute(checkedItemsOfTable[i], customValuesNullList[checkedItemsOfTable[i]]);
                    if (responseChecker(response)) {
                        toastMessage('info', 'NULL Values for column ' + checkedItemsOfTable[i] + ' filled with ' + customValuesNullList[checkedItemsOfTable[i]] + ' successfully!');
                    }
                    else {
                        toastMessage('error', 'Error filling null values of ' + checkedItemsOfTable[i] + '!');
                    }

                } catch (error: any) {
                    console.log(error);
                    toastMessage('error', 'Error filling null values of ' + checkedItemsOfTable[i] + '!');
                }
            }
        }
        setOpenAttributesDialog(false);
    }

    const min_max_scaling = async () => {
        try {
            const response = await minMaxScaling();
            if (responseChecker(response)) {
                toastMessage('info', 'Min max scaling performed successfully!');
            }
            else {
                toastMessage('error', 'Error performing Min max scaling!');
            }

        } catch (error: any) {
            console.log(error);
            toastMessage('error', 'Error performing Min max scaling!');
        }
    }

    const min_max_scaling_column = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await minMaxScalingColumn(checkedItemsOfTable[i]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Mean normalization performed successfully on ' + checkedItemsOfTable[i] + '!');
                }
                else {
                    toastMessage('error', 'Error performing Min Max Scaling on ' + checkedItemsOfTable[i] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error performing Min Max Scaling on ' + checkedItemsOfTable[i] + '!');
            }
        }
    }

    const robust_scaling = async () => {
        try {
            const response = await robustScaling();
            if (responseChecker(response)) {
                toastMessage('info', 'Robust Scaling performed successfully!');
            }
            else {
                toastMessage('error', 'Error performing Robust Scaling!');
            }

        } catch (error: any) {
            console.log(error);
            toastMessage('error', 'Error performing Robust Scaling!');
        }
    }

    const robust_scaling_column = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await robustScalingColumn(checkedItemsOfTable[i]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Robust Scaling performed successfully for ' + checkedItemsOfTable[i] + '!');
                }
                else {
                    toastMessage('error', 'Error performing Robust Scaling for ' + checkedItemsOfTable[i] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error performing Robust Scaling for ' + checkedItemsOfTable[i] + '!');
            }
        }
    }

    const unit_vector_scaling = async () => {
        try {
            const response = await unitVectorScaling();
            if (responseChecker(response)) {
                toastMessage('info', 'Unit Vector Scaling performed successfully!');
            }
            else {
                toastMessage('error', 'Error performing Unit Vector Scaling!');
            }

        } catch (error: any) {
            console.log(error);
            toastMessage('error', 'Error performing Unit Vector Scaling!');
        }
    }

    const unit_vector_scaling_column = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await unitVectorScalingColumn(checkedItemsOfTable[i]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Unit Vector Scaling performed successfully for ' + checkedItemsOfTable[i] + '!');
                }
                else {
                    toastMessage('error', 'Error performing Unit Vector Scaling for ' + checkedItemsOfTable[i] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error performing Unit Vector Scaling for ' + checkedItemsOfTable[i] + '!');
            }
        }
    }

    const z_score_norm = async () => {
        try {
            const response = await zScoreNorm();
            if (responseChecker(response)) {
                toastMessage('info', 'Z Score Normalization performed successfully!');
            }
            else {
                toastMessage('error', 'Error performing Z Score Normalization!');
            }

        } catch (error: any) {
            console.log(error);
            toastMessage('error', 'Error performing Z Score Normalization!');
        }
    }

    const z_score_norm_column = async () => {
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            try {
                const response = await zScoreNormColumn(checkedItemsOfTable[i]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Z Score Normalization performed successfully for ' + checkedItemsOfTable[i] + '!');
                }
                else {
                    toastMessage('error', 'Error performing Z Score Normalization for ' + checkedItemsOfTable[i] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error performing Z Score Normalization for ' + checkedItemsOfTable[i] + '!');
            }
        }
    }


    const dropDuplicate = async () => {
        try {
            const response = await dropDuplicateRowsFromTable();
            if (responseChecker(response)) {
                toastMessage('info', 'Duplicate rows dropped successfully!');
            }
            else {
                toastMessage('error', 'Error dropping duplicate rows!');
            }

        } catch (error: any) {
            console.log(error);
            toastMessage('error', 'Error dropping duplicate rows!');
        }
    }

    const dropNULLFromColumn = async () => {
        for (let j = 0; j < checkedItemsOfTable.length; j++) {
            try {
                const response = await dropAllRowsContainingNULLValuesofColumn(checkedItemsOfTable[j]);
                if (responseChecker(response)) {
                    toastMessage('info', 'Rows having NULL values of column: ' + checkedItemsOfTable[j] + ' dropped successfully!');
                }
                else {
                    toastMessage('error', 'Error dropping rows having NULL values of column ' + checkedItemsOfTable[j] + '!');
                }

            } catch (error: any) {
                console.log(error);
                toastMessage('error', 'Error dropping rows having NULL values of column ' + checkedItemsOfTable[j] + '!');
            }
        }
    }

    const [openAttributesDialog, setOpenAttributesDialog] = useState(false);

    const handleOpenAttributesDialog = () => {
        setOpenAttributesDialog(true);
    };

    const handleCloseAttributesDialog = () => {
        setOpenAttributesDialog(false);
    };

    const handleConfirmAttributeDialog = () => {
        let callApi = true;
        for (let i = 0; i < checkedItemsOfTable.length; i++) {
            if (!radioStates[checkedItemsOfTable[i]]) {
                toastMessage('error', "Please enter all the values");
                callApi = false;
            }
            else if (radioStates[checkedItemsOfTable[i]] == "custom" && !customValuesNullList[checkedItemsOfTable[i]]) {
                toastMessage('error', "Please enter all custom values");
                callApi = false;
            }
            else if (radioStates[checkedItemsOfTable[i]] == "existing" && !enteredExistingValueList[checkedItemsOfTable[i]]) {
                toastMessage('error', "Please enter all existing values");
                callApi = false;
            }
        }
        if (callApi == true)
            fill_null_with_attribute();
    }


    const handleYesDialog = async () => {
        if (alertDialogType == "Pre-processing") {
            if (selectedValue == "Drop NULL Values from a column") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await dropNULLFromColumn();
                    onButtonClick();
                }
            }
            else if (selectedValue == "Drop All NULL Value Rows") {
                await dropRowsNULL();
                onButtonClick();
            }
            else if (selectedValue == "Mean Normalization For All Columns") {
                await mean_normalization();
                onButtonClick();
            }
            else if (selectedValue == "Label Encode Selected Columns") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await label_encode_column();
                    onButtonClick();
                }
            }
            else if (selectedValue == "Label Encode Inverse Selected Columns") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await label_encode_inverse_column();
                    onButtonClick();
                }
            }
            else if (selectedValue == "Mean Normalization for selected column") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await mean_normalization_for_column();
                    onButtonClick();
                }
            }
            else if (selectedValue == "Mean") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await fill_null_with_stats("mean");
                    onButtonClick();
                }
            }
            else if (selectedValue == "Median") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await fill_null_with_stats("median");
                    onButtonClick();
                }
            }
            else if (selectedValue == "Mode") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await fill_null_with_stats("mode");
                    onButtonClick();
                }
            }
            else if (selectedValue == "Drop duplicate Rows") {
                await dropDuplicate();
                onButtonClick();
            }
            else if (selectedValue == "Identify Date and Time") {
                onDateAndTimeClick();
            }
            else if (selectedValue == "Fill NULL with Attributes") {
                handleOpenAttributesDialog();
                // setOpenAttributesDialog(true);
            }
            else if (selectedValue == "Min max scaling For All Columns") {
                await min_max_scaling();
                onButtonClick();
            }
            else if (selectedValue == "Min max scaling for selected column") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await min_max_scaling_column();
                    onButtonClick();
                }
            }
            else if (selectedValue == "Robust Scaling For All Columns") {
                await robust_scaling();
                onButtonClick();
            }
            else if (selectedValue == "Robust Scaling for selected column") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await robust_scaling_column();
                    onButtonClick();
                }
            }
            else if (selectedValue == "Unit Vector Scaling For All Columns") {
                await unit_vector_scaling();
                onButtonClick();
            }
            else if (selectedValue == "Unit Vector Scaling for selected column") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await unit_vector_scaling_column();
                    onButtonClick();
                }
            }
            else if (selectedValue == "Z Score Normalization For All Columns") {
                await z_score_norm();
                onButtonClick();
            }
            else if (selectedValue == "Z Score Normalization for selected column") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await z_score_norm_column();
                    onButtonClick();
                }
            }
            else if (selectedValue == "Convert All Rows to Numeric") {
                await convertAllRows_ToNumeric();
                onButtonClick();
            }
            else if (selectedValue == "Convert Columns to Numeric Values") {
                if (checkedItemsOfTable.length <= 0) {
                    toastMessage('error', 'Please select columns for performing method!');
                }
                else {
                    await convertSelectedColumns_ToNumeric();
                    onButtonClick();
                }
            }
            // toastMessage('info', 'You selected yes!');
        }
        handleCloseDialog();
    };

    const handleNoDialog = () => {
        if (alertDialogType == "Pre-processing") {
            toastMessage('warning', 'No changes made!');
        }
        else if (alertDialogType == "Delete Dataframe") {
            toastMessage('warning', 'No changes made!');
        }
        handleCloseDialog();
    };

    const onProcessBtnClicked: any = () => {
        if (!selectedValue) {
            toastMessage('error', 'Please select a pre-processing method first!');
        }
        else {
            setAlertMessageContent("Are you sure you want to " + selectedValue + "?");
            handleClickOpenDialog('Pre-processing');
        }
        // if (checkedItemsOfTable.length <= 0)
        //     setAlertMessageContent("Are you sure you want to perform the following operations:" + selectedOptionsForProcessing + "?");
        // else
        //     setAlertMessageContent("Are you sure you want to perform the following operations: '" + selectedOptionsForProcessing + "' on the following columns '" + checkedItemsOfTable + "'");
    };


    return (
        <div>
            <AlertModal open={openDialog} message={alertMessageContent} handleClose={handleCloseDialog} handleYes={handleYesDialog} handleNo={handleNoDialog} />
            <List component="nav">
                {optionsForProcessColumns.map(item => (
                    <ListItemWithSubOptions
                        key={item.id}
                        item={item}
                        handleClick={handleClickProcessSelectedColumns}
                        openItems={openItems}
                        selectedValue={selectedValue}
                    />
                ))}
            </List>
            <div style={{ position: 'sticky', bottom: '0', display: 'relative', backgroundColor: 'white' }}>
                <div className='col-12 p-2 text-center'>
                    <div className='p-1' style={{ fontSize: '10px', cursor: 'pointer', color: 'white', backgroundColor: 'grey', borderRadius: '5px' }} onClick={() => {
                        onProcessBtnClicked()
                    }}>Current selected Method: {selectedValue}. <br />Click here to proceed</div>
                </div>
            </div>

            <Dialog open={openAttributesDialog} onClose={handleCloseAttributesDialog} fullWidth>
                <DialogTitle>Fill NULL with Attributes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {checkedItemsOfTable.map((item: any, index: any) => (
                            <RadioGroup
                                name={`radio_${index}`}
                                value={radioStates[item] || ''}
                                onChange={(e) => handleRadioChange(item, e.target.value)}
                            >
                                {uniqueLoading == true ? (<div></div>) : (
                                    <div className='row mt-4'>
                                        <div className='col-md-12 mb-1'>{item}</div>
                                        <div className='col-md-6'>
                                            <FormControlLabel value="existing" control={<Radio />} label={
                                                <React.Fragment>
                                                    {uniqueValueList[item] ? (
                                                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}
                                                            disabled={!radioStates[item] || radioStates[item] == 'custom'}
                                                        >
                                                            <InputLabel id="demo-simple-select-standard-label" className='w-100'>Existing Value</InputLabel>
                                                            <Select
                                                                // value={age}
                                                                // onChange={handleChange}
                                                                label="Select Value"
                                                                onChange={(event) => handleSelectChangeForUnique(event, item)}
                                                            >
                                                                <MenuItem value="">
                                                                    <em>None</em>
                                                                </MenuItem>
                                                                {/* {uniqueValueList.item} */}
                                                                {uniqueValueList[item].map((itemInside: any) => (
                                                                    <MenuItem value={itemInside} key={itemInside}>{itemInside}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                    }
                                                </React.Fragment>
                                            } />

                                        </div>
                                        <div className='col-md-6'>
                                            <FormControlLabel value="custom" control={<Radio />} label={
                                                <React.Fragment>
                                                    <TextField label="Manually enter Value" variant="outlined" disabled={!radioStates[item] || radioStates[item] == 'existing'}
                                                        onChange={(event) => handleCustomInputChange(event, item)}
                                                        value={customValuesNullList[item] || ''}
                                                    />
                                                </React.Fragment>
                                            } />
                                        </div>
                                    </div>
                                )}
                            </RadioGroup>
                        ))}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAttributesDialog}>Cancel</Button>
                    <Button onClick={handleConfirmAttributeDialog} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* selectedValue: {selectedValue}</div> */}
        </div>
    );
};

export default ListDropDown;