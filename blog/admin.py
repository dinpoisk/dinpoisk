from django.contrib import admin
from django.contrib.auth.admin import UserAdmin 
from django.contrib.auth.models import User
from .models import bd_Strana,bd_Gorod
#from .models import bd_AB_2, bd_Incoterms2010_11, bd_Kategory_Stran_4, bd_Metod_5, bd_Napravlenie_4, bd_SNG_10, bd_Sposob_5, bd_Tip_Postavwika_12

admin.site.register(bd_Strana)

class GorodAdmin(admin.ModelAdmin):
  list_display=('name','kod3','strana','rate')
  list_filter=['strana']
  search_fields=['name','kod3']
admin.site.register(bd_Gorod,GorodAdmin)

