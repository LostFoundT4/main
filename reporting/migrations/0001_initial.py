# Generated by Django 4.2.4 on 2023-09-08 05:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("base_functions", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
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
                    "ticketID",
                    models.ForeignKey(
                        default=None,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        related_name="tickets",
                        to="base_functions.ticket",
                        verbose_name="ticketID",
                    ),
                ),
                (
                    "userID",
                    models.ForeignKey(
                        default=None,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        related_name="user",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="id",
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
                    "itemID",
                    models.ForeignKey(
                        default=None,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        related_name="item",
                        to="base_functions.item",
                        verbose_name="itemID",
                    ),
                ),
                (
                    "locationID",
                    models.ForeignKey(
                        default=None,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        to="reporting.location",
                        verbose_name="locationID",
                    ),
                ),
                (
                    "ticketID",
                    models.ForeignKey(
                        default=None,
                        on_delete=django.db.models.deletion.SET_DEFAULT,
                        related_name="ticket",
                        to="base_functions.ticket",
                        verbose_name="ticketID",
                    ),
                ),
            ],
        ),
    ]
