import { SearchIcon } from '@sparrowengg/twigs-react-icons'

import { Box, Input, Flex, Button } from '@sparrowengg/twigs-react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setMovies, setGenre, setTotalPages} from '../feature/movies/moviesSlice';
const Navbar = () => {
    const dispatch = useDispatch();
    const { queryString, pagination } = useSelector((state) => state.movies);


    const [searchWord, setSearchWord] = useState('');


    async function fetchMoviesByText() {
        dispatch(setLoading(true))
        console.log(searchWord);
        let searchFor = searchWord.replace(' ', '_').trim();
        const data = await fetch(`http://localhost:3000/movielist/elastic-search/search?query=${searchFor}&page=${pagination.page}&limit=${pagination.limit}`);
        const result = await data.json();
        dispatch(setMovies(result.results));
        dispatch(setGenre('ALL'))
        dispatch(setTotalPages(Math.ceil(result.total/pagination.limit)))
        console.log("Result", result);
        dispatch(setLoading(false))
    }

    async function searchInputReader(input) {
        setSearchWord(input);
        console.log("Input", input);
    }

    return (
        <Flex className='navbar-component' flexDirection='row' gap='200px' css={{ width: '100%' }} >
            <Flex
                alignItems='center'
                justifyContent='center'
                css={{
                    paddingLeft: '50px'
                }}
            >
                <h1 className=' text-black font-bold !text-2xl' >Movie List App</h1>
            </Flex>
            <Flex css={{ width: '50%' }} alignItems='center' justifyContent='center' gap='$8'>
                <Input leftIcon={<SearchIcon />} css={{ width: '80%' }} placeholder="Search Movies" size="lg" className=' w-1/6' onChange={(e) => searchInputReader(e.target.value)} />
                <Button size="md" onClick={() => fetchMoviesByText()} >SEARCH</Button>
            </Flex>
        </Flex>
    )
}

export default Navbar