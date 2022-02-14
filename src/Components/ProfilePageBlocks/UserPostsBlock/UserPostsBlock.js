import React from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import "./UserPostsBlock.css";
import PostCard from "../../UploadCards/PostCard/PostCard";

function UserPostsBlock(props) {
  const { showAlertHandler, userId, posts, userInfo } = props;
  const id = useParams().id;

  const userPosts = posts.filter(
    (announcement) => announcement.userId === Number(id)
  );

  return userPosts.length > 0 ? (
    <div className="profilePagePostsBlock">
      <p className="profilePagePostsName">
        {userId === Number(id) ? "Your" : userInfo.firstname} posts
      </p>

      {userPosts.map((post, i) => {
        return (
          <PostCard
            showAlertHandler={showAlertHandler}
            key={i}
            postId={post.id}
          />
        );
      })}
    </div>
  ) : (
    <p className="profilePagePostsEmptySection">
      It`s time to create your first post
    </p>
  );
}

function mapStateToProps(state) {
  return {
    userId: state.userReducers.id,
    posts: state.postReducers.posts,
  };
}

export default connect(mapStateToProps)(UserPostsBlock);
