import React from 'react';
import {BrowserRouter} from  'react-router-dom'
import Routes from './Routes'

import Global from './styles/global'
const App = () =>  (
  <>
  <BrowserRouter> 
   <Routes/>
  </BrowserRouter>
  <Global />
  </>

)

export default App;
    