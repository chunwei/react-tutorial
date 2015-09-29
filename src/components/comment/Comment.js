/**
 * Created by chunwei on 2015/9/12.
 */
import React from 'react';
import {Link} from 'react-router';
import LikeButton from '../like/LikeBotton.js';

import '../utils/datetime.js';

var CommentHeader = React.createClass({
  render: function () {
    var defaultAvatar = require('./user.png');
    var avatar=this.props.author.avatar||defaultAvatar;
    let tag=(this.props.showTag&&this.props.tag)?(<span className="tag">#{this.props.tag}</span>):null;
    return (
      <div>
      {tag}
      <div className="commentHeader">
        <div className="commentAuthor">
          <span className="avatar"><img src={avatar}/></span>
          <span className="author">{this.props.author.name||"游客"}</span>
        </div>
        <LikeButton liked={this.props.liked} count={this.props.likedCount} commentid={this.props.id}/>
      </div>
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
    let pid=this.props.pid;
    let towho=this.props.towho;
    let towhoname=this.props.towhoname;
    let replyUrl=`/reply/${this.props.id}`;//`/reply/${pid}/${towho}/${towhoname}`;
    let time=new Date(this.props.time).toRelativeTime();
    let link=((this.props.id+'').substr(0,2)=='__')?'':<Link to={replyUrl}>回复</Link>;
    return (
      <div className="commentFooter">
        <span className="time">{time}</span>
        <span className="reply">{link}</span>
      </div>
    );
  }
});
var Comment = React.createClass({
  render: function () {
    let comment=this.props.comment;
    let liked=(comment.liked&&parseInt(comment.liked))||0;
    let pid=this.props.pid?this.props.pid:comment.id;
    return (
      <div className="comment">
        <CommentHeader author={comment.author} liked={liked} likedCount={comment.likedCount} id={comment.id} showTag={this.props.showTag} tag={comment.tag}/>
        <CommentContent>{comment.text}</CommentContent>
        <CommentFooter id={comment.id} pid={pid} towho={comment.author.id} towhoname={comment.author.name} time={comment.time} />
        {this.props.children}
      </div>
    );
  }
});

export default Comment;
