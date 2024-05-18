import { Dispatch } from 'redux'
import {
    SetAppErrorActionType, setAppIsInitializedAC,
    setAppStatusAC,
    SetAppStatusActionType,
} from '../../app/app-reducer'
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {LoginDataType} from "./Login";
import {
    clearTodolistsDataAC,
    ClearTodolistsDataActionType
} from "../TodolistsList/todolists-reducer";

const initialState = {
    isLoggedIn: false,
}
type InitialStateType = typeof initialState

export const authReducer = (
    state: InitialStateType = initialState,
    action: ActionsType
): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return { ...state, isLoggedIn: action.value }
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({ type: 'login/SET-IS-LOGGED-IN', value }) as const

// thunks
export const meTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))

    try {
        const res = await authAPI.me()
        if(res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (error) {
        handleServerNetworkError(error as {message: string}, dispatch)
    } finally {
        dispatch(setAppIsInitializedAC(true))
    }

}

export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))

    try {
        const res = await authAPI.login(data)
        if(res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (error) {
        handleServerNetworkError(error as {message: string}, dispatch)
    }
}

export const logoutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))

    try {
        const res = await authAPI.logout()
        if(res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(clearTodolistsDataAC())
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (error) {
        handleServerNetworkError(error as {message: string}, dispatch)
    }
}

// types
type ActionsType =
    | ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | ClearTodolistsDataActionType