/**
 * Created by chunwei on 2015/9/13.
 */

import React from 'react';
import { Router, Route, Link } from 'react-router';
import CommentBox from '../../components/comment/CommentBox.js';
import CommentForm from '../../components/comment/CommentForm.js';
import RSVP from '../../components/utils/common.js';

var App = React.createClass({
  render: function () {
    var url=RSVP.config.selecturl||"comments.json";
    var inserturl=RSVP.config.inserturl||"comments.json";
    return (
      <div>
        <CommentBox url={url} inserturl={inserturl} pollInterval={2000}>
        {this.props.children}
        </CommentBox>
      </div>
    );
  }
});

/*reply/:id/:towho/:towhoname*/
React.render((
    <Router>
      <Route path="/" component={App}>
        <Route path="post" component={CommentForm}/>
        <Route path="reply/:id" component={CommentForm}/>
      </Route>
    </Router>
  ), document.getElementById("comments")
);
