/**
 * Created by chunwei on 2015/9/12.
 */

import './like.css';
import React from 'react';


var LikeButton = React.createClass({
  getInitialState: function () {
    return {
      liked: this.props.liked,
      count: this.props.count
    };
  },
  handleClick: function (event) {
    var count = this.state.count;
    if (this.state.liked) {
      count -= 1;
    } else {
      count += 1;
    }
    this.setState({
      liked: !this.state.liked,
      count: count
    });
  },
  render: function () {
    var likeClass = this.state.liked ? 'likeBtn liked' : 'likeBtn';
    var count = this.state.count > 0 ? this.state.count : '顶';
    return (
      <div className={likeClass} onClick={this.handleClick}>
        <span className="likeCount">{count}</span>
        <span className="icon-like"></span>
      </div>
    );
  }
});


export default LikeButton;
