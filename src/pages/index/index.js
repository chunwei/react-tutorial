/**
 * Created by chunwei on 2015/9/13.
 */

import React from 'react';
import { Router, Route, Link } from 'react-router';
import CommentBox from '../../components/comment/CommentBox.js';
import CommentForm from '../../components/comment/CommentForm.js';

var App = React.createClass({
  render: function () {
    return (
      <div>
        <CommentBox url="comments.json" pollInterval={2000}>
        {this.props.children}
        </CommentBox>
      </div>
    );
  }
});


React.render((
    <Router>
      <Route path="/" component={App}>
        <Route path="reply/:id" component={CommentForm}/>
      </Route>
    </Router>
  ), document.body
);
