import validator from "validator";

export const useValidator = () => {
  const validateUserLogin = (user) => {
    if (!validator.isEmail(user.email)) {
      throw new Error("Enter valid Email");
    }
    if (!validator.isLength(user.password, { min: 6, max: undefined })) {
      throw new Error("Too short password, minimal lenght - 6");
    }
  };

  const validateUser = (user) => {
    if (!validator.isEmail(user.email)) throw new Error("Wrong Email");

    if (!validator.isLength(user.password, { min: 6, max: undefined }))
      throw new Error("Too short password, minimal lenght - 6");

    if (!user.lastname || !user.firstname) throw new Error("Enter your name");

    if (user.age < 14) throw new Error("You need to be at least 14");
  };

  const validatePost = (post) => {
    if (!validator.isLength(post.title, { min: 1, max: 1000 })) {
      throw new Error("It`s required field, signs limit - 1000");
    }
    if (!validator.isLength(post.body, { min: 1, max: 3000 })) {
      throw new Error("It`s required field, signs limit - 3000");
    }
  };

  const validateAnnouncement = (announcement) => {
    if (!validator.isLength(announcement.title, { min: 1, max: 500 })) {
      throw new Error("It`s required field, signs limit - 500");
    }
    if (!validator.isLength(announcement.body, { min: 1, max: 1500 })) {
      throw new Error("It`s required field, signs limit - 1500");
    }
  };

  const validateComment = (comment) => {
    if (!validator.isLength(comment.body, { min: 1, max: 1000 })) {
      throw new Error("It`s required field, signs limit - 1000");
    }
  };

  return {
    validateAnnouncement,
    validateComment,
    validatePost,
    validateUser,
    validateUserLogin,
  };
};
