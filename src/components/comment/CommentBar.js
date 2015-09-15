/**
 * Created by chunwei on 2015/9/12.
 */

import React from 'react';
import {Link} from 'react-router';

var CommentBar = React.createClass({
  render: function () {
    return (
      <div className="commentBar">
        <Link to='/reply/0' className="BtnOpenForm">我也来说说</Link>
      </div>
    )
  }
});

export default CommentBar;
