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
import { useClaimRewards } from "../Hooks/useClaimRewards"; 
import { SiTether } from 'react-icons/si'


const useStyles = makeStyles((theme) => ({
    button: {
        margin: "25px 0",
    },
}))

export const ClaimRewards = () => {
    const { account } = useEthers()
    const { notifications } = useNotifications()
    const classes = useStyles()

    const { Claim, ClaimRewardsState, value } = useClaimRewards(account)
    const handleClaimSubmit = () => {
        return Claim()
    }

    const formattedTokenBalance: number = value?.[0] ? parseFloat(formatUnits(value?.[0] , 18)) : 0

    const isMining = ClaimRewardsState.status === "Mining"
    const [showClaimSuccess, setClaimSuccess] = useState(false)
    const handleCloseSnack = () => {
        setClaimSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Claim Rewards").length > 0
        ) {
            setClaimSuccess(true)
        }
    }, [notifications, showClaimSuccess])
    return (
        <>
            <div>
            <div className="flex items-center">
            <SiTether className="text-green-600 mr-2" />
            <span> Spent : {formattedTokenBalance ? formattedTokenBalance.toString() : 'Loading...'}</span>
            </div>
            
                <Button
                    onClick={handleClaimSubmit}
                    className={classes.button}
                    color="primary"
                    size="large"
                    variant="contained"
                    disabled={isMining || formattedTokenBalance < 500}>
                    {isMining ? <CircularProgress size={26} /> : `Claim TOM`}
                </Button>
            </div>
            <Snackbar
                open={showClaimSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success">
                    Rewards claimed !
                </Alert>
            </Snackbar>

        </>
    )
}