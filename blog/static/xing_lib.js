//utf-8  XingSoft*2018  skype: xing.polar 
//общие ф-и расширения JavaScript-глобальные! 
//замедляют, но упрощают разработку и сопровождение
//в циклах и высоко-нагруженных скриптах использовать не желательно

//(0=='') true! 000888->888   поэтому все поля s=''+s  
//ошибка объектов v=o.value;v=5 //o.value=5! v=''+o.value; нет ошибки.
//для чисел всегда надо явное преобразование через parseInt(''+n) +округл. вниз


//перед подключением желательно сделать проверку на конфликт имен
//причем все ф-и должны быть вида v=function(){} иначе они уже определены!

if(window['U']!=undefined)alert('U in use!');U=undefined;//global short name!!
if(window['D']!=undefined)alert('D in use!');D=window.document;//global short name!!


// аналог v=v || t   но 0 это не пусто, это цифра, f(n=12)-в хроме не работает
set_default=function(v,t){if(v==U)return t;return v;}

//длина вечно путаю lenght length и на питоне есть такая
len=function(v){var r,x;
 if(is_null(v))return 0;
 if(is_num(v))return len(''+v); 
 r=v.length; if(r!=U)return r;
 if(is_obj(v)){r=0;for(x in v)r++;return r;}
 return -1; //не знаю что это
}

one_simv=function(s,vStart){return s.charAt(vStart);}
//укоротить слева на n
l_short=function(s,n){var s0;
 n=set_default(n,1); 
 if(n<=0)return s;
 s0=''+s;
 return s0.substring(n);
}
//символы слева
l_simv=function(s,n){var s0;
 n=set_default(n,1); 
 if(n<=0)return '';
 s0=''+s;
 return s0.substring(0,n);
}
//укоротить справа на n
r_short=function(s,n){var s0;
 n=set_default(n,1);
 if(n<=0)return s;
 s0=''+s;
 return s0.substring(0,len(s)-n);
}
//символы справа
r_simv=function(s,n){var s0;
 n=set_default(n,1);
 if(n<=0)return '';
 s0=''+s;
 return s0.substring(s0.length-n,s0.length);
}
//символы в середине 0= до конца
m_simv=function(s,vStart,vLen){var s0,le=vLen || 0;
 vStart=set_default(vStart,0);
 s0=''+s; if(le<1)le=s0.length; 
 return s0.substring(vStart,vStart+le);
}

l_trim=function(s){var i;
 for(i=0;i<len(s);i++)if(s.charAt(i)!=' ')break;
 return l_short(s,i);
}
r_trim=function(s){var i,k=len(s)-1;
 for(i=0;i<len(s);i++)if(s.charAt(k--)!=' ')break;
 return r_short(s,i);
}
trim=function(s){var s0=s;
 s0=r_trim(s0);s0=l_trim(s0);return s0;
}

//проверка на пусто кроме 0
is_null=function(v){var r=false;
 if(v===U || v===null || v==='')r=true; return r;
}
//проверка на пусто кроме 0
not_null=function(v){var r=true;
 if(v===U || v===null || v==='')r=false; return r;
}

//проверка типов упрощенная запись
is_str=function(v){return (typeof(v)=='string');}
is_num=function(v){return (typeof(v)=='number');}
is_obj=function(v){return (typeof(v)=='object' && v.length==U);} //{}
is_mas=function(v){return (typeof(v)=='object' && v.length!=U);} //[]
//все в строку, числа, массивы, объекты?  =JSON.stringify
to_str=function(v,d){ var s,i;
 d=set_default(d,'|');
 if(typeof(v)!='object')return v.toString();
 if(v.length!=U) return v.join(d);
 //объекты-словари
 if(JSON.stringify)return JSON.stringify(v);
 s='{';
 for(i in v)s=s+i+':"'+v[i]+'",';
 s=r_short(s)+'}'; //последн запятую удаляем
 return s;
}
//'123'->Array [ "1", "2", "3" ]
get_list=function(s){return (''+s).split('');}
//замена по карте искомое, замена  "|1|2|6|7|9|2|"
get_map=function(v,mp){var k1,k2,s='|'+v+'|',ms='|'+mp+'||';
 if(!v)return;
 k1=ms.indexOf(s);
 if(k1>=0){
  k1=ms.indexOf('|',k1+1);
  k2=ms.indexOf('|',k1+1);
  if(k2>=0){s=ms.substring(k1+1,k2);return s;} 
 }
 return v;
}
//поиск позиций подстрок идущих последовательно
parse_str=function(s,m){var i,k1,k2=0,r=[],k2o=0;
 for(i=0;i<m.length;i++){
  k1=s.indexOf(m[i],k2);if(k1<0)return m;
  k2=k1+m[i].length; r.push({k1:k1,k2:k2,s:s.substring(k2o,k1)});
  k2o=k2;//запомним
 }
 k1=len(s);k2=0;
 r.push({k1:k1,k2:k2,s:s.substring(k2o,k1)});
 return r;
}
//!!замена по позиции для setTimeout( ,***)   !!запятая еще есть если арг
replace_pos=function(s,m,ss){var r,k1,k2;
 r=find_str(s,m);//!!не доделано.
 if(r.length==3){
  k1=r[1].k2; k2=r[2].k1;
  //alert(s.substring(k1,k2))
  return s.substring(0,k1)+ss+s.substring(k2);
 }
 return s;//не меняем.
}
//нормализация текста
norma_text=function(s){var s0=s+'\n';
 s0=s0.replace(/\r\n/g,'\n');
 s0=s0.replace(/\r/g,'\n');
 s0=s0.replace(/\n\n/g,'\n');
 s0=s0.replace(/\t/g,' ');
 return s0;
}
//делит на строки текст любой ОС win=\r\n mac=\n=10 linux=\r=13
split_str=function(s,flag_del_pustye_stroki){var r,i,m=[],s0=''+s+'\n';
 s0=norma_text(s0);
 r=s0.split('\n');
 if(!flag_del_pustye_stroki)return r; //no null.
//удалить пустые строки
 for(i=0;i<len(r);i++)if(r[i]!='')m.push(r[i]);
 if(len(m)==0)m.push('-');
 return m; 
}
//запасной метод
split_dict_2mas=function(s){var k,t,i,m,wm=[],pm=[];
 m=split_str(s); 
 for(i=0;i<m.length;i++){t=m[i];if(t!=''){k=t.split('|');wm.push(k[0]);pm.push(k[1]);}}
 return {w:wm,p:pm}
}
//делаем словарь из строки-файла-скрипта
split_dict=function(s){var k,t,i,m,r;
 m=split_str(s), r={}; //'key':'val'
 for(i=0;i<m.length;i++){t=m[i];if(t!=''){k=t.split('|');r[''+k[0]]=''+k[1];}}
 return r;
}

//время 00:11:05
get_time=function(){var d;
 d=new Date(); 
 return d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
}
//псевдо случайное между min max
randomInt=function(vMin, vMax){var k;
 k=Math.round(vMin-0.5+Math.random()*(vMax-vMin+1));
 if(k<vMin)k=vMin;if(k>vMax)k=vMax;
 return k;
}
//dec->hex 00-FF
hex2=function(d){var h,lo,hi;
 h='0123456789ABCDEF';
 lo=d%16; hi=(d-lo)/16;
 return ''+h.charAt(hi)+h.charAt(lo);
}
//заменяет все, а не один! и цифры тоже
replace_old=function(s,a,b){var s0=''+s, a0=''+a, b0=''+b;
 if(inStr(a0,'+'))alert('err replace_all +');
 if(inStr(a0,'.'))alert('err replace_all .');
 if(inStr(a0,'['))alert('err replace_all [');
 if(inStr(a0,']'))alert('err replace_all ]');
 if(inStr(a0,'-'))alert('err replace_all -');
 return s0.replace(RegExp(a0, "g" ), b0);
}

replace_all=function(s,a,b){var k1,k2=0,i,s0=''+s,a0=''+a,b0=''+b,ss='',le=len(a0);
 for(i=0;i<len(s0);i++){
  k1=s0.indexOf(a0,k2);if(k1<0)break;
  ss=ss+s0.substring(k2,k1)+b0;
  k2=k1+le; //***aa^
 }
 ss=ss+m_simv(s0,k2);
 return ss;
}

del_BOM=function(s){var t=''+s;
 if(l_simv(t,3)=="\xEF\xBB\xBF")t=l_short(t,3);
 return t;
}
//вхождение строки-true  + цифра в числе тоже
inStr=function(vStr,subStr){var r;
 r=(''+vStr).indexOf(''+subStr);
 return (r>=0);
}
//вхождение в строчном массиве 5 '1+2+3+4+5'
in_mas=function(s,ss){var s0;
 s0=replace_all(s,'+','?');
 return inStr('+'+ss+'+','+'+s0+'+');
}
//объект в массив   имя тело имя тело
obj2mas=function(vObj){var x,m=[],v=[];
 for(x in vObj)if(not_null(x)){m.push(x);v.push(vObj[x]);}
 return {m:m,v:v}
}
//сравнить массивы
cmp_mas=function(m1,m2){var i,le=len(m1);
 if(le!=len(m2))return false;
 for(i=0;i<le;i++)if(m1[i]!=m2[i])return false;
 return true;
}
//прибавить массив2 к массиву1 без дублей
add_mas=function(mas1,mas2){var i,s;
 for(i=0;i<len(mas2);i++){s=mas2[i];if(!inMas(mas1,s))mas1.push(s);}
 return mas1;
}
//удаление дублей в массиве
del_dubli_mas=function(mas){return add_mas([],mas);}     

//создаем и добавляем тег(элемент)
add_tag2=function(vParTag,vNameTag){var t;
 vParTag=set_default(vParTag,D.body);
 vNameTag=set_default(vNameTag,'div');
 t=D.createElement(vNameTag);
 try{vParTag.appendChild(t);return t;}
 catch(e){alert('ошибка add_tag2:'+e);return -1;}
}
add_tag=function(vNameTag){var t;
 vNameTag=set_default(vNameTag,'div');
 t=D.createElement(vNameTag);
 try{D.body.appendChild(t);return t;}
 catch(e){alert('ошибка add_tag:'+e);return -1;}
}
add_style=function(s){var t;
 t=D.createElement('style');
 try{D.head.appendChild(t);if(s!=U)t.innerHTML=s;return t;}
 catch(e){alert('ошибка add_style:'+e);return -1;}
}

//улучшеный выбор тега по селектору   -1 все  возвр пуст строку
find_tag=function(vSelector,vNum){var a,r='';
 vSelector=set_default(vSelector,'body');
 vNum=set_default(vNum,0);
 if(!is_str(vSelector))return r;
 a=D.querySelectorAll(vSelector)
 if(vNum<0)return a;
 try{r=a[vNum]} catch(e){r=''};
 if(r==U || r==null)r='';
 return r;
}
//скрыть тег  по ид тоже можно и с # и без                        
id2el=function(o){var e=o;
 if(e)if(is_str(e)){e=e.replace('#','');e=gb_id(e);}
 return e;
}
hide_el=function(o){var e=id2el(o);
 if(e){e.style.display="none";}
}
//показать тег div
show_el=function(o){var e=id2el(o);
 if(e){
  e.style.visibility="visible";e.style.display="block"; //inline-block?
  e.style.opacity="0.9";on_top(e);//.style.zIndex=999999;
 }
}
//удалить тег
del_el=function(o){var e=id2el(o);if(e){e.remove();}}
//следующий элем в этом родителе
next_el=function(o,vNameTag){var i,e=o;
  for(i=0;i<5;i++){
   e=e.nextElementSibling;
   if(vNameTag==U)if(e!=U)return e; //любой тег
   if(vNameTag!=U)if(e!=U)if(e.nodeName==UCase(vNameTag))return e;
  }
  return ''; //не нашел
}
//предыдущий элем в этом родителе
prev_el=function(o,vNameTag){var i,e=o;
  for(i=0;i<9;i++){
   e=e.previousElementSibling; 
   if(e!=U){
    if(vNameTag==U)return e; //любой тег
    else if(e.nodeName==UCase(vNameTag))return e;
   }
  }
  return ''; //не нашел
}
//для отладки в консоли и заголовок стр
log=function(s){
 window.console.log(''+s)
 if(typeof(s)=='object')window.console.log(s)
 if(is_str(s))D.title=s;
}
//на основе чужого примера- запуск скрипта по урл.
run_js_FlagError=1; //global var
run_js=function(vPathScript,vFuncEnd,arg){var sc;
 sc=D.createElement('script');
 sc.src=''+vPathScript; D.head.appendChild(sc);//запуск немедленно
 sc.onerror=function(){log('нет файла='+vPathScript+': error in run_js');}
 sc.onload=function(){
  if(!this.executed){ // выполнится только один раз
   this.executed=true;
   //alert("Загрузка внешнего скрипта завершена:")
   run_js_FlagError=0;
   if(vFuncEnd)setTimeout(vFuncEnd,0,arg); //выполнить следом с аргументом
  }
 }
 sc.onreadystatechange=function(){var self=this;
  if(this.readyState == "complete" || this.readyState == "loaded"){
   setTimeout(function(){self.onload()}, 0);// сохранить "this" для onload
  }
 }
}

//аналог VB и короче
UCase=function(s){return (''+s).toUpperCase();}
LCase=function(s){return (''+s).toLowerCase();}
//стили из скрипта
set_css=function(o,css){if(o){o.style.cssText+= css;}} 
set_color=function(o,rgb){if(o){o.style.color=rgb;}}
set_bg=function(o,rgb){if(o){o.style.backgroundColor=rgb;}}
set_border=function(o,rgb){if(o){o.style.outline='1px solid '+rgb;}}
set_fsize=function(o,vSize){if(o){o.style.fontSize=vSize+'em';}}
set_focus=function(o){if(o){o.focus();}}
set_prozr=function(o,vProzr){if(o){o.style.opacity=vProzr;}}

set_pm0=function(o){set_css(o,'padding:0 0 0 0;margin: 0 0 0 0');}
set_fix_xy=function(o,x0,y0){set_css(o,'position:fixed;left='+x0+'px;top='+y0+'px');}

//ищем теги=элементы на странице хтмл, быстрее find_tag в 5 раз
gb_id=function(s){var s0=s+''; 
 if(l_simv(s0)=='#')s0=l_short(s0);
 return D.getElementById(''+s0) || '';
}
que=function(s){return D.querySelectorAll(''+s);} //mas
gb_name=function(v){return D.getElementsByTagName(''+v);}
//class CSS -не путать с классом JS
gb_class=function(v){return D.getElementsByClassName(''+v);} 
gb_xy=function(x,y){return D.elementFromPoint(x,y);}
get_body=function(){var z='';
 try {z=''+D.getElementsByTagName("body")[0].innerHTML;} catch(e){};return z;
}
get_head=function(){var z='';
 try {z=''+D.getElementsByTagName("head")[0].innerHTML;} catch(e){};return z;
}

//--txt кодеры--utf-8!--------------------
maska_09='0123456789';
maska_az='abcdefghijklmnopqrstuvwxyz';
maska_AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
maska_a9=maska_09+maska_az+maska_AZ;
maska_rus='абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
maska_RUS='АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
maska_lr9=maska_a9+maska_rus+maska_RUS;
maska_hex='0123456789ABCDEF';
maska_31='\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0B\x0C\x0D\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F';

simv2FF=function(w,d){var k;
 d=set_default(d,'%');
 k=w.charCodeAt(0); if(k<128)return d+hex2(k);
 //%D1%84
 return window.encodeURIComponent(w).replace(/%/g,d);
}
//lat+ -FF-FF
str2FF=function(s,vMaska,d){var r='',i,w;
 if(inStr(vMaska,d))alert('err d in maska');
 vMaska=set_default(vMaska,maska_a9+'._@-');
 d=set_default(d,'%');
 for(i=0;i<len(s);i++){w=s.charAt(i);if(!inStr(vMaska,w))w=simv2FF(w,d);r=r+w;}
 return r;
}
//кодирование всех без разделителя!
str_FF=function(s){var r='',i,w;
 for(i=0;i<len(s);i++){w=s.charAt(i);w=simv2FF(w,'');r=r+w;}
 return r;
}
//decodeURI+обработка ошибок при битых в конце строках (%D0+нет пары)
FF2str=function(s,d){var i,v,le;
 d=set_default(d,'%');
 if(d=='')return FF_str(s); //декодирование всех без разделителя.
 v=replace_all(s,d,'%');le=len(v);

 for(i=0;i<le;i++){
  try{return window.decodeURIComponent(v);}
  catch(e){v=r_short(v);}    //укорачиваем строку на 1 там мусор
 }
 return '';  
}
//декодирование всех без разделителя!  00ААFF99
FF_str=function(s){var r='',i,s0;
 s0=filtr_cut(UCase(s),maska_hex); //обрезаем битый конец
 for(i=0;i<len(s0);i=i+2)r=r+'%'+m_simv(s0,i,2);
 return FF2str(r);
}
//замена симв не в маске на d (поддчеркивание)
filtr_txt=function(s,vMaska,d){var r='',w,i,s0=''+s,m0,d0;     
 m0=''+set_default(vMaska,maska_a9+'._@-');    
 d0=''+set_default(d,'_');         //если нет в маске - меняем на _
 for(i=0;i<len(s0);i++){w=s0.charAt(i);if(m0.indexOf(w)<0)w=d0;r=r+w;}
 return r;
}
//чистит 0-31 \r\n->\n \r->\n
filtr_31=function(s){var i,w,s0=''+s+'',r='';
 s0=s0.replace(/\r\n/g,'\n');
 s0=s0.replace(/\r/g,'\n');
 s0=s0.replace(/\t/g,'    ');       //если нет в 0-31
 for(i=0;i<len(s0);i++){w=s0.charAt(i);if(maska_31.indexOf(w)<0)r=r+w;}
 return r;
}
//обрезает до первого симв не в маске
filtr_cut=function(s,vMaska){var r='',w,i,m0,s0=''+s;
 m0=''+set_default(vMaska,maska_a9+'._@-');
 for(i=0;i<len(s0);i++){w=s0.charAt(i);if(m0.indexOf(w)<0)break;r=r+w;}
 return r;
}

//рисовалки всякие и канвас тоже
draw_rect=function(x1,y1,x2,y2,vColor){var w,h,wx1,wy1,wx2,wy2,div0,cwh;
 function cwh(x1,y1,w,h,vColor){return 'position:absolute;width:'+w+'px;height:'+h+'px;left:'+x1+'px;top:'+y1+'px;background-color:'+vColor;}

 w=x2-x1+1;h=y2-y1+1; 
 wx1=x1+window.scrollX; wy1=y1+window.scrollY;
 wx2=x2+window.scrollX; wy2=y2+window.scrollY;
 
 del_el(find_tag('div#id_ramka_div1'));
 del_el(find_tag('div#id_ramka_div2'));
 del_el(find_tag('div#id_ramka_div3'));
 del_el(find_tag('div#id_ramka_div4'));

 div0=add_tag2();div0.id="id_ramka_div1";
  set_css(div0,cwh(wx1,wy1,w,2,vColor));
 div0=add_tag2();div0.id="id_ramka_div2";
  set_css(div0,cwh(wx1,wy2,w,2,vColor));
 div0=add_tag2();div0.id="id_ramka_div3";
  set_css(div0,cwh(wx1,wy1,2,h,vColor));
 div0=add_tag2();div0.id="id_ramka_div4";
  set_css(div0,cwh(wx2,wy1,2,h,vColor));
} 
//найти координаты элемента и обрисовать рамкой
find_xy=function(o,f){var v={},box,body,docEl,scrollTop,scrollLeft,clientTop,clientLeft;
 if(is_null(o))return -1;
 v.sw=window.screen.width; v.sh=window.screen.height;
 v.aw=window.screen.availWidth; v.ah=window.screen.availHeight
 v.sx1=0//window.screen.availLeft; 
 v.sy1=0//window.screen.availTop
 v.sx2=window.screen.availLeft+window.screen.availWidth-1;
 v.sy2=window.screen.availTop+window.screen.availHeight-1;
//drawRect(v.sx1,v.sy1,v.sx2,v.sy2,'0000FF');//рамка

//getCoords(o) 
  box=o.getBoundingClientRect();

  body=D.body;
  docEl=D.documentElement;
   scrollTop=window.pageYOffset || docEl.scrollTop || body.scrollTop;
   scrollLeft=window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
  clientTop=docEl.clientTop || body.clientTop || 0;
  clientLeft=docEl.clientLeft || body.clientLeft || 0;

  v.w=box.width; v.h=box.height;
  v.x1=box.left + scrollLeft - clientLeft;  
  v.y1=box.top + scrollTop - clientTop;
  v.x2=v.x1+v.w-1; v.y2=v.y1+v.h-1;
  
  if(f)draw_rect(v.x1,v.y1,v.x2,v.y2,'#FF0000');//рамка
  return v;
}
getBase64Image=function(img){var canvas,ctx,dataURL;
    canvas=D.createElement("canvas");
    canvas.width=img.width;  canvas.height=img.height;
    ctx=canvas.getContext("2d");   ctx.drawImage(img, 0, 0);
    dataURL=canvas.toDataURL("image/png", 1);//data:image/png;base64,
    //dataURL=dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    return dataURL;
}
//рисует окно с кнопкой закрыть и свернуть-
make_window=function(x1,y1,ox2,oy2,t){var w,h,x2=ox2,y2=oy2,win1,win2,s1,s2;
 if(x2<x1)x2=x1+12;if(y2<y1)y2=y1+12;w=x2-x1+1; h=y2-y1+1; 
 
 del_el('id_info_window1');del_el('id_info_window2');
 win1=add_tag2();win2=add_tag2();
 win1.id='id_info_window1';win2.id='id_info_window2';
 
 win1.style='position:fixed;'+ ' left:'+x1+'px; top:'+y1+'px; width:'+16+'px; height:'+16+'px;'+
  'cursor:pointer; background-color:#000000; color:chartreuse; z-index:999998';
 win1.innerHTML='<center>o</center>';
 win1.onclick=function(){show_el('id_info_window2');}

 win2.style='position:fixed;'+ ' left:'+x1+'px; top:'+y1+'px; width:'+w+'px; height:'+h+'px;'+
  'border:2px solid coral; background-color:#000000; color:#FFFFFF; z-index:999999';

 s2='text-align:center;cursor:pointer;width:16px;background-color:white; color:red;';
 s1='<div style="height:20px; background-color:darkblue;">';
 s1+='<div style="'+s2+';float:left;" onclick="hide_el(\'id_info_window2\');">O</div>';
 s1+='<div style="'+s2+';float:right;" onclick="del_el(\'id_info_window1\');del_el(\'id_info_window2\');">X</div></div>';
 win2.innerHTML=s1+'<div id="id_info_text1">'+t+'</div>';
 return win2;
}
//sec с начала года
get_timer=function(){var m,t,d;
 m=[0,31,28,31,30,31,30,31,31,30,31,30,31]; 
 d=new Date(); 
 t=24*(m[d.getMonth()]+d.getDate()-1)+ 60*60*d.getHours()+60*d.getMinutes()+d.getSeconds();
 delete d;
 return t;
}

add_kav=function(s){return '"'+s+'"';}
del_kav=function(s){var s0=''+s,le=len(s0),z1=l_simv(s),z2=r_simv(s);
 if(((z1=="'") && (z2=="'"))||((z1=='"') && (z2=='"')))return m_simv(s0,1,le-2); //"1234" le=6 
 return s0;//не было кавычек
} 
//вертим картинку 
rotate_img=function(o,deg){o.style.cssText='transform:rotate3d(0,0,1, '+deg+'deg);-webkit-transform:rotate3d(0,0,1, '+deg+'deg)';}
//----ф-и для локалсторе типа куки
clear_LocSt=function(){localStorage.clear();}
save_LocSt=function(vName, v){
 if(!isLocSt())return -1;
 try {localStorage.setItem(''+vName, ''+v);} 
 catch(e){if(e==QUOTA_EXCEEDED_ERR)alert('Превышен лимит LocalStorage');}
}
load_LocSt=function(vName){var r;
 if(!isLocSt())return '';
 r=localStorage.getItem(''+vName);
 if(r==U)r='';
 return ''+r;
}
isLocSt=function(){
 try{return 'localStorage' in window && window['localStorage'] !== null;} 
 catch(e){return false;}
}

//ускоряем таймеры в ф-х по имени или в цикле по windows
//!!тут подумать надо с именами 2 вар.
fast_timers=function(n){var i,u,s,m;
  n=set_default(n,'33');
  m=get_all_fun();
  for(i=0; i<len(m);i++){
   u=m[i]; if(window[u].name!=u)alert(u);
   s=''+window[u]; //"function da1(){D.title='-'+gN1;gN1++;setTimeout(da1,1000);}"
   if(inStr(s,'setTimeout(')){alert(u)
    s=replace_pos(s,['setTimeout(',',',');'],''+n);
    eval(s); //function aa(){}  ?? aa:function(){}
   }
  }
}
//язык браузера по умолчанию
get_lang=function(){var r=LCase(navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage);return l_simv(r,2);}
//код клавиши или имя
get_key_kod=function(e){var ms,k;
 k== e.keyCode || e.which; k=''+k;
 ms='13|Enter|27|Esc|8|BS|9|Tab|32|Space|33|PgUp|34|PgDn|36|Home|35|End|38|Up|40|Down|37|Left|39|Right|48|Num0|65|A';
 return get_map(k,ms);
}

//a.a@a-a.aa
is_email=function(s){var s0=''+s,r=false,s1,s2;
 if(!inStr(s,'@'))return r;
 s0=s0.split('@');s1=s0[0];s2=s0[1];
 if(len(s1)<2)return r;
 s0=filtr_cut(s1,maska_a9+'.-_'); if(s1!=s0)return r;

 if(!inStr(s2,'.')) return r;
 s0=s2.split('.');s1=s0[0];s2=s0[1];
 if(len(s2)<2)return r; if(len(s1)<2)return r;
 s0=filtr_cut(s1,maska_a9+'-_'); if(s1!=s0)return r;
 s0=filtr_cut(s2,maska_a9+''); if(s2!=s0)return r;
 return true; 
}

disable_el=function(o){if(o)o.disabled=true;}
enable_el=function(o){if(o)o.disabled=false;}


msg=function(t1,t2,t3,t4,t5){var s=''+t1; 
 if(t2!=U)s+='|'+t2; 
 if(t3!=U)s+='|'+t3;
 if(t4!=U)s+='|'+t4;
 if(t5!=U)s+='|'+t5;
 alert(s);
}
asc=function(w){return w.charCodeAt(0);} //asc('A') 65   VB
chr=function(n){return String.fromCharCode(n);} //  chr(65) A

filtr_09=function(s){var w,i,r='',le=len(s);
 for(i=0;i<le;i++){w=s.charAt(i);if(inStr('1234567890',w))r+=w;}
 return r;
}
//-----SELECT4------
sel4_busy=false; //global
filtr_slov='---|SH (Ш)|CH (Ч)|JA (Я)|YA (Я)|ZH (Ж)|---|A|B (Б)|C (Ц)|D (Д)|E|F (Ф)|G (Г/Ж)|H (Х)|I (И)|J (Й/ДЖ)|K|L (Л)|M|N (Н)|O|P (П)|Q (Ю)|R (Р)|S (С)|T|U (У)|V (В)|W (Ш/Щ)|X (Ж)|Y (Ы)|Z (З)';
filtr_slov1='---|MA|SA|ST|BA|CA|MO|LA|HA|KA|CH|BE|PO|CO|PA|WA|TA|BR|AL|RO|BO|NE|MI|GR|LE|HO|WE|NO|ME|KI|NA|LO|SO|LI|KO|TO|BU|SH|VI|SE|HE|WI|DE|PE|RA|AR|VA|SU|RI|GA';
filtr_slov2='---|А|Б|В|Г|Д|Е|Ё|Ж|З|И|Й|К|Л|М|Н|О|П|Р|C|Т|У|Ф|Х|Ц|Ч|Ш|Щ|Э|Ю|Я';

sel4_num=function(o){return o.options.selectedIndex;}
sel4_id=function(o){
 if(o)if(o.options.length>0){
  return ''+o.options[o.options.selectedIndex].value;
 }
 return '?';
}

sel4_val=function(o,n){var r=''; 
 if(o)if(o.options.length>0){
   r=o.options[o.options.selectedIndex].text;//выбранный
   if(is_num(n))r=o.options[n].text;
   if(n=='last')r=o.options[o.options.length-1].text;//последний
 };
 if(r=='---')r=''; 
 return r;
}

sel4_len=function(o){if(o)return o.options.length;}

sel4_clear=function(o){if(o)o.options.length=0;} //clear list

sel4_filtr=function(o,m){var el,i,m0=filtr_slov.split('|');
 m=set_default(m,m0);
 sel4_clear(o);
 for(i=0;i<m.length;i++){ 
   el=D.createElement('option'); o.appendChild(el);
   el.value=i; el.text=m[i];
 }
}

sel4_fill_fi2=function(o0,o1,o2){var le,k,t,i,el,d=['---'];
 if(sel4_val(o2)!='')return;
 if(sel4_len(o0)>499){d.push('-all-');}
 t=del_skobki(sel4_val(o1));
 k=t.length+1;
 le=o0.options.length;
 if(le>500)le=500;
 o2.options.length=0;//clear fil-2
 for(i=0;i<le;i++){
  t=''+o0.options[i].text;if(t=='---')continue;
  t=t.substring(0,k); t=t.toUpperCase();
  if(d.indexOf(t)<0)d.push(t);
 }
 d.push('-all-');
 sel4_filtr(o2,d);
}

add_mas_id=function(m){var i,r=[]; 
 for(i=0;i<m.length;i++)if(m[i]!='')r.push(''+(i+1)+'|'+m[i]);//1+
 return r;
}

del_skobki=function(s){var k=s.indexOf(' (');return (k<0)?s:s.substring(0,k);}
//заполнить селект без фильтров
sel4_fill0=function(o,m,vMax){var t,r,i,le=m.length;
 if(vMax)if(le>vMax)le=vMax; //ограничение 500 первых/ 0=все
 o.options.length=le+1; 
 o.options[0].value='0'; o.options[0].text='-';
  r=1;//бегунок
  for(i=0;i<le;i++)if(m[i]!=''){
   t=m[i]+'||'; t=t.split('|');
   o.options[r].value=t[0]; o.options[r].text=t[1]; o.options[r].title=m[i];
   r++;
  }
 o.options.length=r;//если были пустые строки то в конце будет мусор от старого! 
}

sel4_fill=function(o,m,fi1,fi2){var k,s,t,i,fi,mx=500,le=len(m)+1,mm;
 if(sel4_busy){log('busy!');return -1;}
 sel4_busy=true; 

 fi=sel4_val(fi2);
 if(fi=='-all-'){fi='';if(le>mx)mx=le;} //снять огранич 500 
 if(fi=='')fi=del_skobki(sel4_val(fi1));

//длина селекта=длине массива+1 на первую пустышку
 if(fi=='')sel4_fill0(o,m,mx); //без фильтра = все что в массиве есть+1 первый
 else{
  fi=fi.toUpperCase();k=fi.length;mx=le;  //id|name|**
  mm=[];
  for(i=0;i<m.length;i++)if(m[i]!=''){
   t=m[i]+'||'; t=t.split('|');s=t[1].substring(0,k);
   if(fi==s.toUpperCase())mm.push(m[i]);
  }
  sel4_fill0(o,mm,mx);  
 }
i=o.options.length;
log('leo:'+i+' mx:'+mx);
if(i>0)o.options.selectedIndex=0
 s='#EA2CE1';if(i<=mx)s='green';  
 o.style.border="1px solid "+s;
 sel4_busy=false;o.style.dislpay='inline-block';
}


col=function(s,n){if(s)return (''+s).split('|')[n] || '';return '';}
row=function(s,n){if(s)return split_str(''+s,1)[n] || '';return '';}

parse1=function(s0,s1,s2){var k1,k2;//найти между s1 и s2
 s1=set_default(s1,'|');  s2=set_default(s2,'\n'); 
 if(!s0)return '';
 k1=s0.indexOf(s1)+s1.length;if(k1==0)return '';
 k2=s0.indexOf(s2,k1);if(k2<0)return s0.substring(k1);
 return s0.substring(k1,k2);
}

htm=function(o){var e=''+o; //вытащить хтмл тега по ид или ел
 if(o)if(o.innerHTML)return ''+o.innerHTML;
 if(l_simv(e)=='#')e=l_short(e);
 e=gb_id(e);if(e)return ''+e.innerHTML;
 return '';
}
get_val=function(o){var e=o; //значение не зависимо от типа тега
 if(is_str(e))e=gb_id(e);
 if(!e)return '';
 if(e.nodeName=='INPUT')return ''+e.value;
 if(inStr('LABEL+BUTTON+DIV+A',e.nodeName))return ''+e.innerHTML;
 if(e.nodeName=='SELECT')return sel4_val(e);
}
//все в числа to_num('154.2фывп',1)=154
to_num=function(s,flag_okr){var f,k,s0=''+s; 
 s0=s0.replace(',','.'); f='1234567890';if(!flag_okr)f=f+'.';
 s0=filtr_cut(s0,f);
 k=Number(s0);if(isNaN(k))k=0;
 return k;
}

find_max_z_index=function(x1,y1,x2,y2,f){var b,i,j,m=999,w,x01=x1,y01=y1,x02=+x2,y02=+y2;
 b=find_xy(D.body); 
 if(x01<0)x01=0; if(y01<0)y01=0; if(x02>b.sx2)x02=b.sx2; if(y02>b.sy2)y02=b.sy2;
 if(f)draw_rect(x01,y01,x02,y02,'red');
 for(i=x01;i<=x02;i+=4)for(j=y01;j<=y02;j+=4){
  w=gb_xy(i,j);
  if(w){w=parseInt(w.style.zIndex);if(w>m)m=w;}
 }
 return m;
}
on_top=function(o){var z,b=find_xy(o);
 z=find_max_z_index(b.x1,b.y1,b.x2,b.y2,1);
 o.style.zIndex=z+1;
} 
no_cash=function(){return '?no_cash='+Math.random((new Date()).getUTCMilliseconds())}
//setTimeOut=setTimeout;
//typeOf=typeof;
xing_lib_loaded=get_timer(); //ver 1

//log=function(){} //выкл логи.
//надо - преобр в g=function(){}+проверка внутри на var всем!
//проверка на перезапись имени - запомнить имя-тело загр и сравнить.