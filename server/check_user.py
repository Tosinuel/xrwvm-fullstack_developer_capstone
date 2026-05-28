#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')
django.setup()

from django.contrib.auth.models import User

users = User.objects.all()
print(f"Total users: {users.count()}")
for u in users:
    print(f"  Username: {u.username}, Email: {u.email}, Superuser: {u.is_superuser}")
