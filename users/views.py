from django.shortcuts import render

# Create your views here.
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    authentication_classes = []  # Opcional: para evitar usar a autenticação por sessão
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    authentication_classes = []  # Para desabilitar a SessionAuthentication e evitar CSRF

    def post(self, request, *args, **kwargs):
        # Log para depuração
        print("Dados recebidos:", request.data)
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()
        print("username:", repr(username), "password:", repr(password))
        
        # Validação dos dados
        if not username or not password:
            return Response({'error': 'Dados inválidos ou incompletos.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Tenta criar o usuário e captura exceções, se houver
        try:
            user = User.objects.create_user(username=username, password=password)
        except Exception as e:
            print("Erro ao criar usuário:", e)
            return Response({'error': 'Erro interno ao criar usuário.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Cria o token para o usuário recém-criado
        token = Token.objects.create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
    
class DeleteAccountAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        # Apaga o usuário autenticado e todos os dados associados (se o model estiver com on_delete=CASCADE)
        user = request.user
        user.delete()
        return Response({"message": "Conta deletada com sucesso."}, status=status.HTTP_200_OK)

