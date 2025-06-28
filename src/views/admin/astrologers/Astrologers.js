import React, { useState} from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import VerifiedAstro from './tabs/VerifiedAstro';
import UnverifiedAsro from './tabs/UnverifiedAsro';
import { useDispatch, useSelector } from 'react-redux';
import { setAstroViewMode } from '../../../redux/actions/astroViewModeAction';


const Astrologers = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();

  return (
    <>
      {/* <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => {
          setActiveIndex(e.index);
          dispatch(setAstroViewMode(0))
        }}
      >
        <TabPanel header="Verified"> */}
          <VerifiedAstro />
        {/* </TabPanel>
        <TabPanel header="Unverified">
          <UnverifiedAsro />
        </TabPanel>
      </TabView> */}
    </>
  )
}

export default Astrologers