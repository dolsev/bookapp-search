//Navbar.tsx
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Avatar, Typography } from "@mui/material";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setIsLoading, setCharacters, setCharactersNumber } from '../redux/actions';
import { AppState } from '../redux/types';
import { fetchCharacters } from '../api';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function Navbar() {
    const dispatch = useDispatch();
    const searchQuery = useSelector((state: AppState) => state.searchQuery);
    const navigate = useNavigate();
    const isLoading = useSelector((state: AppState) => state.isLoading);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate('/');
        dispatch(setIsLoading(true));
        try {
            const { fetchedCharacters } = await fetchCharacters({
                searchQuery,
                page: 1,
            });

            const { totalItems } = await fetchCharacters({
                searchQuery,
            });
            dispatch(setCharacters(fetchedCharacters));
            dispatch(setCharactersNumber(totalItems));
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    React.useEffect(() => {
        dispatch(setSearchQuery(""));
        const event = new Event("submit") as unknown as React.FormEvent<HTMLFormElement>;
        handleSearch(event);
    }, []);


    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Avatar
                        src="darth-vader.png"
                        sx={{ marginRight: "16px" }}
                        alt="Darth Vader"
                        component={Link}
                        to="/"
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{ color: "white", flexGrow: 1, display: { sm: "block", xs:'none' } }}
                    >
                        Star Wars Characters
                    </Typography>
                    <form onSubmit={handleSearch}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchQuery}
                                onChange={(event) => dispatch(setSearchQuery(event.target.value))}
                            />
                        </Search>
                    </form>
                </Toolbar>
            </AppBar>
                <Box sx={{ display: 'flex', justifyContent:'center' }}>
                    {isLoading &&<CircularProgress />}
            </Box>
        </Box>
    );
}

