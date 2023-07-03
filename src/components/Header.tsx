import { useEthers } from "@usedapp/core"
import { Button, makeStyles } from "@material-ui/core"
import { ConnectionRequiredMsg } from "./ConnectionRequiredMsg"
import React from 'react'

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    },
    div: {
        display: "flex",
        alignItems: "center"
    },
    address: {
        marginRight: '10px',
        textTransform: "initial"
    },
    connexion: {
        marginRight: '72px',
    }
}
))

export const Header = () => {
    const classes = useStyles()
    const { account, activateBrowserWallet, deactivate } = useEthers()

    const isConnected = account !== undefined

    return (
        <div className={classes.container}>
            <div>
                {isConnected ? (
                    <>
                        <Button color="primary" variant="contained" className={classes.address}>
                            {`${account?.slice(0, 6)}...${account?.slice(-4)}`}
                        </Button>
                        <Button variant="contained"
                            onClick={deactivate} className={classes.connexion}>
                            Disconnect
                        </Button>
                    </>
                ) : (
                    <>
                        <div className={classes.div}>
                            <ConnectionRequiredMsg />
                            <Button color="primary" variant="contained"
                                onClick={() => activateBrowserWallet()}
                                className={classes.connexion}>
                                Connect
                            </Button>
                        </div>
                    </>
                )
                }
            </div>
        </div >
    )
}