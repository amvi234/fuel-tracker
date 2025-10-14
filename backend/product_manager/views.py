from rest_framework.viewsets import ViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """List all products for the authenticated user"""
        products = Product.objects.filter(created_by=request.user)
        
        # Optional filtering
        category = request.query_params.get('category', None)
        search = request.query_params.get('search', None)
        
        if category and category != 'all':
            products = products.filter(category=category)
            
        if search:
            products = products.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        serializer = ProductSerializer(products, many=True)
        return Response({
            "meta": {"message": "Products fetched successfully."},
            "data": serializer.data,
        })
    
    def create(self, request):
        """Create a new product"""
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response({
                "meta": {"message": "Product created successfully."},
                "data": serializer.data,
            }, status=status.HTTP_201_CREATED)
        return Response({
            "meta": {"message": "Validation failed."},
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """Get a single product"""
        product = get_object_or_404(Product, pk=pk, created_by=request.user)
        serializer = ProductSerializer(product)
        return Response({
            "meta": {"message": "Product fetched successfully."},
            "data": serializer.data,
        })
    
    def update(self, request, pk=None):
        """Update a product"""
        product = get_object_or_404(Product, pk=pk, created_by=request.user)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "meta": {"message": "Product updated successfully."},
                "data": serializer.data,
            })
        return Response({
            "meta": {"message": "Validation failed."},
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete a product"""
        product = get_object_or_404(Product, pk=pk, created_by=request.user)
        product.delete()
        return Response({
            "meta": {"message": "Product deleted successfully."}
        }, status=status.HTTP_204_NO_CONTENT)
