/**
 * Created by chunwei on 2015/9/12.
 */

import React from 'react';
import RSVP from '../utils/common.js';

var CommentForm = React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var name = "我";//React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !name) {
      return;
    }
    console.log(name,text);
    var comment=RSVP.createComment();


    //comment.parentId =this.props.params.id||0;
    //comment.toWho=this.props.params.towho||'';
    comment.text=text;

    this.props.onCommentSubmit(comment,this.state.pid);
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
  },
  getCommentById: function (id) {
      return  this.props.getCommentById(id);
  },
  getInitialState: function(){
    var pid=this.props.params.id||0;
    if(pid&&pid!=0){
      var pComment=this.getCommentById(pid);
      return {pComment:pComment,pid:pid};
    }
    return {pid:pid};
  },
  render: function () {
    //var towho = this.props.params.towhoname;
    //var replyTo=towho?`回复@${towho}：`:'';
    var replyTo=this.state.pid?`回复@${this.state.pComment.author.name}：`:'';
    return (
      <div className="commentFormHolder">
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input ref="author" type="hidden"  placeholder="Your name"/>

          <p><textarea ref="text" defaultValue={replyTo} className="content-textarea" rows="5" placeholder="我有话说"></textarea></p>
          <input type="submit" value="发表评论" className="submit"/>
        </form>
      </div>
    );
  }
});

export default CommentForm;
