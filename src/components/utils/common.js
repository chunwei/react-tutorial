/**
 * Created by luchunwei@gmail.com on 2015/9/17.
 */

import $ from 'jquery';

var RSVP={};

// 上下文参数
RSVP.config={};
(function(){
  "baseurl,selecturl,inserturl,likeurl,openid,appid,uuid".split(",").forEach(function (meta) {
    RSVP.config[meta]=$('meta[name=rsvp-'+meta+']').attr('content') || '';
  });
  RSVP.config.selecturl=RSVP.config.baseurl+RSVP.config.selecturl;
  RSVP.config.inserturl=RSVP.config.baseurl+RSVP.config.inserturl;
  RSVP.config.likeurl=RSVP.config.baseurl+RSVP.config.likeurl;
  RSVP.config.page=0;
  RSVP.config.pagesize=10;
})();

// UUID
RSVP.uuid_chars="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
RSVP.uuid=function(len,radix){var chars=RSVP.uuid_chars,uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++){uuid[i]=chars[0|Math.random()*radix]}}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]="-";uuid[14]="4";for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&3)|8:r]}}}return uuid.join("")};

RSVP.createComment=function(){
  return {
    id:"__"+this.uuid(10),
    uuid:this.config.uuid,
    author:{id:this.config.openid, appid:this.config.appid,name:"我"},
    time:new Date()
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
RSVP.getCommentById= function (comments,id) {
  if (!comments || !id) return null;
  var whichOne;
  for (var item of comments) {
    if (item.id == id) {
      whichOne = item;
      break;
    }
    if (item.replys) {
      for (var reply of item.replys) {
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
export default RSVP;
