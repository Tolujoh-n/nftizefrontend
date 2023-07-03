import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        container: {
            display: "grid",
            alignItems: "center",
            justifyItems: "center",
            gridTemplateRows: "150px",
        },
    },
    message: {
        color: "#fff",
        marginRight: theme.spacing(2),
    },
}));

export const ConnectionRequiredMsg = () => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Typography variant="h6" component="span" className={classes.message}>
                Please connect your Metamask account
            </Typography>
        </div>
    );
};