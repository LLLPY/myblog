# Generated by Django 3.1.2 on 2021-06-12 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('learningPlanet', '0006_collecttable'),
    ]

    operations = [
        migrations.AddField(
            model_name='collecttable',
            name='isCollected',
            field=models.BooleanField(db_column='是否被收藏', default=0),
        ),
    ]
