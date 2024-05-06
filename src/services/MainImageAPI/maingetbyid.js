import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import callFetch from 'src/utils/fetch';
import {API_URL} from "src/utils/constant";

export const fetchsingleWorkflowbyid = createAsyncThunk('workflowget/fetchsingleWorkflowbyid', async (params) => {
   const option = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': localStorage.getItem('token_key')
    },
}
    const url = `${API_URL+'api/v1/automation/automation'}/${params}`;
    const response = await callFetch(url,option);
    const value = await response;
    return value;
});

const workflowgetSlice = createSlice({
  name: 'workflowget',
  initialState: {
    workflow: [],
    loading: false,
    nextPage: 1,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchsingleWorkflowbyid.pending, state => {
      state.loading = true;
    });
    builder.addCase(fetchsingleWorkflowbyid.fulfilled, (state, action) => {
      state.workflow = action.payload.data;
      state.loading = false;
    });
    builder.addCase(fetchsingleWorkflowbyid.rejected, state => {
      state.loading = false;
    });
  },
});
// export const { loginclearApi } = loginSliceUser.actions;
export default workflowgetSlice.reducer;