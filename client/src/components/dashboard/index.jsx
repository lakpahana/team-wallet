import {  Container, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getUserExpenseService} from "../../services/expenseServices"
import { getUserGroupsService } from "../../services/groupServices"
import Loading from "../loading"
import { CalenderExpenseGraph } from "./CalenderExpenseGraph"
import { CategoryExpenseChart } from "./CategoryExpenseGraph"
import { EndMessage } from "./endMessage"
import { GroupExpenseChart } from "./GroupExpenseChart"
import { RecentTransactions } from "./RecentTransactions"
import { SummaryCards } from "./summaryCards"
import { WelcomeMessage } from "./welcomeMessage"
import { Link as RouterLink } from 'react-router-dom';
import configData from '../../config.json'
import AlertBanner from "../AlertBanner"


const profile = JSON.parse(localStorage.getItem('profile'))
const emailId = profile?.emailId


export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const profile = JSON.parse(localStorage.getItem("profile"))
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [userExp, setUserExp] = useState()
    const [newUser, setNewUser] = useState(false)
     const [group, setGroup] = useState([]);
    const [totalOwed, setTotalOwed] = useState(0);
    const [totalOwing, setTotalOwing] = useState(0);
     const findUserSplit = (split) => {
        if (split) {
            split = split[0]
            return split[emailId]
        }
        return 0
    }

    async function getUserTotalOwed(groups) 
    {
        
        let totalOwed = 0;
        let totalOwing = 0;
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i];
            const split = group.split
            const userSplit = findUserSplit(split)
            if (userSplit > 0) {
                totalOwing += userSplit
            } else {
                totalOwed += userSplit
            }
        }

        setTotalOwed(totalOwed)
        setTotalOwing(totalOwing)
        console.log(totalOwed, totalOwing)

    }


    useEffect(() => {
        const getUserDetails = async () => {
            setLoading(true);
            const userIdJson = {
                user: profile.emailId
            }
            const response_expense = await getUserExpenseService(userIdJson, setAlert, setAlertMessage)
            setUserExp(response_expense.data);
            const response_group = await getUserGroupsService(profile)
            if (response_group.data.groups.length == 0){
                setNewUser(true)
            }else{
                // console.log(response_group.data.groups)
                getUserTotalOwed(response_group.data.groups)
                setGroup(response_group.data.groups)
            }
            setLoading(false)

        }
        getUserDetails();


    }, [])

    return (
        <Container>
            {loading ? <Loading /> :
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                <WelcomeMessage />
                            </Grid>

                            {newUser ?
                                <Grid item xs={12}>
                                    <Grid container
                                        direction="column"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            minHeight: 'calc(50vh - 200px )',
                                        }}

                                    >
                                        <Typography variant="body2" fontSize={18} textAlign={'center'}>
                                            Seems to be new here! Create your first group and add expenses <br />
                                            <Link component={RouterLink}
                                                to={configData.CREATE_GROUP_URL}>
                                                Create Group
                                            </Link>
                                        </Typography>
                                    </Grid>
                                </Grid>

                                :
                                <>
                                    <Grid item xs={12} sx={{
                                        pt:10,
                                        verticalAlign: 'center',
                                    
                                    }}>
                                        {/* grid with two colmns hello username and image */}
                                        <Grid container spacing={3}>
                                            <Grid item xs={10}>
                                                <Typography variant="h5" textAlign={'left'}>
                                                    Hello {profile.firstName}!
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2} sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'right',
                                                textAlign: 'right',
                                            
                                            }}>
                                                <img src="https://api.multiavatar.com/dsd.png" alt={profile.firstName} style={{ borderRadius: '50%', 
                                                width: '50px',
                                                
                                                }} />
                                            </Grid>
                                        </Grid>
                                        <br></br>
                                        <SummaryCards isRed={true} userTotalExp={totalOwed} />
                                        <br></br>
                                        <SummaryCards userTotalExp={totalOwing} />
                                    <br></br>
                                             {!newUser &&   
                        
                                        <RecentTransactions />
                            
                                                
                                         }
                                    </Grid>
                                    <Grid item xs={12}>
                                        {/* <CalenderExpenseGraph /> */}
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        {/* <GroupExpenseChart /> */}
                                    </Grid>
                                    {/* <Grid item xs={12} md={6}>
                                <CategoryExpenseChart />
                            </Grid> */}
                                </>
                            }
                        </Grid>

                    </Grid>            

                </Grid>

            }</Container>

    )
}
