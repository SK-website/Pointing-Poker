import { FC, SyntheticEvent } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  // editIssue,
  setIdAction,
  setLinkAction,
  setPriorityAction,
  setTitleAction,
} from '../../../redux/reducers/issues-reducer';
import { closeEditIssuePopupAction } from '../../../redux/reducers/edit-issue-reducer';
import { sendToServer } from '../../../socket/socket-context';

const EditIssuePopup: FC = () => {
  const dispatch = useAppDispatch();

  const { gameID } = useAppSelector((state) => state.authPopup);

  const { issue, issues } = useAppSelector((state) => state.issues);
  const { editIssuePopupVisible, idIssueToEdit } = useAppSelector(
    (state) => state.editIssuePopup
  );

  const resetIssue = () => {
    dispatch(setTitleAction(''));
    dispatch(setLinkAction(''));
    dispatch(setPriorityAction('Low'));
    dispatch(setIdAction(''));
  };

  const setTitle = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(setTitleAction(value));
  };

  const setLink = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(setLinkAction(value));
  };
  const setPriority = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(setPriorityAction(value));
  };
  const closeEditIssuePopup = () => {
    resetIssue();
    dispatch(closeEditIssuePopupAction());
  };

  const formSubmitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log({ gameID, issue });
    sendToServer('issue_edited', { gameID, issue });
    // const issueInd = issues.findIndex((item) => item.id === idIssueToEdit);
    // dispatch(editIssue(issueInd));
    resetIssue();
    dispatch(closeEditIssuePopupAction());
  };

  return (
    <Modal
      className="issue-popup"
      show={editIssuePopupVisible}
      onHide={closeEditIssuePopup}
      size="lg"
      centered
    >
      <Form className="issue-popup__form" onSubmit={formSubmitHandler}>
        <Modal.Header className="issue-popup__header">
          <Modal.Title className="issue-popup__header-title">
            Edit Issue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="issue-popup__body">
          <Form.Group as={Row} className="mb-3" controlId="IssueTitle">
            <Form.Label column sm={2}>
              Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Issue title"
                value={issue.title}
                onChange={setTitle}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="IssueLink">
            <Form.Label column sm={2}>
              Link
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Issue link"
                value={issue.link}
                onChange={setLink}
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="IssuePriority">
            <Form.Label column sm={2}>
              Priority
            </Form.Label>
            <Col sm={10}>
              <Form.Select
                aria-label="Priority"
                value={issue.priority}
                onChange={setPriority}
              >
                <option value="Low">Low</option>
                <option value="Middle">Middle</option>
                <option value="Hight">Hight</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
          <Button
            variant="secondary"
            onClick={closeEditIssuePopup}
            onKeyPress={closeEditIssuePopup}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditIssuePopup;
