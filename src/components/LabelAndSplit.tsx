import React, { useEffect, useState } from 'react';
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slider } from '@mui/material';
import Input from '@mui/material/Input';
import { ToastContainer, toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Stepper, Step, StepLabel, StepIcon } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import { AxiosResponse } from 'axios';
import { getColumnOrderForTable, getDataTypesForTable } from '../AllAssets';


interface LabelAndSplitProps {
    open: boolean;
    message: string;
    handleClose: () => void;
    handleYes: (labelColumn: any, secondValue: any) => void;
    handleNo: () => void;
}

const LabelAndSplit: React.FC<LabelAndSplitProps> = ({ open, message, handleClose, handleYes, handleNo }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState<Array<boolean>>([false, false, false]);


    const [firstValue, setFirstValue] = useState<any>(80);
    const [secondValue, setSecondValue] = useState<any>(20);

    const handleChangeFirstValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setFirstValue(newValue);

        // Calculate the value for the second input field
        const parsedValue = parseFloat(newValue);
        if (!isNaN(parsedValue)) {
            const newValueForSecondField = (100 - parsedValue).toFixed(2);
            setSecondValue(newValueForSecondField);
        }
    };

    const handleChangeSecondValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setSecondValue(newValue);

        // Calculate the value for the first input field
        const parsedValue = parseFloat(newValue);
        if (!isNaN(parsedValue)) {
            const newValueForFirstField = (100 - parsedValue).toFixed(2);
            setFirstValue(newValueForFirstField);
        }
    };

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleNext = () => {
        if (activeStep == 0) {

        }
        const newActiveStep = activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        const newActiveStep = activeStep - 1;
        setActiveStep(newActiveStep);
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted([false, false, false]);
    };

    const isStepComplete = (step: number) => {
        return completed[step];
    };
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        const newSliderValue = Array.isArray(newValue) ? newValue[0] : newValue;
        setFirstValue(newSliderValue.toLocaleString());
        setSecondValue((100 - newSliderValue).toLocaleString());
    };
    const formatValueLabel = (val: number) => (
        // <div>{val !== 0 ? (<div className='text-center'><p style={{ fontSize: '0.8em' }}>Your train data is here:<br />{val}</p></div>) : (<div></div>)}</div>
        <div className='text-center'><p style={{ fontSize: '0.8em' }}>Your train data is here:<br />{val}%</p></div>
    );

    // const [columnsForTable, setColumnsForTable] = useState<any[]>([]);
    const [columnTypes, setColumnTypes] = useState<any[]>([]);
    const [options, setOptions] = useState<any[]>([]);

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
        // setColumnDataLoading(true);
        getColumnTypes();
    }, []);

    const getColumnTypes = async () => {
        try {
            const dataTypeResponse = await getDataTypesForTable(localStorage.getItem("userID"), localStorage.getItem("fileName"));
            // if (responseChecker(dataTypeResponse, false)) {
            setColumnTypes(JSON.parse(dataTypeResponse.data));
            setOptions(Object.entries(JSON.parse(dataTypeResponse.data)).map(([label, columnType]) => ({ label, columnType })));
        } catch (error: any) {
            toastMessage('error', error);
            console.error(error);
        }
    }

    // const responseChecker = (response: AxiosResponse<any, any>) => {
    //     if (response.status == 400) {
    //         toastMessage('error', 'Invalid Request!');
    //         return false;
    //     }
    //     else if (response.status == 500) {
    //         toastMessage('error', "Server Issue");
    //         return false;
    //     }
    //     else if (response.status == 200 || response.status == 201) {
    //         if (response.data['status'] == "success") {
    //             return true;
    //         }
    //         else if (response.data['status'] == "failure") {
    //             toastMessage('error', response.data['message']);
    //             return false;
    //         }
    //     }
    // }

    interface OptionType {
        label: string;
        columnType: string;
    }

    const [selectedLabelColumn, setSelectedLabelColumn] = useState<OptionType | null>(null);

    const handleAutocompleteLabelChange = (event: React.ChangeEvent<{}>, value: any) => {
        setSelectedLabelColumn(value);
        console.log("value", value);
    };

    const onTrainModelBtnClicked = (labelColumn: any) => {
        console.log("labelColumn", labelColumn);
        if (labelColumn != "") {
            handleYes(labelColumn, secondValue);
            changeCurrProgressState(false);
        }
    }

    const changeCurrProgressState = (trainedModel: any) => {
        let tempCurrProgress: any = localStorage.getItem('currentProgress');
        if (tempCurrProgress) {
            if (tempCurrProgress == 'Not Performed pre-processing' || tempCurrProgress == 'Performed pre-processing') {
                localStorage.setItem('currentProgress', 'Model Train Details Entered');
            }
        }
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Test and train details for : {message}
                <Button onClick={handleNo} style={{ position: 'absolute', right: 10, top: 10 }}>
                    <CloseIcon />
                </Button>
            </DialogTitle>
            <DialogContent style={{ height: '90vh' }}>
                <DialogContentText>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {['Label Selection', 'Set Data Split'].map((label, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: { optional?: React.ReactNode } = {};
                            if (isStepComplete(index)) {
                                stepProps.completed = true;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps} StepIconComponent={StepIcon}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === 2 ? (
                        <div>
                            <p className='mt-3 mb-3 p-3'>
                                Are you sure you want to proceed with the following? <br /> <br />
                                Label: {selectedLabelColumn?.label} <br />
                                Train Data Percentage: {firstValue} <br />
                                Validate Data Percentage: {secondValue} <br />
                            </p>
                            <Button disabled={!selectedLabelColumn} className='p-3 train-model-btn-dialog' onClick={() => { onTrainModelBtnClicked(selectedLabelColumn) }} color="primary">
                                <ModelTrainingIcon /> &nbsp;Proceed to train the model
                            </Button>
                            <div className='mt-3'>
                                {selectedLabelColumn ? (<div></div>) : (<div>
                                    <Alert severity="error">Kindly select a valid label column at the first step!</Alert>
                                </div>)}
                                {firstValue < 50 ? (<Alert severity="warning">Kindly note that the train data share is very low!</Alert>) : (<div></div>)}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {activeStep === 0 ? (<div>
                                <div className='mt-5'>
                                    <div>Please select your label column from below</div>
                                    <Autocomplete className='w-100 mt-4'
                                        disablePortal
                                        id="combo-box-demo"
                                        options={options}
                                        sx={{ width: 300 }}
                                        value={selectedLabelColumn}
                                        onChange={handleAutocompleteLabelChange}
                                        getOptionLabel={(option) => `${option.label} (${option.columnType})`}
                                        // renderOption={(props, option) => renderOption(option)}
                                        renderInput={(params) => <TextField {...params} label="Label column" />}
                                    />
                                    <div className='mt-5'>{selectedLabelColumn ? (<Alert severity="info">Selected label column: {selectedLabelColumn.label}</Alert>) : (<div>
                                        <Alert severity="warning">Kindly select a valid label column from above dropdown</Alert>
                                    </div>)}</div>
                                </div>
                            </div>) : (<div>
                                {activeStep === 1 ? (<div>
                                    <div>
                                        <div className='row mt-5 mb-4'>
                                            <div className='col-12 mt-1 mb-4 text-center'>Please enter your train and validate data split percentage here</div>
                                            <div className='col-md-6'>
                                                <TextField
                                                    className='w-100'
                                                    label="Train Data Percentage"
                                                    type="number"
                                                    value={firstValue}
                                                    onChange={handleChangeFirstValue}
                                                    InputProps={{
                                                        endAdornment: <span>%</span>,
                                                    }}
                                                    inputProps={{ max: 100 }}
                                                />
                                            </div>
                                            <div className='col-md-6'>
                                                <TextField
                                                    className='w-100'
                                                    label="Validate Data Percentage"
                                                    type="number"
                                                    value={secondValue}
                                                    onChange={handleChangeSecondValue}
                                                    InputProps={{
                                                        endAdornment: <span>%</span>,
                                                    }}
                                                    inputProps={{ max: 100 }}
                                                />
                                            </div>
                                        </div>
                                        <div className='ps-4 pe-4'>
                                            <Slider className='mt-5'
                                                value={firstValue}
                                                onChange={handleSliderChange}
                                                aria-labelledby="discrete-slider"
                                                step={1}
                                                marks
                                                min={0}
                                                max={100}
                                                valueLabelDisplay="on"
                                                valueLabelFormat={formatValueLabel}
                                            />
                                            <div>{firstValue < 50 ? (<Alert severity="warning">Kindly note that the train data share is very low!</Alert>) : (<div></div>)}</div>
                                            <div>{firstValue > 100 || secondValue > 100 ? (<Alert severity="error">Kindly note that the value should be lesser than or equal to 100!</Alert>) : (<div></div>)}</div>
                                        </div>
                                    </div>
                                </div>) : (<div></div>)}

                            </div>)}
                        </div>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div>{activeStep !== 2 ? (
                    <div><Button disabled={activeStep === 0} onClick={handleBack} color="primary">
                        Back
                    </Button>
                        <Button onClick={handleNext} color="primary">
                            Next
                        </Button>
                    </div>) : (<div>
                        <Button onClick={handleBack} color="primary">
                            Back
                        </Button>
                        <Button onClick={handleReset} color="primary">
                            Reset
                        </Button>
                    </div>)}</div>
            </DialogActions>
        </Dialog>
    );
};

export default LabelAndSplit;