# Generated by Django 5.0.4 on 2024-05-09 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_order_address_order_mobile_order_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='invoice_date',
            field=models.DateField(auto_now_add=True),
        ),
    ]
