import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { addAnnouncements, addToEndAnnouncements } from "../../../ReduxStorage/actions/announcementActions";
import { Modal } from "../../Common/Modal/Modal";
import { useHttp } from "../../../Hook/useHttp"
import './AnnouncementsBlock.css'
import AnnouncementCard from "../../UploadCards/AnnouncementCard/AnnouncementCard";
import { Loader } from "../../Common/Loader/Loader";

const AnnouncementsBlock = (props) => {

    const {request, loading} = useHttp()
    const {id, addAnnouncements, announcements, showAlertHandler, addToEndAnnouncements} = props

    const [showAnnouncement, setShowAnnouncement] = useState(false)
    const [pageNum, setPageNum] = useState(1)
    // const [loadNewAnnouncements, setLoadNewAnnouncements] = useState(true)

    const showAnnouncementHandler = async() => {

        if (!showAnnouncement) {dataRequest()}
        setShowAnnouncement(!showAnnouncement)

    }

    const dataRequest = useCallback(async() => {
        try {

            const announcementsFromDB = await request(`/announcements?_page=${pageNum}&_limit=20&_expand=user&_sort=createdAt&_order=desc`, 'GET', null)

            if (!announcementsFromDB) return null

            const newAnnouncements = announcementsFromDB.filter((announcementFromDB) => announcements.find((announcement) => announcement.id === announcementFromDB.id) === undefined)

            if(!newAnnouncements) return null
            addToEndAnnouncements(newAnnouncements)
            // setPageNum(prevState => prevState + 1)
            // setLoadNewAnnouncements(false)
            
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to reload this page. ${e}`,
                type: 'error',
            })
        }
    }, [request, announcements, addAnnouncements])

    const scrollHandler = (e) => {

        if (e.target.scrollHeight - (e.target.scrollTop + e.target.offsetHeight) < 200 ) {
            
            // setLoadNewAnnouncements(true)

        }

    }

        // useEffect(() => {
    //     if(!loadNewAnnouncements) return null
    //     dataRequest()
    // }, [loadNewAnnouncements, dataRequest])

    const AnnouncementsListBlock = () => {
        return( 
            announcements && announcements.length > 0
            ?    announcements.map((announcement) => {
                    return(
                        <AnnouncementCard showAlertHandler={showAlertHandler} key={announcement.id+id} announcementId={announcement.id} />
                    )})
            :   <p>Announcements for not found</p>
        )
    }

    return(
        <>

            <p onClick={showAnnouncementHandler}  className='navElem navElemAnnouncements'>
                <svg width="40px" height="40px" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" id="Stock_cut" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><desc/><g><polygon fill="none" points="2,3 2,23 6,23    6,29 12,23 30,23 30,3  " stroke="#000000" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/><circle cx="8" cy="13" fill="none" r="2" stroke="#000000" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/><circle cx="16" cy="13" fill="none" r="2" stroke="#000000" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/><circle cx="24" cy="13" fill="none" r="2" stroke="#000000" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/></g></svg>
            </p>

            {
            showAnnouncement
            ?   Modal(
                    <div onScroll={scrollHandler} id="navBarAnnouncementBlock" className="navBarAnnouncementBlock">

                        <p className="navBarAnnouncementsName">Announcements for you</p>
                        <hr />

                        {
                        loading
                        ?   <div className="navBarLoaderInAnnouncementsBlock"><Loader /></div>
                        :   <AnnouncementsListBlock />
                        }

                    </div>,
                    showAnnouncementHandler,
                    "modalBackground navBarAnnouncementBlockBackground"
                )
            :   null
            }

        </>
        
    )
}

function mapStateToProps(state) {
    return{
        id: state.userReducers.id,
        announcements: state.announcementReducers.announcements,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        addAnnouncements: (announcements) => dispatch(addAnnouncements(announcements)),
        addToEndAnnouncements: (announcements) => dispatch(addToEndAnnouncements(announcements)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementsBlock)