import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {useAppDispatch, useAppSelector} from './store'
import {RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {fetchTodolistsTC} from "../features/TodolistsList/todolists-reducer";
import {logoutTC, meTC} from "../features/Login/auth-reducer";
import {CircularProgress} from "@mui/material";


function App() {
    const dispatch = useAppDispatch()
    const status = useAppSelector<RequestStatusType>((state) => state.app.status)
    const isInitialized= useAppSelector((state) => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    useEffect(() => {
        dispatch(meTC())
    }, [])

    if (!isInitialized) {
        return (
            <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        )
    }
    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    {/*<IconButton edge="start" color="inherit" aria-label="menu">*/}
                    {/*    <Menu/>*/}
                    {/*</IconButton>*/}
                    {/*<Typography variant="h6">*/}
                    {/*    News*/}
                    {/*</Typography>*/}
                    {isLoggedIn &&
                        <Button color="inherit" onClick={logoutHandler}>Log out</Button>
                    }
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                   <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path="*" element={<Navigate to={'/404'}/>} />
                </Routes>
            </Container>
        </div>
    )
}

export default App
