import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import GrainIcon from '@mui/icons-material/Grain';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { Alert, Checkbox, Input, TextField, Tooltip } from '@mui/material';
import Divider from '@mui/material/Divider';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { API_ENDPOINTS, historyTracker, httpValue, portNo } from '../AllAssets';
import axios, { AxiosResponse } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const History = () => {

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
        toastMessage('error', "Message from server: " + response.data['message']);
        return false;
      }
    }
  }

  const onChangeStatus = (value: any, status: any, message: any) => {
    let runStatusTemp = runStatus;
    runStatusTemp[value['id']] = status;
    setRunStatus(runStatusTemp);
    console.log("runStatus", runStatus);

    let statusMessageTemp = statusMessage;
    statusMessageTemp[value['id']] = message;
    setStatusMessage(statusMessageTemp);

    setChecked(prevChecked => prevChecked.filter(item => item.id !== value.id));
    setSelectAll(false);
  }

  const responseCheckerForHistory = (response: AxiosResponse<any, any>, value: any) => {
    console.log("response", response);
    if (response.status == 400) {
      let message = 'Invalid Request!';
      toastMessage('error', message);
      onChangeStatus(value, 'error', message);
      return false;
    }
    else if (response.status == 500) {
      let message = "Server Issue";
      toastMessage('error', message);
      onChangeStatus(value, 'error', message);
      return false;
    }
    else if (response.status == 200 || response.status == 201) {
      if (response.data['status'] == "success") {
        return true;
      }
      else if (response.data['status'] == "failure") {
        let message = 'Failed! Initital Request: ' + value['desc'] + '!' + " Message from server: " + response.data['message'];
        toastMessage('error', message);
        onChangeStatus(value, 'error', message);
        return false;
      }
    }
  }

  useEffect(() => {
    // Function to run once when component mounts
    getHistoryList();
  }, []);

  const getHistoryList = async () => {
    try {
      const response = await historyTracker();
      if (responseChecker(response)) {
        const responseData = response.data.data;
        console.log("Responsedata", responseData);
        setTempData(responseData);
      }
      else {
        toastMessage('error', "Error fetching history!");
      }

    } catch (error: any) {
      toastMessage('error', "Error fetching history!");
      console.error(error);
    }
  };

  const [value, setValue] = React.useState('1');



  const [tempData, setTempData] = useState([]);

  const [selectAll, setSelectAll] = useState<boolean>(false);

  // const [checked, setChecked] = useState<{ [key: number]: boolean }>({});

  const [runStatus, setRunStatus] = useState<{ [key: number]: string }>({
    // 1: 'success',
    // 2: 'error'
  });

  const [statusMessage, setStatusMessage] = useState<{ [key: number]: string }>({
    // 1: 'success',
    // 2: 'error'
  });

  const [checked, setChecked] = React.useState<any[]>([]);

  const handleSelectAllChange = () => {
    setSelectAll(prevSelectAll => !prevSelectAll);
    const newCheckedState: any[] = [];
    if (!selectAll) {
      newCheckedState.push(...tempData);
    }
    setChecked(newCheckedState);
  };

  const handleCheckboxChange = (operation: any) => {
    const isChecked = checked.some(item => item.id === operation.id);
    setChecked(prevChecked => {
      if (isChecked) {
        return prevChecked.filter(item => item.id !== operation.id);
      } else {
        return [...prevChecked, operation];
      }
    });
    setSelectAll(false);
  };

  const handleParamChange = (operationId: number, paramIndex: number, value: string) => {
    // Create a copy of the tempData array
    const updatedTempData = [...tempData];
    // Find the operation object in the array
    const operationToUpdate: any = updatedTempData.find((operation: any) => operation.id === operationId);
    if (operationToUpdate) {
      // Update the parameter value
      operationToUpdate.params[paramIndex].defaultValue = value;
      // Update the state with the modified tempData
      setTempData(updatedTempData);
      console.log("updatedTempData", updatedTempData);
    }
  };

  const getStatusClassName = (operation: any) => {
    if (runStatus[operation['id']] == 'success') {
      return 'history-tab-success';
    } else if (runStatus[operation['id']] == 'error') {
      return 'history-tab-error';
    } else if (checked[operation['id']]) {
      return 'history-tab-selected';
    }
    else {
      return 'history-tab-not-selected';
    }
  };

  const deleteReq = async (value: any) => {
    let paramsList = value['params'];
    console.log("paramsList", paramsList);
    let params: any = {
    }
    for (let i = 0; i < paramsList.length; i++) {
      if (paramsList[i]['in'] == "query") {
        let name = paramsList[i]["name"];
        params[name] = paramsList[i]["defaultValue"];
      }
    }
    try {
      return await axios.delete(httpValue + API_ENDPOINTS + portNo + value['endpoint'], {
        params: params
      });
    } catch (error) {
      throw new Error('Failed! Initial Request: ' + value['desc'] + '!');
    }
    // }

  }

  const postReq = async (value: any) => {
    let paramsList = value['params'];
    console.log("paramsList", paramsList);
    let queryParams: any = {
    };
    for (let i = 0; i < paramsList.length; i++) {
      if (paramsList[i]['in'] == "query") {
        let name = paramsList[i]["name"];
        queryParams[name] = paramsList[i]["defaultValue"];
      }
    }
    try {
      return await axios.post(httpValue + API_ENDPOINTS + portNo + value['endpoint'], {}, {
        params: queryParams, // Include query parameters here
      });
    } catch (error) {
      throw new Error('Failed! Initial Request: ' + value['desc'] + '!');
    }
    // }

  }

  const requestType = async (value: any) => {
    try {

      if (value['method'] == "DELETE") {
        const response = await deleteReq(value);
        if (responseCheckerForHistory(response, value)) {
          let message = 'Initial Request: ' + value['desc'] + ". Message from server: " + response.data['message'];
          toastMessage('info', message);
          onChangeStatus(value, 'success', message);
        }
      }

      if (value['method'] == "POST") {
        const response = await postReq(value);
        if (responseCheckerForHistory(response, value)) {
          let message = "Initial Request: " + value['desc'] + ". Message from server: " + response.data['message'];
          toastMessage('info', message);
          onChangeStatus(value, 'success', message);
        }
      }

    } catch (error: any) {
      let message = 'Failed! Initital Request: ' + value['desc'] + '!';
      toastMessage('error', message);
      onChangeStatus(value, 'error', message);
    }
  }

  const onExecuteSelectedOperations = () => {
    if (checked.length <= 0) {
      toastMessage('error', 'Please select atleast one operation!');
    }
    else {
      console.log(checked);
      for (let i = 0; i < checked.length; i++) {
        requestType(checked[i]);
      }
      getHistoryList();
    }
  }


  return (
    <div>
      {/* <ToastContainer
        position="top-right"
        theme="light"
        autoClose={5000}
        closeOnClick
        style={{ width: '30em' }}
      /> */}
      <div className="wrapper">
        <div id='slide'>
          <PublishedWithChangesIcon />&nbsp;&nbsp;View your complete history
        </div>
      </div>
      <div className='row col-12 mt-3 ps-4 pe-3'>
        <div className='col-9' style={{ fontSize: '2em' }}>History</div>
        {/* <div className='col-3' style={{textAlign:'right'}}> */}
        {/* <button className='col-3' style={{ color: '#0c6fa1' }}><PublishedWithChangesIcon />&nbsp;&nbsp;View your complete history</button> */}
        {/* </div> */}
      </div>
      <div className='ps-4 pe-3 mt-3 mb-3' style={{ display: 'flex', justifyContent: 'center' }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            All Files
          </Link>
          <Typography
            sx={{ display: 'flex', alignItems: 'center' }}
            color="text.primary"
          >
            <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {localStorage.getItem("fileName")}
          </Typography>
        </Breadcrumbs>
      </div>
      <div className='ps-4 pe-3 mt-2'>
        <div className='row'>
          <div className='col-md-5'>
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            File name: <span style={{ fontStyle: 'italic' }}>{localStorage.getItem("fileName")}</span>
          </div>
          <div className='col-md-4 row' style={{ alignItems: 'center' }}>
            <div className='col-md-6'><div className='d-flex' style={{ justifyContent: 'center', alignItems: 'center' }}><div style={{ backgroundColor: '#007b5e', height: '1em', width: '1em' }}>&nbsp;</div>&nbsp;Success Operation</div></div>
            <div className='col-md-6'><div className='d-flex' style={{ justifyContent: 'center', alignItems: 'center' }}><div style={{ backgroundColor: '#AF4839', height: '1em', width: '1em' }}>&nbsp;</div>&nbsp;Error Operation</div></div>
          </div>
          <div className='col-md-3 text-right'>
            <button className='btn' style={{ backgroundColor: '#0c6fa1', color: 'white' }} onClick={() => { onExecuteSelectedOperations() }}>
              {/* <PlayCircleOutlineIcon /> */}
              <HourglassEmptyIcon />
              &nbsp;
              Execute Selected Operations</button>
          </div>
        </div>


        {tempData.map((operation: any) => (
          <div className='mt-2' style={{ border: '1px solid #00000018', borderRadius: '4px' }} key={operation.id}>
            <Accordion
              className={`${getStatusClassName(operation)}`}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Checkbox
                  checked={checked.some(item => item.id === operation.id)}
                  onChange={() => handleCheckboxChange(operation)}
                />
                {runStatus[operation.id] && (
                  <div>
                    {runStatus[operation.id] == 'error' && (
                      <Typography className='ps-3 pt-2'>
                        <ErrorOutlineIcon style={{ color: '#AF4839' }} />
                      </Typography>
                    )}
                    {runStatus[operation.id] == 'success' && (
                      <Typography className='ps-3 pt-2'>
                        <CheckCircleOutlineIcon style={{ color: '#007b5e' }} />
                      </Typography>
                    )}
                  </div>
                )}
                <Typography sx={{ color: 'text.secondary' }} className='ps-3'
                  style={{ display: 'flex', alignItems: 'center' }}>{operation['desc']}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Divider style={{ backgroundColor: 'black' }} className='mb-3' />
                <div style={{ border: '1px solid #0c6fa162', borderRadius: '5px' }} className='p-3'>
                  {operation.params.length > 0 ? (
                    <div>
                      {operation.params.map((field: any, index: number) => (
                        <div key={index}>
                          <div>
                            <Tooltip title={field.description}>
                              <span>{field.name}:</span>
                            </Tooltip>
                            <Tooltip title={`Please enter ${field.description} here`}>
                              <TextField
                                value={field.defaultValue}
                                className='ms-5'
                                onChange={(e) => handleParamChange(operation.id, index, e.target.value)}
                                variant='standard'
                                required={field.required}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ textAlign: 'center' }}>NO PARAMETERS</p>
                  )}
                </div>
                {statusMessage[operation.id] && (
                  <div className='mt-3'>
                    {runStatus[operation.id] == 'error' && (
                      <Alert variant="outlined" severity="error" icon={false}>
                        {statusMessage[operation.id]}
                      </Alert>
                    )}
                    {runStatus[operation.id] == 'success' && (
                      <Alert variant="outlined" severity="success" icon={false}>
                        {statusMessage[operation.id]}
                      </Alert>
                    )}
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          </div>
        ))}


      </div>

    </div >
  )
}

export default History
