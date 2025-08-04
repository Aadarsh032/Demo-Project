import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from '../feature/movies/moviesSlice';

const store = configureStore({
    reducer: {
        movies: moviesReducer,
    }
})


export default store;