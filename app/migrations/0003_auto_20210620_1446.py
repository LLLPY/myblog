# Generated by Django 3.1.2 on 2021-06-20 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20210619_1614'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='desc',
            field=models.CharField(blank=True, default='这个人很懒,ta什么都没写~', max_length=300),
        ),
    ]
