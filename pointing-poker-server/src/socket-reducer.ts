import { Socket } from 'socket.io';
import { io } from './server';
import {
  addIssue,
  addUser,
  avatarUpload,
  changeGameName,
  changeSettings,
  createState,
  deleteIssue,
  editIssue,
  restartRound,
  resetGame,
  getState,
  kickUser,
  removeSTate,
  setCurrentIssue,
  setCurrentTimer,
  setMessages,
  stopRound,
  setVote,
  startRound,
  updateIssues,
  changeVote,
  incrementKickCounter,
  changeCurrentPage,
} from './mongo';

export async function handleAction(
  socket: Socket,
  action: { type: string; payload: any },
  collection: unknown,
) {
  const gameID = action.payload.gameID.toString();

  /*=====================================================================*/
  /*                               MEMBERS                               */
  /*=====================================================================*/

  if (action.type === 'game_created') {
    socket.join(gameID);
    let newStateFromDb = await createState(collection, gameID, [action.payload.user]);
    if (
      newStateFromDb.users[0].id === action.payload.user.id &&
      action.payload.avatar
    ) {
      newStateFromDb = await avatarUpload(
        collection,
        gameID,
        action.payload.user.id,
        action.payload.avatar.name,
        action.payload.avatar.data
      );
    }
    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });
  }

  if (action.type === 'user_connected') {
    const gameState = await getState(collection, gameID);

    if (!gameState) {
      io.to(socket.id).emit('leave_room');
      io.to(socket.id).emit('UPDATE_CLIENT', {
        type: 'authPopup/showAlertAction',
      });
    } else {
      socket.join(gameID);

      let newStateFromDb = await addUser(collection, gameID, action.payload.user);
      const newUser = newStateFromDb.users.map(
        (user) => user.id === action.payload.user.id
      );
      if (newUser && action.payload.avatar) {
        newStateFromDb = await avatarUpload(
          collection,
          gameID,
          action.payload.user.id,
          action.payload.avatar.name,
          action.payload.avatar.data
        );
      }

      if (
        gameState.currentPage !== 'lobby' &&
        !gameState.gameSettings.allowEnterInGame
      ) {
        const adminID = gameState.users.find(
          (user) => user.isAdmin === true
        ).id;

        io.to(adminID).emit('UPDATE_CLIENT', {
          type: 'admit/showAdmitPopupAction',
          payload: {
            id: action.payload.user.id,
            firstName: action.payload.user.firstName,
            lastName: action.payload.user.lastName,
            jobPosition: action.payload.user.jobPosition,
          },
        });

        if (gameState.currentPage === 'game') {
          io.to(socket.id).emit('GAME_STARTED');
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'chat/setMessagesAction',
            payload: {
              chatHistory: newStateFromDb.chatHistory,
            },
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'gameSettings/setGameSettings',
            payload: newStateFromDb.gameSettings,
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'issues/updateIssuesAction',
            payload: newStateFromDb.issues,
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'game/setGameAction',
            payload: newStateFromDb.game,
          });
        }
        if (gameState.currentPage === 'result') {
          io.to(socket.id).emit('GAME_STOPPED');
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'chat/setMessagesAction',
            payload: {
              chatHistory: newStateFromDb.chatHistory,
            },
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'gameSettings/setGameSettings',
            payload: newStateFromDb.gameSettings,
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'issues/updateIssuesAction',
            payload: newStateFromDb.issues,
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'game/setGameAction',
            payload: newStateFromDb.game,
          });
        }
      } else {
        io.to(gameID).emit('UPDATE_CLIENT', {
          type: 'members/setMembersAction',
          payload: {
            members: newStateFromDb.users,
          },
        });
        if (gameState.currentPage === 'game') {
          io.to(socket.id).emit('GAME_STARTED');
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'chat/setMessagesAction',
            payload: {
              chatHistory: newStateFromDb.chatHistory,
            },
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'gameSettings/setGameSettings',
            payload: newStateFromDb.gameSettings,
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'issues/updateIssuesAction',
            payload: newStateFromDb.issues,
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'game/setGameAction',
            payload: newStateFromDb.game,
          });
        }
        if (gameState.currentPage === 'result') {
          io.to(socket.id).emit('GAME_STOPPED');
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'chat/setMessagesAction',
            payload: {
              chatHistory: newStateFromDb.chatHistory,
            },
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'gameSettings/setGameSettings',
            payload: newStateFromDb.gameSettings,
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'issues/updateIssuesAction',
            payload: newStateFromDb.issues,
          });
          io.to(socket.id).emit('UPDATE_CLIENT', {
            type: 'game/setGameAction',
            payload: newStateFromDb.game,
          });
        }
      }
    }
  }

  if (action.type === 'user_admited') {
    const newStateFromDb = await getState(collection, gameID);
    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });
  }

  if (action.type === 'user_kicked') {
    const newStateFromDb = await kickUser(collection, gameID, action.payload.user.id);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });
    io.to(action.payload.user.id).emit('leave_room');
    io.to(action.payload.user.id).socketsLeave(gameID);
    io.to(action.payload.user.id).emit('UPDATE_CLIENT', {
      type: 'authPopup/showAlertKickedAction',
    });
  }

  if (action.type === 'increment_user_kicked_counter') {
    const newStateFromDb = await incrementKickCounter(
      collection,
      gameID,
      action.payload.user.id
    );
    const userIsKicked = newStateFromDb.users.some(
      (item) => item.id === action.payload.user.id
    );

    if (!userIsKicked) {
      io.to(action.payload.user.id).emit('leave_room');
      io.to(action.payload.user.id).socketsLeave(gameID);
    }
    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
        id: action.payload.user.id,
      },
    });
  }

  /*=====================================================================*/
  /*                               GAME NAME                             */
  /*=====================================================================*/

  if (action.type === 'game_name_changed') {
    const newStateFromDb = await changeGameName(
      collection,
      gameID,
      action.payload.gameName
    );

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'gameName/saveNewGameNameAction',
      payload: newStateFromDb.gameName,
    });
  }

  /*=====================================================================*/
  /*                                 ISSUES                              */
  /*=====================================================================*/

  if (action.type === 'issue_created') {
    const newStateFromDb = await addIssue(collection, gameID, action.payload.issue);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'issues/updateIssuesAction',
      payload: newStateFromDb.issues,
    });
  }

  if (action.type === 'issue_deleted') {
    const newStateFromDb = await deleteIssue(
      collection,
      gameID,
      action.payload.idIssueToDelete
    );

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'issues/updateIssuesAction',
      payload: newStateFromDb.issues,
    });
  }

  if (action.type === 'issue_edited') {
    const newStateFromDb = await editIssue(collection, gameID, action.payload.issue);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'issues/updateIssuesAction',
      payload: newStateFromDb.issues,
    });
  }

  if (action.type === 'issues_updated') {
    const newStateFromDb = await updateIssues(
      collection,
      gameID,
      action.payload.issuesUpdated
    );

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'issues/updateIssuesAction',
      payload: newStateFromDb.issues,
    });
  }

  /*=====================================================================*/
  /*                                SETTINGS                             */
  /*=====================================================================*/

  if (action.type === 'settings_changed') {
    const newStateFromDb = await changeSettings(
      collection,
      gameID,
      action.payload.gameSettings
    );

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'gameSettings/setGameSettings',
      payload: newStateFromDb.gameSettings,
    });

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/setCurrentTimer',
      payload: newStateFromDb.game.currentTimer,
    });
  }

  /*=====================================================================*/
  /*                              START GAME                             */
  /*=====================================================================*/

  if (action.type === 'game_started') {
    io.to(gameID).emit('GAME_STARTED');
    changeCurrentPage(collection, gameID, 'game');
  }

  /*=====================================================================*/
  /*                             CANCEL GAME                             */
  /*=====================================================================*/

  if (action.type === 'game_canceled_admin') {
    io.to(gameID).emit('leave_room');

    removeSTate(collection, gameID);

    io.to(gameID).socketsLeave(gameID);
  }

  if (action.type === 'game_canceled') {
    io.to(socket.id).emit('leave_room');

    const newStateFromDb = await kickUser(collection, gameID, action.payload.memberId);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });

    io.to(socket.id).socketsLeave(gameID);
  }

  /*=====================================================================*/
  /*                                  GAME                               */
  /*=====================================================================*/

  if (action.type === 'get_current_timer') {
    const newStateFromDb = await getState(collection, gameID);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/setCurrentTimer',
      payload: newStateFromDb.game.currentTimer,
    });
  }

  if (action.type === 'set_current_timer') {
    const newStateFromDb = await setCurrentTimer(
      collection,
      gameID,
      action.payload.currentTimer
    );

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/setCurrentTimer',
      payload: newStateFromDb.game.currentTimer,
    });
  }

  if (action.type === 'start_round') {
    const newStateFromDb = await startRound(collection, gameID);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });

    const payloadToClient = {
      roundStatus: newStateFromDb.game.roundStatus,
      votes: newStateFromDb.game.votes,
      averageValues: newStateFromDb.game.averageValues,
    };

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/startRoundAction',
      payload: payloadToClient,
    });
  }

  if (action.type === 'restart_round') {
    const newStateFromDb = await restartRound(collection, gameID);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'issues/updateIssuesAction',
      payload: newStateFromDb.issues,
    });

    const payloadToClient = {
      currentIssue: newStateFromDb.game.currentIssue,
      roundStatus: newStateFromDb.game.roundStatus,
      votes: newStateFromDb.game.votes,
      averageValues: newStateFromDb.game.averageValues,
      statistics: newStateFromDb.game.statistics,
      showRestartControls: newStateFromDb.game.showRestartControls,
      currentTimer: newStateFromDb.game.currentTimer,
    };

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/startRoundAction',
      payload: payloadToClient,
    });
  }

  if (action.type === 'finish_round') {
    const newStateFromDb = await resetGame(collection, gameID);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });

    const payloadToClient = {
      roundStatus: newStateFromDb.game.roundStatus,
      currentIssue: newStateFromDb.game.currentIssue,
      showRestartControls: newStateFromDb.game.showRestartControls,
      currentTimer: newStateFromDb.game.currentTimer,
    };
    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/finishRoundAction',
      payload: payloadToClient,
    });
    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/setChosenCard',
      payload: '',
    });
  }

  if (action.type === 'set_current_issue') {
    const newStateFromDb = await setCurrentIssue(
      collection,
      gameID,
      action.payload.currentIssue
    );

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'issues/updateIssuesAction',
      payload: newStateFromDb.issues,
    });

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/setCurrentIssueAction',
      payload: newStateFromDb.game.currentIssue,
    });
  }

  if (action.type === 'stop_round') {
    const newStateFromDb = await stopRound(collection, gameID);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'issues/updateIssuesAction',
      payload: newStateFromDb.issues,
    });

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/stopRoundAction',
      payload: newStateFromDb.game,
    });
  }

  if (action.type === 'set_vote') {
    const newStateFromDb = await setVote(
      collection,
      gameID,
      action.payload.memberId,
      action.payload.value,
      action.payload.voteResult
    );

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/addVoteAction',
      payload: newStateFromDb.game.votes,
    });

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });
  }

  if (action.type === 'change_vote') {
    const newStateFromDb = await changeVote(
      collection,
      gameID,
      action.payload.memberId,
      action.payload.value,
      action.payload.voteResult
    );

    const payloadToClient = {
      votes: newStateFromDb.game.votes,
      averageValues: newStateFromDb.game.averageValues,
      statistics: newStateFromDb.game.statistics,
    };

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'game/changeVoteAction',
      payload: payloadToClient,
    });

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'members/setMembersAction',
      payload: {
        members: newStateFromDb.users,
      },
    });
  }

  if (action.type === 'stop_game') {
    io.to(gameID).emit('GAME_STOPPED');
    changeCurrentPage(collection, gameID, 'result');
  }

  /*=====================================================================*/
  /*                                  CHAT                               */
  /*=====================================================================*/

  if (action.type === 'chat_message') {
    const newStateFromDb = await setMessages(collection, gameID, action.payload.message);

    io.to(gameID).emit('UPDATE_CLIENT', {
      type: 'chat/setMessagesAction',
      payload: {
        chatHistory: newStateFromDb.chatHistory,
      },
    });
  }
  // ADD YOUR REDUCER:
}
