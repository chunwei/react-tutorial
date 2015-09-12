/**
 * Created by chunwei on 2015/9/12.
 */

import './comment.css';

import $ from 'jquery';
import React from 'react';
import CommentList from './CommentList.js'
import CommentBar from './CommentBar.js'

var CommentBox = React.createClass({
  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function (comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    window.location.hash = '';
  },
  handleOpenForm: function () {
    console.log('handleOpenForm');
  },
  handleHashChange: function () {
    console.log(window.location.hash.substr(1));
    this.setState({
      route: window.location.hash.substr(1)
    })
  },
  getInitialState: function () {
    return {
      data: [],
      route: window.location.hash.substr(1)
    };
  },
  componentDidMount: function () {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function () {

    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentBar/>
        {/*
         next we replace `<Child>` with `this.props.children`
         the router will figure out the children for us
         */}
        {this.props.children}

      </div>
    );
  }
});

export default CommentBox;
