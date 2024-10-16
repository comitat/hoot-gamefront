import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { useDispatch } from 'react-redux';

import { HootRoutes } from '@models/routes';
import { Fields } from '@models/localStorage';

import { MainMenu } from '@components/MainMenu';
import { Layout } from '@components/Layout';
import { PagesWrapper } from '@components/PagesWrapper';
import { Messages } from '@components/Messages';

import { Mining } from '@pages/Mining';
import { TapEX } from '@pages/TapEX';
import { Farming } from '@pages/Farming';
import { Events } from '@pages/Events';
import { Settings } from '@pages/Settings';
import { Help } from '@pages/Help';
import { SetLanguage } from '@pages/SetLanguage';
import { Cash } from '@pages/Cash/Cash';

import { registerUserAction } from '@store/userSlice';

import {
  initMiningAction,
  localDataUpdateAction,
} from '@store/miningSlice';

import { AppDispatch } from '@store/store';

import './App.scss'

const token = localStorage.getItem(Fields.Token);

function App() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  // const mining = useAppSelector((state) => state.mining);

  // const [log, setlog] = useState({a: 'a'});
  const initialized = useRef(false);

  useEffect(() => {
    // prevent rerender in dev mode
    if (initialized.current) return;
    initialized.current = true;
  
    if (!token) {
      dispatch(registerUserAction());
    } else {
      dispatch(initMiningAction());
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // set pause
      } else {
        dispatch(initMiningAction());
      }
    };

    const handleWindowBlur = () => {
      // set pause
    };

    const handleWindowFocus = () => {
      dispatch(initMiningAction());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(localDataUpdateAction());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <Layout>
      {/* mining: {JSON.stringify(mining)}
      <br />

      log: {JSON.stringify(log)}
      <br /> */}

      <PagesWrapper>
        <Routes location={location}>
          <Route path={HootRoutes.Mining} element={<Mining />} />
          <Route path={HootRoutes.TapEX}element={<TapEX />} />
          <Route path={HootRoutes.Farming} element={<Farming />} />
          <Route path={HootRoutes.Events} element={<Events />} />

          <Route path={HootRoutes.Settings} element={<Settings />} />
          <Route path={HootRoutes.Help} element={<Help />} />
          <Route path={HootRoutes.SetLanguage} element={<SetLanguage />} />

          <Route path={HootRoutes.Cash} element={<Cash />} />
        </Routes>
      </PagesWrapper>
      <MainMenu />
      <Messages />
    </Layout>
  );
}

export default App
