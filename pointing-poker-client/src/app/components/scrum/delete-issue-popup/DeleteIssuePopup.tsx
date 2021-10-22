import { FC } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { closeDeleteIssuePopupAction } from '../../../redux/reducers/delete-issue-reducer';
import './delete-issue-popup.scss';
import { sendToServer } from '../../../socket/socket-context';

const DeleteIssuePopup: FC = () => {
  const dispatch = useAppDispatch();

  const { issues } = useAppSelector((state) => state.issues);
  const { gameID } = useAppSelector((state) => state.authPopup);

  const { deleteIssuePopupVisible, idIssueToDelete } = useAppSelector(
    (state) => state.deleteIssuePopup
  );

  const closeDeleteIssuePopup = () => dispatch(closeDeleteIssuePopupAction());

  const issueToDelete = issues.find((issue) => issue.id === idIssueToDelete);

  const deleteIssueIndex = issues.findIndex(
    (issue) => issue.id === idIssueToDelete
  );

  const deleteIssue = () => {
    dispatch(closeDeleteIssuePopupAction());
    sendToServer('issue_deleted', { gameID, idIssueToDelete });
  };

  return (
    <Modal
      show={deleteIssuePopupVisible}
      onHide={closeDeleteIssuePopup}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete issue?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Do you really want to remove the issue{' '}
        <span className="issue-title-delete">{issueToDelete?.title} </span>from
        spring
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="button" onClick={deleteIssue}>
          Delete
        </Button>
        <Button variant="secondary" onClick={closeDeleteIssuePopup}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteIssuePopup;
