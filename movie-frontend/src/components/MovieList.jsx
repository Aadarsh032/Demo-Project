import { useEffect, useState } from 'react'
import { Box, Flex, Pagination, CircleLoader } from '@sparrowengg/twigs-react';
import MovieDisplayBox from './MovieDisplayBox'
import Description from './Description';
import { useDispatch, useSelector } from 'react-redux';
import { setMovies, setGenre, setPage, setLoading, setTotalPages } from '../feature/movies/moviesSlice';

const MovieList = () => {
    const dispatch = useDispatch();
    const { movies, genre, pagination, isLoading } = useSelector((state) => state.movies);
    const [tab, setTab] = useState(0);
    const [activePage, setActivePage] = useState(pagination.page);
    const pageLimit = 10;

    const fetchMovies = async (page) => {
        try {
            dispatch(setLoading(true))
            const moviesData = await fetch(`http://localhost:3000/movielist/elastic-search/genre?${genre == 'ALL' ? '' : `genre=${genre}&`}page=${page}&limit=${pagination.limit}`)
            const moviesRes = await moviesData.json();
            dispatch(setMovies(moviesRes.results));
            dispatch(setTotalPages(moviesRes.total / pagination.limit))
            dispatch(setPage(activePage));
            return moviesRes.movies;
        } catch (error) {
            console.error('Error Fetching Movies', error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function paginationSetter(page) {
        setActivePage(page);
        await fetchMovies(page);
    }


    return (
        <Flex flexDirection='column'>
            <div className=' grid grid-cols-10 h-full'>
                <div className='col-span-8  flex flex-wrap gap-6 justify-center '>
                    <Flex flexDirection='column' className='w-full' gap='$6' css={{
                        padding: '20px',
                        height: '93vh'
                    }}>
                        <Flex wrap='wrap' justifyContent='center' alignItems='center' gap='$6' css={{
                            height: '80vh',
                            overflowY: 'scroll',
                        }}>
                            {
                                !isLoading ? movies.map((item, id) => {
                                    return (
                                        <Box key={id} className='cursor-pointer' onClick={() => setTab(id)}>
                                            <MovieDisplayBox name={item.title} description={item.description} />
                                        </Box>
                                    )
                                })
                                    :
                                    <Box css={{ background: '$accent200', padding: '$6' }}>
                                        <CircleLoader size="3xl" />
                                    </Box>
                            }
                        </Flex>
                        <Flex alignItems='center' justifyContent='center'>
                            <Pagination
                                activePage={activePage}
                                itemsPerPage={pagination.limit ?? pageLimit}
                                total={pagination.totalPages}
                                onChange={(event, page) => paginationSetter(page)}
                            />
                        </Flex>
                    </Flex>
                </div>
                <div className='movie-description col-span-2 bg-[#EAE9FE]'>
                    <h1 className='text-center !p-5 bg-yellow-500 !text-4xl'>Details</h1>
                    <Description heading={movies[tab]?.title}
                        paragraph={movies[tab]?.description || ''}
                        genres={movies[tab]?.genres}
                        cast={movies[tab]?.persons} />
                </div>
            </div>
        </Flex>
    )
}

export default MovieList