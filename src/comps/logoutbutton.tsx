/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';

const Logout = () => {
  return (
    <a href="/api/auth/logout"><button className='btn btn-ghost'>Log Out</button></a>
  );
};

export default Logout;