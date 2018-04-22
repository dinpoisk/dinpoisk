# -*- coding: utf-8 -*-
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
from PIL import Image
import xlsxwriter
import time
import random
from django import forms
from io import BytesIO


def send_email1(subject,message,from_email,to_email):
 # subject=request.POST.get('subject','')
 # message=request.POST.get('message','')
 # from_email=request.POST.get('from_email','')
 if subject and message and from_email:
  try: send_mail(subject, message, from_email, [to_email])
  except  BadHeaderError:  return HttpResponse('Кривой заголовок-хакнули.')
  return HttpResponseRedirect('/contact/thanks/')
 else:
  # In reality we'd use a form class
  # to get proper validation errors.
  return HttpResponse('не все поля заполнены правильно.')


# -----lib-------------------
def dump(o):
    s = ''
    for x in o:
        s = s+str(x)+':'+str(o[x])+'|'
    print(s)
    return s
#end


def exist_file(f):
  try:
   f0=open(f,'rb')
   f0.close()
   return True
  except FileNotFoundError:
    return False
#end

def read_file(f, kodirovka=''):
  r = b''
  if exist_file(f):
    f0 = open(f, 'rb')
    r = f0.read()
    f0.close()
  #enf-if
  if kodirovka == '': return r #binary!
  if r[0:3] == b'\xEF\xBB\xBF' : r=r[3:] #del BOM
  r=str(r,kodirovka) #1251 utf-8
  return split_str(r) #массив строк
#end

def write_file(f,b,f_rewrite=1): #перезаписывать старый
  if f_rewrite!=1 and exist_file(f): return 0
  f0 = open(f,'wb')
  if type(b) == bytes: r = f0.write(b)
  if type(b) == str : b1=bytes(b,'utf-8'); r = f0.write(b1)
  f0.close()
  return r
#end

def inStr(s0,s1): return (s0.find(s1)>=0)

def trim(s): return s.strip()

def hex2(n):
 h = hex(n % 256); m = h[2:4]
 if len(m) < 2: m = '0' + m
 return m
#end

maska_09 = '0123456789'
maska_az = 'abcdefghijklmnopqrstuvwxyz'
maska_AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
maska_a9 = maska_09+maska_az+maska_AZ
maska_rus = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
maska_RUS = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
maska_lr9 = maska_a9+maska_rus+maska_RUS
maska_hex = '0123456789ABCDEF'
maska_31 = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0B\x0C\x0D\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1D\x1E\x1F'
maska_email=maska_a9+'@-_.'
maska_text=maska_lr9+'_-+*/=().,$%@?!\'" \n'

def l_simv(s, n=1):
  if n<=0: return ''
  return s[0:n]

def l_short(s, n=1):
  if n <= 0: return s
  return s[n:]

def r_simv(s, n=1):
  if n<=0: return ''
  le=len(s);k=le-n
  if k<0:k=0
  return s[k:le]

def r_short(s, n=1):
  if n <= 0: return s
  k=len(s)-n
  if k<0:k=0
  return s[0:k]

def l_trim(s):
  for i in range(0,len(s)): #l_trim
   if s[i]!=' ':  return l_short(s,i)
  #end-for
  return ''
#end

def r_trim(s):
  le=len(s)
  for i in range(0,le): #r_trim
   if s[le-i-1]!=' ':  return r_short(s,i)
  #end-for
  return ''
#end

#для строк только! многострочные парси.
def trim_all(t):
 s=t
 s=s.replace('\n',' '); s=s.replace('\r',' '); s=s.replace('\t',' ')
 s=l_trim(s); s=r_trim(s)
 while inStr(s,'  '):  s=s.replace('  ',' ')
 return s
#end

def filtr_09(s):
  ss = ''
  for c in s:
   if c in '0123456789': ss+=c
  #end-for
  return ss
#end

def filtr_htm(t): #{{data|safe}}
  s=t
  s=s.replace('&','&amp;')
  s=s.replace('<','&lt;')
  s=s.replace('>','&gt;')
  s=s.replace("'",'&#39;')
  s=s.replace('"','&quot;')
  return s
#end

#'A-Zz-z0-9 _-+*/=().,$%@?!'
def filtr_txt(t,vMaska=maska_text,d='_'):
  s=filtr_31(t)
  ss=''
  for c in s:
   if c in vMaska: ss+=c
   else: ss+=d
  #end-for-i
  return ss
#end

#обрезает до первого симв не в маске
def filtr_cut(t,vMaska):
  ss=''
  for c in t:
    if c in vMaska: ss+=c
    else: break
  #end-for
  return ss
#end

def filtr_email(s): #lat 0-9 @_-. ost v (-FF)
 return filtr_txt(s, maska_a9+'@._-', d='')

def to_int(t): # строки/мусор это 0
  if type(t) == int:  return t
  s=str(t)
  s=filtr_cut(s,maska_09)
  if s=='':return 0
  return int(s)
#end

def parse1(s0,s1='|',s2='\n'): #найти между s1 и s2
  if s0.strip()=='': return ''
  k1=s0.find(s1)+len(s1)
  if k1 == 0:return ''
  k2=s0.find(s2,k1)
  if k2<0: return s0[k1:]
  return s0[k1:k2]
#end

def filtr_ZS(t):
  # <>[]{}\| /
  s=t
  s=s.replace('`','\'')
  s=s.replace('<','(')
  s=s.replace('>',')')
  s=s.replace('[','(')
  s=s.replace(']',')')
  s=s.replace('{','(')
  s=s.replace('}',')')
  s=s.replace('\\','/')
  s=s.replace('|','/')
  return s
#end

def norma_n(t):# нормализация перевода строк для разных ОС
  s=t
  s=s.replace('\r\n','\n');
  s=s.replace('\r','\n')
  s=s.replace('\t','    ')
  return s
#def

#чистит 0-31 \r\n->\n \r->\n
def filtr_31(t): #не надо добавлять \n в строку и менять \n\n=\n
 s=t
 ss=''
 for c in s:
   if c in maska_31: ss+='_'
   else: ss+=c
 #end-for
 return ss
#end
# делит  на  строки  текст  любой  ОС win=\r\n  mac=\n=10  linux=\r=13
def split_str(s,udalit_pustye_stroki=0):
  ss=s+'\n' #баг последней строки
  ss=norma_n(ss)
  ss=filtr_31(ss)
  m=ss.split('\n')
  if udalit_pustye_stroki==0: return m #no null массив строк точно
  #удалить  пустые  строки
  r=[]
  for s in m:
    if s.strip()!='': r.append(s.strip())
  #end-for
  if len(r) == 0: r.append('-') #no null чтобы не пустой был
  return r
#end
def col(t,n):
  if t.strip()=='': return ''
  m=t.split('|')
  if n>=len(m): return ''
  s=m[n]
  s=filtr_31(s)
  s=trim_all(s)
  s=filtr_ZS(s) #необязательно
  return s
#end
def tabl(s,w,h,d='?'): #делаем таблицу wxh
  r=[]
  for y in range(0,h):
    m=[]
    for x in range(0,w): m.append(d)
    r.append(m)
  #enf-for
  t=split_str(s)
  for y in range(0,h):
   if y>=len(t):break
   s=t[y]
   for x in range(0,w):
     v=col(s,x)
     if v!='':r[y][x]=v
    #end-if
   #enf-for-x
  #enf-for-y
  return r
#end
def norm_tel(t): #+7(999)333-11-11
  s=t
  if type(s)==int: s=str(s)
  s=filtr_09(s)
  if len(s) == 10: s='7'+s #RU
  if len(s)!=11:return s+'?' #без изменений
  return '+'+s[0:1]+'('+s[1:4]+')'+s[4:7]+'-'+s[7:9]+'-'+s[9:11]
#end
#восстанавливает битый текст
def int2utf8(n1,n2=-1):
  if n1>255 or n2>255: return ''
  try:
    if n2<0: return str(bytes([n1]),'utf-8')
    return str(bytes([n1])+bytes([n2]),'utf-8')
  except: pass
  return ''
#end

def utf8r(b):
    r=''
    k=0
    le=len(b)
    w=0
    h=0
    for i in range(0, le):
      if k>=le: break #exit for
      w=b[k];k=k+1
      if w < 128: r=r+int2utf8(w);continue
      if w==0xD0 or w==0xD1: #rus
        if k >= le: break  # exit for
        h=b[k];k=k+1
        if h<128: r=r+int2utf8(h);continue # D1*-потеряный хвост
        r=r+int2utf8(w,h)
      #end-if
    #end-for
    return r
#end

def utf8(b):
  try: return str(b, 'utf-8')
  except: return utf8r(b)
#end

def hash_str(s):
 m=list(str(s))
 k=0;i=32
 for x in m:  k=k+(ord(x)%i);  i=i+1
 return k
#end

def gen_pass(old_pass):  # генератор пароля из строки(старого)
 k=time.time();k=k-int(k);k=k*100;k=int(k%100)
 ip=hash_str(old_pass) ; random.seed(ip+k)
 s1 = list(maska_a9); random.shuffle(s1)
 psw = '' # предварительно создаем переменную psw
 for x in range(20):
  psw = psw + random.choice(s1)
  random.seed(ord(random.choice(list(psw)))*random.randint(0, 9999))
 #end_for
 return psw
#end

def send_mail2(subject, body, to_email):
#    email_message = EmailMultiAlternatives(subject, body, settings.DEFAULT_FROM_EMAIL, [to_email])
    try:
#        email_message.send()
        return 1
    except ConnectionError:
        return -1
    except ConnectionRefusedError: #BadHeader?
        return -2
#end

#без файла как то можно...
def excel(m=[['rent', 1000], ['gas', 100], ['food', 300], ['gym', 50],]):  # massiv v xlsx
    wb = xlsxwriter.Workbook(r'1.xlsx')
    ws = wb.add_worksheet()
    f = wb.add_format()
    #f. text -поле текст!!! 666
    f.set_bold()
    f.set_shrink()
    f.set_bg_color('red')
    ws.set_column('A:D', 20)
    for i in range(0, len(m[0])):
        ws.write(0, i, m[0][i],f)

    ws.write(0, i, m[0][i], f)
    for j in range(1,len(m)):
        for i in range(0,len(m[j])):
            ws.write(j,i,m[j][i])
    wb.close()
    r = HttpResponse(open(r'1.xlsx', 'rb'), content_type='file/excel')
    r['Content-Disposition'] = 'attachment;filename="1.xlsx"'
    return r


def modif_form(f, pole0, label0='', help_text0='', title0='', placeholder0=''):

    f.fields[pole0] = forms.CharField(
        label=label0,
        help_text=help_text0,
        widget=forms.TextInput(attrs={'title': title0,
                                      'required': '',
                                      'placeholder': placeholder0, }
                               ),
    )


def txt2png(s, f=r'c:\cap\1.png'):
    le = len(s)
    if le % 3 == 1: s = s + '  '
    if le % 3 == 2: s = s + ' '

    b = bytes(s, 'utf-8')
    le = len(b)
    le = int(le / 3)
    r = []
    for i in range(0, le):
        r.append((int(b[i * 3 + 0]), int(b[i * 3 + 1]), int(b[i * 3 + 2])))
    # print(r)
    img = Image.new('RGB', (le, 1), (0, 0, 0))
    img.putdata(r)
    img.save(f)
    del img
    r = HttpResponse(open(r'c:\cap\1.png', 'rb'), content_type='image/png')
    r['Content-Disposition'] = 'attachment;filename="1.png"'
    return r
#end


def te45(p='',f=''):
  #p=r'C:\_gosha-kanada\ships_cargo\blog\static\bd'
  #f=p+'\list_strana.js'

  m1=read_file(f,'utf-8')
  for y in m1:
    y=trim(y)
    if y == '': continue
    x=y.split('|')
    if len(x)>2:
      x=x[1]
      t=read_file(p+'\\goroda\\'+x)
      t=t.replace(b'\r',b'')
      t=b'list_gorod=`'+bytes(y,'utf-8')+b'\n'+t+b'\n`;'
      t=t.replace(b'\n\n',b'\n')
      t=t.replace(b'\n\n',b'\n')
      t=write_file(p+'\\goroda\\'+x+'.js',t,f_rewrite=False)
      #print(t)
      #break
#end
def add_rate(d,v):
  try:
    d[v]=d[v]+1
  except KeyError:
    d[v]=0
  #
#
def sort_dict(d):
  m=[]
  for x in d: m.append([d[x],x])
  m.sort(reverse=True)
  o={}
  for i in range(len(m)): o[m[i][1]]=m[i][0]
  return m
#

def tes5():
  p=r'C:\_gosha-kanada\ships_cargo\blog\static\goroda'
  #f=p+'\\list_strana.js'
  f=p+'\\all'
  mf=read_file(f,'utf-8')

  m=[]
  k={}
  for u in mf:
   v=p+'\\'+u
   print(v)
   t=read_file(v,'utf-8')
   for y in t:
    y=trim(y)
    y=l_simv(y,2)
    if y == 'li': continue
    if y == '`;': continue
    if not (y in m): m.append(y);k[y]=0
    else: k[y]+=1
    #print(m)
    #print(k)
  #
  m=sort_dict(k)
  s=''
  for y in m:
    print(y[1],y[0])
    s+=y[1] + '|'+str(y[0])+'\n'
  #

  write_file(p+'\\f1',s)
# tes5

def is_num(s): #проверка что число
  return filtr_09(s)==s

def in_mas(t,mas): # поиск в строчном массиве 1+2+3
  s=t
  if type(s) == int: s=str(s)
  s=s.replace('+','?')
  return '+'+s+'+' in '+'+mas+'+'
#end

def to_A1(x,y): # 0+ 0+
  return chr(65+x)+str(y+1)

#таблица типа *|*|*\n
def excel_tabl(t,z=1):
    buffer=BytesIO()
    wb=xlsxwriter.Workbook(buffer)
    ws=wb.add_worksheet()
    f=wb.add_format()
    #f. text -поле текст!!! 666
    f.set_bold()
    f.set_shrink()
    f.set_bg_color('red')
    m=split_str(t)
    h=len(m)
    s=m[0].split('|')
    w=len(s)
    if z>h:z=h
    #первый заголовок
 #   ws.set_column('A:'+chr(65+w),'auto')
    for y in range(z):
      s=m[y].split('|')
      for x in range(len(s)):  ws.write(y,x,s[x],f)
    #end-for
    o=wb.add_format()
    o.set_align('left')
    for y in range(z,h):
      s=m[y].split('|')
      for x in range(len(s)):  ws.write(y,x,s[x],o)
    #end-for
    wb.close()

    pdf=buffer.getvalue()
    buffer.close()

    r=HttpResponse(content_type='file/excel')
    r['Content-Disposition']='attachment;filename="1.xlsx"'

    r.write(pdf)
    return r
