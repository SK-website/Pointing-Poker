import { Toast, Image } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { showKickPopupAction } from '../../../redux/reducers/kick-reducer';
import './member.scss';

interface MemberProps {
  id: string;
  firstName: string;
  lastName: string;
  jobPosition: string;
  avatar: string;
  isGame: boolean;
  isAdmin: boolean;
  role: 'player' | 'observer';
  roundStatus?: 'in progress' | 'awaiting';
  voteResult?: string;
  kickCounter?: number;
}

function Member({
  id,
  firstName,
  lastName,
  jobPosition,
  avatar,
  isGame,
  isAdmin,
  role,
  roundStatus,
  voteResult,
  kickCounter,
}: MemberProps): JSX.Element {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.authPopup);
  // const { kickedMembersIds } = useAppSelector((state) => state.members);
  const { membersKickedByCurrentUser } = useAppSelector(
    (state) => state.kickPopup
  );
  const avatarText = () => {
    if (lastName.length < 1) {
      return firstName.slice(0, 1);
    }
    return firstName.slice(0, 1) + lastName.slice(0, 1);
  };

  const kickedMemberByUser = () =>
    membersKickedByCurrentUser.some((item: string) => item === id);

  const showKickPopup = () => dispatch(showKickPopupAction(String(id)));
  const kickNumberResult = () => Boolean(kickCounter);

  return (
    <Toast
      onClose={showKickPopup}
      className={`d-inline-block m-1 member ${
        role === 'observer' && 'opacity-50'
      }`}
    >
      <Toast.Header
        closeButton={
          !isGame
            ? id !== user.id && !isAdmin && kickedMemberByUser() !== true
            : id !== user.id && user.isAdmin
        }
      >
        {avatar ? (
          <Image src={avatar} roundedCircle className="avatar me-2" />
        ) : (
          <div className="avatar bg-info me-2">{avatarText()}</div>
        )}
        <strong className="me-auto">
          {firstName} {lastName}
        </strong>
        {id === user.id && (
          <small className="text-danger">It&lsquo;s&nbsp;You</small>
        )}
      </Toast.Header>
      <Toast.Body className="d-flex flex-column">
        {isGame ? (
          <div className="d-flex justify-content-between w-100">
            <small className="text-warning">
              {role === 'observer' && 'Observer'}
              {user.isAdmin && role === 'player' && voteResult}
              {!user.isAdmin &&
                roundStatus === 'in progress' &&
                role === 'player' &&
                'Thinking...'}
              {!user.isAdmin &&
                roundStatus === 'awaiting' &&
                role === 'player' &&
                voteResult}
            </small>
            <small className="text-muted">{jobPosition}</small>
          </div>
        ) : (
          <small className="align-self-end text-muted">{jobPosition}</small>
        )}
        {kickNumberResult() && !isGame ? (
          <small className="vote-notification">
            {kickCounter} player(s) voted to exclude this member
          </small>
        ) : null}
      </Toast.Body>
    </Toast>
  );
}

export default Member;
