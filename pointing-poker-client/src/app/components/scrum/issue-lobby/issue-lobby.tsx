import { ChangeEvent, FC } from 'react';
import { Button, Form, Toast } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  addIssueToEditAction,
  IssueStatus,
  setScoreAction,
} from '../../../redux/reducers/issues-reducer';
import {
  saveIdIssueToDeleteAction,
  showDeleteIssuePopupAction,
} from '../../../redux/reducers/delete-issue-reducer';
import {
  saveIdIssueToEditAction,
  showEditIssuePopupAction,
} from '../../../redux/reducers/edit-issue-reducer';
import './issue-lobby.scss';

interface Props {
  id: number | string;
  title: string;
  link: string;
  status: IssueStatus;
  priority: string;
  mode: 'lobby' | 'game' | 'result';
  issueClickHandler?: (issueId: number | string, status: IssueStatus) => void;
  score: string;
}

const IssueLobby: FC<Props> = ({
  id,
  mode,
  title,
  link,
  status,
  priority,
  issueClickHandler,
  score,
}) => {
  const dispatch = useAppDispatch();
  const { issues } = useAppSelector((state) => state.issues);
  const { isAdmin } = useAppSelector((state) => state.authPopup.user);
  const currentIssue = issues.find((issue) => issue.id === id);

  const setIssueScore = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setScoreAction({ id, score: e.target.value }));
  };

  const showDeleteIssuePopup = () => {
    dispatch(showDeleteIssuePopupAction());
    dispatch(saveIdIssueToDeleteAction(id));
  };
  const showEditIssuePopup = () => {
    dispatch(showEditIssuePopupAction());
    dispatch(saveIdIssueToEditAction(id));
    if (currentIssue) dispatch(addIssueToEditAction(currentIssue));
  };

  switch (mode) {
    case 'lobby':
      return (
        <Toast
          onClose={showDeleteIssuePopup}
          key={id}
          className="d-inline-block m-1 issue"
        >
          <Toast.Header>
            <strong className="me-auto">{title}</strong>
            <small
              className="text-muted"
              role="button"
              tabIndex={Number(id)}
              onClick={showEditIssuePopup}
              onKeyPress={showEditIssuePopup}
            >
              edit
            </small>
          </Toast.Header>
          <Toast.Body className="d-flex flex-column">
            <span>
              Link:{' '}
              <a href={link} target="_blank" rel="noreferrer">
                {link.substr(0, 35)}
                {link.length > 35 && '...'}
              </a>
            </span>
            <small className="align-self-end text-muted">{priority}</small>
          </Toast.Body>
        </Toast>
      );
    case 'game':
      return (
        <Toast
          className="m-1 issue"
          bg={
            (status === 'current' && 'success') ||
            (status === 'resolved' && 'danger') ||
            undefined
          }
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">{title}</strong>
            <small className="text-muted">{status}</small>
          </Toast.Header>
          <Toast.Body
            className={`d-flex flex-column ${
              status !== 'awaiting' && 'text-white'
            }`}
          >
            <span>
              Link:{' '}
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className={
                  (status !== 'awaiting' && 'text-light') || 'text-primary'
                }
              >
                {link.substr(0, 35)}
                {link.length > 35 && '...'}
              </a>
            </span>
            <small
              className={`align-self-end text-muted ${
                status !== 'awaiting' && 'text-white-50'
              }`}
            >
              {priority}
            </small>

            {isAdmin && (
              <>
                <hr />
                <div className="d-flex justify-content-between">
                  <div>
                    {status === 'awaiting' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          issueClickHandler && issueClickHandler(id, status)
                        }
                        onKeyPress={() =>
                          issueClickHandler && issueClickHandler(id, status)
                        }
                      >
                        Play this
                      </Button>
                    )}
                  </div>

                  <div className="self-align-end">
                    SCORE:{' '}
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="score"
                      className="score-width d-inline-block"
                      onChange={setIssueScore}
                    />
                  </div>
                </div>
              </>
            )}
          </Toast.Body>
        </Toast>
      );
    case 'result':
      return (
        <Toast className="m-1 issue">
          <Toast.Header closeButton={false}>
            <strong className="me-auto">{title}</strong>
            <small className="text-muted">{status}</small>
          </Toast.Header>
          <Toast.Body className="d-flex flex-column">
            <span>
              Link:{' '}
              <a href={link} target="_blank" rel="noreferrer">
                {link.substr(0, 35)}
                {link.length > 35 && '...'}
              </a>
            </span>
            <small className="align-self-end text-muted">{priority}</small>
            <hr />
            <div className="d-flex justify-content-end">SCORE: {score}</div>
          </Toast.Body>
        </Toast>
      );

    default:
      return null;
  }
};

export default IssueLobby;
