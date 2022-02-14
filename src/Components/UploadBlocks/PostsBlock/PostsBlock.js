import { connect } from "react-redux";
import PostCard from "../../UploadCards/PostCard/PostCard";
import "./PostsBlock.css";
import React, { useCallback, useEffect, useState } from "react";
import { useHttp } from "../../../Hook/useHttp";
import { addToEndPosts } from "../../../ReduxStorage/actions/postActions";
import { Loader } from "../../Common/Loader/Loader";
import { usePostService } from "../../../Service/usePostService";

const PostsBlock = (props) => {
  const { posts, showAlertHandler, addToEndPosts } = props;
  const { xTotalCount } = usePostService();
  const postService = usePostService();

  const [pageNum, setPageNum] = useState(1);
  const [loadNewPosts, setLoadNewPosts] = useState(true);

  const dataRequest = useCallback(async () => {
    try {
      if (!loadNewPosts) {
        return null;
      }

      const postsFromDB = await postService.getPosts(pageNum, 10);

      if (!postsFromDB) return null;

      const newPosts = postsFromDB.filter(
        (postFromDB) =>
          posts.find((post) => post.id === postFromDB.id) === undefined
      );
      //filter posts that are already in storage

      if (!newPosts) return null;

      addToEndPosts(newPosts);
      setLoadNewPosts(false);
    } catch (e) {
      showAlertHandler({
        show: true,
        text: `Error, try to reload this page. ${e}`,
        type: "error",
      });
    }
  }, [pageNum, showAlertHandler, addToEndPosts]);

  //load new posts when you scroll to the end of page
  useEffect(() => {
    dataRequest();
  }, [dataRequest]);

  const scrollHandler = useCallback(
    (e) => {
      if (
        e.target.documentElement.scrollHeight -
          (window.innerHeight + e.target.documentElement.scrollTop) <
          100 &&
        xTotalCount > pageNum * 10
      ) {
        setLoadNewPosts(true);
        setPageNum((prevState) => prevState + 1);
      }
    },
    [xTotalCount, pageNum]
  );

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);
  //

  const PostsListBlock = useCallback(() => {
    return posts.map((post, i) => {
      return (
        <PostCard
          showAlertHandler={showAlertHandler}
          key={i}
          postId={post.id}
        />
      );
    });
  }, [posts, showAlertHandler]);

  return (
    <div className="postsBlockWrapper">
      <PostsListBlock />
      {loadNewPosts ? (
        <div className="homeLoaderInPostsBlock">
          <Loader />
        </div>
      ) : null}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    posts: state.postReducers.posts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addToEndPosts: (newPosts) => dispatch(addToEndPosts(newPosts)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostsBlock);
