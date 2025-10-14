from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    profit_margin = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'cost_price', 'selling_price', 
            'category', 'stock_available', 'units_sold', 'customer_rating',
            'demand_forecast', 'optimized_price', 'profit_margin', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'profit_margin']

