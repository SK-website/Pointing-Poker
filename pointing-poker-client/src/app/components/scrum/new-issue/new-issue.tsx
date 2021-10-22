import { Button } from 'react-bootstrap';
import { useAppDispatch } from '../../../redux/hooks';
import { showIssuePopupAction } from '../../../redux/reducers/issues-reducer';
import IssuePopup from '../issue-popup/Issue-popup';
import './new-issue.scss';

function NewIssue(): JSX.Element {
  const dispatch = useAppDispatch();

  const showIssuePopup = () => dispatch(showIssuePopupAction());

  return (
    <div className="d-inline-block m-1">
      <div className="d-flex justify-content-center align-items-center new-issue-container">
        <Button size="lg" onClick={showIssuePopup}>
          CREATE NEW ISSUE
        </Button>
        <IssuePopup />
      </div>
    </div>
  );
}
export default NewIssue;
