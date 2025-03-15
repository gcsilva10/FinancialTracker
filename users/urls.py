from django.urls import path
from .views import LoginView, RegisterView, DeleteAccountAPIView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('delete/', DeleteAccountAPIView.as_view(), name='delete_account'),
]
