# Generated by Django 5.1.5 on 2025-01-17 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='pp_link',
            field=models.URLField(blank=True, default='/static/images/exodia.png'),
        ),
    ]
