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

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


// UUID
var RSVP={};
RSVP.uuid_chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
RSVP.uuid=function(len,radix){var chars=RSVP.uuid_chars,uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++){uuid[i]=chars[0|Math.random()*radix]}}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]="-";uuid[14]="4";for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&3)|8:r]}}}return uuid.join("")};

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/comments.json', function(req, res) {
  fs.readFile('comments.json', function(err, comments) {
    res.setHeader('Cache-Control', 'no-cache');
    var data={Status:"Success",Result:JSON.parse(comments)};
    res.json(data);
  });
});

app.post('/comments.json', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    var comments = JSON.parse(data);console.log(req.body);console.log(req.query);console.log(req.params);
    var comment=JSON.parse(req.body.params);
    var tempid=comment.id;
    comment.id='real-'+RSVP.uuid(10);
    comment.author.name='Nick-'+RSVP.uuid(5);
    comment.author.avatar="http://tb.himg.baidu.com/sys/portrait/item/65f7696d6465766963659913";
    var pId=comment.syncId;
    if(pId&&pId!=0){//这是回复评论
      var parentComment;
      for(var item of comments){
        if(item.id==pId) {
          parentComment=item;
          break;
        }
      }
      if(!!!parentComment.replys)parentComment.replys=[];
      parentComment.replys.push(comment);
    }else{
      comments.push(comment);
    }
    //comments.push(req.body);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      comment.tempid=tempid;
      var returndata={Status:"Success",Result:[comment]};
      res.json(returndata);
    });
  });
});

app.post('/like', function(req, res) {
  fs.readFile('comments.json', function(err, data) {
    var comments = JSON.parse(data);
    var likeAction=req.body;
    var cId=likeAction.commentId;
    var like=parseInt(likeAction.like);
    var whichOne;
    if(cId) {
      for (var item of comments) {
        if (item.id == cId) {
          whichOne = item;
          break;
        }
        if(item.replys) {
          for (var reply of item.replys) {
            if (reply.id == cId) {
              whichOne = reply;
              break;
            }
          }
        }
        if(whichOne)break;
      }
      if(whichOne){
        whichOne.liked = like;
        whichOne.likedCount = parseInt(whichOne.likedCount) + (like > 0 ? 1 : -1);
      }
    }
    //comments.push(req.body);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      //res.json(comments);
      var returndata={Status:"Success",Result:comments};
      res.json(returndata);
    });
  });
});


app.listen(app.get('port'),'0.0.0.0', function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
