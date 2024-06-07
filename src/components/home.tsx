import React, { useEffect, useState } from 'react'
import homePage from '../assets/images/home-page.png';
import UploadIcon from '@mui/icons-material/Upload';
import { DragEvent } from "react";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableBody, TableCell, TableRow, Paper, TableContainer, DialogContentText, TextField, CircularProgress } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { fileUpload, getUserFileDetailsByID, createDataFrame, getXLSFile, fileDelete, fileRename } from '../AllAssets';
import Tooltip from '@mui/material/Tooltip';
import axios, { AxiosResponse } from 'axios';


interface TableData {
  [key: string]: any;
}


interface RenameDialogProps {
  open: boolean;
  onClose: () => void;
  item: any;
}



const Home = () => {
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

  const RenameDialog: React.FC<RenameDialogProps> = ({ open, onClose, item }) => {
    const [oldFileName, setOldFileName] = React.useState('');
    const [fileID, setFileID] = React.useState('');

    React.useEffect(() => {
      if (item) {
        setOldFileName(item.filename);
        setFileID(item.id);
      }
    }, [item]);


    const [newFileName, setNewFileName] = React.useState('');

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const rename_file = async () => {
        try {
          const response = await fileRename(localStorage.getItem('userID'), fileID, oldFileName, newFileName);
          if (responseChecker(response)) {
            toastMessage('success', response.data.message);
            getUserDetailsById();
          }
        } catch (error) {
          toastMessage('error', 'Error renaming file');
          console.error(error);
        }
      };
      rename_file();
      setNewFileName('');
      onClose();
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleFormSubmit,
        }}
        fullWidth
      >
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>Currently Renaming File with Name: <span style={{ fontStyle: 'italic' }}>{oldFileName}</span></div>
            <div className='mt-2 mb-2'>Please enter new file name <b>with extension(Eg: .xlsx, .csv, .xls, etc)</b></div>
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            label="File Name"
            type='text'
            fullWidth
            variant="standard"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          {/* {newFileName.length > 0 ?
            (<span style={{ fontStyle: 'italic',color:'#00000099' }}>Your new file name will be {newFileName}</span>) :
            (<span></span>)} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Rename</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const navigate = useNavigate();

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

  const [instantiateLoading, setInstantiateLoading] = useState(false);

  ///////////////////////////////////////////////////// UPLOAD FILE SECTION /////////////////////////////////////////////////////

  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    // Function to run once when component mounts
    const userFiles: any = localStorage.getItem('userFiles');
    setFiles(JSON.parse(userFiles));
  }, []);

  // useEffect(() => {
  //   // Call the function when files changes
  //   if (files.length !== 0) {
  //     handleSubmit(files[files.length - 1]);
  //   }
  // }, [files]);

  const getUserDetailsById = async () => {
    try {
      const response = await getUserFileDetailsByID(localStorage.getItem('userID'));
      if (responseChecker(response)) {
        const listt: any[] = response.data.data;
        localStorage.setItem('userFiles', JSON.stringify(listt));
      }


      setFiles(response.data.data);

      // window.location.reload();


    } catch (error: any) {
      toastMessage('error', 'Error fetching user details!');
      console.error(error);
    }
  };



  // Function to handle form submission
  const handleSubmit = async (filesi: any) => {
    // Create FormData object
    const formData = new FormData();
    formData.append('file', filesi);
    const uploadFile = async () => {
      try {
        const response = await fileUpload(localStorage.getItem('userID'), formData);
        if (responseChecker(response)) {
          toastMessage('success', 'File Uploaded Sucessfully!');
          getUserDetailsById();
        }
      } catch (error) {
        toastMessage('error', 'Error uploading file!');
        console.error(error);
      }
    };
    uploadFile();
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(true);
  };
  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
  };
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);

    const fileList: any = event.dataTransfer.files;
    const droppedFiles: Array<any> = [];
    for (let i = 0; i < fileList.length; i++) {
      droppedFiles.push(fileList[i]);
      handleSubmit(fileList[i]);
    }

    // setFiles(combinedArrayofFiles);


    // for (let i = 0; i < files.length; i++) {
    //   handleSubmit(files[i]);
    // }
    // droppedFiles.forEach((file) => {
    //   const reader = new FileReader();
    //   reader.onerror = () => {
    //     console.error("There was an issue reading the file.");
    //   };
    //   reader.readAsDataURL(file);
    //   return reader;
    // });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList: any = event.target.files;
    const droppedFiles: Array<any> = [];
    for (let i = 0; i < fileList.length; i++) {
      droppedFiles.push(fileList[i]);
      handleSubmit(fileList[i]);
    }

    // const combinedArrayofFiles: any[] = files.concat(droppedFiles);
    // setFiles(combinedArrayofFiles);

    // for (let i = 0; i < files.length; i++) {
    //   handleSubmit(files[i]);
    // }
  };

  const navigateToDataPreProcessing = () => {
    navigate('/activity');
    // if (files.length <= 0) {
    //   toastMessage("error", "Please upload atleast one file!");
    // }
    // else {
    //   toastMessage("info", "Please select one from uploaded file(s)!");
    // }
  }


  const [jsonData, setJsonData] = useState<any[][]>([]);

  const [tableData, setTableData] = useState<any[][]>([]);
  let API_ENDPOINTS = '10.169.60.84';
  // let API_ENDPOINTS = 'localhost';
  let portNo = "8000";
  // let portNo = "8080";

  const onViewBtnClicked = async (fileNameRecieved: any) => {
    try {
      const viewXLSFileResponse = await getXLSFile(localStorage.getItem('userID'), fileNameRecieved);
      if (viewXLSFileResponse.data) {
        const workbook = XLSX.read(viewXLSFileResponse.data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (worksheet && worksheet.length != 0) {
          const jsonData: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          setTableData(jsonData);
          openDialog();
        }
      }
    } catch (error: any) {
      toastMessage('error', 'Error viewing file!');
      console.error(error);
    }
  }

  const onDownloadBtnClicked = async (fileNameRecieved: any) => {
    try {
      const viewXLSFileResponse = await getXLSFile(localStorage.getItem('userID'), fileNameRecieved);
      if (viewXLSFileResponse.data) {
        const blob = new Blob([viewXLSFileResponse.data], { type: 'application/vnd.ms-excel' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileNameRecieved); // Set the download attribute with desired filename
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);


      }
    } catch (error: any) {
      toastMessage('error', 'Error downloading file!');
      console.error(error);
    }
  }

  const onInstantiateBtnClicked = async (item: any) => {
    setInstantiateLoading(true);
    try {
      setInstantiateLoading(true);
      const response = await createDataFrame(localStorage.getItem("userID"), item.filename);
      if (responseChecker(response)) {
        localStorage.setItem("fileName", item.filename);
        localStorage.setItem('currentProgress', 'Not Performed pre-processing');
        navigateToDataPreProcessing();
        setInstantiateLoading(false);
      }
      else
        setInstantiateLoading(false);
    } catch (error: any) {
      setInstantiateLoading(false);
      toastMessage('error', 'Error instantiating file!');
      console.error(error);
    }
  }

  const onDeleteBtnClicked = async (item: any) => {
    const delete_File = async () => {
      try {
        const response = await fileDelete(localStorage.getItem('userID'), item.id, item.filename);
        if (responseChecker(response)) {
          toastMessage('success', 'File deleted sucessfully!');
          getUserDetailsById();
        }
      } catch (error) {
        toastMessage('error', 'Error deleting file!');
        console.error(error);
      }
    };
    delete_File();
  }


  const [dialogOpen, setDialogOpen] = useState(false);

  // Function to open the dialog
  const openDialog = () => {
    setDialogOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  interface MyList {
    [key: string]: boolean;
  }

  const [isHovered, setIsHovered] = useState<MyList>({});

  const handleMouseEnter = (filename: string) => {
    setIsHovered(prevState => ({
      ...prevState,
      [filename]: true
    }));
  };

  // Function to handle mouse leave event
  const handleMouseLeave = (filename: string) => {
    setIsHovered(prevState => ({
      ...prevState,
      [filename]: false
    }));
  };


  const [openRenameDialog, setOpenRenameDialog] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  const handleClickOpenRenameDialog = (item: any) => {
    setSelectedItem(item);
    setOpenRenameDialog(true);
  };

  const handleCloseRenameDialog = () => {
    setOpenRenameDialog(false);
  };



  ///////////////////////////////////////////////////// DATA PRE-PROCESSING /////////////////////////////////////////////////////



  return (
    <div>

      {/* <ToastContainer
        position="top-right"
        theme="light"
        autoClose={5000}
        // hideProgressBar={false}
        // newestOnTop={false}
        closeOnClick
        // rtl={false}
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
        style={{ width: '30em' }}
      /> */}

      <RenameDialog open={openRenameDialog} onClose={handleCloseRenameDialog} item={selectedItem} />

      {instantiateLoading ? (<div>
        <CircularProgress style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '4em',
          height: '4em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent white background
          zIndex: 9999
        }} />
      </div>) : (<div></div>)}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth>
        <DialogTitle>View Datasource</DialogTitle>
        <DialogContent>
          <Paper>
            <TableContainer sx={{ maxHeight: 440 }}>
              {tableData.length >= 1 ? (
                <Table style={{ position: 'relative' }} stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Index
                      </TableCell>
                      {tableData[0].map((header: string, index: number) => (
                        <TableCell>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.slice(1).map((row: any[], rowIndex: number) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                        <TableCell>
                          {rowIndex}
                        </TableCell>
                        {row.map((cell: any, cellIndex: number) => (
                          <TableCell key={cellIndex}
                          >{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div></div>
              )}

            </TableContainer>
          </Paper>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'flex-end' }}>
          <Button onClick={closeDialog}>OK</Button>
        </DialogActions>
      </Dialog>



      {/* UPLOAD FILE SECTION */}

      <div className='row col-12'>
        <div className='col-md-6'>
          <div className='p-5'>
            <p className='display-6'><b>Train your Model!</b></p>
            <p className='mt-5'>Say goodbye to cumbersome coding and complex algorithms! With this platform, you can now effortlessly dive into the world of data analysis and visualization. Empower yourself with all skill levels to explore your data, uncover insights and make informed decisions.</p>
            {files.length <= 0 ? (<div>
              <div className='mt-4 wow bounceIn text-center'>
                <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                  <div style={{ backgroundColor: isOver ? "lightgray" : "white" }} className='d-block dotted-blue-box p-3 text-center'>
                    <div className='text-center'>
                      <UploadIcon className='upload-icon-home' />
                      <p>Drag and Drop<br />or<br /></p>
                      {/* <button onClick={() => { onDownloadFile() }}>Download</button> */}
                      <p>
                        <label className="custom-file-upload">
                          <input type="file" className='d-none' multiple onInput={handleFileChange} />
                          <span className='p-5 pt-1 pb-1 upload-datasource-btn-home'>Upload Datasource</span>
                        </label>
                      </p>
                      <p className='d-flex w-100 text-center'>
                        {files.map((key: any, file: any) => (
                          <div>{file.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div>
                <div className='row text-center'>
                  <div className='col-12 col-md-6 col-lg-4 mt-4'>
                    <div className='dotted-blue-box text-center' onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} style={{ justifyContent: 'center' }}>
                      <div className='text-center'>
                        <AddIcon className='p-2' style={{ borderRadius: '50%', backgroundColor: '#D9D9D9', color: '#0c6fa1', fontSize: '3.5em' }} />
                        <div className='mt-2 text-center'>
                          <div className='text-center' style={{ fontSize: '0.8em' }}>Drag and drop <br />or</div>
                          <label className="custom-file-upload text-center">
                            <input type="file" className='d-none' multiple onInput={handleFileChange} />
                            <u style={{ color: '#0c6fa1' }}><span className='w-100' style={{ cursor: 'pointer', fontSize: '0.7em', color: '#0c6fa1', fontWeight: 'bold' }}>Upload Datasource</span></u>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {files.slice().reverse().map((item: any, index) => (
                    <div className='col-12 col-md-6 col-lg-4 mt-4 text-center'>
                      <div className='dotted-blue-box p-2 text-center' style={{ position: 'relative', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', top: '0', right: '0' }}>
                          <div onClick={() => { handleClickOpenRenameDialog(item) }} style={{ fontSize: '0.7em', cursor: 'pointer', color: '#3A4856' }} className='mr-1'>
                            Rename</div>
                        </div>
                        <div className='text-center mt-2'>
                          {isHovered[item.filename] ? (
                            <Tooltip title={`Download file`} placement='top'>
                              <DownloadIcon
                                className='p-2 file-hovered'
                                onMouseEnter={() => handleMouseEnter(item.filename)}
                                onMouseLeave={() => handleMouseLeave(item.filename)}
                                onClick={() => { onDownloadBtnClicked(item.filename) }}
                              />
                            </Tooltip>
                          ) : (
                            <InsertDriveFileIcon
                              className={`p-2 ${isHovered[item.filename] == true ? 'file-hovered' : 'file-not-hovered'}`}
                              onMouseEnter={() => handleMouseEnter(item.filename)}
                              onMouseLeave={() => handleMouseLeave(item.filename)}
                            />
                          )}
                          <div className='mt-1 mb-1'>
                            <Tooltip title={
                              <React.Fragment>
                                {item.filename}
                              </React.Fragment>
                            }>
                              {item.filename.length > 13 ? `${item.filename.slice(0, 13 - 3)}...` : item.filename}
                            </Tooltip>
                          </div>
                          <div className='row'>
                            <div className='col-md-5 mt-1'><button onClick={() => { onViewBtnClicked(item.filename) }} className='w-100' style={{ padding: '0.06em', fontSize: '0.8em', backgroundColor: '#3A4856', color: 'white', borderRadius: '5px' }}>
                              View</button></div>
                            <div className='col-md-7 mt-1'><button onClick={() => { onDeleteBtnClicked(item) }} className='w-100' style={{ padding: '0.06em', fontSize: '0.8em', backgroundColor: '#3A4856', color: 'white', borderRadius: '5px' }}>
                              Delete</button></div>
                            <div className='col-md-12 mt-1'><button onClick={() => { onInstantiateBtnClicked(item) }}
                              className='w-100' style={{ padding: '0.06em', fontSize: '0.8em', backgroundColor: '#3A4856', color: 'white', borderRadius: '5px' }}>
                              Instantiate ML</button></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='col-md-6 p-5 pt-2'><img className='w-100' src={homePage} /></div>
      </div>

      <div className='previous-next-btn-bottom'>
        <span className='cursor-pointer'
          onClick={() => { navigateToDataPreProcessing() }}
        >Next <NavigateNextIcon /></span>
      </div>

      {/* DATA PRE-PROCESSING SECTION */}
      {/* <div className='row col-12'>
        <div className='col-6'>a</div>
        <div className='col-6'>a</div>
      </div> */}

    </div>
  )
}

export default Home
