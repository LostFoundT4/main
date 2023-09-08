# Generated by Django 4.2.4 on 2023-09-08 13:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("base_functions", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Location",
            fields=[
                ("locationID", models.AutoField(primary_key=True, serialize=False)),
                ("building", models.CharField(max_length=200)),
                ("room", models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name="Status",
            fields=[
                ("statusID", models.AutoField(primary_key=True, serialize=False)),
                ("type", models.CharField(max_length=200)),
                ("endorsedUserID", models.IntegerField(blank=True, null=True)),
                (
                    "ticket",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="base_functions.ticket",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ReportInfo",
            fields=[
                ("reportInfoID", models.AutoField(primary_key=True, serialize=False)),
                ("description", models.CharField(max_length=300)),
                (
                    "item",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="base_functions.item",
                    ),
                ),
                (
                    "location",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="reporting.location",
                    ),
                ),
                (
                    "ticket",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="base_functions.ticket",
                    ),
                ),
            ],
        ),
    ]
