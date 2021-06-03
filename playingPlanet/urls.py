from django.conf.urls import url

from playingPlanet import views

urlpatterns=[

    url(r'^index',views.index,name='index'), #快乐星球首页

]