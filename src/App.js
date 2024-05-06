import './App.css';
import Canvas from './Canvas'
import Task from './task'
import Staticcrop from './Static'
import Statictag from './Statictag'
import DynamicCrop from './DynamicCrop';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Konvo from './Konvo';
import DynamicValues from './DynamicValues';

import Main from './main';

const App = () => {
  return (
//     <div className="app">
// {/*      <h1>StaticCrop</h1>
//       <Statictag /> */} 
//       {/*  <h1 style={{textAlign:"center"}}>Canvas Crop</h1>
//       <DynamicCrop/>  */}
//      {/*  <h1>Konvo</h1>
//       <Konvo/> */}
//      {/*  <h1>Coordinate Values</h1>
//       <DynamicValues/> */}
//       <Main/>
//     </div>
<Router>
<Routes>
  <Route path="/" element={<Main />} />
  <Route path="/dynamic-crop" element={<DynamicCrop />} />
</Routes>
</Router>
  );
};

export default App;







