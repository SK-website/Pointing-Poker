import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  jobPosition: string;
  isAdmin: boolean;
  role: 'observer' | 'player';
  avatar: string;
  kickCounter?: number;
  voteResult: string;
}

interface MembersState {
  members: Member[];
  kickedMembersIds: string[];
}

const initialState: MembersState = {
  members: [],
  kickedMembersIds: [],
};

export const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    getMembersAction: (state, action) => {
      // get members from server
      state.members = action.payload;
    },
    setMembersAction: (state, action) => {
      state.members = action.payload.members;
      if (action.payload.id) state.kickedMembersIds.push(action.payload.id);
    },
    kickMemberAction: (state, action) => {
      state.members = state.members.filter(
        (member) => member.id !== action.payload.id
      );
    },
  },
});

export const { getMembersAction, kickMemberAction, setMembersAction } =
  membersSlice.actions;

export const membersState = (state: RootState): MembersState => state.members;

export default membersSlice.reducer;
