import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '@/api/cms';
import { asList } from '../helpers';

export const fetchCmsWorks = createAsyncThunk('cms/works', () => api.getCmsWorks());
export const addCmsWork = createAsyncThunk('cms/addWork', (body) => api.addCmsWork(body));
export const updateCmsWork = createAsyncThunk('cms/updateWork', ({ id, body }) => api.updateCmsWork(id, body));
export const deleteCmsWork = createAsyncThunk('cms/deleteWork', (id) => api.deleteCmsWork(id));

export const fetchCmsBloggers = createAsyncThunk('cms/bloggers', () => api.getCmsBloggers());
export const addCmsBlogger = createAsyncThunk('cms/addBlogger', (body) => api.addCmsBlogger(body));
export const updateCmsBlogger = createAsyncThunk('cms/updateBlogger', ({ id, body }) => api.updateCmsBlogger(id, body));
export const deleteCmsBlogger = createAsyncThunk('cms/deleteBlogger', (id) => api.deleteCmsBlogger(id));

export const fetchCmsDigital = createAsyncThunk('cms/digital', () => api.getCmsDigital());
export const addCmsDigital = createAsyncThunk('cms/addDigital', (body) => api.addCmsDigital(body));
export const updateCmsDigital = createAsyncThunk('cms/updateDigital', ({ id, body }) => api.updateCmsDigital(id, body));
export const deleteCmsDigital = createAsyncThunk('cms/deleteDigital', (id) => api.deleteCmsDigital(id));

export const fetchCmsPhoto = createAsyncThunk('cms/photo', () => api.getCmsPhoto());
export const addCmsPhoto = createAsyncThunk('cms/addPhoto', (body) => api.addCmsPhoto(body));
export const updateCmsPhoto = createAsyncThunk('cms/updatePhoto', ({ id, body }) => api.updateCmsPhoto(id, body));
export const deleteCmsPhoto = createAsyncThunk('cms/deletePhoto', (id) => api.deleteCmsPhoto(id));

const cmsSlice = createSlice({
  name: 'cms',
  initialState: { works: [], bloggers: [], digital: [], photo: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCmsWorks.fulfilled, (state, action) => { state.works = asList(action.payload); })
      .addCase(fetchCmsBloggers.fulfilled, (state, action) => { state.bloggers = asList(action.payload); })
      .addCase(fetchCmsDigital.fulfilled, (state, action) => { state.digital = asList(action.payload); })
      .addCase(fetchCmsPhoto.fulfilled, (state, action) => { state.photo = asList(action.payload); });
  },
});

export default cmsSlice.reducer;
