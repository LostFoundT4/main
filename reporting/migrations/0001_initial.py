# Generated by Django 4.2.4 on 2023-10-16 13:28

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
                ("status", models.CharField(max_length=200)),
                ("endorsedUserID", models.IntegerField(blank=True, null=True)),
                ("counter", models.IntegerField(blank=True, null=True)),
                ("previous_counter", models.IntegerField(default=0)),
                ("timer", models.DateTimeField(blank=True, null=True)),
                (
                    "ticket",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="base_functions.ticket",
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
                    "status",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="reporting.status",
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
        migrations.CreateModel(
            name="PendingUsers",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                (
                    "status",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="reporting.status",
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
    ]
