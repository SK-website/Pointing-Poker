import { Badge } from 'react-bootstrap';
import EditName from '../../../pages/lobby/EditNamePopup';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  savePrevGameNameAction,
  showEditNamePopupAction,
} from '../../../redux/reducers/game-name-reducer';
import './game-name.scss';

function GameName(): JSX.Element {
  const dispatch = useAppDispatch();

  const { gameName } = useAppSelector((state) => state.gameName);
  const { isAdmin } = useAppSelector((state) => state.authPopup.user);
  const { gameID } = useAppSelector((state) => state.authPopup);

  const showEditNamePopup = () => {
    dispatch(showEditNamePopupAction());
    dispatch(savePrevGameNameAction());
  };

  return (
    <div className="game-name-wrap">
      <h1 className="game-name-title">
        {gameName} <Badge bg="secondary">#{gameID}</Badge>
      </h1>

      {isAdmin && (
        <div
          className="edit-game-name"
          role="button"
          tabIndex={0}
          onKeyPress={showEditNamePopup}
          onClick={showEditNamePopup}
        />
      )}
      <EditName />
    </div>
  );
}

export default GameName;
