# Generated by Django 3.1.2 on 2021-05-29 13:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20210525_2337'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blog',
            name='comments_count',
        ),
    ]
