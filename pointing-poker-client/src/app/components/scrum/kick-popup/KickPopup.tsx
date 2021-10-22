import { FC } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  addKickedByUserMemberIdAction,
  closeKickPopupAction,
} from '../../../redux/reducers/kick-reducer';
import { sendToServer } from '../../../socket/socket-context';
import './kickPopup.scss';

const KickPopup: FC = () => {
  const dispatch = useAppDispatch();
  const { gameID } = useAppSelector((state) => state.authPopup);
  const { members } = useAppSelector((state) => state.members);
  const { user } = useAppSelector((state) => state.authPopup);

  const { kickPopupVisible, kickedMemberId } = useAppSelector(
    (state) => state.kickPopup
  );

  const kickedMember = members.find((member) => member.id === kickedMemberId);

  const closeKickPopup = () => {
    dispatch(closeKickPopupAction());
  };

  const handelKickMemberClick = () => {
    if (user.isAdmin) {
      sendToServer('user_kicked', { gameID, user: { id: kickedMemberId } });
      dispatch(closeKickPopupAction());
    } else
      sendToServer('increment_user_kicked_counter', {
        gameID,
        user: { id: kickedMemberId },
      });
    dispatch(closeKickPopupAction());
    dispatch(addKickedByUserMemberIdAction(kickedMemberId));
  };

  return (
    <Modal
      className="kick-popup"
      show={kickPopupVisible}
      onHide={closeKickPopup}
      aria-labelledby="kick-popup"
      size="lg"
      centered
    >
      <Modal.Header className="kick-popup__header">
        <Modal.Title className="kick-popup__header-title">
          Kick player?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="kick-popup__body">
        {`Do you really want to remove player ${kickedMember?.firstName} 
        ${kickedMember?.lastName} from game session?`}
      </Modal.Body>
      <Modal.Footer>
        <div className="kick-popup__footer">
          <Button
            className="kick-popup__footer-button"
            variant="primary"
            onClick={handelKickMemberClick}
            onKeyPress={handelKickMemberClick}
          >
            Yes
          </Button>
          <Button
            className="kick-popup__footer-button"
            variant="outline-primary"
            onClick={closeKickPopup}
            onKeyPress={closeKickPopup}
          >
            No
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default KickPopup;
