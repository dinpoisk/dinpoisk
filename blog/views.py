import os
from blog.models import bd_Strana,bd_Gorod
from blog import mylib
from django.http import HttpResponseRedirect, HttpResponse, FileResponse

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
  return HttpResponse('alert("error 666");')
#end

def index(request):
    s='<a href="/static/din_poisk.htm">выбор страны и города</a><br>'
    s+='<hr><a href="/add_bd_from_files/">добавить страны и города по +30 (ждать 3-5 минут)</a><br>'
    return msg(s)
#end