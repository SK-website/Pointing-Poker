import { ChangeEvent, FormEvent, useEffect } from 'react';
import { Button, Form, Offcanvas, Toast } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  closeChatAction,
  setCurrentMessageValueAction,
  showChatAction,
} from '../../../redux/reducers/chat-reducer';
import { sendToServer } from '../../../socket/socket-context';

interface IChatProps {
  size: 'sm' | 'lg' | undefined;
}

function Chat({ size }: IChatProps): JSX.Element {
  const dispatch = useAppDispatch();

  const { gameID, user } = useAppSelector((state) => state.authPopup);

  const { members } = useAppSelector((state) => state.members);

  const { chatVisible, currentMessageValue, chatHistory } = useAppSelector(
    (state) => state.chat
  );

  const closeChat = () => dispatch(closeChatAction());

  const scrollToBottom = () => {
    const chatBody = document.querySelector('.canvas-body-chat');
    chatBody?.scrollTo(0, 99999999);
  };

  useEffect(() => {
    if (chatVisible) {
      scrollToBottom();
    }
  }, [chatVisible, chatHistory]);

  const handleOpenChatButtonClick = () => {
    dispatch(showChatAction());
  };

  const handleInputMessage = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentMessageValueAction(e.target.value));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendToServer('chat_message', {
      gameID,
      message: {
        userId: user.id,
        message: currentMessageValue,
        time: new Date(),
      },
    });
    dispatch(setCurrentMessageValueAction(''));
    scrollToBottom();
  };

  return (
    <>
      <Button
        size={size}
        variant="warning"
        className="m-1"
        onClick={handleOpenChatButtonClick}
      >
        Open&nbsp;chat
      </Button>
      <Offcanvas show={chatVisible} onHide={closeChat} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Chat of game #{gameID}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column canvas-body-chat">
          {chatHistory.length > 0 &&
            chatHistory.map((message) => (
              <Toast
                className={`d-inline-block m-2 w-75 ${
                  message.userId === user.id && 'border-primary align-self-end'
                } `}
                bg="light"
                // eslint-disable-next-line react/no-array-index-key
                key={message.messageId}
              >
                <Toast.Header closeButton={false}>
                  <img src="" className="rounded me-2" alt="" />
                  <strong className="me-auto">
                    {
                      members.find((member) => member.id === message.userId)
                        ?.firstName
                    }{' '}
                    {
                      members.find((member) => member.id === message.userId)
                        ?.lastName
                    }
                  </strong>
                  <small>{message.time}</small>
                </Toast.Header>
                <Toast.Body>{message.message}</Toast.Body>
              </Toast>
            ))}
        </Offcanvas.Body>
        <Form onSubmit={handleSubmit} className="w-70 m-3">
          <Form.Control
            value={currentMessageValue}
            type="text"
            minLength={1}
            placeholder="Type text here"
            onChange={handleInputMessage}
          />
        </Form>
      </Offcanvas>
    </>
  );
}

export default Chat;
