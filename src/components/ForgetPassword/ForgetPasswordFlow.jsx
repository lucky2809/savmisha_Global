import React, { useState } from 'react';
import EmailOtpVerification from './EmailOtpVerification';
import ResetPassword from './Resetpassword';

const ForgotPasswordFlow = () => {
  const [verifiedEmail, setVerifiedEmail] = useState('');

  return (
    <div className='flex justify-center h-full w-full '>
      {!verifiedEmail ? (
        <EmailOtpVerification onVerified={(email) => setVerifiedEmail(email)} />
      ) : (
        <ResetPassword email={verifiedEmail} />
      )}
    </div>
  );
};

export default ForgotPasswordFlow;
