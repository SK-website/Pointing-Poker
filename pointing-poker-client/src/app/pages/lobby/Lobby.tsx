import { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import Members from '../../components/scrum/members/members';
import IssuesLobby from '../../components/scrum/issues-lobby/issues-lobby';
import GameSettings from '../../components/scrum/game-settings/game-settings';
import './lobby.scss';
import GameName from '../../components/shared/game-name/game-name';
import CustomCoverPopup from './CustomCoverPopup';
import CardValuePopup from './AddCardValuePopup';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { sendToServer, socket } from '../../socket/socket-context';
import { setGameSettings } from '../../redux/reducers/game-settings-reducer';
import Chat from '../../components/shared/chat/chat';
import OwnCardValuePopup from './SetOwnCardPopup';
import Member from '../../components/shared/member/member';
import { closeSpinnerAction } from '../../redux/reducers/spinner-reducer';
import { setCardsFromDefaultSettings } from '../../redux/reducers/add-card-reducer';

const Lobby: FC = () => {
  const dispatch = useAppDispatch();
  const { gameID } = useAppSelector((state) => state.authPopup);
  const gameSettings = useAppSelector((state) => state.gameSettings);
  const history = useHistory();
  const { isAdmin } = useAppSelector((state) => state.authPopup.user);
  const { members } = useAppSelector((state) => state.members);
  const admin = members.find((member) => member.isAdmin === true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(true);
    const defaultLocalSettings = localStorage.getItem('gameSettings');

    if (defaultLocalSettings) {
      dispatch(setGameSettings(JSON.parse(defaultLocalSettings)));
      dispatch(
        setCardsFromDefaultSettings(
          JSON.parse(defaultLocalSettings).cardValuesFinalSet
        )
      );
    }

    socket.on('GAME_STARTED', () => {
      history.push(`/game/${gameID}`);
    });

    socket.on('GAME_STOPPED', () => {
      history.push(`/result/${gameID}`);
    });

    socket.on('leave_room', () => {
      history.push(``);
      dispatch(closeSpinnerAction());
    });
  }, []);

  const path = 'https://pointing-poker-88.netlify.app/start/';
  const link = path + gameID;
  const copyGameIdButtonHandler = () => navigator.clipboard.writeText(link);

  const handleStartGameButtonClick = () => {
    const { isDefaultSettings } = gameSettings;
    if (isDefaultSettings) {
      localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
    }
    sendToServer('settings_changed', { gameID, gameSettings }).then(() =>
      sendToServer('game_started', { gameID })
    );
  };

  const handleCancelGameButtonClick = () => {
    sendToServer('game_canceled_admin', { gameID });
  };

  const handlePlayerCancelButtonClick = () => {
    const memberId = socket.id;
    sendToServer('game_canceled', { gameID, memberId });
  };

  return isAdmin ? (
    <div className="container">
      <section className="section-wrap">
        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          <Alert.Heading>Welcome to the lobby of game #{gameID}!</Alert.Heading>
          <p>Please, configure settings and start the game.</p>
        </Alert>
        <GameName />
        {admin && (
          <>
            <h4>Scrum master:</h4>
            <Member
              id={admin.id}
              firstName={admin.firstName}
              lastName={admin.lastName}
              jobPosition={admin.jobPosition}
              avatar={admin.avatar}
              isGame={false}
              isAdmin={admin.isAdmin}
              role={admin.role}
            />
          </>
        )}

        <p className="lobby-link-title">Link to lobby:</p>
        <div className="lobby-link-block">
          <p className="lobby-link-text">
            {path}
            {gameID}
          </p>
          <Button
            variant="secondary"
            className="m-1"
            onClick={copyGameIdButtonHandler}
          >
            Copy Game ID
          </Button>
        </div>
        <div className="game-control-btn-block">
          <Button
            size="lg"
            variant="primary"
            className="m-1"
            onClick={handleStartGameButtonClick}
          >
            START GAME
          </Button>
          <Chat size="lg" />
          <Button
            size="lg"
            variant="outline-danger"
            className="m-1"
            onClick={handleCancelGameButtonClick}
          >
            CANCEL GAME
          </Button>
        </div>
      </section>
      <Members />
      <IssuesLobby />
      <GameSettings />
      <CustomCoverPopup />
      <CardValuePopup />
      <OwnCardValuePopup />
    </div>
  ) : (
    <div className="container">
      <section className="section-wrap">
        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          <Alert.Heading>Welcome to the lobby of game #{gameID}!</Alert.Heading>
          <p>
            Please, wait for other players. Scrum master will start the game
            soon.
          </p>
        </Alert>
        <GameName />
        {admin && (
          <>
            <h3>Scrum master:</h3>
            <Member
              id={admin.id}
              firstName={admin.firstName}
              lastName={admin.lastName}
              jobPosition={admin.jobPosition}
              avatar={admin.avatar}
              isGame={false}
              isAdmin={admin.isAdmin}
              role={admin.role}
            />
          </>
        )}
        <div className="game-control-btn-block gamer-cancel-game">
          <Button
            size="lg"
            variant="outline-danger"
            className="m-1"
            onClick={handlePlayerCancelButtonClick}
          >
            Cancel game
          </Button>
          <Chat size="lg" />
        </div>
      </section>
      <Members />
    </div>
  );
};

export default Lobby;
