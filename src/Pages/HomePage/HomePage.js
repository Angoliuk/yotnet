import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { PagesWrapper } from "../../hoc/PagesWrapper/PagesWrapper";
import { useHttp } from "../../Hook/useHttp";
import { addToEndPosts } from "../../ReduxStorage/actions/postActions";
import './HomePage.css'
import { Loader } from "../../Components/Common/Loader/Loader";
import NewUploadBlock from "../../Components/UploadBlocks/NewUploadBlock/NewUploadBlock";
import PostsBlock from "../../Components/UploadBlocks/PostsBlock/PostsBlock";

function HomePage(props) {

    const {request} = useHttp()
    const {showAlertHandler, posts, addToEndPosts} = props

    const [pageNum, setPageNum] = useState(1)
    const [loadNewPosts, setLoadNewPosts] = useState(true)

    const dataRequest = useCallback(async () => {

        try {     

            const postsFromDB = await request(
                `/posts?_page=${pageNum}&_limit=10&_expand=user&_sort=createdAt&_order=desc`, 
                'GET', 
                null
            )

            if (!postsFromDB) return null

            const newPosts = postsFromDB.filter((postFromDB) => posts.find((post) => post.id === postFromDB.id) === undefined)
            //filter posts that are already in storage

            if(!newPosts) return null
            
            addToEndPosts(newPosts)
            setPageNum(prevState => prevState + 1)
            setLoadNewPosts(false)
            
        } catch (e) {
            showAlertHandler({
                show: true,
                text: `Error, try to reload this page. ${e}`,
                type: 'error',
            })
        }
    
    }, [request, loadNewPosts])

    //load new posts when you scroll to the end of page
    useEffect(() => {
        if (!loadNewPosts) {return null}
        dataRequest()
    }, [dataRequest, loadNewPosts])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return function () {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    const scrollHandler = (e) => {
        
        if (e.target.documentElement.scrollHeight - (window.innerHeight + e.target.documentElement.scrollTop) < 100) setLoadNewPosts(true)

    }
    //

    return(
        <>

            <NewUploadBlock showAlertHandler={showAlertHandler} />
            <PostsBlock showAlertHandler={showAlertHandler} />

            {
            loadNewPosts
            ?   <div className="homeLoaderInPostsBlock"><Loader /></div>
            :   null
            }

        </>
    )
}

function mapStateToProps(state) {
    return{
        posts: state.postReducers.posts,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        addToEndPosts: (newPosts) => dispatch(addToEndPosts(newPosts)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapper(HomePage))