import { connect } from "react-redux"
import PostCard from "../../UploadCards/PostCard/PostCard"
import "./PostsBlock.css"


const PostsBlock = (props) => {

    const {posts, showAlertHandler} = props

    return(
        <div className="postsBlockWrapper">

            {posts.map((post, i) => {
                return(
                    <PostCard showAlertHandler={showAlertHandler} key={i} postId={post.id} />
                )
            })}

        </div>
    )

}

function mapStateToProps(state) {
    return{
        posts: state.postReducers.posts,
    }
}

export default connect(mapStateToProps)(PostsBlock)