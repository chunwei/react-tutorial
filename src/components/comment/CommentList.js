/**
 * Created by chunwei on 2015/9/12.
 */

import React from 'react';
import Comment from './Comment.js';

var CommentList = React.createClass({
  render: function () {
    var comments = this.props.data.map(function (comment, index) {
      var replys=!!!comment.replys?'':comment.replys.map(function(reply,index){
        return(
          <Comment author={reply.author} key={index} pid={comment.id} comment={reply} />
        );
      });
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Comment author={comment.author} key={index} comment={comment}>
          <div className="replys">
            {replys}
          </div>
        </Comment>

      );
    });
    return (
      <div className="commentList">
        {comments}
      </div>
    );
  }
});

export default CommentList;
