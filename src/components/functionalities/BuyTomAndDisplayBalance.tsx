import React, { useState, useEffect } from 'react'
import { useEthers, useTokenBalance, useNotifications } from '@usedapp/core'
import { formatUnits } from '@ethersproject/units'
import { utils } from 'ethers'
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  TextField,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { useBuyTomTokens } from '../Hooks/useBuyTomTokens'
import { getContractAddress } from '../helpers/ContractAddress'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: '-20px 0',
    marginLeft: '30px',
  },
}))

export const BuyTomForm = () => {
  // const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
  const { notifications } = useNotifications()
  const classes = useStyles()

  const { account  } = useEthers()

  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === '' ? '' : Number(event.target.value)
    setAmount(newAmount)
    console.log(newAmount)
  }

  const {
    approveAndBuyTom,
    state: approveErc20AndBuyState,
    chainId,
    transactionHash: Receipt,
  } = useBuyTomTokens()
  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString())
    return approveAndBuyTom(amountAsWei.toString())
  }

  const chain_Id = chainId ? chainId : 0

  const tomAddress = getContractAddress(
    chain_Id.toString(),
    'tom_address'
  )
  const tokenBalance = useTokenBalance(tomAddress, account)
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0

  const isMining = approveErc20AndBuyState.status === 'Mining'
  // const hasZeroBalance = formattedTokenBalance === 0
  const hasZeroAmountSelected = parseFloat(amount.toString()) === 0

  const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] =
    useState(false)
  const [showBuyTokenSuccess, setBuyTokenSuccess] = useState(false)
  const handleCloseSnack = () => {
    setShowErc20ApprovalSuccess(false)
    setBuyTokenSuccess(false)
  }

  /////**********************    Need to send the transaction hash to backend which should execute
  //             the event catching and db integration */

  // const sendTransactionHashToBackend = async (transactionHash) => {
  //     try {
  //       const response = await fetch('YOUR_DJANGO_BACKEND_URL', {
  //         method: 'POST',
  //         headers: {'Content-Type': 'application/json'},
  //         body: JSON.stringify({transactionHash}),
  //       });
  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Approve ERC20 transfer'
      ).length > 0
    ) {
      setShowErc20ApprovalSuccess(true)
      setBuyTokenSuccess(false)
    }
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === 'Buy Tom'
      ).length > 0
    ) {
      setShowErc20ApprovalSuccess(false)
      setBuyTokenSuccess(true)
    }
  }, [notifications, showErc20ApprovalSuccess, showBuyTokenSuccess])

  return (
 <section className="flex h-[53%] items-center">
      <div className={`${classes.container}`}>
        <span>
          TOM Balance:{' '}
          {formattedTokenBalance ? formattedTokenBalance.toString() : '0'}
        </span>
        <TextField
          className={classes.input}
          label="Amount to Buy in USDT"
          variant="outlined"
          type="number"
          value={amount}
          onChange={handleInputChange}
          disabled={isMining}
        />
        <Button
          onClick={handleStakeSubmit}
          className={classes.button}
          color="primary"
          variant="contained"
          size="large"
          disabled={isMining || hasZeroAmountSelected}
        >
          {isMining ? <CircularProgress size={26} /> : 'Buy'}
        </Button>
      </div>
      <Snackbar
        open={showErc20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          ERC-20 token transfer Approved! Now approve the 2nd transaction.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showBuyTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Tokens Bought!
        </Alert>
      </Snackbar>
    </section>
  )
}
