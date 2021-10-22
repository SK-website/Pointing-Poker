import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { SocketContext } from './app/socket/socket-context';
import Game from './app/pages/game/Game';
import Lobby from './app/pages/lobby/Lobby';
import NotFound from './app/pages/not-found/NotFound';
import Result from './app/pages/result/Result';
import Start from './app/pages/start/Start';
import { useAppDispatch } from './app/redux/hooks';
import Header from './app/components/shared/header/header';
import Footer from './app/components/shared/footer/footer';
import Loader from './app/components/shared/loader/loader';
import { closeSpinnerAction } from './app/redux/reducers/spinner-reducer';
import AdmitPopup from './app/components/shared/admit-popup/admit-popup';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('UPDATE_CLIENT', (action) => {
      dispatch(action);
      dispatch(closeSpinnerAction());
    });
  }, [socket]);

  return (
    <Router>
      <Loader />
      <AdmitPopup />
      <Header />
      <Switch>
        <Route path="/lobby">
          <Lobby />
        </Route>
        <Route path="/game/:gameID">
          <Game />
        </Route>
        <Route path="/result">
          <Result />
        </Route>
        <Route exact path="/">
          <Start />
        </Route>
        <Route path="/start/:gameID">
          <Start />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
