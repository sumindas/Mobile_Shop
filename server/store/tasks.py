from __future__ import absolute_import,unicode_literals
from celery import shared_task
from django.conf import settings
from.models import Order, OrderItem
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum
from io import StringIO
import csv
import os


@shared_task
def generate_order_report_csv():
    
    today = timezone.now().date()
    month_ago = today - timedelta(days=30)

    # Today's totals
    today_orders = Order.objects.filter(created_at__date=today)
    order_count_today = today_orders.count()
    total_price_today = today_orders.aggregate(Sum('total_price'))['total_price__sum'] or 0
    
     # Monthly totals
    month_orders = Order.objects.filter(created_at__date__range=[month_ago, today])
    order_count_month = month_orders.count()
    total_price_month = month_orders.aggregate(Sum('total_price'))['total_price__sum'] or 0
    top_selling_products_month = OrderItem.objects.filter(order__created_at__date__range=[month_ago, today]).values('product__name').annotate(total_quantity=Sum('quantity')).order_by('-total_quantity')[:5]
    
    csv_data = StringIO()
    csv_writer = csv.writer(csv_data)
    csv_writer.writerow(['Period', 'Order Count', 'Total Price'])
    csv_writer.writerow(['Today', order_count_today, total_price_today])
    csv_writer.writerow(['This Month', order_count_month, total_price_month])
    csv_writer.writerow([])
    csv_writer.writerow(['Top Selling Products This Month'])
    csv_writer.writerow(['Product Title', 'Total Quantity'])
    for product in top_selling_products_month:
        csv_writer.writerow([product['product__name'], product['total_quantity']])
        
    SAVE_DIR = 'C:\\Users\\sunil\\Downloads'
    filename = os.path.join(SAVE_DIR, 'order_report.csv')
    
    try:
        with open(filename, 'w') as file:
            file.write(csv_data.getvalue())
    except PermissionError:
        print(f"Permission denied when trying to write to {filename}. Please check the file's permissions or try running the task with elevated permissions.")
    
