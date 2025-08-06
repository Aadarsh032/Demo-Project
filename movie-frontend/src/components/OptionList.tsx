import React, { useEffect, useState } from 'react'
import { Flex, Heading, Select } from '@sparrowengg/twigs-react'
import { useDispatch, useSelector } from 'react-redux';
import { setMovies, setGenre, setLoading, setTotalPages, setPage } from '../feature/movies/moviesSlice';

const OptionList = () => {
    const dispatch = useDispatch();
    const [genres, setGenres] = useState([{
        label: "All",
        value: "ALL"
    }]);
    const { movies, queryString, pagination } = useSelector((state: any) => state.movies);

    const fetchGenres = async (type, pageNo) => {
        try {
            dispatch(setPage(1))
            let query_val = queryString;
            if (type == 'ALL') {
                query_val = `http://localhost:3000/movielist/elastic-search/genre?page=${pageNo}&limit=${pagination.limit}`;
            } else {
                query_val = `http://localhost:3000/movielist/elastic-search/genre?genre=${type}&page=${pageNo}&limit=${pagination.limit}`;
            }
            dispatch(setGenre(type));

            //Getting and Setting Genres
            const data = await fetch('http://localhost:3000/movielist/genre');
            const genres = await data.json();
            const arr = genres.map((item) => {
                return ({
                    label: item.genre,
                    value: item.genre
                })
            })
            arr.unshift({
                label: "ALL",
                value: "ALL"
            })
             
            setGenres(arr);

            //Fetching Movies of the Genre and Setting it 
            dispatch(setLoading(true))
            const moviesList = await fetch(query_val);
            const movieResult = await moviesList.json();
            dispatch(setMovies(movieResult.results));
            dispatch(setTotalPages(movieResult.total/ pagination.limit));
            dispatch(setLoading(false));
        } catch (error) {
            console.error('Error Fetching Genres', error)
        }
    }

    useEffect(() => {
        fetchGenres('ALL',1);
    }, [])

    return (
        <Flex justifyContent='center' size='xl' flexDirection='column' alignItems='center' css={{
            padding: '30px',
        }}>
            <Heading size="h4" css={{ marginBottom: '10px' }}> Genre</Heading>
            <Select
                css={{
                    width: '100%',
                }}
                placeholder='All'
                size="lg"
                options={genres}
                onChange={(items) => { fetchGenres(items.value,1) }}
            />
        </Flex>
    )
}

export default OptionList