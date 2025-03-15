# tracker/forms.py
from django import forms
from .models import Transaction

class TransactionForm(forms.ModelForm):
    date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'}),
        input_formats=['%Y-%m-%d']
    )

    class Meta:
        model = Transaction
        fields = ['type', 'amount', 'category', 'description', 'date']
