import React, { useEffect, useState } from 'react'
let login: Boolean;
// login = true;
if (localStorage.getItem('userID'))
    login = true;
else
    login = false;

// [
//     {
//       "filename": "multiTimeline (1).csv",
//       "filetype": "text/csv",
//       "id": 1,
//       "userId": 15
//     },
//     {
//       "filename": "download (1).xls",
//       "filetype": "application/vnd.ms-excel",
//       "id": 2,
//       "userId": 15
//     },
//     {
//       "filename": "hiring.csv",
//       "filetype": "text/csv",
//       "id": 3,
//       "userId": 15
//     },
//     {
//       "filename": "ML-MATT-CompetitionQT1920_test.csv",
//       "filetype": "text/csv",
//       "id": 4,
//       "userId": 15
//     }
//   ]

export const loginStateChange = (loginState: Boolean, loginInformation: any) => {
    if (loginState == true) {
        // localStorage.setItem('userId', loginInformation.);
        localStorage.setItem('userID', loginInformation.id);
        localStorage.setItem('userEmail', loginInformation.email);
        localStorage.setItem('userName', loginInformation.firstName);
        localStorage.setItem('userFiles', JSON.stringify(loginInformation.files));
        login = loginState;
    }
    else if (loginState == false) {
        localStorage.removeItem('userID');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userFiles');
        localStorage.removeItem('currentProgress');
        login = loginState;
    }
    return login;
}
export const AuthGuard = () => {
    return login;
}

export const RoleInfo = () => {
    let roleName = "abc";
    return roleName;
}
