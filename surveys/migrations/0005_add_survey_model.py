# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2016-08-11 04:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0004_surveyfieldset_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='Survey',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='SurveyFieldsetOrdering',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sort_order', models.IntegerField(blank=True, db_index=True)),
            ],
        ),
        migrations.AlterModelOptions(
            name='surveyfieldset',
            options={},
        ),
        migrations.RemoveField(
            model_name='surveyfieldset',
            name='sort_order',
        ),
        migrations.AlterField(
            model_name='surveyfieldset',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AddField(
            model_name='userresponse',
            name='survey',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='surveys.Survey'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='userresponse',
            unique_together=set([('fieldset', 'survey', 'user_id')]),
        ),
        migrations.AddField(
            model_name='surveyfieldsetordering',
            name='fieldset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='surveys.SurveyFieldset'),
        ),
        migrations.AddField(
            model_name='surveyfieldsetordering',
            name='survey',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='surveys.Survey'),
        ),
        migrations.AddField(
            model_name='survey',
            name='fieldsets',
            field=models.ManyToManyField(related_name='surveys', through='surveys.SurveyFieldsetOrdering', to='surveys.SurveyFieldset'),
        ),
        migrations.AlterUniqueTogether(
            name='surveyfieldsetordering',
            unique_together=set([('survey', 'fieldset')]),
        ),
    ]