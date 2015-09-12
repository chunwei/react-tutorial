/**
 * Created by chunwei on 2015/9/12.
 */

import React from 'react';

var CommentForm = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text, likedCount: 0});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
  },
  render: function () {
    var id = this.props.params.id;
    console.log('key=', id);
    return (
      <div className="commentFormHolder">
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input ref="author" type="text" placeholder="Your name"/>

          <p><textarea ref="text" className="content-textarea" rows="5" placeholder="你有什么看法呢？"></textarea></p>
          <input type="submit" value="发表评论" className="submit"/>
        </form>
      </div>
    );
  }
});

export default CommentForm;
