# Generated by Django 3.1.2 on 2021-06-02 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('learningPlanet', '0004_auto_20210602_1849'),
    ]

    operations = [
        migrations.AddField(
            model_name='judgetable',
            name='isShow',
            field=models.BooleanField(db_column='是否显示', default=True),
        ),
    ]
