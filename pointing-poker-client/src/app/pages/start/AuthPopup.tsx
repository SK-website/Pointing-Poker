import { ChangeEvent, FormEvent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { sendToServer } from '../../socket/socket-context';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  closeAuthPopupAction,
  setFirstNameAction,
  setJobPositionAction,
  setLastNameAction,
  setRoleAction,
} from '../../redux/reducers/auth-reducer';
import { showSpinnerAction } from '../../redux/reducers/spinner-reducer';

function AuthPopup(): JSX.Element {
  const dispatch = useAppDispatch();
  let avatarFile: File | null = null;

  const { authPopupVisible, gameID, newGame, user } = useAppSelector(
    (state) => state.authPopup
  );

  const history = useHistory();

  const closeAuthPopup = () => dispatch(closeAuthPopupAction());

  const handleChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFirstNameAction(e.target.value));
  };

  const handleChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setLastNameAction(e.target.value));
  };

  const handleChangeJobPosition = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setJobPositionAction(e.target.value));
  };

  const handleChangeRole = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(setRoleAction('observer'));
    } else {
      dispatch(setRoleAction('player'));
    }
  };
  const receiveTarget = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      avatarFile = file;
    }
  };

  const newUserWithAvatar = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      sendToServer(newGame ? 'game_created' : 'user_connected', {
        gameID,
        user,
        avatar: {
          name: file.name,
          data: reader.result,
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(showSpinnerAction());
    if (avatarFile !== null) {
      newUserWithAvatar(avatarFile).then(() =>
        history.push(`/lobby/${gameID}`)
      );
    } else if (avatarFile === null) {
      sendToServer(newGame ? 'game_created' : 'user_connected', {
        gameID,
        user,
      }).then(() => history.push(`/lobby/${gameID}`));
    }
  };

  return (
    <Modal show={authPopupVisible} onHide={closeAuthPopup}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Connect to lobby</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="FirstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              required
              onChange={handleChangeFirstName}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="LastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              required
              onChange={handleChangeLastName}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="JobPosition">
            <Form.Label>Job position</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your job position"
              required
              onChange={handleChangeJobPosition}
            />
            <Form.Text className="text-muted">
              Your job position will be influence on weight of your vote
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="avatar">
            <Form.Label>Add avatar picture</Form.Label>
            <Form.Control
              size="sm"
              type="file"
              accept="image/png, image/jpeg"
              onChange={receiveTarget}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="Observer">
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Connect as observer"
              onChange={handleChangeRole}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAuthPopup}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Confirm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AuthPopup;
