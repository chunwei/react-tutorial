/**
 * Created by chunwei on 2015/9/12.
 */

import React from 'react';
import Comment from './Comment.js';

var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.data.map(function (comment, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Comment author={comment.author} key={index} comment={comment}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

export default CommentList;
