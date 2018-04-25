import os
from blog.models import bd_Strana,bd_Gorod
from blog import mylib
from django.http import HttpResponseRedirect, HttpResponse, FileResponse
from blog.forms import fm_txt2png
from django.shortcuts import render, get_object_or_404, get_list_or_404
import requests

def msg(s):
  return HttpResponse('<!DOCTYPE html>\n<meta http-equiv="content-type" content="text/html; charset=UTF-8">\n'+s)

def ok(u,s='OK'):
  return msg('<script>alert("'+s+'");window.location="'+u+'";</script>')

def err(s):
  return msg('error=<a href="/">'+s+'</a>')

# Create your views here.
def add_bd_from_files(request):
  gg = ''
  ss = ''
  p = os.path.abspath(os.path.dirname(__file__))
  p += '/static/list_strana.js'
  mp = mylib.read_file(p,'utf-8')
  k1 = 0 #счетчик всего в файле
  k2 = 0 #счетчик всего в БД
  k3 = 0 #счетчик всего добавили
  q = bd_Strana.objects.filter()
  k2 = len(q) #всего в БД
  print(k2)
  for s in mp: #RUSSIA|RU|RURU|
    s = s+'||||'
    sm = s.split('|')
    if sm[1].strip() == '': continue
    if '`' in s: continue
    k1 += 1
    if sm[3] == '': sm[3] = 0 # рейтинг
    q = bd_Strana.objects.filter(name=sm[0])
    if len(q) == 0: # если нет такого
        bd_Strana(name=sm[0],kod2=sm[1],kod4=sm[2],rate=int(sm[3])).save()
        k3 += 1
    #end-if
  #end-for s по строкам в файле
  ss += '<br>\n'+'есть в списке='+str(k1)+' было в базе='+str(k2)+' добавлено='+str(k3)+'<br>\n'

  #return msg(ss)

  p = os.path.abspath(os.path.dirname(__file__))
  p += '/static/goroda/'
  m = mylib.read_file(p+'list.txt','utf-8')
  m1 = mylib.read_file(p+'list_done.txt')
  m1=str(m1,'utf-8')
  #добавляем в эту бд если там нет и считаем
  ss += '\n добавление в БД города <br>\n'
  k5 = 0 # добавляем по немногу
  for x in m:
    if x == '': continue
    if '|'+x+'|' in '|'+m1+'|': continue
    print(p+x)
    mp = mylib.read_file(p+x,'utf-8')
    k1 = 0 #счетчик всего в файле
    k2 = 0 #счетчик всего в БД
    k3 = 0 #счетчик всего добавили
    q = bd_Gorod.objects.filter()
    k2 = len(q) #всего в БД
    print(k2)
    for s in mp:
      s = s+'||||'
      sm = s.split('|')
      if sm[1].strip() == '': continue
      k1 += 1

      if 'list_gorod=`' in s:
        # страна name|strana_kod2
        sm[0] = sm[0].split('`')[1]
        sm[2] = sm[1]
        sm[1] = '***'
      #end-if

      if sm[3] == '': sm[3] = 0 # рейтинг
      q = bd_Gorod.objects.filter(name=sm[0])
      if len(q) == 0: # если нет такого
        strana0 = bd_Strana.objects.filter(kod2=sm[2])
        if len(strana0) == 0:
          print('err=',s)
        else:
          bd_Gorod(name=sm[0],kod3=sm[1],strana=strana0[0],rate=int(sm[3])).save(); k3 += 1
      #end-if
      if k3 > 30: break #limit 2 города от страны для демо
    #end-for s по строкам в файле
    ss += x+'<br>\n'+'есть в списке='+str(k1)+' было в базе='+str(k2)+' добавлено='+str(k3)+'<br>\n'
    if k3<30:
      gg+=x +'|'
    #'k5+=k3
    #'if k5>999: break
  #end-for x по файлам
  gg=m1+gg
  mylib.write_file(p+'list_done.txt',gg)
  return msg(ss+'\n\n'+gg)

# быстрый поиск - выдаем первые 500 начиная с этой буквы сорт по рейтингу
def api_7bd(request,bd_name,filtr0,tip0):
  print(bd_name)
  s=filtr0 # (_)=all
  if s=='_': s=''
  s=s.replace('%20',' ')
  s=s.replace('_',' ')
  ss=''

  if bd_name=='Strana':
   q=bd_Strana.objects.filter(name__startswith=s).order_by('-rate')[0:100]
   if tip0=='len': return HttpResponse("api_len="+str(len(q))+";")
   for x in q:
     ss+=str(x.id)+'|'+x.name+'|'+x.kod2+'|'+x.kod4+'\n'
  #end-if

  if bd_name[0:6]=='Gorod_':  #Gorod_RU
    k2=bd_name[6:8].upper()
    q=bd_Gorod.objects.filter(strana__kod2=k2,name__startswith=s).order_by('-rate')[0:100]
    if tip0 == 'len': return HttpResponse("api_len="+str(len(q))+";")
    for x in q:
      ss+=str(x.id)+'|'+x.name+'|'+x.kod3+'|'+x.strana.kod2+'\n'
  #end-if

  if tip0 == 'html':return msg(ss.replace('\n','<br>\n'))
  if tip0 == 'js':return HttpResponse("api_list=`\n"+ss+"`;")
  return HttpResponse(ss)
#end

def index(request):
  s='<a href="/static/din_poisk.htm">динамический выбор страны и города</a><br>'
#  s+='<hr><a href="/add_bd_from_files/">добавить страны и города по +30 (ждать 3-5 минут)</a><br>'
  s+='<hr><a href="/static/any_url.htm">кроссдоменный запрос</a><br>'

  s+='<hr><a href="/static/Mail_by_PNG.htm">ДЕМО: mail by PNG</a><br>'
  s+='<hr><a href="/txt2png/">сервис mas8_to_PNG</a><br>'

  return msg(s)
#end

def txt2png(request):
    if request.method!="POST": return render(request,'txt2png.html',{'form':fm_txt2png()})
    #POST - данные нам пришли
    form=fm_txt2png(request.POST,request.FILES)
    if not form.is_valid(): return render(request,'txt2png.html',{'form':form})
    #POST+valid form/ выше при ошибках покажем ошибки
    s=request.POST['title']
    if (s=='2018'):
      s=''+request.POST['text']
      return mylib.txt2png(s)
    return err('нет доступа')
#end

# Create your views here.
def add_bd_from_files2():
  gg = ''
  ss = ''
  p = os.path.abspath(os.path.dirname(__file__))
  p += '/static/list_strana.js'
  mp = mylib.read_file(p,'utf-8')
  k1 = 0 #счетчик всего в файле
  k2 = 0 #счетчик всего в БД
  k3 = 0 #счетчик всего добавили
  q = bd_Strana.objects.filter()
  k2 = len(q) #всего в БД
  print(k2)
  for s in mp: #RUSSIA|RU|RURU|
    s = s+'||||'
    sm = s.split('|')
    if sm[1].strip() == '': continue
    if '`' in s: continue
    k1 += 1
    if sm[3] == '': sm[3] = 0 # рейтинг
    q = bd_Strana.objects.filter(name=sm[0])
    if len(q) == 0: # если нет такого
        bd_Strana(name=sm[0],kod2=sm[1],kod4=sm[2],rate=int(sm[3])).save()
        k3 += 1
    #end-if
  #end-for s по строкам в файле
  ss += '<br>\n'+'есть в списке='+str(k1)+' было в базе='+str(k2)+' добавлено='+str(k3)+'<br>\n'

  #return msg(ss)

  p = os.path.abspath(os.path.dirname(__file__))
  p += '/static/goroda/'
  m = mylib.read_file(p+'list.txt','utf-8')
  m1 = mylib.read_file(p+'list_done.txt')
  m1=str(m1,'utf-8')
  #добавляем в эту бд если там нет и считаем
  ss += '\n добавление в БД города <br>\n'
  k5 = 0 # добавляем по немногу
  for x in m:
    if x == '': continue
    if '|'+x+'|' in '|'+m1+'|': continue
    print(p+x)
    mp = mylib.read_file(p+x,'utf-8')
    k1 = 0 #счетчик всего в файле
    k2 = 0 #счетчик всего в БД
    k3 = 0 #счетчик всего добавили
    q = bd_Gorod.objects.filter()
    k2 = len(q) #всего в БД
    print(k2)
    for s in mp:
      s = s+'||||'
      sm = s.split('|')
      if sm[1].strip() == '': continue
      k1 += 1

      if 'list_gorod=`' in s:
        # страна name|strana_kod2
        sm[0] = sm[0].split('`')[1]
        sm[2] = sm[1]
        sm[1] = '***'
      #end-if

      if sm[3] == '': sm[3] = 0 # рейтинг
      q = bd_Gorod.objects.filter(name=sm[0])
      if len(q) == 0: # если нет такого
        strana0 = bd_Strana.objects.filter(kod2=sm[2])
        if len(strana0) == 0:
          print('err=',s)
        else:
          bd_Gorod(name=sm[0],kod3=sm[1],strana=strana0[0],rate=int(sm[3])).save(); k3 += 1
      #end-if
    #end-for s по строкам в файле
    print(x+'<br>\n'+'есть в списке='+str(k1)+' было в базе='+str(k2)+' добавлено='+str(k3)+'<br>\n')
    mylib.write_file(p+'list_done.txt',x+'\n',2)
  #end-for x по файлам

  return 1


def any_url(request, pk, max_size):
  h = requests.head(pk)
  hh = h.headers
  sz = hh['content-length']
  h = ''
  for i in hh: h = h+i+'|' + hh[i]+'\n'
  h=h.replace("`","<<obr_kav>>")
  s='url0=`'+pk+'`;\n'+'head0=`'+h+'`;\n'
  if max_size=='0': return HttpResponse(s) #only header
  cont0=''
  if int(sz) < int(max_size):
    x = requests.get(pk)
    cont0 = x.content
    if type(cont0) == bytes :
      try:  cont0 = str(cont0,'utf-8');cont0=cont0.replace("`","<<obr_kav>>")
      except: cont0 = b2base16(cont0)
    #endif
  #endif
  return HttpResponse(s+'cont0=`'+cont0+'`;\n')
#end

def b2base16(b): # FF-коды только
  ss=''
  for x in b:
    c=hex(int(x))[2:] #0x3 0x55
    if len(c)==1: c='0'+c
    ss+=c
  #end-for
  return ss
#end