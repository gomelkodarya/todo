import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {loginTC} from "./auth-reducer";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export type LoginDataType = {
    email: string,
    password: string
    rememberMe: boolean,
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: values => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }

            if(!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 4) {
                errors.password = 'Should be more six symbols'
            }

            return errors
        },
        onSubmit: async (values, _) => {
            // alert(JSON.stringify(values))
            _.setSubmitting(true)
            await dispatch(loginTC(values))
            _.setSubmitting(false)
            formik.resetForm()
        },
    })
    console.log(formik.values)

    if(isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To log in get registered
                                <a href={'https://social-network.samuraijs.com/'} target={'_blank'}>
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField
                                label="Email"
                                margin="normal"
                                // name="email"
                                error={!!(formik.touched.email && formik.errors.email)}
                                // onChange={formik.handleChange}
                                // value={formik.values.email}
                                // onBlur={formik.handleBlur}
                                //заменяем этой строчкой 4 закомментированные строки
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                // name="password"
                                error={!!(formik.touched.password && formik.errors.password)}
                                // onChange={formik.handleChange}
                                // value={formik.values.password}
                                // onBlur={formik.handleBlur}
                                //заменяем этой строчкой
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                            <FormControlLabel
                                label={'Remember me'}
                                control={
                                <Checkbox
                                    onChange={formik.handleChange}
                                    checked={formik.values.rememberMe}
                                    name="rememberMe"
                                />
                            } />
                            <Button disabled={formik.isSubmitting} type={'submit'} variant={'contained'} color={'primary'}>
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    )
}