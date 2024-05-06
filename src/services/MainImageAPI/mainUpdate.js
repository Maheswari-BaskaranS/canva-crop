import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import callFetch from 'src/utils/fetch';
import {API_URL} from "src/utils/constant";

export const fetchupdateWorkflow = createAsyncThunk('workflowupdate/fetchupdateWorkflow', async (params) => {
   const option = {
    method: 'PUT',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
      'authorization': localStorage.getItem('token_key')
    },
}
    const url = `${API_URL+'api/v1/automation/automation/'}${params.id}`;
    const response = await callFetch(url,option);
    const value = await response;
    return value;
});

const SliceupdateWorkflow = createSlice({
  name: 'workflowupdate',
  initialState: {
    workflowput: [],
    loading: false,
    nextPage: 1,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchupdateWorkflow.pending, state => {
      state.loading = true;
    });
    builder.addCase(fetchupdateWorkflow.fulfilled, (state, action) => {
      state.workflowput = action.payload.data;
      state.loading = false;
    });
    builder.addCase(fetchupdateWorkflow.rejected, state => {
      state.loading = false;
    });
  },
});
// export const { loginclearApi } = loginSliceUser.actions;
export default SliceupdateWorkflow.reducer;