import { ChangeEvent, FormEvent, useEffect } from 'react';
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  closeAlertAction,
  closeAlertKickedAction,
  closeAuthPopupAction,
  setGameIDAction,
  setIsAdminAction,
  setNewGame,
  setUserIDAction,
  showAuthPopupAction,
} from '../../redux/reducers/auth-reducer';
import { socket } from '../../socket/socket-context';
import AuthPopup from './AuthPopup';

function Start(): JSX.Element {
  const { gameID, alertGameExistVisible, alertKickedVisible } = useAppSelector(
    (state) => state.authPopup
  );
  const location = useLocation();
  const locationID = location.pathname.split('/').splice(-1, 1);

  useEffect(() => {
    dispatch(closeAuthPopupAction());
  }, []);

  useEffect(() => {
    if (locationID) dispatch(setGameIDAction(locationID));
  }, []);

  function getRandomID(min: number, max: number) {
    return Math.ceil(Math.random() * (max - min) + min);
  }

  const dispatch = useAppDispatch();

  const showAuthPopup = () => dispatch(showAuthPopupAction());

  const handleStartGameButton = () => {
    dispatch(setGameIDAction(getRandomID(10000000, 99999999).toString()));
    dispatch(setNewGame(true));
    dispatch(setIsAdminAction(true));
    dispatch(setUserIDAction(socket.id));
  };

  const handleChangeConnectGameID = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setGameIDAction(e.target.value.toString()));
  };

  const handleConnectGameButton = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setNewGame(false));
    dispatch(setIsAdminAction(false));
    dispatch(setUserIDAction(socket.id));
  };

  return (
    <Container>
      <Row className="mb-5">
        <Col>
          <h1>Start your planning:</h1>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <h3>
            Create session:
            <Button
              variant="primary"
              className="m-1"
              onClick={() => {
                handleStartGameButton();
                showAuthPopup();
              }}
            >
              Start new game
            </Button>
          </h3>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <h4>or</h4>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <h3>Connect to lobby by game ID</h3>
          <Form
            onSubmit={(e) => {
              handleConnectGameButton(e);
              showAuthPopup();
            }}
          >
            <InputGroup>
              <FormControl
                type="number"
                min="10000000"
                max="99999999"
                placeholder="Enter game ID"
                aria-label="game-id"
                value={gameID}
                required
                onChange={handleChangeConnectGameID}
              />
              <Button type="submit" variant="primary" id="button-addon2">
                Connect
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <AuthPopup />
      <Alert
        variant="danger"
        show={alertGameExistVisible}
        onClose={() => dispatch(closeAlertAction())}
        dismissible
      >
        <Alert.Heading>Game is not exist!</Alert.Heading>
        <p>Please, enter the correct game ID.</p>
      </Alert>
      <Alert
        variant="danger"
        show={alertKickedVisible}
        onClose={() => dispatch(closeAlertKickedAction())}
        dismissible
      >
        <Alert.Heading>You were kicked!</Alert.Heading>
        <p>Please, choose another game.</p>
      </Alert>
    </Container>
  );
}

export default Start;
