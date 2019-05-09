var Crawler=require('crawler');//爬虫模块
var fs=require('fs');//创建目录以及写文件
var request=require('request');//用于写图片
var process=require('process');

var jsq=0,//计数器
    src,//jpg的url
    name,//本地创建的文件名
    l='萝莉',//搜索的关键词
    key=encodeURIComponent(l),//百度搜索的关键词转为url格式
    dir='./bdpc/'+l+new Date().getTime(),//可以自己指定，配合cons使用
    cons=true,//控制是否新建文件夹
    imgsize=true,//控制下载的是不是原图，false表示缩略图
    tim=imgsize?500:250;//控制下载时间间隔，下载原图1s，缩略图0.5s

var c=new Crawler({
    callback:function(error,res,done){
        if(jsq*60===2000)
        return ;
        if(error){
            console.log(error);
        }else{
       try{
           //捕捉返回的非json格式文件
            var js=JSON.parse(res.body).data;
            var i=0;
            var w=function(){
             if(i==js.length-1){
                 //当前json文件包含的jpg下载完毕，2s后开始新的请求
                 if(js.length<20){
                     setTimeout(function(){
                         console.log('end');
                         process.exit();
                     });
                     return ;
                 }else{
                 console.log('准备下一下载队列');
                 setTimeout(function(){
                     jsq+=1;
                 c.queue('https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&is=&fp=result&cl=2&lm=-1&ie=utf-8&oe=utf-8&word='+key+`&cg=girl&pn=${jsq*60}&rn=60`);
                 },tim*4);
                }
             }else{
             if(imgsize==true)    
             src=jiemi(js[i].objURL);//原图url
             else
             src=js[i].thumbURL;//缩略图url
             var title=js[i].fromPageTitleEnc.split(/[\/?、\*"<>|\\ ._:-\s]/).slice(0,20).join('');//得到图片名
             name=`${dir}/${jsq}_${i}_${title}.jpg`;
             var kname=name;
             request(src,function(err){
                 if(err){
                 console.log('该图片写入出出错');
                 fs.unlink(kname,function(err){
                    if(err){
                     console.log(err);
                    }else{
                     console.log('删除写入出错文件成功');
                     i+=1;
                    }
             })
                 }
             }).pipe(fs.createWriteStream(name));//写图片
                    console.log(jsq*60+i ,name);//打印第几项
                    i+=1;
             
             w();//异步爬虫
            }
         }
           w();
       }
       catch(e){
           //重新发送请求
           console.log(e);
           var ram=Math.random()*100%10;
           setTimeout(function(){
               c.queue('https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&is=&fp=result&cl=2&lm=-1&ie=utf-8&oe=utf-8&word='+key+`&cg=girl&pn=${jsq*60+ram}&rn=60`);
           },5000);
       }
        }
        done();
    },
})

if(cons){
fs.mkdir(dir,function(err){
    if(err)
    console.log('创建文件夹失败');
    else
    c.queue('https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&is=&fp=result&cl=2&lm=-1&ie=utf-8&oe=utf-8&word='+key+'&cg=girl&pn=0&rn=60');
});}else{
    c.queue('https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&is=&fp=result&cl=2&lm=-1&ie=utf-8&oe=utf-8&word='+key+'&cg=girl&pn=0&rn=60');    
}

function jiemi(url){
    //百度图片url解密函数
    var f = {   w: "a",   k: "b",   v: "c",   1: "d",   j: "e",   u: "f",   2: "g",   i: "h",   t: "i",   3: "j",   h: "k",   s: "l",   4: "m",   g: "n",   5: "o",   r: "p",   q: "q",   6: "r",   f: "s",   p: "t",   7: "u",   e: "v",   o: "w",   8: "1",   d: "2",   n: "3",   9: "4",   c: "5",   m: "6",   0: "7",   b: "8",   l: "9",   a: "0",   _z2C$q: ":",   "_z&e3B": ".",   AzdH3F: "/"   };   
    var h = /(_z2C\$q|_z&e3B|AzdH3F)/g;
    var e = url.replace(h, function(t, e) { return f[e] });   
    var s = /([a-w\d])/g;
    e = e.replace(s, function(t, e) { return f[e] });
    return e;
}
