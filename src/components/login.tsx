import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import '../assets/css/styles.css'
import { loginStateChange } from '../AuthGuard';
import loginPage from '../assets/images/login-page.png';
import logoImg from '../assets/images/PREDICTO-LOGO.png';
import { TextField, Button } from "@mui/material";
import 'wowjs/css/libs/animate.css';
import { signUpUser, signInUser } from '../AllAssets';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
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

    // To show login or register component: true means login: false means register
    const [isDisplayTypeLogin, setDisplayTypeLogin] = useState<Boolean>(true);


    /////////////////////////////////////////////////////// Login Page ////////////////////////////////////////////////////////

    const [usernameInputLogin, setUsernameInputLogin] = useState<String>();
    const handleInputChangeUserLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameInputLogin(event.target.value);
    };

    const [userEmailLogin, setUserEmailLogin] = useState<String>();
    const handleInputChangeEmailLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmailLogin(event.target.value);
    };

    const [passwordLogin, setPasswordLogin] = useState<String>();
    const handleInputChangePasswordLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordLogin(event.target.value);
    };

    function onLoginBtnClick(e: any) {
        e.preventDefault();
        const signIn = async () => {
            try {
                const response = await signInUser({
                    "email": userEmailLogin,
                    "firstname": usernameInputLogin,
                    "password": passwordLogin
                });
                console.log(response.data.data)

                // USER EXISTS
                if (response.data.data) {
                    if (loginStateChange(true, response.data.data)) {
                        toastMessage('success', "Logged In!");
                        navigate('/home');
                    }
                }
                // USER DOES NOT EXIST
                else {
                    console.log(response.data[0].message);
                    toastMessage('warning', response.data[0].message)
                }
            } catch (error: any) {
                toastMessage('error', 'Failed to login');
                console.error(error);
            }
        };
        signIn();
        // if (loginStateChange(true, { userID: '10', userEmail: 'shweta@gmail.com', userName: 'Shweta', userFiles: [] })) {
        //     toastMessage('success', "Logged In!");
        //     navigate('/home');
        // }
    }


    ////////////////////////////////////////////////////// Register Page //////////////////////////////////////////////////////

    const [usernameInputRegister, setUsernameInputRegister] = useState<String>();
    const handleInputChangeUserRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameInputRegister(event.target.value);
    };

    const [userEmailRegister, setUserEmailRegister] = useState<String>();
    const handleInputChangeEmailRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmailRegister(event.target.value);
    };

    const [passwordRegister, setPasswordRegister] = useState<String>();
    const handleInputChangePasswordRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordRegister(event.target.value);
    };

    const [confirmPasswordRegister, setConfirmPasswordRegister] = useState<String>();
    const handleInputChangeConfirmPasswordRegister = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordRegister(event.target.value);
    };

    function onRegisterBtnClick(e: any) {
        e.preventDefault();
        console.log("usernameInputRegister", usernameInputRegister);
        console.log("passwordRegister", passwordRegister);
        console.log("confirmPasswordRegister", confirmPasswordRegister);
        if (passwordRegister == confirmPasswordRegister) {
            const signUp = async () => {
                console.log({
                    "email": userEmailRegister,
                    "firstname": usernameInputRegister,
                    "password": passwordRegister
                })
                try {
                    const response = await signUpUser({
                        "email": userEmailRegister,
                        "firstname": usernameInputRegister,
                        "password": passwordRegister
                    });
                    console.log(response);
                    setDisplayTypeLogin(true);
                    toastMessage('success', 'Successfully created account!');
                } catch (error: any) {
                    console.error(error);
                    // toastMessage('error', "An error occured");
                    toastMessage('error', error.toLocaleString());
                }
            };
            signUp();
        }
        else {
            toastMessage('error', 'Password and Confirm Password do not match')
        }

        // if (loginStateChange(true)) {
        //     navigate('/home');
        // }
    }

    if (isDisplayTypeLogin) {
        return (
            <div className='mt-5'>
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
                <div className='row col-12'>
                    <div className='col-md-7 pt-3 p-5'>
                        {/* <img src={logoImg} /> */}
                        <img src={loginPage} />
                    </div>
                    <div className='col-md-5 wow wobble' data-wow-delay="0.2s">
                        <div className='ml-5 p-2'>
                            <div className='ml-4 blue-box-login p-4 text-center'>
                                <p className='login-page-head'>LOGIN</p>
                                <p className='login-page-liner mt-3'>Step in to elevate your data game!</p>
                                <form onSubmit={onLoginBtnClick}>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <TextField label="Username" variant="outlined" className='col-12 mt-5' value={usernameInputLogin} onChange={handleInputChangeUserLogin} required />
                                        </div>
                                        <div className='col-md-6'>
                                            <TextField label="E-mail" variant="outlined" className='col-12 mt-5' value={userEmailLogin} onChange={handleInputChangeEmailLogin} required />
                                        </div>
                                    </div>
                                    <TextField type='password' label="Passsword" variant="outlined" className='col-12 mt-4 mb-5' value={passwordLogin} onChange={handleInputChangePasswordLogin} required />
                                    <Button variant="contained" className='text-center w-50 submit-btn-login' type="submit">Login</Button>
                                </form>
                                <p className='login-page-liner mt-3'>Not a user? <span className='blue-text-login-page' onClick={() => { setDisplayTypeLogin(false) }}>Register here!</span></p>
                            </div></div>
                    </div>
                </div>
            </div >
        )
    }
    else {
        return (<div>
            {/* <ToastContainer
                position="top-right"
                theme="light"
                autoClose={5000}
                closeOnClick
                style={{ width: '30em' }}
            /> */}
            <div className='col-12 row text-center'>
                <div className='col-4'></div>
                <div className='col-4 mt-4 text-center'>
                    <div className='blue-box-register p-4 text-center'>
                        <p className='login-page-head'>REGISTER</p>
                        <p className='login-page-liner mt-3'>Step in to elevate your data game!</p>
                        <form onSubmit={onRegisterBtnClick}>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <TextField label="Username" variant="outlined" className='col-12 mt-4' value={usernameInputRegister} onChange={handleInputChangeUserRegister} required />
                                </div>
                                <div className='col-md-12'>
                                    <TextField label="E-mail" variant="outlined" className='col-12 mt-4' value={userEmailRegister} onChange={handleInputChangeEmailRegister} required />
                                </div>
                                <div className='col-md-6'>
                                    <TextField type='password' label="Passsword" variant="outlined" className='col-12 mt-4 mb-4' value={passwordRegister} onChange={handleInputChangePasswordRegister} required />
                                </div>
                                <div className='col-md-6'>
                                    <TextField type='password' label="Confirm Passsword" variant="outlined" className='col-12 mt-4 mb-4' value={confirmPasswordRegister} onChange={handleInputChangeConfirmPasswordRegister} required />
                                </div>
                            </div>
                            <Button variant="contained" className='text-center w-50 submit-btn-login' type="submit">Register</Button>
                        </form>
                        <p className='login-page-liner mt-3'>Already a user? <span className='blue-text-login-page' onClick={() => { setDisplayTypeLogin(true) }}>Login here!</span></p>
                    </div>
                </div>
                <div className='col-4'></div>
            </div>
        </div>)
    }

}

export default Login
