# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-08-10 08:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0003_surveyfield_required'),
    ]

    operations = [
        migrations.AddField(
            model_name='surveyfieldset',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
