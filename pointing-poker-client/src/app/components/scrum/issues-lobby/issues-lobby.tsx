import { ChangeEvent, FC } from 'react';
import XLSX from 'xlsx';
import { Button, Form } from 'react-bootstrap';
import { useAppSelector } from '../../../redux/hooks';
import { Issue } from '../../../redux/reducers/game-reducer';
import { sendToServer } from '../../../socket/socket-context';
import DeleteIssuePopup from '../delete-issue-popup/DeleteIssuePopup';
import EditIssuePopup from '../edit-issue-popup/EditIssuePopup';
import IssueLobby from '../issue-lobby/issue-lobby';
import NewIssue from '../new-issue/new-issue';
import './issues-lobby.scss';

const IssuesLobby: FC = () => {
  interface IssueData {
    id?: string;
    title: string;
    link: string;
    priority: string;
    status?: string;
  }
  const { issues } = useAppSelector((state) => state.issues);

  const { gameID } = useAppSelector((state) => state.authPopup);

  const createIssueId = (): string =>
    Math.round(Math.random() * 10000).toString();

  const readFileContent = async (file: any): Promise<IssueData[]> => {
    const response: IssueData[] = await new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        if (e.target != null) {
          const bufferArray = e.target.result;
          const workBook = XLSX.read(bufferArray, { type: 'buffer' });
          const workBookName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[workBookName];
          const data: IssueData[] = XLSX.utils.sheet_to_json(workSheet);
          resolve(data);
        }
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    return response;
  };
  const data = [
    {
      title: 'Add new feature to the prolect A',
      link: 'https://hsbi.hse.ru/articles/ficha-chto-eto-znachit/',
    },
  ];

  const downloadSampleFile = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Issues');
    return XLSX.writeFile(wb, `issues.xlsx`);
  };

  const handleInputFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      const issuesData = await readFileContent(file);
      const issuesUpdated = issuesData.map((issue) => {
        issue.id = createIssueId();
        issue.status = 'awaiting';
        issue.priority = 'low';
        return issue;
      }) as Issue[];
      sendToServer('issues_updated', { gameID, issuesUpdated });
    }
    e.target.files = null;
  };

  return (
    <section className="section-wrap">
      <h3 className="section-title">Issues:</h3>
      <h5 className="settings-label add-issue-title">
        Add issues one by one manually:
      </h5>
      {issues.map((issue) => (
        <IssueLobby
          key={issue.id}
          id={issue.id}
          mode="lobby"
          title={issue.title}
          link={issue.link}
          status={issue.status}
          priority={issue.priority}
          score={issue.score}
        />
      ))}
      <NewIssue />
      <div className="mt-4">
        <h5 className="settings-label add-issue-title mt-2">
          Or add multiple issues from file:
        </h5>
        <div className="add-file-block-wrap">
          <div className="step-block">
            <p>
              <span className="step">Step 1:</span> Download a file format
              sample
            </p>
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={downloadSampleFile}
            >
              Download
            </Button>
          </div>
          <div className="step-block">
            <p>
              <span className="step">Step 2:</span>Upload file with issues from
              you desktop
            </p>
            <Form.Control
              size="sm"
              type="file"
              accept="xlsx"
              onChange={handleInputFileChange}
              placeholder="Choose file"
            />
          </div>
        </div>
      </div>
      <DeleteIssuePopup />
      <EditIssuePopup />
    </section>
  );
};

export default IssuesLobby;
