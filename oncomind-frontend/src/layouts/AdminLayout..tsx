import React from 'react';
import { Outlet } from 'react-router-dom';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'


const AdminLayout: React.FC = () => {

     return (
          <>
               <Outlet />
          </>
     );
};

export default AdminLayout;