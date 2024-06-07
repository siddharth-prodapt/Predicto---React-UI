import React, { useEffect } from 'react'
import SaveIcon from '@mui/icons-material/Save';
import '../assets/css/styles.css'
import { ToastContainer, toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { saveModel } from '../AllAssets';
import { useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const SavedProgressTop = () => {
    const fileName = localStorage.getItem('fileName');
    const fileNameDisplay = fileName ? (fileName.length > 30 ? `${fileName.slice(0, 30 - 3)}...` : fileName) : '';
    const [savedProgressValue, setSavedProgressValue] = React.useState('55%');

    const [currentProgress, setCurrentProgress] = React.useState<string | null>(
        localStorage.getItem('currentProgress')
    );
    const handleStorageChange = () => {
        setCurrentProgress(localStorage.getItem('currentProgress'));
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setCurrentProgress(localStorage.getItem('currentProgress'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (currentProgress !== null) {
            console.log('currentProgress changed:', currentProgress);
            if (currentProgress == 'Not Performed pre-processing')
                setSavedProgressValue('55%');
            else if (currentProgress == 'Performed pre-processing')
                setSavedProgressValue('75%');
        }
    }, [currentProgress]);

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
                console.log(response);
                return true;
            }
            else if (response.data['status'] == "failure") {
                toastMessage('error', response.data['message']);
                return false;
            }
        }
    }


    const onSaveBtnClicked = async () => {
        try {
            const response = await saveModel(localStorage.getItem('userID'), localStorage.getItem("fileName"));
            if (responseChecker(response))
                toastMessage('info', response.data['message']);

        } catch (error: any) {
            toastMessage('error', 'Error saving model!');
            return false;
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
            <div className='progress-sticky-top wow fadeInLeft'>
                <div>
                    <div className='progress-bar-bg p-3'>
                        <div className='d-flex col-12'>
                            <div style={{ width: '88%' }}>
                                <div className='progress-bar'>
                                    <div className='progress-bar-percentage p-1' style={{ width: savedProgressValue }}>
                                        <p>
                                            File - <Tooltip title={localStorage.getItem('fileName')}>
                                                <span style={{ fontStyle: 'italic' }}>{fileNameDisplay}</span>
                                            </Tooltip>
                                            {/* {currentProgress} */}
                                            &nbsp;currently at data-preprocessing (Next Step: Model Train)</p>
                                        {/* <p>Current saved progress: {savedProgressValue} completed (At data pre-processing)</p> */}
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '2%' }}></div>
                            <div style={{ width: '10%' }}>
                                <div className='w-100 p-1 text-center text-white btn save-btn-top' onClick={() => { onSaveBtnClicked() }}><SaveIcon className='save-icon' />&nbsp;Save Progress</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SavedProgressTop
