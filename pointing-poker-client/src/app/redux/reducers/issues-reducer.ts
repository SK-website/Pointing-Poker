import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IssueStatus = 'current' | 'resolved' | 'awaiting' | 'next';

export interface Issue {
  id: number | string;
  title: string;
  link: string;
  priority: string;
  status: IssueStatus;
  score: string;
}

interface IssueState {
  issuePopupVisible: boolean;
  issue: Issue;
  issues: Issue[];
}

const initialState: IssueState = {
  issuePopupVisible: false,
  issue: {
    id: '',
    title: '',
    link: '',
    priority: 'low',
    status: 'awaiting',
    score: '-',
  },
  issues: [],
};

export const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    showIssuePopupAction: (state) => {
      state.issuePopupVisible = true;
    },
    closeIssuePopupAction: (state) => {
      state.issuePopupVisible = false;
    },
    setIdAction: (state, action: PayloadAction<number | string>) => {
      state.issue.id = action.payload;
    },
    setTitleAction: (state, action: PayloadAction<string>) => {
      state.issue.title = action.payload;
    },
    setLinkAction: (state, action: PayloadAction<string>) => {
      state.issue.link = action.payload;
    },
    setPriorityAction: (state, action: PayloadAction<string>) => {
      state.issue.priority = action.payload;
    },
    // setIssueStatusAction: (state, action: PayloadAction<{ id: number | string; status: IssueStatus }>) => {
    //   state.issues = state.issues.map((issue) => {
    //     if (issue.id === action.payload.id) {
    //       return { ...issue, status: action.payload.status }
    //     }
    //     if (issue.status === 'current' && action.payload.status !== 'next') {
    //       return { ...issue, status: 'awaiting' }
    //     }
    //     if (issue.status === 'next') {
    //       return { ...issue, status: 'awaiting' }
    //     }
    //     return issue;
    //   });
    // },
    addIssueAction: (state) => {
      state.issues.push(state.issue);
      state.issuePopupVisible = false;
    },
    deleteIssueAction: (state, action: PayloadAction<number>) => {
      state.issues.splice(action.payload, 1);
    },
    addIssueToEditAction: (state, action: PayloadAction<Issue>) => {
      state.issue = action.payload;
    },
    editIssue: (state, action: PayloadAction<number>) => {
      state.issues[action.payload] = state.issue;
    },
    updateIssuesAction: (state, action: PayloadAction<Issue[]>) => {
      state.issues = action.payload;
    },
    setScoreAction: (state, action) => {
      const ind = state.issues.findIndex(
        (issue) => issue.id === action.payload.id
      );
      state.issues[ind].score = action.payload.score;
    },
  },
});

export const {
  showIssuePopupAction,
  closeIssuePopupAction,
  addIssueAction,
  setTitleAction,
  setLinkAction,
  setPriorityAction,
  /* setIssueStatusAction, */ setIdAction,
  deleteIssueAction,
  addIssueToEditAction,
  editIssue,
  updateIssuesAction,
  setScoreAction,
} = issuesSlice.actions;

export default issuesSlice.reducer;
