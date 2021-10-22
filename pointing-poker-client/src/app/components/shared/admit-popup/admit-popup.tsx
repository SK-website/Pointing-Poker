import { Button, Modal } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { closeAdmitPopupAction } from '../../../redux/reducers/admit-reducer';
import { sendToServer } from '../../../socket/socket-context';

function AdmitPopup(): JSX.Element {
  const dispatch = useAppDispatch();
  const { admitPopupVisibility, id, firstName, lastName, jobPosition } =
    useAppSelector((state) => state.admit);
  const { gameID } = useAppSelector((state) => state.authPopup);

  const handleKick = () => {
    sendToServer('user_kicked', {
      gameID,
      user: { id },
    });
    dispatch(closeAdmitPopupAction());
  };

  const handleAdmit = () => {
    sendToServer('user_admited', {
      gameID,
    });
    dispatch(closeAdmitPopupAction());
  };

  return (
    <Modal
      centered
      show={admitPopupVisibility}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton={false}>
        <Modal.Title>User connected!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Do you want apply entering game {firstName} {lastName} ({jobPosition})?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleKick}>
          Kick!
        </Button>
        <Button variant="success" onClick={handleAdmit}>
          Admit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AdmitPopup;
