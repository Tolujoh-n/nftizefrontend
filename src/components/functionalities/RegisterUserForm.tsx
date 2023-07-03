import React, { useState, useEffect } from "react";
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { formatUnits } from "@ethersproject/units"
import { utils } from "ethers";
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  TextField,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useRegisterUser } from "../Hooks/useRegisterUser"; 


const useStyles = makeStyles((theme) => ({
    button: {
        margin: "25px 0",
    },
}))

export const RegisterUserForm = () => {
    const { account } = useEthers()
    const { notifications } = useNotifications()
    const classes = useStyles()

    const { Register, RegisterState } = useRegisterUser()
    const handleRegisterSubmit = () => {
        return Register()
    }

    const isMining = RegisterState.status === "Mining"
    const [showRegisterSuccess, setRegisterSuccess] = useState(false)
    const handleCloseSnack = () => {
        setRegisterSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Register user").length > 0
        ) {
            setRegisterSuccess(true)
        }
    }, [notifications, showRegisterSuccess])
    return (
        <>
            <div>
                <Button
                    onClick={handleRegisterSubmit}
                    className={classes.button}
                    color="primary"
                    size="large"
                    variant="contained"
                    disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : `Register`}
                </Button>
            </div>
            <Snackbar
                open={showRegisterSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    User Registered !
                </Alert>
            </Snackbar>

        </>
    )
}