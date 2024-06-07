import React from 'react'
import { AuthGuard } from '../AuthGuard'
import '../assets/css/footer.css'

const Footer = () => {
    if (AuthGuard()) {
        return (
            <div>
                {/* <footer className='p-3 footer-div'>
                    <div className='row col-12 mt-2'>
                        <div className='col-md-4 text-center footer-link-div'><span className='footer-link underline-effect'>Home</span></div>
                        <div className='col-md-4 text-center footer-link-div'><span className='footer-link underline-effect'>My Account</span></div>
                        <div className='col-md-4 text-center footer-link-div'><span className='footer-link underline-effect'>History</span></div>
                    </div>
                </footer> */}
            </div>
        )
    }
    else {
        return (<div></div>)
    }
}

export default Footer
