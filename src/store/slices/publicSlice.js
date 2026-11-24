import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '@/api/public';
import { mediaSrc } from '@/api/client';
import { asList } from '../helpers';

export const fetchPublicSiteContent = createAsyncThunk('public/site', async () => {
  const [works, bloggers, digital, photo] = await Promise.all([
    api.getPublicWorks(),
    api.getPublicBloggers(),
    api.getPublicDigital(),
    api.getPublicPhoto(),
  ]);
  return { works, bloggers, digital, photo };
});

export const createPublicOrder = createAsyncThunk('public/createOrder', (body) => api.createPublicOrder(body));

const publicSlice = createSlice({
  name: 'publicContent',
  initialState: {
    works: [],
    siteCreators: [],
    digitalCatalog: [],
    photoPackages: [],
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPublicSiteContent.fulfilled, (state, action) => {
      state.works = asList(action.payload.works).map((item) => ({
        ...item,
        src: mediaSrc(item.videoUrl),
        image: mediaSrc(item.imageUrl),
        className: item.cssClass,
      }));
      state.siteCreators = asList(action.payload.bloggers).map((item) => ({
        ...item,
        name: item.fullName,
        image: mediaSrc(item.imageUrl),
        sampleVideo: mediaSrc(item.sampleVideoUrl),
        className: 'creator-1',
      }));
      state.digitalCatalog = asList(action.payload.digital).map((item) => ({
        ...item,
        icon: item.iconKey,
      }));
      state.photoPackages = asList(action.payload.photo).map((item) => ({
        ...item,
        image: mediaSrc(item.imageUrl),
      }));
    });
  },
});

export default publicSlice.reducer;
