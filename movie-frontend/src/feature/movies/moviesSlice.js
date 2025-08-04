import { createSlice } from "@reduxjs/toolkit";



const initalState ={
    movies:[],
    queryString:'',
    genre:'ALL',
    pagination:{
        page:1,
        limit:10,
        totalPages:100
    },
    isLoading:true
};

const moviesSlice = createSlice({
    name:'movies',
    initialState:initalState,
    reducers:{
        setMovies:(state, action)=>{
            state.movies = action.payload;
        },
        setQuery:(state, action)=>{
            state.queryString= action.payload;
        },
        setGenre:(state, action)=>{
            state.genre= action.payload;
        },
        setPage:(state, action)=>{
         state.pagination.page= action.payload;
        },
        setLimit:(state,action)=>{
            state.pagination.limit= action.payload;
        },
        setTotalPages :(state,action)=>{
            state.pagination.totalPages= action.payload;
        },
        setLoading:(state, action)=>{
           state.isLoading = action.payload;
        }
    }
})

export const {
  setMovies,
  setQuery,
  setGenre,
  setPage,
  setLimit,
  setLoading,
  setTotalPages
} = moviesSlice.actions;

export default moviesSlice.reducer;
