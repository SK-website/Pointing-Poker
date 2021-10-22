import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Container,
  Row,
  ToastContainer,
} from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import CardFace from '../../components/shared/cards/card-face';
import CardBreak from '../../components/shared/cards/card-break';
import GameName from '../../components/shared/game-name/game-name';
import KickPopup from '../../components/scrum/kick-popup/KickPopup';
import Member from '../../components/shared/member/member';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  addVoteAction,
  gameState,
  setChosenCard,
  setCurrentTimer,
} from '../../redux/reducers/game-reducer';
import { membersState } from '../../redux/reducers/members-reducer';
import './game.scss';
import {
  IssueStatus,
  setScoreAction,
} from '../../redux/reducers/issues-reducer';
import { sendToServer, socket } from '../../socket/socket-context';
import NewIssue from '../../components/scrum/new-issue/new-issue';
import Chat from '../../components/shared/chat/chat';
import IssueLobby from '../../components/scrum/issue-lobby/issue-lobby';

let timerId: NodeJS.Timeout;
let totalTime: number;
let isVotingFinished = false;
let willRoundStopped = false;

function Game(): JSX.Element {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { members } = useAppSelector(membersState);
  const { timerOn, timerMinutes, timerSeconds, cardChange, cardsAutoTurn } =
    useAppSelector((state) => state.gameSettings);
  const admin = members.find((member) => member.isAdmin === true);
  const playersQuantity = members.reduce(
    (acc, member) => (member.role === 'player' ? acc + 1 : acc),
    0
  );
  const { minutes, seconds } = useAppSelector(gameState).currentTimer;
  const { showRestartControls } = useAppSelector(gameState);
  totalTime = minutes * 60 + seconds;
  const { roundStatus, currentIssue, votes, averageValues, chosenCard } =
    useAppSelector(gameState);
  const { cardValuesFinalSet, scoreTypeShort, cardCover } = useAppSelector(
    (store) => store.gameSettings
  );
  const { issues } = useAppSelector((store) => store.issues);
  const { isAdmin, role, id } = useAppSelector((store) => store.authPopup.user);
  const { gameID } = useParams<{ gameID: string }>();
  const [showAlert, setShowAlert] = useState(false);
  const thisMemberId = id;
  isVotingFinished = cardsAutoTurn && votes.length === playersQuantity;

  useEffect(() => {
    setShowAlert(true);
    socket.on('GAME_STOPPED', () => {
      history.push(`/result/${gameID}`);
    });
  }, [gameID, history]);

  const stopRound = () => {
    clearInterval(timerId);
    sendToServer('stop_round', { gameID });
  };

  const decreaseTime = (time: number): number[] => {
    const decreasedTime = time - 1;
    const sec = decreasedTime % 60;
    const min = (decreasedTime - sec) / 60;
    return [min, sec];
  };

  const startTimer = (): void => {
    if (timerOn) {
      timerId = setInterval(() => {
        if (totalTime === 0) {
          stopRound();
        } else {
          const [min, sec] = decreaseTime(totalTime);
          sendToServer('set_current_timer', {
            gameID,
            currentTimer: { minutes: min, seconds: sec },
          });
        }
      }, 1000);
    }
  };

  const startRound = (): void => {
    if (roundStatus === 'awaiting' && currentIssue.id !== '') {
      dispatch(addVoteAction({ votes: [] }));
      sendToServer('start_round', { gameID });
      startTimer();
      willRoundStopped = true;
    }
  };

  const restartRound = (): void => {
    setChosenCard('');
    sendToServer('restart_round', { gameID });
    dispatch(addVoteAction({ votes: [] }));
    dispatch(
      setCurrentTimer({
        minutes: Number(timerMinutes),
        seconds: Number(timerSeconds),
      })
    );
    startTimer();
    willRoundStopped = true;
  };

  const finishRound = () => {
    sendToServer('finish_round', { gameID });
  };

  const stopGame = (): void => {
    if (roundStatus === 'in progress') {
      stopRound();
    }
    sendToServer('stop_game', { gameID });
    sendToServer('issues_updated', { gameID, issuesUpdated: issues });
  };

  const cardClickHandler = (cardValue: string): void => {
    dispatch(setChosenCard(cardValue));
    if (roundStatus === 'in progress') {
      sendToServer('set_vote', {
        gameID,
        memberId: thisMemberId,
        value: cardValue,
        voteResult: `${cardValue} ${scoreTypeShort}`,
      });
    }
    if (cardChange && showRestartControls) {
      sendToServer('change_vote', {
        gameID,
        memberId: thisMemberId,
        value: cardValue,
        voteResult: `${cardValue} ${scoreTypeShort}`,
      });
    }
  };

  const issueClickHandler = (
    issueId: number | string,
    status: IssueStatus
  ): void => {
    if (
      roundStatus === 'awaiting' &&
      status === 'awaiting' &&
      isAdmin &&
      !showRestartControls
    ) {
      const newCurrentIssue = issues.find((issue) => issue.id === issueId);
      sendToServer('set_current_issue', {
        gameID,
        currentIssue: { ...newCurrentIssue, status: 'current' },
      });
    }
  };

  const leaveGame = () => {
    if (isAdmin) {
      sendToServer('game_canceled_admin', { gameID });
    } else {
      sendToServer('game_canceled', { gameID, memberId: thisMemberId });
    }
  };

  if (isVotingFinished && willRoundStopped && isAdmin) {
    willRoundStopped = false;
    stopRound();
  }

  return (
    <Container>
      <Row className="mt-5">
        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          className="game-alert"
        >
          <Alert.Heading>Welcome to the game #{gameID}!</Alert.Heading>
          <p>Let&apos;s play!</p>
        </Alert>
        <GameName />
      </Row>
      <Row className="mb-5">
        <Col xl={8}>
          <Container>
            <Row className="mb-5">
              <Col>
                {admin && (
                  <>
                    <h3>Scrum master</h3>
                    <Member
                      id={admin.id}
                      firstName={admin.firstName}
                      lastName={admin.lastName}
                      jobPosition={admin.jobPosition}
                      avatar={admin.avatar}
                      isGame={false}
                      isAdmin={admin.isAdmin}
                      role={admin.role}
                    />
                  </>
                )}
              </Col>
              <Col>
                {timerOn && (
                  <div className="game__timer">
                    <div className="game__timer-minutes">{minutes}</div>
                    <div className="game__timer-dividor">:</div>
                    <div className="game__timer-minutes">
                      {seconds > 9 ? seconds : `0${seconds}`}
                    </div>
                  </div>
                )}
              </Col>
              <Col>
                {isAdmin && (
                  <>
                    <h3>Controls</h3>
                    {roundStatus === 'awaiting' && !showRestartControls && (
                      <Button
                        variant="success"
                        className="m-1"
                        onClick={() => startRound()}
                      >
                        Start&nbsp;round
                      </Button>
                    )}
                    {roundStatus === 'in progress' && (
                      <Button
                        variant="primary"
                        className="m-1"
                        onClick={() => stopRound()}
                      >
                        Stop&nbsp;round
                      </Button>
                    )}
                    {showRestartControls && (
                      <Button
                        variant="success"
                        className="m-1"
                        onClick={() => restartRound()}
                      >
                        Restart&nbsp;round
                      </Button>
                    )}
                    {showRestartControls && (
                      <Button
                        variant="primary"
                        className="m-1"
                        onClick={() => finishRound()}
                      >
                        next&nbsp;Round
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      className="m-1"
                      onClick={() => stopGame()}
                    >
                      Finish&nbsp;game
                    </Button>
                  </>
                )}
                <Chat size={undefined} />
                <Button
                  variant="outline-danger"
                  className="m-1"
                  onClick={() => leaveGame()}
                >
                  Cancel game
                </Button>
              </Col>
            </Row>
            <Row className="mb-5">
              <Col>
                <h3>Issues</h3>
                <ToastContainer>
                  {issues.map((issue) => (
                    <IssueLobby
                      key={issue.id}
                      id={issue.id}
                      mode="game"
                      title={issue.title}
                      link={issue.link}
                      status={issue.status}
                      priority={issue.priority}
                      issueClickHandler={issueClickHandler}
                      score={issue.score}
                    />
                  ))}
                </ToastContainer>
                {isAdmin && <NewIssue />}
              </Col>
              <Col>
                <h3>
                  {isAdmin &&
                    !showRestartControls &&
                    roundStatus === 'awaiting' &&
                    currentIssue.title === '' &&
                    'Select the current Issue'}
                  {isAdmin &&
                    !showRestartControls &&
                    roundStatus === 'awaiting' &&
                    currentIssue.title !== '' &&
                    'Press start round'}
                  {!isAdmin &&
                    !showRestartControls &&
                    roundStatus === 'awaiting' &&
                    'Round is prepearing'}
                  {showRestartControls && 'Statistics'}
                  {roundStatus === 'in progress' && 'Make a choice'}
                </h3>
                {roundStatus === 'awaiting' ? (
                  <Row>
                    {averageValues.map((item) => (
                      <Col key={item.value}>
                        <CardFace value={item.value} type={scoreTypeShort} />
                        {item.percents} %
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Row>
                    {votes.map((vote) => (
                      <Col key={vote.memberId}>
                        <div
                          className="card-cover"
                          style={{ backgroundColor: `${cardCover}` }}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            </Row>
          </Container>
        </Col>
        <Col xl={4}>
          <Container>
            <h3>Players</h3>
            {members.map((member) => (
              <Row key={member.id}>
                <Col>
                  <Member
                    id={member.id}
                    firstName={member.firstName}
                    lastName={member.lastName}
                    jobPosition={member.jobPosition}
                    avatar={member.avatar}
                    isGame
                    isAdmin={member.isAdmin}
                    voteResult={member.voteResult}
                    role={member.role}
                    roundStatus={roundStatus}
                  />
                </Col>
              </Row>
            ))}
          </Container>
        </Col>
      </Row>
      <Row className="mb-5">
        {role === 'player' &&
          cardValuesFinalSet.map((cardValue) => (
            <Col key={cardValue} className="d-flex justify-content-center">
              <div
                role="button"
                tabIndex={0}
                onClick={() => cardClickHandler(cardValue)}
                onKeyPress={() => cardClickHandler(cardValue)}
              >
                {cardValue === 'Break' ? (
                  <div
                    className={
                      chosenCard === cardValue
                        ? 'game__card_chosen'
                        : 'game__card'
                    }
                  >
                    <CardBreak key="cardBreack" />
                  </div>
                ) : (
                  <div
                    className={
                      chosenCard === cardValue
                        ? 'game__card_chosen'
                        : 'game__card'
                    }
                  >
                    <CardFace value={cardValue} type={scoreTypeShort} />
                  </div>
                )}
              </div>
            </Col>
          ))}
      </Row>
      <KickPopup />
    </Container>
  );
}

export default Game;
