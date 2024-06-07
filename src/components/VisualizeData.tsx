import React, { useEffect, useState, useRef } from 'react'
import Paper from '@mui/material/Paper';
import '../assets/css/styles.css'
import { ToastContainer, toast } from 'react-toastify';
import SavedProgressTop from './SavedProgressTop';
import video from '../assets/images/Untitled design (27).gif'
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from '@mui/material';
import { barChartFromDataframe, barchartPlot, baseURLTEST, boxPlotGraphPlot, corelationMatrixPlot, getColumnOrderForTable, plotCustomScatterPlot, plotDataframeDescPlot, plotStatsSummary, scatterPlotEachColumn } from '../AllAssets';
import { AxiosResponse } from 'axios';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ImageZoom from 'react-medium-image-zoom';
import Zoom from 'react-medium-image-zoom'

const VisualizeData = () => {

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

    useEffect(() => {
        // Function to run once when component mounts
        getColumnsFrom_Table();
    }, []);

    const [options, setOptions] = useState<any[]>([]);

    const [textFieldValues, setTextFieldValues] = useState<{ [key: string]: any }>(
        {
            'X Label': 'X Label',
            'Y Label': 'Y Label',
            'Title': 'Title',
            'X Ticks Rotation': 45,
            'Figure Width': 10,
            'Figure Height': 6,
            "Method": 'pearson',
            "C Map": "coolwarm",
            "Annotations": true,
            "Bar Width": 0.35,
            "Error Bars": true,
            "X Column": options[0],
            "Y Column": options[1],
            "Hue Column": options[2],
            "Target Column": options[1]
        }
    );
    const [inputList, setInputList] = useState<any>([]);

    const handleTextFieldChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(textFieldValues);
        setTextFieldValues({ ...textFieldValues, [key]: event.target.value });
    };

    const [selectedValue, setSelectedValue] = useState<string>('');

    const [graphValues, setGraphValues] = useState<any>({});

    const [chartList, setChartList] = useState<any[]>([
        "Box Plot",
        "Plot Co-relation Matrix",
        "Plot Dataframe description",
        "Plot Stats Summary",
        "Custom Scatter Plot",
        "Scatter Plot Each Column",
        "Bar Chart From Dataframe",
        "Bar Chart"
    ]
    );

    // Function to handle selection change
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const selectedOption = event.target.value;
        setSelectedValue(selectedOption);
    };


    const onMenuItemClicked = (itemSelected: any) => {
        // setChartList(chartList.filter(item => item !== itemSelected));
        let temptextFieldValues = {
            'X Label': 'X Label',
            'Y Label': 'Y Label',
            'Title': 'Title',
            'X Ticks Rotation': 45,
            'Figure Width': 10,
            'Figure Height': 6,
            "Method": 'pearson',
            "C Map": "coolwarm",
            "Annotations": true,
            "Bar Width": 0.35,
            "Error Bars": true,
            "X Column": options[0],
            "Y Column": options[1],
            "Hue Column": options[2],
            "Target Column": options[1]
        };
        setTextFieldValues(temptextFieldValues);
        if (itemSelected == "Bar Chart From Dataframe") {
            setInputList(["X Column", "Y Column", "X Label", "Y Label", "Title"]);
            onPlotBtnClicked(itemSelected);
        }
        else if (itemSelected == "Bar Chart") {
            setInputList(["Categories", "Values", "X Label", "Y Label", "Title"]);
            onPlotBtnClicked(itemSelected);
        }
        else if (itemSelected == "Box Plot") {
            setInputList(["X Label", "Y Label", "X Ticks Rotation", "Figure Width", "Figure Height"]);
            onPlotBtnClicked(itemSelected);
        }
        else if (itemSelected == "Plot Co-relation Matrix") {
            setInputList(["Method", "Annotations", "C Map", "Figure Width", "Figure Height"]);
            onPlotBtnClicked(itemSelected);
        }
        else if (itemSelected == "Plot Dataframe description") {
            setInputList(["Bar Width", "Figure Width", "Figure Height", "Error Bars"]);
            onPlotBtnClicked(itemSelected);
        }
        else if (itemSelected == "Plot Stats Summary") {
            setInputList([]);
            onPlotBtnClicked(itemSelected);
        }
        else if (itemSelected == "Custom Scatter Plot") {
            setInputList(["X Column", "Y Column", "X Label", "Y Label", "Hue Column", "Title"]);
            onPlotBtnClicked(itemSelected);
        }
        else if (itemSelected == "Scatter Plot Each Column") {
            setInputList(["Target Column", "Hue Column", "Hue Order"]);
            onPlotBtnClicked(itemSelected);
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

    const convertStrtoInt = (numVal: any) => {
        const value = parseFloat(numVal);
        if (!isNaN(value)) {
            return value;
        } else {
            return numVal;
        }
    }

    const convertStrtoBool = (conv_val: any): boolean => {
        if (typeof conv_val === 'string') {
            return conv_val.toLowerCase() === 'true';
        }
        // Handle other cases here, if necessary
        return Boolean(conv_val);
    };

    const setValuesToGraph = (graphType: any, formDataSent: any) => {
        let tempGraphValues = graphValues;
        tempGraphValues[graphType] = {
            'LabelsValues': formDataSent
        };
        setGraphValues(tempGraphValues);
        console.log(tempGraphValues);
    }

    const changeImageLoadingStatusGraph = (graphType: any, imageLoadingStatus: any) => {
        setGraphValues((prevGraphValues: any) => ({
            ...prevGraphValues,
            [graphType]: {
                ...prevGraphValues[graphType],
                imageLoadingStatus: imageLoadingStatus
            }
        }));
    };

    const setImageToGraphValues = (graphType: any, imageData: any) => {
        setGraphValues((prevGraphValues: any) => ({
            ...prevGraphValues,
            [graphType]: {
                ...prevGraphValues[graphType],
                imageData: imageData,
                imageLoadingStatus: 'success'
            }
        }));
    };

    const getImage = async (graphType: any, response: any) => {
        try {
            changeImageLoadingStatusGraph(graphType, 'loading');
            // const base64Data = btoa(
            //     new Uint8Array(response.data).reduce(
            //         (data, byte) => data + String.fromCharCode(byte),
            //         ''
            //     )
            // );
            const imageUrl = `data:${response.headers['content-type']};base64,${response.data['data']['image']}`;
            setImageToGraphValues(graphType, imageUrl);
        } catch (error: any) {
            changeImageLoadingStatusGraph(graphType, 'error');
            toastMessage('error', 'Error fetching image!');
        }
        // }
    }

    const onPlotBtnClicked = async (graphType: any) => {
        getColumnsFrom_Table();
        if (graphType == "Bar Chart From Dataframe") {
            let formDataSent: any = {
                "x_columns": [textFieldValues["X Column"]],
                "y_columns": [textFieldValues["Y Column"]],
                "title": textFieldValues["Title"],
                "xlabel": textFieldValues["X Label"],
                "ylabel": textFieldValues["Y Label"]
            }
            setValuesToGraph(graphType, formDataSent);
            try {
                changeImageLoadingStatusGraph(graphType, 'loading');
                console.log(formDataSent);
                const response = await barChartFromDataframe(formDataSent);
                console.log("response", response);
                getImage(graphType, response);
            } catch (error: any) {
                changeImageLoadingStatusGraph(graphType, 'error');
                toastMessage('error', 'Error plotting!');
            }
        }
        else if (graphType == "Bar Chart") {
            let formDataSent: any = {
                "categories": [
                    textFieldValues["Categories"]
                ],
                "values": [
                    textFieldValues["Values"]
                ],
                "title": textFieldValues["Title"],
                "xlabel": textFieldValues["X Label"],
                "ylabel": textFieldValues["Y Label"]
            }
            setValuesToGraph(graphType, formDataSent);
            try {
                changeImageLoadingStatusGraph(graphType, 'loading');
                console.log(formDataSent);
                const response = await barchartPlot(formDataSent);
                getImage(graphType, response);
            } catch (error: any) {
                toastMessage('error', 'Error plotting!');
                changeImageLoadingStatusGraph(graphType, 'error');
            }
        }
        else if (graphType == "Box Plot") {
            let formDataSent: any = {
                "userId": convertStrtoInt(localStorage.getItem("userID")),
                "x_label": textFieldValues["X Label"],
                "y_label": textFieldValues["Y Label"],
                "xticks_rotation": convertStrtoInt(textFieldValues["X Ticks Rotation"]),
                "figsize": {
                    "width": convertStrtoInt(textFieldValues["Figure Width"]),
                    "height": convertStrtoInt(textFieldValues["Figure Height"])
                }
            }
            setValuesToGraph(graphType, formDataSent);
            try {
                changeImageLoadingStatusGraph(graphType, 'loading');
                console.log(formDataSent);
                const response = await boxPlotGraphPlot(formDataSent);
                console.log(response);
                getImage(graphType, response);
                // const baseURLTESTres = await baseURLTEST();
                // console.log("baseURLTESTres", baseURLTESTres);
                // const imageUrl = `data:${response.headers['content-type']};base64,${baseURLTESTres.data.data.image}`;
            } catch (error: any) {
                changeImageLoadingStatusGraph(graphType, 'error');
                toastMessage('error', 'Error plotting!');
            }
        }
        else if (graphType == "Plot Co-relation Matrix") {
            let formDataSent: any = {
                "method": textFieldValues['Method'],
                "annot": convertStrtoBool(textFieldValues['Annotations']),
                "cmap": textFieldValues['C Map'],
                "figsize": {
                    "width": convertStrtoInt(textFieldValues["Figure Width"]),
                    "height": convertStrtoInt(textFieldValues["Figure Height"])
                }
            }
            setValuesToGraph(graphType, formDataSent);
            try {
                changeImageLoadingStatusGraph(graphType, 'loading');
                console.log(formDataSent);
                const response = await corelationMatrixPlot(formDataSent);
                getImage(graphType, response);
            } catch (error: any) {
                changeImageLoadingStatusGraph(graphType, 'error');
                toastMessage('error', 'Error plotting!');
            }
        }
        else if (graphType == "Plot Dataframe description") {
            let formDataSent: any = {
                "figsize": {
                    "width": convertStrtoInt(textFieldValues["Figure Width"]),
                    "height": convertStrtoInt(textFieldValues["Figure Height"])
                },
                "bar_width": convertStrtoInt(textFieldValues["Bar Width"]),
                "error_bars": convertStrtoBool(textFieldValues['Error Bars'])
            }
            setValuesToGraph(graphType, formDataSent);
            try {
                changeImageLoadingStatusGraph(graphType, 'loading');
                console.log(formDataSent);
                const response = await plotDataframeDescPlot(formDataSent);
                getImage(graphType, response);
            } catch (error: any) {
                changeImageLoadingStatusGraph(graphType, 'error');
                toastMessage('error', 'Error plotting!');
            }
        }
        else if (graphType == "Plot Stats Summary") {
            setValuesToGraph(graphType, {});
            try {
                changeImageLoadingStatusGraph(graphType, 'loading');
                const response = await plotStatsSummary();
                getImage(graphType, response);
            } catch (error: any) {
                changeImageLoadingStatusGraph(graphType, 'error');
                toastMessage('error', 'Error plotting!');
            }
        }
        else if (graphType == "Custom Scatter Plot") {
            let formDataSent: any = {
                "x_col": textFieldValues["X Column"],
                "y_col": textFieldValues["Y Column"],
                "hue_col": textFieldValues["Hue Column"],
                "xlabel": textFieldValues["X Label"],
                "ylabel": textFieldValues["Y Label"],
                "title": textFieldValues["Title"],
            }
            setValuesToGraph(graphType, formDataSent);
            try {
                console.log(formDataSent);
                changeImageLoadingStatusGraph(graphType, 'loading');
                const response = await plotCustomScatterPlot(formDataSent);
                getImage(graphType, response);
            } catch (error: any) {
                changeImageLoadingStatusGraph(graphType, 'error');
                toastMessage('error', 'Error plotting!');
            }
        }
        else if (graphType == "Scatter Plot Each Column") {
            let formDataSent: any = {
                "target_column": textFieldValues["Target Column"],
                "hue_column": textFieldValues["Hue Column"],
                "hue_order": [
                    textFieldValues["Hue Order"]
                ]
            }
            setValuesToGraph(graphType, formDataSent);
            try {
                changeImageLoadingStatusGraph(graphType, 'loading');
                console.log(formDataSent);
                const response = await scatterPlotEachColumn(formDataSent);
                getImage(graphType, response);
            } catch (error: any) {
                changeImageLoadingStatusGraph(graphType, 'error');
                toastMessage('error', 'Error plotting!');
            }
        }
    }

    const getColumnsFrom_Table = async () => {
        try {
            const columnOrderResponse = await getColumnOrderForTable();
            if (responseChecker(columnOrderResponse)) {
                setOptions(Object.values(JSON.parse(columnOrderResponse.data.data)).sort((a: any, b: any) => parseInt(a) - parseInt(b)));
            }
        } catch (error: any) {
            toastMessage('error', 'Error fetching column order!');
            console.error(error);
        }
    }

    const mapOptions = (options: string[]): any[] => {
        return options.map(option => ({ label: option, enteredValue: option }));
    };

    const handleAutocompleteLabelChange = (inputItem: string) => (event: React.ChangeEvent<{}>, newValue: any) => {
        if (newValue !== null && newValue['enteredValue'] !== null) {
            setTextFieldValues({ ...textFieldValues, [inputItem]: newValue['enteredValue'] });
        }
        else {
            setTextFieldValues({ ...textFieldValues, [inputItem]: '' });
        }
    };

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState<any>({});

    // Function to open the dialog
    const openDialog = (chartTypeRec: any, imageDataRec: any) => {
        console.log("Rec", chartTypeRec);
        console.log("Rec", imageDataRec);
        let dialogDataTemp = {
            'chartType': chartTypeRec,
            'imageData': imageDataRec
        };
        setDialogData(dialogDataTemp);
        setDialogOpen(true);
    };

    // Function to close the dialog
    const closeDialog = () => {
        setDialogOpen(false);
    };

    return (
        <div>
            <SavedProgressTop />
            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle>{dialogData['chartType']}</DialogTitle>
                <DialogContent>
                    {/* <ImageZoom
                        image={{
                            src: dialogData.imageData,
                            alt: 'Image',
                            className: 'your-image-class',
                            style: { width: '100%' } // Adjust as needed
                        }}
                        zoomImage={{
                            src: dialogData.imageData,
                            alt: 'Zoomed Image'
                        }}
                    /> */}
                    {/* <Zoom>
                        <picture> */}
                    <img src={dialogData['imageData']} />
                    {/* </picture>
                    </Zoom> */}
                    {/* <Paper>
                    </Paper> */}
                </DialogContent>
                <DialogActions style={{ justifyContent: 'flex-end' }}>
                    <Button onClick={closeDialog}>OK</Button>
                </DialogActions>
            </Dialog>
            <div className='p-2 ps-4 pe-4 col-12'>
                <div className='col-12'>
                    <Select
                        value={selectedValue}
                        onChange={handleSelectChange}
                        className='w-100'
                    >
                        {chartList.map((item, index) => (
                            <MenuItem onClick={() => { onMenuItemClicked(item) }} key={index} value={item}>{item}</MenuItem>
                        ))}

                    </Select>
                </div>


                <div className='row col-12'>
                    {inputList.map((inputItem: any, index: any) => (
                        <div className='col-md-2 mt-3'>
                            {inputItem === 'X Column' || inputItem === 'Y Column' || inputItem === 'Hue Column' || inputItem === 'Target Column' ? ( // Conditional rendering
                                <Autocomplete
                                    className='w-100'
                                    disablePortal
                                    id="combo-box-demo"
                                    options={mapOptions(options)}
                                    sx={{ width: 300 }}
                                    value={textFieldValues[inputItem] || null}
                                    onChange={handleAutocompleteLabelChange(inputItem)}
                                    renderInput={(params) => <TextField {...params} label={inputItem} />}
                                />
                            ) :
                                <span>
                                    {inputItem === 'Annotations' || inputItem === 'Error Bars' ? ( // Conditional rendering
                                        <Autocomplete
                                            className='w-100'
                                            disablePortal
                                            id="combo-box-demo"
                                            options={[{ label: 'true', enteredValue: 'true' }, { label: 'false', enteredValue: 'false' }]}
                                            // options={mapOptions(options)}
                                            sx={{ width: 300 }}
                                            value={textFieldValues[inputItem] || null}
                                            onChange={handleAutocompleteLabelChange(inputItem)}
                                            renderInput={(params) => <TextField {...params} label={inputItem} />}
                                        />
                                    ) :
                                        <span>
                                            {inputItem === 'Method' ? ( // Conditional rendering
                                                <Autocomplete
                                                    className='w-100'
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    options={[{ label: 'pearson', enteredValue: 'pearson' }, { label: 'kendall', enteredValue: 'kendall' }, { label: 'spearman', enteredValue: 'spearman' }]}
                                                    // options={mapOptions(options)}
                                                    sx={{ width: 300 }}
                                                    value={textFieldValues[inputItem] || null}
                                                    onChange={handleAutocompleteLabelChange(inputItem)}
                                                    renderInput={(params) => <TextField {...params} label={inputItem} />}
                                                />
                                            ) :
                                                <TextField
                                                    required
                                                    key={index}
                                                    label={inputItem}
                                                    value={textFieldValues[inputItem] || ''}
                                                    onChange={handleTextFieldChange(inputItem)}
                                                    className='w-100'
                                                />}
                                        </span>
                                    }
                                </span>
                            }
                        </div>
                    ))}
                    <div className='row mt-3'>
                        <div className='col-md-4'></div>
                        <div className='col-md-4 text-center'>
                            <button className='btn w-100 text-white' style={{ backgroundColor: '#0c6fa1' }} onClick={() => {
                                onPlotBtnClicked(selectedValue)
                            }}>Plot</button>
                        </div>
                        <div className='col-md-4'></div>
                    </div>
                </div>
                <div className='row'>
                    {Object.keys(graphValues)
                        .reverse() // Reverse the array
                        .map((chartType) => (
                            <div key={chartType} className='col-md-6 mt-3'>
                                <div style={{ border: '1px solid #0c6fa139', borderRadius: '5px' }} className='p-2'>
                                    <div className='text-center' style={{ fontStyle: 'italic' }}>
                                        {/* <Tooltip title='Download' placement='top'> */}
                                        <u>{chartType}</u>
                                        {/* </Tooltip> */}
                                    </div>
                                    <div className='row'>
                                        {Object.entries(graphValues[chartType].LabelsValues).map(([key, value]) => (
                                            <div className='col-md-6' key={key}>
                                                <strong>{key}:</strong> {JSON.stringify(value)}
                                            </div>
                                        ))}

                                        {graphValues[chartType]['imageData'] && (
                                            <div>
                                                <img style={{ cursor: 'zoom-in' }} onClick={() => { openDialog(chartType, graphValues[chartType]['imageData']) }} src={graphValues[chartType]['imageData']} />
                                            </div>
                                        )}

                                        {graphValues[chartType]['imageLoadingStatus'] === 'error' && (
                                            <div className='mt-2' style={{ color: '#AF4839', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <b><ErrorOutlineIcon />&nbsp;Error Plotting Graph</b>
                                            </div>
                                        )}

                                        {graphValues[chartType]['imageLoadingStatus'] === 'loading' && (
                                            <div className='text-center'>
                                                <CircularProgress style={{
                                                    width: '3em',
                                                    height: '3em',
                                                }} />
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                </div>
            </div>

        </div >
    )
}

export default VisualizeData
