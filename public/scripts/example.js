/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var LikeButton = React.createClass({
  getInitialState: function() {
    return {
      liked: this.props.liked,
      count: this.props.count
    };
  },
  handleClick: function(event) {
    var count=this.state.count;
    if(this.state.liked){
      count-=1;
    }else{
      count+=1;
    }
    this.setState({
      liked: !this.state.liked,
      count:count
    });
  },
  render: function() {
    var likeClass = this.state.liked ? 'likeBtn liked' : 'likeBtn';
    var count=this.state.count>0?this.state.count:'顶';
    return (
      <div className={likeClass} onClick={this.handleClick}>
        <span className="likeCount">{count}</span>
        <span className="icon-like"></span>
      </div>
    );
  }
});

var CommentHeader = React.createClass({
  render: function() {
    return (
      <div className="commentHeader">
        <div className="commentAuthor">
          <span className="avatar"><img src="../img/user.png"/></span>
          <span className="author">{this.props.author}</span>
        </div>
        <LikeButton liked={false} count={this.props.likedCount}/>
      </div>
    );
  }
});
var CommentContent = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="commentContent">
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
var CommentFooter = React.createClass({
  render: function() {
    return (
      <div className="commentFooter">
        <span className="time">25分钟前</span>
        <span className="reply"><a href='#/reply'>回复</a></span>
      </div>
    );
  }
});
var Comment = React.createClass({
  render: function() {

    return (
      <div className="comment">
        <CommentHeader author={this.props.comment.author} likedCount={this.props.comment.likedCount}/>
        <CommentContent>{this.props.comment.text}</CommentContent>
        <CommentFooter/>
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    window.location.hash='';
  },
  handleOpenForm:function(){
    console.log('handleOpenForm');
    //$('.commentFormHolder').show();//.css('display','block');
  },
  handleHashChange:function() {console.log(window.location.hash.substr(1));
    this.setState({
      route: window.location.hash.substr(1)
    })
  },
  getInitialState: function() {
    return {
      data: [],
      route:window.location.hash.substr(1)
    };
  },
  componentDidMount: function() {
    window.addEventListener('hashchange', this.handleHashChange);
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {

    var CommentFormA;console.log('render',this.state.route);
    switch (this.state.route) {
      case '/post': CommentFormA = CommentForm; break;
      case '/reply': CommentFormA = CommentForm; break;
      default:      CommentFormA = CommentFormBlank;
    }
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentBar onOpenForm={this.handleOpenForm}/>
        <CommentFormA onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Comment author={comment.author} key={index} comment={comment}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentBar = React.createClass({
  render: function () {
    return (
      <div className="commentBar">
        <a href='#/post' className="BtnOpenForm" onClick={this.props.onOpenForm}>我也来说说</a>
      </div>
    )
  }
});
var CommentFormBlank = React.createClass({
  render: function() {
    return (<br/>);
  }
});
var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text = React.findDOMNode(this.refs.text).value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text,likedCount:0});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.text).value = '';
  },
  render: function() {
/*    var id = this.props.params.id;
    console.log('key=',id);*/
    return (
      <div className="commentFormHolder">
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input ref="author" type="text" placeholder="Your name"  />
          <p><textarea ref="text" className="content-textarea" rows="5" placeholder="你有什么看法呢？"></textarea></p>
          <input type="submit" value="发表评论" className="submit" />
        </form>
      </div>
    );
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);


/*var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

React.render((
  <Router>
    <Route path="/" component={CommentBox} >
      <Route path="post" component={CommentForm} />
      <Route path="reply/:id" component={CommentForm} />
    </Route>
  </Router>
  ),  document.getElementById('content')
);*/
