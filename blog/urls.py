from . import views
from django.conf.urls import url, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
  url('^add_bd_from_files/$', views.add_bd_from_files),
  url('^api_7bd/(?P<bd_name>[a-zA-Z_]+)/(?P<filtr0>[A-Za-zА-Яа-яЁё0-9_]+)/(?P<tip0>[a-z]+)/$',views.api_7bd),
  url('^$',views.index,name='index'),
]




