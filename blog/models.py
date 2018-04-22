from django.db import models

# Create your models here.
#-------инфо-БД можно внести на др. сервер-----
class bd_Strana(models.Model):  # Страны по англ(рус)
    name = models.CharField(unique=True, max_length=250, verbose_name='Странa')
    kod2 = models.CharField(max_length=2, verbose_name='kod2')
    kod4 = models.CharField(max_length=4, verbose_name='kod4')
    rate=models.SmallIntegerField(default=0,verbose_name='рейтинг')
    def __str__(self): return self.name+'|'+self.kod2
#end

class bd_Gorod(models.Model):
    name=models.CharField(max_length=250,verbose_name='Город')
    kod3=models.CharField(max_length=3,verbose_name='код3')
    strana=models.ForeignKey(bd_Strana,on_delete=models.CASCADE)
    rate=models.SmallIntegerField(default=0,verbose_name='рейтинг')
    def __str__(self): return self.name+'|'+self.strana.kod2
# end
