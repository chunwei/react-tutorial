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
    console.log(author,text);
    var pid =parseInt(this.props.params.id);
    this.props.onCommentSubmit({author: author, text: text, likedCount: 0,parentId:pid});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
  },
  getCommentById: function (id) {
      return comment;
  },
  componentDidMount: function(){

  },
  render: function () {
    var pid = this.props.params.id;
    var replyTo=pid?`回复${pid}:`:'';
    return (
      <div className="commentFormHolder">
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input ref="author" type="text"  placeholder="Your name"/>

          <p><textarea ref="text" defaultValue={replyTo} className="content-textarea" rows="5" placeholder="我有话说"></textarea></p>
          <input type="submit" value="发表评论" className="submit"/>
        </form>
      </div>
    );
  }
});

export default CommentForm;
