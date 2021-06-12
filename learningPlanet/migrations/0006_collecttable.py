# Generated by Django 3.1.2 on 2021-06-08 10:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0017_auto_20210607_1219'),
        ('learningPlanet', '0005_judgetable_isshow'),
    ]

    operations = [
        migrations.CreateModel(
            name='CollectTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blogId', models.ForeignKey(db_column='被收藏的博客的id', on_delete=django.db.models.deletion.CASCADE, to='app.blog')),
                ('collectorId', models.ForeignKey(db_column='收藏人的id', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': '收藏记录表',
            },
        ),
    ]