
from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('stationary', 'Stationary'),
        ('electronics', 'Electronics'),
        ('clothing', 'Clothing'),
        ('books', 'Books'),
        ('home', 'Home & Garden'),
        ('sports', 'Sports'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    stock_available = models.PositiveIntegerField(default=0)
    units_sold = models.PositiveIntegerField(default=0)
    customer_rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    demand_forecast = models.PositiveIntegerField(null=True, blank=True)
    optimized_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0)]
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.name
    
    @property
    def profit_margin(self):
        if self.cost_price > 0:
            return ((self.selling_price - self.cost_price) / self.cost_price) * 100
        return 0
