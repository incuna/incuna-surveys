# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-08-18 04:11
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0005_add_survey_model'),
    ]

    operations = [
        migrations.AddField(
            model_name='userresponse',
            name='date_created',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterUniqueTogether(
            name='userresponse',
            unique_together=set([]),
        ),
    ]
