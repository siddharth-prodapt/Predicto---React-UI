import React from 'react'
import myAccount from '../assets/images/my_account.png';
import myAccountUser from '../assets/images/my-account-user.png';
import myAccountUser2 from '../assets/images/user-my-account-3.png';
import { TextField } from '@mui/material';

const MyAccount = () => {
  return (
    <div className='my-account-page'>
      <div className="sq-my-account"></div>
      <div className="circle-my-account">
        <img style={{ borderRadius: '50%', height: '100%', width: '100%' }} src={myAccountUser2} />
      </div>
      <div className='pl-5 ml-5'>
        <div className='ml-5 pl-5'>
          <table className='ml-5 mt-3 mb-3'>
            <tr>
              <td>User ID:&nbsp;&nbsp;</td>
              <td><TextField variant="standard" value={localStorage.getItem('userID')} disabled required /></td>
            </tr>
            <tr>
              <td>User Name:&nbsp;&nbsp;</td>
              <td><TextField variant="standard" value={localStorage.getItem('userName')} disabled required /></td>
            </tr>
            <tr>
              <td>E-Mail:&nbsp;&nbsp;</td>
              <td><TextField variant="standard" value={localStorage.getItem('userEmail')} disabled required /></td>
            </tr>
          </table>
        </div>
      </div>
    </div >
  )
}

export default MyAccount
