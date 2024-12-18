import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { addFollow, loadUser, isUserFollowCheck } from '../store/user.actions'
import Loader from '../cmps/Loader.jsx'
import { UserStories } from '../cmps/userStories.jsx'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { ProfileSettings } from '../cmps/SVG.jsx'
import BasicModal from '../cmps/Modal.jsx'
import { UserMiniCard } from "../cmps/UserMiniCard.jsx";
import { utilService } from '../services/util.service.js'; 
import {  loadAllStories } from "../store/story.actions"




export function ProfilePage() {

    const user = useSelector(userState => userState.userModule.user)
    const watchedUser = useSelector(userState => userState.userModule.watchedUser)
    const allStories = useSelector(storeState => storeState.storyModule.allStories)


    const [userStories, setUserStories] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isFollow, setIsFollow] = useState()

    const params = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        Init()
    }, [params, isFollow])

    async function Init() {
        await loadAllStories()
        const currntUser = await loadUser(params.userId)
        const userStoriesList =  await getUserStories(currntUser)
        setUserStories(userStoriesList)
        const status = await isUserFollowCheck(user, currntUser)
        setIsFollow(status)
        setIsLoading(false)
    }


    async function getUserStories(user) {
        const userStoriesList = await allStories.filter(story => story.by._id === user._id)
        return userStoriesList
    }

    function navigateToDetailes(adress) {
        navigate(`/${watchedUser._id}/${adress}`)
    }

    async function onFollow() {
        console.log("on follow is activated")
        const followStatus = await addFollow(user, watchedUser)
        setIsFollow(followStatus)
    }


    if (isLoading) return <div><Loader /></div>
    if (!watchedUser) return <div><Loader /></div>
    if (!userStories > 0) return <div><Loader /></div>
    return (
        <>
            <div className='user-profile'>
                <section className='user-info'>
                    <img src={watchedUser.imgUrl} alt="No picture" />
                    {/* <section className='user-data'> */}
                        <div className='actions'>
                            {user._id === watchedUser._id ? (
                                <>
                                    <h1>{watchedUser.fullname}</h1>
                                    <button>Edit Profile</button>
                                    <button>View archive</button>
                                    <div><ProfileSettings /></div>
                                </>
                            ) : (
                                <>
                                    <h1>{watchedUser.fullname}</h1>
                                    {isFollow ? (
                                        <button onClick={onFollow}>Following</button>
                                    ) : (<button className='follow-indicator' onClick={onFollow}>Follow</button>)
                                    }
                                    <button>Message</button>
                                </>
                            )}


                        </div>
                        <div className='follow'>
                            {userStories ? (<div className='follow-profile-list'><div>{userStories.length}<span> posts</span></div></div>) : (<div  className='follow-profile-list'><div> 0 <span> posts</span></div></div>)}
                            <div className='follow-profile-list'><BasicModal header={` followers`} number={watchedUser.followers.length} text={"Followers"} content={watchedUser.followers.map(user =>
                                <li style={{ listStyle: 'none' }} key={utilService.makeId()}>
                                    <UserMiniCard user={user} fromHome={false} isMiniUser = {true}/>
                                </li>
                            )} />
                            </div>
                            <div className='follow-profile-list'><BasicModal header={` following`} number={watchedUser.following.length} text={"Following"} content={watchedUser.following.map(user =>
                                <li style={{ listStyle: 'none' }} key={utilService.makeId()}>
                                    <UserMiniCard user={user} fromHome={false} isMiniUser = {true}/>
                                </li>
                            )} />
                            </div>
                        </div>
                    {/* </section> */}
                </section>
                <section className='user-posts'>
                    <section className='user-story-links'>
                        <NavLink> Posts</NavLink>
                        <NavLink> Saved</NavLink>
                    </section>
                    <section className='user-story-posts'>
                        {userStories.map(story =>
                            <li key={story._id}>
                                <UserStories story={story} watchedUser={watchedUser} navigateToDetailes={navigateToDetailes} isFollow={isFollow} />
                            </li>

                        )}
                    </section>
                    <Outlet />
                </section>
            </div>
        </>
    )
}