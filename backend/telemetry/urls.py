from django.urls import path

from telemetry import views

urlpatterns = [
    path("readings/", views.reading_list),
    path("readings/summary/", views.reading_summary),
    path("assets/", views.asset_list),
]   