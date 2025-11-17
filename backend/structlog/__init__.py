import logging
from types import SimpleNamespace
from typing import Any, Callable, Iterable


def get_logger(name: str | None = None):
    return logging.getLogger(name)


def configure(
    processors: Iterable[Callable[..., Any]] | None = None,
    logger_factory: Any | None = None,
    cache_logger_on_first_use: bool | None = None,
):
    # Minimal stub: no-op configuration to satisfy imports in test environment.
    return None


class _ContextVarsModule:
    @staticmethod
    def merge_contextvars(logger: Any, method_name: str, event_dict: dict):
        return event_dict


class _ProcessorsModule:
    CallsiteParameter = SimpleNamespace(PATHNAME="pathname", FUNC_NAME="func_name", LINENO="lineno")

    @staticmethod
    def add_log_level(logger: Any, method_name: str, event_dict: dict):
        return event_dict

    @staticmethod
    def CallsiteParameterAdder(params: list[str]):
        def processor(logger: Any, method_name: str, event_dict: dict):
            return event_dict

        return processor

    @staticmethod
    def StackInfoRenderer():
        def processor(logger: Any, method_name: str, event_dict: dict):
            return event_dict

        return processor


class _StdLibModule:
    class LoggerFactory:
        def __call__(self, *args: Any, **kwargs: Any):
            return logging.getLogger(kwargs.get("name"))


contextvars = _ContextVarsModule()
processors = _ProcessorsModule()
stdlib = _StdLibModule()
