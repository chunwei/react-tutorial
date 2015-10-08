/**
 * Created by chunwei on 2015/9/13.
 */

import React from 'react';
import { Router, Route, IndexRoute, Link } from 'react-router';
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

var AppDefault = React.createClass({
  render: function () {
    return null;
  }
});

var onEnterRoot=function(nextState, replaceState){
  //console.log("onEnterRoot");
  //console.log("nextState",nextState);
  //console.log("replaceState",replaceState);
  var hash = nextState.location.pathname.replace('/','#');
  if (hash&&hash.length>1) {console.log("hash=",hash);
      var element = document.querySelector(hash);
      if (element) {console.log("scrollIntoView");
        element.scrollIntoView();
      }
  } else {
    window.scrollTo(0, 0);
  }
};


var onTouchMove=function(e) {//console.log('onTouchMove');
  e.preventDefault();
  e.stopPropagation();
};
var onEnter=function(){
  console.log("onEnter");
  document.body.addEventListener('touchmove', onTouchMove, false);
};
var onLeave=function(){
  console.log("onLeave");
  document.body.removeEventListener('touchmove', onTouchMove);
};
var routes=<Route path="/" component={App} onEnter={onEnterRoot} >
            /*<IndexRoute component={AppDefault} />*/
            <Route path="post" component={CommentForm} onEnter={onEnter} onLeave={onLeave}/>
            <Route path="reply/:id" component={CommentForm} onEnter={onEnter} onLeave={onLeave}/>
            <Route path="*" component={AppDefault}/>
          </Route>;

var router = <Router routes={routes}/>
/*reply/:id/:towho/:towhoname*/
React.render(router, document.getElementById("comments")
);
