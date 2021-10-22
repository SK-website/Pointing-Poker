import { FC, SyntheticEvent } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  addIssueAction,
  closeIssuePopupAction,
  setIdAction,
  setLinkAction,
  setPriorityAction,
  setTitleAction,
} from '../../../redux/reducers/issues-reducer';
import { sendToServer } from '../../../socket/socket-context';
import './issue-popup.scss';

const IssuePopup: FC = () => {
  const dispatch = useAppDispatch();
  const { title, link, priority } = useAppSelector(
    (state) => state.issues.issue
  );
  const { issuePopupVisible, issue } = useAppSelector((state) => state.issues);
  const { gameID } = useAppSelector((state) => state.authPopup);

  const resetIssue = () => {
    dispatch(setTitleAction(''));
    dispatch(setLinkAction(''));
    dispatch(setPriorityAction('Low'));
    dispatch(setIdAction(''));
  };

  const setTitleAndId = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    const id = createIssueId();
    dispatch(setTitleAction(value));
    dispatch(setIdAction(id));
  };

  const createIssueId = (): string =>
    Math.round(Math.random() * 10000).toString();

  const closeIssuePopup = () => {
    dispatch(closeIssuePopupAction());
    resetIssue();
  };

  const setLink = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(setLinkAction(value));
  };
  const setPriority = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    dispatch(setPriorityAction(value));
  };

  const formSubmitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    sendToServer('issue_created', { gameID, issue });
    dispatch(closeIssuePopupAction());
    resetIssue();
  };

  return (
    <Modal
      className="issue-popup"
      show={issuePopupVisible}
      onHide={closeIssuePopup}
      size="lg"
      centered
    >
      <Form className="issue-popup__form" onSubmit={formSubmitHandler}>
        <Modal.Header className="issue-popup__header">
          <Modal.Title className="issue-popup__header-title">
            Create Issue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="issue-popup__body">
          <Form.Group as={Row} className="mb-3" controlId="IssueTitle">
            <Form.Label column sm={2}>
              Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                className="issue-input-text"
                as="textarea"
                rows={1}
                maxLength={120}
                placeholder="Issue title"
                required
                value={title}
                onChange={setTitleAndId}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="IssueLink">
            <Form.Label column sm={2}>
              Link
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                className="issue-input-text"
                as="textarea"
                rows={1}
                placeholder="Issue link"
                required
                value={link}
                onChange={setLink}
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
                value={priority}
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
          <div className="issue-popup__footer">
            <Button
              className="issue-popup__footer-button"
              variant="primary"
              type="submit"
            >
              Add issue
            </Button>
            <Button
              className="issue-popup__footer-button"
              variant="outline-primary"
              type="button"
              onClick={closeIssuePopup}
              onKeyPress={closeIssuePopup}
            >
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default IssuePopup;
