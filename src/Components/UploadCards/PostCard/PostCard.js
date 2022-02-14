import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useHttp } from "../../../Hook/useHttp";
import {
  addComments,
  setPosts,
} from "../../../ReduxStorage/actions/postActions";
import { Button } from "../../Common/Button/Button";
import "./PostCard.css";
import { Loader } from "../../Common/Loader/Loader";
import CommentsBlock from "../../UploadBlocks/CommentsBlock/CommentsBlock";

function PostCard(props) {
  const { request } = useHttp();
  const {
    posts,
    setPosts,
    userInfo,
    showAlertHandler,
    postId,
    comments,
    addComments,
  } = props;

  const [loadingPost, setLoadingPost] = useState(false);
  const [showButtonsForUserPosts, setShowButtonsForUserPosts] = useState(false);
  const [loadingComments, setLoadingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const post = posts.find((post) => post.id === postId);
  const createdAtDate = new Date(post.createdAt).toLocaleString();

  const dataRequest = useCallback(
    async (comments) => {
      try {
        setLoadingComment(true);

        const commentsFromBD = await request(
          `/comments?postId=${postId}&_sort=createdAt&_order=desc&_expand=user`,
          "GET",
          null
        );

        if (!commentsFromBD) return null;

        if (comments && comments.length > 0) {
          const newComments = commentsFromBD.filter(
            (commentFromBD) =>
              comments.find((comment) => comment.id === commentFromBD.id) ===
              undefined
          );
          //filter comments that are already in storage
          addComments(newComments);
        } else {
          addComments(commentsFromBD);
        }
      } catch (e) {
        showAlertHandler({
          show: true,
          text: `Error, try to reload this page. ${e}`,
          type: "error",
        });
      } finally {
        setLoadingComment(false);
      }
    },
    [postId, request, showAlertHandler, addComments]
  );

  const deletePost = async () => {
    try {
      setLoadingPost(true);

      await request(`/664/posts/${postId}`, "DELETE", null, {
        Authorization: `Bearer ${userInfo.accessToken}`,
      });

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (e) {
      showAlertHandler({
        show: true,
        text: `Error, try to delete post again. ${e}`,
        type: "error",
      });
    } finally {
      setLoadingPost(false);
    }
  };

  const showButtonsForUserPostsHandler = useCallback(() => {
    setShowButtonsForUserPosts(!showButtonsForUserPosts);
  }, [showButtonsForUserPosts]);

  const ButtonsForUserPosts = () => {
    return (
      <div className="buttonsForUserPostsBlock">
        <Link to={`/edit/post/${postId}`}>
          <Button
            text="Edit"
            name={`editButton${postId}`}
            className="editButton button"
            classNameBlock="editButtonBlock"
          />
        </Link>

        <Button
          text="Delete"
          name={`deleteButton${postId}`}
          className="deleteButton button"
          onClick={deletePost}
        />
      </div>
    );
  };

  const showCommentsHandler = () => {
    setShowComments(!showComments);

    if (!showComments) {
      dataRequest(comments);
    }
  };

  //close buttons for user posts
  const clickHandler = useCallback(() => {
    if (!showButtonsForUserPosts) return null;

    showButtonsForUserPostsHandler();
  }, [showButtonsForUserPosts, showButtonsForUserPostsHandler]);

  useEffect(() => {
    document.addEventListener("click", clickHandler);
    return function () {
      document.removeEventListener("click", clickHandler);
    };
  }, [clickHandler, showButtonsForUserPosts]);
  //

  return loadingPost ? (
    <div className="loaderInPostCard">
      <Loader />
    </div>
  ) : (
    <div className="postCard">
      <div className="postInfoBlock">
        <div className="postAuthorInfoBlock">
          <div>
            <NavLink to={`/profile/${post.userId}`}>
              <img
                alt="author pic"
                className="postAuthorPic"
                src={
                  post?.user?.avatar
                    ? post.user.avatar
                    : "https://picsum.photos/60"
                }
              />
            </NavLink>
          </div>

          <div className="postInfoTextBlock">
            <p>
              {post.user.firstname} {post.user.lastname}
            </p>
            <p className="postDate">{createdAtDate}</p>
          </div>
        </div>

        <div>
          {userInfo.id === post.user.id ? (
            <Button
              text="…"
              name={`showButtonsForUserPostsText${postId}`}
              className="button showButtonsForUserPostsText"
              onClick={showButtonsForUserPostsHandler}
            >
              ...
            </Button>
          ) : null}

          {showButtonsForUserPosts ? <ButtonsForUserPosts /> : null}
        </div>
      </div>

      <div className="postCardContentBlock">
        <h3>{post.title}</h3>
        <p className="postBody">{post.body}</p>
      </div>

      <div>
        <p className="showCommentsText" onClick={showCommentsHandler}>
          comments
          {showComments ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
            >
              <path d="M12 21l-12-18h24z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
            >
              <path d="M21 12l-18 12v-24z" />
            </svg>
          )}
        </p>

        {showComments && !loadingComments ? (
          <CommentsBlock showAlertHandler={showAlertHandler} postId={postId} />
        ) : null}

        {loadingComments ? (
          <div className="loaderInPostCard">
            <Loader />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    userInfo: state.userReducers,
    posts: state.postReducers.posts,
    comments: state.postReducers.comments,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setPosts: (posts) => dispatch(setPosts(posts)),
    addComments: (newComments) => dispatch(addComments(newComments)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);
