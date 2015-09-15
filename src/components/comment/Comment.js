/**
 * Created by chunwei on 2015/9/12.
 */
import React from 'react';
import {Link} from 'react-router';
import LikeButton from '../like/LikeBotton.js'

var avatarImg = require('./user.png');

var CommentHeader = React.createClass({
  render: function () {
    return (
      <div className="commentHeader">
        <div className="commentAuthor">
          <span className="avatar"><img src={avatarImg}/></span>
          <span className="author">{this.props.author}</span>
        </div>
        <LikeButton liked={false} count={this.props.likedCount}/>
      </div>
    );
  }
});
var CommentContent = React.createClass({
  render: function () {
    return (
      <div className="commentContent">
        {this.props.children}
      </div>
    );
  }
});
var CommentFooter = React.createClass({
  render: function () {
    let comment_id=this.props.comment_id;
    let replyUrl='/reply/'+comment_id;

    return (
      <div className="commentFooter">
        <span className="time">25分钟前</span>
        <span className="reply"><Link to={replyUrl}>回复</Link></span>
      </div>
    );
  }
});
var Comment = React.createClass({
  render: function () {

    return (
      <div className="comment">
        <CommentHeader author={this.props.comment.author} likedCount={this.props.comment.likedCount}/>
        <CommentContent>{this.props.comment.text}</CommentContent>
        <CommentFooter comment_id={this.props.comment.id}/>
        {this.props.children}
      </div>
    );
  }
});

export default Comment;
