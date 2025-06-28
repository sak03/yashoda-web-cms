import React, { useEffect, useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import Products from './product/Products';
import ProductDesign from './product-design/ProductDesign';
import {setAstroViewMode} from '../../../redux/actions/astroViewModeAction'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const ECommers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    dispatch(setAstroViewMode(0));
  },[])


  return (
    <TabView>
      <TabPanel header="Products">
        <Products />
      </TabPanel>
      <TabPanel header="Product Design">
        <ProductDesign />
      </TabPanel>
    </TabView>
  )
}

export default ECommers