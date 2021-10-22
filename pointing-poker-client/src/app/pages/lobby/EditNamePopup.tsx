import { ChangeEvent } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  closeEditNamePopupAction,
  saveNewGameNameAction,
} from '../../redux/reducers/game-name-reducer';
import { sendToServer } from '../../socket/socket-context';

function EditName(): JSX.Element {
  const dispatch = useAppDispatch();

  const { gameID } = useAppSelector((state) => state.authPopup);

  const { editNamePopupVisible, gameName, prevGameName } = useAppSelector(
    (state) => state.gameName
  );

  const closeEditNamePopup = () => {
    dispatch(closeEditNamePopupAction());
    dispatch(saveNewGameNameAction(prevGameName));
  };

  const handelChangeNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    dispatch(saveNewGameNameAction(value));
  };

  const saveEditedGameName = () => {
    sendToServer('game_name_changed', { gameID, gameName });
    dispatch(closeEditNamePopupAction());
  };

  return (
    <>
      <Modal show={editNamePopupVisible} onHide={closeEditNamePopup} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit game name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="">
            <Form.Label>New game name</Form.Label>
            <Form.Control
              type="text"
              value={gameName}
              onChange={handelChangeNameInput}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="primary" type="button" onClick={saveEditedGameName}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={closeEditNamePopup}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditName;
