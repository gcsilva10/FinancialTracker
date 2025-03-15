from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from .models import Transaction
from .forms import TransactionForm

class TransactionListAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filtra as transações do usuário logado e ordena pela data (descendente)
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')
        # Prepara os dados para envio como JSON
        data = []
        for t in transactions:
            data.append({
                'id': t.id,
                'type': t.type,
                'amount': str(t.amount),  # Converte para string para evitar problemas de serialização
                'category': t.category,
                'description': t.description,
                'date': t.date.strftime('%d/%m/%Y'),
            })
        return Response(data)
    


class TransactionCreateView(LoginRequiredMixin, CreateView):
    model = Transaction
    form_class = TransactionForm
    template_name = 'tracker/transaction_form.html'
    success_url = reverse_lazy('transaction_list')  # Você pode alterar para '/home' se preferir

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

