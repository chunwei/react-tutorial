/**
 * Created by luchunwei@gmail.com on 2015/9/17.
 */

import $ from 'jquery';
import Cookies from 'js-cookie';

var RSVP={};

// 上下文参数
RSVP.config={};

var _UA = navigator.userAgent;
var ISiPhone = !!_UA.match(/iPhone/i);
var ISiOS = ISiPhone || !!_UA.match(/iPad/i);
var ISWP = !!_UA.match(/Windows\sPhone/i);
var ISAndroid = !!_UA.match(/Android/i);
var ISWeixin = !!_UA.match(/MicroMessenger/i);

// UUID
RSVP.uuid_chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
RSVP.uuid=function(len,radix){var chars=RSVP.uuid_chars,uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++){uuid[i]=chars[0|Math.random()*radix]}}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]="-";uuid[14]="4";for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&3)|8:r]}}}return uuid.join("")};

// URL参数获取
RSVP.urlp=function(key, qstring){
  qstring = qstring || window.location.search;
  if (!qstring) return (!key || key == '*') ? {} : null;
  qstring = qstring.replace(/%20/g, ' ');
  qstring = qstring.substr(1); // remove ? or #
  var param = qstring.split('&');
  var map = new Object();
  for (var i = 0, j = param.length; i < j; i++){ var pl=param[i].split('='); map[pl[0]] = pl[1]; }
  return (!key || key == '*') ? map : map[key];
};

RSVP.createComment=function(){
  var uuid=this.config.uuid;
  if(uuid.indexOf('_Add'))uuid=uuid.substr(0,uuid.indexOf('_Add'));
  return {
    id:"__"+this.uuid(10),
    uuid:this.config.uuid,
    targetId:this.config.uuid,
    tag:this.config.tag,
    author:{id:this.config.openid, appid:this.config.appid,name:"我"},
    time:new Date().getTime()
  };
};
RSVP.getSelectParams=function(){
  return {
    openid:this.config.openid,
    appid:this.config.appid,
    uuid:this.config.uuid,
    page:this.config.page,
    pagesize:this.config.pagesize
  };
}
RSVP.getCommentById= function (comments,id) {//console.log("getCommentById");
  if (!comments || !id) return null;
  var whichOne;//console.log("comments=>",comments);
  for (var i=0;i<comments.length;i++) {//console.log("i=>",i);
    var item=comments[i];//console.log("item=>",item);
    if (item.id == id) {
      whichOne = item;
      break;
    }
    if (item.replys) {
      for (var j=0;j<item.replys.length;j++) {//console.log("j=>",j);
        var reply=item.replys[j];//console.log("reply=>",reply);
        if (reply.id == id) {
          whichOne = reply;
          break;
        }
      }
    }
    if (whichOne)break;
  }
  return whichOne;

};
RSVP.checkOpenId= function () {
  console.log("openid=%s, length=%d",this.config.openid,this.config.openid.length);
  var openidKey='rsvp-comment-openid';
  var openid=this.config.openid;
  if (!!!openid) openid=Cookies.get(openidKey);
  if (!!!openid) openid = window.localStorage.getItem(openidKey);
  //console.log('openid=',openid);
  //console.log('appid=',RSVP.config.appid);
  //console.log('ISWeixin=',ISWeixin);
  //多公众号时js回调url很难统一
  // 带有userappid并且为认证公众号会自动获取openid
/*  if (!!!openid && !!RSVP.config.appid && ISWeixin) {

    var code = RSVP.urlp('code');
    if (!!code) {
      var RQX = {'code': code};
      $.getJSON('http://faxiaobot.cn/wxservice/wx/get_openid', RQX, function (data) {
        if (!!data && !!data.openid) {
          openid = data.openid;
          //$.cookie(openid_key, openid, { expires:360, path:'/' });
          //if (window.localStorage) window.localStorage.setItem(openid_key, openid);

          var loc = location.href;
          loc = loc.replace('code=' + code, '');
          location.href = loc;

        } else {
          console.log('无效请求。请从微信访问');
        }
      });
    } else {
      // 去授权
      var SNSAPI_SCOPE = 'snsapi_base';//snsapi_base;snsapi_userinfo
      var redirect_url = location.href.split('#')[0];  // remove hash
      var oauth_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + RSVP.config.appid + '&redirect_uri=' + encodeURIComponent(redirect_url) + '&response_type=code&scope=' + SNSAPI_SCOPE + '#wechat_redirect';
      location.href = oauth_url;
    }
  }*/
  //if (!!!openid) openid=Cookies.get(openidKey);
  //if (!!!openid) openid = window.localStorage.getItem(openidKey);
  if (!!!openid) openid='__'+RSVP.uuid(26);
  if(!!openid){
    RSVP.config.openid=openid;
    Cookies.set(openidKey,openid,{expires: 30});//单位：天
    window.localStorage.setItem(openidKey,openid);
  }

};

(function(){
  "baseurl,selecturl,inserturl,likeurl,openid,appid,uuid,tag,showCommentTag".split(",").forEach(function (meta) {
    RSVP.config[meta]=$('meta[name=rsvp-'+meta+']').attr('content') || '';
  });
  RSVP.config.selecturl=RSVP.config.baseurl+RSVP.config.selecturl;
  RSVP.config.inserturl=RSVP.config.baseurl+RSVP.config.inserturl;
  RSVP.config.likeurl=RSVP.config.baseurl+RSVP.config.likeurl;
  RSVP.config.page=0;
  RSVP.config.pagesize=10;
  RSVP.checkOpenId();
})();


export default RSVP;
