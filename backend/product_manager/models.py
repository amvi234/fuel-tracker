from django.contrib.auth.models import User
from django.db import models
import uuid


class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    odometer = models.TextField(blank=True, null=True)
    station_name = models.TextField(max_length=50, default='station 1')
    fuel_brand = models.TextField(max_length=50, default='0')
    fuel_grade = models.TextField(max_length=50, default='other')
    quantity = models.PositiveIntegerField(default=0)
    total_amount = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.name