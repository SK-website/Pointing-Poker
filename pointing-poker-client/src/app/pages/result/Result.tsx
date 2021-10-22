import { Button, Table } from 'react-bootstrap';
import XLSX from 'xlsx';
import IssueLobby from '../../components/scrum/issue-lobby/issue-lobby';
import CardFace from '../../components/shared/cards/card-face';
import GameName from '../../components/shared/game-name/game-name';
import { useAppSelector } from '../../redux/hooks';
import { gameState } from '../../redux/reducers/game-reducer';
import './result.scss';

const Result = (): JSX.Element => {
  const { statistics } = useAppSelector(gameState);
  const { issues } = useAppSelector((state) => state.issues);
  const { scoreTypeShort } = useAppSelector((store) => store.gameSettings);
  const { gameID } = useAppSelector((state) => state.authPopup);

  const downloadResults = () => {
    const table = document.getElementById('resultTable');
    const workBook = XLSX.utils.table_to_book(table);
    return XLSX.writeFile(workBook, `results-${gameID}.xlsx`);
  };

  return (
    <div className="container">
      <GameName />
      <div className="result">
        {statistics.map((round) => {
          const issue = issues.find((element) => element.id === round.issue.id);
          if (issue) {
            return (
              <div key={issue.id}>
                <IssueLobby
                  mode="result"
                  id={issue.id}
                  title={issue.title}
                  link={issue.link}
                  status={issue.status}
                  priority={issue.priority}
                  score={issue.score}
                />
                <div className="result__cards">
                  {round.averageValues.map((averageValue) => (
                    <div className="result__card" key={averageValue.value}>
                      <CardFace
                        value={averageValue.value}
                        type={scoreTypeShort}
                      />
                      <div className="result__votes">
                        {averageValue.percents}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
        <hr />
      </div>
      <Button variant="primary" className="mt-5" onClick={downloadResults}>
        Download results
      </Button>
      <Table className="invisible" id="resultTable">
        <thead>
          <tr>
            <th>ISSUE TITLE</th>
            <th>ISSUE LINK</th>
            <th>SCORE</th>
            <th>TYPE OF SCORE</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id}>
              <td>{issue.title}</td>
              <td>{issue.link}</td>
              <td>{issue.score}</td>
              <td>{scoreTypeShort}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Result;
