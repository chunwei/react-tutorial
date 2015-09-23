/**
 * Created by chunwei on 2015/9/12.
 */

import './like.css';
import React from 'react';
import $ from 'jquery';
import RSVP from '../utils/common.js'


var LikeButton = React.createClass({
  getInitialState: function () {
    return {
      liked: this.props.liked,
      count: this.props.count
    };
  },
  saveToServer: function(liked){
    var likeAction={
      commentId:this.props.commentid,
      openid:RSVP.config.openid,
      appid:RSVP.config.appid,
      like:liked?1:0
    };
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: likeAction,
      success: function (data) {
        //TODO：是否更新一下comment里的liked值，否则下次render的时候这个state会被重置，但什么情况下这个component会被重新render？
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleClick: function (event) {
    var count = this.state.count;
    if (this.state.liked) {
      count -= 1;
    } else {
      count += 1;
    }
    var newValue=this.state.liked?0:1;
    this.setState({
      liked: newValue,
      count: count
    });
    this.saveToServer(newValue);
  },
  render: function () {
    var likeClass = this.state.liked ? 'likeBtn liked' : 'likeBtn';
    var likeCount=this.state.count||0;
    var count = likeCount > 0 ? likeCount : '顶';
    return (
      <div className={likeClass} onClick={this.handleClick}>
        <span className="likeCount">{count}</span>
        <span className="icon-like"></span>
      </div>
    );
  }
});


export default LikeButton;
