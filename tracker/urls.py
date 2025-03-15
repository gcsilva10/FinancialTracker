from django.urls import path
from .views import TransactionListAPI
from .api_views import TransactionCreateAPIView, TransactionDetailAPIView, TransactionsByMonthAPIView, ExportTransactionsExcelAPIView, ImportTransactionsExcelAPIView

urlpatterns = [
    path('transactions/', TransactionListAPI.as_view(), name='transaction_list_api'),
    path('api/transactions/create/', TransactionCreateAPIView.as_view(), name='api_transaction_create'),
    path('api/transactions/<int:pk>/', TransactionDetailAPIView.as_view(), name='api_transaction_detail'),
    path('api/transactions/by_month/', TransactionsByMonthAPIView.as_view(), name='api_transactions_by_month'),
    path('api/transactions/export/', ExportTransactionsExcelAPIView.as_view(), name='export_transactions_excel'),
    path('api/transactions/import/', ImportTransactionsExcelAPIView.as_view(), name='import_transactions_excel'),
]
