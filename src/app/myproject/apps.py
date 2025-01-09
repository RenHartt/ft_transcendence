from django.apps import AppConfig

class MyprojectConfig(AppConfig):
    name = 'myproject'

    def ready(self):
        import myproject.signals  # register the signal
