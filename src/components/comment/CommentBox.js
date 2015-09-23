/**
 * Created by chunwei on 2015/9/12.
 */

import './comment.css';

import $ from 'jquery';
import React from 'react';
import CommentList from './CommentList.js'
import CommentBar from './CommentBar.js'
import RSVP from '../utils/common.js'

var CommentBox = React.createClass({
  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      data:{params:JSON.stringify(RSVP.getSelectParams())},
      success: function (res) {
        if(res&&res.Status=="Success") {
          this.setState({data: res.Result,hasmore:res.Result.length>=RSVP.config.pagesize});
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadMore: function () {
    var params=RSVP.getSelectParams();
    params.page+=1;
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      data:{params:JSON.stringify(params)},
      success: function (res) {
        if(res&&res.Status=="Success") {
          this.setState({data: this.state.data.concat(res.Result),hasmore:res.Result.length>=RSVP.config.pagesize});
          RSVP.config.page=params.page;
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function (comment,pId) {
    var comments = this.state.data;
    //let pId=comment.parentId;
    if(pId&&pId!=0){
      var parentComment=RSVP.getCommentById(comments,pId);
      comment.parentId =parentComment.id;
      var ppid=parentComment.parentId;
      comment.syncId=(ppid&&ppid!=0&&ppid!="0")?ppid:parentComment.id;
      comment.toOpenid=parentComment.author.openid;
      comment.toAppid=parentComment.author.appid;
      comment.toWho=parentComment.author.name;

      var syncComment=RSVP.getCommentById(comments,comment.syncId);
      if(!!!syncComment.replys)syncComment.replys=[];
      syncComment.replys.push(comment);
    }else{
      comment.parentId =0;
      comment.syncId=0;
      comment.toOpenid='';
      comment.toAppid='';
      comment.toWho='';

      comments.push(comment);
    }

/*    if(pId&&pId!=0){//这是回复评论
      var parentComment;
      for(var item of comments){
        if(item.id==pId) {
          parentComment=item;
          break;
        }
      }
      if(parentComment.replys==undefined)parentComment.replys=[];
      parentComment.replys.push(comment);
    }else{
      comments.push(comment);
    }*/
    //var newComments = comments.concat([comment]);
    this.setState({data: comments});


    $.ajax({
      url: this.props.inserturl,
      dataType: 'json',
      type: 'POST',
      data: {params:JSON.stringify(comment)},
      success: function (res) {
        if(res.Status=="Success") {console.log(res);
          //this.setState({data: data});
          var comment=res.Result[0];
          if (comment && comment.tempid) {
            var old = RSVP.getCommentById(comments, comment.tempid);console.log(old);
            old.id = comment.id;
            old.author = comment.author;
            this.setState({data: comments});
          }
        }
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
  getCommentById: function (id) {
    return RSVP.getCommentById(this.state.data,id);
  },
  getInitialState: function () {
    return {
      data: [],
      hasmore:false,
      route: window.location.hash.substr(1)
    };
  },
  componentDidMount: function () {
    this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function () {
    let children=this.props.children;
    //console.log('Children.count=',React.Children.count(children));
    React.Children.forEach(children,function (child,i) {
      //console.log('child=',child);
      //console.log('thisArg=',this);
      child.props.onCommentSubmit=this.handleCommentSubmit;
      child.props.getCommentById=this.getCommentById;
    },this);
    var loadMoreBtn=this.state.hasmore?<div className="LoadMoreBtn" onClick={this.loadMore}>加载更多</div>:null;
    return (
      <div className="commentBox">
        <h4>精华评论</h4>
        <CommentList data={this.state.data}/>
        {loadMoreBtn}
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
