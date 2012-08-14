try:
    from local_settings import LocalConfig
except ImportError:
    LocalConfig = object

class Config(LocalConfig):
    FLATPAGES_EXTENSION = ".md"