# Generated by Django 5.1.4 on 2025-01-14 15:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('p1', models.CharField(max_length=20)),
                ('p2', models.CharField(max_length=20)),
                ('p1Score', models.IntegerField()),
                ('p2Score', models.IntegerField()),
                ('pWin', models.CharField(max_length=10)),
            ],
        ),
    ]
